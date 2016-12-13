<?php
class OKCoin_Rpc {
	private $_requestor;
	private $authentication;

	public function __construct($requestor, $authentication) {
		$this -> _requestor = $requestor;
		$this -> _authentication = $authentication;
	}

	public function request($method, $url, $params) {
		// $url = OKCoinBase::API_BASE . $url;
		// Initialize CURL
		$ch = curl_init();
		// $curl = curl_init();
		$curlOpts = array();

		// Headers
		$headers = array('User-Agent: OKCoinPHP/v1');

		//GET USER APIKEY
		$auth = $this -> _authentication -> getData();

		// Get the authentication class and parse its payload into the HTTP header.

		// HTTP method
		$method = strtolower($method);
		if ($method == 'get') {
			curl_setopt($ch, CURLOPT_HTTPGET, 1);
			if ($params != null) {
				$queryString = http_build_query($params);
				$url .= "?" . $queryString;
			}
		} else if ($method == 'post') {
			$authenticationClass = get_class($this -> _authentication);

			switch ($authenticationClass) {

				case 'OKCoin_ApiKeyAuthentication' :
					//OKCoin POST请求加密流程
					ksort($params);
					$sign = "";
					while ($key = key($params)) {
						$sign .= $key . "=" . $params[$key] . "&";
						next($params);
					}
					$sign = $sign . "secret_key=" . $auth -> apiKeySecret;
					$sign = strtoupper(md5($sign));
					$params['sign'] = $sign;
					break;
				default :
					throw new OKCoin_Exception("Invalid authentication mechanism");
					break;
			}

			curl_setopt($ch, CURLOPT_POST, 1);
			// $curlOpts[CURLOPT_POST] = 1;

			// Create query string
			curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));

			// $curlOpts[CURLOPT_POSTFIELDS] = json_encode($params);
			//$params;
		}

		// CURL options
		curl_setopt($ch, CURLOPT_URL, substr(OKCoinBase::WEB_BASE, 0, -1) . $url);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);

		// $curlOpts[CURLOPT_URL] = substr(OKCoinBase::WEB_BASE, 0, -1) . $url;
		// $curlOpts[CURLOPT_HTTPHEADER] = $headers;
		// $curlOpts[CURLOPT_SSL_VERIFYHOST] = FALSE;
		// $curlOpts[CURLOPT_SSL_VERIFYPEER] = FALSE;

		// curl_setopt_array($curl, $curlOpts);

		// Do request
		$response = $this -> _requestor -> doCurlRequest($ch);
		// Decode response
		try {
			$body = $response['body'];
			$json = json_decode($body);
		} catch (Exception $e) {
			echo "Invalid response body" . $response['statusCode'] . $response['body'];
		}
		if ($json === null) {
			echo "Invalid response body" . $response['statusCode'] . $response['body'];
		}
		if (isset($json -> error)) {
			throw new OKCoin_Exception($json -> error, $response['statusCode'], $response['body']);
		} else if (isset($json -> errors)) {
			throw new OKCoin_Exception(implode($json -> errors, ', '), $response['statusCode'], $response['body']);
		}

		return $json;
	}

}
