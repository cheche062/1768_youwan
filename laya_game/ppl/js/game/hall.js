//大厅页
;(function(){
	Game.hall = {
		hallUI : null,
		menuUI :null,
		popup :{

		},
		ajaxUrl:{
			url_rankData  :   "/?act=game_ppl&st=get_bet_rank",     //日周月年排行榜
		},
		data : {
			hasClickedRoom: false,		//是否已经点击过房间按钮
			roomlist: [],
			day: [],
			week: [],
			month: []
		},

		//即将进入的房间信息
		roomInfo: {
			dizhu: '',
			chang_xin:  0
		},		

		//玩家信息
		player : {
			uid : userId,
			uName:null,
			chips : 0,			//游戏币
			money : 0,			//余额 
			token : token,
			icon: '',			//用户头像
			defen: 0, 			//得分
			chouma: 0 			//筹码
		},

		//大厅初始化
		init : function(){
			var _this = this;
			//大厅页ui
			_this.hallUI = new ui.hall.hallpageUI();
			Game.HallUI = _this.hallUI;

			Game.HallWrap.addChild(_this.hallUI);
			// 设置一下居中
			Game.setViewCenter();

			// 下拉菜单
			_this.menuUI = _this.hallUI.menu_box;
			_this.menuUI.visible = false;

			// 头像边框隐藏
			_this.hallUI.border_head.visible = false;

			//初始化弹层
			_this.popElement();

			//socket初始化
			Game.socket.init();

			//路由初始化
			Game.router.init();

			//事件绑定
			_this.bindEvent();

			// 创建容纳房间列表的容器
			_this.initApeCtn();

			// 点击除了设置浮层外的地方关闭设置浮层
			_this.clickOtherArea();

			// 系统公告
			_this.xtggFn();

			// 主页按钮初始化
			_this.initBtnHome();

			// 初始化声音
			audio.load();

		},

		// 初始化大厅显示内容
		goInHall : function(){

			//请求用户信息
			broker.getUserInfo();

			// 请求房间列表
			broker.roomlist();

			// 打开开关
			this.data.hasClickedRoom = false;

		},

		//弹层模块
		popElement : function(){
			var self = this;

			//排行榜
			var rankPopup = new ui.pop.rankpopUI();
			// rankPopup.oneranklist.vScrollBarSkin = '';
			// rankPopup.tworanklist.vScrollBarSkin = '';
			rankPopup.oneranklist.visible = false;
			self.popup.rankPopup = rankPopup;

			//帮助
			var helppop = new ui.pop.helppopUI();
			self.popup.helppop = helppop;

			// 帮助的滑动切换
			new zsySlider(helppop.help_glr);

			//公用提示框
			var commomTip = new ui.pop.comTipUIEx();
			self.popup.commomTip = commomTip;

			//退出提示框或复盘
			new ui.pop.pop_yesNoUIEx();

			//收获提示框
			var pipTip = new ui.pop.pipTipUIEx();
			self.popup.pipTip = pipTip;

			//初始化余额view
			var yuPopUIEx1 = new ui.pop.yuPopUIEx();
			yuPopUIEx1.yuPopInHall();
			self.yuPopUIEx1 = yuPopUIEx1;

			//充值弹层
			self.popup.recharge = new ui.pop.rechargeUIEx();

			//收获
			self.popup.shouhuoPopup = new ui.pop.shouhuoUIEx();

			// 简易提示框
			broker.warnPopUIEx = new ui.pop.warnPopUIEx();
			
			// 新手引导流程
			broker.newPlayerUIEx = new ui.pop.newPlayerUIEx();

		},

		//绑定事件
		bindEvent : function(){
			var self = this;
			var hallUI = self.hallUI;
			var eventType = Laya.Event.CLICK;
			var firstTab = false;	//首次点击tab键（防止文字重叠）

			//点击排行榜
			hallUI.btnRank.on(eventType, this, function(){
				audio.play('an_niu');
				// 日
				if(!firstTab){
					self.betlist(1);
				}
				firstTab = true;
				self.popup.rankPopup.popup();
			});

			//点击下拉按钮
			hallUI.btnMenu.on(eventType, this, function(){
				audio.play('an_niu');
				self.menuUI.visible = !self.menuUI.visible;
			});


			// 初始化一下声音的状态
			var _sound = audio.getCookie("soundClose") == 'true';
			self.menuUI.voice.index = _sound? 1 : 0;

			//声音
			self.menuUI.voice_1.on(eventType, this, function(){

				if(self.menuUI.voice.index == 0){
					// 关闭声音
					self.menuUI.voice.index = 1;
					audio.setMuted();
					audio.setCookie("soundClose", 'true');

				}else{
					// 打开声音
					self.menuUI.voice.index = 0;
					audio.setMutedNot();
					audio.setCookie("soundClose", 'false');

					audio.play('an_niu');
				}
			}); 

			//帮助
			self.menuUI.help.on(eventType, this, function(){
				audio.play('an_niu');
				self.popup.helppop.popup();
				self.menuUI.visible = false;

			}); 

			//点击收获
			hallUI.btnCashou.on(eventType, this, function(){
				audio.play('an_niu');

				//发出兑出的请求
				broker.showTakeOut();

			})

			//点击排行榜切换按钮
			self.popup.rankPopup.listtab.on(eventType,this,function(){
				audio.play('an_niu');
				var gzrankList =  self.popup.rankPopup;
				var setVisible = function (obj,bool){
					obj.visible = bool;
				};
				var index =  gzrankList.listtab.selectedIndex;
				gzrankList.gzcontenttext.text = "";

				if(index == 0){

					// 发送请求（获取我的战绩请求）
					broker.getMyRank();

					setVisible(gzrankList.oneranknav,true);
					setVisible(gzrankList.tworanknav,false);
					setVisible(gzrankList.oneranklist,true);
					setVisible(gzrankList.tworanklist,false);

				}else{

				   self.betlist(index);

				   setVisible( gzrankList.oneranknav,false);
				   setVisible( gzrankList.tworanknav,true);
				   setVisible( gzrankList.oneranklist,false);
				}

			});
      
		},
	       
		//我的奖励my
		gzMyrecord : function(data){

			var self = this;
			var Myrecode = [];
			var gzrankList =  self.popup.rankPopup;
			if(data.length == 0){

				gzrankList.oneranklist.visible = false;
				if(!gzrankList.tworanklist.visible){

					gzrankList.gzcontenttext.text = "暂无记录";
				}

			}else{

				gzrankList.gzcontenttext.text = "";

				data.forEach(function(item, index, arr){
					var amount = item.win_amount;
					var time = item.raw_add_time.split('T')[0];
					Myrecode.push({'jltime' : time,'jlreward' : amount})
				})
				
				gzrankList.oneranklist.array = Myrecode;

			}

		},

		// 日 周 月
		betlist: function(num){
			var _this = this;
			var gzrankList =  this.popup.rankPopup;
			var _type = '';

			// 首先隐藏（防止跳闪）
			gzrankList.tworanklist.visible = false;

			switch(Number(num)){
				case 1: _type = 'day';  break;
				case 2: _type = 'week';  break;
				case 3: _type = 'month';  break;
			}

			// 有数据直接渲染
		/*	if(_this.data[_type].length){

				_this.renderData(_this.data[_type]);
				return;
			}*/

			$.ajax({
				url: '/?act=game_ppl&st=get_bet_rank&type='+_type,
				type: 'GET',
				dataType:'json',
				success : function(response){
					var listdata = response.data;

					if(!listdata || listdata.length == 0){
						gzrankList.tworanklist.visible = false;
						if(!gzrankList.oneranklist.visible){

							gzrankList.gzcontenttext.text = "暂无记录";
						}
						return;
					}

					gzrankList.gzcontenttext.text = "";

					// 如果是日排行
					if(num == 1){
						_this.renderRich(listdata.slice(0, 3));
					}

					// 把数据存起来
					// _this.data[_type] = listdata;

					_this.renderData(listdata);

				}
			})

		},

		// 渲染回调排行数据
		renderData: function(data){
			var gzrankList =  this.popup.rankPopup;
			var datarankList = [];
			data.forEach(function(item, index, arr){
				var ranktrend = 0;
				switch(Number(item.rank_trend)){
					case 1: ranktrend = 2;  break;
					case 2: ranktrend = 0;  break;
					case 3: ranktrend = 1;  break;
				}

				datarankList.push({
					'gzpaiming' : item.rank,	
					'username' : item.nickname, 
					'coinsbet': parseInt(item.amount),
					'trend': ranktrend
				});
			})

			gzrankList.tworanklist.array = datarankList;
			if(!gzrankList.oneranklist.visible){

				gzrankList.tworanklist.visible = true;
			}
		},

		// 土豪榜的渲染
		renderRich: function(data){
			var rankPopup = this.popup.rankPopup;
			var tuhao_null = rankPopup.tuhao_null;

			var rankNameArr = zutil.getElementsByName(rankPopup.rankRich, 'rankName');
			var rankAountArr = zutil.getElementsByName(rankPopup.rankRich, 'rankAount');

			// 是否有数据
			tuhao_null.text = data.length === 0? '虚位以待' : ''; 

			rankNameArr.forEach(function(item, index, arr){
				if(data[index]){
					item.text = zutil.getActiveStr(data[index].nickname, 8);
				}
			})

			rankAountArr.forEach(function(item, index, arr){
				if(data[index]){
					item.text = parseInt(data[index].amount);
				}
			})

		},

		// 初始大厅房间的容器（防止重复添加）
		initApeCtn : function(){

			this.apeCtn = new Laya.Sprite();

			this.hallUI.addChild(this.apeCtn);
		},

		//更新大厅内房间
		updataRoom:function(data){
			var _rooms = [];
			var self = this;
			var _txt = "";
			self.data.roomlist = data;

			//  先清除子类
			this.apeCtn.destroyChildren();

			self.apeCtn.x = 50;
			for(var i = 0 ; i < data.length ; i++){
				var roomlist = new ui.UI.halRoomLevelUI();
				var _type = data[i].type;
				var _bottom = data[i].bottom;
				var _roomNum = data[i].roomNum;
				roomlist.name = _type +'_'+ _bottom;
				roomlist.levelbg.skin = "images/room" + _type + ".png";

				// 调整底分的位置
				if(_type == 1){
					roomlist.difen_bottom.pos(111, 221);

				}else if(_type == 2){
					roomlist.difen_bottom.pos(109, 225);

				}else if(_type == 3){
					roomlist.difen_bottom.pos(101, 225);

				}else if(_type == 4){
					roomlist.difen_bottom.pos(104, 225);

				}

				// 一万
				_txt = data[i].min;

				if(_txt % 10000 == 0){
					_txt = _txt/10000 + "I";
				}

				// 底分
				roomlist.difen_bottom.text = '底分:' + _bottom;

				// 最低带入
				roomlist.numAtlist.text = _txt;

				// 房间人数(在真实的基础上增加)
				if(_roomNum<0){
					_roomNum = 0;
				}
				_roomNum = zutil.getRandomNum(3, 30) + parseInt(_roomNum);
				roomlist.lineNum.text = _roomNum;

				_rooms.push(roomlist);

				self.apeCtn.addChild(roomlist);

				switch (i){
					case 0:
						roomlist.pos(-400, 447);
						Laya.Tween.to(roomlist, {x: 0}, 400, Laya.Ease.circOut);
						break;
					case 1:
						roomlist.pos(750, 447);
						Laya.Tween.to(roomlist, {x: 360}, 400, Laya.Ease.circOut);
						break;
					case 2:
						roomlist.pos(-400, 856);
						Laya.Tween.to(roomlist, {x: 0}, 800, Laya.Ease.circOut, null, 150);
						break;
					case 3:
						roomlist.pos(750, 856);
						Laya.Tween.to(roomlist, {x: 360}, 800, Laya.Ease.circOut, null, 150);
						break;
				}
			}
			//给每个房间按钮添加请入房间请求
			_rooms.forEach(function(item, index, arr){
				item.on(Laya.Event.CLICK, this, function(){
					audio.play('an_niu');
					
					//已经点击过请求
					if(self.data.hasClickedRoom){
						return;
					}
					self.data.hasClickedRoom = true;

					//10秒后可以再次点击请求
					Laya.timer.once(5*1000, self, function(){self.data.hasClickedRoom = false;});

					//给房间信息赋值
					self.roomInfo.dizhu = item.name.slice(2);
					self.roomInfo.chang_xin = item.name.slice(0, 1);

					//请入房间请求
					broker.inRoom(item);
				})
			})

		},

		//更新用户信息
		updateUserInfo : function(data){
			var self = this;
			var _player = self.player;
			_player.chips = data.chips;  			//大厅游戏币
			_player.money = data.money; 			//大厅余额
			_player.uName = data.uName;				//用户姓名
			_player.icon = data.icon;				//用户头像

			self.hallUI.gameScore.text = _player.chips;

			//设置余额
			self.yuPopUIEx1.setCoin(_player.money);

			self.hallUI.userName.text = zutil.getActiveStr(_player.uName, 18);
			
			// 根据用户名来随机确定一个默认头像
			broker.player[_player.uName] = broker.player[_player.uName] || broker.getDefault_head();
			self.hallUI.userHead.skin = broker.player[_player.uName];
			// 头像边框
			self.hallUI.border_head.visible = true;

		},

		// 收获游戏币
		shouhuoYXB: function(total){
			var self = this;
			var _player = self.player;
			_player.chips = 0;
			_player.money = _player.money + total; 			//大厅余额
			self.hallUI.gameScore.text = 0;

			self.yuPopUIEx1.setCoin(_player.money);
			broker.roomUIEx.yuPopUIEx1.setCoin(_player.money);

		},

		//点击除了设置浮层外的地方关闭设置浮层
		clickOtherArea: function(){
			var _this = this;
			
			Laya.stage.on(Laya.Event.CLICK, _this, function(event){
				var _target = event.target;

				if(_this.menuUI.visible && (_target != _this.menuUI && !_this.menuUI.contains(_target)) && _target != _this.hallUI.btnMenu ){
					_this.menuUI.visible = false;
				}

			});

		},
		// 未登录
		unLogin: function(){
			var self = this;

			self.hallUI.userName.text = '未登录';
			
			self.hallUI.userHead.skin = broker.getDefault_head(true);
			// 头像边框
			self.hallUI.border_head.visible = true;

		},

		// 主页按钮初始化
		initBtnHome: function(){
			var btnHomeUrl = this.hallUI.btnHome;

			// 默认 不显示按钮
			btnHomeUrl.visible = false;
			if( GM.backHomeUrl ){
			      // 显示按钮
			      btnHomeUrl.visible = true;
			      // 绑定事件
			      btnHomeUrl.on('click', this, function(){
			           location.href = GM.backHomeUrl;
			      });
			}
		},

		// Laya 系统公告
		xtggFn: function(){
			var menuUI = this.menuUI;	//菜单
			var notice_box = menuUI.notice_box;	//公告box
			var bg =  menuUI.getChildAt(0); //背景
			notice_box.visible = false;
			menuUI.redPoint.visible = false;
			bg.skin = 'images/menu2.png';

			if(window.GM && GM.isCall_out === 1 && GM.noticeStatus_out){
				GM.noticeStatus_out(function(data){
					data = data || {};
					// 是否显示系统公告
					if(data.isShowNotice){
						notice_box.visible = true;
						bg.skin = 'images/menu.png';

						notice_box.on(Laya.Event.CLICK, this, function(){
							audio.play('an_niu');
							// 直接隐藏小红点
							menuUI.redPoint.visible = false;
							if( GM.noticePopShow_out ){
								GM.noticePopShow_out();
							}
						});
					}

					// 是否需要显示小红点
					if(data.isShowRedPoint){
						// 显示小红点
						menuUI.redPoint.visible = true;
					}
				});
			}

		}
    };
})();