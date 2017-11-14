var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var loadUI=(function(_super){
		function loadUI(){
			
		    this.middle_box=null;
		    this.dom_skele=null;
		    this.loading_box=null;
		    this.load_img=null;
		    this.load_txt=null;

			loadUI.__super.call(this);
		}

		CLASS$(loadUI,'ui.loading.loadUI',_super);
		var __proto__=loadUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("SkeletonPlayer",laya.ani.bone.Skeleton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(loadUI.uiView);
		}

		STATICATTR$(loadUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1334,"height":750},"child":[{"type":"Box","props":{"width":1334,"var":"middle_box","height":750,"centerY":0},"child":[{"type":"SkeletonPlayer","props":{"y":379,"x":673,"var":"dom_skele","url":"images/animate/loading.sk","scaleY":1.5,"scaleX":1.5}},{"type":"Box","props":{"y":518,"x":141,"var":"loading_box"},"child":[{"type":"Image","props":{"skin":"images/load/barbg.png"}},{"type":"Image","props":{"y":5,"x":12,"width":60,"var":"load_img","skin":"images/load/loadbar.png","height":40,"sizeGrid":"0,24,0,20"}},{"type":"Label","props":{"y":6,"x":470,"var":"load_txt","text":"加载中...","fontSize":30,"font":"Microsoft YaHei","color":"#fff"}}]},{"type":"Image","props":{"x":338,"skin":"images/load/fangcm.png","bottom":0}},{"type":"Image","props":{"y":126,"x":910,"skin":"images/load/neice.png"}}]}]};}
		]);
		return loadUI;
	})(View);
var defaultBetPopUI=(function(_super){
		function defaultBetPopUI(){
			
		    this.dom_text=null;

			defaultBetPopUI.__super.call(this);
		}

		CLASS$(defaultBetPopUI,'ui.minpop.defaultBetPopUI',_super);
		var __proto__=defaultBetPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(defaultBetPopUI.uiView);
		}

		STATICATTR$(defaultBetPopUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"y":29,"x":142,"width":284,"height":58,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/logbg.png"}},{"type":"Label","props":{"y":12,"x":0,"wordWrap":true,"width":284,"var":"dom_text","leading":6,"fontSize":18,"font":"Microsoft YaHei","color":"#fff","align":"center"}}]};}
		]);
		return defaultBetPopUI;
	})(View);
var gainNoticeUI=(function(_super){
		function gainNoticeUI(){
			
		    this.domName=null;
		    this.domAmount=null;

			gainNoticeUI.__super.call(this);
		}

		CLASS$(gainNoticeUI,'ui.minpop.gainNoticeUI',_super);
		var __proto__=gainNoticeUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(gainNoticeUI.uiView);
		}

		STATICATTR$(gainNoticeUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":295,"height":151},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/zanhuo.png"}},{"type":"Label","props":{"y":23,"x":2,"width":295,"var":"domName","text":"车车在兜风","height":20,"fontSize":22,"font":"Microsoft YaHei","color":"#ffdc89","align":"center"}},{"type":"Label","props":{"y":86,"x":2,"width":295,"var":"domAmount","text":"800","height":20,"font":"notice_font","color":"#ffdc89","align":"center"}}]};}
		]);
		return gainNoticeUI;
	})(View);
var goodJobUI=(function(_super){
		function goodJobUI(){
			
		    this.dom_gxl=null;
		    this.dom_num=null;

			goodJobUI.__super.call(this);
		}

		CLASS$(goodJobUI,'ui.minpop.goodJobUI',_super);
		var __proto__=goodJobUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(goodJobUI.uiView);
		}

		STATICATTR$(goodJobUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":303,"height":93},"child":[{"type":"Image","props":{"skin":"images/room/goodjob.png"}},{"type":"Image","props":{"y":27,"x":40,"skin":"images/room/nice.png"}},{"type":"Image","props":{"y":27,"x":175,"var":"dom_gxl","skin":"images/room/gxl.png"}},{"type":"Label","props":{"y":29,"x":128,"var":"dom_num","text":"2","font":"notice_font"}}]};}
		]);
		return goodJobUI;
	})(View);
var menuUI=(function(_super){
		function menuUI(){
			
		    this.btn_voice=null;
		    this.btn_help=null;
		    this.domLine2=null;

			menuUI.__super.call(this);
		}

		CLASS$(menuUI,'ui.minpop.menuUI',_super);
		var __proto__=menuUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(menuUI.uiView);
		}

		STATICATTR$(menuUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":131},"child":[{"type":"Image","props":{"width":131,"skin":"images/load/morebg.png","name":"bg","height":284,"sizeGrid":"25,25,25,25"}},{"type":"Clip","props":{"y":25,"x":25,"var":"btn_voice","skin":"images/room/clip_voice.png","index":0,"clipY":2}},{"type":"Image","props":{"y":140,"x":-34,"skin":"images/room/linebg.png"}},{"type":"Button","props":{"y":162,"x":25,"var":"btn_help","stateNum":1,"skin":"images/room/btn_help.png"}},{"type":"Button","props":{"y":306,"x":25,"visible":false,"stateNum":1,"skin":"images/room/btn_notice.png","name":"btn_notice"},"child":[{"type":"Image","props":{"y":-21.999999999999943,"x":-59,"var":"domLine2","skin":"images/room/linebg.png"}},{"type":"Image","props":{"y":-0.9999999999999432,"x":64.99999999999996,"skin":"images/room/red.png","name":"red"}}]}]};}
		]);
		return menuUI;
	})(View);
var baidafjPopUI=(function(_super){
		function baidafjPopUI(){
			
		    this.dom_amount=null;
		    this.btn_confirm=null;
		    this.btn_close=null;
		    this.dom_title=null;

			baidafjPopUI.__super.call(this);
		}

		CLASS$(baidafjPopUI,'ui.popup.baidafjPopUI',_super);
		var __proto__=baidafjPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(baidafjPopUI.uiView);
		}

		STATICATTR$(baidafjPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1334,"height":750},"child":[{"type":"Label","props":{"y":277,"x":464,"width":425,"var":"dom_amount","leading":10,"height":80,"fontSize":30,"font":"Microsoft YaHei","color":"#fff","align":"center"}},{"type":"Button","props":{"y":413,"x":556,"var":"btn_confirm","stateNum":"1","skin":"images/pop/match/btn_bg.png"},"child":[{"type":"Image","props":{"y":16,"x":81,"skin":"images/pop/match/txt_confirm.png"}}]},{"type":"Button","props":{"y":130,"x":922,"width":100,"var":"btn_close","height":100}},{"type":"Clip","props":{"y":148,"x":621,"var":"dom_title","skin":"images/pop/tips/clip_title.png","clipY":2}}]};}
		]);
		return baidafjPopUI;
	})(Dialog);
