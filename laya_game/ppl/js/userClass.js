
//用户的类
var UserPlay = (function(){
	function UserPlay(box){

		this.user_box = box;

		// 是否在房间内
		this.isInRoom = false;

		//头像
		this.head_img = box.getChildByName('head_img');
		//用户名
		this.user_name = box.getChildByName('user_name');
		//总钱数
		this.total_money = box.getChildByName('total_money');
		// 边框图片
		this.border_time = box.getChildByName('border_time');

		//聊天内容
		this.chat_box = box.getChildByName('chat_box');
		this.chat_content = this.chat_box.getChildByName('chat_content');
		this.chat_originY = this.chat_box.y + 20;

		//表情内容
		this.chat_boxFace = box.getChildByName('chat_boxFace');
		this.chat_face = this.chat_boxFace.getChildByName('chat_content');
		this.chat_faceY = this.chat_boxFace.y + 20;

		//初始化
		this.init();

	}

	var _proto_ = UserPlay.prototype;


	//初始化
	_proto_.init = function(){

		//记录box的初始位置
		this.origin_pos = {
			x: this.user_box.x,
			y: this.user_box.y
		}
		// 聊天内容
		this.chat_box.visible = false;

		// 表情内容
		this.chat_boxFace.visible = false;

		//在场外预备的x坐标
		this.pre_posX = this.origin_pos.x - 230;

		//初始位置到场外
		this.user_box.x = this.pre_posX;

		this.hide();

		// 倒计时蒙层
		this.createSp();

		// 重置倒计时
		this.timeEnd();

	}

	// 新建倒计时蒙层
	_proto_.createSp = function(){
		// 倒计时蒙层
		this.sp = new Laya.Sprite();
		this.sp.alpha = 0.7;
		this.sp.scaleX = 0.88;
		this.sp.scaleY = 0.93;

		this.user_box.addChild(this.sp);

		// 边框时间
		this.borderMask = new Laya.Sprite();
		this.jiaodu = -90;

	}

	// 重置倒计时的各变量
	_proto_.timeEnd = function(){

		// 初始化各计时
		this.upW = 0;		//上 宽
		this.rightH = 0;	//右 高
		this.downW = 0;		//下 宽
		this.leftH = 0;		//左 高
		this.upW2 = 0;		//上 宽2
		Laya.timer.clear(this, this.timeLoop);
		this.sp.graphics.clear();

		this.jiaodu = -90;
		this.borderMask.graphics.clear();
		this.border_time.visible = false;
	}

	_proto_.timeStart = function(){

		Laya.timer.loop(35, this, this.timeLoop);

	}

	// 倒计时开始
	_proto_.timeLoop = function(){

		// 边框倒计时
		this.border_time.visible = true;
		this.jiaodu++;
		this.borderMask.graphics.clear();
		this.borderMask.graphics.drawPie(60, 90, 200, -90, this.jiaodu, "#000000");
		this.border_time.mask = this.borderMask;

		if(this.jiaodu >= 270){

			Laya.timer.clear(this, this.timeLoop);
		}
	}

	//离场动画
	_proto_.hideOutAnimate = function(){
		
		Laya.Tween.clearAll(this.user_box);
		Laya.Tween.to(this.user_box, {x: this.pre_posX}, 500, Laya.Ease.backIn, Laya.Handler.create(this, this.hide), 100);
		
	}
	// 离场后的回调
	_proto_.hide = function(){
		this.user_box.visible = false;
	}

	// 渲染用户信息
	_proto_.renderUserInfo = function(obj){

		var _name = obj.uName || '我';
		var _coin = obj.chips || '0';

		broker.player[_name] = broker.player[_name] || broker.getDefault_head();

		this.setHeadImg(broker.player[_name]);
		this.setUserName(_name);
		this.setTotalMoney(_coin);

		//入场动画
		this.showInAnimate();
		this.isInRoom = true;

	}

	//入场动画
	_proto_.showInAnimate = function(){

		// 先清除缓动
		Laya.Tween.clearAll(this.user_box);
		this.user_box.visible = true;
		//牌入场动画 
		Laya.Tween.to(this.user_box, {x: this.origin_pos.x}, 700, Laya.Ease.backOut, Laya.Handler.create(this, this.showInAnimateCallBack), 100);
	}

	// 设置用户头像
	_proto_.setHeadImg = function(_url){
		this.head_img.skin = _url;
	}
	// 设置用户名
	_proto_.setUserName = function(name){
		var _name = zutil.getActiveStr(name, 8);
		this.user_name.text = _name;
	}
	// 设置用户总金额
	_proto_.setTotalMoney = function(coin){
		this.total_money.text = coin;
	}
	// 渲染聊天内容
	_proto_.renderChat = function(txt){
		this.chat_content.text = txt;
		this.chat_content.visible = true;
		this.chat_box.alpha = 1;
		this.chat_box.visible = true;
		this.chat_box.y = this.chat_originY;

		Laya.Tween.to(this.chat_box, {y: this.chat_originY - 20}, 300, Laya.Ease.linearIn, Laya.Handler.create(this, this.renderChatCB));

	}
	// 渲染表情
	_proto_.renderFace = function(_url){
		this.chat_face.skin = _url;
		this.chat_face.visible = true;
		this.chat_boxFace.alpha = 1;
		this.chat_boxFace.visible = true;
		this.chat_boxFace.y = this.chat_faceY;

		Laya.Tween.to(this.chat_boxFace, {y: this.chat_faceY - 20}, 300, Laya.Ease.linearIn, Laya.Handler.create(this, this.renderFaceCB));

	}

	// 聊天的渐渐消失
	_proto_.renderChatCB = function(){
		Laya.Tween.to(this.chat_box, {y: this.chat_originY, alpha:0}, 300, Laya.Ease.linearIn, Laya.Handler.create(this, this.lastChatCB), 2000);
	}

	// 聊天回调消失
	_proto_.lastChatCB = function(){
		this.chat_box.visible = false;
	}

	//表情的消失
	_proto_.renderFaceCB = function(){
		Laya.Tween.to(this.chat_boxFace, {y: this.chat_originY, alpha:0}, 300, Laya.Ease.linearIn, Laya.Handler.create(this, this.lastFaceCB), 2000);

	}

	// 表情回调消失
	_proto_.lastFaceCB = function(){
		this.chat_boxFace.visible = false;
	}

	// 更新余额
	_proto_.resetTotalMoney = function(score){
		var now = parseInt(this.total_money.text);

		this.total_money.text = now + score;

	}

	// 重置
	_proto_.reset = function(){

		//离场动画
		this.hideOutAnimate();
		this.isInRoom = false;

		this.timeEnd();

	}


	return UserPlay;

})()


