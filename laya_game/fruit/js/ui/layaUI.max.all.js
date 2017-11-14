var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var smallAwardPopUI=(function(_super){
		function smallAwardPopUI(){
			
		    this.xizhong_box=null;

			smallAwardPopUI.__super.call(this);
		}

		CLASS$(smallAwardPopUI,'ui.animate.smallAwardPopUI',_super);
		var __proto__=smallAwardPopUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("SkeletonPlayer",laya.ani.bone.Skeleton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(smallAwardPopUI.uiView);
		}

		STATICATTR$(smallAwardPopUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":200,"visible":true,"height":200},"child":[{"type":"Label","props":{"width":1334,"visible":false,"height":1334,"centerY":-120,"centerX":0,"bgColor":"#000000","alpha":0.3,"align":"center"}},{"type":"SkeletonPlayer","props":{"y":-40,"x":94,"url":"animate/smallAward.sk","name":"bg_DB"}},{"type":"Label","props":{"y":63,"x":-56,"width":317,"text":800,"name":"dom_text","height":86,"font":"award_font","align":"center"}},{"type":"Image","props":{"y":-142,"x":-275,"skin":"room/xzbg.png"}},{"type":"Box","props":{"y":-142,"var":"xizhong_box","centerX":0},"child":[{"type":"Image","props":{"y":1,"skin":"room/xizhong.png"}},{"type":"Image","props":{"x":323,"skin":"room/smallbei.png","name":"dom_bei"}},{"type":"Label","props":{"y":10,"x":192,"text":"1","name":"dom_num","height":119,"font":"xizhong_font"}}]}]};}
		]);
		return smallAwardPopUI;
	})(View);
var superAwardPopUI=(function(_super){
		function superAwardPopUI(){
			
		    this.dom_blue_bg=null;
		    this.xizhong_box=null;

			superAwardPopUI.__super.call(this);
		}

		CLASS$(superAwardPopUI,'ui.animate.superAwardPopUI',_super);
		var __proto__=superAwardPopUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("SkeletonPlayer",laya.ani.bone.Skeleton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(superAwardPopUI.uiView);
		}

		STATICATTR$(superAwardPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":200,"height":200},"child":[{"type":"SkeletonPlayer","props":{"y":-54,"x":99,"url":"animate/superAward.sk","name":"bg_DB"}},{"type":"Label","props":{"y":130,"x":-59,"width":317,"text":800,"name":"dom_text","height":86,"font":"award_font","align":"center"}},{"type":"Image","props":{"y":-160,"x":-275,"visible":false,"var":"dom_blue_bg","skin":"room/xzbg.png"}},{"type":"Box","props":{"y":-160,"var":"xizhong_box","centerX":20},"child":[{"type":"Label","props":{"y":15,"text":"10","name":"dom_num","height":120,"font":"xizhong_font","align":"left"}},{"type":"Image","props":{"x":202,"skin":"room/Bigbei.png","name":"dom_bei"}}]}]};}
		]);
		return superAwardPopUI;
	})(Dialog);
var hallUI=(function(_super){
		function hallUI(){
			
		    this.room_box=null;
		    this.middle_box=null;
		    this.header_box=null;

			hallUI.__super.call(this);
		}

		CLASS$(hallUI,'ui.hall.hallUI',_super);
		var __proto__=hallUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("SkeletonPlayer",laya.ani.bone.Skeleton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(hallUI.uiView);
		}

		STATICATTR$(hallUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":750,"height":1334},"child":[{"type":"Image","props":{"y":0,"skin":"hall/hallBg.jpg","centerX":0}},{"type":"Box","props":{"y":452,"x":28,"var":"room_box"},"child":[{"type":"Box","props":{"y":0,"x":5,"name":"new"},"child":[{"type":"SkeletonPlayer","props":{"y":230,"x":164,"url":"animate/new.sk"}},{"type":"Image","props":{"y":106,"x":236,"skin":"hall/recommend.png","name":"recommend"}},{"type":"Label","props":{"y":358,"x":100,"width":59,"text":"10人","name":"people","height":20,"fontSize":20,"font":"Microsoft YaHei","color":"#8be28d","bold":false,"align":"left"}},{"type":"Label","props":{"y":358,"x":152,"width":90,"text":"1000以上","name":"min_num","height":20,"fontSize":20,"font":"Microsoft YaHei","color":"#8be28d","bold":false,"align":"left"}},{"type":"Image","props":{"y":328,"x":148,"skin":"hall/beichang.png"}},{"type":"Label","props":{"y":333,"x":113,"width":35,"text":"10","name":"base","height":32,"fontSize":20,"font":"bei_font","color":"#8be28d","bold":false,"align":"right"}},{"type":"Image","props":{"y":359,"x":71,"skin":"hall/new1.png"}}]},{"type":"Box","props":{"y":45,"x":348,"name":"low"},"child":[{"type":"SkeletonPlayer","props":{"y":190,"x":180,"url":"animate/low.sk"}},{"type":"Label","props":{"y":314,"x":121,"width":61,"text":"20人","name":"people","height":20,"fontSize":20,"font":"Microsoft YaHei","color":"#88a5d6","bold":false,"align":"left"}},{"type":"Label","props":{"y":314,"x":170,"width":90,"text":"2000以上","name":"min_num","height":20,"fontSize":20,"font":"Microsoft YaHei","color":"#88a5d6","bold":false,"align":"left"}},{"type":"Image","props":{"y":57,"x":253.0000000000001,"skin":"hall/recommend.png","name":"recommend"}},{"type":"Image","props":{"y":283,"x":166,"skin":"hall/beichang.png"}},{"type":"Label","props":{"y":287,"x":130,"width":35,"text":"50","name":"base","height":26,"fontSize":20,"font":"bei_font","color":"#8be28d","bold":false,"align":"right"}},{"type":"Image","props":{"y":315,"x":90,"skin":"hall/low2.png"}}]},{"type":"Box","props":{"y":435,"x":0,"name":"middle"},"child":[{"type":"SkeletonPlayer","props":{"y":209,"x":170,"url":"animate/middle.sk"}},{"type":"Label","props":{"y":332,"x":107,"width":58,"text":"15人","name":"people","height":20,"fontSize":20,"font":"Microsoft YaHei","color":"#edb497","bold":false,"align":"left"}},{"type":"Label","props":{"y":332,"x":160,"width":90,"text":"5000以上","name":"min_num","height":20,"fontSize":20,"font":"Microsoft YaHei","color":"#edb497","bold":false,"align":"left"}},{"type":"Image","props":{"y":68,"x":239.0000000000001,"skin":"hall/recommend.png","name":"recommend"}},{"type":"Image","props":{"y":301,"x":152,"skin":"hall/beichang.png"}},{"type":"Label","props":{"y":306,"x":116,"width":35,"text":"100","name":"base","height":26,"fontSize":20,"font":"bei_font","color":"#8be28d","bold":false,"align":"right"}},{"type":"Image","props":{"y":332,"x":77,"skin":"hall/middle3.png"}}]},{"type":"Box","props":{"y":428,"x":358,"name":"high"},"child":[{"type":"SkeletonPlayer","props":{"y":217,"x":171,"url":"animate/high.sk"}},{"type":"Label","props":{"y":339,"x":111,"text":"5人","name":"people","fontSize":20,"font":"Microsoft YaHei","color":"#e48ae3","bold":false,"align":"left"}},{"type":"Label","props":{"y":339,"x":162,"width":90,"text":"10000以上","name":"min_num","height":20,"fontSize":20,"font":"Microsoft YaHei","color":"#e48ae3","bold":false,"align":"left"}},{"type":"Image","props":{"y":71.00000000000011,"x":241,"skin":"hall/recommend.png","name":"recommend"}},{"type":"Image","props":{"y":310,"x":157,"skin":"hall/beichang.png"}},{"type":"Label","props":{"y":314,"x":121,"width":35,"text":"200","name":"base","height":26,"fontSize":20,"font":"bei_font","color":"#8be28d","bold":false,"align":"right"}},{"type":"Image","props":{"y":339,"x":80,"skin":"hall/high4.png"}}]}]},{"type":"Box","props":{"y":133,"x":0,"width":750,"var":"middle_box","mouseThrough":true},"child":[{"type":"Image","props":{"y":150,"x":151,"skin":"hall/quick.png","name":"btn_quick"}},{"type":"Image","props":{"y":55,"x":513,"visible":false,"skin":"hall/notice.png","name":"btn_notice"}},{"type":"Image","props":{"y":56,"x":33,"skin":"hall/gain_list.png","name":"btn_gainList"}},{"type":"Image","props":{"y":-96,"x":288,"skin":"hall/logo.png"}},{"type":"Image","props":{"y":70,"x":571,"visible":false,"skin":"hall/red.png","name":"redPoint"}},{"type":"Image","props":{"y":-94,"x":428,"skin":"load/neice.png","scaleY":0.6,"scaleX":0.6}}]},{"type":"Box","props":{"var":"header_box","mouseThrough":true,"mouseEnabled":true}}]};}
		]);
		return hallUI;
	})(View);