var commonPopMatchUI=(function(_super){
		function commonPopMatchUI(){
			
		    this.pop_bg=null;
		    this.txt_content=null;
		    this.header=null;

			commonPopMatchUI.__super.call(this);
		}

		CLASS$(commonPopMatchUI,'ui.popup.commonPopMatchUI',_super);
		var __proto__=commonPopMatchUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(commonPopMatchUI.uiView);
		}

		STATICATTR$(commonPopMatchUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":625,"height":487},"child":[{"type":"Image","props":{"y":107,"x":0,"width":605,"var":"pop_bg","skin":"images/pop/tips/bg.png","height":383,"sizeGrid":"39,53,89,54"}},{"type":"Button","props":{"y":68,"x":541,"stateNum":"1","skin":"images/pop/match/btn_close.png","name":"close_btn"}},{"type":"Box","props":{"y":363,"x":174,"name":"btn_sure"},"child":[{"type":"Button","props":{"stateNum":"1","skin":"images/pop/match/btn_bg.png"}},{"type":"Image","props":{"y":17,"x":87,"skin":"images/pop/match/txt_confirm.png"}}]},{"type":"Label","props":{"y":227,"x":105,"wordWrap":true,"width":415,"var":"txt_content","text":"开始美金大赛开始了美金大赛开始了了","leading":10,"fontSize":24,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Box","props":{"y":-1,"x":86,"var":"header"},"child":[{"type":"Image","props":{"skin":"images/pop/tips/header.png"}},{"type":"Image","props":{"y":94,"x":184,"skin":"images/pop/tips/txt_haeder.png"}}]}]};}
		]);
		return commonPopMatchUI;
	})(Dialog);
var commonPopTipsUI=(function(_super){
		function commonPopTipsUI(){
			
		    this.pop_bg=null;
		    this.header=null;
		    this.txt_content=null;

			commonPopTipsUI.__super.call(this);
		}

		CLASS$(commonPopTipsUI,'ui.popup.commonPopTipsUI',_super);
		var __proto__=commonPopTipsUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(commonPopTipsUI.uiView);
		}

		STATICATTR$(commonPopTipsUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"y":0,"x":0,"width":625,"height":430},"child":[{"type":"Image","props":{"y":10,"x":0,"width":605,"var":"pop_bg","skin":"images/pop/tips/bg02.png","height":420,"sizeGrid":"140,71,105,71"}},{"type":"Image","props":{"y":25,"x":264,"var":"header","skin":"images/pop/tips/txt_haeder.png"}},{"type":"Label","props":{"y":182,"x":136,"wordWrap":true,"width":352,"var":"txt_content","text":"网络异常","leading":10,"fontSize":24,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Box","props":{"y":325,"x":187,"name":"btn_sure"},"child":[{"type":"Button","props":{"stateNum":"1","skin":"images/pop/match/btn_bg.png"}},{"type":"Image","props":{"y":17,"x":84,"skin":"images/pop/match/txt_confirm.png"}}]},{"type":"Button","props":{"y":0,"x":542,"stateNum":"1","skin":"images/pop/match/btn_close.png","name":"close_btn"}}]};}
		]);
		return commonPopTipsUI;
	})(Dialog);
