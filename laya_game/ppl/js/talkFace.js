//聊天弹框
;(function(_super, broker){
	//中介者
	var broker = broker;

	function talkUIEx(){

		talkUIEx.super(this);

		
		this.init();
	}

	Laya.class(talkUIEx, 'ui.room.talkUIEx', _super);

	var _proto_ = talkUIEx.prototype;

	//初始化
	_proto_.init = function(){

		//供外界访问
		broker.talkUIEx = this;

		this.reset();

	}
	//重置
	_proto_.reset = function(){

		//初始位置到最下面
		this.y = 1334;

		// 这是为了重置选择的项目 不设置这个无法重复选择
		this.example_list.selectedIndex = -1;

	}

	// 时间限制
	_proto_.timeLockFn = function(){
		this.timeLock = true;

		Laya.timer.once(10000, this, function(){ this.timeLock = false });

	}

	//聊天弹框入场动画
	_proto_.show = function(){

		Laya.Tween.to(this, {y: 1334 - this.height}, 400, Laya.Ease.circOut);

	}

	//渲染聊天内容例子
	_proto_.renderChatContent = function(data){
		var _arr = [];
		data.forEach(function(item, index, arr){
			var content = item.split('~');
			var _list = {
				id: {
					text: content[0]
				},
				msg:{
					text: content[1]
				}
			}

			_arr.push(_list);
		})

		this.example_list.array = _arr;

		//点击选择并确定发送信息
		this.example_list.selectHandler = Laya.Handler.create(this, this.handlerSendMsg, null, false);
	}

	_proto_.handlerSendMsg = function(index){
		// -1时不做处理
		if(index == -1){
			return;
		}
		var _id = '';
		var _content = '';
		this.example_list.array.forEach(function(item, i, arr){
			if (index == i) {
				_id = item.id.text;
				_content = item.msg.text;
			};
		})

		this.sendChat(1, _id, _content);
	}

	//确定发送聊天内容
	_proto_.sendChat = function(type, id, content){

		this.reset();

		if(this.timeLock){

			broker.warnPopUIEx.show("您发表聊天频率过快，\\n请稍后再试。");
			return;
			
		}else{

			this.timeLockFn();

			// 发送聊天请求
			broker.sendChatFace(type, id);

			// 自己发送聊天内容
			broker.roomUIEx.mine_user.renderChat(content);
		}
	}

	// 检查是否显示在舞台内
	_proto_.isShow = function(){
		return this.y != 1334;
	}



})(talkUI, broker);


//表情弹框
;(function(_super, broker){
	//中介者
	var broker = broker;

	function faceUIEx(){

		faceUIEx.super(this);

		
		this.init();
	}

	Laya.class(faceUIEx, 'ui.room.faceUIEx', _super);

	var _proto_ = faceUIEx.prototype;

	//初始化
	_proto_.init = function(){

		//供外界访问
		broker.faceUIEx = this;

		// 聊天频率限制
		this.timeLock = false;

		this.reset();

	}
	//重置
	_proto_.reset = function(){

		//初始位置到最下面
		this.y = 1334;

		// 这是为了重置选择的项目 不设置这个无法重复选择
		this.face_list.selectedIndex = -1;

	}
	// 时间限制
	_proto_.timeLockFn = function(){
		this.timeLock = true;

		Laya.timer.once(10000, this, function(){ this.timeLock = false });

	}

	//聊天弹框入场动画
	_proto_.show = function(){

		Laya.Tween.to(this, {y: 1334 - this.height + 20}, 400, Laya.Ease.circOut);

	}

	//渲染聊天内容例子
	_proto_.renderFaceContent = function(data){
		var _arr = [];
		data.forEach(function(item, index, arr){
			var content = item.split('~');
			var _list = {
				id: {
					text: content[0]
				},
				faceImg:{
					skin: content[1]
				}
			}

			_arr.push(_list);
		})

		this.face_list.array = _arr;

		//点击选择并确定发送信息
		this.face_list.selectHandler = Laya.Handler.create(this, this.handlerSendMsg, null, false);
	}

	_proto_.handlerSendMsg = function(index){
		// -1时不做处理
		if(index == -1){
			return;
		}

		var _id = '';
		var _content = '';
		this.face_list.array.forEach(function(item, i, arr){
			if (index == i) {
				_id = item.id.text;
				_content = item.faceImg.skin;
			};
		})

		this.sendChat(2, _id, _content);
	}

	//确定发送聊天内容
	_proto_.sendChat = function(type, id, _url){

		this.reset();

		if(this.timeLock){

			broker.warnPopUIEx.show("您发表表情频率过快，\\n请稍后再试。");
			return;

		}else{

			this.timeLockFn();

			// 发送聊天请求
			broker.sendChatFace(type, id);

			// 自己发送表情内容
			broker.roomUIEx.mine_user.renderFace(_url);
		}

	}

	// 检查是否显示在舞台内
	_proto_.isShow = function(){
		return this.y != 1334;
	}



})(faceUI, broker);