var headerUI=(function(_super){
		function headerUI(){
			
		    this.head_box=null;
		    this.you_box=null;
		    this.yu_box=null;
		    this.marquee_box=null;
		    this.menu_box=null;

			headerUI.__super.call(this);
		}

		CLASS$(headerUI,'ui.hall.headerUI',_super);
		var __proto__=headerUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("SkeletonPlayer",laya.ani.bone.Skeleton);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(headerUI.uiView);
		}

		STATICATTR$(headerUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":750,"mouseThrough":true,"height":280},"child":[{"type":"Box","props":{"y":0,"x":5,"width":740,"var":"head_box","mouseThrough":true},"child":[{"type":"Image","props":{"skin":"hall/back.png","name":"btn_back"}},{"type":"Image","props":{"x":660,"skin":"hall/menu.png","name":"btn_menu"}},{"type":"Image","props":{"y":0,"x":567,"skin":"hall/home_icon.png","name":"btn_home"}},{"type":"Box","props":{"y":104,"x":459,"var":"you_box"},"child":[{"type":"Box","props":{"y":5,"x":0,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"y":7,"x":20,"skin":"hall/tiao_bg.png"}},{"type":"Image","props":{"skin":"hall/diamond.png"}},{"type":"Label","props":{"y":13,"x":57,"width":30,"text":"游","height":24,"fontSize":24,"font":"SimHei","color":"#ecf4bb"}}]},{"type":"Image","props":{"x":190,"skin":"hall/shou.png","name":"btn_shou"}},{"type":"Label","props":{"y":20,"x":86,"width":104,"text":"0","name":"you_num","height":24,"fontSize":20,"font":"Arial","color":"#ecf4bb","align":"right"}}]},{"type":"Box","props":{"y":104,"x":27,"var":"yu_box"},"child":[{"type":"Box","props":{"y":3,"x":-7.105427357601002e-15,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"y":9,"x":20.000000000000007,"skin":"hall/tiao_bg.png"}},{"type":"Image","props":{"x":-6.999999999999993,"skin":"hall/coin.png"}},{"type":"Label","props":{"y":15,"x":50,"width":28,"text":"余","height":24,"fontSize":24,"font":"SimHei","color":"#ecf4bb"}}]},{"type":"Image","props":{"x":183,"skin":"hall/chong.png","name":"btn_chong"}},{"type":"Label","props":{"y":20,"x":74,"width":110,"text":"0","name":"yu_num","height":24,"fontSize":20,"font":"Arial","color":"#ecf4bb","align":"right"}}]},{"type":"Image","props":{"y":190,"x":622,"skin":"hall/record.png","name":"btn_record"}},{"type":"SkeletonPlayer","props":{"y":360,"x":374,"url":"animate/fudai.sk","name":"fudai_DB"}}]},{"type":"Box","props":{"y":5,"x":115,"width":445,"var":"marquee_box","height":44},"child":[{"type":"Box","props":{"name":"text_box"},"child":[{"type":"Label","props":{"y":3,"x":0,"valign":"middle","name":"text_content","fontSize":23,"font":"Microsoft YaHei","color":"#fefefe"}}]}]},{"type":"Box","props":{"y":92,"x":403,"var":"menu_box"}}]};}
		]);
		return headerUI;
	})(View);
var menuUI=(function(_super){
		function menuUI(){
			
		    this.btn_help=null;
		    this.btn_sound=null;

			menuUI.__super.call(this);
		}

		CLASS$(menuUI,'ui.hall.menuUI',_super);
		var __proto__=menuUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(menuUI.uiView);
		}

		STATICATTR$(menuUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":337,"height":238},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"hall/menu_add.png"}},{"type":"Image","props":{"y":44,"x":30,"skin":"hall/music.png"}},{"type":"Label","props":{"y":52,"x":116,"width":74,"text":"音 效","height":48,"fontSize":32,"font":"Microsoft YaHei","color":"#ede6ff"}},{"type":"Box","props":{"y":148,"x":30,"var":"btn_help","cacheAs":"bitmap"},"child":[{"type":"Image","props":{"skin":"hall/help.png"}},{"type":"Label","props":{"y":11,"x":86,"width":74,"text":"帮 助","height":48,"fontSize":32,"font":"Microsoft YaHei","color":"#ede6ff"}},{"type":"Image","props":{"y":21,"x":234,"skin":"hall/da.png"}}]},{"type":"Clip","props":{"y":49,"x":199,"var":"btn_sound","skin":"hall/clip_onoff.png","index":0,"clipY":2}}]};}
		]);
		return menuUI;
	})(View);
var fruitLoadingUI=(function(_super){
		function fruitLoadingUI(){
			
		    this.fruit_box=null;
		    this.txt=null;

			fruitLoadingUI.__super.call(this);
		}

		CLASS$(fruitLoadingUI,'ui.load.fruitLoadingUI',_super);
		var __proto__=fruitLoadingUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(fruitLoadingUI.uiView);
		}

		STATICATTR$(fruitLoadingUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":750,"mouseEnabled":true,"height":1334},"child":[{"type":"Label","props":{"width":1334,"mouseEnabled":false,"height":1334,"fontSize":28,"font":"Microsoft YaHei","color":"#ffffff","centerX":0,"bgColor":"#000000","alpha":0.7}},{"type":"Box","props":{"y":700,"x":225,"width":300,"var":"fruit_box","height":110},"child":[{"type":"Image","props":{"y":37,"x":50,"skin":"load/1.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":36,"x":147,"skin":"load/2.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":38,"x":246,"skin":"load/3.png","anchorY":0.5,"anchorX":0.5}}]},{"type":"Label","props":{"y":818,"x":274,"width":201,"var":"txt","text":"请稍等...","height":28,"fontSize":28,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}}]};}
		]);
		return fruitLoadingUI;
	})(View);
var loadingUI=(function(_super){
		function loadingUI(){
			
		    this.load_box=null;
		    this.fruit_box=null;

			loadingUI.__super.call(this);
		}

		CLASS$(loadingUI,'ui.load.loadingUI',_super);
		var __proto__=loadingUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(loadingUI.uiView);
		}

		STATICATTR$(loadingUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":750,"height":1334},"child":[{"type":"Image","props":{"y":0,"width":1334,"skin":"load/loading_bg.jpg","height":1334,"centerX":0}},{"type":"Box","props":{"y":0,"width":750,"height":1334},"child":[{"type":"Box","props":{"y":0,"width":619,"height":615,"centerX":0,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"y":213,"skin":"load/logo.png","centerX":0}},{"type":"Image","props":{"y":266,"x":473,"skin":"load/neice.png"}}]},{"type":"Box","props":{"y":922,"var":"load_box","centerX":0},"child":[{"type":"Image","props":{"y":1,"x":4,"skin":"load/strip_bg.png"}},{"type":"Label","props":{"y":84,"x":196,"text":"正在加载中...","name":"txt","fontSize":28,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Image","props":{"y":0,"x":3,"skin":"load/strip.png","name":"load_content"}},{"type":"Box","props":{"y":-75,"x":108,"var":"fruit_box"},"child":[{"type":"Image","props":{"y":37,"x":50,"skin":"load/1.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":36,"x":147,"skin":"load/2.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":38,"x":246,"skin":"load/3.png","anchorY":0.5,"anchorX":0.5}}]}]}]},{"type":"Image","props":{"y":1131,"x":0,"skin":"load/fangcenmi.png"}}]};}
		]);
		return loadingUI;
	})(View);
var advertisePopUI=(function(_super){
		function advertisePopUI(){
			
		    this.img=null;

			advertisePopUI.__super.call(this);
		}

		CLASS$(advertisePopUI,'ui.pop.advertisePopUI',_super);
		var __proto__=advertisePopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(advertisePopUI.uiView);
		}

		STATICATTR$(advertisePopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":750,"height":1334},"child":[{"type":"Image","props":{"var":"img","skin":"room/look.png","centerY":0,"centerX":0}}]};}
		]);
		return advertisePopUI;
	})(Dialog);
var commonPopUI=(function(_super){
		function commonPopUI(){
			
		    this.btn_close=null;
		    this.btn_box=null;
		    this.txt_box=null;

			commonPopUI.__super.call(this);
		}

		CLASS$(commonPopUI,'ui.pop.commonPopUI',_super);
		var __proto__=commonPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(commonPopUI.uiView);
		}

		STATICATTR$(commonPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":610,"height":440},"child":[{"type":"Image","props":{"y":0,"x":0,"width":609,"skin":"pop/bg.png","name":"pop_bg","height":437,"sizeGrid":"43,228,30,227"}},{"type":"Button","props":{"y":-15,"x":549,"var":"btn_close","stateNum":1,"skin":"pop/btn_close.png"}},{"type":"Box","props":{"y":324,"x":190,"var":"btn_box","bottom":40},"child":[{"type":"Box","props":{"y":0,"x":0,"name":"btn_sure","cacheAs":"bitmap"},"child":[{"type":"Image","props":{"skin":"pop/knowbg.png"}},{"type":"Image","props":{"y":34,"x":113,"skin":"pop/txtknow.png","pivotY":19.130434782608745,"pivotX":53.913043478260846,"name":"btn_txt"}}]}]},{"type":"Box","props":{"y":60,"x":36,"var":"txt_box"},"child":[{"type":"Image","props":{"width":538,"skin":"pop/txtbg.png","name":"txt_bg","height":222,"sizeGrid":"13,17,17,15"}},{"type":"Label","props":{"y":50,"x":38,"wordWrap":true,"width":462,"text":"的地方地方","name":"txt_content","leading":10,"fontSize":24,"font":"Microsoft YaHei","color":"#d3cbf7","align":"center"}}]}]};}
		]);
		return commonPopUI;
	})(Dialog);
