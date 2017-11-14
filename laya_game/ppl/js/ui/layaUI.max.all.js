var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var hallpageUI=(function(_super){
		function hallpageUI(){
			
		    this.btnHome=null;
		    this.btnRank=null;
		    this.btnMenu=null;
		    this.userHead=null;
		    this.userName=null;
		    this.border_head=null;
		    this.gameScore=null;
		    this.btnCashou=null;
		    this.menu_box=null;

			hallpageUI.__super.call(this);
		}

		CLASS$(hallpageUI,'ui.hall.hallpageUI',_super);
		var __proto__=hallpageUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("ui.pop.menuUI",ui.pop.menuUI);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(hallpageUI.uiView);
		}

		STATICATTR$(hallpageUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"y":0,"x":0,"width":750,"height":1334},"child":[{"type":"Image","props":{"y":0,"x":-292,"skin":"images/hhhh1.jpg","centerX":0}},{"type":"Image","props":{"y":46,"x":437,"var":"btnHome","skin":"images/home.png"}},{"type":"Image","props":{"y":45,"x":543,"width":78,"var":"btnRank","skin":"images/rank.png","height":78}},{"type":"Image","props":{"y":45,"x":645,"width":78,"var":"btnMenu","skin":"images/setdown.png","height":78}},{"type":"Box","props":{"y":47,"x":35},"child":[{"type":"Image","props":{"width":66,"var":"userHead","height":66}},{"type":"Label","props":{"y":16,"x":92,"width":238,"var":"userName","overflow":"visible","height":44,"fontSize":26,"font":"微软雅黑","color":"#ffffff","bold":true}},{"type":"Image","props":{"y":0,"x":0,"var":"border_head","skin":"images/border_head.png"}}]},{"type":"Box","props":{"y":172,"x":460},"child":[{"type":"Image","props":{"y":2,"x":13,"skin":"images/num_bg.png"}},{"type":"Image","props":{"skin":"images/dou.png"}},{"type":"Label","props":{"y":12,"x":41,"width":193,"var":"gameScore","text":"0","overflow":"hidden","height":44,"fontSize":26,"color":"#ffffff","align":"center"}},{"type":"Box","props":{"y":-7,"x":210,"width":63,"var":"btnCashou","height":61},"child":[{"type":"Image","props":{"y":10,"x":10,"skin":"images/btnShow.png"}}]}]},{"type":"menu","props":{"y":115,"x":526,"var":"menu_box","runtime":"ui.pop.menuUI"}},{"type":"Image","props":{"y":370,"x":340,"skin":"images/neice1.png"}}]};}
		]);
		return hallpageUI;
	})(View);
var newPlayerUI=(function(_super){
		function newPlayerUI(){
			
		    this.step1=null;
		    this.step2=null;
		    this.step3=null;
		    this.step4=null;
		    this.step5=null;
		    this.step6=null;
		    this.step7=null;
		    this.step8=null;
		    this.step9=null;
		    this.btn_jump=null;

			newPlayerUI.__super.call(this);
		}

		CLASS$(newPlayerUI,'ui.hall.newPlayerUI',_super);
		var __proto__=newPlayerUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(newPlayerUI.uiView);
		}

		STATICATTR$(newPlayerUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":750,"height":1334},"child":[{"type":"Box","props":{"y":0,"x":0,"var":"step1"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/newPlayer/help0.jpg"}},{"type":"Image","props":{"y":737,"x":484,"skin":"images/room/headPop/new_start.png","name":"btn_next"}},{"type":"Box","props":{"y":470,"x":53},"child":[{"type":"Image","props":{"skin":"images/room/newPlayer/new_3.png"}},{"type":"Label","props":{"y":63,"x":7,"width":628,"text":"欢迎来到幸运拼拼乐，拼拼乐的\\n规则很简单，跟着我很快就能学会哦！","leading":10,"height":96,"fontSize":36,"font":"微软雅黑","color":"#4b5987","bold":true,"align":"center"}}]}]},{"type":"Box","props":{"y":0,"x":0,"var":"step2"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/newPlayer/help0.jpg"}},{"type":"Image","props":{"y":355,"x":488,"skin":"images/room/headPop/new_start.png","name":"btn_next"}},{"type":"Box","props":{"y":97,"x":55},"child":[{"type":"Image","props":{"skin":"images/room/newPlayer/new_3.png"}},{"type":"Label","props":{"y":59,"x":49,"width":542,"text":"您可以选择下面黄框中的任何一个\\n房间进行游戏。","leading":10,"height":96,"fontSize":36,"font":"微软雅黑","color":"#4b5987","bold":true,"align":"left"}}]},{"type":"Image","props":{"y":465,"x":45,"skin":"images/room/newPlayer/help4.jpg"}}]},{"type":"Box","props":{"y":0,"x":0,"var":"step3"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/newPlayer/help01.jpg"}},{"type":"Image","props":{"y":355,"x":488,"skin":"images/room/headPop/new_start.png","name":"btn_next"}},{"type":"Box","props":{"y":97,"x":55},"child":[{"type":"Image","props":{"skin":"images/room/newPlayer/new_3.png"}},{"type":"Label","props":{"y":48,"x":16.5,"width":607,"text":"下面我们来了解牌型大小，以下牌型\\n由大到小排列，注意：杂花235比三条\\n大哦~","leading":10,"height":96,"fontSize":36,"font":"微软雅黑","color":"#4b5987","bold":true,"align":"left"}}]},{"type":"Image","props":{"y":465,"x":196.5,"skin":"images/room/newPlayer/help8.png"}}]},{"type":"Box","props":{"y":0,"x":0,"var":"step4"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/newPlayer/help01.jpg"}},{"type":"Image","props":{"y":463,"x":484,"skin":"images/room/headPop/new_start.png","name":"btn_next"}},{"type":"Box","props":{"y":215,"x":55},"child":[{"type":"Image","props":{"skin":"images/room/newPlayer/new_3.png"}},{"type":"Label","props":{"y":43,"x":47.5,"width":545,"text":"前面我们了解了牌型，现在我们来\\n了解牌型得分，对的就在牌桌上就\\n可看到，是不是很方便呢！","leading":10,"height":96,"fontSize":36,"font":"微软雅黑","color":"#4b5987","bold":true,"align":"left"}}]},{"type":"Image","props":{"y":594,"x":34,"skin":"images/room/newPlayer/help9.jpg"}},{"type":"Image","props":{"y":514.9999999999999,"x":55.9999999999999,"skin":"images/room/headPop/help12.png"}}]},{"type":"Box","props":{"y":0,"x":0,"var":"step5"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/newPlayer/help01.jpg"}},{"type":"Image","props":{"y":801,"x":480,"skin":"images/room/headPop/new_start.png","name":"btn_next"}},{"type":"Box","props":{"y":592,"x":55},"child":[{"type":"Image","props":{"skin":"images/room/newPlayer/help6.png"}},{"type":"Label","props":{"y":59,"x":60,"width":513,"text":"上方黄框中区域为对方牌放置区","leading":10,"height":96,"fontSize":36,"font":"微软雅黑","color":"#4b5987","bold":true,"align":"left"}}]},{"type":"Image","props":{"y":199,"x":299,"skin":"images/room/newPlayer/help1.jpg"}},{"type":"Image","props":{"y":342,"x":31,"skin":"images/room/headPop/help10.png"}}]},{"type":"Box","props":{"y":0,"x":0,"var":"step6"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/newPlayer/help01.jpg"}},{"type":"Image","props":{"y":947,"x":500,"skin":"images/room/headPop/new_start.png","name":"btn_next"}},{"type":"Box","props":{"y":741,"x":67},"child":[{"type":"Image","props":{"skin":"images/room/newPlayer/help6.png"}},{"type":"Label","props":{"y":41,"x":63.5,"width":513,"text":"上方黄框中三张牌为双方公用的\\n公共牌。","leading":10,"height":96,"fontSize":36,"font":"微软雅黑","color":"#4b5987","bold":true,"align":"left"}}]},{"type":"Image","props":{"y":520,"x":297,"skin":"images/room/newPlayer/help15.jpg"}},{"type":"Image","props":{"y":582,"x":79,"skin":"images/room/headPop/help11.png"}}]},{"type":"Box","props":{"y":0,"x":0,"var":"step7"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/newPlayer/help01.jpg"}},{"type":"Image","props":{"y":784,"x":513,"skin":"images/room/headPop/new_start.png","name":"btn_next"}},{"type":"Box","props":{"y":532,"x":87},"child":[{"type":"Image","props":{"skin":"images/room/newPlayer/new_3.png"}},{"type":"Label","props":{"y":37,"x":35,"width":570,"text":"下方黄框中区域为我的牌张选择区，\\n每次只能挑选一张哦！","leading":10,"height":96,"fontSize":36,"font":"微软雅黑","color":"#4b5987","bold":true,"align":"left"}}]},{"type":"Image","props":{"y":1033,"x":215,"skin":"images/room/newPlayer/help2.jpg"}},{"type":"Image","props":{"y":952,"x":332,"skin":"images/room/headPop/help13.png"}}]},{"type":"Box","props":{"y":0,"x":0,"var":"step8"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/newPlayer/help01.jpg"}},{"type":"Image","props":{"y":368,"x":483,"skin":"images/room/headPop/new_start.png","name":"btn_next"}},{"type":"Box","props":{"y":116,"x":57},"child":[{"type":"Image","props":{"skin":"images/room/newPlayer/new_3.png"}},{"type":"Label","props":{"y":19,"x":33,"width":574,"text":"下方黄框中区域为我方牌放置区，\\n在牌型选择区域拖入一张牌至下方\\n区域放置即可,每一列3张牌组成一组\\n牌型，6轮过后将放置区摆满。","leading":10,"height":185,"fontSize":36,"font":"微软雅黑","color":"#4b5987","bold":true,"align":"left"}}]},{"type":"Image","props":{"y":501,"x":277,"skin":"images/room/newPlayer/help5.jpg"}},{"type":"Image","props":{"y":807,"x":16,"skin":"images/room/headPop/help14.png"}}]},{"type":"Box","props":{"y":0,"x":0,"var":"step9"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/newPlayer/help01.jpg"}},{"type":"Image","props":{"y":1215,"x":463,"skin":"images/room/headPop/new_end.png","name":"btn_next"}},{"type":"Box","props":{"y":1039,"x":94},"child":[{"type":"Image","props":{"y":16,"x":22,"skin":"images/room/newPlayer/help16.png"}},{"type":"Label","props":{"y":57,"x":98.5,"width":365,"text":"紧张的比牌就开始喽！","leading":10,"height":96,"fontSize":36,"font":"微软雅黑","color":"#4b5987","bold":true,"align":"left"}}]},{"type":"Image","props":{"y":162,"x":289,"skin":"images/room/newPlayer/help3.jpg"}}]},{"type":"Image","props":{"y":1260,"x":486,"var":"btn_jump","skin":"images/room/headPop/new_txt.png"}}]};}
		]);
		return newPlayerUI;
	})(Dialog);