var helpPopUI=(function(_super){
		function helpPopUI(){
			
		    this.help_glr=null;

			helpPopUI.__super.call(this);
		}

		CLASS$(helpPopUI,'ui.popup.helpPopUI',_super);
		var __proto__=helpPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(helpPopUI.uiView);
		}

		STATICATTR$(helpPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1095,"height":600},"child":[{"type":"Image","props":{"y":15,"x":0,"skin":"images/pop/rank/bg_rank.png"}},{"type":"Image","props":{"y":26,"x":491,"skin":"images/pop/help/txt_header.png"}},{"type":"Button","props":{"y":0,"x":1011.9999999999999,"stateNum":"1","skin":"images/pop/match/btn_close.png","name":"close_btn1"}},{"type":"Box","props":{"y":505,"x":435.99999999999994,"name":"close_btn2"},"child":[{"type":"Button","props":{"stateNum":"1","skin":"images/pop/match/btn_bg.png"}},{"type":"Image","props":{"y":18,"x":62,"skin":"images/pop/help/txt_btn.png"}}]},{"type":"Box","props":{"y":509,"x":354.9999999999999,"name":"btn_left"},"child":[{"type":"Image","props":{"y":-0.9999999999999432,"x":-0.9999999999999432,"skin":"images/pop/help/btn_arrow.png"}},{"type":"Image","props":{"y":9.000000000000057,"x":21.000000000000057,"skin":"images/pop/help/arrow_left.png"}}]},{"type":"Box","props":{"y":508,"x":674,"name":"btn_right"},"child":[{"type":"Image","props":{"y":-0.9999999999999432,"skin":"images/pop/help/btn_arrow.png"}},{"type":"Image","props":{"y":11.000000000000057,"x":29,"skin":"images/pop/help/arrow_right.png"}}]},{"type":"Box","props":{"y":104,"x":109.99999999999997,"var":"help_glr"},"child":[{"type":"Tab","props":{"y":383,"x":413,"width":74,"selectedIndex":0,"name":"pagination","height":17},"child":[{"type":"Button","props":{"y":8.499124621995861,"x":2.976285214069776,"width":11,"stateNum":"2","skin":"images/pop/help/btn_help.png","pivotY":8.499124621995861,"pivotX":2.976285214069719,"name":"item0","height":12}},{"type":"Button","props":{"y":8.499124621995861,"x":22.976285214069776,"width":11,"stateNum":"2","skin":"images/pop/help/btn_help.png","pivotY":8.499124621995861,"pivotX":2.976285214069719,"name":"item1","height":12}},{"type":"Button","props":{"y":8.499124621995861,"x":42.976285214069776,"width":11,"stateNum":"2","skin":"images/pop/help/btn_help.png","pivotY":8.499124621995861,"pivotX":2.976285214069719,"name":"item2","height":12}},{"type":"Button","props":{"y":8.499124621995861,"x":62.976285214069776,"width":11,"stateNum":"2","skin":"images/pop/help/btn_help.png","pivotY":8.499124621995861,"pivotX":2.976285214069719,"name":"item3","height":12}}]},{"type":"Box","props":{"y":0,"x":-69,"width":993,"name":"con","height":380},"child":[{"type":"ViewStack","props":{"y":-3,"x":8,"width":982,"selectedIndex":1,"name":"list","height":380},"child":[{"type":"Box","props":{"y":0,"x":-6,"width":993,"name":"item0","height":386},"child":[{"type":"Image","props":{"y":0,"x":59,"skin":"images/pop/help/banner_01.png"}}]},{"type":"Box","props":{"y":-2.842170943040401e-14,"x":-6.000000000000028,"width":993,"name":"item1","height":386},"child":[{"type":"Image","props":{"y":6,"x":129,"width":735,"skin":"images/pop/help/banner_02.png","height":374}},{"type":"Label","props":{"y":5,"x":370,"width":83,"text":"500000","name":"bet","height":25,"fontSize":22,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":37,"x":370,"width":83,"text":"500000","name":"bet","height":25,"fontSize":22,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":70,"x":370,"width":83,"text":"500000","name":"bet","height":25,"fontSize":22,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":102,"x":370,"width":83,"text":"500000","name":"bet","height":25,"fontSize":22,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}}]},{"type":"Box","props":{"y":-2.842170943040401e-14,"x":-6.000000000000028,"width":993,"name":"item2","height":386},"child":[{"type":"Image","props":{"y":0,"x":2,"skin":"images/pop/help/banner_03.png"}}]},{"type":"Box","props":{"y":0,"x":-6,"width":993,"name":"item3","height":386},"child":[{"type":"Image","props":{"y":0,"x":2,"skin":"images/pop/help/banner_04.png"}}]}]}]}]}]};}
		]);
		return helpPopUI;
	})(Dialog);
var matchFinishPopUI=(function(_super){
		function matchFinishPopUI(){
			
		    this.awardResult=null;
		    this.list_rank_all=null;
		    this.dom_loading=null;
		    this.dom_unloaded=null;
		    this.winAmount=null;
		    this.rankTitle=null;
		    this.txt_title01=null;
		    this.txt_title02=null;
		    this.txt_title03=null;
		    this.my_rank=null;
		    this.amountTitle=null;
		    this.txt_title04=null;
		    this.my_amount=null;
		    this.txt_title05=null;
		    this.rankTips=null;
		    this.matchFile=null;
		    this.no_rank=null;
		    this.tipsTime=null;
		    this.amountTips=null;
		    this.nextTime=null;

			matchFinishPopUI.__super.call(this);
		}

		CLASS$(matchFinishPopUI,'ui.popup.matchFinishPopUI',_super);
		var __proto__=matchFinishPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(matchFinishPopUI.uiView);
		}

		STATICATTR$(matchFinishPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"y":0,"x":0,"width":1334,"height":689},"child":[{"type":"Image","props":{"y":169,"x":77,"width":1189,"skin":"images/pop/match/bg_match.png","height":517}},{"type":"Image","props":{"y":171.00000000000003,"x":0,"skin":"images/pop/match/bg_line2.png"}},{"type":"Box","props":{"y":-97,"x":360,"width":590,"height":356},"child":[{"type":"Image","props":{"y":0,"x":81,"skin":"images/pop/match/bg_header2.png"}},{"type":"Image","props":{"y":126,"x":0,"skin":"images/pop/match/bg_header.png"}},{"type":"Image","props":{"y":225,"x":219,"skin":"images/pop/match/txt_header2.png"}}]},{"type":"Image","props":{"y":306,"x":193,"width":947,"skin":"images/pop/match/bg_content.png","height":296,"sizeGrid":"15,12,19,12"}},{"type":"Box","props":{"y":320,"x":329,"width":705,"var":"awardResult","height":265},"child":[{"type":"Box","props":{},"child":[{"type":"Image","props":{"y":1,"x":0,"skin":"images/pop/match/txt_rank.png"}},{"type":"Image","props":{"y":0,"x":149,"skin":"images/pop/match/txt_niki.png"}},{"type":"Image","props":{"y":0,"x":337,"skin":"images/pop/match/txt_win.png"}},{"type":"Image","props":{"y":0,"x":558,"skin":"images/pop/match/txt_device.png"}}]},{"type":"List","props":{"y":49,"x":4,"width":699,"var":"list_rank_all","vScrollBarSkin":"images/pop/match/vscroll.png","height":201},"child":[{"type":"Box","props":{"y":0,"x":-2,"name":"render"},"child":[{"type":"Clip","props":{"y":0,"skin":"images/pop/match/clip_rank.png","name":"rankIcon","clipY":3}},{"type":"Label","props":{"y":9,"x":0,"width":34,"text":"12","name":"rankNum","height":18,"fontSize":18,"color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":9,"x":82,"width":175,"text":"咚咚咚咚","name":"nick","height":18,"fontSize":18,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":9,"x":284,"width":192,"text":"1000000","name":"winAmount","height":18,"fontSize":18,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":9,"x":524,"width":164,"text":"1000000","name":"deviceAmount","height":18,"fontSize":18,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}}]}]}]},{"type":"Box","props":{"y":314.00000000000006,"x":275},"child":[{"type":"Image","props":{"y":45,"x":0,"skin":"images/pop/match/bg_line.png"}},{"type":"Image","props":{"y":-4,"x":239,"skin":"images/pop/match/bg_top_shadow.png"}}]},{"type":"Box","props":{"y":609.9999999999998,"x":565,"name":"close_btn2"},"child":[{"type":"Button","props":{"y":-0.9999999999998863,"stateNum":"1","skin":"images/pop/match/btn_bg.png"}},{"type":"Image","props":{"y":20.000000000000114,"x":82,"skin":"images/pop/match/txt_confirm.png"}}]},{"type":"Button","props":{"y":133.99999999999997,"x":1136,"stateNum":"1","skin":"images/pop/match/btn_close.png","name":"close_btn1"}},{"type":"Label","props":{"y":455,"x":603,"width":25,"var":"dom_loading","text":"加载中……","height":12,"fontSize":22,"font":"Microsoft YaHei","color":"#fff","align":"center"}},{"type":"Label","props":{"y":455,"x":603,"width":120,"var":"dom_unloaded","text":"请登录……","height":28,"fontSize":22,"font":"Microsoft YaHei","color":"#d9e200","align":"center"}},{"type":"Box","props":{"y":217,"x":0,"width":1334,"var":"winAmount","height":83},"child":[{"type":"Box","props":{"y":0,"x":543,"var":"rankTitle"},"child":[{"type":"Image","props":{"y":1,"x":0,"width":150,"var":"txt_title01","skin":"images/pop/match/txt_title.png"}},{"type":"Image","props":{"y":1,"x":151,"width":35,"var":"txt_title02","skin":"images/pop/match/txt_title2.png"}},{"type":"Image","props":{"y":0,"x":213,"width":35,"var":"txt_title03","skin":"images/pop/match/txt_title3.png"}},{"type":"Label","props":{"y":0,"x":188,"var":"my_rank","text":"2","height":29,"fontSize":30,"font":"num2_font","color":"#c63a37"}}]},{"type":"Box","props":{"y":38,"x":575,"var":"amountTitle","height":45},"child":[{"type":"Image","props":{"y":5,"width":75,"var":"txt_title04","skin":"images/pop/match/txt_title4.png"}},{"type":"Label","props":{"y":-1,"x":77,"var":"my_amount","text":"3","height":46,"font":"num3_font"}},{"type":"Image","props":{"y":5,"x":108,"width":75,"var":"txt_title05","skin":"images/pop/match/txt_title5.png"}}]},{"type":"Label","props":{"y":48,"x":507,"var":"rankTips","text":"下次努力，离瓜分奖金只有一步之遥","fontSize":20,"font":"Microsoft YaHei","color":"#f3e5d1","align":"center"}},{"type":"Box","props":{"y":-3,"x":227,"width":880,"var":"matchFile","height":72},"child":[{"type":"Image","props":{"y":0,"x":290,"var":"no_rank","skin":"images/pop/match/no_rank.png"}},{"type":"Box","props":{"y":45,"x":262,"var":"tipsTime"},"child":[{"type":"Label","props":{"y":0,"x":1,"var":"amountTips","text":"无需灰心，下次战场开启时间为：","fontSize":20,"font":"Microsoft YaHei","color":"#f3e5d1"}},{"type":"Label","props":{"y":1,"x":300,"var":"nextTime","text":"45555","fontSize":19,"font":"Microsoft YaHei","color":"#fef173"}}]}]}]}]};}
		]);
		return matchFinishPopUI;
	})(Dialog);
var matchHistoryPopUI=(function(_super){
		function matchHistoryPopUI(){
			
		    this.time_award=null;
		    this.last_extra_time=null;
		    this.win_result=null;
		    this.my_rank=null;
		    this.my_amount=null;
		    this.awardResult=null;
		    this.list_rank_all=null;
		    this.dom_loading=null;
		    this.dom_unloaded=null;

			matchHistoryPopUI.__super.call(this);
		}

		CLASS$(matchHistoryPopUI,'ui.popup.matchHistoryPopUI',_super);
		var __proto__=matchHistoryPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(matchHistoryPopUI.uiView);
		}

		STATICATTR$(matchHistoryPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1040,"height":600},"child":[{"type":"Image","props":{"y":15,"x":0,"width":1021,"skin":"images/pop/match/bg_award.png","height":585}},{"type":"Button","props":{"y":0,"x":957,"stateNum":"1","skin":"images/pop/match/btn_close.png","name":"close_btn1"}},{"type":"Image","props":{"y":27,"x":448,"width":143,"skin":"images/pop/match/txt_header.png","height":39}},{"type":"Image","props":{"y":132,"x":41,"width":938,"skin":"images/pop/match/bg_content.png","height":287,"sizeGrid":"15,12,19,12"}},{"type":"Image","props":{"y":13,"x":56,"skin":"images/pop/match/bg_line.png"}},{"type":"Image","props":{"y":179.99999999999997,"x":128.00000000000009,"width":784,"skin":"images/pop/match/bg_line.png","height":3}},{"type":"Image","props":{"y":337.00000000000006,"x":319.99999999999994,"skin":"images/pop/match/bg_bottom_shadow.png"}},{"type":"Image","props":{"y":131,"x":366.99999999999983,"skin":"images/pop/match/bg_top_shadow.png"}},{"type":"Box","props":{"y":502,"x":394.9999999999999,"name":"close_btn2"},"child":[{"type":"Button","props":{"stateNum":"1","skin":"images/pop/match/btn_bg.png","label":"label"}},{"type":"Image","props":{"y":15,"x":81,"skin":"images/pop/match/txt_confirm.png"}}]},{"type":"Box","props":{"y":91,"x":337,"var":"time_award"},"child":[{"type":"Label","props":{"y":0,"width":148,"text":"上期分奖时间：","height":24,"fontSize":21,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":0,"x":172,"width":232,"var":"last_extra_time","text":"2017-10-20 17:30:52","height":24,"fontSize":21,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}}]},{"type":"Box","props":{"y":434,"x":41,"var":"win_result"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":938,"skin":"images/pop/match/bg_content.png","height":54,"sizeGrid":"15,12,19,12"}},{"type":"Label","props":{"y":13,"x":279,"width":90,"text":"我的排名：","height":28,"fontSize":18,"font":"Microsoft YaHei","color":"#fff8e9"}},{"type":"Label","props":{"y":13,"x":377,"width":104,"var":"my_rank","text":"第8224名","height":28,"fontSize":18,"font":"Microsoft YaHei","color":"#fff8e9","align":"left"}},{"type":"Label","props":{"y":13,"x":495,"width":90,"text":"分得奖金：","height":28,"fontSize":18,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":13,"x":587,"width":108,"var":"my_amount","text":"124444555555","height":28,"fontSize":18,"font":"Microsoft YaHei","color":"#fff8e9","align":"left"}}]},{"type":"Box","props":{"y":145,"x":169,"var":"awardResult"},"child":[{"type":"Box","props":{},"child":[{"type":"Image","props":{"y":1,"skin":"images/pop/match/txt_rank.png"}},{"type":"Image","props":{"x":162,"skin":"images/pop/match/txt_niki.png"}},{"type":"Image","props":{"x":353,"skin":"images/pop/match/txt_win.png"}},{"type":"Image","props":{"x":596,"skin":"images/pop/match/txt_device.png"}}]},{"type":"List","props":{"y":50,"x":3,"width":740,"var":"list_rank_all","vScrollBarSkin":"images/pop/match/vscroll.png","spaceY":1,"height":202},"child":[{"type":"Box","props":{"name":"render"},"child":[{"type":"Clip","props":{"skin":"images/pop/match/clip_rank.png","name":"rankIcon","clipY":3}},{"type":"Label","props":{"y":6,"x":10,"width":29,"text":"1","name":"rankNum","height":26,"fontSize":18,"font":"Microsoft YaHei","color":"#fff8e9"}},{"type":"Label","props":{"y":0,"x":89,"width":186,"text":"咚咚咚咚","name":"nick","height":31,"fontSize":18,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":0,"x":301,"width":186,"text":"2544","name":"winAmount","height":31,"fontSize":18,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":0,"x":545,"width":186,"text":"24","name":"deviceAmount","height":31,"fontSize":18,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}}]}]}]},{"type":"Label","props":{"y":285,"x":462,"width":97,"var":"dom_loading","text":"加载中……","height":31,"fontSize":22,"font":"Microsoft YaHei","color":"#fff","align":"center"}},{"type":"Label","props":{"y":285,"x":462,"width":97,"var":"dom_unloaded","text":"请登录……","height":31,"fontSize":22,"font":"Microsoft YaHei","color":"#d9e200","align":"center"}}]};}
		]);
		return matchHistoryPopUI;
	})(Dialog);
var rankPopUI=(function(_super){
		function rankPopUI(){
			
		    this.bg_content=null;
		    this.tab_nav=null;
		    this.tab_con=null;
		    this.list_rank_all=null;
		    this.list_rank_award=null;
		    this.list_rank_gains=null;
		    this.dom_loading=null;
		    this.dom_unloaded=null;
		    this.myrank=null;

			rankPopUI.__super.call(this);
		}

		CLASS$(rankPopUI,'ui.popup.rankPopUI',_super);
		var __proto__=rankPopUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("ui.popup.richitemUI",ui.popup.richitemUI);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(rankPopUI.uiView);
		}

		STATICATTR$(rankPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1095,"height":600},"child":[{"type":"Image","props":{"y":15,"x":0,"skin":"images/pop/rank/bg_rank.png"}},{"type":"Image","props":{"y":26,"x":491,"skin":"images/pop/rank/txt_header.png"}},{"type":"Button","props":{"y":0,"x":1012,"stateNum":"1","skin":"images/pop/match/btn_close.png","name":"close_btn"}},{"type":"Image","props":{"y":95.00000000000003,"x":48.000000000000014,"skin":"images/pop/rank/rich.png"}},{"type":"Box","props":{"y":258,"x":-14,"width":298,"name":"richList","height":238},"child":[{"type":"richitem","props":{"y":1,"x":16,"name":"item","runtime":"ui.popup.richitemUI"}},{"type":"richitem","props":{"y":83,"x":16,"name":"item","runtime":"ui.popup.richitemUI"}},{"type":"richitem","props":{"y":163,"x":16,"name":"item","runtime":"ui.popup.richitemUI"}}]},{"type":"Box","props":{"y":183,"x":266,"var":"bg_content"},"child":[{"type":"Image","props":{"y":3,"width":786,"skin":"images/pop/match/bg_content.png","height":374,"sizeGrid":"15,12,19,12"}},{"type":"Image","props":{"y":292,"x":206,"skin":"images/pop/match/bg_bottom_shadow.png"}},{"type":"Image","props":{"x":242,"skin":"images/pop/match/bg_top_shadow.png"}},{"type":"Image","props":{"y":56,"width":784,"skin":"images/pop/match/bg_line.png","height":3}}]},{"type":"Tab","props":{"y":93,"x":266,"var":"tab_nav","selectedIndex":0},"child":[{"type":"Button","props":{"stateNum":"2","skin":"images/pop/rank/btn_day.png","name":"item0"}},{"type":"Button","props":{"x":158,"stateNum":"2","skin":"images/pop/rank/btn_week.png","name":"item1"}},{"type":"Button","props":{"x":316,"stateNum":"2","skin":"images/pop/rank/btn_month.png","name":"item2"}},{"type":"Button","props":{"x":474,"stateNum":"2","skin":"images/pop/rank/btn_award.png","name":"item3"}},{"type":"Button","props":{"x":632,"stateNum":"2","skin":"images/pop/rank/btn_gains.png","name":"item4"}}]},{"type":"ViewStack","props":{"y":204,"x":295,"var":"tab_con","selectedIndex":1},"child":[{"type":"Box","props":{"y":-1,"x":42,"name":"item0"},"child":[{"type":"Box","props":{},"child":[{"type":"Image","props":{"skin":"images/pop/match/txt_rank.png"}},{"type":"Image","props":{"x":164,"skin":"images/pop/rank/txt_niki.png"}},{"type":"Image","props":{"x":365,"skin":"images/pop/rank/txt_win.png"}},{"type":"Image","props":{"x":565,"skin":"images/pop/rank/txt_trend.png"}}]},{"type":"List","props":{"y":59,"x":11,"width":695,"var":"list_rank_all","vScrollBarSkin":"images/pop/match/vscroll.png","spaceY":2,"height":252},"child":[{"type":"Box","props":{"name":"render"},"child":[{"type":"Clip","props":{"skin":"images/pop/rank/clip_rank_small.png","name":"rankIcon","index":0,"clipY":3}},{"type":"Label","props":{"y":5,"x":1,"width":31,"text":"1","name":"rankNum","height":22,"fontSize":22,"color":"#fff8e9","align":"center"}},{"type":"Label","props":{"x":126,"width":155,"text":"汉子","name":"name","height":33,"fontSize":22,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"x":328,"width":155,"text":"3443","name":"point","height":33,"fontSize":22,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Clip","props":{"x":591,"skin":"images/pop/rank/clip_trend.png","name":"trend","index":2,"clipY":3}}]}]}]},{"type":"Box","props":{"name":"item1"},"child":[{"type":"Box","props":{"x":42},"child":[{"type":"Image","props":{"y":0,"x":-1,"skin":"images/pop/rank/txt_niki.png"}},{"type":"Image","props":{"y":0,"x":190,"skin":"images/pop/rank/txt_award.png"}},{"type":"Image","props":{"y":0,"x":322,"skin":"images/pop/rank/txt_amount.png"}},{"type":"Image","props":{"y":0,"x":545,"skin":"images/pop/rank/txt_time.png"}}]},{"type":"List","props":{"y":58,"x":-6,"width":760,"var":"list_rank_award","vScrollBarSkin":"images/pop/match/vscroll.png","spaceY":2,"height":259},"child":[{"type":"Box","props":{"y":0,"x":1,"width":755,"name":"render","height":33},"child":[{"type":"Label","props":{"y":-3,"x":18,"width":135,"text":"汉字","name":"name","height":30,"fontSize":22,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":0,"x":185,"width":155,"text":"8百搭","name":"award","height":33,"fontSize":22,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":0,"x":334,"width":155,"text":"3443","name":"amount","height":33,"fontSize":22,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":0,"x":490,"width":257,"text":"2017-10-10 10:10:10","name":"time","height":33,"fontSize":22,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}}]}]}]},{"type":"Box","props":{"width":736,"name":"item2","height":306},"child":[{"type":"Box","props":{"x":42},"child":[{"type":"Image","props":{"y":0,"x":-1,"skin":"images/pop/rank/txt_order.png"}},{"type":"Image","props":{"y":0,"x":204,"skin":"images/pop/match/txt_win.png"}},{"type":"Image","props":{"y":0,"x":541,"skin":"images/pop/rank/txt_time.png"}}]},{"type":"List","props":{"y":58,"x":39,"width":705,"var":"list_rank_gains","vScrollBarSkin":"images/pop/match/vscroll.png","spaceY":2,"height":258},"child":[{"type":"Box","props":{"y":0,"x":0,"width":691,"name":"render","height":33},"child":[{"type":"Label","props":{"y":-3,"x":-42,"width":135,"text":"2","name":"order","height":30,"fontSize":22,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":0,"x":168,"width":155,"text":"122","name":"amount","height":33,"fontSize":22,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":0,"x":432,"width":257,"text":"17年11月11日23:11:13","name":"time","height":33,"fontSize":22,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}}]}]}]}]},{"type":"Label","props":{"y":380,"x":611,"width":77,"var":"dom_loading","text":"加载中……","height":24,"fontSize":22,"font":"Microsoft YaHei","color":"#fff","align":"center"}},{"type":"Label","props":{"y":380,"x":601,"width":111,"var":"dom_unloaded","text":"请登录……","height":30,"fontSize":22,"font":"Microsoft YaHei","color":"#d9e200","align":"center"}},{"type":"Box","props":{"y":509,"x":90,"name":"myRankBox"},"child":[{"type":"Label","props":{"y":5,"x":95,"width":110,"var":"myrank","pivotY":3.703703703703752,"height":31,"fontSize":18,"font":"Microsoft YaHei","color":"#fff8e9","align":"left"}},{"type":"Label","props":{"x":-0.9999999999999432,"width":86,"text":"我的排名:","height":31,"fontSize":20,"font":"Microsoft YaHei","color":"#fff8e9","align":"left"}}]}]};}
		]);
		return rankPopUI;
	})(Dialog);
