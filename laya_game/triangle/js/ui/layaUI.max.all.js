var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var loadingUI=(function(_super){
		function loadingUI(){
			
		    this.middle_box=null;
		    this.bottom_box=null;

			loadingUI.__super.call(this);
		}

		CLASS$(loadingUI,'ui.load.loadingUI',_super);
		var __proto__=loadingUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("SkeletonPlayer",laya.ani.bone.Skeleton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(loadingUI.uiView);
		}

		STATICATTR$(loadingUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1334,"height":750},"child":[{"type":"Image","props":{"x":0,"skin":"images/room/bg.jpg","centerY":0}},{"type":"Box","props":{"x":0,"width":1334,"var":"middle_box","height":750,"centerY":0},"child":[{"type":"Box","props":{"y":110,"x":392,"name":"logo_box"},"child":[{"type":"SkeletonPlayer","props":{"y":271,"x":267,"url":"images/animation/loding.sk","name":"logo"}},{"type":"Image","props":{"y":249,"x":230,"skin":"images/load/nei.png","name":"neice"}}]},{"type":"Box","props":{"y":486,"x":282,"width":770,"name":"process_box","height":86},"child":[{"type":"Image","props":{"y":21,"x":26,"skin":"images/load/bg.png","name":"bg"}},{"type":"Label","props":{"y":68,"text":"加载中...","italic":true,"fontSize":20,"font":"Microsoft YaHei","color":"#fff","centerX":0,"bold":true}},{"type":"Box","props":{"y":24,"x":21,"name":"green_box"},"child":[{"type":"Image","props":{"skin":"images/load/green.png","name":"green","height":37,"sizeGrid":"0,24,0,18"}},{"type":"Image","props":{"skin":"images/load/light.png","name":"light"}}]},{"type":"Image","props":{"y":3,"x":0,"skin":"images/load/l.png","name":"left"}},{"type":"Image","props":{"y":17,"x":716,"width":52,"skin":"images/load/r.png","right":2,"name":"right","height":51}}]}]},{"type":"Box","props":{"x":0,"var":"bottom_box","bottom":0},"child":[{"type":"Label","props":{"y":-144,"width":1334,"height":144,"bgColor":"#000","alpha":0.58}},{"type":"Image","props":{"y":-135,"x":341,"skin":"images/load/fangchenmi.png"}}]}]};}
		]);
		return loadingUI;
	})(View);