var loadUI=(function(_super){
		function loadUI(){
			
		    this.progress=null;

			loadUI.__super.call(this);
		}

		CLASS$(loadUI,'ui.load.loadUI',_super);
		var __proto__=loadUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(loadUI.uiView);
		}

		STATICATTR$(loadUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":750,"height":1334},"child":[{"type":"Image","props":{"y":0,"skin":"images/hhhh2.jpg","centerX":0}},{"type":"Box","props":{"y":1087,"x":78},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"images/load_line.png","height":53}},{"type":"ProgressBar","props":{"y":5,"x":8,"width":572,"var":"progress","value":1,"skin":"images/progress.png","height":41}}]},{"type":"Image","props":{"y":1173,"x":0,"skin":"images/fangcenmi.png"}},{"type":"Image","props":{"y":904,"x":331,"skin":"images/neice2.png"}}]};}
		]);
		return loadUI;
	})(View);
var comTipUI=(function(_super){
		function comTipUI(){
			
		    this.txt=null;

			comTipUI.__super.call(this);
		}

		CLASS$(comTipUI,'ui.pop.comTipUI',_super);
		var __proto__=comTipUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(comTipUI.uiView);
		}

		STATICATTR$(comTipUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":705,"height":488},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/promit_bg.png"}},{"type":"Image","props":{"y":-44,"x":67,"skin":"images/promit.png"}},{"type":"Button","props":{"y":342,"x":207,"stateNum":1,"skin":"images/btn_sure.png","name":"close"}},{"type":"Label","props":{"y":153,"x":66,"wordWrap":true,"width":584,"var":"txt","height":148,"fontSize":36,"font":"微软雅黑","color":"#7ad8ed","align":"center"}},{"type":"Button","props":{"y":35,"x":630,"stateNum":1,"skin":"images/btn_close.png","name":"close"}}]};}
		]);
		return comTipUI;
	})(Dialog);
var headPopUI=(function(_super){
		function headPopUI(){
			
		    this.head_box=null;
		    this.user_name=null;
		    this.win_odds=null;
		    this.play_num=null;
		    this.head_img=null;
		    this.daoju_list=null;

			headPopUI.__super.call(this);
		}

		CLASS$(headPopUI,'ui.pop.headPopUI',_super);
		var __proto__=headPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(headPopUI.uiView);
		}

		STATICATTR$(headPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":707,"height":617},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/headPop/detailed_info2.png"}},{"type":"Box","props":{"y":124,"x":14.5,"width":678,"var":"head_box","height":141},"child":[{"type":"Label","props":{"y":16,"x":217,"width":352,"var":"user_name","height":68,"fontSize":42,"font":"微软雅黑","color":"#ffffff"}},{"type":"Box","props":{"y":98,"x":207},"child":[{"type":"Label","props":{"width":168,"text":"胜率：","height":42,"fontSize":30,"font":"微软雅黑","color":"#ffffff"}},{"type":"Label","props":{"x":88,"width":84,"var":"win_odds","text":"0%","height":42,"fontSize":30,"font":"微软雅黑","color":"#eaa140"}}]},{"type":"Box","props":{"y":98,"x":400},"child":[{"type":"Label","props":{"width":168,"text":"对局数：","height":42,"fontSize":30,"font":"微软雅黑","color":"#ffffff"}},{"type":"Label","props":{"x":117,"width":84,"var":"play_num","text":"0","height":42,"fontSize":30,"font":"微软雅黑","color":"#eaa140"}}]},{"type":"Box","props":{"y":20,"x":50},"child":[{"type":"Image","props":{"y":0,"x":0,"width":138,"var":"head_img","height":137}},{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/headPop/daoju_headbg.png"}}]}]},{"type":"Image","props":{"y":62,"x":273.5,"skin":"images/room/headPop/ijfei.png"}},{"type":"Image","props":{"y":325.99999999999994,"x":35.25000000000008,"skin":"images/room/headPop/gift.png"}},{"type":"List","props":{"y":343,"x":48,"width":610,"var":"daoju_list","selectEnable":true,"height":192},"child":[{"type":"Box","props":{"y":0,"x":0,"width":150,"name":"render","height":200},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/headPop/gift_cell.png"}},{"type":"Label","props":{"y":155,"x":60,"width":67,"text":0,"name":"daoju_num","height":24,"fontSize":24,"font":"微软雅黑","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":159,"x":35,"skin":"images/room/headPop/samll_dou.png"}},{"type":"Image","props":{"y":83,"x":85,"width":94,"pivotY":54.88372093023256,"pivotX":48.372093023255815,"name":"daoju_img","height":109}},{"type":"Label","props":{"y":104,"x":54,"text":"label","name":"id","fontSize":0}}]},{"type":"HScrollBar","props":{"y":195,"x":165,"width":274,"pivotY":1.9230769230769225,"pivotX":5.769230769230768,"height":1}}]},{"type":"Button","props":{"y":7,"x":630,"stateNum":"1","skin":"images/btn_close.png","name":"close"}}]};}
		]);
		return headPopUI;
	})(Dialog);
var helppopUI=(function(_super){
		function helppopUI(){
			
		    this.help_glr=null;

			helppopUI.__super.call(this);
		}

		CLASS$(helppopUI,'ui.pop.helppopUI',_super);
		var __proto__=helppopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(helppopUI.uiView);
		}

		STATICATTR$(helppopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":578,"height":1138},"child":[{"type":"Image","props":{"y":5,"x":0,"skin":"images/help_head.png"}},{"type":"Box","props":{"y":320,"x":30,"var":"help_glr"},"child":[{"type":"Box","props":{"y":43,"x":-5.684341886080802e-14,"name":"con"},"child":[{"type":"ViewStack","props":{"y":0,"x":0,"selectedIndex":0,"name":"list"},"child":[{"type":"Box","props":{"y":0,"x":0,"width":520,"name":"item0","height":740},"child":[{"type":"Image","props":{"y":10,"x":0,"skin":"images/help1.png"}}]},{"type":"Box","props":{"y":0,"x":0,"width":520,"name":"item1","height":740},"child":[{"type":"Image","props":{"y":30,"x":63,"skin":"images/help2.png"}}]},{"type":"Box","props":{"y":0,"x":0,"width":520,"name":"item2","height":740},"child":[{"type":"Image","props":{"y":30,"x":70.5,"skin":"images/help3.png"}}]}]}]},{"type":"Tab","props":{"y":10,"x":174,"selectedIndex":0,"name":"pagination"},"child":[{"type":"Button","props":{"y":0,"x":0,"stateNum":"2","skin":"images/room/headPop/btn_help_pagenation.png","name":"item0"}},{"type":"Button","props":{"y":0,"x":66,"stateNum":"2","skin":"images/room/headPop/btn_help_pagenation.png","name":"item1"}},{"type":"Button","props":{"y":0,"x":132,"stateNum":"2","skin":"images/room/headPop/btn_help_pagenation.png","name":"item2"}}]}]},{"type":"Button","props":{"y":1084,"x":174,"stateNum":"1","skin":"images/jump2.png","name":"close"}},{"type":"Button","props":{"y":312.99999999999994,"x":507.9999999999999,"stateNum":"1","skin":"images/btn_close.png","name":"close"}}]};}
		]);
		return helppopUI;
	})(Dialog);