var rechargePopUI=(function(_super){
		function rechargePopUI(){
			
		    this.tab_nav=null;
		    this.btn_input=null;
		    this.btn_buy=null;

			rechargePopUI.__super.call(this);
		}

		CLASS$(rechargePopUI,'ui.popup.rechargePopUI',_super);
		var __proto__=rechargePopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(rechargePopUI.uiView);
		}

		STATICATTR$(rechargePopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1095,"height":600},"child":[{"type":"Image","props":{"y":15,"x":0,"width":1076,"skin":"images/pop/rank/bg_rank.png","height":585}},{"type":"Button","props":{"y":0,"x":1012,"stateNum":"1","skin":"images/pop/match/btn_close.png","name":"close_btn"}},{"type":"Tab","props":{"y":119,"x":76,"var":"tab_nav","selectedIndex":2},"child":[{"type":"Button","props":{"stateNum":"2","skin":"images/pop/recharge/btn_tab.png","name":"item0"}},{"type":"Button","props":{"x":242,"stateNum":"2","skin":"images/pop/recharge/btn_tab.png","name":"item1"}},{"type":"Button","props":{"x":484,"stateNum":"2","skin":"images/pop/recharge/btn_tab.png","name":"item2"}},{"type":"Button","props":{"x":725,"stateNum":"2","skin":"images/pop/recharge/btn_tab.png","name":"item3"}}]},{"type":"Box","props":{"y":115,"x":116},"child":[{"type":"Box","props":{"y":14,"x":-28,"width":196,"name":"item0","height":237},"child":[{"type":"Image","props":{"y":200,"x":65,"skin":"images/pop/recharge/zhi_01.png"}},{"type":"Image","props":{"y":28.99999999999997,"x":27.000000000000057,"skin":"images/pop/recharge/zuan01.png"}}]},{"type":"Box","props":{"y":14,"x":213,"width":196,"name":"item1","height":237},"child":[{"type":"Image","props":{"y":200,"x":63,"skin":"images/pop/recharge/zhi_02.png"}},{"type":"Image","props":{"y":39,"x":36,"skin":"images/pop/recharge/zuan02.png"}}]},{"type":"Box","props":{"y":14,"x":452,"width":196,"name":"item2","height":237},"child":[{"type":"Image","props":{"y":200,"x":64,"skin":"images/pop/recharge/zhi_03.png"}},{"type":"Image","props":{"y":-8,"x":0,"skin":"images/pop/recharge/zuan03.png"}}]},{"type":"Box","props":{"y":14,"x":693,"width":196,"name":"item3","height":237},"child":[{"type":"Image","props":{"y":200,"x":63,"skin":"images/pop/recharge/zhi_04.png"}},{"type":"Image","props":{"y":-12,"x":0,"skin":"images/pop/recharge/zuan04.png"}}]}]},{"type":"Box","props":{"y":387,"x":76,"var":"btn_input"},"child":[{"type":"Image","props":{"skin":"images/pop/recharge/bg_input.png"}},{"type":"Label","props":{"y":18,"x":44,"width":248,"text":"请输入大于零的整数","name":"input_txt","height":35,"fontSize":24,"font":"Microsoft YaHei","color":"#fff8e9"}}]},{"type":"Box","props":{"y":497,"x":431,"var":"btn_buy"},"child":[{"type":"Button","props":{"stateNum":"1","skin":"images/pop/match/btn_bg.png"}},{"type":"Image","props":{"y":15,"x":69,"skin":"images/pop/recharge/txt_btn.png"}}]},{"type":"Box","props":{"y":26,"x":358,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"x":133,"skin":"images/pop/recharge/txt_recharge.png"}},{"type":"Label","props":{"y":60,"x":66,"text":"1元=1钻石=500欢乐豆","fontSize":21,"font":"Microsoft YaHei","color":"#fff8e9","align":"center"}},{"type":"Label","props":{"y":435,"width":378,"text":"充值钻石成功后将为您自动兑换为欢乐豆","height":28,"fontSize":21,"font":"Microsoft YaHei","color":"#fff8e9"}}]}]};}
		]);
		return rechargePopUI;
	})(Dialog);
