//文
var DEBUG = 1;
var gLogin = window.gLogin || {};
var gUser = window.gUser || {};
var Client = window.Client || {};
var Custom = window.Custom || {};
var PAG_JS = window.PAG_JS || {};
var Cookie = window.cookie || {};

/*
var appNameList = ['circus','flopmachine','line','guess','kadang','littleapple','rotarytable','circus2',
 					'smallmahjong','niuniu','crazyrace','test_poker','test_texas','tanzhuji','sanguo','sangong',
 					'slot','fish','shaizile','texas','21dian','biyibi','zcsm','circusAndroidPad','crazytexasbaidu',
 					'crazyrobdiamondbaidu','crazyrobdiamondcoolpad','happykadang','brnn','shengji','beautyflop',
 					'landlord','dropcoin','caiquan','texasnew','texasqihoo','superstarPad','mahjongbaidu',
					'mahjongqihoo','mahjongleshi','mahjongoppo','happykadangbaidu','happykadangqihoo',
 					'hdsuperstarbaidu','hdsuperstarqihoo','sisanjiujiubyb','yiqiyiqisanbyb','baidudropcoin',
					'qihoodropcoin','leshidropcoin','midropcoin','texasmi',
					'leshicrazycircus2','micrazycircus2','bag'];
*/

//添加cookie---值（格式:"名=值"）
function addCookieArgs1(value){
	var cval = value.split("=");
	document.cookie = cval[0]+"="+escape(cval[1]);
}

//添加cookie---名/值
function addCookieArgs2(key,value){
	document.cookie = key+"="+value;
}

//添加cookie---过期时间
function addCookieArgs3(key,value,expire){
	var liveDate = new Date();
	liveDate.setTime(liveDate.getTime()+expire*1000);
	document.cookie = key+"="+value+";expires="+liveDate.toGMTString();
}

//添加cookie---判断不通参数
Cookie.addCookie = function(){
	var args = arguments.length;
	if(args == 1){			//1个参数
		addCookieArgs1(arguments[0]);
	}else if(args == 2){	//2个参数
		addCookieArgs2(arguments[0],arguments[1]);
	}else if(args == 3){	//3个参数
		addCookieArgs3(arguments[0],arguments[1],arguments[2]);
	}
}

//修改cookie---值（格式:"名=值"）
Cookie.setCookie = function(){
	var args = arguments.length;
	if(args == 1){			//1个参数
		addCookieArgs1(arguments[0]);
	}else if(args == 2){	//2个参数
		addCookieArgs2(arguments[0],arguments[1]);
	}else if(args == 3){	//3个参数
		addCookieArgs3(arguments[0],arguments[1],arguments[2]);
	}
}

//删除cookie
Cookie.delCookie = function(key){
	var liveDate = new Date();
	liveDate.setTime(liveDate.getTime()-1000);
	document.cookie = key+"=;expires="+liveDate.toGMTString();
}

//获取cookie值
Cookie.getCookie = function(key){
	var cookies = document.cookie.split(";");
	for(var i=0;i<cookies.length;i++){
		var cval = cookies[i].split("=");
		if(key==cval[0].replace(/^\s+|\s+/,'')){
			return unescape(cval[1]);
		}
	}
	return '';
}

//获取loginCallback的cookie信息，存在调用登陆回调函数
function getCookieLoginInfo(){	
	var cookieName = "loginCallback";
	var loginCallbackInfo = Cookie.getCookie(cookieName);
	if(loginCallbackInfo != ''){
		var login = JSON.parse(loginCallbackInfo);
		Cookie.delCookie(cookieName);
		PAG_CALLBACK_login(login);
	}
}

//页面加载完成后，判断cookie
if(window.addEventListener){
	window.addEventListener('load', getCookieLoginInfo);
}

