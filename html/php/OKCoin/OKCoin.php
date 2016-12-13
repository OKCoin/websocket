<?php
require_once (dirname(__FILE__) . '/Base.php');

class OKCoin extends OKCoinBase {

	//构造函数
	function __construct($authentication) {
		parent::__construct($authentication);
	}

	//获取OKCoin行情（盘口数据）
	public function tickerApi($params = null) {
		return $this -> get("/api/v1/ticker.do", $params);
	}
	
	//获取OKCoin市场深度
	public function depthApi($params = null) {
		return $this -> get("/api/v1/depth.do", $params);
	}

	//获取OKCoin历史交易信息
	public function tradesApi($params = null) {
		return $this -> get("/api/v1/trades.do", $params);
	}

	//获取比特币或莱特币的K线数据
	public function klineDataApi($params = null) {
		return $this -> get("/api/v1/kline.do", $params);
	}
	
	//获取用户信息
	public function userinfoApi($params = null) {
		return $this -> post("/api/v1/userinfo.do", $params);
	}

	//下单交易
	public function tradeApi($params = null) {
		return $this -> post("/api/v1/trade.do", $params);
	}

	//批量下单
	public function batchTradeApi($params = null) {
		return $this -> post("/api/v1/batch_trade.do", $params);
	}

	//撤销订单
	public function cancelOrderApi($params = null) {
		return $this -> post("/api/v1/cancel_order.do", $params);
	}

	//获取用户的订单信息
	public function orderInfoApi($params = null) {
		return $this -> post("/api/v1/order_info.do", $params);
	}

	//批量获取用户订单
	public function ordersInfoApi($params = null) {
		return $this -> post("/api/v1/orders_info.do", $params);
	}

	//获取历史订单信息，只返回最近七天的信息
	public function orderHistoryApi($params = null) {
		return $this -> post("/api/v1/order_history.do", $params);
	}

	//提币BTC/LTC
	public function withdrawApi($params = null) {
		return $this -> post("/api/v1/withdraw.do", $params);
	}
	
	//取消提币BTC/LTC
	public function cancelWithdrawApi($params = null) {
		return $this -> post("/api/v1/cancel_withdraw.do", $params);
	}

	//获取OKCoin期货行情（期货盘口）
	public function tickerFutureApi($params = null) {

		return $this -> get("/api/v1/future_ticker.do", $params);
	}

	//获取OKCoin期货深度信息
	public function depthFutureApi($params = null) {
		return $this -> get("/api/v1/future_depth.do", $params);
	}

	//获取OKCoin期货交易记录信息
	public function tradesFutureApi($params = null) {
		return $this -> get("/api/v1/future_trades.do", $params);
	}

	//获取美元人民币汇率
	public function getUSD2CNYRateFutureApi($params = null) {
		return $this -> get("/api/v1/exchange_rate.do", $params);
	}

	//获取交割预估价
	public function getEstimatedPriceFutureApi($params = null) {
	    return $this -> get("/api/v1/future_estimated_price.do", $params);
	}

	//获取OKCoin期货交易历史
	public function futureTradesHistoryFutureApi($params = null) {
		return $this -> get("/api/v1/future_trades_history.do", $params);
	}

	//获取期货合约的K线数据
	public function getFutureIndexFutureApi($params = null) {
		return $this -> get("/api/v1/future_index.do", $params);
	}
	
	//获取OKCoin期货账户信息 （全仓）
	public function userinfoFutureApi($params = null) {
		return $this -> post("/api/v1/future_userinfo.do", $params);
	}

	//获取用户持仓获取OKCoin期货账户信息 （全仓）
	public function positionFutureApi($params = null) {
		return $this -> post("/api/v1/future_position.do", $params);
	}

	//期货下单
	public function tradeFutureApi($params = null) {
		return $this -> post("/api/v1/future_trade.do", $params);
	}

	//期货批量下单
	public function batchTradeFutureApi($params = null) {
		return $this -> post("/api/v1/future_batch_trade.do", $params);
	}

	//获取期货订单信息
	public function getOrderFutureApi($params = null) {
		return $this -> post("/api/v1/future_order_info.do", $params);
	}

	//取消期货订单
	public function cancelFutureApi($params = null) {
		return $this -> post("/api/v1/future_cancel.do", $params);
	}

	//获取逐仓期货账户信息
	public function fixUserinfoFutureApi($params = null) {
		return $this -> post("/api/v1/future_userinfo_4fix.do", $params);
	}

	//逐仓用户持仓查询
	public function singleBondPositionFutureApi($params = null) {
		return $this -> post("/api/v1/future_position_4fix.do", $params);
	}

}