var menuUI=(function(_super){
		function menuUI(){
			
		    this.voice=null;
		    this.voice_1=null;
		    this.help=null;
		    this.notice_box=null;
		    this.btnNotice=null;
		    this.redPoint=null;

			menuUI.__super.call(this);
		}

		CLASS$(menuUI,'ui.pop.menuUI',_super);
		var __proto__=menuUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(menuUI.uiView);
		}

		STATICATTR$(menuUI,
		['uiView',function(){return this.uiView={"type":"View","props":{},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/menu.png"}},{"type":"Clip","props":{"y":60,"x":116,"var":"voice","skin":"images/youhua2/clip_clock.png","index":0,"clipY":2}},{"type":"Label","props":{"y":34,"x":24,"width":194,"var":"voice_1","height":79}},{"type":"Label","props":{"y":134,"x":18,"width":194,"var":"help","height":79}},{"type":"Box","props":{"y":227,"x":19,"width":183,"var":"notice_box","height":84},"child":[{"type":"Image","props":{"var":"btnNotice","skin":"images/notice.png"}},{"type":"Image","props":{"y":15,"x":14,"var":"redPoint","skin":"images/red.png"}},{"type":"Label","props":{"y":22,"x":102,"text":"公告","leading":0,"fontSize":30,"font":"Microsoft YaHei","color":"#fff"}}]}]};}
		]);
		return menuUI;
	})(View);
var pipTipUI=(function(_super){
		function pipTipUI(){
			
		    this.otheYxb=null;
		    this.txt=null;

			pipTipUI.__super.call(this);
		}

		CLASS$(pipTipUI,'ui.pop.pipTipUI',_super);
		var __proto__=pipTipUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(pipTipUI.uiView);
		}

		STATICATTR$(pipTipUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":705,"height":488},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/promit_bg.png"}},{"type":"Image","props":{"y":-47,"x":67,"skin":"images/promit.png"}},{"type":"Label","props":{"y":375,"x":127,"width":457,"var":"otheYxb","underline":false,"text":"查看别处游戏币","height":48,"fontSize":30,"font":"微软雅黑","color":"#7ad8ed","align":"center"}},{"type":"Label","props":{"y":167,"x":45,"wordWrap":true,"width":617,"var":"txt","text":"暂无可收获","height":132,"fontSize":40,"font":"微软雅黑","color":"#7ad8ed","align":"center"}},{"type":"Button","props":{"y":32,"x":629,"stateNum":"1","skin":"images/btn_close.png","name":"close"}},{"type":"Sprite","props":{"y":367,"x":219,"width":250,"pivotY":92.85714285714285,"pivotX":-7.1428571428571415,"height":162},"child":[{"type":"Line","props":{"y":139,"x":22,"toY":0,"toX":214,"lineWidth":2,"lineColor":"#7ad8ed"}}]}]};}
		]);
		return pipTipUI;
	})(Dialog);
var pop_yesNoUI=(function(_super){
		function pop_yesNoUI(){
			
		    this.txt=null;
		    this.yes=null;
		    this.no=null;

			pop_yesNoUI.__super.call(this);
		}

		CLASS$(pop_yesNoUI,'ui.pop.pop_yesNoUI',_super);
		var __proto__=pop_yesNoUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(pop_yesNoUI.uiView);
		}

		STATICATTR$(pop_yesNoUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":705,"height":488},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/promit_bg.png"}},{"type":"Image","props":{"y":-44,"x":67,"skin":"images/promit.png"}},{"type":"Label","props":{"y":153,"x":66,"wordWrap":true,"width":584,"var":"txt","text":"游戏进行中，返回大厅将进入自动 \\n托管状态，是否继续？","leading":20,"height":148,"fontSize":36,"font":"微软雅黑","color":"#cac4ff","align":"center"}},{"type":"Button","props":{"y":35,"x":630,"stateNum":1,"skin":"images/btn_close.png","name":"close"}},{"type":"Box","props":{"y":330,"x":77.5,"width":550},"child":[{"type":"Image","props":{"var":"yes","skin":"images/youhua2/yes.png"}},{"type":"Image","props":{"x":311,"var":"no","skin":"images/youhua2/no.png"}}]}]};}
		]);
		return pop_yesNoUI;
	})(Dialog);
var rankpopUI=(function(_super){
		function rankpopUI(){
			
		    this.listtab=null;
		    this.oneranknav=null;
		    this.tworanknav=null;
		    this.oneranklist=null;
		    this.tworanklist=null;
		    this.gzcontent=null;
		    this.gzcontenttext=null;
		    this.rankRich=null;
		    this.tuhao_null=null;

			rankpopUI.__super.call(this);
		}

		CLASS$(rankpopUI,'ui.pop.rankpopUI',_super);
		var __proto__=rankpopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(rankpopUI.uiView);
		}

		STATICATTR$(rankpopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":673,"visible":true,"popupCenter":true,"name":"render","height":1096},"child":[{"type":"Image","props":{"y":0,"x":7,"skin":"images/rank_bg.png"}},{"type":"Image","props":{"y":-48,"x":50,"skin":"images/rank_tit.png"}},{"type":"Image","props":{"y":116,"x":57,"skin":"images/tuhaobang.png"}},{"type":"Button","props":{"y":27.000000000000007,"x":614,"stateNum":"1","skin":"images/btn_close.png","name":"close"}},{"type":"Tab","props":{"y":383,"x":60,"var":"listtab","selectedIndex":1},"child":[{"type":"Button","props":{"stateNum":"2","skin":"images/btn_me.png","name":"item0"}},{"type":"Button","props":{"x":138,"stateNum":"2","skin":"images/btn_day_r.png","name":"item1"}},{"type":"Button","props":{"x":276,"stateNum":"2","skin":"images/btn_week.png","name":"item2"}},{"type":"Button","props":{"x":414,"stateNum":"2","skin":"images/btn_month.png","name":"item3"}}]},{"type":"Box","props":{"y":458,"x":56,"visible":false,"var":"oneranknav"},"child":[{"type":"Label","props":{"width":198,"text":"时间","height":42,"fontSize":34,"color":"#2e2651","bold":true,"align":"center"}},{"type":"Label","props":{"y":-5.684341886080802e-14,"x":349,"width":198,"text":"赢取游戏币","height":42,"fontSize":34,"color":"#2e2651","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":449.99999999999994,"x":39.99999999999999,"var":"tworanknav"},"child":[{"type":"Label","props":{"y":13,"x":10,"width":121,"text":"排名","height":39,"fontSize":30,"color":"#2e2651","bold":true,"align":"center"}},{"type":"Label","props":{"y":13,"x":442,"width":155,"text":"排名变化","height":39,"fontSize":30,"color":"#2e2651","bold":true,"align":"center"}},{"type":"Label","props":{"y":13,"x":291,"width":155,"text":"赢取金额","height":39,"fontSize":30,"color":"#2e2651","bold":true,"align":"center"}},{"type":"Label","props":{"y":13,"x":139,"width":155,"text":"玩家名称","height":39,"fontSize":30,"color":"#2e2651","bold":true,"align":"center"}}]},{"type":"List","props":{"y":534,"x":41,"width":598,"visible":true,"var":"oneranklist","vScrollBarSkin":"images/youhua2/vscroll.png","height":492},"child":[{"type":"Box","props":{"name":"render"},"child":[{"type":"Label","props":{"width":265,"name":"jltime","height":50,"fontSize":27,"color":"#2f2450","align":"center"}},{"type":"Label","props":{"x":333,"width":265,"name":"jlreward","height":50,"fontSize":27,"color":"#2f2450","align":"center"}}]}]},{"type":"List","props":{"y":524,"x":75,"width":572,"visible":"true","var":"tworanklist","vScrollBarSkin":"images/youhua2/vscroll.png","height":500},"child":[{"type":"Box","props":{"y":-2,"x":0,"visible":true,"name":"render"},"child":[{"type":"Label","props":{"y":4,"x":0,"width":68,"visible":true,"text":"1","name":"gzpaiming","height":52,"fontSize":28,"color":"#2e2651","align":"center"}},{"type":"Label","props":{"y":4,"x":269,"width":146,"visible":true,"text":"57024","overflow":"hidden","name":"coinsbet","height":52,"fontSize":28,"color":"#2e2651","align":"center"}},{"type":"Label","props":{"y":4,"x":117,"width":129,"visible":true,"text":"爱死你了cheche","overflow":"hidden","name":"username","height":52,"fontSize":28,"color":"#2e2651","align":"center"}},{"type":"Clip","props":{"y":10,"x":475.9999999999999,"width":50,"visible":true,"skin":"images/clip_order.png","name":"trend","index":0,"height":29,"clipY":3}}]}]},{"type":"Box","props":{"y":675,"x":113.99999999999994,"var":"gzcontent"},"child":[{"type":"Label","props":{"width":421,"var":"gzcontenttext","text":"暂无记录","height":118,"fontSize":20,"color":"#ffffff","bold":true,"align":"center"}}]},{"type":"List","props":{"y":138,"x":268,"var":"rankRich"},"child":[{"type":"Box","props":{},"child":[{"type":"Clip","props":{"x":-5.684341886080802e-14,"skin":"images/clip_rank1.png","index":0,"clipY":3}},{"type":"Label","props":{"y":1,"x":77,"width":116,"overflow":"visible","name":"rankName","height":31,"fontSize":28,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":1,"x":231.99999999999994,"width":116,"overflow":"visible","name":"rankAount","height":31,"fontSize":28,"color":"#ffffff","align":"center"}}]},{"type":"Box","props":{"y":60},"child":[{"type":"Clip","props":{"x":-5.684341886080802e-14,"skin":"images/clip_rank1.png","index":1,"clipY":3}},{"type":"Label","props":{"y":1,"x":76.99999999999994,"width":116,"overflow":"visible","name":"rankName","height":31,"fontSize":28,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"x":231.99999999999994,"width":116,"overflow":"visible","name":"rankAount","height":31,"fontSize":28,"color":"#ffffff","align":"center"}}]},{"type":"Box","props":{"y":119},"child":[{"type":"Clip","props":{"x":-5.684341886080802e-14,"skin":"images/clip_rank1.png","index":2,"clipY":3}},{"type":"Label","props":{"y":2,"x":76.99999999999994,"width":116,"overflow":"visible","name":"rankName","height":31,"fontSize":28,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":2,"x":231.99999999999994,"width":116,"overflow":"visible","name":"rankAount","height":31,"fontSize":28,"color":"#ffffff","align":"center"}}]}]},{"type":"Label","props":{"y":203,"x":389,"width":130,"var":"tuhao_null","text":"虚位以待","height":56,"fontSize":20,"color":"#ffffff","bold":true,"align":"center"}}]};}
		]);
		return rankpopUI;
	})(Dialog);
