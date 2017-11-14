//结果弹层
;(function(_super){

	function resultPopUIEx(){

		resultPopUIEx.super(this);

		broker.resultPopUIEx = this;
		
		this.init();
	}

	Laya.class(resultPopUIEx, 'ui.room.resultPopUIEx', _super);

	var _proto_ = resultPopUIEx.prototype;

	//初始化
	_proto_.init = function(){

		this.initDom();

		this.addMask();

		this.initEvent();

		this.reset();

	}
	//重置
	_proto_.reset = function(){
		this.btn_huanZhuo.scaleX = 0;
		this.btn_huanZhuo.scaleY = 0;
		this.btn_goon.scaleX = 0;
		this.btn_goon.scaleY = 0;

		//光效
		this.result_bg.skin = '';
		this.result_bg.scaleX = 1;
		this.result_bg.scaleY = 1;

		this.win_or_lose.skin = '';
		// 做动画的box
		this.animate_box.scaleX = 4;
		this.animate_box.scaleY = 4;

		// 平or输
		this.lose_ping.visible = false;
		this.lose_text.visible = false;
		this.ping_text.visible = false;

		//得分和筹码值移出mask之外
		this.deFen.x = -150;
		this.chouMa.x = -150;

		this.fuwufei.index = -1;
		this.fuwufei_num.text = '';

		this.cound_down.stop();
		this.cound_down.index = 0;

		this.isShow = false;

	}

	_proto_.initDom = function(){

		//三个按钮
		this.btn_goon = this.btn_list.getChildByName('btn_goon');
		this.btn_huanZhuo = this.btn_list.getChildByName('btn_huan_zhuo');
		this.btn_back = this.btn_list.getChildByName('btn_back');

		//得分和筹码的box
		this.score_box = this.defen_chouma_box.getChildByName('score_box');
		//得分
		this.deFen = this.score_box.getChildByName('deFen');
		//筹码
		this.chouMa = this.score_box.getChildByName('chouMa');

		//服务费
		this.fuwufei_num = this.defen_chouma_box.getChildByName('fuwufei_num');

		// 服务费文字
		this.fuwufei = this.defen_chouma_box.getChildByName('fuwufei');

		// 倒计时
		this.cound_down = this.btn_goon.getChildByName('cound_down');


	}
	//添加遮罩
	_proto_.addMask = function(){
		this.score_box.mask = new Laya.Sprite();
		this.score_box.mask.graphics.clear();
		this.score_box.mask.graphics.drawRect(0, 0, 400, 200, '#000000');

	}

	//初始化绑定事件
	_proto_.initEvent = function(){

		// 退出按钮
		this.btn_back.on(Laya.Event.CLICK, this, this.quit);

		// 继续按钮
		this.btn_goon.on(Laya.Event.CLICK, this, this.myGoOn);

		// 换桌
		this.btn_huanZhuo.on(Laya.Event.CLICK, this, this.myHuanZhuo);

		// 倒计时添加事件
		this.cound_down.on('change', this, this.coundDownFn);

	}

	// 确保只播放一次
	_proto_.coundDownFn = function(){
		if (this.cound_down.index == 4) {
			this.cound_down.stop();
		};
	}

	//游戏结果
	_proto_.showResult = function(player){
		var defen = player.defen;
		var chouma = player.chouma;
		var choushui = player.choushui;
		var ticket = player.ticket;

		this.isShow = true;

		var _isAdd = defen>0? true : false;

		//背景皮肤
		this.result_bg.skin = _isAdd? 'images/room/light_money.png' : '';

		if(_isAdd){
			audio.play('win');

			this.lose_ping.visible = false;
			this.fuwufei.index = 1;
			this.win_or_lose.skin = 'images/room/win_icon.png';
		}else if(defen == 0){
			audio.play('ping');

			this.fuwufei.index = 0;
			this.lose_ping.visible = true;
			this.ping_text.visible = true;
			this.win_or_lose.skin = 'images/room/lose_icon.png';
		}else{
			audio.play('shu');

			this.fuwufei.index = 0;
			this.lose_ping.visible = true;
			this.lose_text.visible = true;
			this.win_or_lose.skin = 'images/room/lose_icon.png';
		}

		if(_isAdd){
			this.deFen.font = 'bigNum';
			this.deFen.text = '+' + defen;
			this.chouMa.font = 'bigNum';
			this.chouMa.text = '+' + chouma;
			this.fuwufei_num.font = 'smallNum';
		}else{
			this.deFen.font = 'loseNum';
			this.deFen.text = defen;
			this.chouMa.font = 'loseNum';
			this.chouMa.text = chouma;
			this.fuwufei_num.font = 'smallLose';
		}

		// 抽水(为0时是数字可能0出不来)
		this.fuwufei_num.text = choushui+'';

		// 抽水开关是否是开着的
		if(ticket == 0){
			this.fuwufei.index = -1;
			this.fuwufei_num.text = '';
		}

		//小人出现动画
		Laya.Tween.to(this.animate_box, {scaleX: 1, scaleY:1}, 400, Laya.Ease.circIn, Laya.Handler.create(this, this.deFenChouMaShow));

		//光线变大动画
		if(_isAdd){
			Laya.Tween.to(this.result_bg, {scaleX: 1.14, scaleY: 1.14}, 3500, Laya.Ease.lineIn, null);
		}


		this.popup();
	}
	//得分和筹码出现动画
	_proto_.deFenChouMaShow = function(){

		Laya.Tween.to(this.deFen, {x: 0}, 300, Laya.Ease.backOut);
		Laya.Tween.to(this.chouMa, {x: 0}, 300, Laya.Ease.backOut, Laya.Handler.create(this, this.btnChangeBig), 200);
	}

	//按钮放大动画
	_proto_.btnChangeBig = function(){
		Laya.Tween.to(this.btn_huanZhuo, {scaleX: 1, scaleY:1}, 500, Laya.Ease.backOut, null, 200);
		Laya.Tween.to(this.btn_goon, {scaleX: 1, scaleY:1}, 500, Laya.Ease.backOut, Laya.Handler.create(this, this.showResultCB), 200);

	}
	// 开启倒计时
	_proto_.showResultCB = function(){

		this.cound_down.play();
		
	}

	_proto_.myClose = function(){

		this.close();
		this.reset();
	}

	//  退出
	_proto_.quit = function(){

		audio.play('an_niu');

		broker.quit();
		this.myClose();
	}

	// 再来一局
	_proto_.myGoOn = function(){

		audio.play('an_niu');

		this.myClose();

		// 发送继续的请求
		broker.continueFn();

		// 更新公共区域内的提示信息( 对方是否在房间内)
		if(broker.roomUIEx.opposite_user.isInRoom){
			broker.roomUIEx.public_EX.resetPublic(true);
		}
	}

	// 换桌
	_proto_.myHuanZhuo = function(){

		audio.play('an_niu');

		this.myClose();

		broker.changeTable();
		
	}



})(resultPopUI); 