var text_loadingUI=(function(_super){
		function text_loadingUI(){
			
		    this.ani1=null;

			text_loadingUI.__super.call(this);
		}

		CLASS$(text_loadingUI,'ui.load.text_loadingUI',_super);
		var __proto__=text_loadingUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(text_loadingUI.uiView);
		}

		STATICATTR$(text_loadingUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":141,"height":155},"child":[{"type":"Label","props":{"y":100,"x":0,"text":"加","name":"jia","fontSize":30,"font":"Microsoft YaHei","color":"#fff"},"compId":2},{"type":"Label","props":{"y":94,"x":35,"text":"载","name":"","fontSize":30,"font":"Microsoft YaHei","color":"#fff"},"compId":3},{"type":"Label","props":{"y":82,"x":70,"text":"中","name":"","fontSize":30,"font":"Microsoft YaHei","color":"#fff"},"compId":4},{"type":"Label","props":{"y":83.07692307692308,"x":108,"text":".","name":"","fontSize":30,"font":"Microsoft YaHei","color":"#fff"},"compId":5},{"type":"Label","props":{"y":93,"x":118,"text":".","name":"","fontSize":30,"font":"Microsoft YaHei","color":"#fff"},"compId":6},{"type":"Label","props":{"y":103,"x":128,"text":".","name":"","fontSize":30,"font":"Microsoft YaHei","color":"#fff"},"compId":7}],"animations":[{"nodes":[{"target":2,"keyframes":{"y":[{"value":100,"tweenMethod":"linearNone","tween":true,"target":2,"key":"y","index":0},{"value":70,"tweenMethod":"linearNone","tween":true,"target":2,"label":null,"key":"y","index":5},{"value":100,"tweenMethod":"linearNone","tween":true,"target":2,"key":"y","index":10}],"x":[{"value":0,"tweenMethod":"linearNone","tween":true,"target":2,"key":"x","index":0},{"value":0,"tweenMethod":"linearNone","tween":true,"target":2,"label":null,"key":"x","index":5},{"value":0,"tweenMethod":"linearNone","tween":true,"target":2,"key":"x","index":10}],"name":[{"value":"","tweenMethod":"linearNone","tween":false,"target":2,"key":"name","index":0},{"value":"jia","tweenMethod":"linearNone","tween":false,"target":2,"key":"name","index":10}]}},{"target":3,"keyframes":{"y":[{"value":100,"tweenMethod":"linearNone","tween":true,"target":3,"key":"y","index":0},{"value":100,"tweenMethod":"linearNone","tween":true,"target":3,"key":"y","index":2},{"value":70,"tweenMethod":"linearNone","tween":true,"target":3,"key":"y","index":7},{"value":100,"tweenMethod":"linearNone","tween":true,"target":3,"key":"y","index":12}],"x":[{"value":35,"tweenMethod":"linearNone","tween":true,"target":3,"key":"x","index":0},{"value":35,"tweenMethod":"linearNone","tween":true,"target":3,"key":"x","index":2},{"value":35,"tweenMethod":"linearNone","tween":true,"target":3,"key":"x","index":7}],"name":[{"value":"","tweenMethod":"linearNone","tween":false,"target":3,"key":"name","index":0},{"value":"","tweenMethod":"linearNone","tween":false,"target":3,"key":"name","index":2},{"value":"zai","tweenMethod":"linearNone","tween":false,"target":3,"key":"name","index":12}]}},{"target":4,"keyframes":{"y":[{"value":100,"tweenMethod":"linearNone","tween":true,"target":4,"key":"y","index":0},{"value":100,"tweenMethod":"linearNone","tween":true,"target":4,"label":null,"key":"y","index":4},{"value":70,"tweenMethod":"linearNone","tween":true,"target":4,"key":"y","index":9},{"value":100,"tweenMethod":"linearNone","tween":true,"target":4,"key":"y","index":14}],"x":[{"value":70,"tweenMethod":"linearNone","tween":true,"target":4,"key":"x","index":0},{"value":70,"tweenMethod":"linearNone","tween":true,"target":4,"label":null,"key":"x","index":4},{"value":70,"tweenMethod":"linearNone","tween":true,"target":4,"key":"x","index":9}],"text":[{"value":"中","tweenMethod":"linearNone","tween":false,"target":4,"key":"text","index":0},{"value":"中","tweenMethod":"linearNone","tween":false,"target":4,"label":null,"key":"text","index":4},{"value":"中","tweenMethod":"linearNone","tween":false,"target":4,"key":"text","index":14}],"name":[{"value":"","tweenMethod":"linearNone","tween":false,"target":4,"key":"name","index":0},{"value":"","tweenMethod":"linearNone","tween":false,"target":4,"label":null,"key":"name","index":4},{"value":"zhong","tweenMethod":"linearNone","tween":false,"target":4,"key":"name","index":14}]}},{"target":5,"keyframes":{"y":[{"value":100,"tweenMethod":"linearNone","tween":true,"target":5,"key":"y","index":0},{"value":100,"tweenMethod":"linearNone","tween":true,"target":5,"key":"y","index":8},{"value":80,"tweenMethod":"linearNone","tween":true,"target":5,"key":"y","index":13},{"value":100,"tweenMethod":"linearNone","tween":true,"target":5,"key":"y","index":18}],"x":[{"value":108,"tweenMethod":"linearNone","tween":true,"target":5,"key":"x","index":0},{"value":108,"tweenMethod":"linearNone","tween":true,"target":5,"key":"x","index":8},{"value":108,"tweenMethod":"linearNone","tween":true,"target":5,"key":"x","index":13},{"value":108,"tweenMethod":"linearNone","tween":true,"target":5,"key":"x","index":18}]}},{"target":6,"keyframes":{"y":[{"value":100,"tweenMethod":"linearNone","tween":true,"target":6,"key":"y","index":0},{"value":100,"tweenMethod":"linearNone","tween":true,"target":6,"key":"y","index":10},{"value":80,"tweenMethod":"linearNone","tween":true,"target":6,"key":"y","index":15},{"value":100,"tweenMethod":"linearNone","tween":true,"target":6,"key":"y","index":20}],"x":[{"value":118,"tweenMethod":"linearNone","tween":true,"target":6,"key":"x","index":0},{"value":118,"tweenMethod":"linearNone","tween":true,"target":6,"key":"x","index":10},{"value":118,"tweenMethod":"linearNone","tween":true,"target":6,"key":"x","index":15},{"value":118,"tweenMethod":"linearNone","tween":true,"target":6,"key":"x","index":20}]}},{"target":7,"keyframes":{"y":[{"value":100,"tweenMethod":"linearNone","tween":true,"target":7,"key":"y","index":0},{"value":100,"tweenMethod":"linearNone","tween":true,"target":7,"key":"y","index":12},{"value":80,"tweenMethod":"linearNone","tween":true,"target":7,"key":"y","index":17},{"value":100,"tweenMethod":"linearNone","tween":true,"target":7,"key":"y","index":22}],"x":[{"value":128,"tweenMethod":"linearNone","tween":true,"target":7,"key":"x","index":0},{"value":128,"tweenMethod":"linearNone","tween":true,"target":7,"key":"x","index":12},{"value":128,"tweenMethod":"linearNone","tween":true,"target":7,"key":"x","index":17},{"value":128,"tweenMethod":"linearNone","tween":true,"target":7,"key":"x","index":22}]}}],"name":"ani1","id":1,"frameRate":24,"action":0}]};}
		]);
		return text_loadingUI;
	})(View);
var bigPrizePopUI=(function(_super){
		function bigPrizePopUI(){
			

			bigPrizePopUI.__super.call(this);
		}

		CLASS$(bigPrizePopUI,'ui.pop.bigPrizePopUI',_super);
		var __proto__=bigPrizePopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(bigPrizePopUI.uiView);
		}

		STATICATTR$(bigPrizePopUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":783,"height":450,"centerX":0},"child":[{"type":"Label","props":{"width":1334,"height":1334,"centerY":0,"centerX":0,"bgColor":"#000","alpha":0.6}},{"type":"Label","props":{"y":300,"x":391,"width":507,"name":"dom_award","height":84,"font":"win_font","anchorY":0.5,"anchorX":0.5,"align":"center"}}]};}
		]);
		return bigPrizePopUI;
	})(View);