var gainPopUI=(function(_super){
		function gainPopUI(){
			
		    this.txt_box=null;

			gainPopUI.__super.call(this);
		}

		CLASS$(gainPopUI,'ui.pop.gainPopUI',_super);
		var __proto__=gainPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(gainPopUI.uiView);
		}

		STATICATTR$(gainPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":610,"height":440},"child":[{"type":"Image","props":{"y":0,"x":0,"width":609,"skin":"pop/bg.png","name":"pop_bg","height":288,"sizeGrid":"43,228,30,227"}},{"type":"Button","props":{"y":-15,"x":549,"stateNum":1,"skin":"pop/btn_close.png","name":"close"}},{"type":"Box","props":{"y":60,"x":36,"var":"txt_box"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":538,"skin":"pop/txtbg.png","name":"txt_bg","height":173,"sizeGrid":"13,17,17,15"}},{"type":"Label","props":{"y":50,"x":106,"wordWrap":true,"width":213,"text":"在盈利榜中瓜分了","leading":10,"height":34,"fontSize":24,"font":"Microsoft YaHei","color":"#d3cbf7","align":"center"}},{"type":"Label","props":{"y":83,"x":152,"wordWrap":true,"width":234,"visible":true,"text":"点击盈利榜查看吧！","leading":10,"height":34,"fontSize":24,"font":"Microsoft YaHei","color":"#d3cbf7","align":"center"}},{"type":"Label","props":{"y":50,"x":316,"wordWrap":true,"width":213,"text":"1000","name":"txt_content","leading":10,"height":34,"fontSize":24,"font":"Microsoft YaHei","color":"#edf446","align":"left"}}]},{"type":"Image","props":{"y":-262,"x":54,"skin":"pop/gongxi.png"}}]};}
		]);
		return gainPopUI;
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
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":750,"height":1150},"child":[{"type":"Image","props":{"y":0,"x":50,"width":650,"skin":"pop/bg.png","height":1150,"sizeGrid":"43,228,30,227"}},{"type":"Button","props":{"y":-16,"x":646,"stateNum":"1","skin":"pop/btn_close.png","name":"close"}},{"type":"Box","props":{"y":-38,"x":151,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"skin":"pop/ylb/title_bg.png"}},{"type":"Image","props":{"y":24,"x":122,"skin":"pop/help/yxgz.png"}}]},{"type":"Box","props":{"y":1087,"x":225,"name":"close_box"},"child":[{"type":"Image","props":{"skin":"pop/help/bgbtn.png"}},{"type":"Image","props":{"y":31,"x":28,"skin":"pop/help/txt.png"}}]},{"type":"Box","props":{"y":83,"x":77,"var":"help_glr"},"child":[{"type":"Tab","props":{"y":946,"x":261,"space":30,"skin":"pop/help/btn_help.png","selectedIndex":0,"name":"pagination","direction":"horizontal"},"child":[{"type":"Button","props":{"stateNum":"2","skin":"pop/help/btn_help.png","name":"item0"}},{"type":"Button","props":{"y":10,"x":10,"stateNum":"2","skin":"pop/help/btn_help.png","name":"item1"}}]},{"type":"Box","props":{"y":0,"x":12,"name":"con"},"child":[{"type":"ViewStack","props":{"y":0,"selectedIndex":0,"name":"list"},"child":[{"type":"Box","props":{"width":595,"name":"item0","height":921},"child":[{"type":"Image","props":{"skin":"pop/help/first.png"}}]},{"type":"Box","props":{"y":0,"x":0,"width":595,"name":"item1","height":921},"child":[{"type":"Image","props":{"skin":"pop/help/second.png"}}]}]}]}]}]};}
		]);
		return helpPopUI;
	})(Dialog);
var historyPopUI=(function(_super){
		function historyPopUI(){
			
		    this.ylb_content_box=null;
		    this.ylb_content_list=null;

			historyPopUI.__super.call(this);
		}

		CLASS$(historyPopUI,'ui.pop.historyPopUI',_super);
		var __proto__=historyPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(historyPopUI.uiView);
		}

		STATICATTR$(historyPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":660,"height":580},"child":[{"type":"Image","props":{"y":0,"x":0,"width":660,"skin":"pop/bg.png","height":575,"sizeGrid":"43,228,30,227"}},{"type":"Button","props":{"y":-14,"x":594,"stateNum":"1","skin":"pop/btn_close.png","name":"close"}},{"type":"Box","props":{"y":60,"x":37,"width":575,"var":"ylb_content_box","height":433},"child":[{"type":"Box","props":{"y":0,"x":0,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":572,"skin":"pop/txtbg.png","height":460,"sizeGrid":"13,17,17,15"}},{"type":"Image","props":{"y":10,"x":8,"width":556,"skin":"pop/ylb/content_bg.png","height":438,"sizeGrid":"64,20,14,15"}},{"type":"Label","props":{"y":27,"x":20,"width":534,"text":"         时间                  玩家名称           分奖金额","height":38,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff","cacheAs":"bitmap"}}]},{"type":"List","props":{"y":80,"x":16,"width":542,"var":"ylb_content_list","vScrollBarSkin":"pop/help/vscroll.png","spaceY":5,"height":364},"child":[{"type":"Box","props":{"name":"render"},"child":[{"type":"Clip","props":{"skin":"pop/ylb/clip_tiao.png","name":"bg","index":0,"clipY":2}},{"type":"Label","props":{"y":15,"x":0,"width":228,"visible":true,"name":"time","height":22,"fontSize":22,"font":"Microsoft YaHei","color":"#5a3586","align":"center"}},{"type":"Label","props":{"y":15,"x":233,"width":163,"name":"name","height":27,"fontSize":22,"font":"Microsoft YaHei","color":"#5a3586","align":"center"}},{"type":"Label","props":{"y":15,"x":392,"width":132,"name":"coin","height":27,"fontSize":22,"font":"Microsoft YaHei","color":"#ffed22 ","align":"center"}}]}]}]},{"type":"Label","props":{"y":530,"x":58,"width":534,"visible":false,"text":"说明说明","name":"instruction","height":38,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","cacheAs":"bitmap","align":"center"}}]};}
		]);
		return historyPopUI;
	})(Dialog);
var keybordUI=(function(_super){
		function keybordUI(){
			
		    this.btn_box=null;

			keybordUI.__super.call(this);
		}

		CLASS$(keybordUI,'ui.pop.keybordUI',_super);
		var __proto__=keybordUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(keybordUI.uiView);
		}

		STATICATTR$(keybordUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":750,"height":350},"child":[{"type":"Box","props":{"y":12,"x":10,"cacheAs":"bitmap"},"child":[{"type":"Label","props":{"y":-12,"x":-10,"width":750,"height":350,"color":"#000","bgColor":"#000000","alpha":0.5}},{"type":"Image","props":{"width":138,"skin":"pop/numBtn.png","height":97}},{"type":"Image","props":{"x":150,"skin":"pop/numBtn.png"}},{"type":"Image","props":{"x":300,"skin":"pop/numBtn.png"}},{"type":"Image","props":{"x":449,"skin":"pop/numBtn.png"}},{"type":"Image","props":{"y":115,"skin":"pop/numBtn.png"}},{"type":"Image","props":{"y":115,"x":150,"skin":"pop/numBtn.png"}},{"type":"Image","props":{"y":115,"x":299,"skin":"pop/numBtn.png"}},{"type":"Image","props":{"y":115,"x":449,"skin":"pop/numBtn.png"}},{"type":"Image","props":{"y":229,"x":449,"skin":"pop/numBtn.png"}},{"type":"Image","props":{"y":229,"skin":"pop/numBtn.png"}},{"type":"Image","props":{"y":229,"x":150,"skin":"pop/numBtn.png"}},{"type":"Image","props":{"y":229,"x":299,"skin":"pop/numBtn.png"}}]},{"type":"Box","props":{"y":11,"x":10,"var":"btn_box"},"child":[{"type":"Label","props":{"y":2,"x":1,"width":138,"valign":"middle","text":1,"name":"num1","mouseEnabled":true,"height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"x":149,"width":138,"valign":"middle","text":2,"name":"num2","mouseEnabled":true,"height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":2,"x":301,"width":138,"valign":"middle","text":3,"name":"num3","mouseEnabled":true,"height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":2,"x":448,"width":138,"valign":"middle","text":"0","name":"num0","mouseEnabled":true,"height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":116,"width":138,"valign":"middle","text":4,"name":"num4","mouseEnabled":true,"height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":117,"x":150,"width":138,"valign":"middle","text":5,"name":"num5","mouseEnabled":true,"height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":115,"x":300,"width":138,"valign":"middle","text":6,"name":"num6","mouseEnabled":true,"height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":116,"x":448,"width":138,"valign":"middle","text":"00","name":"num00","mouseEnabled":true,"height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":230,"width":138,"valign":"middle","text":7,"name":"num7","mouseEnabled":true,"height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":231,"x":149,"width":138,"valign":"middle","text":8,"name":"num8","mouseEnabled":true,"height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":229,"x":300,"width":138,"valign":"middle","text":9,"name":"num9","mouseEnabled":true,"height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Label","props":{"y":231,"x":449,"width":138,"valign":"middle","text":".","name":"point","height":97,"fontSize":40,"color":"#000","align":"center"}},{"type":"Button","props":{"y":231,"x":597,"stateNum":1,"skin":"pop/rBtn.png","name":"del","mouseEnabled":true,"labelSize":40,"label":"删除"}},{"type":"Button","props":{"y":2,"x":597,"stateNum":1,"skin":"pop/sBtn.png","name":"sureBtn","mouseEnabled":true,"labelSize":40,"label":"确定"}}]}]};}
		]);
		return keybordUI;
	})(View);