var rechargeUI=(function(_super){
		function rechargeUI(){
			
		    this.recharge_bg=null;
		    this.btn_chongzhi=null;
		    this.tabbox=null;
		    this.textinput=null;

			rechargeUI.__super.call(this);
		}

		CLASS$(rechargeUI,'ui.pop.rechargeUI',_super);
		var __proto__=rechargeUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(rechargeUI.uiView);
		}

		STATICATTR$(rechargeUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":750,"height":1218},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"recharge_bg","skin":"images/recharge/recharge_bg.png"}},{"type":"Button","props":{"y":984,"x":203,"var":"btn_chongzhi","stateNum":1,"skin":"images/btn_chong.png"}},{"type":"Image","props":{"y":429,"x":122,"skin":"images/fanguang.png"}},{"type":"Image","props":{"y":885.9999999999999,"x":68.0000000000001,"skin":"images/shuru.png"}},{"type":"Image","props":{"y":793,"x":415,"skin":"images/fanguang.png"}},{"type":"Image","props":{"y":802,"x":122,"skin":"images/fanguang.png"}},{"type":"Image","props":{"y":431,"x":415,"skin":"images/fanguang.png"}},{"type":"Image","props":{"y":186,"x":116,"skin":"images/shiyuan.png"}},{"type":"Image","props":{"y":186,"x":406,"skin":"images/wushiyuan.png"}},{"type":"Image","props":{"y":558,"x":116,"skin":"images/yibaiyuan.png"}},{"type":"Image","props":{"y":558,"x":406,"skin":"images/liangbai.png"}},{"type":"Button","props":{"y":51,"x":662,"stateNum":1,"skin":"images/btn_close.png","name":"close"}},{"type":"Tab","props":{"y":183,"x":116,"width":504,"var":"tabbox","selectedIndex":2,"height":649},"child":[{"type":"Button","props":{"y":0,"x":0,"width":216,"stateNum":2,"skin":"images/btn_kuang01.png","name":"item0","height":280}},{"type":"Button","props":{"y":0,"x":290,"width":216,"stateNum":2,"skin":"images/btn_kuang01.png","name":"item1","height":280}},{"type":"Button","props":{"y":372,"x":0,"width":216,"stateNum":2,"skin":"images/btn_kuang01.png","name":"item2","height":280}},{"type":"Button","props":{"y":372,"x":290,"width":216,"stateNum":2,"skin":"images/btn_kuang01.png","name":"item3","height":280}}]},{"type":"Label","props":{"y":891,"x":116,"width":545,"var":"textinput","text":"100","padding":"10","height":66,"fontSize":34,"font":"微软雅黑","color":"#ffffff","bold":true}},{"type":"Label","props":{"y":1040,"x":96}},{"type":"Image","props":{"y":149,"x":153,"skin":"images/recharge/chongzhi_1.png"}},{"type":"Image","props":{"y":1119,"x":134,"skin":"images/recharge/chongzhi_2.png"}}]};}
		]);
		return rechargeUI;
	})(Dialog);
var shouhuoUI=(function(_super){
		function shouhuoUI(){
			
		    this.otheYxb=null;
		    this.confirmS=null;
		    this.huanlezhi=null;
		    this.jifen=null;
		    this.huanlesou=null;
		    this.caijin=null;
		    this.zuanshi=null;
		    this.caifen=null;
		    this.jiankang=null;
		    this.liuliang=null;
		    this.totleCoin=null;

			shouhuoUI.__super.call(this);
		}

		CLASS$(shouhuoUI,'ui.pop.shouhuoUI',_super);
		var __proto__=shouhuoUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(shouhuoUI.uiView);
		}

		STATICATTR$(shouhuoUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":693,"height":973},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/shouhuo_bgNew.png"}},{"type":"Image","props":{"y":5,"x":57.5,"skin":"images/shouhuotit.png"}},{"type":"Button","props":{"y":65,"x":611,"stateNum":"1","skin":"images/btn_close.png","name":"close"}},{"type":"Box","props":{"y":750,"x":166},"child":[{"type":"Label","props":{"y":130,"x":76,"width":209,"var":"otheYxb","underline":false,"text":"查看别处游戏币","height":70,"fontSize":30,"font":"微软雅黑","color":"#ffffff"}},{"type":"Button","props":{"var":"confirmS","stateNum":"1","skin":"images/btn_confpng.png"}},{"type":"Sprite","props":{"y":170,"x":73,"width":215,"height":60},"child":[{"type":"Line","props":{"y":0,"x":0,"toY":0,"toX":209,"lineWidth":2,"lineColor":"#ffffff"}}]}]},{"type":"Box","props":{"y":178,"x":129},"child":[{"type":"Box","props":{"y":-3,"x":-7},"child":[{"type":"Label","props":{"width":141,"text":"欢乐值：","height":57,"fontSize":36,"font":"微软雅黑","color":"#8583cb","bold":true,"align":"right"}},{"type":"Label","props":{"x":157,"width":176,"var":"huanlezhi","text":"0","height":57,"fontSize":36,"color":"#8583cb","bold":true}}]},{"type":"Box","props":{"y":64,"x":-6},"child":[{"type":"Label","props":{"width":141,"text":"积分：","height":57,"fontSize":36,"font":"微软雅黑","color":"#8583cb","bold":true,"align":"right"}},{"type":"Label","props":{"x":156,"width":176,"var":"jifen","text":"0","height":57,"fontSize":36,"color":"#8583cb","bold":true}}]},{"type":"Box","props":{"y":127,"x":-6},"child":[{"type":"Label","props":{"width":141,"text":"欢乐豆：","height":57,"fontSize":36,"font":"微软雅黑","color":"#8583cb","bold":true,"align":"right"}},{"type":"Label","props":{"y":0,"x":156.00000000000006,"width":176,"var":"huanlesou","text":"0","height":57,"fontSize":36,"color":"#8583cb","bold":true}}]},{"type":"Box","props":{"y":190,"x":-6},"child":[{"type":"Label","props":{"width":141,"text":"彩金：","height":57,"fontSize":36,"font":"微软雅黑","color":"#8583cb","bold":true,"align":"right"}},{"type":"Label","props":{"x":156,"width":176,"var":"caijin","text":"0","height":57,"fontSize":36,"color":"#8583cb","bold":true}}]},{"type":"Box","props":{"y":251,"x":-6},"child":[{"type":"Label","props":{"width":141,"text":"钻石：","height":57,"fontSize":36,"font":"微软雅黑","color":"#8583cb","bold":true,"align":"right"}},{"type":"Label","props":{"y":0,"x":156.00000000000006,"width":176,"var":"zuanshi","text":"0","height":57,"fontSize":36,"color":"#8583cb","bold":true}}]},{"type":"Box","props":{"y":313,"x":-6},"child":[{"type":"Label","props":{"width":137,"text":"彩分：","height":62,"fontSize":36,"font":"微软雅黑","color":"#8583cb","bold":true,"align":"right"}},{"type":"Label","props":{"y":5,"x":156,"width":213,"var":"caifen","text":"0","height":62,"fontSize":36,"color":"#8583cb","bold":true}}]},{"type":"Box","props":{"y":377,"x":-10},"child":[{"type":"Label","props":{"width":137,"text":"健康金：","height":62,"fontSize":36,"font":"微软雅黑","color":"#8583cb","bold":true,"align":"right"}},{"type":"Label","props":{"y":5,"x":160,"width":213,"var":"jiankang","text":"0","height":62,"fontSize":36,"color":"#8583cb","bold":true}}]},{"type":"Box","props":{"y":430,"x":-10},"child":[{"type":"Label","props":{"y":0,"x":-36,"width":173,"text":"平安流量：","height":62,"fontSize":36,"font":"微软雅黑","color":"#8583cb","bold":true,"align":"right"}},{"type":"Label","props":{"y":5,"x":160,"width":213,"var":"liuliang","text":"0","height":62,"fontSize":36,"color":"#8583cb","bold":true}}]},{"type":"Box","props":{"y":510,"x":-8},"child":[{"type":"Label","props":{"width":179,"text":"您的游戏币：","height":62,"fontSize":36,"font":"微软雅黑","color":"#b7aeff","bold":true}},{"type":"Label","props":{"x":235,"width":213,"var":"totleCoin","text":"0","height":62,"fontSize":36,"color":"#b7aeff","bold":true}}]}]}]};}
		]);
		return shouhuoUI;
	})(Dialog);