var richitemUI=(function(_super){
		function richitemUI(){
			

			richitemUI.__super.call(this);
		}

		CLASS$(richitemUI,'ui.popup.richitemUI',_super);
		var __proto__=richitemUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(richitemUI.uiView);
		}

		STATICATTR$(richitemUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":290,"height":80},"child":[{"type":"Image","props":{"y":5,"x":-14,"width":318,"skin":"images/pop/rank/rich_bg.png","height":69}},{"type":"Clip","props":{"y":15,"x":44,"skin":"images/pop/rank/clip_rank.png","name":"rank","clipY":3}},{"type":"Label","props":{"y":17,"x":117,"width":110,"text":"套马的汉子","name":"name","height":31,"fontSize":20,"font":"Microsoft YaHei","color":"#fff8e9","align":"left"}},{"type":"Label","props":{"y":44,"x":118,"width":110,"text":"23,123,456","name":"point","height":21,"fontSize":17,"font":"Microsoft YaHei","color":"#fee066","align":"left"}}]};}
		]);
		return richitemUI;
	})(View);
var winPopUI=(function(_super){
		function winPopUI(){
			
		    this.dom_amount=null;
		    this.btn_confirm=null;
		    this.dom_win_title=null;

			winPopUI.__super.call(this);
		}

		CLASS$(winPopUI,'ui.popup.winPopUI',_super);
		var __proto__=winPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(winPopUI.uiView);
		}

		STATICATTR$(winPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1334,"height":750},"child":[{"type":"Label","props":{"y":317,"width":1334,"var":"dom_amount","text":"$8000","font":"win_font","align":"center"}},{"type":"Button","props":{"y":573,"x":554,"var":"btn_confirm","stateNum":"1","skin":"images/pop/match/btn_bg.png"},"child":[{"type":"Image","props":{"y":16,"x":81,"skin":"images/pop/match/txt_confirm.png"}}]},{"type":"Clip","props":{"y":91,"x":407,"var":"dom_win_title","skin":"images/room/clip_win.png","index":0,"clipY":3}}]};}
		]);
		return winPopUI;
	})(Dialog);