//判断js版本
Client.getJsVersion = function() {
	if(typeof(PAG_JS.getJsVersion) == 'undefined'){
		return 1;		//1.3（包括1.3）版本以前 ,无该方法，返回1		
	}else{
		return PAG_JS.getJsVersion();		//2 => 1.4和1.5版本 , 3 => 1.6版本 , 4 => 1.7版本
	}
}

//判断用户是否登录
Client.loginStatus = function() {
	//1.7及以后版本，用h5判断是否登录
	if(userStatus != ""){
		return JSON.parse(userStatus);
	}else if(typeof(PAG_JS) != "undefined" && typeof(PAG_JS.isLogin) != "undefined"){
		return JSON.parse(PAG_JS.isLogin());		//返回json数据
	}else{
		return {isLogin:0}
	}
}

//请求登录
Client.loginWin = function() {
    window.sessionStorage.setItem("guessWinNum", 0); //将猜大小赢的金额清零
    var url = '?act=user&st=login';
    Client.openUrlInApp(url, "", 'WB');
}

//请求注册
Client.reg = function(){
	url = '?act=user&st=register';		// H5化注册页面
    Client.openUrlInApp(url, "", 'WB');
	// window.location.href = '?act=user&st=register';		// H5化注册页面
}

//退出登陆
Client.logout = function(){
	//1.7及以后版本，用h5退出登录
	// if(Client.getJsVersion() >= 4){
        $.ajax({
            type:"POST",
            url:"//gmall.wanlitong.com/?act=ucenter_logout&format=json",
            dataType:"jsonp",
            data:{},
            cache:false
        });
        if(typeof(PAG_JS) != 'undefined' && typeof(PAG_JS.baiduLogout) != 'undefined') {
            PAG_JS.baiduLogout();
        }else{
    		$.ajax({
    			async:false,
    			url:'?act=user&st=logout',
    			success:function(){
    				PAG_JS.logout();
    				// window.location.href = '/';
    				Client.openUrlInApp("/?act=index", "", "WA");
    			}
    		});
        }

	//}else{
		//return PAG_JS.logout();
	//}	
}

//新退出登陆(130[versionCode]以后版本，不包括130)
Client.requestLogout = function(){
	return PAG_JS.requestLogout();
}

Client.finish = function() {
	return PAG_JS.finish();
}

//退出游戏平台，会弹出退出确认
Client.exit =  function(){
	PAG_JS.exit();
}

//退出游戏平台，无退出确认 
Client.exitWithoutAlert =  function(){
	Client.lottery();
	return PAG_JS.exitWithoutAlert();
}


//获取游戏安装状态
Client.getGameStatus = function(packageName,versionName){
	versionName = parseInt(versionName);
	return JSON.parse(PAG_JS.getGameStatus(packageName,versionName));
}

//获取手机设备信息
Client.getDeviceInfo = function(){
	if(typeof(PAG_JS.getDeviceInfo) != "undefined") {
		return JSON.parse(PAG_JS.getDeviceInfo());
	}else{
		return {};
	}
	
}

//下载游戏
Client.downloadGame = function(packageName,versionName,gameName,url){
	versionName = parseInt(versionName);
	//通过检测Native接口，判断是否是游戏大厅客户端打开的本页面
	if(typeof(PAG_JS) != "undefined" && typeof(PAG_JS.downloadGame) != "undefined") {
		PAG_JS.downloadGame(packageName,versionName,gameName,url);
	} else {
		window.location.href = url;
	}
}

//启动游戏
Client.startGame = function(packageName){
	//1.7及以后版本，用新启动游戏方法
	if(Client.getJsVersion() >= 4){
		var loginInfo = Client.loginStatus();
		var gameUser = '';
		if(loginInfo.isLogin==1){
			gameUser = JSON.stringify(loginInfo.gameUser);
		}
		PAG_JS.startGame2(packageName,gameUser);
	}else{
		PAG_JS.startGame(packageName);
	}
}

//安装游戏
Client.installGame = function(packageName,versionName){
	if(packageName===""){
		return false;
	}
	versionName = parseInt(versionName);
	PAG_JS.installGame(packageName,versionName);
}