var warnPopUI=(function(_super){
		function warnPopUI(){
			
		    this.content_box=null;
		    this.content=null;

			warnPopUI.__super.call(this);
		}

		CLASS$(warnPopUI,'ui.pop.warnPopUI',_super);
		var __proto__=warnPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(warnPopUI.uiView);
		}

		STATICATTR$(warnPopUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":400,"height":160},"child":[{"type":"Box","props":{"y":85,"x":200,"width":400,"var":"content_box","pivotY":85,"pivotX":200,"height":160},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/warnbg.png"}},{"type":"Label","props":{"y":53,"x":0,"width":400,"var":"content","overflow":"visible","height":57,"fontSize":25,"font":"微软雅黑","color":"#ffffff","align":"center"}}]}]};}
		]);
		return warnPopUI;
	})(View);
var yuPopUI=(function(_super){
		function yuPopUI(){
			
		    this.btnRecharge=null;
		    this.yu_coinScore=null;
		    this.coinScore=null;

			yuPopUI.__super.call(this);
		}

		CLASS$(yuPopUI,'ui.pop.yuPopUI',_super);
		var __proto__=yuPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(yuPopUI.uiView);
		}

		STATICATTR$(yuPopUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":270,"height":55},"child":[{"type":"Box","props":{"y":0,"x":0,"width":263,"height":51},"child":[{"type":"Image","props":{"y":2,"x":12,"skin":"images/num_bg.png"}},{"type":"Button","props":{"y":4.999999999999972,"x":214.00000000000003,"var":"btnRecharge","stateNum":1,"skin":"images/btn_add.png"}},{"type":"Box","props":{"y":-3,"x":0},"child":[{"type":"Image","props":{"y":3,"x":1,"var":"yu_coinScore","skin":"images/yu.png"}},{"type":"Label","props":{"y":12,"x":55,"width":157,"var":"coinScore","text":"0","overflow":"hidden","height":44,"fontSize":26,"color":"#ffffff","align":"center"}}]}]}]};}
		]);
		return yuPopUI;
	})(View);
var faceUI=(function(_super){
		function faceUI(){
			
		    this.face_list=null;

			faceUI.__super.call(this);
		}

		CLASS$(faceUI,'ui.room.faceUI',_super);
		var __proto__=faceUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(faceUI.uiView);
		}

		STATICATTR$(faceUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":750,"height":553},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/headPop/emotion_bg2.png"}},{"type":"List","props":{"y":38,"x":39,"width":672,"var":"face_list","selectEnable":true,"height":467},"child":[{"type":"Box","props":{"width":170,"name":"render","height":170},"child":[{"type":"Image","props":{"y":155,"x":83,"width":114,"name":"faceImg","height":120,"anchorY":1,"anchorX":0.5}},{"type":"Label","props":{"y":172,"x":42,"name":"id","fontSize":0}}]}]}]};}
		]);
		return faceUI;
	})(View);
var keybordUI=(function(_super){
		function keybordUI(){
			
		    this.del=null;
		    this.sureBtn=null;

			keybordUI.__super.call(this);
		}

		CLASS$(keybordUI,'ui.room.keybordUI',_super);
		var __proto__=keybordUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(keybordUI.uiView);
		}

		STATICATTR$(keybordUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":750,"height":350},"child":[{"type":"Label","props":{"y":0,"x":0,"width":750,"height":350,"color":"#000","bgColor":"#afa5a5","alpha":0.6}},{"type":"Image","props":{"y":12,"x":10,"width":138,"skin":"images/keboard/numBtn.png","height":97}},{"type":"Image","props":{"y":12,"x":160,"skin":"images/keboard/numBtn.png"}},{"type":"Image","props":{"y":12,"x":310,"skin":"images/keboard/numBtn.png"}},{"type":"Image","props":{"y":12,"x":459,"skin":"images/keboard/numBtn.png"}},{"type":"Image","props":{"y":127,"x":10,"skin":"images/keboard/numBtn.png"}},{"type":"Image","props":{"y":127,"x":160,"skin":"images/keboard/numBtn.png"}},{"type":"Image","props":{"y":127,"x":309,"skin":"images/keboard/numBtn.png"}},{"type":"Image","props":{"y":127,"x":459,"skin":"images/keboard/numBtn.png"}},{"type":"Image","props":{"y":241,"x":459,"skin":"images/keboard/numBtn.png"}},{"type":"Image","props":{"y":241,"x":10,"skin":"images/keboard/numBtn.png"}},{"type":"Image","props":{"y":241,"x":160,"skin":"images/keboard/numBtn.png"}},{"type":"Image","props":{"y":241,"x":309,"skin":"images/keboard/numBtn.png"}},{"type":"Label","props":{"y":13,"x":11,"width":138,"valign":"middle","text":1,"name":"num1","height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":11,"x":159,"width":138,"valign":"middle","text":2,"name":"num2","height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":13,"x":311,"width":138,"valign":"middle","text":3,"name":"num3","height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":13,"x":458,"width":138,"valign":"middle","text":"0","name":"num0","height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":127,"x":10,"width":138,"valign":"middle","text":4,"name":"num4","height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":128,"x":160,"width":138,"valign":"middle","text":5,"name":"num5","height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":126,"x":310,"width":138,"valign":"middle","text":6,"name":"num6","height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":127,"x":458,"width":138,"valign":"middle","text":"00","name":"num00","height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":241,"x":10,"width":138,"valign":"middle","text":7,"name":"num7","height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":242,"x":159,"width":138,"valign":"middle","text":8,"name":"num8","height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":240,"x":310,"width":138,"valign":"middle","text":9,"name":"num9","height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":242,"x":459,"width":138,"valign":"middle","text":".","name":"numpoint","height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Button","props":{"y":242,"x":607,"var":"del","stateNum":1,"skin":"images/keboard/rBtn.png","labelSize":40,"label":"删除"}},{"type":"Button","props":{"y":13,"x":607,"var":"sureBtn","stateNum":1,"skin":"images/keboard/sBtn.png","labelSize":40,"label":"确定"}}]};}
		]);
		return keybordUI;
	})(View);
var moreUI=(function(_super){
		function moreUI(){
			
		    this.back_paixin_box=null;
		    this.big_bg=null;
		    this.btn_back=null;
		    this.btn_paixin=null;
		    this.paixin_img=null;

			moreUI.__super.call(this);
		}

		CLASS$(moreUI,'ui.room.moreUI',_super);
		var __proto__=moreUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(moreUI.uiView);
		}

		STATICATTR$(moreUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":280,"height":528},"child":[{"type":"Box","props":{"y":0,"x":0,"var":"back_paixin_box"},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"big_bg","skin":"images/room/pop_small_bg.png"}},{"type":"Box","props":{"y":20,"x":22,"var":"btn_back"},"child":[{"type":"Image","props":{"skin":"images/room/pop_back_icon.png"}},{"type":"Image","props":{"y":12,"x":108,"skin":"images/room/pop_back.png"}}]},{"type":"Box","props":{"y":112,"x":22,"var":"btn_paixin"},"child":[{"type":"Image","props":{"y":11,"x":108,"skin":"images/room/pop_paixin.png"}},{"type":"Image","props":{"skin":"images/room/pop_paixin_icon.png"}}]}]},{"type":"Image","props":{"y":0,"x":0,"var":"paixin_img","skin":"images/room/paixin_icon.png"}}]};}
		]);
		return moreUI;
	})(View);
var playerUI=(function(_super){
		function playerUI(){
			

			playerUI.__super.call(this);
		}

		CLASS$(playerUI,'ui.room.playerUI',_super);
		var __proto__=playerUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(playerUI.uiView);
		}

		STATICATTR$(playerUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":132,"name":"border_time","height":210},"child":[{"type":"Image","props":{"skin":"images/room/head_bg.png"}},{"type":"Image","props":{"y":91,"x":61,"width":99,"skin":"images/youhua2/head0.png","pivotY":49,"pivotX":52,"name":"head_img","height":94}},{"type":"Label","props":{"y":5,"x":3,"width":110,"valign":"middle","name":"user_name","leading":0,"height":25,"fontSize":20,"font":"微软雅黑","color":"#fff","bold":false,"align":"center"}},{"type":"Label","props":{"y":143,"x":4,"width":110,"name":"total_money","height":20,"fontSize":20,"font":"微软雅黑","color":"#e2af24","align":"center"}},{"type":"Image","props":{"y":40,"x":6,"skin":"images/room/head_boder.png"}},{"type":"Box","props":{"y":-82,"x":-89,"name":"chat_box"},"child":[{"type":"Image","props":{"skin":"images/room/headPop/chat_bg.png","sizeGrid":"16,31,36,130"}},{"type":"Label","props":{"y":9,"x":2,"width":293,"visible":true,"valign":"middle","name":"chat_content","height":30,"fontSize":24,"font":"微软雅黑","color":"#ffffff","bold":false,"align":"center"}}]},{"type":"Box","props":{"y":-100,"x":15,"name":"chat_boxFace"},"child":[{"type":"Image","props":{"skin":"images/room/headPop/chat_bg2.png"}},{"type":"Image","props":{"y":6,"x":14,"width":70,"name":"chat_content","height":70}}]},{"type":"Image","props":{"y":-2,"x":-3,"skin":"images/room/headPop/time_light.png","name":"border_time"}}]};}
		]);
		return playerUI;
	})(View);