var bottomUI=(function(_super){
		function bottomUI(){
			
		    this.input_box=null;
		    this.btn_add=null;
		    this.btn_sub=null;
		    this.btn_input=null;
		    this.input_txt=null;
		    this.btn_max=null;
		    this.win_box=null;
		    this.dom_win=null;
		    this.dom_25=null;
		    this.btn_i=null;
		    this.autoplay_box=null;
		    this.defaultbet_box=null;
		    this.btn_start=null;
		    this.dom_start_sk=null;
		    this.dom_auto=null;

			bottomUI.__super.call(this);
		}

		CLASS$(bottomUI,'ui.room.bottomUI',_super);
		var __proto__=bottomUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("SkeletonPlayer",laya.ani.bone.Skeleton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(bottomUI.uiView);
		}

		STATICATTR$(bottomUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1334,"mouseThrough":true,"mouseEnabled":true,"height":113},"child":[{"type":"Image","props":{"y":0,"x":0,"width":1334,"skin":"images/room/downbg.png"}},{"type":"Image","props":{"y":0,"skin":"images/room/down_up.png"}},{"type":"Box","props":{"y":10,"x":42,"var":"input_box"},"child":[{"type":"Image","props":{"x":248,"var":"btn_add","skin":"images/room/add.png"}},{"type":"Image","props":{"var":"btn_sub","skin":"images/room/sub.png"}},{"type":"Box","props":{"y":5,"x":74,"var":"btn_input"},"child":[{"type":"Image","props":{"skin":"images/room/inputbg.png"}},{"type":"Label","props":{"y":8,"x":0,"width":170,"var":"input_txt","text":"250","height":36,"fontSize":36,"font":"Arial","color":"#fff","align":"center"}},{"type":"Image","props":{"y":52,"x":54,"skin":"images/room/ztb_txt.png"}}]},{"type":"Image","props":{"y":0,"x":322,"var":"btn_max","skin":"images/room/max.png"}}]},{"type":"Box","props":{"y":0,"x":466,"width":393,"var":"win_box","height":108},"child":[{"type":"Image","props":{"skin":"images/room/win_bg.png"}},{"type":"Label","props":{"y":17,"x":5,"width":382,"var":"dom_win","height":58,"font":"bottom_font","align":"center"}},{"type":"Clip","props":{"y":57,"x":116,"var":"dom_25","skin":"images/room/clip_25.png","clipY":2}}]},{"type":"Image","props":{"y":10,"x":867,"var":"btn_i","skin":"images/room/i.png"}},{"type":"Box","props":{"y":0,"x":1016,"var":"autoplay_box"}},{"type":"Box","props":{"y":0,"x":84,"var":"defaultbet_box"}},{"type":"Button","props":{"y":9,"x":988,"width":313,"var":"btn_start","height":100},"child":[{"type":"SkeletonPlayer","props":{"y":44,"x":158,"var":"dom_start_sk","url":"images/animate/start.sk"}},{"type":"Label","props":{"y":63,"x":180,"visible":false,"var":"dom_auto","text":"10","fontSize":20,"font":"auto_font","color":"#fff"}}]}]};}
		]);
		return bottomUI;
	})(View);