//启动游戏（ios专用）
Client.launchGame = function(launchUrl,downloadUrl){
	PAG_JS.launchGame(launchUrl,downloadUrl);
}

//版本检测
Client.getVersion = function(){
	return JSON.parse(PAG_JS.getVersion());
}

//请求照相机拍照
Client.requestPhoto = function(){
	//1.7及以后版本，用新拍照方法
	if(Client.getJsVersion() >= 4){
		var userInfo = Client.loginStatus();
		if(userInfo.isLogin == 1){
			var token = userInfo.gameUser.token;
			PAG_JS.selectPhoto(token);
		}else{
			Client.loginWin();
		}
	}else{
		PAG_JS.photo();
	}	
}

//选择本地照片
Client.choicePhoto = function(){
	//1.7及以后版本，用新选择照片的方法
	if(Client.getJsVersion() >= 4){
		var userInfo = Client.loginStatus();
		if(userInfo.isLogin == 1){
			var token = userInfo.gameUser.token;
			PAG_JS.selectAlbum(token);
		}else{
			Client.loginWin();
		}
	}else{
		PAG_JS.album();
	}
}

//充值中心
Client.recharge = function(){
	PAG_JS.recharge();
}

//调用支付宝快捷支付SDK
Client.alipay = function(pay_amount,orderId){
    var amount = parseInt(pay_amount);
    if(typeof(PAG_JS.alipay) != 'undefined'){
        PAG_JS.alipay(amount,orderId);
    }else{
        window.location.href = 'https://' + window.location.host + '/?act=alipaywap&out_trade_no='+orderId+'&total_fee='+amount;
    }
}

//调用支付宝快捷支付SDK
Client.baidupay = function(orderId, productName, pay_amount, redirectUrl, cancelUrl){
	var amount = parseInt(pay_amount);
	if(typeof(PAG_JS) != 'undefined' && typeof(PAG_JS.baidupay) != 'undefined'){
		PAG_JS.baidupay(orderId, productName, amount, redirectUrl, cancelUrl);
	}
}

//取消支付确认框
Client.confirm = function(str){
	return PAG_JS.confirm(str);
}

//复制到剪贴板
Client.copy = function(str){
	PAG_JS.copy(str);
}

//粘贴内容
Client.paste = function(){
	return PAG_JS.paste();
}

//提示框
Client.alert = function(str){
	if(typeof(PAG_JS) != "undefined" && typeof(PAG_JS.alert) != "undefined") {
		PAG_JS.alert(str);
	}else{
		alert(str);
	}
}

//打开url地址
Client.startUrl = function(url){
	PAG_JS.startUrl(url);
}

//app下载更新版本
Client.appUpgrade = function(url){
    PAG_JS.appUpgrade(url);
}

//打开wap游戏
Client.startWebGame = function(url){
	PAG_JS.startWebGame(url);
}

var util = {
	clone : function(obj) {
		if (typeof (obj) != 'object')
			return obj;
		var re = {};
		if (obj.constructor==Array)
			re = [];
		for ( var i in obj) {
			re[i] = util.clone(obj[i]);
		}
		return re;
	}
};
//跳转到彩票页面
Client.lottery = function() {
	//1.7及以后版本，用新方法调用彩票并同步登陆
	if(Client.getJsVersion() >= 4){
		var loginInfo = Client.loginStatus();
		if (loginInfo.isLogin == 1) {
            $.get('?act=login&st=ajax_session_id',function(msg){
                var tempUser = util.clone(loginInfo.gameUser);
                if ('0000' == msg.code) {
                    tempUser.parterUserName = msg.sessionId;
                }
                gameUser = JSON.stringify(tempUser);
                PAG_JS.startLottery(gameUser);
            }, 'json');
        } else {
        	window.location.href = "?act=user&st=login&from=cp";
            //PAG_JS.startLottery(gameUser);
        }

	}else{
		PAG_JS.lottery();
	}	
}