var mygradePopUI=(function(_super){
		function mygradePopUI(){
			
		    this.ylb_content_box=null;
		    this.ylb_content_list=null;
		    this.unLogin_box=null;

			mygradePopUI.__super.call(this);
		}

		CLASS$(mygradePopUI,'ui.pop.mygradePopUI',_super);
		var __proto__=mygradePopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(mygradePopUI.uiView);
		}

		STATICATTR$(mygradePopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":660,"height":580},"child":[{"type":"Image","props":{"y":0,"x":0,"width":660,"skin":"pop/bg.png","height":577,"sizeGrid":"43,228,30,227"}},{"type":"Button","props":{"y":-14,"x":594,"stateNum":1,"skin":"pop/btn_close.png","name":"close"}},{"type":"Box","props":{"y":90,"x":37,"width":575,"var":"ylb_content_box","height":473},"child":[{"type":"Box","props":{"y":0,"x":0,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":572,"skin":"pop/txtbg.png","height":460,"sizeGrid":"13,17,17,15"}},{"type":"Image","props":{"y":10,"x":8,"width":556,"skin":"pop/ylb/content_bg.png","height":438,"sizeGrid":"64,20,14,15"}},{"type":"Label","props":{"y":22,"x":20,"width":534,"text":"    序号             赢得奖励                  时间","height":38,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff","cacheAs":"bitmap"}}]},{"type":"List","props":{"y":80,"x":16,"width":542,"visible":false,"var":"ylb_content_list","vScrollBarSkin":"pop/help/vscroll.png","spaceY":5,"height":364},"child":[{"type":"Box","props":{"name":"render"},"child":[{"type":"Image","props":{"skin":"pop/ylb/myGrade_bg.png","name":"bg"}},{"type":"Label","props":{"y":15,"x":0,"width":98,"visible":true,"name":"num","height":22,"fontSize":22,"font":"Microsoft YaHei","color":"#5a3586","align":"center"}},{"type":"Label","props":{"y":15,"x":102,"width":180,"name":"point","height":27,"fontSize":22,"font":"Microsoft YaHei","color":"#ffed22 ","align":"center"}},{"type":"Label","props":{"y":15,"x":285,"width":236,"name":"time","height":27,"fontSize":22,"font":"Microsoft YaHei","color":"#5a3586","align":"center"}}]}]},{"type":"Box","props":{"y":200,"x":94,"width":354,"visible":false,"var":"unLogin_box","height":41},"child":[{"type":"Label","props":{"y":3,"x":35,"width":238,"text":"您还未登录，请点击","height":38,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff","cacheAs":"bitmap"}},{"type":"Label","props":{"y":3,"x":260,"width":61,"underline":true,"text":"登录","name":"btn_login","height":38,"fontSize":24,"font":"Microsoft YaHei","color":"#ee390c","cacheAs":"bitmap","align":"center"}}]}]},{"type":"Box","props":{"y":-38,"x":106,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"skin":"pop/ylb/title_bg.png"}},{"type":"Image","props":{"y":21,"x":121,"skin":"pop/ylb/wdzj.png"}}]}]};}
		]);
		return mygradePopUI;
	})(Dialog);
var newUserPopUI=(function(_super){
		function newUserPopUI(){
			
		    this.dom_room_type=null;

			newUserPopUI.__super.call(this);
		}

		CLASS$(newUserPopUI,'ui.pop.newUserPopUI',_super);
		var __proto__=newUserPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(newUserPopUI.uiView);
		}

		STATICATTR$(newUserPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":750,"height":1334},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"pop/new.png"}},{"type":"Button","props":{"y":229,"x":623,"stateNum":"1","skin":"pop/btn_close.png","name":"close"}},{"type":"Box","props":{"y":366,"x":30},"child":[{"type":"Image","props":{"skin":"room/dia.png"}},{"type":"Label","props":{"y":12,"x":50,"width":81,"var":"dom_room_type","text":"*1","height":32,"fontSize":22,"font":"room_font","color":"#fff8bc","align":"center"}},{"type":"Image","props":{"y":4,"x":7,"skin":"hall/coin.png","scaleY":0.7,"scaleX":0.7}}]}]};}
		]);
		return newUserPopUI;
	})(Dialog);
var normalPopUI=(function(_super){
		function normalPopUI(){
			
		    this.txt_bg=null;
		    this.txt_content=null;

			normalPopUI.__super.call(this);
		}

		CLASS$(normalPopUI,'ui.pop.normalPopUI',_super);
		var __proto__=normalPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(normalPopUI.uiView);
		}

		STATICATTR$(normalPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":400,"height":120},"child":[{"type":"Image","props":{"y":0,"x":0,"width":400,"var":"txt_bg","skin":"pop/help/normal_bg.png","sizeGrid":"15,16,18,19","height":120}},{"type":"Label","props":{"y":30,"x":36,"wordWrap":true,"width":326,"var":"txt_content","valign":"middle","text":"hello, world","leading":10,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}}]};}
		]);
		return normalPopUI;
	})(Dialog);
var onlyReadPopUI=(function(_super){
		function onlyReadPopUI(){
			
		    this.btn_close=null;
		    this.txt_box=null;

			onlyReadPopUI.__super.call(this);
		}

		CLASS$(onlyReadPopUI,'ui.pop.onlyReadPopUI',_super);
		var __proto__=onlyReadPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(onlyReadPopUI.uiView);
		}

		STATICATTR$(onlyReadPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":610,"visible":true,"height":440},"child":[{"type":"Image","props":{"y":0,"x":0,"width":609,"skin":"pop/bg.png","name":"pop_bg","height":347,"sizeGrid":"43,228,30,227"}},{"type":"Button","props":{"y":-15,"x":549,"visible":false,"var":"btn_close","stateNum":1,"skin":"pop/btn_close.png"}},{"type":"Box","props":{"y":60,"x":36,"var":"txt_box"},"child":[{"type":"Image","props":{"width":538,"skin":"pop/txtbg.png","name":"txt_bg","height":222,"sizeGrid":"13,17,17,15"}},{"type":"Label","props":{"y":50,"x":38,"wordWrap":true,"width":462,"text":"的地方地方","name":"txt_content","leading":10,"fontSize":24,"font":"Microsoft YaHei","color":"#d3cbf7","align":"center"}}]}]};}
		]);
		return onlyReadPopUI;
	})(Dialog);
var playerInfoPopUI=(function(_super){
		function playerInfoPopUI(){
			
		    this.bg=null;
		    this.play_box=null;
		    this.player_list=null;
		    this.table_box=null;
		    this.table_list=null;

			playerInfoPopUI.__super.call(this);
		}

		CLASS$(playerInfoPopUI,'ui.pop.playerInfoPopUI',_super);
		var __proto__=playerInfoPopUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("ui.pop.userPopUI",ui.pop.userPopUI);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(playerInfoPopUI.uiView);
		}

		STATICATTR$(playerInfoPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":660,"height":700},"child":[{"type":"Image","props":{"y":0,"x":0,"width":660,"var":"bg","skin":"pop/bg.png","height":717,"sizeGrid":"43,228,30,227"}},{"type":"Button","props":{"y":-14,"x":594,"stateNum":1,"skin":"pop/btn_close.png","name":"close"}},{"type":"Box","props":{"y":-38,"x":106,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"skin":"pop/ylb/title_bg.png"}},{"type":"Image","props":{"y":21,"x":121,"skin":"pop/ylb/wjxi.png"}}]},{"type":"Box","props":{"y":94,"x":46,"width":568,"var":"play_box"},"child":[{"type":"List","props":{"y":0,"x":0,"width":566,"var":"player_list","spaceY":10,"spaceX":25,"height":377},"child":[{"type":"userPop","props":{"name":"render","runtime":"ui.pop.userPopUI"}}]}]},{"type":"Box","props":{"y":482,"x":45,"var":"table_box"},"child":[{"type":"Image","props":{"skin":"pop/ylb/play_top.png"}},{"type":"List","props":{"y":52,"x":0,"width":569,"var":"table_list","height":300},"child":[{"type":"Box","props":{"name":"render"},"child":[{"type":"Image","props":{"skin":"pop/ylb/play_bottom.png","name":"bg"}},{"type":"Label","props":{"y":13,"x":4,"width":126,"name":"time","height":22,"fontSize":22,"font":"SimHei","color":"#ffec1a","align":"center"}},{"type":"Label","props":{"y":13,"x":131,"width":170,"name":"name","height":22,"fontSize":22,"font":"SimHei","color":"#ffec1a","align":"center"}},{"type":"Label","props":{"y":13,"x":304,"width":139,"name":"type","height":22,"fontSize":22,"font":"SimHei","color":"#ffec1a","align":"center"}},{"type":"Label","props":{"y":13,"x":446,"width":116,"name":"award","height":22,"fontSize":22,"font":"SimHei","color":"#ffec1a","align":"center"}}]}]}]}]};}
		]);
		return playerInfoPopUI;
	})(Dialog);