var commonPopUI=(function(_super){
		function commonPopUI(){
			
		    this.text_box=null;

			commonPopUI.__super.call(this);
		}

		CLASS$(commonPopUI,'ui.pop.commonPopUI',_super);
		var __proto__=commonPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(commonPopUI.uiView);
		}

		STATICATTR$(commonPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":783,"height":528},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/pop/popbg.png"}},{"type":"Image","props":{"y":406,"x":436,"skin":"images/pop/cancel.png","name":"btn_cancel"}},{"type":"Image","props":{"y":406,"x":77,"skin":"images/pop/confim.png","name":"btn_confirm"}},{"type":"Box","props":{"y":105,"x":62,"width":653,"var":"text_box","height":250},"child":[{"type":"Label","props":{"x":60,"wordWrap":true,"width":532,"valign":"middle","text":"全文RTS发货而同全文RTS发货而同全文RTS发货而同全文RTS发货而同全文RTS发货而","name":"text","leading":5,"fontSize":34,"font":"Microsoft YaHei","color":" #4ac9ff ","align":"center"}}]},{"type":"Image","props":{"y":38,"x":640,"skin":"images/pop/close.png","name":"btn_myClose"}}]};}
		]);
		return commonPopUI;
	})(Dialog);
var pop_helpUI=(function(_super){
		function pop_helpUI(){
			
		    this.help_glr=null;
		    this.dom_text=null;

			pop_helpUI.__super.call(this);
		}

		CLASS$(pop_helpUI,'ui.pop.pop_helpUI',_super);
		var __proto__=pop_helpUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(pop_helpUI.uiView);
		}

		STATICATTR$(pop_helpUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1215,"height":716},"child":[{"type":"Image","props":{"y":58,"x":4,"width":1211,"skin":"images/pop/help_bg.png","height":658}},{"type":"Image","props":{"y":4,"x":316,"skin":"images/pop/helpt.png"}},{"type":"Button","props":{"y":58,"x":1072,"stateNum":"1","skin":"images/pop/btn_close.png","name":"close1"}},{"type":"Button","props":{"y":567,"x":474,"stateNum":"1","skin":"images/pop/btn_goon.png","name":"close2"}},{"type":"Box","props":{"width":1215,"var":"help_glr","mouseThrough":true,"height":716},"child":[{"type":"Tab","props":{"y":617,"x":1001,"space":20,"selectedIndex":0,"name":"pagination","direction":"horizontal"},"child":[{"type":"Button","props":{"y":0,"x":0,"stateNum":"2","skin":"images/pop/btn_icon.png","name":"item0"}},{"type":"Button","props":{"y":0,"x":54,"stateNum":"2","skin":"images/pop/btn_icon.png","name":"item1"}}]},{"type":"Box","props":{"y":157,"x":63,"width":1089,"name":"con"},"child":[{"type":"ViewStack","props":{"y":0,"x":0,"selectedIndex":1,"name":"list"},"child":[{"type":"Box","props":{"name":"item0"},"child":[{"type":"Image","props":{"skin":"images/pop/help_0.png"}}]},{"type":"Box","props":{"y":0,"name":"item1"},"child":[{"type":"Image","props":{"skin":"images/pop/help_1.png"}},{"type":"Label","props":{"y":241,"x":948,"var":"dom_text","text":"0%","fontSize":27,"font":"Microsoft YaHei","color":"#3efffd"}}]}]}]}]}]};}
		]);
		return pop_helpUI;
	})(Dialog);