//下注
Client.payGuessing = function(questionInfo,appKey,amount,questionId,answerId){	
	//1.7及以后版本，用h5方式支付
	if(Client.getJsVersion() >= 4){
		window.location.href = '?act=payment&appkey='+appKey+'&tradeName='+questionInfo+'&amount='+amount+'&questionId='+questionId+'&answerId='+answerId;
	}else{
		PAG_JS.payGuessing(questionInfo,appKey,amount,questionId,answerId);
	}
}

//跳转到游戏大厅
Client.gotoGameHall = function() {
	PAG_JS.gamehall();
}

/**
 *
 * @param string payInfo 商品名称
 * @param string appKey app key
 * @param string amount 钻石总额
 * @param string payExtend 表单字符串信息 例如 q=qid&s=ans
 */
Client.requestPay = function(payInfo,appKey,amount,payExtend){
	PAG_JS.requestPay(payInfo,appKey,amount,payExtend);
}

/**
 * 微信分享
 *
 * @param int platform 平台标识 1代表微信，2代表朋友圈
 * @param string doc 文字信息
 * @param string picUrl 图片的url地址
 * @param string url 触发链接地址

 * @returns {undefined}
 */
Client.shareDocToWX = function (platform, title, doc, picUrl, url) {
    if(typeof(PAG_JS) != 'undefined' && typeof(PAG_JS.shareToWX) != 'undefined') {
        if(Client.getJsVersion() < 11) {
            PAG_JS.shareToWX(platform, doc, picUrl, url);
        } else {
            PAG_JS.shareToWX(platform, title, doc, picUrl, url);
        }
    }else if(typeof(window.wltgame.shareToWX) != 'undefined'){
        window.wltgame.shareToWX(platform, title, doc, picUrl, url);
    }
}

