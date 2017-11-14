Game.socket ={
	// cheche22
	cmd: broker.cmd,
	config : {
		connectionUrl       : socketIoUrl, 	//当前页面websocket服务器地址
		commSocketUrlport   : ""         , 		//当前页面websocket服务器端口号
		socketInit          : false		 	// 是否进行过初始化
	},

	initArrRoom: function(){
		var cmd = this.cmd;

		// 房间的命令
		this.arrRoom = [cmd.publicCard, cmd.dealCards, cmd.showPoker, cmd.roundEnd, cmd.start, cmd.tuoGuan];

	},

	init :function(){
		var _this = this;
		if(_this.config.socketInit){
			return;
		};
		_this.config.socketInit = true;

		_this.initArrRoom();

		//socket初始化
		_this.clearFun();

		try{
			//连接至游戏服务器
			_this.socket = io(_this.config.connectionUrl, {"force new connection" : true});
		}
		catch(e){
			_this.exceptionHand("服务暂时不可用，请稍后刷新重试！","");
			return;
		}

		//通过 router 模块，监听服务器返回的数据
		_this.socket.on('router', function(data) {
			var _data = Base64.decode(data);
			_data = JSON.parse(_data);

			if((window.location.search).split('debug=')[1]=='2'){
				console.info('---->>>>接收: ' + _data.cmd);
				console.log( JSON.stringify(_data) );
			}

							
			//对返回数据进行处理
			_this.updateGame(_data);

		});
		_this.socket.on('connect', function() {
			console.warn('socket:连接成功');
		});
		_this.socket.on('disconnect', function() {
			console.warn('socket:断开连接');
			broker.warnPopUIEx.show('网络断开连接');
		});
		_this.socket.on('connect_error', function(error) {
			console.warn('socket:连接错误', error);
		});
		_this.socket.on('reconnect', function() {
			console.warn('socket:重新连接完毕');
			location.reload();
		});
		_this.socket.on('reconnecting', function() {
			console.warn('socket:重新连接中...');
			broker.warnPopUIEx.show('网络重新连接中...');
		});

	},
	emit : function(data, noUser){
		var _this = this;
		var _data = JSON.stringify(data);

		// 有token或者可以旁观
		if( token || noUser){
			if((window.location.search).split('debug=')[1]=='2'){
				console.info('推送---->>>>: ' + data.cmd);
				console.log( _data );
			}

			_data = Base64.encode(_data);

			_this.socket.emit("router", _data);

		}else{
			// 跳登陆页
			location.href = '/?act=user&st=login';
		}

	},

	//处理接收到的信息
	updateGame : function(data){
		var _this = this;
		var CDM = _this.cmd;
		var _code = data.code;
		var _cmd = data.cmd;
		var broker = window.broker;
		// 异常code码
		if(_code){
			_this.fixException(data);

			return;
		}

		// 大厅内不处理房间内的任何指令
		if (_this.onlyCmd(_cmd)){

			return;	
		}

		// 具体命令处理
		switch(_cmd){

			//自动兑入
			case CDM.takeIn:

				// 提示弹框(自动兑入)
				broker.warnPopUIEx.show("已自动帮您兑入金额：" + data.rep.takeIn);

				//渲染当前玩家
				broker.roomUIEx.mine_user.renderUserInfo(Game.hall.player);

				// 再次请求用户信息金额
				broker.getUserInfo();
								
				break;

			//获取大厅信息
			case CDM.roomlist:

				Game.hall.updataRoom(data.rep);

				break;

			//获取玩家信息
			case CDM.getUserInfo :

				// 大厅的用户信息更新
				Game.hall.updateUserInfo(data.rep);

				// 房间页的用户信息更新
				broker.roomUIEx.updateUserInfoRoom(data.rep);

				break;

			//兑出请求
			case CDM.showTakeOut:

				// 渲染收获弹层的数据
				broker.shouhuoUIEx.renderInfo(data);
				
				break;

			//确定带出
			case CDM.takeOut :

				var _txt = "";

				if(data.rep.code == 100001){
					_txt =  data.rep.error;
					
				}else if(data.rep.code == 200){
					_txt ='请进入游戏房间，点击左上角返回按钮，正常返回游戏大厅后，进行收获操作。';

				}else if(data.rep.code == 100007){
					_txt = '单日收获超出限制';
					
				}else{
					_txt =  '恭喜您收获成功！';
					Game.hall.shouhuoYXB(data.rep.total);
				}

				// 更新大厅余额和游戏币
				broker.comTipUIEx.show(_txt);

				break;  

			//请求错误
			case CDM.Error : 

				_this.cmdError(data);

				break;
				
			// 继续游戏
			case CDM.continue1:
				// 结算弹层在
				if(data.rep.message == "success" && broker.resultPopUIEx.isShow){
					broker.resultPopUIEx.myClose();
				}

				break;

			// 换桌成功
			case CDM.changeTable:
				if(data.rep.message == "success" && data.rep.own == true){
					broker.warnPopUIEx.show('换桌成功');
				}

				// 对方退出房间
				broker.roomUIEx.quitRoom(false);

				break;
			
			//进入房间请求
			case CDM.inRoom:

				if(data.rep.message == "success"){
					//进入房间后执行
					Game.router.navigate('room');

					broker.roomUIEx.firstStartGame();

					// 清除大厅的房间列表
					Game.hall.apeCtn.destroyChildren();

					//初始房间信息(双方玩家和房间类型)
					broker.roomUIEx.goInRoom(Game.hall.player, {}, data.rep.roomConf);

				}

				break;

			// 准备完毕
			case CDM.ready :
				var _roomUIEx = broker.roomUIEx.btnStart;
				if(data.rep.message == "success" && _roomUIEx.visible){
					_roomUIEx.visible = false;
				}
				break;

			//开始游戏（对方玩家进入房间）
			case CDM.start :
				
				broker.roomUIEx.opposite_userCome(data.rep.data[1]);

				break;

			//公共牌
			case CDM.publicCard:

				//渲染公共牌
				broker.roomUIEx.public_EX.renderPaiContentPublic(data.rep.card);
					

								
				break;

			//拖拽牌
			case CDM.dealCards:

				//渲染拖拽牌
				Laya.timer.once(200, null, function(){

					audio.play('shou_pai');
					broker.roomUIEx.drag_EX.renderPaiContent(data.rep.card);

					// 不在托管状态才有倒计时
					if(!broker.tuoguanUIEx.visible){
						
						broker.roomUIEx.mineNotice();
					}
				});

				// 聊天和表情弹框强制关闭
				broker.MainRoomGame.closeTalkFace();
								
				break;

			//渲染双方及公共区域的所有牌
			case CDM.showPoker:

				// 延迟200毫秒确保选中牌的放大动画播放完
				Laya.timer.once(200, null, function(){ 
					broker.roomUIEx.renderAllPai(data.rep.card);
				});
								
				break;

			//结算
			case CDM.roundEnd:

				// 关闭多余的弹层
				broker.MainRoomGame.closeMorePop();	

				_this.resultRoundEnd(data);

				break;

			// 初始化游戏
			case CDM.initGame:
				var _rep = data.rep;
				var _code = _rep.code;

				// 3000在大厅	3001进入房间	3002准备完毕	3003 游戏中		3004结算中
				if (_code == 3000) {

					Game.router.navigate('hall');

					// 是否是新用户
					if(_rep.isNew == 1){
						
						broker.newPlayerUIEx.show();
					} 

				}else if(_code == 3001 || _code == 3002 || _code == 3003 || _code == 3004){

					Game.router.navigate('room');

					//请求用户信息
					broker.getUserInfo();

					// 赋值当前房间桌子信息(便于换桌获取)
					Game.hall.roomInfo.dizhu = _rep.tableConf.bottom;
					Game.hall.roomInfo.chang_xin = _rep.tableConf.type;

					//初始房间信息(双方玩家和房间类型)(首先渲染双方玩家进入房间以免把公共区域牌去掉)
					broker.roomUIEx.goInRoom(_rep.user[0], _rep.user[1], _rep.tableConf);

					// 当前桌面上的所有牌
					if(_rep.card.length == 0){

						broker.roomUIEx.resetAllAreaPai();
					}else{

						broker.roomUIEx.renderAllPai(_rep.card, _rep.handCards);
					}

					// 是否在托管
					if(_rep.tuoGuan == 1){
						broker.tuoguanUIEx.show();
					}else if(_rep.tuoGuan == 0){
						broker.tuoguanUIEx.hide();

					}

					if(_code == 3003){

						broker.warnPopUIEx.show('回到未完成的牌局');
						
					}

					if(_code == 3004){


						
					}
				}


				break;

			//退出游戏
			case CDM.quit:
				//自己退出房间
				if(data.rep.own){

					//我方退出房间
					broker.roomUIEx.quitRoom(true);

					//退回大厅
					Game.router.navigate('hall');

					// 退出房间需要关闭的所有弹层
					broker.MainRoomGame.closeMorePop();

				}else{

					// 对方退出房间
					broker.roomUIEx.quitRoom(false);
				}

				break;

			// 获取聊天表情数据
			case CDM.getChatFaceData:

				var _rep = data.rep;

				var chatData = _rep.chatData;
				var chatDataArray = [];
				chatData.forEach(function(item, index, arr){
					chatDataArray.push(item.id +'~'+ item.content);
				})
				broker.talkUIEx.renderChatContent(chatDataArray);

				var faceData = _rep.faceData;
				var faceDataArray = [];
				faceData.forEach(function(item, index, arr){
					faceDataArray.push(item.id +'~'+ item.img);
				})
				broker.faceUIEx.renderFaceContent(faceDataArray);

				break;

			// 接受对方发送的聊天或表情
			case CDM.sendChatFace:

				var _rep = data.rep;

				// 对方发送聊天内容
				if(!_rep.own){
					if(_rep.type == 1){
						// 聊天
						broker.roomUIEx.opposite_user.renderChat(_rep.content);
					}else if(_rep.type == 2){
						// 表情
						broker.roomUIEx.opposite_user.renderFace(_rep.content);
					}

				}

				break;

			// 使用道具
			case CDM.payAndUseItem:
				var _rep = data.rep;
				var _id = +_rep.description;

				if(!_rep.own){
					// 对方发送道具
					broker.Djcontrol.animation(2, _id);

				}else{
					// 直接后台读取最新用户信息余额
					broker.getUserInfo();
					// 我方发送道具
					broker.Djcontrol.animation(1, _id);
				}

				break;

			// 获取对方信息
			case CDM.authInfo:

				// 渲染头像弹框 
				broker.headPopUIEx.renderHeadPop(data.rep);

				break;

			// 托管
			case CDM.tuoGuan:

				if(data.rep.status == 1){

					broker.roomUIEx.endNotice();
					broker.tuoguanUIEx.show();
				}else if(data.rep.status == 0){

					broker.roomUIEx.mineNotice();
					broker.tuoguanUIEx.hide();
				}

				break;

			// 我的战绩
			case CDM.getMyRank:

				// 渲染我的战绩
				Game.hall.gzMyrecord(data.rep.rank);

				break;

			// 用户禁用
			case CDM.caution:

				if(data.rep.code == "1000"){
					broker.warnPopUIEx.show("亲！您的账户已被禁用...");
				}

				// 万里通积分授权
				if(data.rep.code == "1001"){
					GM.accredit && GM.accredit();
				}

				break;

			// 输分提醒
			case CDM.losePointInfo:

				_this.shuFenTi(data.rep.res);

				break;

			case CDM.wlt_error:

				if(data.rep.rpcId == 1){

					var wlt_txt = data.rep.msg;

					wlt_txt = wlt_txt.slice(0, 15) + '\\n' + wlt_txt.slice(15);

					broker.warnPopUIEx.show(wlt_txt);
				}
				break;


				

			default:

				break
		}

	},

	fixException : function(data){
		var _this = this;
		var code = String(data.code);
		var _txt = '';
		switch(code){
			//opt验证
			case "81" :
				location.href = "/?act=otp&st=otpPage";
				break;

			//用户达到万里通积分消费限额时（单笔/当日）
			case "113" : 
				_this.exceptionHand("万里通积分达到单笔消耗上限，您可以登录www.wanlitong.com—我的万里通—账户安全—消费限额设置，调整消耗上限额度，或直接充值欢乐豆。");
				break;

			case "114" :
				_this.exceptionHand("万里通积分达到单日消耗上限，您可以登录www.wanlitong.com—我的万里通—账户安全—消费限额设置，调整消耗上限额度，或直接充值欢乐豆。");
				break;

			// 异地登录
			case "1002":

				// 断开清除socket
				_this.clearFun();
				
				// 异地登录请刷新页面
				broker.comTipUIEx.show("异地登录,请刷新页面", true);

				break;

			//错误异常处理
			default : 
				_this.exceptionHand(data.error || data.msg || data.etext);
				break;
		}

	},
	// log函数
	exceptionHand:function(mess){
		console.log(mess);      
	},

	//socket清除初始化
	clearFun : function(){
		var _this = this;
		if(!_this.socket){return};
		_this.socket.close();
		_this.socket.removeAllListeners();
		_this.socket = null;

	},

	//处理结果对比
	resultRoundEnd: function(data){
		// 出结果阶段
		broker.resultPopUIEx.isShow = true;

		var _rep = data.rep;
		var _player = Game.hall.player;
		var _who1 = '';
		var _who2 = '';


		//0: 平   -1：输；  1：赢 
		if(_rep.isWin == 1){
			_who1 = 'win';
			_who2 = 'lose';
		}else if(_rep.isWin == -1){
			_who1 = 'lose';
			_who2 = 'win';
		}else if(_rep.isWin == 0){
			// 找一下谁是win
			if(_player.uName == _rep.winUser.user_name){
				_who1 = 'win';
				_who2 = 'lose';
			}else{
				_who1 = 'lose';
				_who2 = 'win';
			}
		}

		var _meObj = _rep[_who1 + 'User'];
		var _oppObj = _rep[_who2 + 'User'];

		var _coin1 = _who1 + 'Coin';
		var _coin2 = _who2 + 'Coin';

		var resultArr1 = _meObj.pokerType;
		var resultArr2 = _oppObj.pokerType;

		var _winArr1 = _meObj.win;

		var _score1 = _meObj.score;
		var _score2 = _oppObj.score;
		
		//赋值当前玩家的该局得分(需计算一下差值)
		_player.defen = _meObj.score - _oppObj.score;
		_player.choushui = _rep.choushui;
		_player.ticket = _rep.ticket;


		// 双方的金额得失
		var _mineCoin1 = parseInt(_rep[_coin1]);
		var _oppCoin2 = parseInt(_rep[_coin2]);
		
		var _meCoin =  (_coin1 == 'winCoin')? _mineCoin1 : -1*_mineCoin1;
		var _oppCoin = (_coin2 == 'winCoin')? _oppCoin2 : -1*_oppCoin2;

		_player.chouma = (_coin1 == 'winCoin')? _mineCoin1 : -1*_mineCoin1;

		// 更新双方的总余额
		broker.roomUIEx.resetTotalMoney(_oppCoin, _meCoin);

		// 开始对比动画
		broker.roomUIEx.resultGame.startContrast(resultArr2, resultArr1, _winArr1, _score2, _score1);

	},

	// 具体CMD error错误处理
	cmdError: function(data){

		var _code = data.rep.code;
		var _txt = '';

		switch (_code){
			case 'TAKEOUT_FAIL':

				_txt = "暂无可收获游戏币";
				broker.pipTipUIEx.show(_txt, true);

				break;

			case 'NOT_YOU':

				broker.warnPopUIEx.show(data.rep.msg);
				break;

			case 'NOT_THIS_CARD':
			
				broker.warnPopUIEx.show(data.rep.msg);
				break;

			// 余额不足
			case 'NO_MONEY':

				Laya.timer.once(2000, null, function(){
					broker.yuPopUIEx.chongzhiShow();
				})

				break;

			// 余额不足
			case 'UNFINISH_GAME':

				// 在房间内
				if(broker.roomUIEx.isRoomState){
					broker.pop_yesNoUIEx.show('back');

				}else{
					broker.pop_yesNoUIEx.show('fupan');
					
				}
				

				break;

			default:

				// 错误提示框
				broker.warnPopUIEx.show(data.rep.msg);
			
				break;
		}

	},

	// 房间页只处理房间页的指令
	onlyCmd: function(cdm){

		// 在大厅
		return !broker.roomUIEx.isRoomState && this.arrRoom.indexOf(cdm)>-1;

	},

	//输分提醒
	shuFenTi: function(data){
		if(window.GM && GM.loseRemind && GM.loseRemind.pop){
			GM.loseRemind.pop(data.level, data.endTime);
		}
	}


};