var pop_rankUI=(function(_super){
		function pop_rankUI(){
			
		    this.tabList=null;
		    this.tabPage=null;
		    this.myList0=null;
		    this.smallTab=null;
		    this.loading0=null;
		    this.smallList=null;
		    this.myList1=null;
		    this.inLoading1=null;
		    this.myList2=null;
		    this.inLoading2=null;
		    this.noLogin=null;

			pop_rankUI.__super.call(this);
		}

		CLASS$(pop_rankUI,'ui.pop.pop_rankUI',_super);
		var __proto__=pop_rankUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("ui.pop.richItemUI",ui.pop.richItemUI);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(pop_rankUI.uiView);
		}

		STATICATTR$(pop_rankUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1250,"height":658},"child":[{"type":"Image","props":{"y":0,"x":39,"skin":"images/pop/help_bg.png"}},{"type":"Button","props":{"y":2,"x":1112,"stateNum":1,"skin":"images/pop/btn_close.png","name":"close"}},{"type":"Image","props":{"y":60,"x":972,"skin":"images/pop/thb.png"}},{"type":"Image","props":{"y":37,"x":218,"width":686,"skin":"images/pop/rg1.png","height":576}},{"type":"Box","props":{"y":275,"x":920,"name":"richList"},"child":[{"type":"richItem","props":{"name":"item0","runtime":"ui.pop.richItemUI"}},{"type":"richItem","props":{"y":108,"x":0,"name":"item1","runtime":"ui.pop.richItemUI"}},{"type":"richItem","props":{"y":216,"x":0,"name":"item2","runtime":"ui.pop.richItemUI"}}]},{"type":"Tab","props":{"y":166,"x":0,"var":"tabList","selectedIndex":0},"child":[{"type":"Button","props":{"stateNum":2,"skin":"images/pop/btn_rank.png","name":"item0"}},{"type":"Button","props":{"y":115,"stateNum":2,"skin":"images/pop/btn_rocord.png","name":"item1"}},{"type":"Button","props":{"y":230,"stateNum":2,"skin":"images/pop/btn_myprize.png","name":"item2"}}]},{"type":"ViewStack","props":{"y":161,"x":247,"var":"tabPage","selectedIndex":2},"child":[{"type":"List","props":{"y":47,"x":13,"width":611,"var":"myList0","name":"item0","height":347},"child":[{"type":"Tab","props":{"y":-132,"x":4,"var":"smallTab"},"child":[{"type":"Button","props":{"stateNum":2,"skin":"images/pop/btn_day.png","name":"item0"}},{"type":"Button","props":{"x":193,"stateNum":2,"skin":"images/pop/btn_week.png","name":"item1"}},{"type":"Button","props":{"x":387,"stateNum":2,"skin":"images/pop/btn_month.png","name":"item2"}}]},{"type":"Box","props":{"y":-69,"x":-27.000000000000057},"child":[{"type":"Image","props":{"skin":"images/pop/rt.png"}},{"type":"Image","props":{"y":16,"x":45,"skin":"images/pop/aimingt.png"}},{"type":"Image","props":{"y":16,"x":173,"skin":"images/pop/playwet.png"}},{"type":"Image","props":{"y":16,"x":327,"skin":"images/pop/winMoneyt.png"}},{"type":"Image","props":{"y":16,"x":536,"skin":"images/pop/qushit.png"}}]},{"type":"Label","props":{"y":100,"x":-9,"width":627,"var":"loading0","text":"正在加载中","height":66,"fontSize":34,"font":"Microsoft YaHei","color":"#fff","align":"center"}},{"type":"List","props":{"y":0,"x":0,"width":600,"var":"smallList","height":347},"child":[{"type":"Box","props":{"name":"render"},"child":[{"type":"Label","props":{"x":7,"width":82,"text":1,"name":"item0","height":32,"fontSize":24,"font":"Microsoft YaHei","color":"#3fb3e4","align":"center"}},{"type":"Label","props":{"x":110,"width":133,"text":"小红小红...","overflow":"hidden","name":"item1","height":32,"fontSize":24,"font":"Microsoft YaHei","color":"#3fb3e4","align":"center"}},{"type":"Label","props":{"y":0,"x":311,"width":147,"text":"1212189...","name":"item2","height":32,"fontSize":24,"font":"Microsoft YaHei","color":"#3fb3e4","align":"center"}},{"type":"Clip","props":{"y":5,"x":531,"skin":"images/pop/clip_up.png","name":"item3","index":2,"clipY":3}},{"type":"Sprite","props":{"y":39,"width":600,"height":10},"child":[{"type":"Rect","props":{"width":600,"lineWidth":1,"height":2,"fillColor":"#12243e"}}]}]}]}]},{"type":"List","props":{"width":611,"var":"myList1","name":"item1","height":400},"child":[{"type":"Box","props":{"y":-81.99999999999997,"x":9.999999999999943},"child":[{"type":"Image","props":{"skin":"images/pop/rt.png"}},{"type":"Image","props":{"y":16,"x":274,"skin":"images/pop/playwet.png"}},{"type":"Image","props":{"y":19,"x":455,"skin":"images/pop/moneyt.png"}},{"type":"Image","props":{"y":19,"x":71,"skin":"images/pop/timet.png"}}]},{"type":"Label","props":{"y":135.99999999999994,"x":46,"width":532,"var":"inLoading1","text":"加载中...","overflow":"hidden","height":42,"fontSize":30,"font":"Microsoft YaHei","color":"#3fb3e4","align":"center"}},{"type":"Box","props":{"name":"render"},"child":[{"type":"Label","props":{"width":257,"text":"2017-09-09 18:34:00","overflow":"hidden","name":"item0","height":42,"fontSize":24,"font":"Microsoft YaHei","color":"#3fb3e4","align":"center"}},{"type":"Label","props":{"y":0,"x":251,"width":163,"text":"大笨蛋大笨蛋","overflow":"hidden","name":"item1","height":42,"fontSize":24,"font":"Microsoft YaHei","color":"#3fb3e4","align":"center"}},{"type":"Label","props":{"y":0,"x":453,"width":158,"text":344324532,"overflow":"hidden","name":"item2","height":42,"fontSize":24,"font":"Microsoft YaHei","color":"#3dfffd","align":"center"}},{"type":"Sprite","props":{"y":40,"x":10,"width":600,"height":10},"child":[{"type":"Rect","props":{"width":600,"lineWidth":1,"height":2,"fillColor":"#12243e"}}]}]}]},{"type":"List","props":{"y":10,"x":10,"width":611,"var":"myList2","name":"item2","height":392},"child":[{"type":"Box","props":{"y":-81.99999999999997,"x":9.999999999999943},"child":[{"type":"Image","props":{"skin":"images/pop/rt.png"}},{"type":"Image","props":{"y":19,"x":397,"skin":"images/pop/moneyt.png"}},{"type":"Image","props":{"y":19,"x":111,"skin":"images/pop/timet.png"}}]},{"type":"Label","props":{"y":135.99999999999994,"x":46,"width":532,"var":"inLoading2","text":"加载中...","overflow":"hidden","height":42,"fontSize":30,"font":"Microsoft YaHei","color":"#3fb3e4","align":"center"}},{"type":"Box","props":{"y":146.00000000000009,"x":119.00000000000006,"width":318,"var":"noLogin","height":41},"child":[{"type":"Label","props":{"y":0,"x":0,"width":233,"text":"您尚未登录,请","overflow":"hidden","height":41,"fontSize":30,"font":"Microsoft YaHei","color":"#3fb3e4","align":"center"}},{"type":"Label","props":{"y":0,"x":197,"width":107,"text":"登录","overflow":"hidden","height":41,"fontSize":30,"font":"Microsoft YaHei","color":"#fb3c39","bold":true,"align":"center"}}]},{"type":"Box","props":{"name":"render"},"child":[{"type":"Label","props":{"y":0,"x":0,"width":320,"text":"2017-09-09","overflow":"hidden","name":"item0","height":42,"fontSize":24,"font":"Microsoft YaHei","color":"#3fb3e4","align":"center"}},{"type":"Label","props":{"y":0,"x":332,"width":279,"text":0,"overflow":"hidden","name":"item1","height":42,"fontSize":24,"font":"Microsoft YaHei","color":"#3dfffd","align":"center"}},{"type":"Sprite","props":{"y":40,"x":10,"width":600,"height":10},"child":[{"type":"Rect","props":{"width":600,"lineWidth":1,"height":2,"fillColor":"#12243e"}}]}]}]}]}]};}
		]);
		return pop_rankUI;
	})(Dialog);