var quit_rechargePopUI=(function(_super){
		function quit_rechargePopUI(){
			
		    this.btn_box=null;
		    this.quit=null;
		    this.less=null;
		    this.txt_box=null;

			quit_rechargePopUI.__super.call(this);
		}

		CLASS$(quit_rechargePopUI,'ui.pop.quit_rechargePopUI',_super);
		var __proto__=quit_rechargePopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(quit_rechargePopUI.uiView);
		}

		STATICATTR$(quit_rechargePopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":610,"height":440},"child":[{"type":"Image","props":{"y":0,"x":0,"width":609,"skin":"pop/bg.png","name":"pop_bg","height":437,"sizeGrid":"43,228,30,227"}},{"type":"Button","props":{"y":-15,"x":549,"visible":false,"stateNum":1,"skin":"pop/btn_close.png","name":"close"}},{"type":"Box","props":{"x":54,"var":"btn_box","bottom":40},"child":[{"type":"Box","props":{"y":0,"x":0,"var":"quit"},"child":[{"type":"Box","props":{"name":"btn_sure","cacheAs":"bitmap"},"child":[{"type":"Image","props":{"skin":"pop/surebg.png"}},{"type":"Image","props":{"y":15,"x":36,"skin":"pop/quik.png"}}]},{"type":"Box","props":{"x":291,"name":"close","cacheAs":"bitmap"},"child":[{"type":"Image","props":{"skin":"pop/quxbg.png"}},{"type":"Image","props":{"y":15,"x":36,"skin":"pop/txtno.png"}}]}]},{"type":"Box","props":{"y":0,"x":0,"var":"less"},"child":[{"type":"Box","props":{"visible":true,"name":"btn_sure","cacheAs":"bitmap"},"child":[{"type":"Image","props":{"skin":"pop/surebg.png"}},{"type":"Image","props":{"y":15,"x":49,"skin":"pop/chongzhi.png"}}]},{"type":"Box","props":{"x":291,"name":"close","cacheAs":"bitmap"},"child":[{"type":"Image","props":{"skin":"pop/quxbg.png"}},{"type":"Image","props":{"y":15,"x":68,"skin":"pop/ok.png"}}]}]}]},{"type":"Box","props":{"y":60,"x":36,"var":"txt_box"},"child":[{"type":"Image","props":{"width":538,"skin":"pop/txtbg.png","name":"txt_bg","height":222,"sizeGrid":"13,17,17,15"}},{"type":"Label","props":{"y":75,"x":38,"wordWrap":true,"width":462,"text":"现在离开房间将不能获得当前未结算的奖励，是否确认退出？","name":"txt_content","leading":10,"fontSize":24,"font":"Microsoft YaHei","color":"#d3cbf7","align":"center"}}]}]};}
		]);
		return quit_rechargePopUI;
	})(Dialog);
var rechargeUI=(function(_super){
		function rechargeUI(){
			
		    this.btn_click=null;
		    this.btn_close=null;
		    this.input_box=null;
		    this.keybord_box=null;

			rechargeUI.__super.call(this);
		}

		CLASS$(rechargeUI,'ui.pop.rechargeUI',_super);
		var __proto__=rechargeUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(rechargeUI.uiView);
		}

		STATICATTR$(rechargeUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":700,"height":970},"child":[{"type":"Image","props":{"y":108,"x":28,"width":650,"skin":"pop/bg.png","height":850,"sizeGrid":"43,228,30,227"}},{"type":"Box","props":{"y":0,"x":0,"width":700,"height":788},"child":[{"type":"Image","props":{"y":110,"x":59,"width":582,"skin":"pop/txtbg.png","height":678,"sizeGrid":"13,17,17,15"}},{"type":"Image","props":{"y":810,"x":60,"width":580,"skin":"pop/txtbg.png","height":116,"sizeGrid":"13,17,17,15"}},{"type":"Tab","props":{"y":220,"x":103,"width":503,"var":"btn_click","selectedIndex":2,"mouseEnabled":true,"height":535},"child":[{"type":"Button","props":{"stateNum":"2","skin":"pop/btn_tab.png","name":"item0"}},{"type":"Button","props":{"x":267,"stateNum":"2","skin":"pop/btn_tab.png","name":"item1"}},{"type":"Button","props":{"y":275,"stateNum":"2","skin":"pop/btn_tab.png","name":"item2"}},{"type":"Button","props":{"y":275,"x":267,"stateNum":"2","skin":"pop/btn_tab.png","name":"item3"}}]},{"type":"Box","props":{"y":219,"x":121,"cacheAs":"bitmap"},"child":[{"type":"Box","props":{"y":1,"x":-19,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"y":29,"x":31,"skin":"pop/zuan1.png"}},{"type":"Image","props":{"y":203,"x":84,"skin":"pop/10.png"}}]},{"type":"Box","props":{"y":1,"x":248,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"y":203,"x":84,"skin":"pop/50.png"}},{"type":"Image","props":{"y":-1,"x":20,"skin":"pop/zuan2.png"}}]},{"type":"Box","props":{"y":276,"x":-19,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"y":3,"x":19,"skin":"pop/zuan3.png"}},{"type":"Image","props":{"y":203,"x":75,"skin":"pop/100.png"}}]},{"type":"Box","props":{"y":276,"x":248,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"y":-2.999999999999943,"x":17.999999999999943,"skin":"pop/zuan4.png"}},{"type":"Image","props":{"y":203,"x":75,"skin":"pop/200.png"}}]}]}]},{"type":"Label","props":{"y":187,"x":147,"width":414,"text":"充值钻石成功后将为您自动兑换为欢乐豆","height":42,"fontSize":22,"font":"Microsoft YaHei","color":"#896fb5","cacheAs":"bitmap","bold":true,"align":"center"}},{"type":"Box","props":{"y":0,"x":0},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"pop/head.png"}},{"type":"Image","props":{"y":106.99999999999997,"x":127.00000000000001,"skin":"pop/txt_top.png"}},{"type":"Button","props":{"y":81.99999999999999,"x":609.9999999999999,"var":"btn_close","stateNum":"1","skin":"pop/btn_close.png"}}]},{"type":"Box","props":{"y":831,"x":82,"var":"input_box"},"child":[{"type":"Image","props":{"skin":"pop/txt_bg.png"}},{"type":"Button","props":{"x":365,"stateNum":"1","skin":"pop/btn_buy.png","name":"btn_buy"}},{"type":"Label","props":{"y":15,"x":20,"width":258,"text":"请输入大于0的整数","name":"input_txt","height":42,"fontSize":30,"font":"Microsoft YaHei","color":"#725b99","bold":false}}]},{"type":"Box","props":{"y":970,"var":"keybord_box"}}]};}
		]);
		return rechargeUI;
	})(Dialog);