var headerUI=(function(_super){
		function headerUI(){
			
		    this.btn_back=null;
		    this.btn_rank=null;
		    this.logo_box=null;
		    this.dou_box=null;
		    this.btn_chong=null;
		    this.yu_box=null;
		    this.btn_more=null;
		    this.btn_home=null;
		    this.menu_box=null;

			headerUI.__super.call(this);
		}

		CLASS$(headerUI,'ui.room.headerUI',_super);
		var __proto__=headerUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("SkeletonPlayer",laya.ani.bone.Skeleton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(headerUI.uiView);
		}

		STATICATTR$(headerUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1334,"mouseThrough":true,"mouseEnabled":true,"height":85},"child":[{"type":"Image","props":{"y":-2,"x":0,"width":1334,"skin":"images/room/upbg.png","sizeGrid":"0,12,0,9","height":85}},{"type":"Image","props":{"y":12,"x":46,"visible":false,"var":"btn_back","skin":"images/room/back.png"}},{"type":"Image","props":{"y":12,"x":142,"var":"btn_rank","skin":"images/room/rank.png"}},{"type":"Box","props":{"y":0,"x":501,"var":"logo_box"},"child":[{"type":"Image","props":{"skin":"images/room/up_logobg.png"}},{"type":"SkeletonPlayer","props":{"y":56,"x":171,"url":"images/animate/LOGO.sk"}},{"type":"Image","props":{"y":-1,"x":265,"skin":"images/load/neice.png","scaleY":0.5,"scaleX":0.5}}]},{"type":"Box","props":{"y":11,"x":254,"var":"dou_box"},"child":[{"type":"Image","props":{"y":6,"x":0,"skin":"images/room/txt_bg.png"}},{"type":"Image","props":{"y":0,"x":-16,"skin":"images/room/dou.png"}},{"type":"Image","props":{"y":6,"x":196,"var":"btn_chong","skin":"images/room/chong.png"}},{"type":"Label","props":{"y":17,"x":46,"width":142,"text":"0","name":"dou_num","height":27,"fontSize":27,"font":"Arial","color":"#fff","align":"right"}}]},{"type":"Box","props":{"y":11,"x":828,"var":"yu_box"},"child":[{"type":"Image","props":{"y":6,"x":0,"skin":"images/room/txt_bg.png"}},{"type":"Image","props":{"y":5,"x":-16,"skin":"images/room/yu.png"}},{"type":"Label","props":{"y":17,"x":58,"width":181,"text":"0","name":"yu_num","height":27,"fontSize":27,"font":"Arial","color":"#fff","align":"right"}}]},{"type":"Image","props":{"y":12,"var":"btn_more","skin":"images/room/more.png","right":46}},{"type":"Image","props":{"y":12,"visible":false,"var":"btn_home","skin":"images/room/home.png","right":142}},{"type":"Box","props":{"y":85,"var":"menu_box","right":160}}]};}
		]);
		return headerUI;
	})(View);
var jackpotUI=(function(_super){
		function jackpotUI(){
			

			jackpotUI.__super.call(this);
		}

		CLASS$(jackpotUI,'ui.room.jackpotUI',_super);
		var __proto__=jackpotUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("ui.room.jackpotItemUI",ui.room.jackpotItemUI);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(jackpotUI.uiView);
		}

		STATICATTR$(jackpotUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":960,"height":128},"child":[{"type":"jackpotItem","props":{"y":65,"x":479,"runtime":"ui.room.jackpotItemUI"}},{"type":"jackpotItem","props":{"y":65,"x":0,"runtime":"ui.room.jackpotItemUI"}},{"type":"jackpotItem","props":{"y":0,"x":479,"runtime":"ui.room.jackpotItemUI"}},{"type":"jackpotItem","props":{"runtime":"ui.room.jackpotItemUI"}}]};}
		]);
		return jackpotUI;
	})(View);
var jackpotItemUI=(function(_super){
		function jackpotItemUI(){
			
		    this.domNum=null;
		    this.domGe=null;
		    this.domAcount=null;
		    this.domMask=null;

			jackpotItemUI.__super.call(this);
		}

		CLASS$(jackpotItemUI,'ui.room.jackpotItemUI',_super);
		var __proto__=jackpotItemUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(jackpotItemUI.uiView);
		}

		STATICATTR$(jackpotItemUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":478,"height":58},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/room_match/fudai_di.png"}},{"type":"Image","props":{"y":10,"x":29,"var":"domNum","skin":"images/room/room_match/num5.png"}},{"type":"Image","props":{"y":15,"x":59,"var":"domGe","skin":"images/room/room_match/ge1_txt.png"}},{"type":"Image","props":{"y":1,"x":98,"skin":"images/room/room_match/baida.png"}},{"type":"Label","props":{"y":12,"x":171,"width":287,"var":"domAcount","text":"0","right":19.62890625,"height":30,"fontSize":32,"font":"Arial","color":"#f7e382","align":"right"}},{"type":"Image","props":{"y":1,"x":5,"var":"domMask","skin":"images/room/room_match/fudai_mask.png"}}]};}
		]);
		return jackpotItemUI;
	})(View);
var lapaUI=(function(_super){
		function lapaUI(){
			
		    this.jackpot_box=null;
		    this.lapa_box=null;

			lapaUI.__super.call(this);
		}

		CLASS$(lapaUI,'ui.room.lapaUI',_super);
		var __proto__=lapaUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(lapaUI.uiView);
		}

		STATICATTR$(lapaUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":971,"height":545},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/room_match/lapa_bg.png"}},{"type":"Box","props":{"y":3,"x":5,"var":"jackpot_box"}},{"type":"Box","props":{"y":130,"x":-45,"width":1060,"var":"lapa_box","height":400}},{"type":"Image","props":{"y":-1,"x":6,"skin":"images/room/room_match/jiao.png"}},{"type":"Image","props":{"y":-3,"x":963,"skin":"images/room/room_match/jiao.png","rotation":90}}]};}
		]);
		return lapaUI;
	})(View);