Client.openUrlInApp = function (url, userInfo, webpageTag) {
    if(Cookie.getCookie('ucenter') == 'newucenter' && url.indexOf("act=ucenter") >= 0){
        url = url.replace(/ucenter/,"newucenter");
        window.location.href=url;
    }
	var thisurl = url;
    var indexOfHttp = url.indexOf("http://");
    var indexOfHttps = url.indexOf("https://");
    var indexOfWAPG = url.indexOf("wapg://");
    var host = new Array();
    var gameConfArr = ['hjwl', 'ylzc', 'zqcs'];
    if(indexOfHttp >= 0) {
        var re = /http:\/\/([^\/]+)\/?/i;
        host = url.match(re);
    }else if(indexOfHttps >= 0) {
    	var re = /https:\/\/([^\/]+)\/?/i;
        host = url.match(re);
    }else if(indexOfWAPG >= 0) {
    	var re = /wapg:\/\/([^\/]+)/i;
        host = url.match(re);
		var goUrl = ''; 
		// if($.inArray(host[1], gameConfArr) != -1){
			$.ajax({
			   type: "POST",
			   url: "/?act=wapsdk&st=login_game_by_appkey",
			   data: "gameKey="+host[1],
			   dataType: "json",
			   success:function(msg){
			    	//跳转
			    	// if(typeof(PAG_JS) == 'undefined' || Cookie.getCookie('appName') == 'caipiao') {
			    		// window.location.href = msg.goUrl;
			    	// } else 
			        if(Client.getJsVersion() < 8 && typeof(PAG_JS) != 'undefined' && typeof(PAG_JS.startThirdParty) != 'undefined'){
                         PAG_JS.startThirdParty(userInfo, msg.goUrl);
                    } else if ((Client.getJsVersion() >= 8) && (Client.getJsVersion() <= 11) && typeof(PAG_JS) != 'undefined' && typeof(PAG_JS.openPage) != 'undefined'){ 
                         PAG_JS.openPage('WB', msg.goUrl, '', '');
                    }else{
                        window.location.href = msg.goUrl;
                    }
			   }
			});
		// }
        return;
	}else if(indexOfHttp == -1) {
        host[1] = window.location.host;
		var httpProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
		thisurl = httpProtocol+host[1]+"/"+thisurl;
    }
    
   var hostArray = [window.location.host,
            "m.1768.com"];
 
    if (typeof(PAG_JS) == 'undefined') {
        window.location.href = thisurl;
    } else if (Client.getJsVersion() >= 7 && $.inArray(host[1], hostArray) == -1) {
        if (Client.getJsVersion() == 7) {
            PAG_JS.startThirdParty(userInfo, thisurl);
        } else if ((Client.getJsVersion() >= 8) && (Client.getJsVersion() <= 11) && typeof(PAG_JS) != 'undefined' && typeof(PAG_JS.openPage) != 'undefined') {
        	if(typeof(PAG_JS.getAppName)!= "undefined"){
            	if(in_array(PAG_JS.getAppName(),appNameList)){
               	 	if(webpageTag == 'WA'){
                    		thisurl = url+'&showFootBar=1&showFootBarIndex=4';	
                	}
    		         window.location.href=thisurl;
                }
            }else{
                 PAG_JS.openPage('WB', thisurl, '', '');
            }
        } else {
            window.location.href = thisurl;
        }
    } else if (Client.getJsVersion() >= 7) {
        if ((Client.getJsVersion() >= 8) && (Client.getJsVersion() <= 11)) {
            if (webpageTag == 'WA') {
                $.ajax({
                    type: "GET",
                    data: {
                        url: encodeURIComponent('/?act=index')
                    },
                    url: "?act=index&st=write_session",
                    success: function() {
                        //PAG_JS.openPage(webpageTag, thisurl, '', '');
                        if(typeof(PAG_JS) != 'undefined' && typeof(PAG_JS.openPage) != 'undefined') {
                            if(typeof(PAG_JS.getAppName)!= "undefined" && typeof(appNameList) != "undefined"){
                                if(in_array(PAG_JS.getAppName(),appNameList)){
                                    thisurl = thisurl+'&showFootBar=1&showFootBarIndex=4';
                                    window.location.href=thisurl;
                                }
                            }else{
                                PAG_JS.openPage(webpageTag, thisurl, '', '');
                            }
                        }else{
                            if(typeof(PAG_JS.getAppName)!= "undefined"){
                                if(in_array(PAG_JS.getAppName(),appNameList)){
                                    if(webpageTag == 'WA'){
                                        if(thisurl.indexOf('?') == -1){
                                            thisurl += '?';
                                        }
                                        thisurl = thisurl+'&showFootBar=1&showFootBarIndex=4';;
                                    }
                                }
                            }
                            window.location.href=thisurl;
                        }
                        PAG_JS.clearHistory('WB');
                    },
                    error: function() {

                    }
                });
            } else {
                if(typeof(PAG_JS) != 'undefined' && typeof(PAG_JS.openPage) != 'undefined') {
                    if(typeof(PAG_JS.getAppName)!= "undefined"){
                        if(in_array(PAG_JS.getAppName(),appNameList)){
                            window.location.href=thisurl;
                        }
                    }else{
                        PAG_JS.openPage(webpageTag, thisurl, '', '');
                    }
                }else{
                    window.location.href=thisurl;
                }
            }

        } else {
            window.location.href = thisurl;
        }
    } else {
        window.location.href = thisurl;
    }
}

