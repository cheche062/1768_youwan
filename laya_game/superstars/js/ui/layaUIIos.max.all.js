var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var commonPopUI=(function(_super){
		function commonPopUI(){
			
		    this.txt_box=null;
		    this.btn_box=null;

			commonPopUI.__super.call(this);
		}

		CLASS$(commonPopUI,'ui.pop.commonPopUI',_super);
		var __proto__=commonPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(commonPopUI.uiView);
		}

		STATICATTR$(commonPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":640,"height":430},"child":[{"type":"Image","props":{"y":0,"x":0,"width":640,"skin":"pop/bg-base.png","name":"pop_bg","height":430,"sizeGrid":"50,62,70,54"}},{"type":"Box","props":{"y":32,"x":20,"var":"txt_box"},"child":[{"type":"Image","props":{"width":600,"skin":"pop/bottombg.png","name":"txt_bg","height":238,"sizeGrid":"31,41,42,44"}},{"type":"Label","props":{"y":64,"x":26,"wordWrap":true,"width":548,"text":"我是内容部分我是内","name":"txt_content","leading":5,"fontSize":28,"font":"Microsoft YaHei","color":"#c9bde1","align":"center"}}]},{"type":"Box","props":{"x":62,"var":"btn_box","bottom":20},"child":[{"type":"Box","props":{"name":"btn_sure"},"child":[{"type":"Image","props":{"skin":"pop/recharge/bg22.png"}},{"type":"Image","props":{"y":42,"x":75,"skin":"pop/recharge/queding.png"}}]},{"type":"Box","props":{"x":280,"name":"btn_no"},"child":[{"type":"Image","props":{"skin":"pop/recharge/bg1.png"}},{"type":"Image","props":{"y":41,"x":74,"skin":"pop/recharge/quxiao.png"}}]}]},{"type":"Button","props":{"top":-15,"stateNum":"1","skin":"pop/close-btn.png","right":-15,"name":"close"}}]};}
		]);
		return commonPopUI;
	})(Dialog);
var fudaiPopUI=(function(_super){
		function fudaiPopUI(){
			
		    this.dom_fudai=null;
		    this.dom_content_box=null;
		    this.text_content=null;

			fudaiPopUI.__super.call(this);
		}

		CLASS$(fudaiPopUI,'ui.pop.fudaiPopUI',_super);
		var __proto__=fudaiPopUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("SkeletonPlayer",laya.ani.bone.Skeleton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(fudaiPopUI.uiView);
		}

		STATICATTR$(fudaiPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":750,"height":1334},"child":[{"type":"SkeletonPlayer","props":{"y":613,"x":375,"var":"dom_fudai","url":"animate/fudai.sk"}},{"type":"Box","props":{"y":581,"x":165,"width":430,"var":"dom_content_box","height":47},"child":[{"type":"Label","props":{"y":0,"x":0,"width":430,"visible":true,"var":"text_content","text":"800","height":32,"font":"fudai_pop_font","align":"center"}}]}]};}
		]);
		return fudaiPopUI;
	})(Dialog);
var helpPopUI=(function(_super){
		function helpPopUI(){
			
		    this.help_glr=null;

			helpPopUI.__super.call(this);
		}

		CLASS$(helpPopUI,'ui.pop.helpPopUI',_super);
		var __proto__=helpPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(helpPopUI.uiView);
		}

		STATICATTR$(helpPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"y":0,"x":0,"width":700,"height":1040},"child":[{"type":"Image","props":{"y":0,"x":0,"width":700,"skin":"pop/bg-base.png","height":1040,"sizeGrid":"50,62,70,54"}},{"type":"Image","props":{"y":107,"x":18,"width":660,"skin":"pop/bottombg.png","height":909,"sizeGrid":"31,41,42,44"}},{"type":"Image","props":{"y":27,"x":234,"skin":"pop/help_txt.png"}},{"type":"Box","props":{"width":700,"var":"help_glr"},"child":[{"type":"Tab","props":{"y":943,"x":313,"space":30,"selectedIndex":0,"name":"pagination","direction":"horizontal"},"child":[{"type":"Button","props":{"stateNum":"2","skin":"pop/btn_help.png","name":"item0"}},{"type":"Button","props":{"y":10,"x":10,"stateNum":"2","skin":"pop/btn_help.png","name":"item1"}}]},{"type":"Box","props":{"y":126,"x":51,"name":"con"},"child":[{"type":"ViewStack","props":{"selectedIndex":1,"name":"list"},"child":[{"type":"Box","props":{"width":600,"name":"item0","height":808},"child":[{"type":"Image","props":{"skin":"pop/page1.png"}}]},{"type":"Box","props":{"y":0,"x":0,"width":600,"name":"item1","height":808},"child":[{"type":"Image","props":{"skin":"pop/page2.png"}}]}]}]}]},{"type":"Button","props":{"y":-16,"x":646,"stateNum":"1","skin":"pop/close-btn.png","name":"close1"}},{"type":"Image","props":{"y":966,"x":217,"skin":"pop/jump.png","name":"close2"}}]};}
		]);
		return helpPopUI;
	})(Dialog);