var pop_rechargeUI=(function(_super){
		function pop_rechargeUI(){
			
		    this.mschongzhi=null;
		    this.tabbox=null;
		    this.textinput=null;

			pop_rechargeUI.__super.call(this);
		}

		CLASS$(pop_rechargeUI,'ui.pop.pop_rechargeUI',_super);
		var __proto__=pop_rechargeUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(pop_rechargeUI.uiView);
		}

		STATICATTR$(pop_rechargeUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1215,"height":716},"child":[{"type":"Image","props":{"y":58,"x":4,"skin":"images/pop/help_bg.png"}},{"type":"Button","props":{"y":57,"x":1073,"stateNum":1,"skin":"images/pop/btn_close.png","name":"close"}},{"type":"Image","props":{"y":2,"x":329,"skin":"images/pop/rechargeT.png"}},{"type":"Button","props":{"y":591,"x":454,"var":"mschongzhi","stateNum":1,"skin":"images/pop/btn_recharge.png"}},{"type":"Label","props":{"y":118,"x":512,"width":239,"text":"1元=1钻石=500欢乐豆","height":45,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Label","props":{"y":567,"x":754,"width":349,"text":"充值钻石后将自动兑换为欢乐豆","height":45,"fontSize":24,"font":"Microsoft YaHei","color":"#51c0fe"}},{"type":"Box","props":{"y":152,"x":82},"child":[{"type":"Image","props":{"y":0,"x":0,"width":223,"skin":"images/pop/chongbg.png","height":320}},{"type":"Image","props":{"x":269,"skin":"images/pop/chongbg.png"}},{"type":"Image","props":{"x":538,"skin":"images/pop/chongbg.png"}},{"type":"Image","props":{"x":807,"skin":"images/pop/chongbg.png"}},{"type":"Image","props":{"y":86,"x":40,"skin":"images/pop/diamound1.png"}},{"type":"Image","props":{"y":77,"x":322,"skin":"images/pop/diamound2.png"}},{"type":"Image","props":{"y":75,"x":584,"skin":"images/pop/diamound3.png"}},{"type":"Image","props":{"y":73,"x":849,"skin":"images/pop/diamound4.png"}},{"type":"Image","props":{"y":248,"x":18,"skin":"images/pop/numbg.png"}},{"type":"Image","props":{"y":248,"x":286,"skin":"images/pop/numbg.png"}},{"type":"Image","props":{"y":248,"x":555,"skin":"images/pop/numbg.png"}},{"type":"Image","props":{"y":248,"x":823,"skin":"images/pop/numbg.png"}},{"type":"Image","props":{"y":255,"x":79,"skin":"images/pop/ten.png"}},{"type":"Image","props":{"y":255,"x":349,"skin":"images/pop/fif.png"}},{"type":"Image","props":{"y":255,"x":607,"skin":"images/pop/hun.png"}},{"type":"Image","props":{"y":255,"x":876,"skin":"images/pop/five.png"}}]},{"type":"Image","props":{"y":486.00000000000006,"x":91.00000000000006,"width":995,"skin":"images/pop/inputbg.png","height":70}},{"type":"Tab","props":{"y":152,"x":82,"var":"tabbox","selectedIndex":2},"child":[{"type":"Button","props":{"width":225,"stateNum":2,"skin":"images/pop/btn_chong.png","name":"item0","height":322}},{"type":"Button","props":{"x":267,"width":225,"stateNum":2,"skin":"images/pop/btn_chong.png","name":"item1","height":322}},{"type":"Button","props":{"x":537,"width":225,"stateNum":2,"skin":"images/pop/btn_chong.png","name":"item2","height":322}},{"type":"Button","props":{"x":806,"width":225,"stateNum":2,"skin":"images/pop/btn_chong.png","name":"item3","height":322}}]},{"type":"Label","props":{"y":501,"x":107,"width":971,"var":"textinput","text":"请输入大于0的整数","height":45,"fontSize":34,"font":"Microsoft YaHei","color":"#facea4"}}]};}
		]);
		return pop_rechargeUI;
	})(Dialog);
