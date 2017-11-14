// 收获UI
;(function(_super){

	function shouhuoUIEx(){

		shouhuoUIEx.super(this);

		// 对外接口
		broker.shouhuoUIEx = this;

		this.initEvent();
	}

	Laya.class(shouhuoUIEx, "ui.pop.shouhuoUIEx", _super);

	var _proto_ = shouhuoUIEx.prototype;

	_proto_.renderInfo = function(data){

		//如果游戏币为0，提示不满足兑出条件
		var _rep = data.rep;
		var _txt = "";
		if(_rep == ""){

			_txt = "亲，您现在还没有收获哦！";
			broker.pipTipUIEx.show(_txt, true);
			
			return ;
		}
		if(_rep.code == 11000){
			
			_txt = "您的网络不稳定，请检查网络后重试！";
			broker.pipTipUIEx.show(_txt, false);

			return ;
		}
		if(_rep.code == 200){

			_txt = "请进入游戏房间，点击左上角返回按钮，正常返回游戏大厅后，进行收获操作。";
			broker.pipTipUIEx.show(_txt, false);

		}else{
			var data0=Game.hall.player.chips || 0; 	//总金额
			var data1=0; 						//欢乐值 t点
			var data2=0; 						//积分	万里通积分
			var data3=0; 						//欢乐豆
			var data4=0; 						//彩金
			var data5=0; 						//钻石	挺豆
			var data9=0; 						//彩分
			var data10=0 ;						//健康金
			var data11=0 ;						//平安流量

			if(Object.keys(_rep).length == 0){
				_rep = [];				
			}

			_rep.forEach(function(item, index, arr){

				switch (item.accountType){

					case 1: 	//欢乐值
						data1 = item.amountAvailable;

						break;
					case 2: 	//积分
						data2 = item.amountAvailable;
					
						break;
					case 3: 	//欢乐豆
						data3 = item.amountAvailable;
					
						break;
					case 4: 	//彩金
						data4 = item.amountAvailable;
					
						break;
					case 5: 	//钻石
						data5 = item.amountAvailable;
					
						break;
					case 9: 	//彩分
						data9 = item.amountAvailable;
					
						break;
					case 10: 	//健康金
						data10 = item.amountAvailable;

					case 11: 	//平安流量
						data11 = item.amountAvailable;
					
						break;
				}
			})

			/*if(_rep.details[i].accountType == 4 || _rep.details[i].accountType == 5){

				amountAvailable = webgm.util.getCurrencyFormat(parseInt(_rep.details[i].amountAvailable) / 500, 2, false);
			}*/

			this.writeData(data0, data1, data2, data3, data4, data5, data9, data10, data11);
		}

	}

	_proto_.writeData = function(){
		this.totleCoin.text = arguments[0];
		this.huanlezhi.text = arguments[1];
		this.jifen.text = arguments[2];
		this.huanlesou.text = arguments[3];
		this.caijin.text = arguments[4];
		this.zuanshi.text = arguments[5];
		this.caifen.text = arguments[6];
		this.jiankang.text = arguments[7];
		this.liuliang.text = arguments[8];

		// 平安流量为0时隐藏 
		if(Number(arguments[8]) == 0){
			this.liuliang.parent.visible = false;
		}

		var bool = true;
		for(var i=0;i<arguments.length; i++){
			if(arguments[i] != 0){
				bool = false;
			}
		}

		if(bool){
			_txt = "亲，您暂无可收获金币！";
			broker.pipTipUIEx.show(_txt, true);
		}else{

			this.show();
		}

	}

	//初始化事件
	_proto_.initEvent = function(){

		// 确认收获
		this.confirmS.on(Laya.Event.CLICK, this, this.confirmFn);

		// 查看别处游戏币
		this.otheYxb.on(Laya.Event.CLICK, this, this.checkOther);

	}

	// 确认收获
	_proto_.confirmFn = function(){

		broker.takeOut();
		audio.play('an_niu');
		this.close();

	}

	//查看别处游戏币
	_proto_.checkOther = function(){

		audio.play('an_niu');

		this.close();

		if(window.GM && GM.whereYxb){
			GM.whereYxb();
		}
	}

	// 显示弹层
	_proto_.show = function(){

		this.popup();

	}

})(shouhuoUI)