//android返回按钮事件回调
function PAG_EVENT_onBack(){ 
	var url = '';
	var deviceInfo = Client.getDeviceInfo();
	//sdk调用物理返回键
	if(request('from')=='sdk'){
		Client.finish();
	}else if(request('act')=="" || request('act')=="index" || request('act')=="partner_wlt_index"){
		if(typeof(deviceInfo.packageName)!='undefined') {
			if(deviceInfo.packageName == "com.pingan.cslguessing") {
				Client.finish();
			}else if(deviceInfo.packageName == "com.pingan.caipiao") {
				Client.exitWithoutAlert();
			}else{
				Client.exit();
			}
		}else if("{$appName}"=="cp"){
			Client.exitWithoutAlert();
		}else{
			Client.exit();
		}
	}else{
		switch(request('act')){				//个人中心---htc的返回bug
			case "ucenter":
				switch(request('st')){
					case "edit_avatar": 		//编辑头像
					case "account_detail": 		//账号明细
					case "my_coupon": 			//我的优惠券
					case "personal_info":
						url = "/?act=ucenter";
						Client.openUrlInApp(url, "", "WA");
						// window.location.href = "/?act=ucenter";		//跳转到个人中心
						break;
					case "inf_portrait":
					case "inf_petname":
					case "inf_sex":
					case "inf_address":
					case "inf_addiction":
					case "inf_email":
						window.location.href = "/?act=ucenter&st=personal_info";
						break;
					case "deal": 		//交易详情
						window.location.href = "/?act=ucenter&st=account_detail&token="+request('token');		//跳转到账号明细
						break;
					case "coupon_detail": 		//优惠券详情
						window.location.href = "/?act=ucenter&st=my_coupon&token="+request('token');		//跳转到我的优惠券
						break;
					default:
						if (request('backUrl') == "tdianmall"){
							url = "/?act=tdianmall";
							// window.location.href = "/?act=tdianmall";
						}
						else{
							url = "/?act=index";
							// window.location.href = "/?act=index";//跳转到游戏大厅
						}
						Client.openUrlInApp(url, "", "WA");
						break;
				}
				break;
			case "gift":		//礼包页面
				if(deviceInfo.packageName == "com.pingan.cslguessing") {
					Client.finish();
				}else if(deviceInfo.packageName == "com.pingan.caipiao") {
					Client.exitWithoutAlert();
				}else{
					Client.exit();
				}
				break;
			case "activity": 	//活动页面
				if(deviceInfo.packageName == "com.pingan.cslguessing") {
					Client.exit();
				}
				else{
					url = "/?act=activity";
					Client.openUrlInApp(url, "", "WA");
					// window.location.href = "/?act=index";	//跳转到游戏大厅	
				}
				break;
            case "guaguale":
				switch(request('st')){
					case "main": 	 	//如果当前页面是刮奖页面，则返回我的刮刮乐页面
                        $("#goback").click();
                        return;
                        switch(request('from')){
                        	case "guaguale":
                        		window.location.href = "/?act=guaguale&st=ow&token="+request('token');
                        		break;
                        	case "gift":
                        		window.location.href = "/?act=gift&st=main";
                        		break;
                        	default:
                        		window.location.href = "/?act=guaguale&st=ow&token="+request('token');
                        		break;
                        }
                        break;
					case "ow": 		//如果是我的刮刮乐，则返回个人中心
						url = "/?act=ucenter";
						Client.openUrlInApp(url, "", "WA");
                        // window.location.href = "/?act=ucenter";
                        break;
					case "buy": 		//购买刮刮卡
					case "mpl": 		//排行榜
					case "buy_coins":   //购买游戏币，这几个页面的返回到刮奖页面
						window.location.href = "/?act=guaguale&st=main&token="+request('token');		//跳转到我的优惠券
						break;
					default:
                        Client.openUrlInApp('/?act=index', "", 'WA'); 
						//window.location.href = "/?act=index";	//跳转到游戏大厅
						break;
				}
				break;
			case "game": 	//游戏详情
				url = "/?act=index&tab="+request('tab');
				Client.openUrlInApp(url, "", "WA");
				// window.location.href = "/?act=index&tab="+request('tab');	//跳转到游戏大厅	指定tab		
				break;
			case "guess":
                switch(request('st')){
                    case "prizeList":
                        window.location.href = "/?act=guess";
                        break;
                    default:
                        window.sessionStorage.setItem("guessWinNum", "0");
               //          if(window.history.length > 1){

			            //     window.location.href='?act=index';
			            // } else { 
			                Client.openUrlInApp('?act=index', "", 'WA');
			            // }
                        break;
                }
                
				break;
			case "user": 	//登陆页面
				var loginReturnUrl = Cookie.getCookie("loginReturnUrl")
				if(loginReturnUrl != ''){
					window.location.href = loginReturnUrl;
				}
				break;
            case "exchange": 	//欢乐值兑换
            	if (request('backUrl') == "tdianmall"){
            		url = "/?act=tdianmall";
				}else{
					url = "/?act=ucenter";
				}
				Client.openUrlInApp(url, "", "WA");
				break;
			case "pinballwap":
                url = "/?act=index";
                Client.openUrlInApp(url, "", "WA");
                break;
            case "message":
            	switch(request('st')){
            		case "detail":
            			window.location.href = "/?act=message";
            			break;
            		default:
            			url = "/?act=index";
            			Client.openUrlInApp(url, "", "WA");
            			break;
            	}
            	break;
            case "recharge":
                   url = "/?act=ucenter";
                   Client.openUrlInApp(url, "", "WA");
                break;
            case "package":
                switch(request('st')){
            		case "package_detail":
            		    if (request('giftType') == 1){
            		    	window.location.href = "/?act=package&st=get_packages_by_type&type=1";
            		    }else if (request('giftType') == 2){
            		    	window.location.href = "/?act=package&st=get_packages_by_type&type=2";
            		    }else
            		    {
            				url = "/?act=tdianmall";
            				Client.openUrlInApp(url, "", "WA");
            			}
            			break;
                    case "package_detail_shop":
                        url = "/?act=package&backUrl=tdianmall";
                        Client.openUrlInApp(url, "", "WA");
                        break;
                    case "goods_list":
                        url = "/?act=tdianmall";
                        Client.openUrlInApp(url, "", "WA");
                        break;
                    case "goods_detail":
                        url = "/?act=package&st=goods_list&type=3";
                        Client.openUrlInApp(url, "", "WA");
                        break;
                    case "goods_exchange_success":
                        url = "/?act=package&st=goods_list&type=3";
                        Client.openUrlInApp(url, "", "WA");
                        break;
            		case "get_packages_by_type":
            		{
            			url = "/?act=tdianmall";
            			Client.openUrlInApp(url, "", "WA");
            			break;
            		}

            		case "main":
            			if(deviceInfo.packageName == "com.pingan.cslguessing") {
							Client.finish();
						}else if(deviceInfo.packageName == "com.pingan.caipiao") {
							Client.exitWithoutAlert();
						}else{
							Client.exit();
						}
						break;
					default:
						if (request('backUrl') == "tdianmall"){
							url = "/?act=tdianmall";
							Client.openUrlInApp(url, "", "WA");
						}
						if (request('backUrl') == "oilcard"){
							window.location.href = "/?act=oilcard";
						}
						break;
            	}
                break;
            case "oilcard":
            	if (request('st') == 'show_pay_page'){
            		var name = request('name');
					var phone = request('phone');
					var area = request('productType');
					var tpoint = request('pointAmount');
					var amount = request('payAmount');
					var params = 'phone=' + phone+'&name='+name+"&area="+area+'&tpoint='+tpoint+'&amount='+amount;
					window.location.href = "/?act=oilcard&st=info_confirm&"+params;
            	}
            	break;
            case "tdianmall":
                if(deviceInfo.packageName == "com.pingan.special.zhonghe") {
                    window.location.href = '/?act=game_zhonghe_collection';
                }
                break;
			default:
				window.history.go(-1);
		}		
	}
}