var rankPopUI=(function(_super){
		function rankPopUI(){
			
		    this.rich_box=null;
		    this.tab_nav=null;
		    this.tab_con=null;
		    this.list_rank_all=null;
		    this.list_rank_my=null;
		    this.dom_loading=null;
		    this.dom_unloaded=null;

			rankPopUI.__super.call(this);
		}

		CLASS$(rankPopUI,'ui.pop.rankPopUI',_super);
		var __proto__=rankPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(rankPopUI.uiView);
		}

		STATICATTR$(rankPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":712,"skin":"pop/clip_rich.png","height":1040},"child":[{"type":"Image","props":{"y":0,"x":0,"width":712,"skin":"pop/bg-base.png","height":1040,"sizeGrid":"50,62,70,54"}},{"type":"Box","props":{"y":76,"x":24,"var":"rich_box"},"child":[{"type":"Image","props":{"skin":"pop/top-bg.png"}},{"type":"Image","props":{"y":31,"x":0,"skin":"pop/rich.png"}},{"type":"Box","props":{"y":38,"x":240,"name":"item"},"child":[{"type":"Clip","props":{"visible":true,"skin":"pop/clip_richNew.png","name":"rank","clipY":3}},{"type":"Label","props":{"y":4,"x":57,"width":155,"text":"虚位以待...","name":"name","height":27,"fontSize":27,"font":"Microsoft YaHei","color":"#d9a5f6","bold":false}},{"type":"Label","props":{"y":4,"x":220,"width":169,"name":"point","height":27,"fontSize":27,"font":"Microsoft YaHei","color":"#dce2fa","bold":false}}]},{"type":"Box","props":{"y":98,"x":240,"name":"item"},"child":[{"type":"Clip","props":{"skin":"pop/clip_richNew.png","name":"rank","index":1,"clipY":3}},{"type":"Label","props":{"y":4,"x":57,"width":155,"text":"虚位以待...","name":"name","height":27,"fontSize":27,"font":"Microsoft YaHei","color":"#d9a5f6","bold":false}},{"type":"Label","props":{"y":4,"x":220,"width":169,"name":"point","height":27,"fontSize":27,"font":"Microsoft YaHei","color":"#dce2fa","bold":false}}]},{"type":"Box","props":{"y":158,"x":240,"name":"item"},"child":[{"type":"Clip","props":{"skin":"pop/clip_richNew.png","name":"rank","index":2,"clipY":3}},{"type":"Label","props":{"y":4,"x":57,"width":155,"text":"虚位以待...","name":"name","height":27,"fontSize":27,"font":"Microsoft YaHei","color":"#d9a5f6","bold":false}},{"type":"Label","props":{"y":4,"x":220,"width":169,"name":"point","height":27,"fontSize":27,"font":"Microsoft YaHei","color":"#dce2fa","bold":false}}]}]},{"type":"Image","props":{"y":-115,"x":112,"skin":"pop/phb.png","cacheAs":"normal"}},{"type":"Image","props":{"y":384,"x":21,"width":670,"skin":"pop/bottombg.png","height":632,"sizeGrid":"31,41,42,44"}},{"type":"Tab","props":{"y":310,"x":36,"var":"tab_nav","space":5,"selectedIndex":0,"direction":"horizontal"},"child":[{"type":"Button","props":{"stateNum":2,"skin":"pop/btn_day.png","name":"item0"}},{"type":"Button","props":{"stateNum":2,"skin":"pop/btn_week.png","name":"item1"}},{"type":"Button","props":{"stateNum":2,"skin":"pop/btn_month.png","name":"item2"}},{"type":"Button","props":{"stateNum":2,"skin":"pop/btn_my.png","name":"item3"}}]},{"type":"ViewStack","props":{"y":405,"x":61,"var":"tab_con","selectedIndex":0},"child":[{"type":"Box","props":{"name":"item0"},"child":[{"type":"HBox","props":{"y":0,"x":0,"space":35,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"skin":"pop/paim.png"}},{"type":"Image","props":{"skin":"pop/txt-playname.png"}},{"type":"Image","props":{"skin":"pop/txt-toubi.png"}},{"type":"Image","props":{"skin":"pop/paimbh.png"}}]},{"type":"Image","props":{"y":50,"x":1,"skin":"pop/xuxian.png"}},{"type":"List","props":{"y":66,"x":17,"width":573,"var":"list_rank_all","vScrollBarSkin":"pop/vscroll.png","spaceY":18,"height":500},"child":[{"type":"Box","props":{"space":45,"name":"render","height":50},"child":[{"type":"Clip","props":{"skin":"pop/clip_rich.png","name":"rankIcon","clipY":3}},{"type":"Label","props":{"y":2,"x":11,"width":34,"text":1,"name":"rankNum","height":26,"fontSize":26,"font":"Microsoft YaHei","color":"#fff","align":"left"}},{"type":"Label","props":{"y":2,"x":91,"width":160,"name":"name","height":26,"fontSize":26,"font":"Microsoft YaHei","color":"#fff","align":"center"}},{"type":"Label","props":{"y":2,"x":267,"width":160,"name":"point","fontSize":26,"font":"Microsoft YaHei","color":"#fff","align":"center"}},{"type":"Clip","props":{"y":3,"x":500,"skin":"pop/clip_tend.png","name":"tend","clipY":3}}]}]}]},{"type":"Box","props":{"y":0,"x":0,"name":"item1"},"child":[{"type":"HBox","props":{"y":0,"x":104,"space":200,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"skin":"pop/txt-time.png"}},{"type":"Image","props":{"skin":"pop/txt-yingde.png"}}]},{"type":"Image","props":{"y":50,"x":1,"skin":"pop/xuxian.png"}},{"type":"List","props":{"y":66,"x":-5,"width":595,"var":"list_rank_my","vScrollBarSkin":"pop/vscroll.png","spaceY":18,"height":500},"child":[{"type":"Box","props":{"y":0,"x":0,"width":540,"space":30,"name":"render","height":50},"child":[{"type":"Label","props":{"y":2,"x":0,"width":314,"text":"0","name":"time","height":26,"fontSize":26,"font":"Microsoft YaHei","color":"#fff","align":"center"}},{"type":"Image","props":{"y":2,"x":320,"visible":false,"skin":"pop/fudai-s.png","name":"isSelf"}},{"type":"Label","props":{"y":2,"x":380,"width":160,"text":"0","name":"point","fontSize":26,"font":"Microsoft YaHei","color":"#fff","align":"center"}}]}]}]}]},{"type":"Image","props":{"y":-15,"x":651,"skin":"pop/close-btn.png","name":"close_btn"}},{"type":"Label","props":{"y":664,"x":304,"visible":false,"var":"dom_loading","text":"加载中...","fontSize":26,"font":"Microsoft YaHei","color":"#fff"}},{"type":"Label","props":{"y":664,"x":304,"visible":false,"var":"dom_unloaded","underline":true,"text":"请登录...","fontSize":26,"font":"Microsoft YaHei","color":"#d9e200"}}]};}
		]);
		return rankPopUI;
	})(Dialog);