var shouhuoPopUI=(function(_super){
		function shouhuoPopUI(){
			
		    this.bg=null;
		    this.dom_yxb=null;
		    this.dom_hlz=null;
		    this.dom_jf=null;
		    this.dom_hld=null;
		    this.dom_cj=null;
		    this.dom_zs=null;
		    this.dom_cf=null;
		    this.dom_jkj=null;
		    this.dom_liuliang=null;
		    this.btn_other=null;
		    this.btn_sure=null;

			shouhuoPopUI.__super.call(this);
		}

		CLASS$(shouhuoPopUI,'ui.pop.shouhuoPopUI',_super);
		var __proto__=shouhuoPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(shouhuoPopUI.uiView);
		}

		STATICATTR$(shouhuoPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":610,"height":700},"child":[{"type":"Image","props":{"y":0,"x":0,"width":610,"var":"bg","skin":"pop/bg.png","height":717,"sizeGrid":"43,228,30,227"}},{"type":"Button","props":{"y":-17,"x":549,"stateNum":1,"skin":"pop/btn_close.png","name":"close"}},{"type":"Box","props":{"y":-38,"x":86,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"skin":"pop/ylb/title_bg.png"}},{"type":"Image","props":{"y":21,"x":173,"skin":"pop/shouhuo.png"}}]},{"type":"Box","props":{"y":93,"x":55},"child":[{"type":"Image","props":{"y":0,"x":0,"width":500,"skin":"pop/txtbg.png","height":424,"sizeGrid":"13,17,17,15"}},{"type":"Image","props":{"y":9,"x":5,"skin":"pop/tiao.png"}},{"type":"Box","props":{"y":9,"x":83},"child":[{"type":"Label","props":{"y":1,"width":156,"valign":"middle","text":"我的游戏币：","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#ffda0e","align":"right"}},{"type":"Label","props":{"x":185,"width":156,"var":"dom_yxb","valign":"middle","text":"0","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#ffda0e","align":"left"}}]},{"type":"Box","props":{"y":60,"x":137},"child":[{"type":"Label","props":{"width":104,"valign":"middle","text":"欢乐值：","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"right"}},{"type":"Label","props":{"y":5.684341886080802e-14,"x":131.00000000000006,"width":156,"var":"dom_hlz","valign":"middle","text":"0","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"left"}}]},{"type":"Box","props":{"y":102,"x":137},"child":[{"type":"Label","props":{"width":104,"valign":"middle","text":"积分：","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"right"}},{"type":"Label","props":{"y":5.684341886080802e-14,"x":131.00000000000006,"width":156,"var":"dom_jf","valign":"middle","text":"0","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"left"}}]},{"type":"Box","props":{"y":144,"x":137},"child":[{"type":"Label","props":{"width":104,"valign":"middle","text":"欢乐豆：","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"right"}},{"type":"Label","props":{"y":8.526512829121202e-14,"x":131.00000000000006,"width":156,"var":"dom_hld","valign":"middle","text":"0","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"left"}}]},{"type":"Box","props":{"y":186,"x":137},"child":[{"type":"Label","props":{"width":104,"valign":"middle","text":"彩金：","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"right"}},{"type":"Label","props":{"y":0,"x":131.00000000000006,"width":156,"var":"dom_cj","valign":"middle","text":"0","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"left"}}]},{"type":"Box","props":{"y":228,"x":137},"child":[{"type":"Label","props":{"width":104,"valign":"middle","text":"钻石：","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"right"}},{"type":"Label","props":{"y":0,"x":131.00000000000006,"width":156,"var":"dom_zs","valign":"middle","text":"0","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"left"}}]},{"type":"Box","props":{"y":270,"x":137},"child":[{"type":"Label","props":{"width":104,"valign":"middle","text":"彩分：","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"right"}},{"type":"Label","props":{"y":5.684341886080802e-14,"x":131.00000000000006,"width":156,"var":"dom_cf","valign":"middle","text":"0","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"left"}}]},{"type":"Box","props":{"y":312,"x":137},"child":[{"type":"Label","props":{"width":104,"valign":"middle","text":"健康金：","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"right"}},{"type":"Label","props":{"y":1.1368683772161603e-13,"x":131.00000000000006,"width":156,"var":"dom_jkj","valign":"middle","text":"0","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"left"}}]},{"type":"Box","props":{"y":354,"x":138,"visible":false},"child":[{"type":"Label","props":{"y":0,"x":-45,"width":149,"valign":"middle","text":"平安流量：","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"right"}},{"type":"Label","props":{"y":1.1368683772161603e-13,"x":131.00000000000006,"width":156,"var":"dom_liuliang","valign":"middle","text":"0","height":50,"fontSize":26,"font":"Microsoft YaHei","color":"#d3cbf7","align":"left"}}]}]},{"type":"Image","props":{"y":657,"x":197,"var":"btn_other","skin":"pop/other.png"}},{"type":"Box","props":{"y":560,"x":190,"var":"btn_sure"},"child":[{"type":"Image","props":{"skin":"pop/knowbg.png"}},{"type":"Image","props":{"y":20,"x":42,"skin":"pop/confimshou.png"}}]}]};}
		]);
		return shouhuoPopUI;
	})(Dialog);
var userPopUI=(function(_super){
		function userPopUI(){
			

			userPopUI.__super.call(this);
		}

		CLASS$(userPopUI,'ui.pop.userPopUI',_super);
		var __proto__=userPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(userPopUI.uiView);
		}

		STATICATTR$(userPopUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":272,"height":117},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"pop/ylb/play_bg.png"}},{"type":"Label","props":{"y":17,"x":109,"name":"name","fontSize":22,"font":"Microsoft YaHei","color":"#a65921"}},{"type":"Label","props":{"y":59,"x":164,"width":81,"name":"coin","height":22,"fontSize":22,"font":"Microsoft YaHei","color":"#ffec1a"}},{"type":"Image","props":{"y":8,"x":8,"skin":"pop/ylb/head0.png","name":"head"}}]};}
		]);
		return userPopUI;
	})(View);
var yinglibangPopUI=(function(_super){
		function yinglibangPopUI(){
			
		    this.ylb_top_box=null;
		    this.ylb_bottom_box=null;
		    this.ylb_content_box=null;
		    this.ylb_content_list=null;
		    this.my_self_box=null;
		    this.unLogin_box=null;

			yinglibangPopUI.__super.call(this);
		}

		CLASS$(yinglibangPopUI,'ui.pop.yinglibangPopUI',_super);
		var __proto__=yinglibangPopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(yinglibangPopUI.uiView);
		}

		STATICATTR$(yinglibangPopUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":660,"height":960},"child":[{"type":"Image","props":{"y":0,"x":0,"width":660,"skin":"pop/bg.png","height":960,"sizeGrid":"43,228,30,227"}},{"type":"Box","props":{"y":-37,"x":106,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"skin":"pop/ylb/title_bg.png"}},{"type":"Image","props":{"y":21,"x":147,"skin":"pop/ylb/ylb.png"}}]},{"type":"Button","props":{"y":-14,"x":594,"stateNum":"1","skin":"pop/btn_close.png","name":"close"}},{"type":"Box","props":{"y":80,"x":37,"var":"ylb_top_box"},"child":[{"type":"Image","props":{"skin":"pop/ylb/ylb_middle.png"}},{"type":"Label","props":{"y":185,"x":182,"text":"分奖倒计时：","fontSize":22,"font":"Microsoft YaHei","color":"#ffffff","cacheAs":"bitmap"}},{"type":"Label","props":{"y":185,"x":321,"name":"time","fontSize":22,"font":"Microsoft YaHei","color":"#ffffff","cacheAs":"none"}},{"type":"Label","props":{"y":111,"x":306,"width":247,"text":"0","name":"coin_num","height":32,"fontSize":22,"font":"bang_font","color":"#ffffff","cacheAs":"none","align":"center"}}]},{"type":"Box","props":{"y":840,"x":92,"var":"ylb_bottom_box"},"child":[{"type":"Button","props":{"x":405,"stateNum":"1","skin":"pop/ylb/btn_history.png","name":"btn_history"}},{"type":"Image","props":{"y":28,"skin":"pop/ylb/txt_bottom.png"}},{"type":"Image","props":{"y":27,"x":336,"skin":"pop/ylb/wan.png","name":"text_wan"}},{"type":"Label","props":{"y":30,"x":293,"text":"500","name":"ylb_cond","font":"ylb_font"}}]},{"type":"Box","props":{"y":391,"x":37,"width":586,"var":"ylb_content_box","height":433},"child":[{"type":"Box","props":{"y":0,"x":0,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":586,"skin":"pop/txtbg.png","height":442,"sizeGrid":"13,17,17,15"}},{"type":"Image","props":{"y":17,"x":15,"width":556,"skin":"pop/ylb/content_bg.png","height":344,"sizeGrid":"64,20,14,15"}},{"type":"Label","props":{"y":27,"x":49,"width":505,"text":"排名     玩家名称     当日累计赢取      排名奖励","height":38,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff","cacheAs":"bitmap"}}]},{"type":"List","props":{"y":80,"x":23,"width":542,"var":"ylb_content_list","vScrollBarSkin":"pop/help/vscroll.png","spaceY":5,"height":272},"child":[{"type":"Box","props":{"name":"render"},"child":[{"type":"Clip","props":{"skin":"pop/ylb/clip_tiao.png","name":"bg","clipY":2}},{"type":"Label","props":{"y":17,"x":26,"width":30,"visible":true,"text":"1","name":"rank","height":22,"fontSize":22,"font":"Microsoft YaHei","color":"#5a3586","align":"center"}},{"type":"Clip","props":{"y":5,"x":9,"visible":true,"skin":"pop/ylb/clip_crown.png","name":"crown","clipY":3}},{"type":"Label","props":{"y":17,"x":70,"width":163,"name":"name","height":27,"fontSize":22,"font":"Microsoft YaHei","color":"#5a3586","align":"center"}},{"type":"Label","props":{"y":17,"x":232,"width":160,"text":"0","name":"coin","height":27,"fontSize":22,"font":"Microsoft YaHei","color":"#ffed22 ","align":"center"}},{"type":"Label","props":{"y":17,"x":392,"width":134,"name":"award","height":27,"fontSize":22,"font":"Microsoft YaHei","color":"#5a3586","align":"center"}}]}]},{"type":"Box","props":{"y":370,"x":23,"visible":false,"var":"my_self_box"},"child":[{"type":"Clip","props":{"skin":"pop/ylb/clip_tiao.png","name":"bg","index":1,"clipY":2}},{"type":"Label","props":{"y":17,"x":26,"width":30,"text":"1","name":"rank","height":22,"fontSize":22,"font":"Microsoft YaHei","color":"#5a3586","align":"center"}},{"type":"Clip","props":{"y":5,"x":9,"skin":"pop/ylb/clip_crown.png","name":"crown","clipY":3}},{"type":"Label","props":{"y":17,"x":70,"width":163,"name":"name","height":27,"fontSize":22,"font":"Microsoft YaHei","color":"#5a3586","align":"center"}},{"type":"Label","props":{"y":17,"x":232,"width":160,"text":"0","name":"coin","height":27,"fontSize":22,"font":"Microsoft YaHei","color":"#ffed22 ","align":"center"}},{"type":"Label","props":{"y":17,"x":392,"width":134,"name":"award","height":27,"fontSize":22,"font":"Microsoft YaHei","color":"#5a3586","align":"center"}}]},{"type":"Box","props":{"y":383,"x":132,"visible":false,"var":"unLogin_box"},"child":[{"type":"Label","props":{"y":3,"x":35,"width":238,"text":"您还未登录，请点击","height":38,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff","cacheAs":"bitmap"}},{"type":"Label","props":{"y":3,"x":260,"width":61,"underline":true,"text":"登录","name":"btn_login","height":38,"fontSize":24,"font":"Microsoft YaHei","color":"#ee390c","cacheAs":"bitmap","align":"center"}}]}]}]};}
		]);
		return yinglibangPopUI;
	})(Dialog);
