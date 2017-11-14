;(function(global){

	//开辟全局Game空间
	global.Game = {
		
		hasLoadedRes: false,		//是否已经加载过资源
		gameWrapInit : false,		//是否已经初始化game

		LoadWrap : null,
		HallWrap : null,
		RoomWrap : null,
		yuPopUIEx1: null,		//余额view

		HallUI: null,
		RoomUI: null,
		//给舞台添加模块
		initGame: function(){
			//直接将load界面给loadWrap(即直接出现)
			Game.LoadWrap = new ui.load.loadUI();
			Game.HallWrap = new Laya.Sprite();
			Game.RoomWrap = new Laya.Sprite();

			Game.LoadWrap.visible = false;
			Game.HallWrap.visible = false;
			Game.RoomWrap.visible = false;

			Laya.stage.addChildren(Game.LoadWrap, Game.HallWrap, Game.RoomWrap);

		},
		//页面切换
		pageSwitch : function(module){
			var self = this;
			self.HallWrap.visible = false;
			self.RoomWrap.visible = false;

			switch (module) {
				case "load":
					self.LoadWrap.visible = true;
					break;
				case "hall":
					audio.play('hall_bgm');
					self.HallWrap.visible = true;
					break;
				case "room":
					audio.play('room_bgm');
					self.RoomWrap.visible = true;
					break;
				default:
				break;
			}

			self.setViewCenter();
		},
		setViewCenter: function(){
			var _width = Laya.stage.width;
			var _left = _width > 750 ? (_width - 750)/2 : 0;
			Game.LoadWrap.left = _left;

			if(Game.HallUI){
				Game.HallUI.left = _left;
			}
			if(Game.RoomUI){
				Game.RoomUI.left = _left;
			}

		},
		init : function(){
			if(this.gameWrapInit){
				return;
			}
			this.gameWrapInit = true;

			this.initGame();

			// resize
			Laya.stage.on('resize', this, this.setViewCenter);

			// 主动触发
			Laya.stage.event('resize');
		}

	}
})(window);