var rechargePopUI=(function(_super){
		function rechargePopUI(){
			
		    this.tab_nav=null;
		    this.btn_buy=null;
		    this.btn_input=null;

			rechargePopUI.__super.call(this);
		}

		CLASS$(rechargePopUI,'ui.pop.rechargePopUI',_super);
		var __proto__=rechargePopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(rechargePopUI.uiView);
		}

		STATICATTR$(rechargePopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":650,"height":1070},"child":[{"type":"Image","props":{"y":45,"x":0,"width":650,"skin":"pop/bg-base.png","height":1022,"sizeGrid":"50,62,70,54"}},{"type":"Box","props":{"y":-27,"x":-30,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"y":122,"x":51,"width":606,"skin":"pop/bottombg.png","height":837,"sizeGrid":"31,41,42,44"}},{"type":"Image","props":{"skin":"pop/recharge/top.png"}},{"type":"Image","props":{"y":12,"x":148,"skin":"pop/recharge/chong.png"}},{"type":"Image","props":{"y":163,"x":94,"skin":"pop/recharge/txt_asdf.png"}}]},{"type":"Tab","props":{"y":211,"x":55,"var":"tab_nav","selectedIndex":2},"child":[{"type":"Button","props":{"stateNum":"2","skin":"pop/recharge/btn_tab.png","name":"item0"}},{"type":"Button","props":{"y":0,"x":274,"stateNum":"2","skin":"pop/recharge/btn_tab.png","name":"item1"}},{"type":"Button","props":{"y":284,"x":0,"stateNum":"2","skin":"pop/recharge/btn_tab.png","name":"item2"}},{"type":"Button","props":{"y":284,"x":274,"stateNum":"2","skin":"pop/recharge/btn_tab.png","name":"item3"}}]},{"type":"Box","props":{"y":211,"x":55,"mouseThrough":true,"cacheAs":"bitmap"},"child":[{"type":"Box","props":{"width":266,"name":"item0","height":276},"child":[{"type":"Image","props":{"y":30,"x":45,"skin":"pop/recharge/coin_4.png"}},{"type":"Image","props":{"y":194,"x":28,"skin":"pop/recharge/bg_zhi.png"}},{"type":"Image","props":{"y":208,"x":92,"skin":"pop/recharge/10元.png"}}]},{"type":"Box","props":{"x":274,"width":266,"name":"item1","height":276},"child":[{"type":"Image","props":{"y":25,"x":53,"skin":"pop/recharge/coin_3.png"}},{"type":"Image","props":{"y":194,"x":28,"skin":"pop/recharge/bg_zhi.png"}},{"type":"Image","props":{"y":208,"x":92,"skin":"pop/recharge/50元.png"}}]},{"type":"Box","props":{"y":284,"width":266,"name":"item2","height":276},"child":[{"type":"Image","props":{"y":6,"x":33,"skin":"pop/recharge/coin_2.png"}},{"type":"Image","props":{"y":194,"x":28,"skin":"pop/recharge/bg_zhi.png"}},{"type":"Image","props":{"y":208,"x":81,"skin":"pop/recharge/100元.png"}}]},{"type":"Box","props":{"y":284,"x":274,"width":266,"name":"item3","height":276},"child":[{"type":"Image","props":{"y":5,"x":33,"skin":"pop/recharge/coin_1.png"}},{"type":"Image","props":{"y":194,"x":28,"skin":"pop/recharge/bg_zhi.png"}},{"type":"Image","props":{"y":208,"x":81,"skin":"pop/recharge/500元.png"}}]}]},{"type":"Box","props":{"y":943,"x":198,"var":"btn_buy"},"child":[{"type":"Button","props":{"stateNum":"1","skin":"pop/recharge/btn_bg.png"}},{"type":"Image","props":{"y":26,"x":54,"skin":"pop/recharge/txt_qcz.png"}}]},{"type":"Button","props":{"stateNum":"1","skin":"pop/close-btn.png","right":0,"name":"close"}},{"type":"Box","props":{"y":810,"x":68,"var":"btn_input"},"child":[{"type":"Image","props":{"skin":"pop/recharge/bg_input.png"}},{"type":"Label","props":{"y":16,"x":43,"text":"请输入大于0的整数","name":"input_txt","fontSize":30,"font":"Microsoft YaHei","color":"#bf93ca"}}]},{"type":"Label","props":{"y":891,"x":100,"text":"充值钻石成功后将为您自动兑换为欢乐豆","fontSize":25,"font":"Microsoft YaHei","color":"#a9a692"}}]};}
		]);
		return rechargePopUI;
	})(Dialog);