var match_closeUI=(function(_super){
		function match_closeUI(){
			
		    this.btn_tab=null;
		    this.domAmount=null;
		    this.prevue_box=null;
		    this.count_down_box=null;

			match_closeUI.__super.call(this);
		}

		CLASS$(match_closeUI,'ui.room.match_closeUI',_super);
		var __proto__=match_closeUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(match_closeUI.uiView);
		}

		STATICATTR$(match_closeUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":130,"height":500},"child":[{"type":"Image","props":{"y":0,"x":-18,"width":129,"skin":"images/room/room_match/txt_bg.png","height":270,"sizeGrid":"21,21,25,15"}},{"type":"Image","props":{"y":0,"x":0,"var":"btn_tab","skin":"images/room/room_match/openbtn.png"}},{"type":"Box","props":{"y":75,"x":-18},"child":[{"type":"Image","props":{"y":-4.000000000000014,"x":0,"skin":"images/room/room_match/jc_light.png"}},{"type":"Image","props":{"x":22,"skin":"images/room/room_match/jcje_txt.png"}},{"type":"Label","props":{"y":27,"width":130,"var":"domAmount","text":"0","height":27,"fontSize":27,"font":"num1_font","color":"#fff","align":"center"}}]},{"type":"Box","props":{"y":145,"x":-18,"var":"prevue_box"},"child":[{"type":"Label","props":{"width":130,"text":"下次比赛","name":"title","height":27,"fontSize":18,"font":"Microsoft YaHei","color":"#fff","align":"center"}},{"type":"Label","props":{"y":22,"width":130,"name":"content","leading":4,"height":27,"fontSize":18,"font":"Microsoft YaHei","color":"#ffef40","align":"center"}}]},{"type":"Box","props":{"y":217,"x":-18,"visible":true,"var":"count_down_box"},"child":[{"type":"Label","props":{"width":130,"text":"下次开启剩余","name":"title","height":27,"fontSize":18,"font":"Microsoft YaHei","color":"#fff","align":"center"}},{"type":"Label","props":{"y":22,"width":130,"name":"content","height":27,"fontSize":18,"font":"Microsoft YaHei","color":"#ffef40","align":"center"}}]}]};}
		]);
		return match_closeUI;
	})(View);
var match_openUI=(function(_super){
		function match_openUI(){
			
		    this.btn_tab=null;
		    this.btn_last=null;
		    this.btn_match=null;
		    this.domAmount=null;
		    this.middle_box=null;
		    this.tab_title_box=null;
		    this.list_box=null;
		    this.dom_nobody=null;
		    this.bottom_box=null;

			match_openUI.__super.call(this);
		}

		CLASS$(match_openUI,'ui.room.match_openUI',_super);
		var __proto__=match_openUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(match_openUI.uiView);
		}

		STATICATTR$(match_openUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":245,"height":545},"child":[{"type":"Image","props":{"y":-1,"x":-3,"skin":"images/room/room_match/big_match.png"}},{"type":"Image","props":{"y":0,"x":0,"var":"btn_tab","skin":"images/room/room_match/closebtn.png"}},{"type":"Button","props":{"y":3,"x":88,"var":"btn_last","stateNum":"1","skin":"images/room/last.png"}},{"type":"Image","props":{"y":9,"x":172,"var":"btn_match","skin":"images/room/room_match/guize.png"}},{"type":"Box","props":{"y":76,"x":0},"child":[{"type":"Image","props":{"y":0,"x":80,"skin":"images/room/room_match/jcje_txt.png"}},{"type":"Label","props":{"y":29,"x":0,"width":245,"var":"domAmount","text":"0","height":27,"fontSize":27,"font":"num1_font","color":"#fff","align":"center"}}]},{"type":"Box","props":{"y":142,"x":0,"width":245,"var":"middle_box"},"child":[{"type":"Label","props":{"width":245,"text":"下次比赛开启时间","name":"title","fontSize":23,"font":"Microsoft YaHei","color":"#fffdf8","align":"center"}},{"type":"Label","props":{"y":28,"width":245,"name":"content","height":26,"fontSize":23,"font":"Microsoft YaHei","color":"#fee232","align":"center"}}]},{"type":"Box","props":{"y":222,"x":15,"var":"tab_title_box"},"child":[{"type":"HBox","props":{"space":25,"name":"match","align":"middle"},"child":[{"type":"Label","props":{"text":"排名","fontSize":20,"font":"Microsoft YaHei","color":"#f9f0e2"}},{"type":"Label","props":{"y":10,"x":10,"text":"昵称","fontSize":20,"font":"Microsoft YaHei","color":"#f9f0e2"}},{"type":"Label","props":{"y":20,"x":20,"text":"赢取总额","fontSize":20,"font":"Microsoft YaHei","color":"#f9f0e2"}}]},{"type":"Label","props":{"y":0,"x":45,"visible":false,"text":"上期奖池分奖","name":"last","fontSize":23,"font":"Microsoft YaHei","color":"#f9f0e2"}}]},{"type":"Box","props":{"y":254,"x":0},"child":[{"type":"List","props":{"width":234,"visible":false,"var":"list_box","vScrollBarSkin":"images/pop/match/vscroll.png","height":204},"child":[{"type":"Box","props":{"x":0,"name":"render"},"child":[{"type":"Clip","props":{"x":10,"skin":"images/pop/match/clip_rank.png","name":"icon","clipY":3}},{"type":"Label","props":{"y":5,"x":10,"width":34,"text":10,"name":"rank","height":20,"fontSize":20,"font":"SimHei","color":"#d0c2b7","align":"center"}},{"type":"Label","props":{"y":6,"x":49,"width":118,"name":"name","height":20,"fontSize":20,"font":"SimHei","color":"#d0c2b7","align":"center"}},{"type":"Label","props":{"y":6,"x":153,"width":65,"text":"0","name":"amount","height":20,"fontSize":20,"font":"SimHei","color":"#d0c2b7","align":"center"}}]}]},{"type":"Label","props":{"y":79,"width":245,"visible":false,"var":"dom_nobody","text":"虚位以待...","height":27,"fontSize":17,"font":"Microsoft YaHei","color":"#fff","align":"center"}}]},{"type":"Box","props":{"y":472,"var":"bottom_box"},"child":[{"type":"Label","props":{"width":245,"name":"title","height":27,"fontSize":23,"font":"Microsoft YaHei","color":"#fff","align":"center"}},{"type":"Label","props":{"y":32,"width":245,"name":"content","height":27,"fontSize":23,"font":"Microsoft YaHei","color":"#ffef40","align":"center"}}]}]};}
		]);
		return match_openUI;
	})(View);
var roomUI=(function(_super){
		function roomUI(){
			
		    this.middle_box=null;
		    this.match_box=null;
		    this.game_box=null;
		    this.top_box=null;
		    this.marquee_box=null;
		    this.bottom_box=null;

			roomUI.__super.call(this);
		}

		CLASS$(roomUI,'ui.room.roomUI',_super);
		var __proto__=roomUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(roomUI.uiView);
		}

		STATICATTR$(roomUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"y":0,"width":1334,"height":750},"child":[{"type":"Image","props":{"x":0,"skin":"images/load/bg.jpg","centerY":0}},{"type":"Box","props":{"var":"middle_box","height":750,"centerY":0},"child":[{"type":"Box","props":{"y":90,"x":60,"var":"match_box"}},{"type":"Box","props":{"y":90,"x":183,"var":"game_box"}}]},{"type":"Box","props":{"width":1334,"var":"top_box","top":0},"child":[{"type":"Box","props":{"y":88,"x":292},"child":[{"type":"Label","props":{"width":750,"text":"label","height":40,"bgColor":"#000","alpha":0.5}},{"type":"Box","props":{"y":5,"x":25,"width":700,"var":"marquee_box","height":30}}]}]},{"type":"Box","props":{"x":0,"var":"bottom_box","bottom":0}}]};}
		]);
		return roomUI;
	})(View);