// 头像弹框
;(function(_super, broker){

	var broker = broker;
	function headPopUIEx(){

		headPopUIEx.super(this);

		this.init();
	}

	Laya.class(headPopUIEx, 'ui.room.headPopUIEx', _super);

	var _proto_ = headPopUIEx.prototype;

	//初始化
	_proto_.init = function(){

		// 中介者对外提供接口
		broker.headPopUIEx = this;
		
		// 道具价格对象
		this.DJPriceObj = {}
	}
	
	// 渲染头像弹框的信息(是否是第一次加载)
	_proto_.renderHeadPop = function(data){

		var info = data.info;
		var _name = info.uName;
		// 姓名
		this.user_name.text = zutil.getActiveStr(_name, 16);
		// 头像 
		broker.player[_name] = broker.player[_name] || broker.getDefault_head();

		this.head_img.skin = broker.player[_name];

		// 胜率
		this.win_odds.text = parseInt(data.win) + '%';
		// 对局数
		this.play_num.text = data.base + '';

		this.renderDaoju(data.item);

		this.popup();
	}
	// 加载道具
	_proto_.renderDaoju = function(data){

		var _arr = [];
		var _this = this;
		var _url0 = 'images/room/headPop/daoju';
		
		_this.DJPriceObj = {};
		data.forEach(function(item, index, arr){
			var _list = {
				daoju_num: {
					text: item.price
				},
				daoju_img:{
					skin: _url0 + item.description + '.png'
				},
				id:{
					text: item.id
				}
			}
			// 给道具价格对象赋值
			_this.DJPriceObj[item.id] = item.price;

			_arr.push(_list);
		})

		this.daoju_list.array = _arr;

		//购买并发送道具
		this.daoju_list.selectHandler = Laya.Handler.create(this, this.handlerBuyDJ, null, false);
	}

	// 购买道具
	_proto_.handlerBuyDJ = function(index){
		var _this = this;
		
		// -1时不做处理
		if(index == -1){
			return;
		}

		var _id = '';
		var _skin = '';
		this.daoju_list.array.forEach(function(item, i, arr){
			if (index == i) {
				_id = item.id.text;
				_skin = item.daoju_img.skin;
			}
		})

		this.close();

		// 这是为了重置选择的项目 不设置这个无法重复选择
		this.daoju_list.selectedIndex = -1;

		//发送购买道具命令
		broker.payAndUseItem(_id);

	}

})(headPopUI, broker);

// 道具的发送
var Djcontrol = (function(){

	function Djcontrol(box){
		
		// 外层box
		this.box = box;

		// 我的道具
		this.mine_dj = box.getChildByName('mine_dj');

		// 对方道具
		this.opp_dj = box.getChildByName('opp_dj');

		this.init();
	}

	var _proto_ = Djcontrol.prototype;

	_proto_.init = function(){

		broker.Djcontrol = this;
		
		// 初始化坐标
		this.initPos();

	}

	// 初始化坐标 
	_proto_.initPos = function(){

		// a类坐标（非冰桶）
		this.POS_a1 = {
			x: this.mine_dj.x,
			y: this.mine_dj.y
		}

		this.POS_a2 = {
			x: this.opp_dj.x,
			y: this.opp_dj.y
		}

		// b类坐标(冰桶)
		this.POS_b1 = {
			x: 26,
			y: -23
		}

		this.POS_b2 = {
			x: 26,
			y: -912
		}

	}

	// 道具渲染
	_proto_.renderSkin = function(dom, id, which){
		var _url = 'images/room/headPop/clip_dj'+ id +'.png';
		// 道具皮肤
		dom.skin = _url;

		// 道具的具体坐标
		if(which == 1){
			if(id == 3){
				dom.pos(this.POS_b1.x, this.POS_b1.y);
			}else{
				dom.pos(this.POS_a1.x, this.POS_a1.y);
			}
		}else if(which == 2){
			if(id == 3){
				dom.pos(this.POS_b2.x, this.POS_b2.y);
			}else{
				dom.pos(this.POS_a2.x, this.POS_a2.y);
			}
		}

	}

	// 绑定事件
	_proto_.bindEvent = function(dom){
		var _dom = dom;

		// 换帧改变事件
		_dom.on('change', _dom, function(){
			if(_dom.index == 6){
				_dom.stop();

				Laya.timer.once(1000, null, function(){
					// 销毁dom
					_dom.destroy();
					
				})
			}
		});
	}

	// 我发送道具
	_proto_.djAnimation = function(dom, id, which){
		var _target = {};
		var _this = this;

		if(id == 3){
			if(which == 1){
				_target = this.POS_b2;
			}else{
				_target = this.POS_b1;
			}
		}else {
			if(which == 1){
				_target = this.POS_a2;
			}else{
				_target = this.POS_a1;
			}
		}

		Laya.Tween.to(dom, _target, 800, Laya.Ease.circOut, Laya.Handler.create(this, function(){
				dom.play();
		}))
	}

	// 创建道具
	_proto_.createDj = function(){

		var _daoju = new laya.ui.Clip();
		_daoju.clipY = 7;
		_daoju.interval = 130;

		return this.box.addChild(_daoju);
		
	}

	// 道具动画
	_proto_.animation = function(which, id){

		// which   1->自己发送道具     2->对方发送道具

		// 创建clip
		var _dom = this.createDj();

		// 渲染皮肤&初始位置
		this.renderSkin(_dom, id, which);

		// 添加事件
		this.bindEvent(_dom);

		// 做动画
		this.djAnimation(_dom, id, which);

	}
		

	return Djcontrol;

})()
