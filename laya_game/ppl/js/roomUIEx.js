(function(_super, broker){
	//中介者
	var broker = broker;

	function roomUIEx(){
		roomUIEx.super(this);

		//对外接口
		broker.roomUIEx = this;

		// 是否处于房间状态
		this.isRoomState = false;

		// 防止用户反复点击对方玩家
		this.oppIsClicked = false;

	}
	Laya.class(roomUIEx, 'ui.room.roomUIEx', _super);

	var _proto_ = roomUIEx.prototype;

	//初始化
	_proto_.init = function(){

		// 初始化各区域牌
		this.initPaiList();

		//初始化用户
		this.initUserList();
		
		//初始化对比实例 & 托管弹层
		this.initResultGame();

		//初始化事件
		this.initEvent();

		// 初始化发送道具的类
		this.initDaoJuAni();

	}
	// 初始化各区域牌以及房间类型
	_proto_.initPaiList = function(){

		//对方区域
		this.opposite_EX = new BaseArea(this.opposite_area);
		
		//公共区域
		this.public_EX = new PublicArea(this.public_area);

		//我方区域
		this.mine_EX = new MineArea(this.mine_area);
		
		//拖拽区域
		this.drag_EX = new DragArea(this.drag_area);

		//房间类型
		this.roomType_EX = new RoomType(this.room_type);

		//初始化余额view（房间内的）
		var yuPopUIEx1 = new ui.pop.yuPopUIEx();
		this.yuPopUIEx1 = yuPopUIEx1;
		yuPopUIEx1.yuPopInRoom();

		// 开始游戏倒计时
		this.time_down = this.btnStart.getChildByName('time_down');


	}

	//初始化双方用户
	_proto_.initUserList = function(){

		var _this = this;
		// renderUserInfo玩家信息方法

		//对手玩家
		_this.opposite_user = new UserPlay(_this.head1_bg_wrap);

		//我方玩家
		_this.mine_user = new UserPlay(_this.head2_bg_wrap);

	}

	//初始化对比实例
	_proto_.initResultGame = function(){

		this.resultGame = new ResultGame(this.contrast_bg, this.result_wrap, this.result_mask);

		//供外界访问
		broker.tuoguanUIEx = new tuoguanUIEx(this.tuoguan_box);

	}

	//初始化各个按钮事件
	_proto_.initEvent = function(){

		//更多按钮
		this.more_icon.on(Laya.Event.CLICK, this, function(){

			// 结算期间不能点击
			if(broker.resultPopUIEx.isShow){
				return;
			}

			audio.play('an_niu');

			broker.moreUIEx.show();
		})

		//帮助按钮
		this.help_icon.on(Laya.Event.CLICK, this, function(){
			audio.play('an_niu');

			Game.hall.popup.helppop.popup();
		})

		//聊天按钮
		this.chat_icon.on(Laya.Event.CLICK, this, function(){
			audio.play('an_niu');

			// 发送请求聊天表情请求
			broker.getChatFaceData();
			broker.talkUIEx.show();
		})

		//表情按钮
		this.face_icon.on(Laya.Event.CLICK, this, function(){

			audio.play('an_niu');

			// 发送请求聊天表情请求
			broker.getChatFaceData();
			broker.faceUIEx.show();
		})

		// 对方玩家头像点击发出请求
		this.head1_bg_wrap.on(Laya.Event.CLICK, this, function(){

			audio.play('an_niu');

			if(this.oppIsClicked){

				return;
			}
			this.oppIsClicked = true;

			// 请求获取对方玩家信息
			broker.authInfo();

			// 重置用户可点击状态
			Laya.timer.once(3000, this, function(){
				this.oppIsClicked = false;
			}) 

		})

		// 首次确认开始游戏
		this.btnStart.on(Laya.Event.CLICK, this, function(){

			audio.play('an_niu');
			this.timeDownStart();
		})

		// 倒计时添加事件
		this.time_down.on('change', this, function(){
			if(this.time_down.index == 4){
				this.time_down.stop();
			}
		});
	}

	// 开始倒计时
	_proto_.timeDownStart = function(){
		// 发送确认开始
		broker.ready();
		this.time_down.stop();
		this.btnStart.visible = false;
	}

	//渲染双方及公共区域的所有牌
	_proto_.renderAllPai = function(data, handCards){
		var newArr = this.parsePaiArray(data);

		this.opposite_EX.renderPaiContent(newArr[0]);
		this.public_EX.renderPaiContentPublic(newArr[1]);
		this.mine_EX.renderPaiContent(newArr[2]);

		// 判断拖拽区域是否有牌
		if(handCards && handCards.length > 0){
			// 拖拽区域牌
			this.drag_EX.renderPaiContent(handCards);
		}else{
			this.drag_EX.resetDrag();
		}

		// 更新我方确定区域可放牌的数组
		broker.MineArea.hasPaiArr = this.checkHasPai(newArr[2]);

	}
	// 将有牌的位置索引放入数组
	_proto_.checkHasPai = function(arr){
		var _arr = [];
		arr.forEach(function(item, index, arr){
			if(item){
				_arr.push(index);
			}
		})

		return _arr;
	}

	/*[
		['H8', 'S3', 'D10', 'H11', 'C5'],
		['D2', 'S3', 'S8', 'H6', 'D9'],
		['S1', 'S3', 'D7', 'S2', 'H4']
	]    处理每次返回的当前所有牌的数组
	*/
	_proto_.parsePaiArray = function(arr){
		var opp_arr = [];
		var public_arr = [];
		var mine_arr = [];

		arr.forEach(function(item, index, arr){
			var _arr1 = item.slice(0, 2);
			var _arr2 = item.slice(2, 3);
			var _arr3 = item.slice(3);

			opp_arr = opp_arr.concat(_arr1);
			public_arr = public_arr.concat(_arr2);
			mine_arr = mine_arr.concat(_arr3);
		})

		opp_arr = this.sortArray(opp_arr);
		mine_arr = this.sortArray(mine_arr);

		return [opp_arr, public_arr, mine_arr];

	}
	//重新排序对应各区域索引
	_proto_.sortArray = function(arr){

		return [arr[0], arr[2], arr[4], arr[1], arr[3], arr[5]];

	}

	//退出房间初始化(是否是自己)
	_proto_.quitRoom = function(isMyself){

		if(isMyself){

			// 退出房间更改状态
			this.isRoomState = false;
			//重置房间信息
			this.roomType_EX.reset();
			// 重置自己
			this.mine_user.reset();
			// 关闭结算弹层
			broker.resultPopUIEx.close();
		}

		//重置各区域牌(公共区域是否有牌???)
		if(this.public_EX.wait_text.visible){
			this.resetAllAreaPai(false);
		}

		//重置对方用户
		this.opposite_user.reset();

	}

	// 进入房间
	_proto_.goInRoom = function(user1, user2, tableConf){

		var _hasOpp = Object.keys(user2) != 0;

		// 进入房间更改状态
		this.isRoomState = true;

		// 重制结果弹层
		broker.resultPopUIEx.isShow = false;

		//渲染当前玩家
		this.mine_user.renderUserInfo(user1);

		// 渲染对方玩家
		if(_hasOpp){

			this.opposite_user.renderUserInfo(user2);
			this.public_EX.resetPublic(true);

		}else{

			this.quitRoom(false);
			this.public_EX.resetPublic(false);
		}

		// 结束倒计时
		this.endNotice();

		// 重置桌面的所有牌
		this.resetAllAreaPai(_hasOpp);

		//渲染房间场型
		this.roomType_EX.renderRoomType(tableConf.type, tableConf.bottom);

		// 更新余额条
		this.yuPopUIEx1.readCoin();


	}

	// 重置桌面上的所有牌(全部清除)
	_proto_.resetAllAreaPai = function(isOpp){

		this.opposite_EX.reset();
		this.public_EX.resetPublic(isOpp);
		this.mine_EX.resetMine();
		this.drag_EX.resetDrag();

	}

	// 更新双方的余额
	_proto_.resetTotalMoney = function(score2, score1){

		this.opposite_user.resetTotalMoney(score2);
		this.mine_user.resetTotalMoney(score1);

	}

	// 当前玩家准备出牌
	_proto_.mineNotice = function(){

		// 对方玩家结束时间
		this.opposite_user.timeEnd();

		// 我方玩家开始时间
		this.mine_user.timeStart();

	}

	// 当前玩家出牌结束
	_proto_.oppositeNotice = function(){

		this.opposite_user.timeStart();

		this.mine_user.timeEnd();
	}

	// 出牌结束
	_proto_.endNotice = function(){

		this.opposite_user.timeEnd();

		this.mine_user.timeEnd();
	}

	// 初始化道具动画
	_proto_.initDaoJuAni = function(){

		this.djControl_Ex = new Djcontrol(this.daoju_box);
		
	}

	// 更新用户信息
	_proto_.updateUserInfoRoom = function(rep){
		// 更新money
		this.yuPopUIEx1.setCoin(rep.money);

		// 更新chips
		this.mine_user.setTotalMoney(rep.chips);

	}

	// 对方玩家进房间
	_proto_.opposite_userCome = function(obj){

		// 如果有结算弹层则将其隐藏
		if(broker.resultPopUIEx.isShow){
			broker.resultPopUIEx.myClose();
		}

		// 已经开局
		// broker.moreUIEx.isGameIng(true);

		//渲染对手信息
		this.opposite_user.renderUserInfo(obj);

		// 将公共牌区域重制
		this.public_EX.resetPublic(true);
	}

	// 首次进房间确认开始游戏
	_proto_.firstStartGame = function(){

		this.btnStart.visible = true;
		this.time_down.index = 0;
		this.time_down.play();

	}




})(roomUI, broker);