//更多按钮
;(function(_super, broker){

	var broker = broker;
	function moreUIEx(){

		moreUIEx.super(this);

		
		this.init();
	}

	Laya.class(moreUIEx, 'ui.room.moreUIEx', _super);

	var _proto_ = moreUIEx.prototype;

	//初始化
	_proto_.init = function(){

		//供外界访问
		broker.moreUIEx = this;

		
		// 在场内的位置
		this.showPos = {
			x: 10,
			y: 90
		}
		// 场外的位置
		this.hidePos = {
			x: -300,
			y: 90
		}

		this.pos(this.showPos.x, this.showPos.y);

		this.reset();

		this.initEvent();

	}
	//重置
	_proto_.reset = function(){
		//是否显示
		this.isShow = false;

		this.back_paixin_box.pos(this.hidePos.x, 0);

		this.paixin_img.pos(this.hidePos.x, 0);

		// 初始不可见
		this.visible = false;

	}

	_proto_.initEvent = function(){

		//返回按钮
		this.btn_back.on(Laya.Event.CLICK, this, this.backFn);

		//牌型按钮
		this.btn_paixin.on(Laya.Event.CLICK, this, function(){
			audio.play('an_niu');
			
			this.hideBoxInRoom();
		})
	}

	_proto_.show = function(){
		if(this.isShow){
			this.reset();
			return;
		}
		this.isShow = true;
		this.visible = true;

		// box进来
		this.showBoxInRoom();
	}

	_proto_.backFn = function(){

		audio.play('an_niu');

		// 退出房间请求
		broker.quit();

		this.reset();
	}

	// box进场动画
	_proto_.showBoxInRoom = function(){
		// 牌型图隐藏
		this.paixin_img.visible = false;
		this.back_paixin_box.visible = true;
		Laya.Tween.to(this.back_paixin_box, {x: 0}, 300, Laya.Ease.circOut);
	}

	// box离场动画
	_proto_.hideBoxInRoom = function(){

		Laya.Tween.to(this.back_paixin_box, {x: this.hidePos.x}, 300, Laya.Ease.circIn, Laya.Handler.create(this, this.showImgInRoom));
	}
	// 牌型图进场动画
	_proto_.showImgInRoom = function(){
		this.paixin_img.visible = true;
		this.back_paixin_box.visible = false;
		Laya.Tween.to(this.paixin_img, {x: 0}, 300, Laya.Ease.circOut);
	}

	// 已经开局
	_proto_.isGameIng = function(bool){

		if(bool){

			this.btn_back.visible = false;

			this.btn_paixin.pos(22, 16);

			this.big_bg.skin = 'images/room/pop_small_bg2.png';

		}else{

			this.btn_back.visible = true;

			this.btn_paixin.pos(22, 112);

			this.big_bg.skin = 'images/room/pop_small_bg.png';

		}

	}

})(moreUI, broker);

// 托管
var tuoguanUIEx = (function(){

	function tuoguanUIEx(box){

		this.box = box;

		this.init();
	}

	var _proto_ = tuoguanUIEx.prototype;

	//初始化
	_proto_.init = function(){

		// 是否可以发送托管
		this.isSendTG = false;

		// 放置于页面底部
		this.box.y = 1000;

		this.tg = this.box.getChildByName('tg');
		// 添加点击消失事件
		this.tg.on(Laya.Event.CLICK, this, this.removeTuoGuan);

		this.image_box = this.box.getChildByName('image_box');
		
		// 托管中图片
		this.tuoguan_img = this.image_box.getChildByName('tuoguan_img');
		// 点点点
		this.diandian = this.image_box.getChildByName('diandian');

		this.hide();

	}

	_proto_.show = function(){
		this.box.visible = true;

		this.diandian.autoPlay = true;
	}

	_proto_.hide = function(){
		this.isSendTG = false;

		this.box.visible = false;

		this.diandian.autoPlay = false;
	}

	_proto_.removeTuoGuan = function(){

		if(this.isSendTG){
			return;
		}
		this.isSendTG = true;

		// 发送取消托管请求
		broker.tuoGuan();
	}


	return tuoguanUIEx;

})();