function statusMsg(status){
	var msg = '';
	switch(status){		//0未安装，1已安装，-1已下载，-2下载中，-3下载失败
		case 0:
			msg = '下载';		//未安装
			break;
		case 1:
			msg = '启动';		//已安装
			break;
		case -1:
			msg = '安装';		//已下载
			break;
		case -2:
			msg = '正在下载';		//下载中
			break;
		case -3:
			msg = '继续下载';		//下载失败
			break;
	}
	return msg;
}


/*
 * 自定义函数---取URL参数值
 * para	string	url参数
 * 
 * return	返回URL参数对应的值，不存在的参数返回空字符串。
 * 
 * example：request("act");---返回URL地址的act对于参数值
 */
function request(para){
	para = para.toLowerCase();
	var url = window.location.href;
	if(url.indexOf("?")!=-1){
		var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
		var paraObj = {}
		for(var i=0;i<paraString.length;i++){
			j = paraString[i];
			var key = j.substring(0,j.indexOf("=")).toLowerCase();
			var value =  j.substring(j.indexOf("=")+1,j.length);
			paraObj[key] = value;
		}
		if(typeof(paraObj[para])=="undefined"){
			return "";
		}else{
			return paraObj[para];
		}
	}else{
		return "";
	}
}

function requestWithUrl(para, url){
	para = para.toLowerCase();
	if(url.indexOf("?")!=-1){
		var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
		var paraObj = {}
		for(var i=0;i<paraString.length;i++){
			j = paraString[i];
			var key = j.substring(0,j.indexOf("=")).toLowerCase();
			var value =  j.substring(j.indexOf("=")+1,j.length);
			paraObj[key] = value;
		}
		if(typeof(paraObj[para])=="undefined"){
			return "";
		}else{
			return paraObj[para];
		}
	}else{
		return "";
	}
}

