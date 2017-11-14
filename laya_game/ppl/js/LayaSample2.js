;(function(){
	
	Game.room = {
		init: function(){
			//中介者
			broker.MainRoomGame = new MainRoomGame();
		}
	}

	function MainRoomGame(){
		
		//主界面
		this.roomUIEx1 = new ui.room.roomUIEx();
		Game.RoomUI = this.roomUIEx1;

		// 结果弹层
		this.resultPopUIEx1 = new ui.room.resultPopUIEx();

		//更多弹层
		this.moreUIEx1 = new ui.room.moreUIEx();

		//聊天弹框
		this.talkUIEx1 = new ui.room.talkUIEx();
		// 表情弹框
		this.faceUIEx1 = new ui.room.faceUIEx();

		// 头像弹层
		this.headPopUIEx1 = new ui.room.headPopUIEx();

		// 更多弹层放到房间页（层级保证）
		this.roomUIEx1.addChildren(this.moreUIEx1, this.talkUIEx1, this.faceUIEx1);

		//房间warp添加进去
		Game.RoomWrap.addChildren(this.roomUIEx1);
		// 设置一下居中
		Game.setViewCenter();

		//主界面初始化(有一些获取位置的值得首先元素添加到舞台才能获取, 页面加载比较慢会造成画面跳闪)
		this.roomUIEx1.init();

		this.layaStageClick();
	}

	var _proto_ = MainRoomGame.prototype;

	// 添加点击其他区域消失弹框
	_proto_.layaStageClick = function(){

		Laya.stage.on(Laya.Event.CLICK, this, function(event){
			var _target = event.target;

			if(broker.talkUIEx.isShow() && (_target != broker.talkUIEx && !broker.talkUIEx.contains(_target))){
				broker.talkUIEx.reset();
			}

			if(broker.faceUIEx.isShow() && (_target != broker.faceUIEx && !broker.faceUIEx.contains(_target))){
				broker.faceUIEx.reset();
			}

			if(broker.moreUIEx.isShow && (_target != broker.moreUIEx && !broker.moreUIEx.contains(_target) && _target != broker.roomUIEx.more_icon)){

				broker.moreUIEx.show();
			}
			
		});

	}

	//  聊天和表情弹框强制关闭
	_proto_.closeTalkFace = function(){

		this.talkUIEx1.reset();
		this.faceUIEx1.reset();

		this.moreUIEx1.reset();

		
	}

	// 关闭用户打开的弹层
	_proto_.closeMorePop = function(){

		// 结束出牌
		broker.roomUIEx.endNotice();

		// 去除托管弹层
		broker.tuoguanUIEx.hide();

		// 头像弹层
		this.headPopUIEx1.close();

		// 帮助弹层
		Game.hall.popup.helppop.close();

		// 充值弹层
		Game.hall.popup.recharge.close();

		// 聊天和表情弹框强制关闭
		this.closeTalkFace();
		

	}







})()