var matterViewUI=(function(_super){
		function matterViewUI(){
			

			matterViewUI.__super.call(this);
		}

		CLASS$(matterViewUI,'ui.room.matterViewUI',_super);
		var __proto__=matterViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(matterViewUI.uiView);
		}

		STATICATTR$(matterViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":750,"height":1334}};}
		]);
		return matterViewUI;
	})(View);
var roomUI=(function(_super){
		function roomUI(){
			
		    this.laba_box=null;
		    this.laba_mask_box=null;
		    this.cover_box=null;
		    this.sameRound_box=null;
		    this.threeLine_box=null;
		    this.turntable_box=null;
		    this.star_box=null;
		    this.top_light_box=null;
		    this.nail_box=null;
		    this.spin_box=null;
		    this.skill_box=null;
		    this.car_box=null;
		    this.dom_car_boxMove=null;
		    this.dom_plus=null;
		    this.dom_text_box=null;
		    this.dom_text_move=null;
		    this.car_text0=null;
		    this.car_text1=null;
		    this.coin_box=null;
		    this.coin=null;
		    this.swing0=null;
		    this.swing1=null;
		    this.fan0=null;
		    this.fan1=null;
		    this.middle_box=null;
		    this.ylb_box=null;
		    this.btn_auto_box=null;
		    this.header_box=null;
		    this.btn_addCoin=null;
		    this.look_box=null;
		    this.dom_room_type=null;

			roomUI.__super.call(this);
		}

		CLASS$(roomUI,'ui.room.roomUI',_super);
		var __proto__=roomUI.prototype;
		__proto__.createChildren=function(){
		    			View.regComponent("SkeletonPlayer",laya.ani.bone.Skeleton);
			View.regComponent("ui.room.turntableUI",ui.room.turntableUI);

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(roomUI.uiView);
		}

		STATICATTR$(roomUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":750,"mouseThrough":true,"height":1334},"child":[{"type":"Image","props":{"y":0,"skin":"room/room_bg.jpg","centerX":0}},{"type":"Box","props":{"y":628,"x":53,"var":"laba_box"},"child":[{"type":"Image","props":{"skin":"room/laba_bg.png"}},{"type":"Box","props":{"y":49,"x":186,"width":270,"visible":true,"var":"laba_mask_box","height":250},"child":[{"type":"Box","props":{"x":2,"name":"item0","cacheAs":"none"}},{"type":"Box","props":{"y":0,"x":95,"name":"item1","cacheAs":"none"}},{"type":"Box","props":{"y":0,"x":189,"name":"item2","cacheAs":"none"}}]},{"type":"Box","props":{"y":49,"x":188,"visible":true,"cacheAs":"bitmap","alpha":0.4},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"room/fruit_mask.png"}},{"type":"Image","props":{"y":203,"x":-1,"width":264,"skin":"room/fruit_mask.png","rotation":180,"height":47,"anchorY":1,"anchorX":1}}]},{"type":"Box","props":{"y":48,"x":186,"visible":true,"var":"cover_box"},"child":[{"type":"Image","props":{"y":159.00001436206566,"skin":"room/shadow0.png","name":"cover_down","alpha":0.95}},{"type":"Image","props":{"y":0.000014362065641648769,"width":268,"skin":"room/shadow0.png","rotation":180,"name":"cover_up","height":91,"anchorY":1,"anchorX":1,"alpha":0.95}}]},{"type":"Box","props":{"y":115,"x":225,"visible":false,"var":"sameRound_box"},"child":[{"type":"SkeletonPlayer","props":{"url":"animate/kuang.sk","name":"item"}},{"type":"SkeletonPlayer","props":{"y":0,"x":96,"url":"animate/kuang.sk","name":"item"}},{"type":"SkeletonPlayer","props":{"y":0,"x":190,"url":"animate/kuang.sk","name":"item"}}]},{"type":"Box","props":{"y":75,"x":131.99999999999997,"visible":false,"var":"threeLine_box"},"child":[{"type":"Image","props":{"x":0,"skin":"room/2.png","name":"item0","cacheAs":"none"}},{"type":"Image","props":{"y":81,"x":0,"skin":"room/1.png","name":"item1"}},{"type":"Image","props":{"y":162,"x":0,"skin":"room/3.png","name":"item2"}}]},{"type":"Box","props":{"y":49,"x":173,"visible":false,"var":"turntable_box"},"child":[{"type":"turntable","props":{"runtime":"ui.room.turntableUI"}},{"type":"SkeletonPlayer","props":{"y":-7,"x":144,"url":"animate/truntable.sk","name":"table_DB"}}]}]},{"type":"Box","props":{"y":585,"x":102,"var":"star_box"},"child":[{"type":"Label","props":{"y":15,"x":40,"font":"star_font"}},{"type":"Label","props":{"y":15,"x":245,"font":"star_font"}},{"type":"Label","props":{"y":15,"x":465,"font":"star_font"}},{"type":"Box","props":{"y":0,"x":0,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"x":-10,"skin":"room/one_star.png"}},{"type":"Image","props":{"x":146,"skin":"room/two_star.png"}},{"type":"Image","props":{"x":352,"skin":"room/three_star.png"}}]},{"type":"Box","props":{"y":51.999999999999886,"x":230.00000000000006,"var":"top_light_box"},"child":[{"type":"Clip","props":{"skin":"room/clip_top.png","name":"item0","index":0,"clipY":2}},{"type":"Clip","props":{"x":20,"skin":"room/clip_top.png","name":"item1","clipY":2}},{"type":"Clip","props":{"x":40,"skin":"room/clip_top.png","name":"item2","clipY":2}},{"type":"Clip","props":{"x":60,"skin":"room/clip_top.png","name":"item3","clipY":2}}]},{"type":"SkeletonPlayer","props":{"y":83,"x":267,"url":"animate/star.sk","name":"star_DB"}}]},{"type":"Box","props":{"var":"nail_box","mouseThrough":false,"cacheAs":"bitmap"},"child":[{"type":"Image","props":{"y":652,"x":157,"skin":"room/nail.png"}},{"type":"Image","props":{"y":652,"x":231,"skin":"room/nail.png"}},{"type":"Image","props":{"y":652,"x":315,"skin":"room/nail.png"}},{"type":"Image","props":{"y":652,"x":412,"skin":"room/nail.png"}},{"type":"Image","props":{"y":652,"x":495,"skin":"room/nail.png"}},{"type":"Image","props":{"y":652,"x":573,"skin":"room/nail.png"}},{"type":"Image","props":{"y":794,"x":39,"skin":"room/nail.png"}},{"type":"Image","props":{"y":794,"x":686,"skin":"room/nail.png"}},{"type":"Image","props":{"y":936,"x":97,"skin":"room/nail.png"}},{"type":"Image","props":{"y":936,"x":182,"skin":"room/nail.png"}},{"type":"Image","props":{"y":936,"x":267,"skin":"room/nail.png"}},{"type":"Image","props":{"y":936,"x":352,"skin":"room/nail.png"}},{"type":"Image","props":{"y":936,"x":437,"skin":"room/nail.png"}},{"type":"Image","props":{"y":936,"x":522,"skin":"room/nail.png"}},{"type":"Image","props":{"y":936,"x":607,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1027,"x":41,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1027,"x":688,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1067,"x":53,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1067,"x":673,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1107,"x":65,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1107,"x":150,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1107,"x":235,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1107,"x":320,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1107,"x":405,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1107,"x":490,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1107,"x":575,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1107,"x":660,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1189,"x":107,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1189,"x":192,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1189,"x":277,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1189,"x":362,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1189,"x":447,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1189,"x":532,"skin":"room/nail.png"}},{"type":"Image","props":{"y":1189,"x":617,"skin":"room/nail.png"}}]},{"type":"Box","props":{"y":1007,"x":0,"var":"spin_box"},"child":[{"type":"Image","props":{"y":27,"x":92.99999999999991,"skin":"room/ganzi.png"}}]},{"type":"Box","props":{"y":1169,"x":10,"width":736,"visible":true,"var":"skill_box","height":83},"child":[{"type":"Image","props":{"y":31,"x":65,"skin":"room/jiangli.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":31,"x":150,"skin":"room/jiangli.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":31,"x":235,"skin":"room/stop.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":31,"x":320,"skin":"room/bei.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":31,"x":405,"skin":"room/add_3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":31,"x":490,"skin":"room/add_spin.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":31,"x":575,"skin":"room/jiangli.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":31,"x":660,"skin":"room/jiangli.png","anchorY":0.5,"anchorX":0.5}}]},{"type":"Box","props":{"y":1247,"x":375,"width":200,"visible":false,"var":"car_box","pivotY":0,"pivotX":100,"height":111},"child":[{"type":"Clip","props":{"y":8,"x":38,"width":77,"skin":"room/clip_car_left.png","pivotY":10,"pivotX":40,"name":"car_ear","interval":260,"height":53,"clipY":2,"autoPlay":false}},{"type":"Clip","props":{"y":8,"x":160,"width":77,"skin":"room/clip_car_right.png","pivotY":10,"pivotX":40,"name":"car_ear","interval":260,"height":53,"clipY":2,"autoPlay":false}},{"type":"Image","props":{"y":47,"x":97,"width":105,"skin":"room/car_body.png","pivotY":29.245283018867894,"pivotX":50.943396226415075,"name":"car_body","height":64}},{"type":"SkeletonPlayer","props":{"y":22,"x":101,"url":"animate/buff.sk","name":"car_DB"}},{"type":"Box","props":{"y":37,"x":72,"var":"dom_car_boxMove"},"child":[{"type":"Label","props":{"y":1,"var":"dom_plus","text":"+","font":"car_font","align":"center"}},{"type":"Box","props":{"y":0,"x":23,"width":104,"var":"dom_text_box","height":60},"child":[{"type":"Box","props":{"y":0,"x":0,"var":"dom_text_move"},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"car_text0","text":"0","height":28,"font":"car_font","align":"left"}},{"type":"Label","props":{"y":28,"x":0,"var":"car_text1","text":"0","font":"car_font","align":"left"}}]}]}]}]},{"type":"Box","props":{"y":338,"x":287,"cacheAs":"bitmap"},"child":[{"type":"Box","props":{"y":-338,"x":-287,"visible":false,"var":"coin_box","mouseThrough":false},"child":[{"type":"Image","props":{"y":443,"x":489,"width":46,"var":"coin","skin":"room/coin_10.png","pivotY":25.423728813559364,"pivotX":24.576271186440692,"height":46}},{"type":"Image","props":{"y":510,"x":287,"width":113,"var":"swing0","skin":"room/swing.png","height":20}},{"type":"Image","props":{"y":510,"x":412,"var":"swing1","skin":"room/swing.png"}},{"type":"Image","props":{"y":800,"x":167.0000000000001,"var":"fan0","skin":"room/fan.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":800,"x":583,"var":"fan1","skin":"room/fan.png","anchorY":0.5,"anchorX":0.5}}]},{"type":"Image","props":{"x":89,"visible":true,"skin":"room/cut.png","name":"flag"}}]},{"type":"Box","props":{"y":200,"x":0,"var":"middle_box","mouseThrough":false},"child":[{"type":"Box","props":{"y":24,"x":170,"var":"ylb_box"},"child":[{"type":"Image","props":{"skin":"room/ylb_bg.png"}},{"type":"Label","props":{"y":75,"x":50,"width":308,"valign":"middle","text":"0","name":"ylb_num","height":109,"font":"bang_font","align":"center"}},{"type":"Image","props":{"y":135.00000000000006,"x":390.0000000000001,"skin":"room/plank.png"}},{"type":"Box","props":{"y":106,"x":441,"var":"btn_auto_box"},"child":[{"type":"Clip","props":{"skin":"room/clip_auto.png","name":"auto","index":0,"clipY":4,"autoPlay":false}},{"type":"Clip","props":{"y":-16,"x":-11,"skin":"room/clip_light.png","name":"light","interval":500,"clipY":2,"autoPlay":false}}]}]},{"type":"SkeletonPlayer","props":{"y":470,"x":376,"url":"animate/bglight.sk","name":"ballLight_DB"}}]},{"type":"Box","props":{"var":"header_box","mouseThrough":true,"mouseEnabled":true}},{"type":"Box","props":{"y":494,"x":0,"width":750,"var":"btn_addCoin","height":840,"bottom":0}},{"type":"Box","props":{"y":200,"x":0,"var":"look_box","mouseThrough":true},"child":[{"type":"Image","props":{"y":0,"x":-20,"skin":"room/left_bg.png"}},{"type":"Image","props":{"y":38,"x":40,"skin":"room/look.png","name":"btn_look","mouseThrough":true}},{"type":"Label","props":{"y":8,"x":6.000000000000051,"text":"当前在桌人数：","fontSize":17,"font":"Microsoft YaHei","color":"#fffdcd"}},{"type":"Label","props":{"y":9,"x":127,"text":0,"name":"online_num","fontSize":16,"font":"Microsoft YaHei","color":"#fffdcd"}},{"type":"Box","props":{"y":164,"x":27},"child":[{"type":"Image","props":{"skin":"room/dia.png"}},{"type":"Label","props":{"y":12,"x":50,"width":81,"var":"dom_room_type","text":"*1","height":32,"fontSize":22,"font":"room_font","color":"#fff8bc","align":"center"}},{"type":"Image","props":{"y":4,"x":7,"skin":"hall/coin.png","scaleY":0.7,"scaleX":0.7}}]}]}]};}
		]);
		return roomUI;
	})(View);