var richItemUI=(function(_super){
		function richItemUI(){
			

			richItemUI.__super.call(this);
		}

		CLASS$(richItemUI,'ui.pop.richItemUI',_super);
		var __proto__=richItemUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(richItemUI.uiView);
		}

		STATICATTR$(richItemUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":269,"height":88},"child":[{"type":"Image","props":{"y":0,"x":0,"width":269,"skin":"images/pop/rg.png","height":88}},{"type":"Image","props":{"y":32,"x":16,"skin":"images/pop/icon1.png","name":"icon"}},{"type":"Image","props":{"y":15,"x":75,"skin":"images/pop/title1.png","name":"title"}},{"type":"Image","props":{"y":46,"x":77,"width":190,"skin":"images/pop/textbg.png","height":29}},{"type":"Label","props":{"y":14,"x":149,"width":117,"text":"虚位以待","overflow":"visible","name":"userName","height":22,"fontSize":22,"font":"Microsoft YaHei","color":"#15f7ff","align":"center"}},{"type":"Label","props":{"y":49,"x":93,"width":182,"text":"0","name":"amount","height":22,"fontSize":22,"font":"Microsoft YaHei","color":"#fcffcb","align":"left"}}]};}
		]);
		return richItemUI;
	})(View);
var surprisePopUI=(function(_super){
		function surprisePopUI(){
			
		    this.pop_box=null;

			surprisePopUI.__super.call(this);
		}

		CLASS$(surprisePopUI,'ui.pop.surprisePopUI',_super);
		var __proto__=surprisePopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(surprisePopUI.uiView);
		}

		STATICATTR$(surprisePopUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1334,"height":750},"child":[{"type":"Label","props":{"width":1334,"height":1334,"centerY":0,"bgColor":"#000","alpha":0.6}},{"type":"Box","props":{"width":1334,"var":"pop_box","height":750,"centerY":0},"child":[{"type":"Label","props":{"y":334.9999999999999,"x":410.99999999999994,"width":495,"text":"200","name":"dom_award","height":32,"font":"win_font","align":"center"}},{"type":"Button","props":{"y":229,"x":818,"width":110,"name":"btn_close","height":68}}]}]};}
		]);
		return surprisePopUI;
	})(View);
var angleUI=(function(_super){
		function angleUI(){
			

			angleUI.__super.call(this);
		}

		CLASS$(angleUI,'ui.room.angleUI',_super);
		var __proto__=angleUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(angleUI.uiView);
		}

		STATICATTR$(angleUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":122,"visible":true,"mouseThrough":true,"height":122},"child":[{"type":"Label","props":{"y":36,"x":36,"width":50,"name":"btn_text","height":50}}]};}
		]);
		return angleUI;
	})(View);
var main_triangleUI=(function(_super){
		function main_triangleUI(){
			

			main_triangleUI.__super.call(this);
		}

		CLASS$(main_triangleUI,'ui.room.main_triangleUI',_super);
		var __proto__=main_triangleUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("SkeletonPlayer",laya.ani.bone.Skeleton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(main_triangleUI.uiView);
		}

		STATICATTR$(main_triangleUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":653,"height":609},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/trianglebg.png"}},{"type":"SkeletonPlayer","props":{"y":290,"x":438,"url":"images/animation/yellow_light.sk","name":"yellow_light"}},{"type":"Box","props":{"name":"angle_box"}},{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/top.png","mouseThrough":true}},{"type":"Box","props":{"name":"cancel_box","mouseThrough":true}}]};}
		]);
		return main_triangleUI;
	})(View);