/*
 * 数据埋点js
 * para	string	parterId
 */
function buryPoint(parterId){
}

/**
 * 关闭当前页面---直接关闭页面
 */
Custom.closeCurrentPage = function(){
	if(window.backUrl != ""){
		top.location.href = window.backUrl;
		return true;
	}
	if(typeof(PAG_JS) != "undefined") {
		window.history.go(-1);
	} else {
		window.opener = null;
		window.open('','_self');
		window.close();
	}
}
function in_array(search,array){
    for(var i in array){
        if(array[i]==search){
            return true;
        }
    }
    return false;
}
function getNowFormatDate(){
    var date = new Date();
    var seperrater1 = "-";
    var seperrater2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHours = date.getHours();
    var strCount = function(str){
        if (str >=0 && str <= 9) {
            str = "0" + str;
        };
        return str;
    }
    var currentdate = year + seperrater1 + strCount(month) + seperrater1 + strCount(date.getDate()) + " " + strCount(date.getHours())
        + seperrater2 + strCount(date.getMinutes()) + seperrater2 + strCount(date.getSeconds());
    return currentdate;
}
//相机拍照回调
function PAG_CALLBACK_photo(result){
	var avatar200 = result.i200x200, Nowtime = getNowFormatDate();
	avatar200 = cdn_path_photo+avatar200;
	$("#user_name").attr("src",avatar200);
	$("#user_name11").attr("src",avatar200);
    $(".reviefail").removeClass("disblock");
    $(".photop_tack").removeClass("Block");
    $(".reviewing").addClass("disblock");
    $(".title_txt").addClass("disBlock");
    $(".title_txt").find("span").html("(本次上传时间:"+ Nowtime +")");
	//更新seesion头像信息
    /*
	$.ajax({
		type:'POST',
		url:'?act=ajax&st=update_session_iconlist',
		data:{
			iconlist:result,
		},
		success:function(msg){
			window.location.reload();
		}
	});
    */
}

//百度登录完成回调
function PAG_CALLBACK_baiduLoginSuccess(baiduAccessToken, timestamp) {
    window.location.href = "/?act=landing&st=landing_for_baidu&baiduAccessToken="+baiduAccessToken+"&timestamp="+timestamp;
}