// dan_li类
var BaseResult = (function(){
	function BaseResult(danLiBox){
		var _this = this;

		//单列box
		_this.result_dan_li = danLiBox;

		_this.init();
	}

	var _proto_ = BaseResult.prototype;

	_proto_.init = function(){

		this.initDom();

		// 单列胜的初始坐标
		this.sheng_origin_y = this.dan_li_sheng.y;

		// 分数合并的x坐标
		this.ORIGIN_X = 110;

		// box的初始x坐标
		this.result_dan_li_x = this.result_dan_li.x;


		this.reset();
	}

	//初始化dom
	_proto_.initDom = function(){
		var _this = this;

		//单列得分
		_this.line_score = _this.result_dan_li.getChildByName('line_score');
		//单列牌型
		_this.pai_xin = _this.result_dan_li.getChildByName('pai_xin');
		//单列小高光
		_this.small_light = _this.result_dan_li.getChildByName('small_light');
		//单列胜+1
		_this.dan_li_sheng = _this.result_dan_li.getChildByName('dan_li_sheng');

	}

	//重置
	_proto_.reset = function(){

		this.result_dan_li.visible = false;

		//单列胜消失且初始位置
		this.dan_li_sheng.y = this.sheng_origin_y;
		this.dan_li_sheng.visible = false;

		this.small_light.visible = false;
		
		//位置初始化
		this.result_dan_li.x = this.result_dan_li_x;

	}
	//渲染牌型和得分
	_proto_.renderPaiXinScore = function(paixin, isWin){
		//牌型为杂花235
		var _info = this.paixin_to_score(paixin);

		this.pai_xin.font = _info.font;
		this.pai_xin.text = _info.paixin;
		this.line_score.text = _info.score;

		this.result_dan_li.visible = true;

		//是否显示单列胜
		if(isWin){
			this.isWinRender();
		}

	}
	//给定牌型_指定得分和牌型
	_proto_.paixin_to_score = function(paixin){
		var _paixin = 0;
		var _score = '+0';
		var _font = 'chinese';
		switch (Number(paixin)){
			case 1:
				_paixin = '高牌';
				_score = '+0';
				break;
			case 2:
				_paixin = '对子';
				_score = '+2';
				break;
			case 3:
				_paixin = '顺子';
				_score = '+4';
				break;
			case 4:
				_paixin = '同花';
				_score = '+6';
				break;
			case 5:
				_paixin = '同花顺';
				_score = '+10';
				break;
			case 6:
				_paixin = '三条';
				_score = '+15';
				break;
			case 7:
				_paixin = '235' ;	//杂花235
				_score = '+15';
				_font = 'smallNum';
				break;
		}

		return {
			paixin: _paixin,
			score: _score,
			font: _font
		}
		
	}

	//是否显示单列胜
	_proto_.isWinRender = function(){
		this.dan_li_sheng.visible = true;

		//单列胜上移动画
		var _y = this.sheng_origin_y>0? -40 : 40;

		Laya.Tween.to(this.dan_li_sheng, {y: this.sheng_origin_y + _y}, 200, Laya.Ease.linearIn, Laya.Handler.create(this, this.isWinRenderCallBack), 300);

	}
	//单列胜动画的回调
	_proto_.isWinRenderCallBack = function(){
		this.small_light.visible = true;
		this.dan_li_sheng.visible = false;

		//延迟一会儿消失的高光
		Laya.timer.once(100, this, this.danLiShengAdd, null, true);

	}
	//单列胜动画的回调
	_proto_.danLiShengAdd = function(){
		this.small_light.visible = false;

		var _t = +this.line_score.text.slice(1);
		this.line_score.text = '+' + (_t+1);

	}

	//运动到中间的动画
	_proto_.animateToCenter = function(){

		Laya.Tween.to(this.result_dan_li, {x: this.ORIGIN_X}, 200, Laya.Ease.circIn, Laya.Handler.create(this, this.animateToCenterCB));
	}
	//运动到中间的动画
	_proto_.animateToCenterCB = function(){
		this.reset();

		this.super.showTotalScore();
	}


	return BaseResult

})()