var roomUI=(function(_super){
		function roomUI(){
			
		    this.top_box=null;
		    this.logo_box=null;
		    this.middle_box=null;
		    this.bottom_box=null;

			roomUI.__super.call(this);
		}

		CLASS$(roomUI,'ui.room.roomUI',_super);
		var __proto__=roomUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("SkeletonPlayer",laya.ani.bone.Skeleton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(roomUI.uiView);
		}

		STATICATTR$(roomUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"x":0,"width":1334,"height":750},"child":[{"type":"Image","props":{"skin":"images/room/bg.jpg","centerY":0,"centerX":0}},{"type":"Box","props":{"x":0,"width":1334,"var":"top_box","top":0,"height":87},"child":[{"type":"Image","props":{"x":0,"top":0,"skin":"images/room/upbg.png"}},{"type":"Box","props":{"y":16,"x":112,"name":"marquee_box"},"child":[{"type":"Image","props":{"skin":"images/room/marquee.png"}},{"type":"Box","props":{"y":9,"x":191,"width":331,"name":"marquee","height":28}}]},{"type":"Image","props":{"y":2,"x":20,"skin":"images/room/back.png","name":"btn_back"}},{"type":"Image","props":{"y":2,"x":152,"skin":"images/room/home.png","name":"btn_home"}},{"type":"Box","props":{"y":2,"x":633,"width":331,"name":"fudai_box"},"child":[{"type":"Box","props":{"y":41,"x":6,"visible":false,"name":"fudai_pop"},"child":[{"type":"Image","props":{"skin":"images/room/fudaipop.png"}},{"type":"Label","props":{"y":110,"x":233,"text":"0%","name":"fudai_rate","fontSize":20,"font":"Arial","color":"#fffc62"}}]},{"type":"Image","props":{"skin":"images/room/fudai.png"}},{"type":"Label","props":{"y":25,"x":136,"width":167,"text":"0","name":"award_num","height":28,"font":"light_font","align":"right"}}]},{"type":"Box","props":{"y":2,"x":968,"var":"logo_box"},"child":[{"type":"Image","props":{"skin":"images/room/logo.png"}},{"type":"Image","props":{"y":68,"x":102,"skin":"images/load/nei.png","scaleY":0.6,"scaleX":0.6}}]},{"type":"Image","props":{"y":2,"x":1207,"skin":"images/room/set.png","name":"btn_set"}},{"type":"Box","props":{"y":69.99999999999999,"x":1223,"visible":false,"name":"menu_box"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":84,"skin":"images/room/mean.png","name":"bg","height":168,"sizeGrid":"14,14,15,13"}},{"type":"Clip","props":{"y":30,"x":19,"skin":"images/room/clip_vice.png","name":"btn_voice","clipY":2}},{"type":"Image","props":{"y":100,"x":19,"skin":"images/room/wen.png","name":"btn_help"}},{"type":"Box","props":{"y":170,"x":19,"visible":false,"name":"btn_notice"},"child":[{"type":"Image","props":{"skin":"images/room/notice.png"}},{"type":"Image","props":{"y":7,"x":31,"skin":"images/room/red.png","name":"red"}}]}]}]},{"type":"Box","props":{"x":0,"width":1334,"var":"middle_box","mouseThrough":true,"height":750,"centerY":0},"child":[{"type":"Box","props":{"y":152,"x":80,"name":"left_bonus"},"child":[{"type":"SkeletonPlayer","props":{"y":22.00000000000003,"x":94.00000000000003,"url":"images/animation/bonus.sk","name":"bonus_skeleton"}},{"type":"Clip","props":{"y":44,"x":47,"skin":"images/room/clip_bonus.png","name":"item0","interval":250,"index":0,"clipY":2,"autoPlay":false,"anchorY":0.5,"anchorX":0.5}},{"type":"Clip","props":{"y":44,"x":139,"skin":"images/room/clip_bonus.png","name":"item1","interval":250,"clipY":2,"anchorY":0.5,"anchorX":0.5}},{"type":"Clip","props":{"y":44,"x":231,"skin":"images/room/clip_bonus.png","name":"item2","interval":250,"clipY":2,"anchorY":0.5,"anchorX":0.5}},{"type":"SkeletonPlayer","props":{"y":164.99999999999994,"x":136.99999999999997,"url":"images/animation/notice.sk","name":"notice_skeleton"}}]},{"type":"Box","props":{"y":152,"x":800,"name":"right_bonus"},"child":[{"type":"Clip","props":{"y":260,"x":338,"skin":"images/room/clip_base2.png","name":"base_gray","clipY":2}},{"type":"Clip","props":{"y":260,"x":212,"skin":"images/room/clip_base2.png","name":"base_purple","clipY":2}},{"type":"Clip","props":{"y":145,"x":338,"skin":"images/room/clip_base2.png","name":"base_cyan","clipY":2}},{"type":"Clip","props":{"y":145,"x":212,"skin":"images/room/clip_base2.png","name":"base_pink","clipY":2}},{"type":"Clip","props":{"y":145,"x":86,"skin":"images/room/clip_base2.png","name":"base_green","clipY":2}},{"type":"Clip","props":{"y":3,"x":319,"skin":"images/room/clip_base1.png","name":"base_blue","index":0,"clipY":2}},{"type":"Clip","props":{"y":3,"x":160,"skin":"images/room/clip_base1.png","name":"base_orange","index":0,"clipY":2}},{"type":"Clip","props":{"y":3,"x":2,"skin":"images/room/clip_base1.png","name":"base_colors","index":0,"clipY":2}},{"type":"Image","props":{"y":-55,"x":115,"skin":"images/room/helpr.png"}},{"type":"Image","props":{"y":32,"x":47,"skin":"images/room/basebg.png"}}]},{"type":"Box","props":{"y":82,"x":230,"name":"triangle","mouseThrough":true}},{"type":"Image","props":{"y":343,"x":1334,"visible":false,"skin":"images/room/chose.png","scaleY":1.3,"scaleX":1.3,"name":"choose_img"}}]},{"type":"Box","props":{"var":"bottom_box","bottom":0},"child":[{"type":"Image","props":{"x":0,"skin":"images/room/bottom.png"}},{"type":"Box","props":{"y":-17,"x":648,"name":"win_box"}},{"type":"Box","props":{"y":-35,"x":22,"width":240,"name":"dou_box","height":63},"child":[{"type":"Image","props":{"skin":"images/room/doubg.png"}},{"type":"Image","props":{"y":-8,"x":174,"skin":"images/room/add2.png","name":"btn_dou_add"}},{"type":"Label","props":{"y":17,"x":56,"width":112,"text":"0","name":"dou_num","height":28,"fontSize":22,"font":"Microsoft YaHei","color":"#35bdfb","align":"center"}}]},{"type":"Box","props":{"y":-35,"x":276,"name":"yu_box"},"child":[{"type":"Image","props":{"skin":"images/room/yubg.png"}},{"type":"Label","props":{"y":17,"x":63,"width":112,"text":"0","name":"yu_num","height":28,"fontSize":22,"font":"Microsoft YaHei","color":"#35bdfb","align":"center"}}]},{"type":"Box","props":{"y":-35,"x":797,"width":372,"name":"input_box","height":63},"child":[{"type":"Image","props":{"y":0,"x":40,"width":290,"skin":"images/room/inputbg.png","height":63}},{"type":"Image","props":{"y":0,"x":2,"skin":"images/room/sub.png","name":"btn_sub"}},{"type":"Image","props":{"x":284,"skin":"images/room/add.png","name":"btn_add"}},{"type":"Label","props":{"y":2,"x":79,"width":211,"valign":"middle","text":"100","name":"input_num","height":52,"fontSize":30,"font":"Microsoft YaHei","color":"#35bdfb","align":"center"}}]},{"type":"Image","props":{"y":-50,"skin":"images/room/max.png","right":5,"name":"btn_max"}},{"type":"Box","props":{"y":-166,"x":906,"width":394,"name":"start_box","height":104},"child":[{"type":"SkeletonPlayer","props":{"y":60,"x":219,"width":20,"url":"images/animation/btn_start.sk","name":"start_animate","height":28}},{"type":"SkeletonPlayer","props":{"y":103,"x":360,"url":"images/animation/finger.sk","scaleY":0.8,"scaleX":0.8,"name":"finger"}},{"type":"Button","props":{"y":17,"x":118,"width":262,"name":"btn_start","height":65}},{"type":"Button","props":{"y":25,"x":31,"width":58,"name":"btn_auto","height":65}},{"type":"Box","props":{"y":-311,"x":139,"visible":false,"name":"options_box"},"child":[{"type":"Image","props":{"width":221,"skin":"images/room/mean.png","height":314,"sizeGrid":"14,14,15,13"}},{"type":"Box","props":{"y":12,"x":14,"name":"item0"},"child":[{"type":"Image","props":{"skin":"images/room/jx.png"}}]},{"type":"Box","props":{"y":86,"x":14,"name":"item1"},"child":[{"type":"Image","props":{"skin":"images/room/awardbg.png"}},{"type":"Image","props":{"y":10,"x":52,"skin":"images/room/40.png"}}]},{"type":"Box","props":{"y":160,"x":14,"name":"item2"},"child":[{"type":"Image","props":{"skin":"images/room/awardbg.png"}},{"type":"Image","props":{"y":10,"x":52,"skin":"images/room/20.png"}}]},{"type":"Box","props":{"y":234,"x":14,"name":"item3"},"child":[{"type":"Image","props":{"skin":"images/room/awardbg.png"}},{"type":"Image","props":{"y":10,"x":52,"skin":"images/room/10.png"}}]}]},{"type":"Label","props":{"y":38,"x":34,"width":52,"visible":false,"name":"auto_times","height":45,"fontSize":33,"font":"Arial","color":"#fff","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":-139,"x":780,"visible":false,"name":"faster_box"},"child":[{"type":"Image","props":{"skin":"images/room/inputbg2.png"}},{"type":"Box","props":{"y":11,"x":10,"name":"item0"},"child":[{"type":"Image","props":{"skin":"images/room/timebg.png"}},{"type":"Label","props":{"y":3,"x":3,"width":103,"valign":"middle","text":"500","height":46,"fontSize":30,"font":"Microsoft YaHei","color":"#fff","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":11,"x":126,"name":"item1"},"child":[{"type":"Image","props":{"skin":"images/room/timebg.png"}},{"type":"Label","props":{"y":3,"x":3,"width":103,"valign":"middle","text":"1000","height":46,"fontSize":30,"font":"Microsoft YaHei","color":"#fff","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":11,"x":242,"name":"item2"},"child":[{"type":"Image","props":{"skin":"images/room/timebg.png"}},{"type":"Label","props":{"y":3,"x":3,"width":103,"valign":"middle","text":"5000","height":46,"fontSize":30,"font":"Microsoft YaHei","color":"#fff","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":11,"x":358,"name":"item3"},"child":[{"type":"Image","props":{"skin":"images/room/timebg.png"}},{"type":"Label","props":{"y":3,"x":3,"width":103,"valign":"middle","text":"10000","height":46,"fontSize":30,"font":"Microsoft YaHei","color":"#fff","bold":true,"align":"center"}}]}]},{"type":"Image","props":{"y":-271,"x":0,"skin":"images/room/light2.png"}},{"type":"Image","props":{"y":-315.00000000000006,"x":42.99999999999999,"skin":"images/room/rank.png","name":"btn_rank"}}]}]};}
		]);
		return roomUI;
	})(View);
var winUI=(function(_super){
		function winUI(){
			
		    this.win_skeleton=null;
		    this.win_text=null;

			winUI.__super.call(this);
		}

		CLASS$(winUI,'ui.room.winUI',_super);
		var __proto__=winUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("SkeletonPlayer",laya.ani.bone.Skeleton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(winUI.uiView);
		}

		STATICATTR$(winUI,
		['uiView',function(){return this.uiView={"type":"View","props":{},"child":[{"type":"SkeletonPlayer","props":{"y":0,"x":0,"var":"win_skeleton","url":"images/animation/win.sk"}},{"type":"Label","props":{"y":-16,"x":-63,"width":169,"var":"win_text","text":"888","height":32,"fontSize":32,"font":"Arial","color":"#ffdb16","bold":false,"align":"center"}}]};}
		]);
		return winUI;
	})(View);