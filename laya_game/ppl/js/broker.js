var broker = {
	cmd : {
		roomlist    	: "pinpinle::roomList", 				//房间初始化
		getUserInfo 	: "pinpinle::getUserInfo",				//获取用户信息
		setNewUserStats : "pinpinle::setNewUserStats",			//设置新用户接口（不弹新手引导）
		showTakeOut 	: "pinpinle::showTakeOut",				//显示带出
		takeOut     	: "pinpinle::takeOut",					//确定带出
		Error       	: "pinpinle::error",					//错误
		inRoom 			: "pinpinle::inRoom",					//进入房间页
		ready 			: "pinpinle::ready",					//准备完毕开始游戏(首次确认)

		start 			: "pinpinle::start",					//开始游戏
		takeIn 			: "pinpinle::takeIn",					//自动兑入
		notice 			: "pinpinle::notice",					//准备出牌
		publicCard 		: "pinpinle::publicCard",				//公共牌
		dealCards 		: "pinpinle::dealCards",				//拖拽牌
		showPoker 		: "pinpinle::showPoker",				//现在桌上的所有确定牌
		outCard			: "pinpinle::outCard",					//出牌动作
		roundEnd 		: "pinpinle::roundEnd",					//结算

		initGame		: "pinpinle::initGame",					//游戏初始化
		quit 			: "pinpinle::quit",						//退出方法
		changeTable 	: "pinpinle::changeTable",				//换桌
		continue1 		: "pinpinle::continue",					//再来一局方法

		getChatFaceData : "pinpinle::getChatFaceData",			//获取聊天表情数据
		sendChatFace	: "pinpinle::sendChatFace",				//发送聊天表情
		tuoGuan			: "pinpinle::tuoGuan",					//托管

		authInfo		: "pinpinle::authInfo",					//获取对方信息
		payAndUseItem	: "pinpinle::payAndUseItem",			//购买并使用道具

		getMyRank		: "pinpinle::getMyRank",				//我的战绩

		caution			: "cmd::caution",						//用户禁用 && 万里通积分授权
		losePointInfo	: "game::losePointInfo",				//输分提醒
		wlt_error		: "pinpinle::wlt_error"					//wlt游戏币错误
	},
	player:{

	},

	// 随机获取默认头像
	getDefault_head: function(bool){
		var _url = 'images/youhua2/head';
		if (bool) {
			return 'images/room/unknown.png';
		}else{
			return _url + Math.floor(Math.random()*8) + '.png';
		}
	},

	// 游戏初始化
	initGame: function(){
		// 未登录就切换到大厅
		if(!token){
			Game.router.navigate('hall');
			return;
		}
		Game.socket.emit({
			cmd : this.cmd.initGame,
			params : {
				token : token
			}
		});
	},

	//退出
	quit : function(){
		Game.socket.emit({
			cmd : this.cmd.quit,
			params : {
				token : token
			}
		});
	},

	// 出牌
	outCard: function(card){
		Game.socket.emit({
			cmd : this.cmd.outCard,
			params : {
				token : token,
				card: card
			}
		});
	},

	//获取用户信息
	getUserInfo: function(){
		if(!token){
			Game.hall.unLogin();
			return;
		}
		Game.socket.emit({
		    cmd : this.cmd.getUserInfo,
		    params : {
		        token : token
		    }
		}, true);
	},

	//请求房间列表
	roomlist: function(){
		Game.socket.emit({
		    cmd : this.cmd.roomlist
		}, true);
	},

	//请入房间请求
	inRoom: function(item){
		Game.socket.emit({ 
			cmd : this.cmd.inRoom,
			params : {
				token : token,
				roomId: Number(item.name.slice(0, 1))
			}
		});
	},

	// 显示带出
	showTakeOut: function(){
		Game.socket.emit({ 
			cmd : this.cmd.showTakeOut,
			params : {
				token : token
			}
		});
	},

	// 确定收获
	takeOut: function(){
		Game.socket.emit({
			cmd : this.cmd.takeOut,
			params : {
				token : token
			}
		})
	},

	// 再来一局 继续
	continueFn: function(){
		Game.socket.emit({
			cmd : this.cmd.continue1,
			params : {
				token : token
			}
		})
	},

	// 换桌
	changeTable: function(){
		Game.socket.emit({
			cmd : this.cmd.changeTable,
			params : {
				token : token
			}
		})
	},

	// 获取聊天表情数据
	getChatFaceData: function(){
		Game.socket.emit({
			cmd : this.cmd.getChatFaceData,
			params : {
				token : token
			}
		})
	},

	// 发送聊天表情数据(type: 1->聊天语    2->表情)
	sendChatFace: function(type, chatID){
		Game.socket.emit({
			cmd : this.cmd.sendChatFace,
			params : {
				token : token,
				type: Number(type),
				chatID: Number(chatID)

			}
		})
	},

	// 获取对方信息
	authInfo: function(){
		Game.socket.emit({
			cmd : this.cmd.authInfo,
			params : {
				token : token
			}
		})
	},

	// 购买并使用道具
	payAndUseItem: function(id){
		Game.socket.emit({
			cmd : this.cmd.payAndUseItem,
			params : {
				token : token,
				itemId: id
			}
		})
	},

	// 取消托管
	tuoGuan: function(){
		Game.socket.emit({
			cmd : this.cmd.tuoGuan,
			params : {
				token : token
			}
		})
	},

	// 我的战绩
	getMyRank: function(){
		Game.socket.emit({
			cmd : this.cmd.getMyRank,
			params : {
				token : token
			}
		})
	},

	// 设置非新用户（不再新手引导）
	setNewUserStats: function(){
		Game.socket.emit({
			cmd : this.cmd.setNewUserStats,
			params : {
				token : token
			}
		})
	},

	// 确认开始
	ready: function(){
		Game.socket.emit({
			cmd : this.cmd.ready,
			params : {
				token : token
			}
		})
	}








}