var resultPopUI=(function(_super){
		function resultPopUI(){
			
		    this.result_bg=null;
		    this.defen_chouma_box=null;
		    this.btn_list=null;
		    this.animate_box=null;
		    this.win_or_lose=null;
		    this.lose_ping=null;
		    this.lose_text=null;
		    this.ping_text=null;

			resultPopUI.__super.call(this);
		}

		CLASS$(resultPopUI,'ui.room.resultPopUI',_super);
		var __proto__=resultPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(resultPopUI.uiView);
		}

		STATICATTR$(resultPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":750,"name":"btn_goon","height":1334},"child":[{"type":"Image","props":{"y":671,"x":374,"width":750,"var":"result_bg","skin":"images/room/light_money.png","pivotY":670.5882352941176,"pivotX":373.52941176470586,"height":1334}},{"type":"Box","props":{"y":839,"x":250,"var":"defen_chouma_box"},"child":[{"type":"Clip","props":{"skin":"images/room/clip_defen_chouma.png","index":0,"clipX":2}},{"type":"Clip","props":{"y":75,"skin":"images/room/clip_defen_chouma.png","index":1,"clipX":2}},{"type":"Clip","props":{"y":146,"x":-46.00000000000017,"skin":"images/room/headPop/clip_fuwufei.png","name":"fuwufei","index":0,"clipX":2}},{"type":"Box","props":{"y":4,"x":140,"name":"score_box"},"child":[{"type":"Label","props":{"text":"+3","name":"deFen","font":"bigNum"}},{"type":"Label","props":{"y":75,"text":"-46","name":"chouMa","font":"bigNum"}}]},{"type":"Label","props":{"y":149,"x":140.00000000000006,"text":"200","name":"fuwufei_num","font":"smallLose"}}]},{"type":"Box","props":{"y":1040,"x":0,"width":750,"var":"btn_list","height":242},"child":[{"type":"Image","props":{"y":42,"x":200,"width":287,"skin":"images/room/huan_zhuo.png","pivotY":36.734693877551024,"pivotX":144.89795918367346,"name":"btn_huan_zhuo","height":91}},{"type":"Image","props":{"y":160,"x":31,"skin":"images/youhua2/back.png","name":"btn_back"}},{"type":"Box","props":{"y":47,"x":550,"width":287,"pivotY":42,"pivotX":146,"name":"btn_goon","height":92},"child":[{"type":"Image","props":{"y":1,"x":3,"width":287,"skin":"images/room/ganme_goon.png","height":92}},{"type":"Image","props":{"y":25.81632653061247,"x":236.77551020408163,"skin":"images/room/headPop/miao.png"}},{"type":"Clip","props":{"y":19,"x":210,"skin":"images/room/headPop/clip_countDown.png","name":"cound_down","interval":1000,"index":0,"clipX":5,"autoPlay":false}}]}]},{"type":"Box","props":{"y":437,"x":381,"width":645,"var":"animate_box","pivotY":432.1428571428571,"pivotX":328.57142857142856,"height":831},"child":[{"type":"Image","props":{"y":415.5,"x":322.5,"var":"win_or_lose","skin":"images/room/lose_icon.png","anchorY":0.5,"anchorX":0.5}},{"type":"Box","props":{"y":690.6666666666666,"x":222.71794871794873,"var":"lose_ping"},"child":[{"type":"Image","props":{"y":33.33333333333337,"x":101.28205128205127,"width":202,"var":"lose_text","skin":"images/room/lose_text.png","pivotY":33.333333333333336,"pivotX":101.28205128205128,"height":59}},{"type":"Image","props":{"y":0,"x":39,"var":"ping_text","skin":"images/room/ping_text.png"}}]}]}]};}
		]);
		return resultPopUI;
	})(Dialog);