var spinUI=(function(_super){
		function spinUI(){
			
		    this.up=null;
		    this.down=null;
		    this.dom_spin=null;

			spinUI.__super.call(this);
		}

		CLASS$(spinUI,'ui.room.spinUI',_super);
		var __proto__=spinUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(spinUI.uiView);
		}

		STATICATTR$(spinUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"x":0,"width":114,"height":72},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"room/spin.png"}},{"type":"Box","props":{"y":-2,"x":5,"var":"up"},"child":[{"type":"Clip","props":{"y":26,"skin":"room/clip_spin.png","name":"0","index":1,"clipY":2}},{"type":"Clip","props":{"y":17,"x":5,"skin":"room/clip_spin.png","name":"1","index":1,"clipY":2}},{"type":"Clip","props":{"y":10,"x":13,"skin":"room/clip_spin.png","name":"2","index":1,"clipY":2}},{"type":"Clip","props":{"y":5,"x":22,"skin":"room/clip_spin.png","name":"3","clipY":2}},{"type":"Clip","props":{"y":1,"x":32,"skin":"room/clip_spin.png","name":"4","clipY":2}},{"type":"Clip","props":{"x":43,"skin":"room/clip_spin.png","name":"5","clipY":2}},{"type":"Clip","props":{"x":54,"skin":"room/clip_spin.png","name":"6","clipY":2}},{"type":"Clip","props":{"y":2,"x":63,"skin":"room/clip_spin.png","name":"7","clipY":2}},{"type":"Clip","props":{"y":5,"x":72,"skin":"room/clip_spin.png","name":"8","clipY":2}},{"type":"Clip","props":{"y":10,"x":79,"skin":"room/clip_spin.png","name":"9","clipY":2}},{"type":"Clip","props":{"y":17,"x":86,"skin":"room/clip_spin.png","name":"10","clipY":2}},{"type":"Clip","props":{"y":26,"x":90,"skin":"room/clip_spin.png","name":"11","clipY":2}}]},{"type":"Box","props":{"y":35,"x":5,"var":"down"},"child":[{"type":"Clip","props":{"y":1,"skin":"room/clip_spin.png","name":"0","clipY":2}},{"type":"Clip","props":{"y":9,"x":5,"skin":"room/clip_spin.png","name":"1","clipY":2}},{"type":"Clip","props":{"y":16,"x":13,"skin":"room/clip_spin.png","name":"2","clipY":2}},{"type":"Clip","props":{"y":21,"x":22,"skin":"room/clip_spin.png","name":"3","clipY":2}},{"type":"Clip","props":{"y":24,"x":32,"skin":"room/clip_spin.png","name":"4","clipY":2}},{"type":"Clip","props":{"y":25,"x":43,"skin":"room/clip_spin.png","name":"5","clipY":2}},{"type":"Clip","props":{"y":25,"x":54,"skin":"room/clip_spin.png","name":"6","clipY":2}},{"type":"Clip","props":{"y":23,"x":63,"skin":"room/clip_spin.png","name":"7","clipY":2}},{"type":"Clip","props":{"y":19,"x":72,"skin":"room/clip_spin.png","name":"8","clipY":2}},{"type":"Clip","props":{"y":14,"x":79,"skin":"room/clip_spin.png","name":"9","index":1,"clipY":2}},{"type":"Clip","props":{"y":8,"x":86,"skin":"room/clip_spin.png","name":"10","index":1,"clipY":2}},{"type":"Clip","props":{"x":90,"skin":"room/clip_spin.png","name":"11","index":1,"clipY":2}}]},{"type":"Clip","props":{"y":11,"x":17,"var":"dom_spin","skin":"room/clip_spin2.png","interval":260,"clipY":2,"autoPlay":false}}]};}
		]);
		return spinUI;
	})(View);
var turntableUI=(function(_super){
		function turntableUI(){
			

			turntableUI.__super.call(this);
		}

		CLASS$(turntableUI,'ui.room.turntableUI',_super);
		var __proto__=turntableUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(turntableUI.uiView);
		}

		STATICATTR$(turntableUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":294,"height":250},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"room/turn_bg.png"}},{"type":"Image","props":{"y":125,"x":147,"skin":"room/turntable.png","name":"turntable","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":18,"x":27,"skin":"room/arrows.png"}}]};}
		]);
		return turntableUI;
	})(View);