//比对结果类
var ResultGame = (function(){

	function ResultGame(bg, resultWrap, result_mask){

		this.resultWrap = resultWrap;

		this.bg = bg;

		// 半透明大背景
		this.result_mask = result_mask;

		this.init();
	}

	var _proto_ = ResultGame.prototype;


	_proto_.init = function(){


		//对比的背景
		this.contrast_light = this.resultWrap.getChildByName('contrast_light');

		//对比高光
		this.contrast_bg = this.bg;

		// 单列平局的平容器
		this.ping_box = this.resultWrap.getChildByName('ping_box');

		// 全胜
		this.quanWin_box = this.resultWrap.getChildByName('quanWin_box');

		// 完美的摆拍
		this.perfect_box = this.resultWrap.getChildByName('perfect_box');


		//节点初始化
		this.initDom();

		this.configInfo();

		this.reset();

		// 全胜重置
		this.qsReset();

		// 完美摆拍重置
		this.perfectReset();
		
	}

	// 初始化配置参数
	_proto_.configInfo = function(){
		var _bg = this.contrast_bg;
		var _light = this.contrast_light;

		var BG_WIDTH = _bg.width;	//初始化背景的宽(以此为位移基数)
		var BG_X = _bg.x;
		var LIGHT_X = _light.x-4;
		var LIGHT_Y = _light.y;

		this.config = {};

		//变化的位置
		this.config.bg_posX = [BG_X, BG_X+BG_WIDTH, BG_X+BG_WIDTH*2];
		this.config.light_posX = [LIGHT_X, LIGHT_X+BG_WIDTH, LIGHT_X+BG_WIDTH*2];
		this.config.light_posY = [LIGHT_Y, LIGHT_Y+310, LIGHT_Y+2000];

		//比对的步骤
		this.STEP = 0;

		//初始化对比的输赢情况
		this.contrastArray = [];

		// 以防全胜&完美同时存在
		this.qs_or_perfect = false;

	}

	//重置
	_proto_.reset = function(){

		var _bg = this.contrast_bg;
		var _light = this.contrast_light;

		_bg.visible = false;
		_bg.x = this.config.bg_posX[0];

		_light.visible = false;
		_light.autoPlay = false;
		_light.pos(this.config.light_posX[0], this.config.light_posY[0]);

		this.STEP = 0;

		//初始化对比的输赢情况
		this.contrastArray = [];

		//对方结果高光和总分数
		this.opposite_big_light.visible = false;
		this.opposite_current_total.visible = false;
		this.opposite_current_total_y = this.opposite_current_total.y;

		//我方结果高光和总分数
		this.mine_big_light.visible = false;
		this.mine_current_total.visible = false;

		this.result_mask.visible = false;

		// 平字全部隐藏
		this.ping_box_arr.forEach(function(item, index, arr){
			item.visible = false;
		})

	}

	//节点初始化
	_proto_.initDom = function(){
		var _this = this;
		//对方区域结果
		_this.opposite_result_arr = [];
		//我方区域结果
		_this.mine_result_arr = [];

		//对手结果
		var opposite_box = _this.resultWrap.getChildByName('opposite_score_box');
		var opposite_result = zutil.getElementsByName(opposite_box, 'result_dan_li');
		_this.opposite_big_light = opposite_box.getChildByName('big_light');
		_this.opposite_current_total = opposite_box.getChildByName('current_total');

		opposite_result.forEach(function(item, index, arr){
			var _oopResult = new BaseResult(item);
			_oopResult.super = _this;
			_this.opposite_result_arr.push(_oopResult);
		})

		//我方结果
		var mine_box = _this.resultWrap.getChildByName('mine_score_box');
		var mine_result = zutil.getElementsByName(mine_box, 'result_dan_li');
		_this.mine_big_light = mine_box.getChildByName('big_light');
		_this.mine_current_total = mine_box.getChildByName('current_total');

		mine_result.forEach(function(item, index, arr){
			var _mineResult = new BaseResult(item);
			_mineResult.super = _this;
			_this.mine_result_arr.push(_mineResult);
		})

		// 该行平局的平字
		this.ping_box_arr = zutil.getElementsByName(this.ping_box, 'ping_icon');

		// 全胜里面的 光效 & 全胜+3
		this.qs_light = this.quanWin_box.getChildByName('light');
		this.quansheng1 = this.quanWin_box.getChildByName('quansheng1');
		this.quansheng2 = this.quanWin_box.getChildByName('quansheng2');

		// 完美的摆拍  背景光 & 完美摆拍字样
		this.perfect_bg = this.perfect_box.getChildByName('perfect_bg');
		this.perfect_txt = this.perfect_box.getChildByName('perfect_txt');
		
	}

	//对比流程开始
	/*
	 *	参数：对方结果，我方结果，双方该行谁赢，对方总得分，我方总得分
	 *
	*/
	_proto_.startContrast = function(resultArr0, resultArr1, witchArr, score0, score1){

		//重置全胜完美同时出现
		this.qs_or_perfect = false;

		//半透明背景
		this.result_mask.visible = true;
		//对方结果数组
		this.resultArray0 = resultArr0;
		// 我方结果数组
		this.resultArray1 = resultArr1;

		//对方总分
		this.opposite_total_score = score0;
		// 我方总分
		this.mine_total_score = score1;

		//初始化对比的输赢情况
		this.contrastArray = witchArr;

		//背景的位移动画(首先执行一次再循环执行)
		this.bgAnimate();
		Laya.timer.loop(1500, this, this.bgAnimate);

	}
	//背景的位移动画
	_proto_.bgAnimate = function(){

		var _bg = this.contrast_bg;
		var _light = this.contrast_light;
		var _y = 0;												//帧动画高光的y坐标
		var _which = this.contrastArray[this.STEP];				//该行谁赢还是平
		var _opp = false;										//该行对手赢or输
		var _mine = false;										//该行自己赢or输

		_bg.visible = true;
		_light.visible = true;
		_light.autoPlay = true;

		if(this.STEP===3){
			Laya.timer.clear(this, this.bgAnimate);
			
			this.endContrast();

			return;
		}
		// 单列声音
		audio.play('dan_li');

		// 外加考虑一种平局的情况
		switch (_which){
			case 0: 

				_y = this.config.light_posY[0];
				_opp = true;
				_mine= false;
				break;
			case 1: 

				_y = this.config.light_posY[1];
				_opp = false;
				_mine= true;

				break;
			case -1: 
				// 跑到舞台外
				_y = this.config.light_posY[2];

				// 显示该行平局
				this.ping_box_arr[this.STEP].visible = true;

				_opp = false;
				_mine= false;

				break;

		}
		// 输赢高光与背景
		_light.y = _y ;
		_light.x = this.config.light_posX[this.STEP];
		_bg.x = this.config.bg_posX[this.STEP];

		//双方该行分数的比拼显示
		this.opposite_result_arr[this.STEP].renderPaiXinScore(this.resultArray0[this.STEP], _opp);
		this.mine_result_arr[this.STEP].renderPaiXinScore(this.resultArray1[this.STEP],  _mine);

		this.STEP++;
	}

	// 全胜的特效
	_proto_.quanshengShow = function(){

		audio.play('perfect');

		this.quanWin_box.visible = true;
		// 背景光旋转
		this.qs_light.rotation = 0;
		Laya.Tween.to(this.qs_light, {rotation: 60}, 2000, Laya.Ease.linearIn);
		// 文字2
		Laya.Tween.to(this.quansheng2, {scaleX: 1, scaleY: 1}, 300, Laya.Ease.circIn, Laya.Handler.create(this, this.changeBigqs2));
	}

	// 全胜2变大至消失
	_proto_.changeBigqs2 = function(){
		this.quansheng1.visible = true;

		Laya.Tween.to(this.quansheng2, {scaleX: 1.3, scaleY: 1.3, alpha:0.5}, 100, Laya.Ease.circIn, Laya.Handler.create(this, this.zhengdong2), 100);
	}
	// 全胜2震动
	_proto_.zhengdong2 = function(){

		Laya.Tween.to(this.quansheng2, {scaleX: 1, scaleY: 1, alpha: 1}, 100, Laya.Ease.circIn, Laya.Handler.create(this, this.quanshengCB));
	}
	
	// 全胜动画的回调
	_proto_.quanshengCB = function(){

		Laya.timer.once(1400, this, function(){

			// 进行重置
			this.qsReset();

			// 然后接着执行对比结束
			this.animateToCenter();
		});

	}

	// 全胜的重置
	_proto_.qsReset = function(){

		// 全胜
		this.quanWin_box.visible = false;

		this.quansheng1.visible = false;

		this.quansheng2.alpha = 1;
		this.quansheng2.scaleX = 6;
		this.quansheng2.scaleY = 6;
	}

	// 完美摆拍特效
	_proto_.perfectShow = function(){

		this.perfect_box.visible = true;

		// 背景光旋转
		this.perfect_bg.rotation = 0;
		Laya.Tween.to(this.perfect_bg, {rotation: 90}, 2000, Laya.Ease.linearIn);

		Laya.Tween.to(this.perfect_txt, {scaleX: 1, scaleY: 1}, 300, Laya.Ease.circIn, Laya.Handler.create(this, this.perfectChange));

	}

	// 变大变小的震动
	_proto_.perfectChange = function(){

		Laya.Tween.to(this.perfect_txt, {scaleX: 1.3, scaleY: 1.3, alpha:0.5}, 100, Laya.Ease.circIn, Laya.Handler.create(this, this.perfectChange2), 100);

	}

	_proto_.perfectChange2 = function(){

		Laya.Tween.to(this.perfect_txt, {scaleX: 1, scaleY: 1, alpha:1}, 100, Laya.Ease.circIn, Laya.Handler.create(this, this.perfectChangeCB));

	}

	_proto_.perfectChangeCB = function(){

		Laya.timer.once(1400, this, function(){

			// 进行重置
			this.perfectReset();

			// 避免同时有全胜，完美摆拍而触发两次合并分数
			if(!this.qs_or_perfect){

				// 然后接着执行对比结束
				this.animateToCenter();
			}

			
		});	
	}

	// 完美摆拍重置
	_proto_.perfectReset = function(){

		this.perfect_box.visible = false;

		this.perfect_txt.scaleX = 3;
		this.perfect_txt.scaleY = 3;

	}

	//对比结束
	_proto_.endContrast = function(){
		var isAllWin = false;								//自己是否是全胜
		var defen = Game.hall.player.defen >= 25;				

		isAllWin = this.contrastArray.every(function(item, index){
			return item == 1;
		})

		// 各自得分合并运动到中间动画（在该处进行是否进行全胜动画）
		if(isAllWin || defen ){
			if(isAllWin){
				this.qs_or_perfect = true;
				this.quanshengShow();
			}

			if(defen){
				this.perfectShow();
			}
		}else{

			this.animateToCenter();
		}

		this.reset();

	}
	//各自得分合并运动到中间动画
	_proto_.animateToCenter = function(){

		audio.play('xia_jiang');

		this.opposite_result_arr.forEach(function(item, index, arr){
			item.animateToCenter();
		})

		this.mine_result_arr.forEach(function(item, index, arr){
			item.animateToCenter();
		})

	}
	//显示各自总得分
	_proto_.showTotalScore = function(){
		if(this.isPerForm){
			return;
		}
		this.isPerForm = true;

		this.result_mask.visible = false;
		this.opposite_big_light.visible = true;
		this.opposite_current_total.visible = true;
		this.opposite_current_total.text = '+' + this.opposite_total_score;

		this.mine_big_light.visible = true;
		this.mine_current_total.visible = true;
		this.mine_current_total.text = '+' + this.mine_total_score;

		//延迟一会儿消失的高光
		Laya.timer.once(100, this, this.bigLightCallBack, null, true);

	}

	// 高光消失的回调
	_proto_.bigLightCallBack = function(){
		this.opposite_big_light.visible = false;
		this.mine_big_light.visible = false;

		//对方总分下移到我方总分动画
		Laya.Tween.to(this.opposite_current_total, {y: this.opposite_current_total_y+835}, 300, Laya.Ease.circIn, Laya.Handler.create(this, this.oppositeDownCB), 300);

	}
	_proto_.oppositeDownCB = function(){
		this.mine_big_light.visible = true;
		this.opposite_current_total.y = 0;
		this.opposite_current_total.visible = false;
		//延迟一会儿消失的高光
		Laya.timer.once(200, this, this.lastResultCB, null, true);
	}

	_proto_.lastResultCB = function(){

		//高光慢慢消失
		Laya.Tween.to(this.mine_big_light, {alpha: 0}, 50, Laya.Ease.circIn);

		var _lastRestult = this.mine_total_score - this.opposite_total_score;
		this.mine_current_total.text = _lastRestult>0? ('+' + _lastRestult) : _lastRestult;

		Laya.timer.once(500, this, this.showResultPup, null, true);
	}

	//显示结果弹层（终结）
	_proto_.showResultPup = function(){

		// 此刻返回按钮出现
		// broker.moreUIEx.isGameIng(false);

		this.isPerForm = false;

		this.mine_current_total.visible = false;
		this.mine_big_light.visible = false;
		this.mine_big_light.alpha = 1;

		// 结果弹层 (判断是否还在房间)
		if(Game.RoomWrap.visible){

			broker.resultPopUIEx.showResult(Game.hall.player);
		}

		// 重置桌面上的所有牌( 是否有对方玩家)
		var isOpp = broker.roomUIEx.opposite_user.isInRoom;
		broker.roomUIEx.resetAllAreaPai(isOpp);
	}



	return ResultGame;

})()
