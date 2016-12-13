/* author sam */
//编程规则
//1. 必须使用缩进
//2. 方法用驼峰格式: setMagaDrag
//3. 变量和属性用小写及下划线: t.catch_mouse
//4. jQuery 和 系统的属性名往往是驼峰格式，很容易和自定义的3区分
//5. core.js(jsob_core.js)中大写字母开头的属性和方法，不会被混淆工具混淆
//6. core.js(jsob_core.js)中小写字母开头的属性和方法，如果是4，混淆工具会忽略，其它的一律会混淆。 (会有些例外，如一些html5的属性还没有被混淆工具收录)

//* 使用空格或缩进和换行使得代码一目了然
//* 使用空行分隔不相关的执行句
//* 避免嵌套过深
//* 避免执行代码过长
//* 使用一次的函数可以取消，减少函数数量

//* 方法/函数分级，名称后加_0, _1, _2, _3 ...
//* 高级别只能调用低级别的函数，包括同级
var strict = 'use';
//num
var PI  = Math.PI;
var PI2 = PI + PI;
//CHARTSET = 'GB';

//框架主体
(function(){
  var b   = navigator.userAgent.toLowerCase();
  var d   = document;
  var nil = 'undefined';

  //SELECT
  window.$ = function(a, b, c){						//goal, nocache, limit node
    if(typeof(a) == nil){
    }
    else if($.isFunction(a)){			//如果传进的是函数
      //$._funlist ? $._funlist.push(a) :	a();
      if($._funlist){
        $._funlist.push(a);
      }
      else{
        a();
      }
    }
    else if(a.context && a.context.EOBJ){//如果传进的就是eobj
      return a;
    }
    else if(a.EOBJ && a.EOBJ.context == a){	//传进node, 曾$过
      return a.EOBJ;
    }
    else if(typeof(a) == 'string'){		//传进字符串、优先缓存
      a = a.replace(/(^\s+)|(\s+$)/g, '');
      //a = a.TRIM();
      /*update by ljj IE8中string不支持trim方法*/
      var op = a.substr(0, 1); 		// operator
      var s = a.substr(1); 			// name without operator
      var nm;
      var r, i, l;
      var node;
      if(op == '#'){					//id
        nm = '_id_' + s;
        if(!$._list[nm]){			//如果之前有缓存，则直接返回缓存
          node = (c || d).getElementById(s);
        }
      }
      else if(op == '.'){			//class
        nm = '_cs_' + s;
        if(!$._list[nm]){
          var q = new RegExp('(^|\\s)' + s + '(\\s|$)');
          r     = d.getElementsByTagName('*');
          for(i = 0, l = r.length; i < l; i++){
            if(q.test(r[i].className)){
              //h.push(r[i]);
              node = r[i];
              break;
            }
          }
        }
      }
      else if(op == '@'){			//radio box
        nm = '_in_' + s;
        if(!$._list[nm]){
          r = d.getElementsByName(s);
          for(i = 0, l = r.length; i < l; i++){
            if(r[i].checked){
              //h.push(r[i]);
              node = r[i];
              break;
            }
          }
        }
      }
      else{							//tag
        nm = '_nm_' + a;
        if(!$._list[nm]){
          r    = d.getElementsByTagName(a);
          node = r[0];
        }
      }

      var eobj = '';
      if(node){
        eobj = new $._init(node);	//node被包装成eobj对象
        if(!b){
          //缺省情况下，包含node的eobj，被缓存在 $._list;
          //对于radio节点，前置符号是@，传入b==1，这样，就不会被缓存，下次读取时仍然能找到被选中的项目
          $._list[nm] = eobj;
        }
      }
      return $._list[nm] || eobj;
    }
    else{								//传进node, 不曾$过
      return new $._init(a);
    }
  };

  //扩展函数
  $.E = function(){	//$.E(obj1, obj2);
    var z = arguments, i;
    for(i in z[1]){
      z[0][i] = z[1][i];
    }
    return z[0];
  };

  //工具库和变量
  $.E($, {
    //变量
    _list   : {}	//query cache，eobj缓存
    ,
    _guid   : 1	//唯一id序号自动添加
    ,
    _funlist: []	//document.body onload 调用之前，缓存命令
    ,
    _img_ok : 1,
    Z       : 100		//max zIndex
    ,
    _js_ok  : 1

    ,
    SPLIT0: '@;'	//返回：切割模块
    ,
    SPLIT1: '@:'	//返回：切割请求和返回值
    ,
    SPLIT2: '@-'	//返回：一级切割模块返回值；发送：连接本模块多参数
    ,
    SPLIT3: '@='	//返回：二级切割模块返回值

    //_init
    ,
    _init: function(a, z){
      if(!a){
        return;
      }
      z         = this;
      z.context = a;
      z.target  = a;
      z.ID_     = z.ID_ || a.id || '_' + ($._guid++);

      if(a.tagName == 'CANVAS'){
        z.CTX = a.getContext('2d');
        $.E(z.CTX, {
          lineCap : 'round',
          lineJoin: 'round'
        });
      }
      a.EOBJ = z;
    },

    //TIME
    MS: function(a){
      var z = (new Date).getTime();	//Date.now(); IE 8 不支持
      if(a == 's'){
        z = $.R(z / 1000);
      }
      return z;
    },

    //NUMBER
    // 0, 0, 1, 1, 1, 0, 1 数组被当作数字了	isArray: function(o){return Object.prototype.toString.call(o) === '[object Array]';}
    VN  : function(a){
      return isNaN(a) || a === '' || a === null;
    },
    R   : Math.round,
    SIZE: function(n){
      if(n < 1024){
        return n;
      }
      var k = $.R(n / 10.24) / 100;
      if(k < 1024){
        return k + ' KB';
      }
      var m = $.R(k / 10.24) / 100;
      if(m < 1024){
        return m + ' MB';
      }
      var g = $.R(m / 10.24) / 100;
      return g + ' GB';
    },

    //STRING
    //起始位置的一个或多个非字符(^\s+)

    F   : function(a, b){ //find b in a
      return ('' + a).indexOf(b) + 1;
    },
    TRIM: function(a){
      return typeof(a) == 'string' ? a.replace(/(^\s+)|(\s+$)/g, '') : a;
    },

    //ARRAY

    isArray: function(o){
      return Object.prototype.toString.call(o) === '[object Array]';
    },

    //OBJECT

    isFunction: function(o){
      return Object.prototype.toString.call(o) === '[object Function]';
    },

    //AJAX

    _ajax          : function(a){
      var _z = false; //xmlHTTP
      if(window.XMLHttpRequest){ // Mozilla, Safari,...
        if(typeof(window.XMLHttpRequest) == 'function' || typeof(window.XMLHttpRequest) == 'object'){
          _z = new XMLHttpRequest();
        }
        else{
          _z = new ActiveXObject("Microsoft.XMLHTTP");
        }
      }
      else if(window.ActiveXObject){ // IE
        try{
          _z = new ActiveXObject('Msxml2.XMLHTTP')
        }
        catch(e){
          try{
            _z = new ActiveXObject('Microsoft.XMLHTTP')
          }
          catch(e){
          }
        }
      }
      this.setRequest = function(url, fun, content, type){
        $.OUT                 = url + '?' + content;
        _z.open(type, type == 'get' ? url + '?' + content : url, a !== 'syc');
        _z.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        _z.onreadystatechange = function(){
          if(_z.readyState == 4 && _z.status == 200){
            fun(_z.responseText)
          }
        };
        _z.send(type == 'get' ? 'NULL' : (content || 'NULL'))
      }
    },
    _setChannel    : function(url, is_script, is_get, fn){	//channel, ? Script : AJAX
      var _pool    = {}, _timer = 0, _xmlhttp = is_script ? '' : new $._ajax(), URLAJAX = url;
      var callAjax = function(){
        var _gets = [];
        $.EACH(_pool, function(a, _key){
          //a = a.replace(/#/g, '~');	//在createBook恢复
          _gets.push(encodeURIComponent(_key) + '=' + encodeURIComponent(a));
        });
        //escape             不编码字符有69个：              * +   - . /         @ _   0-9 a-z A-Z
        //encodeURI          不编码字符有82个：! # $ & ' ( ) * + , - . / : ; = ? @ _ ~ 0-9 a-z A-Z
        //encodeURIComponent 不编码字符有71个：!       ' ( ) *     - .             _ ~ 0-9 a-z A-Z

        _pool         = {};
        var quest_str = _gets.join('&');
        var url       = URLAJAX || $.URLAJAX;

        if(is_script){	//Script
          if(this.ajid){
            this.ajid.R();
          }
          this.ajid = $.C($(d.head), {type: 'text/javascript'}, 'script');
          if(quest_str){
            url += '?' + quest_str + '&FUN=$.FUN';
          }
          this.ajid.S({src: url});
        }
        else{			//Ajax
          if(quest_str.substring(0, 2) == 'JS'){
            _xmlhttp.setRequest(url, function(a){
              $.C($(d.head), {
                text: a
              }, 'script');
              $._js_ok = 1;
              fn && fn();
            }, quest_str, is_get ? 'get' : 'post');	//default post
          }
          else{
            _xmlhttp.setRequest(url, function(a){
              fn ? fn(a) : $.FUN(a);
            }, quest_str, is_get ? 'get' : 'post');	//default post
          }
        }
      };

      //公有
      this.add = function(a, b){
        if(a){
          _pool[a] = b || '';
        }
        clearTimeout(_timer);
        _timer = setTimeout(callAjax, 10)
      };
    },
    _funcs         : {},
    _script_channel: [],
    FN             : function(fns, url, is_script, is_get, n){
      n = n || 0;
      if(!$._script_channel[n] && url){
        $._script_channel[n] = new $._setChannel(url, is_script, is_get);
      }
      if(fns){
        $.E($._funcs, fns);
      }
      return $;
    },
    LOADJS         : function(str_js, fn, url){
      if($.F(str_js, 'http:')){
        $.C($(d.head), {
          src: str_js
        }, 'script');
      }
      else{
        $._js_ok = 0;
        new $._setChannel(url || $.URLSCRIPT, '', '', fn).add('JS', str_js);
      }
    },
    D              : function(data, n){	//default: ajax, post
      //未完成
      n = n || 0;
      var d;
      $._script_channel[n].add();
      for(var i in data){
        if($.isArray(data[i])){
          d = data[i][0];
          $.FN(data[i][1], '', '', '', n);
        }
        else{
          d = data[i];
        }
        $._script_channel[n].add(i, d);
      }
    },
    post           : function(url, data, post_callback, n){
      n                    = n || 1;
      $._script_channel[n] = new $._setChannel(url, 0, 0, post_callback);
      $.D(data, n);
    },
    get            : function(url, data, post_callback, n){
      n                    = n || 1;
      $._script_channel[n] = new $._setChannel(url, 0, 1, post_callback);
      $.D(data, n);
    },
    FUN            : function(a){
      /*
       if(a=='unlogin'){
       alert("You haven't login!");
       window.location = './';
       return ;
       }
       ,SPLIT0: '@;'	//返回：切割模块
       ,SPLIT1: '@:'	//返回：切割请求和返回值
       ,SPLIT2: '@-'	//返回：一级切割模块返回值；发送：连接本模块多参数
       ,SPLIT3: '@='	//返回：二级切割模块返回值
       */
      var y, x, data;
      //a  A=B@:C1@-C2@-C31@=C32@;d=e@:f
      $.EACH(a.split($.SPLIT0), function(b){	//b = ['A=B@:C1@-C2@-C31@=C32', 'd=e@:f']
        y = b.split($.SPLIT1);				//y = ['A=B', 'C1@-C2@-C31@=C32']			|| ['d=e', 'f']
        x = y[0].split('=');				//x = ['A', 'B']							|| ['d', 'e']
        data = (y[1] || '').split($.SPLIT2);	//data = ['C1', 'C2', 'C31@=C32']			|| ['f']
        var detail = [];						//detail = [['C1'], ['C2'], ['C31', 'C32']]	|| [['f']]
        for(var i = 0, l = data.length; i < l; i++){
          detail[i] = data[i].split($.SPLIT3);
        }
        if($._funcs[x[0]]){
          $._funcs[x[0]](data, x[1]);	//(['C1', 'C2', 'C31@=C32'], [['C1'], ['C2'], ['C31', 'C32']])	|| (['f'], [['f']])
        }
        else if($._funcs.ALL){
          $._funcs.ALL(data, x[0], x[1]);		//(['C1', 'C2', 'C31@=C32'], 'A')			|| (['f'], 'd')
        }
      });
    }

    //ANIMATE
    ,
    TWEEN: {
      'EaseOut'  : function(f){
        return function(r, b, d){
          return f(1 - r, b + d, -d);
        }
      },
      'EaseInOut': function(f){
        return function(r, b, d){
          if(r < .5){
            return f(r + r, b, d / 2);
          }
          else{
            return f(2 - r - r, b + d, -d / 2);
          }
        }
      },
      F          : {
        LINEAR: function(r, b, d){
          return b + d * r;
        },
        QUAD  : function(r, b, d){
          return b + d * r * r;
        },
        CUBIC : function(r, b, d){
          return b + d * r * r * r;
        },
        QUART : function(r, b, d){
          return b + d * r * r * r * r;
        },
        QUINT : function(r, b, d){
          return b + d * r * r * r * r * r;
        },
        SINE  : function(r, b, d){
          return b + d * (1 - Math.cos(r * (Math.PI / 2)));
        },
        EXPO  : function(r, b, d){
          return b + d * Math.pow(2, 10 * (r - 1));
        },
        CIRC  : function(r, b, d){
          return b + d * (1 - Math.sqrt(1 - r * r));
        },
        BACK  : function(r, b, d, s){
          s = s || 1.70158;
          return d * r * r * ((s + 1) * r - s) + b;
        },
        BOUNCE: function(r, b, d){
          if(r > 1.75 / 2.75){
            return b + d * (1 - 7.5625 * (r = 1 - r) * r);
          }
          else if(r > 0.75 / 2.75){
            return b + d * (0.25 - 7.5625 * (r = 1.25 / 2.75 - r) * r);
          }
          else if(r > 0.25 / 2.75){
            return b + d * (0.0625 - 7.5625 * (r = 0.5 / 2.75 - r) * r);
          }
          else{
            return b + d * (0.015625 - 7.5625 * (r = 0.125 / 2.75 - r) * r);
          }
        }
      },
      _list      : {},
      arr        : [],
      open       : function(){
        this.is_stop = 0;
      },
      close      : function(){
        this.is_stop = 1;
      },
      DELE       : function(a){
        if(a){
          delete this._list[a];
        }
        else{
          this._list = {};
        }
      },
      speed      : function(a){
        if(a){
          this.duration = a
        }
        else if(!this.duration){
          this.duration = 618;
        }
        return this.duration;
      },
      add        : function(channel, eobj, to, duration, delay, sTween, sEase){
        var TWEEN = $.TWEEN;
        if(TWEEN.is_stop || !channel){
          if(typeof(to) == 'function'){
            to.call(eobj, 1);
          }
          else if(eobj && to && eobj.S){
            eobj.S(to);
          }
          return eobj;
        }
        var z = {
          mylord  : eobj,
          start   : $.MS() + (delay || 0),
          duration: duration || TWEEN.speed()
        };

        if(typeof(to) == 'function'){
          z.fn = to;
        }
        else{
          z.from = {};
          z.dis  = {};
          z.to   = to;
          var f, i;
          for(i in to){
            if(i == 'TX TY'){
              if(!eobj.FATHER.TF_){
                i = i == 'TX' ? 'L' : 'T';
              }
            }
            f = (typeof(eobj[i + '_']) == nil ? (i == 'A' ? 1 : 0) : eobj[i + '_']);
            if(to[i] != f){
              z.from[i] = f;
              if(i != 'BG'){
                z.dis[i] = to[i] - f;
              }
            }
          }
        }
        if(typeof(sTween) == 'function'){
          z.twfunc = sTween;
        }
        else{
          z.twfunc = TWEEN.F[sTween || 'QUAD'];//'QUAD';SINE
          sTween = sTween || 'QUAD';
          sEase  = sEase || 'EaseInOut';
          if(sTween != 'LINEAE' && (sEase == 'EaseInOut' || sEase == 'EaseOut')){
            z.twfunc = TWEEN[sEase](z.twfunc);
          }
        }

        TWEEN._list[channel] = z;
        if(!TWEEN.is_run){
          TWEEN.is_run = 1;
          TWEEN.run();
        }
        return eobj;
      },
      run        : function(){
        if(window.counter){
          counter++;
        }
        var z, y, live = 0, r, now = $.MS(), i, j;
        var x          = $.TWEEN;

        if(!x.is_run){
          return;
        }

        for(i in x._list){
          z = x._list[i];
          if(!z){
            continue;
          }
          r = (now - z.start) / z.duration;
          if(r < 1){
            live++;
            if(r >= 0){
              if(z.fn){
                z.fn.call(z.mylord, r);
              }
              else{
                y = {};
                for(j in z.from){
                  if(j == 'BG'){
                    y[j] = $.MIXCOLOR(r, z.from[j], z.to[j]);
                  }
                  else{
                    y[j] = z.twfunc(r, z.from[j], z.dis[j]);
                  }
                }
                z.mylord.S(y);
              }
            }
          }
          else{
            if(z.fn){
              z.fn.call(z.mylord, r);
            }
            else{
              z.mylord && z.mylord.S && z.mylord.S(z.to);
            }
            //执行THEN的内容
            if(z.mylord.animateArr && z.mylord.animateArr.length){
              var t = z.mylord.animateArr.shift();
              live++;
              z.mylord.animate(t[0], t[1], t[2], t[3], t[4]);
              //新发起的动画仍然沿用i
            }
            else{
              x._list[i] = 0;
            }
          }
        }

        if(live){
          $.REPEATER(x.run);
        }
        else{
          x._list  = {};
          x.is_run = 0;
        }
      }
    }

    //DOM
    ,
    C: function(father, css, tag){	//father, tag 也行
      if(typeof(css) == 'string' && css.length && !tag){
        tag = css;
        css = {};
      }

      if(tag && tag.toLowerCase){
        tag = tag.toLowerCase();
      }
      else{
        tag = tag || 'div';
      }

      var z;
      if(tag == 'password'){
        z              = $(d.createElement('input'));
        z.context.type = 'password';
      }
      else if(tag == 'checkbox'){
        z              = $(d.createElement('input'));
        z.context.type = 'checkbox';
      }
      else if(tag == 'file'){
        z              = $(d.createElement('input'));
        z.context.type = 'file';
      }
      else{
        z = $(typeof(tag) == 'string' ? d.createElement(tag) : tag);	//document.createElement
      }

      if(tag == 'canvas'){
        if(z.context.getContext){
          if(css.W && css.H && !css.width && !css.height){
            z.S({
              width : css.W,
              height: css.H
            });
          }
        }
        else{	//IE6-8
          window.isSupport = 1;
          return;
          //z.CTX = FlashCanvas.initElement(z.context);
        }
      }
      if(father){
        father.A(z);
        /*
         try{
         }catch(e){
         alert('478'+e);
         }
         */
      }

      var default_css = {
        P : 'absolute',
        id: z.ID_ || '_' + ($._guid++),
        L : 0,
        T : 0
      };

      /*
       if(css){
       if(typeof(css.R)=='undefined'){
       default_css.L = 0;
       }
       if(typeof(css.B)=='undefined'){
       default_css.T = 0;
       }
       }
       */
      z.S($.E(default_css, css));

      return z;
    },
    c: function(father, css, tag){
      if(typeof(css) == 'string' && css.length && !tag){
        tag = css;
        css = {};
      }
      return $.C(father, $.E({P: ''}, css), tag);
    }

    //LOOP
    ,
    EACH: function(obj, func){
      var is_array = $.isArray(obj);
      var i, len;
      if(is_array){	//$.EACH([...], func)
        for(i = 0, len = obj.length; i < len; i++){
          func(obj[i], i, is_array);
        }
      }
      else if(!$.VN(obj)){	//$.EACH(3, func)	//SAM 3-16
        for(i = 0; i < obj; i++){
          func(i);
        }
      }
      else{
        for(i in obj){	//$.EACH({...}, func)
          func(obj[i], i, is_array);
        }
      }
    }

    //LOAD image
    //放在 $(function(){...});之前
    ,
    LOADIMG: function(files, url, fn){
      $.loadImageCallBack = fn || $._emptyFunc;
      $._img_ok           = 0;
      var imgs_num        = 0;
      var imgs_obj        = {};
      var file, img;
      url                 = url ? url + '/' : '';
      for(var i = 0, len = files.length; i < len; i++){
        file                             = files[i];
        img                              = new Image();
        img.onload                       = function(){
          imgs_num++;
          if(imgs_num == files.length){
            //alert(4);
            $.loadImageCallBack();
            $._img_ok = 1;
            //alert(5);
          }
        };
        img.src                          = url + file;
        imgs_obj[file.replace('.', '_')] = img;
      }
      //alert('files.length:'+len);
      if(!len){
        //alert(2);
        $.loadImageCallBack();
        $._img_ok = 1;
        //alert(3);
      }
      return imgs_obj;
    }

    //获取坐标
    ,
    POS: function(o){
      /*
       var x = 0,
       y = 0;
       while(o){
       x += o.L_ || 0;
       x += o.TX_ || 0;
       y += o.T_ || 0;
       y += o.TY_ || 0;
       o = o.FATHER;
       }
       return {
       'x': x,
       'y': y
       };
       */
      var x = 0, y = 0;
      o     = o.context || o;
      while(o){
        x += o.offsetLeft || 0;
        y += o.offsetTop || 0;
        x += (o.EOBJ ? o.EOBJ.TX_ : 0) || 0;
        y += (o.EOBJ ? o.EOBJ.TY_ : 0) || 0;
        o = o.offsetParent;
      }
      return {
        'x': x,
        'y': y
      };
    },
    IW : function(){
      return window.innerWidth || document.documentElement.clientWidth || document.body.scrollWidth;
    },
    IH : function(){
      return window.innerHeight || document.documentElement.clientHeight || document.body.scrollHeight;
    }

    //event 提炼共性
    ,
    _bindFunc: function(evt){
      return function(fun, bubble, fn2, fn3){
        this.bind(evt, fun, bubble, fn2, fn3);
        return this;
      }
    }

    //空函数
    ,
    _emptyFunc: function(){
    }

    ,
    B : function(min, max, c){
      return Math.max(min, Math.min(max, c));
    },
    P2: function(a){
      return a * a;
    }

    //10进制-> 16进制
    ,
    HX: function(n){
      var z = $.R(n).toString(16);
      return z.length == 1 ? '0' + z : z
    }
    //myalert(isNaN(null), isNaN(''), isNaN('0ab'), isNaN('ab0'), isNaN({}), isNaN([]), isNaN(NaN)))

    ,
    FX: function(a, b, c){	//Math.ceil, Math.floor
      //FX(3.14159265)==3.14
      //FX(3.14159265, 0)==3
      //FX(3.14159265, 1)==3.1
      //FX(3.14159265, 2)==3.14
      //FX(3.14159265, 3)==3.142

      //Math.round
      //Math.floor(3.14) = 3
      //Math.ceil(3.14) = 4
      var s;
      var f = c || $.R;
      if($.VN(a)){
        s = '';
      }//else if (typeof(b) == 'undefined') s = f(a * 100) / 100;
      else if(b === 0){
        s = f(a);
      }
      else if(b == 1){
        s = f(a * 10) / 10;
      }
      else if(b == 2 || !b){
        s = f(a * 100) / 100;
      }
      else if(b == 3){
        s = f(a * 1000) / 1000;
      }
      else{
        var z = Math.pow(10, b);
        s     = f(a * z) / z
      }
      return s
    }

    //COLOR
    ,
    RGBA: function(a, o){	//16进制颜色返回rgba格式
      /// <summary>返回color字符串</summary>
      var r = '0x' + a.substring(1, 3), g = '0x' + a.substring(3, 5), b = '0x' + a.substring(5, 7);

      return ['rgba(', +r, ',', +g, ',', +b, ',', o, ')'].join('');
    }

    //读取querystring
    ,
    QS: function(key){
      //获取当前文档的URL,为后面分析它做准备
      var sURL = window.document.URL;

      //URL中是否包含查询字符串
      var z = sURL.indexOf('?');
      if(z < 0){
        z = sURL.indexOf('#');
      }
      if(z > 0){
        //分解URL,第二个元素为完整的查询字符串
        //即arrayParams[1]的值为【first=1&second=2】

        var qs = sURL.substring(z + 1);

        //分解查询字符串
        //arrayURLParams[0]的值为【first=1 】
        //arrayURLParams[1]的值为【second=2】
        var arrayURLParams = qs.split('&');

        //遍历分解后的键值对
        for(var i = 0, len = arrayURLParams.length; i < len; i++){
          //分解一个键值对
          var sParam = arrayURLParams[i].split('=');

          if((sParam[0] == key) && (sParam[1] != '')){
            //找到匹配的的键,且值不为空
            return sParam[1]
          }
        }
      }
    }

    //ARRAY
    ,
    IA: function(thing, array, where){
      var Th;
      if(typeof(thing) == 'function'){
        for(var i in array){
          if(thing(array[i])){
            if(where){
              return i
            }
            else{
              return true;
            }
          }
        }
        if(where){
          return -1;
        }
        return false;
      }
      else{
        for(var i in array){
          if(thing === array[i]){
            if(where){
              return i
            }
            else{
              return true
            }
          }
        }
        if(where){
          return -1;
        }
        return false;
      }
    }

    //HASH
    ,
    HASH: function(fun){
      if(('onhashchange' in window) && ((typeof document.documentMode === 'undefined') || document.documentMode == 8 && $.IS.I8)){
        // 浏览器支持onhashchange事件
        window.onhashchange = fun;  // TODO，对应新的hash执行的操作函数
      }
      else{
        // 不支持则用定时器检测的办法
        setInterval(function(){
          fun();
        }, 50);
      }
    }

    //mixColor
    ,
    MIXCOLOR: function(p, c1, c2){
      var r1 = '0x' + c1.substring(1, 3), g1 = '0x' + c1.substring(3, 5), b1 = '0x' + c1.substring(5, 7), r2 = '0x' + c2.substring(1, 3), g2 = '0x' + c2.substring(3, 5), b2 = '0x' + c2.substring(5, 7), r = Math.round(r2 * p + r1 * (1 - p)).toString(16), g = Math.round(g2 * p + g1 * (1 - p)).toString(16), b = Math.round(b2 * p + b1 * (1 - p)).toString(16);

      r = r.length == 1 ? '0' + r : r;
      g = g.length == 1 ? '0' + g : g;
      b = b.length == 1 ? '0' + b : b;
      return '#' + r + g + b;
    }

    //DEBUG
    ,
    MSG: function(){
      var t = new Date();
      if(!this.lms){
        this.lms = $.MS();
      }
      var z = ('' + (t.getMilliseconds() / 1000).toFixed(3)).substring(2) + ' ';

      for(var i = 0, len = arguments.length; i < len; i++){
        z += arguments[i] + '; ';
      }
      top.document.title = z;
      //console.log(z);
    },
    LOG: function(){
      var t = new Date();
      if(!this.lms){
        this.lms = $.MS();
      }
      var z = ('' + (t.getMilliseconds() / 1000).toFixed(3)).substring(2) + ' ';
      //z += ($.MS() - this.lms) +' : ';
      this.lms = $.MS();
      var y;
      for(var i = 0, len = arguments.length; i < len; i++){
        if(typeof arguments[i] != 'undefined'){
          y = arguments[i];
          z += ('' + JSON.stringify(y)).replace(/"/g, '') + '; ';
        }
      }
      top.document.title = z;
      if(window.console && window.console.log){
        console.log(z);
      }
    }
  });

  //选择器对象功能扩展
  $._init.prototype = {
    //获坐标和尺寸
    left        : function(){
      if(typeof(this.L_) == nil){
        this.L_ = this.context.offsetLeft;
      }
      return this.L_;
    },
    top         : function(){
      if(typeof(this.T_) == nil){
        this.T_ = this.context.offsetTop;
      }
      return this.T_;
    },
    width       : function(){
      if(typeof(this.W_) == nil){
        this.W_ = this.context.scrollWidth;
      }
      return this.W_;
    },
    height      : function(){
      if(typeof(this.H_) == nil){
        this.H_ = this.context.scrollHeight;
      }
      return this.H_;
    },
    offsetHeight: function(){
      return this.context.offsetHeight;
    },
    offsetWidth : function(){
      return this.context.offsetWidth;
    },
    offsetLeft  : function(){
      return this.context.offsetLeft;
    },
    offsetTop   : function(){
      return this.context.offsetTop;
    },

    //类操作
    addClass   : function(s){
      if(!this.hasClass(s)){
        this.S({CN: $.TRIM((this.context.className || '') + ' ' + s)});
      }
      return this;
    },
    removeClass: function(s){
      return this.S({CN: $.TRIM(this.context.className.replace(new RegExp('(\\s|^)' + s + '(\\s|$)'), ''))});
    },
    hasClass   : function(s){
      return this.context.className.match(new RegExp('(\\s|^)' + s + '(\\s|$)'));
    },

    //DOM
    A         : function(eobj){
      eobj.FATHER = this;
      if(!this.CHILDREN){
        this.CHILDREN = [];
      }
      this.CHILDREN.push(eobj);
      this.context.appendChild(eobj.context);
      this.I_     = this.context.innerHTML;
      return this;
    },
    R         : function(){
      if(this.FATHER && this.FATHER.CHILDREN){
        var pos = $.IA(this, this.FATHER.CHILDREN, 1);
        if(pos > -1){
          this.FATHER.CHILDREN[pos] = null;
          this.FATHER.CHILDREN.splice(pos, 1);
        }
      }
      //this.FATHER = null;
      this.context.parentNode.removeChild(this.context);
      this.context = null;
    },
    PRES      : function(k, v){
      this.context.style[k]          = v;
      this.context.style[$._pre + k] = v;
      return this;
    },
    S         : function(css, done){
      var t = this, css3D, perspective;
      if(!t.context || !t.context.style){
        return;
      }
      var n = t.context, z = n.style, y, x, i, I;
      for(i in css){
        y = css[i];
        if(i == 'TX' || i == 'TY'){	//不支持3D则 L 代替 TX
          if(t.FATHER && !t.FATHER.TF_){
            i = i == 'TX' ? 'L' : 'T';
          }
        }
        I = i.toUpperCase(); //?
        if(!done && t[I + '_'] === y || typeof(y) == nil){	//过滤重复值和无效值
          continue;
        }
        if(!$.VN(y)){	//是数字
          x = $.R(y) + 'px';	//数字缺省+'px'
        }
        else{
          x = y;
        }

        t[I + '_'] = y;	//记住这个值

        //使用缩写的好处：
        //简短、好写
        //自动添加px
        //避免全称不能被混淆的缺点
        //缓存属性值，避免重复设置
        //与animate保持一致

        //缺点：习惯

        //如何让简写和全称保持一致？

        if(i == 'T'){
          z.top = x;
        }
        else if(i == 'L'){
          z.left = x;
        }
        else if(i == 'W'){
          z.width = x;
        }
        else if(i == 'H'){
          z.height = x;
        }
        else if(i == 'R'){
          z.right = x;
        }
        else if(i == 'B'){
          z.bottom = x;
        }
        else if(i == 'ML'){
          z.marginLeft = x;
        }
        else if(i == 'MT'){
          z.marginTop = x;
        }
        else if(i == 'MR'){
          z.marginRight = x;
        }
        else if(i == 'MB'){
          z.marginBottom = x;
        }
        else if(i == 'F'){
          z.fontSize = x;
        }
        else if(i == 'LH'){
          z.lineHeight = x;
        }
        else if(i == 'A'){
          if($.IS.I678){
            if($.IS.I8){
              z.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + $.R(y * 100) + ')';
            }
            else{
              z.filter = 'alpha(opacity=' + $.R(y * 100) + ')';
            }
          }
          else{
            z.opacity = y;
          }
        }
        else if(i == 'M'){
          z.margin = y;
        }
        else if(i == 'C'){
          z.color = y;
        }
        else if(i == 'D'){
          z.display = y;
        }
        else if(i == 'O'){
          z.overflow = y;
        }
        else if(i == 'P'){
          z.position = y == 'r' ? 'relative' : y;
        }
        else if(i == 'Z'){
          z.zIndex = y;
        }
        else if(i == 'CS'){
          z.cursor = y;
        }
        else if(i == 'TA'){
          z.textAlign = y;
        }

        //font
        else if(i == 'FF'){
          z.fontFamily = y;
        }
        else if(i == 'FW'){
          z.fontWeight = y;
        }

        //background
        else if(i == 'BG'){
          z.background = y;
        }
        else if(i == 'BP'){
          z.backgroundPosition = y;
        }

        //padding
        else if(i == 'PD'){
          z.padding = y;
        }

        //border
        else if(i == 'BD'){
          z.border = y;
        }
        else if(i == 'BDB'){
          z.borderBottom = y;
        }
        else if(i == 'BR'){
          z.borderRadius = x;
        }
        else if(i == 'BS'){
          t.PRES('BoxShadow', y);
        }

        //css3D
        else if($.F('TX TY TZ RX RY RZ SC', i + ' ')){
          css3D = 1;
        }
        else if(i == 'DL' || i == 'EASE'){
          //值已经在EASE_中保存了
        }
        else if(i == 'TS'){
          t.PRES('Transition', [
            'all', y / 1000 + 's', t.EASE_ || 'ease-in-out', (t.DL_ || 0) / 1000 + 's'
          ].join(' '));
        }
        else if(i == 'TO'){
          t.PRES('TransformOrigin', y);
        }
        else if(i == 'TF'){
          t.PRES('TransformStyle', y);
        }
        else if(i == 'PP'){
          t.PRES('Perspective', x);
        }
        else if(i == 'PO'){
          t.PRES('PerspectiveOrigin', y);
        }
        else if(i == 'PW' || i == 'PH'){
          perspective = 1;
        }

        //attribute
        else if(i == 'I'){
          if(t.CHILDREN){
            for(var j = t.CHILDREN.length - 1; j >= 0; j--){
              t.CHILDREN[j].R();
            }
            delete t.CHILDREN;
          }
          n.innerHTML = window.traditionalized ? traditionalized(y) : y;
        }
        //else if(i == 'V'  : n.value = y;} //给显隐用了
        else if(i == 'CN'){
          n.className = y;
        }
        //保存对象属性
        else if(i == 'G'){
        }
        else if(i.substring(0, 4) == 'data'){
          n[i] = y;
        }
        else if($.F('id src href name text placeholder type title value width height ', i + ' ')){
          n[i] = y;
        }
        else if($.F('border target cellSpacing cellPadding selected resize ', i + ' ')){
          n[i] = y;
        }


        //显隐
        else if(i == 'V'){
          y ? t.V() : t.H();
        }

        //缺省是style属性
        else{
          z[i] = y;
        }

      }
      if(css3D && t.FATHER && t.FATHER.TF_){	//父节点必须是SET3D过的，特征就是TF_
        t.PRES('Transform', ([
          'rotateX(',
          t.RX_ || 0,
          'deg) ',
          'rotateY(',
          t.RY_ || 0,
          'deg) ',
          'rotateZ(',
          t.RZ_ || 0,
          'deg) ',
          'translate3d(',
          t.TX_ || 0,
          'px, ',
          t.TY_ || 0,
          'px, ',
          t.TZ_ || 0,
          'px) ',
          'scale(',
          t.SC_ || 1,
          ')'
        ]).join(''));
      }
      if(perspective && t.TF_){	//自己必须是SET3D过的
        t.S({
          PO: ($.VN(t.PW_) ? 50 : t.PW_) + '% ' + ($.VN(t.PH_) ? 50 : t.PH_) + '%'
        });
      }
      return t;
    },
    SET3D     : function(a, b){
      return (!$.IS.I || $.IS.I1) ? this.S({
        TF: 'preserve-3d',
        PP: a	//Perspective
        ,
        PO: b	//PerspectiveOrigin
      }) : this;
    },
    ATT       : function(obj){
      if(typeof obj == 'string'){
        return this.context.getAttribute(a);
      }
      for(var i in obj){
        this.context[i] = obj[i]
      }
      return this;
    },
    ATTR      : function(a){
      return this.ATT(a);
    },
    removeAttr: function(a){
      this.context.removeAttribute(a);
      return this;
    },
    I         : function(a){
      if(this.CHILDREN){
        for(var i = this.CHILDREN.length - 1; i >= 0; i--){
          this.CHILDREN[i].R();
        }
        this.CHILDREN = null;
      }
      return this.S({I: a || (a === 0 ? '0' : '')});
    },
    H         : function(){
      return this.S({D: 'none'});
    },
    V         : function(){
      return this.S({D: ''});
    }		//写成 d: '' 大多数情况下可行
    ,
    VV        : function(){
      return this.S({D: 'block'});
    }	//写成 d: '' 大多数情况下可行
    ,
    isH       : function(){
      return this.D_ == 'none'
    },
    toggle    : function(){
      return this.isH() ? this.V() : this.H();
    },
    css       : function(css){
      return this.S(css)
    },
    val       : function(a){
      if(typeof(a) == nil){
        return $.TRIM(this.context.value || this.context.innerHTML);
      }
      else{
        this.context.value = a;
        return this;
      }
    },

    //上级
    father  : function(){
      return this.FATHER || $(this.parentNode);
    },

    //平级, this.father 指向上一级
    next    : function(a){
      var node = this.context;
      while(node = a ? node.previousSibling : node.nextSibling){
        if(node && node.nodeName != '#text'){
          return $(node);
        }
      }
    },
    previous: function(){
      return this.next(1)
    }


    //http://select.yeeyan.org/view/213582/202991
    //触摸事件
    //
    //三种在规范中列出并获得跨移动设备广泛实现的基本触摸事件：
    //
    //1. touchstart：手指放在一个DOM元素上。
    //2. touchmove：手指拖曳一个DOM元素。
    //3. touchend：手指从一个DOM元素上移开。
    //
    //每个触摸事件都包括了三个触摸列表：
    //
    //1. touches：当前位于屏幕上的所有手指的一个列表。
    //2. targetTouches：位于当前DOM元素上的手指的一个列表。
    //3. changedTouches：涉及当前事件的手指的一个列表。例如，在一个touchend事件中，这就会是移开的手指。
    //
    //这些列表由包含了触摸信息的对象组成：
    //
    //1. identifier：一个数值，唯一标识触摸会话（touch session）中的当前手指。
    //2. target：DOM元素，是动作所针对的目标。
    //3. 客户/页面/屏幕坐标：动作在屏幕上发生的位置。
    //4. 半径坐标和 rotationAngle：画出大约相当于手指形状的椭圆形。

    //事件绑定
    ,
    bind  : function(type, fn, bubble, mouseover){
      var tp = type;
      if($.IS.T){
        var mapping = {
          mousedown: 'touchstart',
          mouseup  : 'touchend',
          mousemove: 'touchmove'
        };
        tp          = mapping[type] || tp;
      }
      var t    = this                    //eobj
        , _ctx = t.context, type_ = type.toUpperCase()	//t.MOUSEDOWN 存放着down事件
        , fun;

      if(t[type_] != fn){	//如果反复绑定同一个监听事件，简化处理，否则，需要以下处理步骤
        fun = function(e){
          e = e || window.event;
          if(e){
            if($.F(type, 'key')){
              t.KEYCODE = e.KEYCODE || e.keyCode || e.which
              t.ctrlKey = e.ctrlKey;
              t.altKey  = e.altKey;
            }
            else{
              t.KEYCODE = 0;
              t.ctrlKey = 0;
              t.altKey  = 0;
            }

            //shift:16, ctrl:17, alt:18
            if(!bubble || t.KEYCODE == 16 || t.KEYCODE == 17 || t.KEYCODE == 18 || t.ctrlKey || t.altKey){
              if(e.stopPropagation){
                e.stopPropagation();
                e.preventDefault();
              }
              else{		//IE
                e.cancelBubble = true;
                e.returnValue  = false;
              }
            }
            var _e = (e.changedTouches && e.changedTouches[0]) || (e.touches && e.touches[0]) || e;
            t.T    = $.MS();	//e.timeStamp

            if(typeof(_e.clientX) != 'undefined'){
              t.X = _e.clientX + (window.scrollX || document.body.scrollLeft || document.documentElement.scrollLeft);
              t.Y = _e.clientY + (window.scrollY || document.body.scrollTop || document.documentElement.scrollTop );
            }

            t.type = tp;
            try{
              t.target_eobj = e.target_eobj || (e.target || e.srcElement).EOBJ;
            }
            catch(e){
              $.MSG('error');
            }
            t.event = e;

            //以下写法无法在fun(){this}中的this里抓到event主体，抓到的是window
            //fn($.E(this.EOBJ, {X:e.clientX, Y:e.clientY, clientX: e.clientX, clientY:e.clientY}));
            //X是为了将来混淆方便，clientX是无法混淆的

            //对事件预处理
            if(type == 'mousedown'){
              if(t.IS_DOWN){
                //第二个手指按下

              }
              else{
                //if(t.IS_DOWN && t.MOUSEUP){
                //  return;
                //}
                t.IS_DOWN   = 1;
                t.down_time = t.T;
                if(t.MOUSEMOVE){
                  t.o_l = t.L_;
                  t.o_t = t.T_;
                  t.L_X = t.DOWN_X = t.X;
                  t.L_Y = t.DOWN_Y = t.Y;

                  //有了 catch_mouse，在手机上会感觉迟钝
                  //而鼠标太过灵活，动作幅度大，需要扩大范围跟踪
                  if(!$.IS.T && t.enlarge_area && !t.catch_mouse){
                    var w         = t.enlarge_area;
                    t.catch_mouse = $.C(t, {
                      L: -w,
                      T: -w,
                      W: w + w + (t.W_ || 0),
                      H: w + w + (t.H_ || 0)
                    });
                    if(1 || $.IS.I678){
                      t.catch_mouse.S({
                        A : 0.01,
                        BG: '#ffffff'
                      });
                    }
                  }
                  t.catch_mouse && t.catch_mouse.V();
                }
                // 这里 fn2 似乎不需要
                // fn2 && fn2.call(_ctx, t);
              }

            }
            else if(type == 'mousemove'){
              //mousedown定义过，IS_DOWN开关才有效。
              //触屏只定义mousemove，不定义mousedown和mouseup
              //掠过的行为，通过t.IS_DOWN来判断
              t.MX = t.X - t.DOWN_X;
              t.MY = t.Y - t.DOWN_Y;
              if(t.MOUSEDOWN && !t.IS_DOWN){
                mouseover && mouseover.call(_ctx, t);
                return;
              }
            }
            else if(type == 'mouseup'){
              t.catch_mouse && t.catch_mouse.H();
              //如果多个手指一起up，这里只响应一次
              if(!t.IS_DOWN){
                return;
              }
              t.IS_DOWN = 0;
            }
          }

          fn.call(_ctx, t);

          if(type == 'mousemove'){
            t.L_X = t.X;
            t.L_Y = t.Y;
          }
          return t;
        };

        t[type_] = fun;
      }

      if(_ctx.addEventListener){
        _ctx.addEventListener(tp, t[type_], false);
      }
      else if(_ctx.attachEvent){
        _ctx.attachEvent('on' + tp, t[type_]);
      }
      else{
        _ctx['on' + tp] = t[type_];
      }

      if(type == 'click' || type == 'mousedown'){
        if(!t.CS_){
          t.S({CS: 'pointer'});
        }
      }

      return this;
    },
    unbind: function(type, fn){
      if(this.context.removeEventListener){
        this.context.removeEventListener(type, fn);
      }
      else{
        this.context.detachEvent('on' + type, fn);
      }
      return this;
    },

    //常用事件
    click    : $._bindFunc('click'),
    change   : $._bindFunc('change'),
    load     : $._bindFunc('load'),
    down     : $._bindFunc('mousedown'),
    mousedown: $._bindFunc('mousedown'),
    mouseup  : $._bindFunc('mouseup'),
    mousemove: $._bindFunc('mousemove'),
    mouseover: $._bindFunc('mouseover'),
    mouseout : $._bindFunc('mouseout'),
    focus    : $._bindFunc('focus'),
    blur     : $._bindFunc('blur'),
    keydown  : $._bindFunc('keydown'),
    keyup    : $._bindFunc('keyup'),
    scroll   : $._bindFunc('scroll'),
    focus2   : function(){
      this.context.focus();
      return this;
    },
    WHEEL    : function(fns){
      var t    = this;
      var _ctx = t.context;
      var f    = function(e){
        e = e || window.event;
        if(e.wheelDelta){
          t.WHL = e.wheelDelta / 120;
        }
        else if(e.detail){
          t.WHL = -e.detail / 3;
        }
        t.X = e.clientX;
        t.Y = e.clientY;
        fns.call(_ctx, t);
      };
      if($.IS.FF){
        this.context.addEventListener('DOMMouseScroll', f, false);
      }
      else if(!$.IS.T){
        this.context.onmousewheel = f;
      }
      t.hasWHEEL = 1;
      return this;
    },

    //拖动
    MAGIC: function(op){
      op = op || {};		//这样，访问op的属性不会出错了
      var z = this;
      var G = z.goal = op.goal || z;

      if(op.x && G.FATHER && G.FATHER.W_){
        G.dif_w = Math.min(0, G.FATHER.W_ - G.W_);
      }
      else{
        G.dif_w = 0;
      }

      if(op.y && G.FATHER && G.FATHER.H_){
        G.dif_h = Math.min(0, G.FATHER.H_ - G.H_);
      }
      else{
        G.dif_h = 0;
      }

      z.enlarge_area = 100;

      z.tapPress = op.tap || op.doubletap || op.press;

      z.mousedown(function(z){
        var G = z.goal;
        if(G.Z_ != $.Z && !op.zkeep){
          G.S({Z: $.Z++});
        }
        G.S({TS: 0});

        var e = z.event;
        if(e.touches && e.touches.length > 1){
          if(op.pinchmove && !z.is_gesture){
            z.is_gesture       = 1;
            var p1             = e.touches[0];
            var p2             = e.touches[1];
            var dx             = p2.pageX - p1.pageX;
            var dy             = p2.pageY - p1.pageY;
            z.finger_distence0 = Math.sqrt($.P2(dx) + $.P2(dy));
            z.center0          = [(p2.pageX + p1.pageX ) / 2, (p2.pageY + p1.pageY ) / 2];
            z.angle0           = Math.atan2(dx, dy);

            op.pinchstart && op.pinchstart(z);
          }
        }
        else{
          op.mousedown && op.mousedown(z);

          if(z.last_down && z.down_time - z.last_down.down_time < 300){
            clearTimeout(z.timer_up);
          }

          if(op.press){
            z.timer_press = setTimeout(function(){
              z.IS_DOWN = 0;
              op.press(z);
            }, 250);
          }
        }
      });

      z.mousemove(function(z){
        var e = z.event;

        if(e.touches && e.touches.length > 1){
          if(z.timer_press){
            clearTimeout(z.timer_press);
            delete z.timer_press;
          }
          if(op.pinchmove){
            var p1            = e.touches[0];
            var p2            = e.touches[1];
            var dx            = p2.pageX - p1.pageX;
            var dy            = p2.pageY - p1.pageY;
            z.finger_distence = Math.sqrt($.P2(dx) + $.P2(dy));
            z.center          = [(p2.pageX + p1.pageX ) / 2, (p2.pageY + p1.pageY ) / 2];
            z.angle           = Math.atan2(dx, dy);
            z.scale           = $.FX(z.finger_distence / z.finger_distence0, 4);

            z.confirm = 'pinchmove';
            op.pinchmove(z);
          }
        }
        else{
          if(!op.x){ //左右移动
            z.MX  = 0;
            z.L_X = z.X;
          }

          if(!op.y){ //上下移动
            z.MY  = 0;
            z.L_Y = z.Y;
          }

          var mx = Math.abs(z.MX);
          var my = Math.abs(z.MY);
          var dt = z.T - z.down_time;

          if(op.swipe){
            if(mx > 5 && mx / dt > .65){
              z.confirm = 'swipe-x-' + (z.MX > 0 ? 'r' : 'l');
              console.log('swipe');
              op.swipe(z);
              z.MOUSEUP(z);
              return;
            }
            else if(my > 5 && my / dt > .65){
              z.confirm = 'swipe-y-' + (z.MY > 0 ? 'd' : 'u');
              console.log('swipe');
              op.swipe(z);
              z.MOUSEUP(z);
              return;
            }
            console.log(mx, my, dt);

          }

          if(z.timer_press && (mx>5 || my>5)){
            clearTimeout(z.timer_press);
            delete z.timer_press;
          }

          op.mousemove && op.mousemove(z);
        }

      }, 0, $.IS.T && op.mouseover);

      z.mouseup(function(z){
        if(z.is_gesture){
          delete z.is_gesture;
          op.pinchend && op.pinchend(z);
        }

        if(z.timer_press){
          clearTimeout(z.timer_press);
          delete z.timer_press;
        }

        if(z.tapPress && !z.confirm){
          //未判明发生特殊事件，如 pan, swipe, pinch
          if(z.T - z.down_time < 250 && Math.abs(z.X - z.DOWN_X) < 3 && Math.abs(z.Y - z.DOWN_Y) < 3){
            // tap -- hammer.js
            // interval	300	Maximum time in ms between multiple taps.
            // time	250	Maximum press time in ms.
            // threshold	2	While doing a tap some small movement is allowed.
            // posThreshold	10	The maximum position difference between multiple taps.
            if(z.last_down && z.T - z.last_down.down_time < 400 && Math.abs(z.X - z.last_down.DOWN_X) < 11 && Math.abs(z.Y - z.last_down.DOWN_Y) < 11){
              //console.log('double', z.T - z.last_down.down_time, z.last_down.T - z.last_down.down_time, z.down_time - z.last_down.T);
              delete z.last_down;
              op.doubletap && op.doubletap(z);
            }
            else{
              z.timer_up  = setTimeout(function(){
                delete z.last_down;
                op.tap && op.tap(z);
              }, 300 - (z.T - z.down_time));
              z.last_down = {
                down_time: z.down_time,
                T        : z.T,
                DOWN_X   : z.DOWN_X,
                DOWN_Y   : z.DOWN_Y
              };
            }
          }
          else{
            op.mouseup && op.mouseup(z);
          }
        }
        delete z.confirm;
      });

      return this;
    },
    DRAG : function(op){
      op = op || {};		//这样，访问option的属性不会出错了
      if(!('x' in op)){
        op.x = [];
      }
      if(!('y' in op)){
        op.y = [];
      }
      var z = this;
      var G = z.goal = op.goal || z;

      if(op.x && G.FATHER && G.FATHER.W_){
        G.dif_w = Math.min(0, G.FATHER.W_ - G.W_);
      }
      else{
        G.dif_w = 0;
      }

      if(op.y && G.FATHER && G.FATHER.H_){
        G.dif_h = Math.min(0, G.FATHER.H_ - G.H_);
      }
      else{
        G.dif_h = 0;
      }

      z.enlarge_area = 100;

      z.mousedown(function(z){
        var G = z.goal;
        if(G.Z_ != $.Z && !op.zkeep){
          G.S({Z: $.Z++});
        }
        G.S({TS: 0});

        op.mousedown && op.mousedown(z);
      });

      z.mousemove(function(z){
        if(1 || z.is_move){
          var p1, p2, x, y, css = {};
          var e                 = z.event;

          x = op.x;
          y = op.y;

          if(x){
            G.speed_x = z.X - (z.L_X || 0);
            css.L     = (G.L_ || 0) + G.speed_x;
          }
          else{
            G.speed_x = 0;
          }

          if(y){
            G.speed_y = z.Y - (z.L_Y || 0);
            css.T     = (G.T_ || 0) + G.speed_y;
          }
          else{
            G.speed_y = 0;
          }
          G.S(css);
        }

        op.mousemove && op.mousemove(z);
        return;

        z.is_move = 1;
        z.timer && clearTimeout(z.timer);
        z.timer   = setTimeout(function(){
          z.is_move      = 0;
          z.goal.speed_x = 0;
          z.goal.speed_y = 0;
        }, 200)
      }, 0, op.mouseover, op.mousemove);

      z.mouseup(function(z){
        op.mouseup && op.mouseup(z);
      });

      return this;
    },
    DRAGY: function(){
      var z         = this;
      z.mouseup(function(z){
        $.TWEEN.open();
        var css    = {};
        var dura_y = 0;
        if(z.speed_y){
          css.T  = $.B(z.dif_h, 0, z.T_ + z.speed_y * 10);
          dura_y = Math.abs((css.T - z.T_) / z.speed_y) * 30;
          if(dura_y){
            z.animate(css, dura_y, 0, 'QUAD', 'EaseOut');
          }
        }
      }, 1).mousemove(function(z){
        if(!z.is_move){
          z.is_move = 1;
          z.L_Y     = z.Y;
          return;
        }
        var t     = $.B(z.dif_h, 0, z.T_ + z.Y - z.L_Y);
        z.speed_y = t - z.T_;
        z.S({T: t});

        z.timer && clearTimeout(z.timer);
        z.timer   = setTimeout(function(){
          z.is_move = 0;
          z.speed_y = 0;
        }, 200)

      });
      this.hasDRAGY = 1;
      return this;
    },

    //动画
    SetTweenId : function(s){
      this.TID = s;
      return this;
    },
    animate    : function(to, duration, delay, sTween, sEase, TID){
      return $.TWEEN.add(TID || this.TID || this.ID_, this, to, duration, delay, sTween, sEase);
    },
    animateStop: function(){
      if($.TWEEN._list[this.ID_]){
        $.TWEEN._list[this.ID_] = null;
      }
      return this;
    },
    THEN       : function(to, duration, delay, sTween, sEase){
      if(!this.animateArr){
        this.animateArr = [];
      }
      this.animateArr.push([to, duration, delay, sTween, sEase]);
      return this;
    },

    //hover切换图片
    hover: function(out, over){
      this.mouseout(typeof(out) == 'function' ? out : function(z){
        if(typeof(out) == 'string'){
          z.S({src: out})
        }
        else if(typeof(out) == 'object'){
          z.S(out)
        }
        return z
      }).mouseover(typeof(over) == 'function' ? over : function(z){
        if(typeof(over) == 'string'){
          z.S({src: over})
        }
        else if(typeof(over) == 'object'){
          z.S(over)
        }
        return z
      });
      this.MOUSEOUT();
      return this;
    },
    HOVER: function(over, out){
      this.mouseout(out).mouseover(over);
      return this.MOUSEOUT();
    }

    //禁止选中
    ,
    UNSELECT: function(){
      return this.PRES('UserSelect', 'none').bind('selectstart', function(){
        return false
      });
    }
  };

  //参数1 browser，需要用到工具库
  $.IS = {
    //判断
    I : $.F(b, 'msie'),
    I8: $.F(b, 'msie 8'),
    I9: $.F(b, 'msie 9'),
    I1: $.F(b, 'msie 1')	//10+
    ,
    O : $.F(b, 'opera'),
    FF: $.F(b, 'firefox'),
    SF: $.F(b, 'safari'),
    A : $.F(b, 'android'),
    MH: $.F(b, 'iphone'),
    MP: $.F(b, 'ipad'),
    T : 'createTouch' in document || 'ontouchstart' in window
    //Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B206 Safari/7534.48.3
  };

  //参数2 browser，需要用到参数1和工具库
  $.IS.I678 = $.F(b, 'msie') && !$.IS.I9 && !$.IS.I1;

  //判断
  $._pre = $.IS.FF ? 'Moz' : ($.IS['O'] ? 'O' : ($.IS.I ? 'Ms' : 'Webkit'
    )
  );

  //方法REPEATER，需要用到参数2
  $.E($, {
    REPEATER: (function(){
      //var z = $._pre.toLowerCase() + 'RequestAnimationFrame';
      var z = 'requestAnimationFrame';
      return window[z] ? function(fn){
        window[z](fn)
      } : function(fn){
        setTimeout(fn, 1000 / 60)
      }
    })()
  });

  $(function(){
    $.body = $(d.body).S({margin: 0});
  });

  //文件加载后，运行$(function)过的程序
  $.timer = function(){
    if(d.body && $._funlist && $._img_ok){
      d.body.onload && $._funlist.push(d.body.onload);
      for(var i = 0; i < $._funlist.length; i++){	//当$._funlist[i](window)运行时，$._funlist数组还可能添加
        if($.isFunction($._funlist[i])){
          $._funlist[i](window);
        }
      }
      clearInterval($.timer);
      delete $._funlist;
      delete $.timer;
    }
    else{
      setTimeout($.timer, 100);
    }
  };
  setTimeout($.timer, 100);
})();

//windows document 级操作
$(function(){	//禁止选中
  var d           = document, w = window;
  d.onselectstart = function(){
    //return false
  };
  d.ondragstart   = function(){
    return false
  };
  d.onstart       = function(){
    return false
  };
  d.onselect      = function(){
    //w.getSelection ? (w.getSelection() && w.getSelection().removeAllRanges()) : d.selection.empty();
  };

  d.orientationchange                        = function(e){
    e.preventDefault();
    return false;
  };
  d.documentElement.style.WebkitTouchCallout = 'none'; 	//禁止弹出菜单
  d.documentElement.style.MozTouchCallout = 'none';

  //d.documentElement.style.WebkitUserSelect = 'none';		//禁止选中
  //d.documentElement.style.MozUserSelect = 'none';
});

function setMagaDrag(a, b){
  a.FATHER.S({O: 'hidden'});
  if(!b){
    a.S({H: ''});
    a.S({H: a.context.scrollHeight});
  }
  a.dif_h = Math.min(0, a.FATHER.H_ - 5 - a.H_);
  if($.IS.T){
    a.hasDRAGY || a.DRAGY();
  }
  else{
    a.hasWHEEL || a.WHEEL(function(a){
      a.S({T: $.B(a.dif_h, 0, a.T_ + 50 * a.WHL)});
    })
  }
}