var warmNoticeUI=(function(_super){
		function warmNoticeUI(){
			
		    this.txt_box=null;
		    this.btn_box=null;

			warmNoticeUI.__super.call(this);
		}

		CLASS$(warmNoticeUI,'ui.pop.warmNoticeUI',_super);
		var __proto__=warmNoticeUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(warmNoticeUI.uiView);
		}

		STATICATTR$(warmNoticeUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":640,"height":460},"child":[{"type":"Image","props":{"y":0,"x":0,"width":640,"skin":"pop/bg-base.png","name":"pop_bg","height":460,"sizeGrid":"50,62,70,54"}},{"type":"Image","props":{"y":28,"x":227,"skin":"pop/recharge/wenxin.png"}},{"type":"Box","props":{"y":95,"x":20,"var":"txt_box"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":600,"skin":"pop/bottombg.png","name":"txt_bg","height":193,"sizeGrid":"31,41,42,44"}},{"type":"Label","props":{"y":64,"x":26,"wordWrap":true,"width":548,"text":"我是内容部分我是内","name":"txt_content","leading":5,"fontSize":28,"font":"Microsoft YaHei","color":"#c9bde1","align":"center"}}]},{"type":"Box","props":{"y":286,"x":202,"var":"btn_box","bottom":20},"child":[{"type":"Box","props":{"name":"btn_sure"},"child":[{"type":"Image","props":{"skin":"pop/recharge/bg22.png"}},{"type":"Image","props":{"y":42,"x":61,"skin":"pop/recharge/zhidao.png"}}]}]},{"type":"Button","props":{"top":-15,"stateNum":"1","skin":"pop/close-btn.png","right":-15,"name":"close"}}]};}
		]);
		return warmNoticeUI;
	})(Dialog);