var roomUI=(function(_super){
		function roomUI(){
			
		    this.big_bg=null;
		    this.more_icon=null;
		    this.help_icon=null;
		    this.paixin_info=null;
		    this.pxdf_icon=null;
		    this.meihua_icon=null;
		    this.chat_icon=null;
		    this.face_icon=null;
		    this.yu_wrap_box=null;
		    this.head1_bg_wrap=null;
		    this.head2_bg_wrap=null;
		    this.room_type=null;
		    this.game_area_wrap=null;
		    this.contrast_bg=null;
		    this.public_area=null;
		    this.btnStart=null;
		    this.opposite_area=null;
		    this.mine_area=null;
		    this.drag_area=null;
		    this.daoju_box=null;
		    this.result_mask=null;
		    this.result_wrap=null;
		    this.tuoguan_box=null;

			roomUI.__super.call(this);
		}

		CLASS$(roomUI,'ui.room.roomUI',_super);
		var __proto__=roomUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("ui.room.playerUI",ui.room.playerUI);
			View.regComponent("ui.room.tuogguanPopUI",ui.room.tuogguanPopUI);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(roomUI.uiView);
		}

		STATICATTR$(roomUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"y":0,"width":750,"name":"head_img","height":1334},"child":[{"type":"Image","props":{"y":0,"var":"big_bg","skin":"images/room_bg2.jpg","name":"big_bg","centerX":0}},{"type":"Image","props":{"y":10,"x":13,"var":"more_icon","skin":"images/room/more_icon.png"}},{"type":"Image","props":{"var":"help_icon","top":10,"skin":"images/room/help_icon.png","right":13,"anchorX":1}},{"type":"Image","props":{"y":640,"x":56,"var":"paixin_info","skin":"images/room/paixin_info.png"}},{"type":"Image","props":{"y":590,"x":76,"var":"pxdf_icon","skin":"images/room/pxdf_icon.png","name":"pxdf_icon"}},{"type":"Image","props":{"y":367.00000000000006,"x":94.99999999999986,"var":"meihua_icon","skin":"images/room/meihua-icon.png","name":"meihua_icon"}},{"type":"Image","props":{"y":1240,"x":623.0000000000001,"var":"chat_icon","skin":"images/room/chat_icon.png","right":40}},{"type":"Image","props":{"y":1244,"x":515,"var":"face_icon","skin":"images/room/face_icon.png","right":165,"bottom":20}},{"type":"Box","props":{"y":1254,"x":33,"var":"yu_wrap_box"}},{"type":"player","props":{"y":120,"x":90,"var":"head1_bg_wrap","runtime":"ui.room.playerUI"}},{"type":"player","props":{"y":1012,"x":90,"var":"head2_bg_wrap","runtime":"ui.room.playerUI"}},{"type":"Box","props":{"y":471.9999999999999,"x":88.99999999999987,"var":"room_type"},"child":[{"type":"Image","props":{"y":50,"x":-31.00000000000003,"skin":"images/room/base_point.png"}},{"type":"Image","props":{"y":42,"x":-48.00000000000005,"skin":"images/room/coin_icon.png"}},{"type":"Label","props":{"y":54,"x":6,"width":150,"text":"底分：","name":"base_point_num","height":31,"fontSize":24,"font":"微软雅黑","color":"#fff"}},{"type":"Clip","props":{"y":-1,"x":2,"skin":"images/room/clip_chang_icon.png","name":"chang_xin","index":-1,"clipX":4}}]},{"type":"Box","props":{"y":210,"x":300,"var":"game_area_wrap"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/game_area.png"}},{"type":"Image","props":{"y":162,"x":20,"skin":"images/room/opposite_side.png"}},{"type":"Image","props":{"y":162,"x":146,"skin":"images/room/opposite_side.png"}},{"type":"Image","props":{"y":12,"x":20,"skin":"images/room/opposite_side.png"}},{"type":"Image","props":{"y":12,"x":270,"skin":"images/room/opposite_side.png"}},{"type":"Image","props":{"y":12,"x":146,"skin":"images/room/opposite_side.png"}},{"type":"Image","props":{"y":162.00000000000006,"x":270,"skin":"images/room/opposite_side.png"}},{"type":"Image","props":{"y":3,"x":11,"width":127,"var":"contrast_bg","skin":"images/room/contrast_bg.png"}},{"type":"Box","props":{"y":313,"x":0,"var":"public_area"},"child":[{"type":"Image","props":{"skin":"images/room/public_area.png"}},{"type":"Label","props":{"y":60,"x":7,"width":386,"valign":"middle","text":"等待下一局开始...","name":"wait_text","leading":0,"height":45,"fontSize":25,"font":"微软雅黑","color":"#ffffff","bold":false,"align":"center"}},{"type":"Box","props":{"y":15,"x":25,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":15,"x":149,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":15,"x":275,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":0,"x":0,"visible":false,"var":"btnStart"},"child":[{"type":"Button","props":{"y":25.5,"x":34,"stateNum":"1","skin":"images/youhua2/btn_start.png"}},{"type":"Clip","props":{"y":62,"x":282,"skin":"images/youhua2/clip_time.png","name":"time_down","interval":1000,"clipX":5,"autoPlay":false}}]}]},{"type":"Box","props":{"y":15,"x":25,"var":"opposite_area"},"child":[{"type":"Box","props":{"y":2,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"x":124,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"x":250,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":150,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":150,"x":124,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":150,"x":250,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]}]},{"type":"Box","props":{"y":486,"x":20,"var":"mine_area"},"child":[{"type":"Box","props":{"y":1,"x":0.9999999999999432,"name":"pai_bg_box"},"child":[{"type":"Image","props":{"y":73,"x":53,"width":109,"skin":"images/room/own_side.png","pivotY":72.31668039847202,"pivotX":53.24694779417271,"name":"pai_bg","height":143}},{"type":"Image","props":{"y":73,"x":180,"width":109,"skin":"images/room/own_side.png","pivotY":72.7810650887574,"pivotX":53.84615384615385,"name":"pai_bg","height":143}},{"type":"Image","props":{"y":73,"x":305,"width":109,"skin":"images/room/own_side.png","pivotY":72.7810650887574,"pivotX":55.02958579881657,"name":"pai_bg","height":143}},{"type":"Image","props":{"y":220,"x":53,"width":109,"skin":"images/room/own_side.png","pivotY":71.59763313609467,"pivotX":53.84615384615385,"name":"pai_bg","height":143}},{"type":"Image","props":{"y":220,"x":180,"width":109,"skin":"images/room/own_side.png","pivotY":73.37278106508876,"pivotX":55.029585798816576,"name":"pai_bg","height":143}},{"type":"Image","props":{"y":220,"x":305,"width":109,"skin":"images/room/own_side.png","pivotY":71.00591715976331,"pivotX":55.02958579881657,"name":"pai_bg","height":143}},{"type":"Image","props":{"skin":"images/room/choice_icon2.png","name":"pai_bgLight"}},{"type":"Image","props":{"y":0,"x":126,"skin":"images/room/choice_icon2.png","name":"pai_bgLight"}},{"type":"Image","props":{"y":0,"x":250,"skin":"images/room/choice_icon2.png","name":"pai_bgLight"}},{"type":"Image","props":{"y":149,"x":0,"skin":"images/room/choice_icon2.png","name":"pai_bgLight"}},{"type":"Image","props":{"y":149,"x":126,"skin":"images/room/choice_icon2.png","name":"pai_bgLight"}},{"type":"Image","props":{"y":149,"x":250,"skin":"images/room/choice_icon2.png","name":"pai_bgLight"}}]},{"type":"Box","props":{"y":5,"x":5,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":5,"x":129,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":4,"x":255,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":154,"x":5,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":154,"x":129,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":154,"x":255,"name":"pai_box"},"child":[{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":4.5,"x":4.5,"name":"pai_white_box"},"child":[{"type":"Image","props":{"y":69,"x":53,"skin":"images/room/pai_white2.png","name":"pai_white","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":69,"x":179,"skin":"images/room/pai_white2.png","name":"pai_white","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":69,"x":304,"skin":"images/room/pai_white2.png","name":"pai_white","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":219,"x":52,"skin":"images/room/pai_white2.png","name":"pai_white","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":220,"x":179,"skin":"images/room/pai_white2.png","name":"pai_white","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":219,"x":304,"skin":"images/room/pai_white2.png","name":"pai_white","anchorY":0.5,"anchorX":0.5}}]}]}]},{"type":"Box","props":{"y":1036,"x":235,"var":"drag_area","mouseEnabled":true},"child":[{"type":"Image","props":{"skin":"images/room/choice_icon.png","left":0}},{"type":"Image","props":{"skin":"images/room/choice_icon.png","left":121}},{"type":"Image","props":{"skin":"images/room/choice_icon.png","left":242}},{"type":"Image","props":{"skin":"images/room/choice_icon.png","left":363}},{"type":"Box","props":{"y":146,"x":111,"name":"pai_box","anchorY":1,"anchorX":1},"child":[{"type":"Image","props":{"y":-7,"x":-8,"skin":"images/room/dragBg.png","name":"drag_bg"}},{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":146,"x":231,"name":"pai_box","anchorY":1,"anchorX":1},"child":[{"type":"Image","props":{"y":-7,"x":-8,"skin":"images/room/dragBg.png","name":"drag_bg"}},{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":146,"x":352,"name":"pai_box","anchorY":1,"anchorX":1},"child":[{"type":"Image","props":{"y":-7,"x":-8,"skin":"images/room/dragBg.png","name":"drag_bg"}},{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]},{"type":"Box","props":{"y":146,"x":473,"name":"pai_box","anchorY":1,"anchorX":1},"child":[{"type":"Image","props":{"y":-7,"x":-8,"skin":"images/room/dragBg.png","name":"drag_bg"}},{"type":"Image","props":{"skin":"images/room/basePai.png","name":"pai_skin"}},{"type":"Clip","props":{"y":71,"x":35,"skin":"images/room/clip_huaseImage.png","name":"hua_se","index":0,"clipX":4,"autoPlay":false}},{"type":"Clip","props":{"y":0,"x":1,"skin":"images/room/clip_numberImage.png","name":"shu_zi","index":0,"clipY":2,"clipX":13}}]}]},{"type":"Box","props":{"y":1000,"x":60,"var":"daoju_box"},"child":[{"type":"Clip","props":{"y":5,"x":0,"name":"mine_dj","interval":130,"clipY":7,"autoPlay":false}},{"type":"Clip","props":{"y":-885,"x":0,"name":"opp_dj","interval":130,"index":0,"clipY":7,"autoPlay":false}}]},{"type":"Image","props":{"y":0,"var":"result_mask","skin":"images/room/mask_bg.png","mouseThrough":false,"mouseEnabled":true,"centerX":0}},{"type":"Box","props":{"y":210,"x":300,"var":"result_wrap","mouseThrough":false,"mouseEnabled":false},"child":[{"type":"Clip","props":{"skin":"images/room/clip_result_light2.png","name":"contrast_light","interval":120,"clipX":5,"autoPlay":false}},{"type":"Box","props":{"y":-32,"x":-4,"name":"opposite_score_box"},"child":[{"type":"Box","props":{"y":-10,"x":-40,"name":"result_dan_li"},"child":[{"type":"Label","props":{"y":13,"x":96.42553191489361,"width":83,"text":"+10","name":"line_score","height":26,"fontSize":30,"font":"smallNum","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":10,"x":0.4255319148936181,"width":97,"text":"高牌","pivotX":0.425531914893617,"name":"pai_xin","height":26,"fontSize":30,"font":"chinese","color":"#ffffff","align":"right"}},{"type":"Image","props":{"x":12.425531914893618,"skin":"images/room/small_light.png","scaleY":0.8,"scaleX":0.8,"name":"small_light"}},{"type":"Box","props":{"y":-30,"x":25,"name":"dan_li_sheng"},"child":[{"type":"Label","props":{"x":0.4255319148936181,"width":97,"text":"单列胜","pivotX":0.425531914893617,"height":26,"fontSize":30,"font":"chinese","color":"#ffffff","align":"right"}},{"type":"Label","props":{"y":3,"x":98.42553191489361,"width":83,"text":"+1","height":26,"fontSize":30,"font":"smallNum","color":"#ffffff","align":"left"}}]}]},{"type":"Box","props":{"y":-10,"x":110,"name":"result_dan_li"},"child":[{"type":"Label","props":{"y":13,"x":96.42553191489361,"width":83,"text":"+10","name":"line_score","height":26,"fontSize":30,"font":"smallNum","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":10,"x":0.4255319148936181,"width":97,"text":"高牌","pivotX":0.425531914893617,"name":"pai_xin","height":26,"fontSize":30,"font":"chinese","color":"#ffffff","align":"right"}},{"type":"Image","props":{"x":12.425531914893618,"skin":"images/room/small_light.png","scaleY":0.8,"scaleX":0.8,"name":"small_light"}},{"type":"Box","props":{"y":-30,"x":25,"name":"dan_li_sheng"},"child":[{"type":"Label","props":{"x":0.4255319148936181,"width":97,"text":"单列胜","pivotX":0.425531914893617,"height":26,"fontSize":30,"font":"chinese","color":"#ffffff","align":"right"}},{"type":"Label","props":{"y":3,"x":98.42553191489361,"width":83,"text":"+1","height":26,"fontSize":30,"font":"smallNum","color":"#ffffff","align":"left"}}]}]},{"type":"Box","props":{"y":-10,"x":250,"name":"result_dan_li"},"child":[{"type":"Label","props":{"y":13,"x":96.42553191489361,"width":83,"text":"+10","name":"line_score","height":26,"fontSize":30,"font":"smallNum","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":10,"x":0.4255319148936181,"width":97,"text":"高牌","pivotX":0.425531914893617,"name":"pai_xin","height":26,"fontSize":30,"font":"chinese","color":"#ffffff","align":"right"}},{"type":"Image","props":{"x":12.425531914893618,"skin":"images/room/small_light.png","scaleY":0.8,"scaleX":0.8,"name":"small_light"}},{"type":"Box","props":{"y":-30,"x":25,"name":"dan_li_sheng"},"child":[{"type":"Label","props":{"x":0.4255319148936181,"width":97,"text":"单列胜","pivotX":0.425531914893617,"height":26,"fontSize":30,"font":"chinese","color":"#ffffff","align":"right"}},{"type":"Label","props":{"y":3,"x":98.42553191489361,"width":83,"text":"+1","height":26,"fontSize":30,"font":"smallNum","color":"#ffffff","align":"left"}}]}]},{"type":"Image","props":{"y":-22.99999999999997,"x":55,"skin":"images/room/big_light.png","name":"big_light"}},{"type":"Label","props":{"y":0,"x":128.00000000000017,"width":148,"text":"+20","name":"current_total","height":33,"font":"bigNum","align":"center"}}]},{"type":"Box","props":{"y":790,"x":6,"name":"mine_score_box","height":79},"child":[{"type":"Box","props":{"y":0,"x":-40,"name":"result_dan_li"},"child":[{"type":"Label","props":{"y":13,"x":96.42553191489361,"width":83,"text":"+10","name":"line_score","height":26,"fontSize":30,"font":"smallNum","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":10,"x":0.4255319148936181,"width":97,"text":"高牌","pivotX":0.425531914893617,"name":"pai_xin","height":26,"fontSize":30,"font":"chinese","color":"#ffffff","align":"right"}},{"type":"Box","props":{"y":50,"x":25,"name":"dan_li_sheng"},"child":[{"type":"Label","props":{"x":0.4255319148936181,"width":97,"text":"单列胜","pivotX":0.425531914893617,"height":26,"fontSize":30,"font":"chinese","color":"#ffffff","align":"right"}},{"type":"Label","props":{"y":3,"x":98.42553191489361,"width":83,"text":"+1","height":26,"fontSize":30,"font":"smallNum","color":"#ffffff","align":"left"}}]},{"type":"Image","props":{"y":0,"x":12.425531914893611,"skin":"images/room/small_light.png","scaleY":0.8,"scaleX":0.8,"name":"small_light"}}]},{"type":"Box","props":{"x":110,"name":"result_dan_li"},"child":[{"type":"Label","props":{"y":13,"x":96.42553191489361,"width":83,"text":"+10","name":"line_score","height":26,"fontSize":30,"font":"smallNum","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":10,"x":0.4255319148936181,"width":97,"text":"高牌","pivotX":0.425531914893617,"name":"pai_xin","height":26,"fontSize":30,"font":"chinese","color":"#ffffff","align":"right"}},{"type":"Image","props":{"x":12.425531914893618,"skin":"images/room/small_light.png","scaleY":0.8,"scaleX":0.8,"name":"small_light"}},{"type":"Box","props":{"y":50,"x":25,"name":"dan_li_sheng"},"child":[{"type":"Label","props":{"x":0.4255319148936181,"width":97,"text":"单列胜","pivotX":0.425531914893617,"height":26,"fontSize":30,"font":"chinese","color":"#ffffff","align":"right"}},{"type":"Label","props":{"y":3,"x":98.42553191489361,"width":83,"text":"+1","height":26,"fontSize":30,"font":"smallNum","color":"#ffffff","align":"left"}}]}]},{"type":"Box","props":{"x":250,"name":"result_dan_li"},"child":[{"type":"Label","props":{"y":13,"x":96.42553191489361,"width":83,"text":"+10","name":"line_score","height":26,"fontSize":30,"font":"smallNum","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":10,"x":0.4255319148936181,"width":97,"text":"高牌","pivotX":0.425531914893617,"name":"pai_xin","height":26,"fontSize":30,"font":"chinese","color":"#ffffff","align":"right"}},{"type":"Image","props":{"x":12.425531914893618,"skin":"images/room/small_light.png","scaleY":0.8,"scaleX":0.8,"name":"small_light"}},{"type":"Box","props":{"y":50,"x":25,"name":"dan_li_sheng"},"child":[{"type":"Label","props":{"x":0.4255319148936181,"width":97,"text":"单列胜","pivotX":0.425531914893617,"height":26,"fontSize":30,"font":"chinese","color":"#ffffff","align":"right"}},{"type":"Label","props":{"y":3,"x":98.42553191489361,"width":83,"text":"+1","height":26,"fontSize":30,"font":"smallNum","color":"#ffffff","align":"left"}}]}]},{"type":"Image","props":{"y":-10,"x":55.00000000000006,"skin":"images/room/big_light.png","name":"big_light"}},{"type":"Label","props":{"y":10,"x":128.00000000000006,"width":148,"text":"+20","name":"current_total","height":33,"font":"bigNum","align":"center"}}]},{"type":"Box","props":{"y":375,"x":47,"name":"ping_box"},"child":[{"type":"Image","props":{"y":28,"x":28,"width":37,"skin":"images/room/headPop/ping.png","scaleY":1.4,"scaleX":1.4,"pivotY":20.21276595744681,"pivotX":20.21276595744681,"name":"ping_icon","height":37}},{"type":"Image","props":{"y":28,"x":163,"width":37,"skin":"images/room/headPop/ping.png","scaleY":1.4,"scaleX":1.4,"pivotY":20.21276595744681,"pivotX":20.21276595744681,"name":"ping_icon","height":37}},{"type":"Image","props":{"y":28,"x":287,"width":37,"skin":"images/room/headPop/ping.png","scaleY":1.4,"scaleX":1.4,"pivotY":20.21276595744681,"pivotX":20.21276595744681,"name":"ping_icon","height":37}}]},{"type":"Box","props":{"y":417,"x":-4,"width":427,"name":"quanWin_box","height":415},"child":[{"type":"Image","props":{"y":215,"x":195,"width":427,"skin":"images/room/headPop/allWinBg.png","rotation":0,"pivotY":215,"pivotX":194,"name":"light","height":415}},{"type":"Image","props":{"y":215,"x":208,"width":227,"skin":"images/room/headPop/allWin.png","pivotY":36,"pivotX":115,"name":"quansheng1","height":77}},{"type":"Image","props":{"y":215,"x":208,"width":227,"skin":"images/room/headPop/allWin.png","pivotY":36,"pivotX":115,"name":"quansheng2","height":77}}]},{"type":"Box","props":{"y":-50,"x":-300,"width":751,"name":"perfect_box","height":1169},"child":[{"type":"Image","props":{"y":433,"x":365,"width":750,"skin":"images/room/headPop/perfect_bg.png","pivotY":432.6086956521739,"pivotX":365.2173913043478,"name":"perfect_bg","height":1000}},{"type":"Image","props":{"y":414,"x":377,"width":548,"skin":"images/room/headPop/perfect.png","pivotY":104.34782608695652,"pivotX":276.0869565217391,"name":"perfect_txt","height":172}}]}]},{"type":"tuogguanPop","props":{"var":"tuoguan_box","centerX":0,"bottom":0,"runtime":"ui.room.tuogguanPopUI"}}]};}
		]);
		return roomUI;
	})(View);