// 余额UI
;(function(_super){

	function yuPopUIEx(){

		yuPopUIEx.super(this);

		broker.yuPopUIEx = this;

		this.init();

	}

	Laya.class(yuPopUIEx, "ui.pop.yuPopUIEx", _super);

	var _proto_ = yuPopUIEx.prototype;

	// 共享的余额常量
	_proto_.public = {
		coin: 0
	}

	_proto_.init = function(){
		var _this = this;
		_this.popup = Game.hall.popup;

		//点击充值
		_this.btnRecharge.on(Laya.Event.CLICK, _this, function(){
			audio.play('an_niu');

			_this.chongzhiShow();
			
		});

		//豆哥计算
		_this.coinScore.on(Laya.Event.CLICK, _this, _this.douPopShow);

		_this.yu_coinScore.on(Laya.Event.CLICK, _this, _this.douPopShow);

	}

	// 豆哥弹层
	_proto_.douPopShow = function(){
		if(window.GM && GM.isCall_out === 1 && GM.popBalanceShow_out){
			audio.play('an_niu');

			GM.popBalanceShow_out();
		}
	}

	// 点击重置
	_proto_.chongzhiShow = function(){
		var _this = this;
		_this.popup.recharge.popup();
		_this.popup.recharge.tabbox.selectedIndex=2;
		_this.popup.recharge.textinput.text='100';
	}

	_proto_.yuPopInHall = function(){
		this.x = 24;
		this.y = 172;
		Game.hall.hallUI.addChild(this);
	}

	_proto_.yuPopInRoom = function(){
		this.x = 0;
		this.y = 0;
		this.btnRecharge.visible = false;
		broker.roomUIEx.yu_wrap_box.addChild(this);
	}

	//设置余额 
	_proto_.setCoin = function(coin){
		
		this.public.coin = coin;

		this.coinScore.text = coin;

	}

	// 读取余额
	_proto_.readCoin = function(){

		this.coinScore.text = this.public.coin;
	}


})(yuPopUI)


// 提示UI
;(function(_super){

	function pipTipUIEx(){

		pipTipUIEx.super(this);

		// 中介者
		broker.pipTipUIEx = this;

		this.init();

	}

	Laya.class(pipTipUIEx, "ui.pop.pipTipUIEx", _super);

	var _proto_ = pipTipUIEx.prototype;

	_proto_.init = function(){

		this.initEvent();
	}

	_proto_.initEvent = function(){

		this.otheYxb.on(Laya.Event.CLICK, this, this.checkOther);
	}

	//查看别处游戏币
	_proto_.checkOther = function(){

		audio.play('an_niu');

		this.close();

		if(window.GM && GM.whereYxb){
			GM.whereYxb();
		}
	}

	// 显示弹层
	_proto_.show = function(text, bool){

		this.popup();

		this.txt.text = text;

		// 是否显示查看别处游戏币
		this.otheYxb.visible = bool;

	}



})(pipTipUI)


// 公共提示框 
;(function(_super){

	function comTipUIEx(){

		comTipUIEx.super(this);

		// 中介者
		broker.comTipUIEx = this;

		this.init();

	}

	Laya.class(comTipUIEx, "ui.pop.comTipUIEx", _super);

	var _proto_ = comTipUIEx.prototype;

	_proto_.init = function(){

		this.comfirm_btn = zutil.getElementsByName(this, 'close');
	}

	_proto_.initEvent = function(){
		var _this = this;
		this.comfirm_btn.forEach(function(item, index, arr){
			audio.play('an_niu');

			item.on(Laya.Event.CLICK, _this, _this.clickFn)
		})
	}

	_proto_.clickFn = function(){
		
		// 重新刷新
		location.reload();
	}

	// 显示弹层
	_proto_.show = function(_txt, bool){

		this.txt.text = _txt;
		this.popup();

		if(bool){
			this.initEvent();

		}else{
			Laya.timer.once(2400, this, function(){ this.close() });
		}

	}



})(comTipUI)