var winPopUI=(function(_super){
		function winPopUI(){
			

			winPopUI.__super.call(this);
		}

		CLASS$(winPopUI,'ui.pop.winPopUI',_super);
		var __proto__=winPopUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("SkeletonPlayer",laya.ani.bone.Skeleton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(winPopUI.uiView);
		}

		STATICATTR$(winPopUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":750,"height":1334},"child":[{"type":"Label","props":{"width":1334,"text":"label","height":1334,"centerY":0,"centerX":0,"bgColor":"#000","alpha":0.5}},{"type":"SkeletonPlayer","props":{"y":696,"x":389,"url":"animate/win.sk","name":"dom_animate"}},{"type":"Label","props":{"y":696,"x":248,"width":294,"text":"+200","name":"dom_award","height":65,"font":"result_win_font","align":"center"}},{"type":"Label","props":{"y":630,"x":248,"width":294,"text":"*2","name":"dom_inner","height":65,"font":"yellow_font","align":"center"}},{"type":"Label","props":{"y":565,"x":248,"width":294,"text":"*1.2","name":"dom_outer","height":65,"font":"purple_font","align":"center"}}]};}
		]);
		return winPopUI;
	})(View);
var loadingUI=(function(_super){
		function loadingUI(){
			
		    this.dom_process_txt=null;
		    this.dom_process_img=null;

			loadingUI.__super.call(this);
		}

		CLASS$(loadingUI,'ui.room.loadingUI',_super);
		var __proto__=loadingUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(loadingUI.uiView);
		}

		STATICATTR$(loadingUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":750,"height":1334},"child":[{"type":"Image","props":{"y":0,"skin":"loading/loadingbg.jpg","centerX":0}},{"type":"Image","props":{"y":1180,"x":74,"skin":"loading/notice.png"}},{"type":"Image","props":{"y":1080,"x":70,"skin":"loading/bg.png","sizeGrid":"0,10,0,10"}},{"type":"Box","props":{"y":1018,"x":273},"child":[{"type":"Label","props":{"text":"加载中...","fontSize":30,"font":"Microsoft YaHei","color":"#fff","bold":false}},{"type":"Label","props":{"x":158,"var":"dom_process_txt","text":"0%","fontSize":30,"font":"Microsoft YaHei","color":"#fff","bold":false,"align":"right"}}]},{"type":"Image","props":{"y":1087,"x":75,"width":30,"var":"dom_process_img","skin":"loading/prosess.png","sizeGrid":"0,15,0,15"}},{"type":"Image","props":{"y":305,"x":584,"skin":"loading/neice.png"}}]};}
		]);
		return loadingUI;
	})(View);