var talkUI=(function(_super){
		function talkUI(){
			
		    this.example_list=null;

			talkUI.__super.call(this);
		}

		CLASS$(talkUI,'ui.room.talkUI',_super);
		var __proto__=talkUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(talkUI.uiView);
		}

		STATICATTR$(talkUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":750,"height":700},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"images/room/talk_bg.png"}},{"type":"List","props":{"y":195,"x":63,"width":640,"var":"example_list","selectEnable":true,"height":495},"child":[{"type":"Box","props":{"width":640,"visible":true,"name":"render","height":100},"child":[{"type":"Label","props":{"y":-4,"x":23,"width":604,"valign":"middle","name":"msg","height":100,"fontSize":36,"font":"微软雅黑","color":"#e7dbdb"}},{"type":"Image","props":{"x":0,"skin":"images/room/under_line.png","bottom":0}},{"type":"Label","props":{"y":6,"x":33,"width":604,"valign":"middle","name":"id","height":100,"fontSize":0,"font":"微软雅黑","color":"#e7dbdb"}}]},{"type":"VScrollBar","props":{"y":133,"x":522.9999999999999,"name":"scrollBar"}}]}]};}
		]);
		return talkUI;
	})(View);
var tuogguanPopUI=(function(_super){
		function tuogguanPopUI(){
			

			tuogguanPopUI.__super.call(this);
		}

		CLASS$(tuogguanPopUI,'ui.room.tuogguanPopUI',_super);
		var __proto__=tuogguanPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(tuogguanPopUI.uiView);
		}

		STATICATTR$(tuogguanPopUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1334,"height":361},"child":[{"type":"Box","props":{"y":0,"x":0,"alpha":0.5},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":1334,"lineWidth":0,"height":361,"fillColor":"#000000"}}]},{"type":"Box","props":{"y":70,"x":427.5,"name":"image_box"},"child":[{"type":"Image","props":{"x":-0.5,"skin":"images/room/tuoguan.png","name":"tuoguan_img"}},{"type":"Clip","props":{"y":71,"x":397,"skin":"images/room/clip_tuoguan.png","name":"diandian","interval":500,"clipX":3,"autoPlay":false}}]},{"type":"Image","props":{"y":225,"x":546.5,"skin":"images/youhua2/quxiao.png","name":"tg"}}]};}
		]);
		return tuogguanPopUI;
	})(View);
var halRoomLevelUI=(function(_super){
		function halRoomLevelUI(){
			
		    this.levelbg=null;
		    this.lineNum=null;
		    this.numAtlist=null;
		    this.difen_bottom=null;

			halRoomLevelUI.__super.call(this);
		}

		CLASS$(halRoomLevelUI,'ui.UI.halRoomLevelUI',_super);
		var __proto__=halRoomLevelUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(halRoomLevelUI.uiView);
		}

		STATICATTR$(halRoomLevelUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":304,"height":336},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"levelbg","skin":"images/room1.png"}},{"type":"Label","props":{"y":291,"x":99,"width":125,"var":"lineNum","text":"999","overflow":"hidden","height":32,"fontSize":28,"color":"#ffffff","bold":false,"align":"center"}},{"type":"Label","props":{"y":65,"x":19,"width":256,"var":"numAtlist","text":"0","rotation":-8,"height":83,"font":"number_font","align":"center"}},{"type":"Label","props":{"y":225,"x":104,"width":97,"var":"difen_bottom","text":"底分:100","overflow":"visible","height":21,"fontSize":18,"font":"微软雅黑","color":"#ffffff","bold":false,"align":"center"}}]};}
		]);
		return halRoomLevelUI;
	})(View);