// 是否退出提示或复盘
;(function(_super){

	function pop_yesNoUIEx(){

		pop_yesNoUIEx.super(this);

		// 中介者
		broker.pop_yesNoUIEx = this;

		this.init();

	}

	Laya.class(pop_yesNoUIEx, "ui.pop.pop_yesNoUIEx", _super);

	var _proto_ = pop_yesNoUIEx.prototype;

	_proto_.init = function(){

		this.state = 'back';

		this.initEvent();

		this.txtObj = {
			back: '游戏进行中，返回大厅将进入自动 \n托管状态，是否继续？',
			fupan: '您还有进行中的牌局，\n是否回到牌局继续游戏？'
		}

	}

	_proto_.initEvent = function(){
		
		this.no.on(Laya.Event.CLICK, this, this.noFn);

		this.yes.on(Laya.Event.CLICK, this, this.yesFn)

	}

	_proto_.noFn = function(){
		var _state = this.state;
		// 返回 
		if(_state == 'back'){
			

		// 复盘
		}else if(_state == 'fupan'){

			Game.hall.data.hasClickedRoom = false;
		}


		this.close();
	}

	_proto_.yesFn = function(){
		var _state = this.state;

		// 返回 
		if(_state == 'back'){
			// 返回大厅状态
			broker.roomUIEx.isRoomState = false;

			// 拖回大厅
			Game.router.navigate('hall');

		// 复盘
		}else if(_state == 'fupan'){

			// 初始化游戏请求
			broker.initGame();
		}

		this.close();
	}

	// 显示弹层
	_proto_.show = function(state){

		// 修改状态 
		this.state = state;

		this.txt.text = this.txtObj[state]; 

		this.popup();
	}

})(pop_yesNoUI)


// 自定义键盘
;(function(_super){

	function keybordUIEx(parentBox){

		keybordUIEx.super(this);

		this.parentBox = parentBox;

		this.init();

	}

	Laya.class(keybordUIEx, "ui.pop.keybordUIEx", _super);

	var _proto_ = keybordUIEx.prototype;

	_proto_.init = function(){

		// 对应的输入框
		this.input = this.parentBox.textinput;

		this.parentBox.addChild(this);

		this.bottom = 0;
		this.scaleY = 0.7;

		this.visible = false;

		this.eventInit();

	}

	_proto_.eventInit = function(){
		var _this = this;
		for(var i=0; i<10; i++){
			_this.getChildByName('num'+i).on('click', null, function(){
				_this.numberFn(this.text);
			})
		}

		_this.getChildByName('num00').on('click', null, function(){

			_this.numberFn(this.text);
		})

		_this.del.on('click', this, function(){

			var txt = this.input.text;
			if(txt.length == 0){
				return;
			}

			this.input.text = txt.slice(0, txt.length-1);
			this.parentBox.handleTextInputInput();

		})

		_this.sureBtn.on('click', this, function(){

			this.visible = false;
		})

		
	}

	_proto_.numberFn = function(i){
		var txt = this.input.text;
		
		this.input.text = txt + i;

		this.parentBox.handleTextInputInput();
	}



})(keybordUI)

// 充值
;(function(_super){

	function rechargeUIEx(){

		rechargeUIEx.super(this);

		this.init();

	}

	Laya.class(rechargeUIEx, "ui.pop.rechargeUIEx", _super);

	var _proto_ = rechargeUIEx.prototype;

	_proto_.init = function(){

		var Event = laya.events.Event;
		this.defaultText = '请输入大于0的正整数（单位：元）';
		this.amount = ['10', '50', '100', '200'];
		this.currentText = '';

		// 自定义键盘
		this.keyBord = new ui.pop.keybordUIEx(this);
		
		this.textinput.on(Event.CLICK, this, function(){
			this.keyBord.visible = true;
		});

		//充值按钮点击事件
		this.btn_chongzhi.on(Event.CLICK, this, this.mschongzhibtn);

		//tab栏点击事件
		this.tabbox.selectHandler = Laya.Handler.create(this, this.tabboxbtn, null, false);

	}

	_proto_.mschongzhibtn = function(){
		var currentUrl = redirect_uri;
		var pplgameId = gameId;
		var gameName = tradeName;
		var shuoldPay = this.textinput.text;
		var gameplatform = platform;
		if(this.textinput.text>0){

			this.close();

			// 提示页面跳转
			broker.warnPopUIEx.show('正在跳转中...', 5000);

			Laya.timer.once(300, this, function(){

				window.location.href = '/?act=payment&gameId='+pplgameId+'&tradeName='+gameName+'&amount='+shuoldPay+'&platform='+gameplatform+'&redirect_uri='+currentUrl;
			});

		}

		audio.play('an_niu');
	}

	//tab栏选中input框赋值
	_proto_.tabboxbtn = function(index){
		// -1时不做处理
		if(index == -1){
			return;
		}

		var val=this.amount[index];
		this.textinput.text = val;

		audio.play('an_niu');
	}

	

	//input框改变值方法
	_proto_.handleTextInputInput = function(){
		var val = (this.textinput.text).trim();
		val = val.replace(/[^\d]/g, '');
		for (var i = 0, len = this.amount.length; i < len; i++) {
			if (val === this.amount[i]) {
				this.tabbox.selectedIndex = i;
				break;
			}
			else{
				this.tabbox.selectedIndex = -1;
			}
		}
		if(val.length>8){
			val = val.slice(0, 8);
		}
		this.textinput.text = val;
	}

})(rechargeUI)