var roomUI=(function(_super){
		function roomUI(){
			
		    this.dom_light_start=null;
		    this.middle_box=null;
		    this.rotation_box=null;
		    this.dom_small_light=null;
		    this.fudai_box=null;
		    this.star_box=null;
		    this.star_num_box=null;
		    this.bottom_box=null;
		    this.top_box=null;

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
		['uiView',function(){return this.uiView={"type":"View","props":{"y":0,"width":750,"name":"yu_num","height":1334},"child":[{"type":"Image","props":{"y":0,"skin":"room/roombg.jpg","centerX":0}},{"type":"SkeletonPlayer","props":{"y":710,"x":397,"var":"dom_light_start","url":"animate/light.sk"}},{"type":"Box","props":{"y":0,"x":1,"width":750,"var":"middle_box"},"child":[{"type":"SkeletonPlayer","props":{"y":624,"x":350,"url":"animate/girl.sk"}},{"type":"SkeletonPlayer","props":{"y":243,"x":372,"url":"animate/logo.sk"}},{"type":"Image","props":{"y":205.00000000000003,"x":536.0000000000001,"skin":"loading/neice.png"}},{"type":"Image","props":{"y":167,"x":620,"visible":false,"skin":"room/rank.png","name":"btn_rank"}},{"type":"Image","props":{"y":302,"x":646,"visible":false,"skin":"room/notice.png","name":"btn_notice"}},{"type":"Image","props":{"y":315,"x":699,"visible":false,"skin":"room/red.png","name":"dom_redPoint"}},{"type":"Box","props":{"y":654,"x":371,"width":749,"var":"rotation_box","rotation":0,"pivotY":375,"pivotX":375,"height":749},"child":[{"type":"Image","props":{"skin":"room/outround.png"}},{"type":"Label","props":{"y":85,"x":540,"text":"*8","rotation":30,"font":"outer_base_font","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":373,"x":710,"text":"*2","rotation":90,"font":"outer_base_font","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":664,"x":213,"text":"*4","rotation":210,"font":"outer_base_font","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":381,"x":45,"text":"*2","rotation":270,"font":"outer_base_font","anchorY":0.5,"anchorX":0.5}},{"type":"Box","props":{"y":631,"x":509,"name":"wenhao"},"child":[{"type":"Label","props":{"y":35,"x":33,"width":80,"text":"?","rotation":150,"height":32,"font":"outer_base_font","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":32,"x":25,"width":55,"visible":false,"skin":"room/bang.png","rotation":185,"pivotY":36.76662202421965,"pivotX":25.49976969737452,"height":75}}]},{"type":"Box","props":{"y":64,"x":183.1435929640691,"name":"wenhao"},"child":[{"type":"Label","props":{"y":23,"x":25,"width":80,"text":"?","rotation":330,"font":"outer_base_font","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":-9,"x":2,"visible":false,"skin":"room/bang.png"}}]}]},{"type":"SkeletonPlayer","props":{"y":650,"x":371,"url":"animate/spark.sk","name":"dom_fire_animate"}},{"type":"Image","props":{"y":326,"x":51,"skin":"room/round.png"}},{"type":"SkeletonPlayer","props":{"y":655,"x":372,"var":"dom_small_light","url":"animate/round.sk"}},{"type":"Box","props":{"y":473,"x":190,"width":360,"var":"fudai_box","height":360},"child":[{"type":"Image","props":{"y":145,"x":26,"width":307,"skin":"room/coin_bg.png","height":72}},{"type":"Image","props":{"y":48,"x":64,"skin":"room/fudai.png"}},{"type":"Image","props":{"y":238,"x":61,"skin":"room/win_bg.png"}},{"type":"SkeletonPlayer","props":{"y":96,"x":218,"url":"animate/magic.sk","name":"dom_magic"}},{"type":"Label","props":{"y":164,"x":39,"width":281,"text":"0","name":"fudai_all","height":32,"font":"fudai_all_font","align":"center"}},{"type":"Label","props":{"y":254,"x":115,"width":177,"text":"0","name":"fudai_win","height":32,"font":"fudai_win_font","align":"center"}},{"type":"Label","props":{"y":102,"x":240,"width":91,"text":"0/10","name":"bang_num","height":32,"fontSize":32,"font":"Microsoft YaHei","color":"#522c03","bold":true,"align":"right"}},{"type":"SkeletonPlayer","props":{"y":207,"x":200,"url":"animate/magic2.sk","name":"dom_magic_big"}}]},{"type":"Image","props":{"y":653,"x":372,"width":331,"skin":"room/saoguang.png","rotation":0,"pivotY":274,"pivotX":262,"name":"dom_three_light","height":228}},{"type":"Box","props":{"x":0,"var":"star_box"},"child":[{"type":"Image","props":{"y":368,"x":320,"skin":"room/star_blue.png"}},{"type":"Image","props":{"y":397,"x":443,"skin":"room/star_yellow.png"}},{"type":"Image","props":{"y":484,"x":522,"skin":"room/star_blue.png"}},{"type":"Image","props":{"y":604,"x":551,"skin":"room/star_yellow.png"}},{"type":"Image","props":{"y":720,"x":526,"skin":"room/star_blue.png"}},{"type":"Image","props":{"y":799,"x":436,"skin":"room/star_yellow.png"}},{"type":"Image","props":{"y":840,"x":321,"skin":"room/star_blue.png"}},{"type":"Image","props":{"y":799,"x":205,"skin":"room/star_yellow.png"}},{"type":"Image","props":{"y":719,"x":116,"skin":"room/star_blue.png"}},{"type":"Image","props":{"y":601,"x":90,"skin":"room/star_yellow.png"}},{"type":"Image","props":{"y":483,"x":124,"skin":"room/star_blue.png"}},{"type":"Image","props":{"y":397,"x":205,"skin":"room/star_yellow.png"}}]},{"type":"Box","props":{"x":-4,"var":"star_num_box","cacheAs":"bitmap"},"child":[{"type":"Image","props":{"y":406,"x":350,"skin":"room/1.2.png"}},{"type":"Image","props":{"y":435,"x":471,"skin":"room/1.5.png"}},{"type":"Image","props":{"y":523,"x":565,"skin":"room/2.png"}},{"type":"Image","props":{"y":642,"x":580,"skin":"room/1.2.png"}},{"type":"Image","props":{"y":759,"x":554,"skin":"room/1.5.png"}},{"type":"Image","props":{"y":837,"x":478,"skin":"room/2.png"}},{"type":"Image","props":{"y":879,"x":350,"skin":"room/1.2.png"}},{"type":"Image","props":{"y":837,"x":233,"skin":"room/1.5.png"}},{"type":"Image","props":{"y":758,"x":158,"skin":"room/2.png"}},{"type":"Image","props":{"y":640,"x":118,"skin":"room/1.2.png"}},{"type":"Image","props":{"y":522,"x":152,"skin":"room/1.5.png"}},{"type":"Image","props":{"y":435,"x":247,"skin":"room/2.png"}}]},{"type":"SkeletonPlayer","props":{"y":662,"x":369,"url":"animate/star.sk","name":"star_light"}},{"type":"SkeletonPlayer","props":{"y":656,"x":371,"url":"animate/star.sk","rotation":0,"name":"star_ladder"}}]},{"type":"Box","props":{"y":0,"x":0,"var":"bottom_box","mouseThrough":true},"child":[{"type":"Image","props":{"y":919,"x":22,"skin":"room/recharge.png","name":"btn_recharge"}},{"type":"Image","props":{"y":1100,"x":30,"skin":"room/help_bg.png"}},{"type":"Image","props":{"y":1216,"x":176,"skin":"room/sub.png","name":"btn_sub"}},{"type":"Image","props":{"y":1216,"x":623,"skin":"room/add.png","name":"btn_add"}},{"type":"Image","props":{"y":1216,"x":29,"skin":"room/max.png","name":"btn_max"}},{"type":"Box","props":{"y":980,"x":598,"width":144,"name":"start_blue_box","height":146},"child":[{"type":"SkeletonPlayer","props":{"y":80,"x":71,"url":"animate/button.sk"}}]},{"type":"Box","props":{"y":1067,"x":402,"width":144,"name":"start_yellow_box","height":146},"child":[{"type":"SkeletonPlayer","props":{"y":80,"x":71,"url":"animate/button.sk"}}]},{"type":"Box","props":{"y":1218,"x":285,"name":"input_box"},"child":[{"type":"Image","props":{"skin":"room/inp_bg.png"}},{"type":"Label","props":{"y":30,"x":39,"width":259,"text":"100","name":"dom_input","height":32,"font":"input_font","align":"center"}}]},{"type":"SkeletonPlayer","props":{"y":1127,"x":694,"url":"animate/finger.sk","name":"dom_finger","mouseEnabled":true}}]},{"type":"Box","props":{"y":0,"x":0,"width":"750","var":"top_box"},"child":[{"type":"Image","props":{"y":0,"x":13,"skin":"room/top_bg.png"}},{"type":"Image","props":{"y":9,"x":10,"skin":"room/back.png","name":"btn_back"}},{"type":"Image","props":{"y":98,"x":10,"skin":"room/home.png","name":"btn_home"}},{"type":"Box","props":{"y":93,"x":648,"visible":false,"name":"more_box"},"child":[{"type":"Image","props":{"skin":"pop/morebg.png"}},{"type":"Clip","props":{"y":89,"x":7,"skin":"pop/clip_sound.png","name":"sound_btn","clipY":2}},{"type":"Image","props":{"y":171,"x":7,"skin":"pop/help.png","name":"help_btn"}}]},{"type":"Image","props":{"y":98,"x":657,"skin":"room/caidan.png","name":"btn_menu"}},{"type":"Box","props":{"y":107,"x":45,"name":"marquee_box"},"child":[{"type":"Image","props":{"skin":"room/marquee_bg.png"}},{"type":"Box","props":{"y":0,"x":55,"width":549,"name":"dom_marquee","height":52}}]},{"type":"Box","props":{"y":9,"x":128,"name":"yu_box"},"child":[{"type":"Image","props":{"skin":"room/num_bg.png"}},{"type":"Image","props":{"y":-5,"x":-9,"skin":"room/you.png"}},{"type":"Image","props":{"y":-1,"x":217,"skin":"room/add_zhi.png","name":"btn_chong"}},{"type":"Label","props":{"y":10,"x":59,"width":157,"text":"0","name":"yu_num","height":30,"fontSize":30,"font":"Microsoft YaHei","color":"#c4c4c4","align":"right"}}]},{"type":"Box","props":{"y":9,"x":430,"name":"you_box"},"child":[{"type":"Image","props":{"skin":"room/num_bg.png"}},{"type":"Image","props":{"y":-1,"x":-8,"skin":"room/yu.png"}},{"type":"Label","props":{"y":10,"x":59,"width":157,"text":"0","name":"you_num","height":30,"fontSize":30,"font":"Microsoft YaHei","color":"#c4c4c4","align":"right"}}]}]}]};}
		]);
		return roomUI;
	})(View);
var testUI=(function(_super){
		function testUI(){
			

			testUI.__super.call(this);
		}

		CLASS$(testUI,'ui.room.testUI',_super);
		var __proto__=testUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(testUI.uiView);
		}

		STATICATTR$(testUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"x":407,"width":750,"height":1334}};}
		]);
		return testUI;
	})(View);