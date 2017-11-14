(function(e){var t=e.zepto,n=t.qsa,i=t.matches;function r(t){t=e(t);return!!(t.width()||t.height())&&t.css("display")!=="none"}var s=e.expr[":"]={visible:function(){if(r(this))return this},hidden:function(){if(!r(this))return this},selected:function(){if(this.selected)return this},checked:function(){if(this.checked)return this},parent:function(){return this.parentNode},first:function(e){if(e===0)return this},last:function(e,t){if(e===t.length-1)return this},eq:function(e,t,n){if(e===n)return this},contains:function(t,n,i){if(e(this).text().indexOf(i)>-1)return this},has:function(e,n,i){if(t.qsa(this,i).length)return this}};var a=new RegExp("(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*"),f=/^\s*>/,o="Zepto"+ +new Date;function u(e,t){e=e.replace(/=#\]/g,'="#"]');var n,i,r=a.exec(e);if(r&&r[2]in s){n=s[r[2]],i=r[3];e=r[1];if(i){var f=Number(i);if(isNaN(f))i=i.replace(/^["']|["']$/g,"");else i=f}}return t(e,n,i)}t.qsa=function(i,r){return u(r,function(s,a,u){try{var c;if(!s&&a)s="*";else if(f.test(s))c=e(i).addClass(o),s="."+o+" "+s;var l=n(i,s)}catch(h){console.error("error performing selector: %o",r);throw h}finally{if(c)c.removeClass(o)}return!a?l:t.uniq(e.map(l,function(e,t){return a.call(e,t,l,u)}))})};t.matches=function(e,t){return u(t,function(t,n,r){return(!t||i(e,t))&&(!n||n.call(e,null,r)===e)})}})(Zepto);(function(e,t){var n=[];var i=function(t,i){var r,s;var a;e.each(n,function(n,f){r=f.el;if(r===i){s=f.obj;e.each(s,function(e,n){if(n.name===t){a=n.value;return false}});return false}});return a};var r=function(t,i){var r=false;var s=this;e.each(n,function(n,a){if(a.el===s){var f=a.obj;var o=false;e.each(f,function(e,n){if(n.name===t){n.value=i;o=true;return false}});if(!o){a.obj.push({name:t,value:i})}r=true;return false}});if(!r){n.push({el:s,obj:[{name:t,value:i}]})}};var s=function(t){var i=this;e.each(n,function(n,r){if(r.el===i){var s=r.obj;e.each(s,function(e,n){if(n.name===t){s.splice(e,1);return false}});return false}})};e.fn.dataNew=function(e,n){if(n===t){return i(e,this[0])}else{return this.each(function(){r.call(this,e,n)})}};e.fn.removeDataNew=function(e){return this.each(function(){s.call(this,e)})}})(Zepto);(function(e,t){var n="",i,r,s,a={Webkit:"webkit",Moz:"",O:"o"},f=window.document,o=f.createElement("div"),u=/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,c,l,h,p,d,m,v,g,y,b={};var w="anim";function k(e){return e.replace(/([a-z])([A-Z])/,"$1-$2").toLowerCase()}function x(e){return i?i+e:e.toLowerCase()}e.each(a,function(e,r){if(o.style[e+"TransitionProperty"]!==t){n="-"+e.toLowerCase()+"-";i=r;return false}});c=n+"transform";b[l=n+"transition-property"]=b[h=n+"transition-duration"]=b[d=n+"transition-delay"]=b[p=n+"transition-timing-function"]=b[m=n+"animation-name"]=b[v=n+"animation-duration"]=b[y=n+"animation-delay"]=b[g=n+"animation-timing-function"]="";e.fx={off:i===t&&o.style.transitionProperty===t,speeds:{_default:400,fast:200,slow:600},cssPrefix:n,transitionEnd:x("TransitionEnd"),animationEnd:x("AnimationEnd")};e.fn.getComputedStyle=function(t){var n=this[0],i=getComputedStyle(n,"");if(!n)return;if(typeof t=="string")return i.getPropertyValue(t);else if(isArray(t)){var r={};e.each(isArray(t)?t:[t],function(e,t){r[t]=i.getPropertyValue(t)});return r}};e.fn.animate=function(n,i,r,s,a){if(e.isFunction(i))s=i,r=t,i=t;if(e.isFunction(r))s=r,r=t;if(e.isPlainObject(i))r=i.easing,s=i.complete,a=i.delay,i=i.duration;if(i)i=(typeof i=="number"?i:e.fx.speeds[i]||e.fx.speeds._default)/1e3;if(a)a=parseFloat(a)/1e3;return this.each(function(){return e(this).anim(n,i,r,s,a)})};e.fn.anim=function(n,i,r,s,a){var f,o={},x,j="",C=this,A,W=e.fx.transitionEnd,E=false;if(i===t)i=e.fx.speeds._default/1e3;if(a===t)a=0;if(e.fx.off)i=0;if(typeof n=="string"){o[m]=n;o[v]=i+"s";o[y]=a+"s";o[g]=r||"linear";W=e.fx.animationEnd}else{x=[];for(f in n)if(u.test(f))j+=f+"("+n[f]+") ";else o[f]=n[f],x.push(k(f));if(j)o[c]=j,x.push(c);if(i>0&&typeof n==="object"){o[l]=x.join(", ");o[h]=i+"s";o[d]=a+"s";o[p]=r||"linear"}}A=function(n,i){if(typeof n!=="undefined"){if(n.target!==n.currentTarget)return;e(n.target).unbind(W,A)}else e(this).unbind(W,A);E=true;e(this).css(b);e(this).removeDataNew(w);clearTimeout(N);if(i===t||i===true){s&&s.call(this)}};var N;if(i>0){this.bind(W,A);N=setTimeout(function(){if(E)return;A.call(C)},i*1e3+25)}this.size()&&this.get(0).clientLeft;this.css(o);this.dataNew(w,{callback:A,properties:n});if(i<=0){N=setTimeout(function(){C.each(function(){A.call(this)})},0)}return this};o=null;!function(){var n=function(n){n=n||false;var i=e(this);var r=i.dataNew(w);if(r===t){return}var s=r.properties;var a=r.callback;if(typeof s==="string"){console.log("not support @keyframe patter");return}if(n===true){i.css(s)}else{for(var f in s){if(u.test(f)){i.css(c,i.getComputedStyle(c))}else{i.css(f,i.getComputedStyle(f))}}}a.call(this,t,n)};e.fn.stop=function(e){return this.each(function(){n.call(this,e)})}}()})(Zepto);(function(e){e.Callbacks=function(t){t=e.extend({},t);var n,i,r,s,a,f,o=[],u=!t.once&&[],c=function(e){n=t.memory&&e;i=true;f=s||0;s=0;a=o.length;r=true;for(;o&&f<a;++f){if(o[f].apply(e[0],e[1])===false&&t.stopOnFalse){n=false;break}}r=false;if(o){if(u)u.length&&c(u.shift());else if(n)o.length=0;else l.disable()}},l={add:function(){if(o){var i=o.length,f=function(n){e.each(n,function(e,n){if(typeof n==="function"){if(!t.unique||!l.has(n))o.push(n)}else if(n&&n.length&&typeof n!=="string")f(n)})};f(arguments);if(r)a=o.length;else if(n){s=i;c(n)}}return this},remove:function(){if(o){e.each(arguments,function(t,n){var i;while((i=e.inArray(n,o,i))>-1){o.splice(i,1);if(r){if(i<=a)--a;if(i<=f)--f}}})}return this},has:function(t){return!!(o&&(t?e.inArray(t,o)>-1:o.length))},empty:function(){a=o.length=0;return this},disable:function(){o=u=n=undefined;return this},disabled:function(){return!o},lock:function(){u=undefined;if(!n)l.disable();return this},locked:function(){return!u},fireWith:function(e,t){if(o&&(!i||u)){t=t||[];t=[e,t.slice?t.slice():t];if(r)u.push(t);else c(t)}return this},fire:function(){return l.fireWith(this,arguments)},fired:function(){return!!i}};return l}})(Zepto);(function(e){var t=Array.prototype.slice;function n(t){var i=[["resolve","done",e.Callbacks({once:1,memory:1}),"resolved"],["reject","fail",e.Callbacks({once:1,memory:1}),"rejected"],["notify","progress",e.Callbacks({memory:1})]],r="pending",s={state:function(){return r},always:function(){a.done(arguments).fail(arguments);return this},then:function(){var t=arguments;return n(function(n){e.each(i,function(i,r){var f=e.isFunction(t[i])&&t[i];a[r[1]](function(){var t=f&&f.apply(this,arguments);if(t&&e.isFunction(t.promise)){t.promise().done(n.resolve).fail(n.reject).progress(n.notify)}else{var i=this===s?n.promise():this,a=f?[t]:arguments;n[r[0]+"With"](i,a)}})});t=null}).promise()},promise:function(t){return t!=null?e.extend(t,s):s}},a={};e.each(i,function(e,t){var n=t[2],f=t[3];s[t[1]]=n.add;if(f){n.add(function(){r=f},i[e^1][2].disable,i[2][2].lock)}a[t[0]]=function(){a[t[0]+"With"](this===a?s:this,arguments);return this};a[t[0]+"With"]=n.fireWith});s.promise(a);if(t)t.call(a,a);return a}e.when=function(i){var r=t.call(arguments),s=r.length,a=0,f=s!==1||i&&e.isFunction(i.promise)?s:0,o=f===1?i:n(),u,c,l,h=function(e,n,i){return function(r){n[e]=this;i[e]=arguments.length>1?t.call(arguments):r;if(i===u){o.notifyWith(n,i)}else if(!--f){o.resolveWith(n,i)}}};if(s>1){u=new Array(s);c=new Array(s);l=new Array(s);for(;a<s;++a){if(r[a]&&e.isFunction(r[a].promise)){r[a].promise().done(h(a,l,r)).fail(o.reject).progress(h(a,c,u))}else{--f}}}if(!f)o.resolveWith(l,r);return o.promise()};e.Deferred=n})(Zepto);(function(e){e.fn.end=function(){return this.prevObject||e()};e.fn.andSelf=function(){return this.add(this.prevObject||e())};"filter,add,not,eq,first,last,find,closest,parents,parent,children,siblings".split(",").forEach(function(t){var n=e.fn[t];e.fn[t]=function(){var e=n.apply(this,arguments);e.prevObject=this;return e}})})(Zepto);
//触摸事件
function Touch(){this._initX=0;this._finishX=0;this._startX=0;this._startY=0}Touch.prototype.touchStart=function(event){this._startX=event.touches[0].clientX;this._startY=event.touches[0].clientY;this._initX=this._startX};Touch.prototype.touchMove=function(event){var touches=event.touches;var _endX=event.touches[0].clientX;var _endY=event.touches[0].clientY;if(Math.abs(_endY-this._startY)>Math.abs(_endX-this._startX)){return}event.preventDefault();this._finishX=_endX;var _absX=Math.abs(_endX-this._startX);if(this._startX>_endX){_absX=-_absX}this._startX=_endX;return _absX};Touch.prototype.touchEnd=function(event){if(this._finishX==0){return}return this._initX-this._finishX;this._initX=0;this._finishX=0};

//焦点图
function Rotator(config){this.config=config;this.currentIndex=0;this.elem=$("#"+this.config.id);this.item=this.elem.find(".pic li");this.len=this.item.length;this.isNext=null;this.scrollTimer=null}Rotator.prototype.RotatorInit=function(){if(this.elem.find(".dot").length>0){this.dotInit()}if(this.len>1){this.touchEvent()}if(this.config.is_autoplay&&this.len>1){this.autoplay()}};Rotator.prototype.dotInit=function(){var $dot=this.elem.find(".dot");var _txt="";for(var i=0;i<this.len;i++){_txt+="<li class='dot-list'>"+parseInt(i+1)+"</li>"}$dot.html(_txt).find("li").eq(0).addClass("current");this.dotEvent()};Rotator.prototype.dotSet=function(){var $dot=this.elem.find(".dot");$dot.find("li").removeClass("current").eq(this.currentIndex).addClass("current")};Rotator.prototype.dotEvent=function(){var self=this;var $dot=self.elem.find(".dot");$dot.find("li").on("click",function(){self.currentIndex=$dot.find("li").index(this);self.picAnimate("dotClick")})};Rotator.prototype.touchEvent=function(){var self=this;var touch_elem=document.getElementById(self.config.id);var $pic=self.elem.find(".pic");var touch=new Touch();touch_elem.ontouchstart=function(event){touch.touchStart(event);if(self.config.is_autoplay){clearTimeout(self.scrollTimer)}};touch_elem.ontouchmove=function(event){var lastX=parseInt($pic.css("left"));var moveX=touch.touchMove(event);$pic.css("left",lastX+moveX+"px")};touch_elem.ontouchend=function(event){var client_width=document.documentElement.clientWidth;self.isNext=touch.touchEnd(event);if(self.config.is_onlyMovePic!=false){self.picAnimate()}else{if(client_width-parseInt($pic.find("li").width())*self.len-parseInt($pic.css("padding-left"))*2<0){self.picAnimate("nonLoop")}else{$pic.animate({"left":0})}}if(self.config.is_autoplay){self._slide()}};if(self.config.is_onlyMovePic==false){var orientationChange=function(){switch(window.orientation){case 0:$pic.css("left",0);this.currentIndex=0;break;case -90:$pic.css("left",0);this.currentIndex=0;break;case 90:$pic.css("left",0);this.currentIndex=0;break;case 180:$pic.css("left",0);this.currentIndex=0;break}};orientationChange();window.onorientationchange=orientationChange}};Rotator.prototype.picAnimate=function(type,callback){var $pic=this.elem.find(".pic");var _width=parseInt($pic.find("li").width());if(typeof type=="undefined"){var lastX=parseInt($pic.css("left"));var _index=0;if(lastX>0){_index=this.len-1}else{_index=Math.abs(lastX/_width);if(this.isNext>0){_index=Math.ceil(_index);if(_index==this.len){_index=0}}else{_index=Math.floor(_index)}}this.currentIndex=_index}else{if(type=="nonLoop"){var lastX=parseInt($pic.css("left"));var _index=0;var client_width=document.documentElement.clientWidth;var fix_width=parseInt($pic.css("padding-left"));var fix_index=Math.floor((client_width-fix_width)/_width);if(lastX>0){_index=0}else{_index=Math.abs(lastX/_width);if(this.isNext>0){_index=Math.ceil(_index);if(_index>this.len-fix_index){_index=this.len-fix_index}}else{_index=Math.floor(_index)}}this.currentIndex=_index}}if(this.elem.find(".dot").length>0){this.dotSet()}$pic.animate({"left":-_width*this.currentIndex+"px"},400,function(){if(typeof callback==="function"){callback()}})};Rotator.prototype.loadImg=function(img,callback){if(typeof img==="string"){img=[img]}var len=img.length;var i=0;var done=function(){if(i===len){if(typeof callback==="function"){callback()}}};$.each(img,function(index,el){var $img=$("<img />");$img.one("load",function(){i++;done()}).one("error",function(){i++;done()});$img.attr("src",el)})};Rotator.prototype._slide=function(){var self=this;self.scrollTimer=setTimeout(function(){var index=self.currentIndex;self.currentIndex++;if(index+1==self.len){self.currentIndex=0}var index2=self.currentIndex;var $item=self.item.eq(index);var $item2=self.item.eq(index2);var callback=function(){self.picAnimate("autoplay",function(){self._slide()})};if($item.data("imgLoaded")&&$item2.data("imgLoaded")){callback()}else{var src=$item.find("img").attr("src");var src2=$item2.find("img").attr("src");self.loadImg([src,src2],function(){$item.data("imgLoaded",true);$item2.data("imgLoaded",
true);callback()})}},5000)};Rotator.prototype.autoplay=function(){var self=this;self._slide();self.elem.bind({"mouseover":function(){clearTimeout(self.scrollTimer)},"mouseleave":function(){self._slide()}})};

/** 
* webgm 
*/ 
(function(){
	//注入window，创建命名空间
	window.webgm = {};
	
	webgm.debug = 0;

	//config
	webgm.config = {
		rem : "100"	//设置rem fontsize按照640px宽度下100px为标准
	};

	//调整body fontsize
	webgm.adjustRem = function(){
		var windowWidth = window.innerWidth;
		
		document.getElementsByTagName("html")[0].style.fontSize = (windowWidth * webgm.config.rem / 640 ) + "px";
	}
	
	//工具类
	webgm.util = {
		//转换json对象为json格式字符串
		jsonStringify : function(param){
			return JSON.stringify(param);
		},
		//转换json格式字符串为json对象
		parseJSON : function(param){
			return JSON.parse(param);
		},
		//base64编码
		base64_encode : function(string){
			return Base64.encode(string);
		},
		//base64 解码
		base64_decode : function(string){
			return Base64.decode(string);
		},
		//获取字符串长度，包含中文
		stringLength : function(param){
			return ("" + param.replace(/[^\x00-\xff]/gi,"ox")).length;
		},
		//判断是否是移动设备 参考jquery mobile
		isMobile : function(){
			return "ontouchend" in document;
		},
		//获取移动端系统类型 参考zepto
		getPlatformType : function(){
			var ua = window.navigator.userAgent;
			var platform = "pc";
			
			if(ua.match(/(Android)\s+([\d.]+)/)){
				platform = "android";
			}
			else if(ua.match(/(iPad).*OS\s([\d_]+)/) || ua.match(/(iPod)(.*OS\s([\d_]+))?/) || ua.match(/(iPhone\sOS)\s([\d_]+)/)){
				platform = "ios";
			}
			else if(ua.match(/Windows Phone ([\d.]+)/)){
				platform = "windows phone";
			}
			
			return platform;
		},
		//编码
		encode : function(param){
			return encodeURIComponent(param);
		},
		//解码
		decode : function(param){
			return decodeURIComponent(param);
		},
		//输出日志
		log : function(){
			if(webgm.debug){
				window.console && window.console.log(arguments);
			}
		},
		sortPoker:function(a, b){
			return  parseInt(a.replace(/[a-z]/,"")) > parseInt(b.replace(/[a-z]/,"")) ? 1 : -1;
		},
		//转换货币格式数字
		getCurrencyFormat : function(number,decimal,isround){
			var _number = number + "";
			//判断是否是负数
			var smallthanzero = _number.indexOf("-") == -1 ? false : true;
			//去除负号
			var na = smallthanzero ? _number.replace(/-/ig,"").split(".") : _number.split(".");
			var result = [];
			
			//处理整数部分
			var n = 0;
			for(var i = na[0].length - 1; i >= 0; i--){
				if(n % 3 == 0 && n != 0){
					result.push(",");
				}
				result.push(na[0][i]);
				n++;
			}
			
			//反转数组
			result.reverse();
			
			//判断是否要加回负号
			var s = smallthanzero ? "-" : "";

			//小数部分处理
			var _d = na[1];
			if(_d && decimal){
				_d = na[1].substring(0,decimal);
			}
			
			return _d ? s + result.join("") + "." + _d : s + result.join("");
		},
		//获取url query string参数
		getUrlParam : function(name){
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		    var r = window.location.search.substr(1).match(reg);
			
		    if(r != null){
				return unescape(r[2]);
			}
			
			return null;
		},
		//获取hash参数
		getHash : function(){
			return location.hash.substr(1);
		},
		//获取指定范围的随机整数
		getRandomNum : function(rmin,rmax){  
			var range = rmax - rmin;   
			var rand = Math.random();
			
			return (rmin + Math.round(rand * range));   
		},
		//处理1000->1k
		transferNumberToK : function(num){
			if(num === ""){return "";}

			num = parseInt(num);

			if(num < 1000){
				return num;
			}

			//保留一位小数
			if(num % 1000 != 0){
				num = (num / 1000).toFixed(1) + "k";
			}
			else{
				num = num / 1000 + "k";
			}
			
			return num;
		},
		//图片加载loading
		imagesload : function(imagesArray,callback){
			var images = {};
			var resources = imagesArray;
			var loadedImages = 0;
			var numImages = 0;
			
			//计算总图片数
			for(var src in resources) {
				numImages++;
			}

			//循环加载图片资源
			for(var src in resources){
				images[src] = new Image();
				images[src].onload = images[src].onerror = images[src].onabort = function(){
					var n = ++loadedImages;
					
					if(typeof callback == "function"){
						//表明图片已经全部加载完
						if(n >= numImages){
							callback(n,true);
						}
						else{
							callback(n);
						}
					}
				}
				images[src].src = resources[src];
			}
		},
		//获取字符串长度，包含中文
		getByteLength : function(str){
			if(!str){
				return 0;
			}

			str += "";
			return str.replace(/[^\x00-xff]/g,"01").length;
		},
		//截取字符串，支持中文
		cutString : function(str,len){
			var str_length = 0;
	        var str_len = 0;
	        var str_cut = "";

	        str_len = str.length;
	        for (var i = 0; i < str_len; i++) {
	            var a = str.charAt(i);
	            str_length++;
	            if (escape(a).length > 4) {
	                //中文字符的长度经编码之后大于4  
	                str_length++;
	            }
	            str_cut = str_cut.concat(a);
	            if (str_length > len) {
	                str_cut = str_cut.concat("...");
	                return str_cut;
	            }
	        }
	        //如果给定字符串小于指定长度，则返回源字符串；  
	        if (str_length <= len) {
	            return str;
	        }
		},
		//设置cookie
		setCookie : function(key,value,expires){
			var Days = expires || 1;
		    var exp  = new Date();
		    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		    document.cookie = key + "="+ escape (value) + ";expires=" + exp.toGMTString();
		},
		//获取cookie
		getCookie : function(key){
			var arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
     		if(arr != null) return unescape(arr[2]); return null;
		},
		//删除cookie
		removeCookie : function(key){
			var exp = new Date();
		    exp.setTime(exp.getTime() - 1);
		    var cval = this.getCookie(key);
		    if(cval != null) document.cookie = key + "=" + cval + ";expires=" + exp.toGMTString();
		}
	};

	Array.prototype.addArray = function(value) {
		var _data = this;
		var _string = this.join('|') + '|';
		_string = (_string.indexOf(value) != -1) ? _string.replace(value+ '|', '') : _string + value + '|';
		_string = (_data.length == 0) ?_string.substring(1,_string.length - 1) : _string.substring(0,_string.length - 1);
		_arry = (_string != '') ? _string.split('|') : [];
		return _arry;
	};

	Array.prototype.deleteArray = function(value) {
		var _data = this;
		if(value === null){
			value = [];
		}
		var _string = this.join('|') + '|';
		for (var i = 0; i < value.length; i++) {
			_string = _string.replace(value[i]+ '|', '') 
		};
		_string = (_data.length == 0) ?_string.substring(1,_string.length - 1) : _string.substring(0,_string.length - 1);
		_arry = (_string != '') ? _string.split('|') : [];
		return _arry;
	};

	Array.prototype.getThan = function(value) {
		var _data = this;
		var _i = -1;
		for (var i = 0; i < _data.length; i++) {
			if(_data[i] > value){
				_i = i;
				return _i;
			}		
		};
		return _i;
	};
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index > -1) {
			this.splice(index, 1);
		}
	};
})();
/** 
* 倒计时 
*/ 
(function(){
	webgm.Observer = function(){
		this.fns = [];
	};
    webgm.Observer.prototype = {
        constructor: webgm.Observer,
        subscribe: function(fn){
          if(typeof fn === 'function'){
            this.fns.push(fn);
          }

          return this;
        },
        subscribeOnce: function(fn){
          if(typeof fn === 'function'){
            fn.EXCUTED_ONCE = true;
            this.fns.push(fn);
          }

          return this;
        },
        unsubscribe: function(fn){
          if(arguments.length === 0){
            this.fns = [];
            return;
          }
          
          if(typeof fn !== 'function'){
            return;
          }

          var fns = this.fns;
          for(var i = 0, len = fns.length; i < len; i++){
            if(fns[i] === fn){
              fns.splice(i, 1);
              i--;
              len--;
            }
          }

          return this;
        },
        fire: function(){
          var fns = this.fns;
          var item;
          for(var i = 0, len = fns.length; i < len; i++){
            item = fns[i];
            item.apply(null, arguments);
            if(item.EXCUTED_ONCE === true){
              this.unsubscribe(item);
              i--;
              len--;
            }
          }

          return this;
        }
    }

    webgm.countdown = function(duration, countTime){
	    var obs = new webgm.Observer();
	    var timeout;
	    var countTime = countTime || 1000;
	    var nowDate,
	        durTemp,
	        diff; // 剩下多少时间
	    var durTemp = diff = duration;
	    var _fn;
	    return {
	      hookCountdown: function(fn){
	      	if(fn){
	      		_fn = fn;
	      	}
	      	
	        obs.subscribe(_fn);
	        return this;
	      },
	      unHookCountdown: function(fn){
	        if(arguments.length === 0){
	          obs.unsubscribe();
	        }else{
	          obs.unsubscribe(fn);
	        }
	        return this;
	      },
	      start: function(){
	        clearTimeout(timeout);
	        nowDate = new Date;
	        durTemp = duration;
	        this._loop();
	        return this;
	      },
	      goOn: function(){
	        clearTimeout(timeout);
	        if( diff === 0 ){ // 如果当前时间已经倒计到 0, 则不执行下面的代码
	          return;
	        }
	        nowDate = new Date;
	        durTemp = diff;
	        this._loop();
	        return this;
	      },
	      pause: function(){
	        clearTimeout(timeout);
	        return this;
	      },
	      _loop: function(){
	        var me = this;
	        var d = new Date;
	        diff = d - nowDate;
	        diff = diff / 1000;
	        diff = Math.floor(diff);
	        diff = durTemp - diff;

	        if(diff < 0){ // 如果由于异常导致它变成 负数，则直接让它变成0
	          console.log('剩余时间变成负数');
	          diff = 0;
	        }

	        obs.fire(diff);

	        if( diff > 0 ){ // 大于0 才调用
	          timeout = setTimeout(function(){
	            me._loop();
	          }, countTime);
	        }
	      },
	      clear: function(){ // 清除所有状态
	        this.pause();
	        obs.unsubscribe();
	        return this;
	      },
	      reset : function(newtime){
	      	durTemp = diff = newtime;
	      	this.hookCountdown();
	      }
	    }
	}
})();