// 简易提示层
;(function(_super){

	function warnPopUIEx(){

		warnPopUIEx.super(this);

		this.init();

	}

	Laya.class(warnPopUIEx, "ui.pop.warnPopUIEx", _super);

	var _proto_ = warnPopUIEx.prototype;

	_proto_.init = function(){

		this.WIDTH = this.width;
		this.HEIGHT = this.height;

		this.reset();

		Laya.stage.addChild(this);
	}

	// 重置
	_proto_.reset = function(){
		this.visible = false;
		this.content.text = '';

		this.content_box.scaleX = 0;
		this.content_box.scaleY = 0;

	}

	// 弹层出现(是否自动折行)
	_proto_.show = function(txt, showingTime){
		var showingTime = showingTime || 2000;
		var _txt = txt;
		this.visible = true;

		/*// 判断提示文本的折行处
		if(_txt.length >15){
			_txt = _txt.slice(0, 15) + '\n' + _txt.slice(15);

			showingTime = 3000;
		}*/
		this.content.text = _txt;
		var _x = (Laya.stage.width - this.WIDTH)/2;
		var _y = (Laya.stage.height - this.HEIGHT)/2;

		this.pos(_x, _y);

		Laya.Tween.to(this.content_box, {scaleX: 1, scaleY: 1}, 300, Laya.Ease.backOut);

		//过两秒自动消失
		Laya.timer.once(showingTime, this, this.hide);

	}

	_proto_.hide = function(){
		
		Laya.Tween.to(this.content_box, {scaleX: 0, scaleY: 0}, 300, Laya.Ease.backIn, Laya.Handler.create(this, this.reset));
	}

})(warnPopUI)


// 新手引导流程
;(function(_super){

	function newPlayerUIEx(){

		newPlayerUIEx.super(this);

		this.init();

	}

	Laya.class(newPlayerUIEx, "ui.pop.newPlayerUIEx", _super);

	var _proto_ = newPlayerUIEx.prototype;

	_proto_.init = function(){

		this.step = 0;

		// this.btn_nextArr = zutil.getElementsByName(this, 'btn_next');

		this.initEvent();
	}

	// 事件初始化
	_proto_.initEvent = function(){

		this.on(Laya.Event.CLICK, this, function(event){

			this.nextFn();
		})

		// 直接跳过引导
		this.btn_jump.on(Laya.Event.CLICK, this, function(){

			//发送请求（再也不触发新手引导）
			broker.setNewUserStats();

			this.close();

		})

		

	}

	// 弹层出现
	_proto_.show = function(){
		
		this.popup();

		this.nextFn();
	}

	_proto_.nextFn = function(){

		audio.play('an_niu');
		
		this.step++;

		if(this.step == 10){

			this.step = 0;
			this.close();
			this.btn_jump.visible = true;

			//发送请求（再也不触发新手引导）
			broker.setNewUserStats();

			return;
		}
		for(var i=1; i<10; i++){
			this['step' + i].visible = false;
		}

		if(this.step == 9){
			this.btn_jump.visible = false;
		}

		this['step' + this.step].visible = true;
			
	}
})(newPlayerUI)

