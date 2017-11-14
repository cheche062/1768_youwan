 //基类 牌
var BasePai = (function(){
	function BasePai(paiBox){
		this.pai_box = paiBox;
		this.hua_se = null;		//花色
		this.shu_zi = null;		//数字
		this.pai_info = null;	//牌型信息

		this.init();
	}

	var _proto_ = BasePai.prototype;

	_proto_.init = function(){
		this.hua_se = this.pai_box.getChildByName('hua_se');
		this.shu_zi = this.pai_box.getChildByName('shu_zi');

		this.hide();
	}
	
	//牌型渲染
	_proto_.renderPaiContent = function(str){
		// 空牌隐藏它
		if(!str){
			this.hide();
			return;
		}
		var _huase = str.slice(0, 1);
		var _shuzi = Number(str.slice(1));
		var _huaseIndex = 0;
		var _shuziIndex = 0;

		switch (_huase){
			case 'H':
				_huaseIndex = 1;	//红桃
				break;
			case 'S':
				_huaseIndex = 3;	//黑桃
				break;
			case 'D':
				_huaseIndex = 0;	//方块
				break;
			case 'C':
				_huaseIndex = 2;	//梅花
				break;
			default:
				_huaseIndex = -1;
				break
		}
		// 14对应‘A’
		_shuziIndex = _shuzi==14? 0 : _shuzi - 1;
		_shuziIndex = (_huaseIndex==0||_huaseIndex==1)? _shuziIndex : _shuziIndex+13;

		this.hua_se.index = _huaseIndex;
		this.shu_zi.index = _shuziIndex;
		this.pai_info = str;
		this.show();
	}
	//牌的显示
	_proto_.show = function(){
		this.pai_box.visible = true;
	}
	//牌的隐藏
	_proto_.hide = function(){
		this.pai_box.visible = false;
	}

	return BasePai;

})()

//拖拽 牌 
var DragPai = (function(_super, _, broker){
	var _ = _;
	var broker = broker;	//中介者
	function DragPai(paiBox, points){

		DragPai.super.call(this, [paiBox]);

		// 拖拽区域父容器坐标
		this.pointsBox = points;

		this.initDrag();						//外加自己的初始化

	}

	zutil.extend(DragPai, _super);

	var _proto_ = DragPai.prototype;

	_proto_.initDrag = function(){
		
		this.initSizeDom();

		//添加drag拖拽
		this.drag();

	}
	//初始化大小及dom
	_proto_.initSizeDom = function(){
		var _this = this;
		var pai_box = this.pai_box;

		this.WIDTH = pai_box.width;
		this.HEIGHT = pai_box.height;
		//轴心点在右下角时的位置
		this.originPostion = {
			x: pai_box.x,
			y: pai_box.y
		}
		//轴心点在中心时的位置
		this.centerPosition = {
			x: this.originPostion.x - parseInt(this.WIDTH/2),
			y: this.originPostion.y - parseInt(this.HEIGHT/2)
		}

		this.drag_bg = pai_box.getChildByName('drag_bg');
		this.drag_bg.visible = false;							//隐藏牌放光效果

		//目标检测最近的区域数组
		this.target_arr1 = [{x:144, y:-266}, {x:270, y:-266}, {x:392, y:-266}, {x:144, y:-116}, {x:270, y:-116}, {x:392, y:-116}];

		this.target_arr2 = this.target_arr1.map(function(item, index, arr){

			return {x: item.x + _this.pointsBox.x, y: item.y + _this.pointsBox.y}

		})
	}

	//重置
	_proto_.reset = function(){
		// 清除牌的所有缓动
		Laya.Tween.clearAll(this.pai_box);
		this.pai_box.stopDrag();
		this.hide();
		this.index = -1;			//初始化该牌被拖动到我方区域内的索引
		this.isChoiced = false;
		this.setAnchor('rightdown');
		//层级下去
		this.pai_box.zOrder = 1;

		this.drag_bg.visible = false;
	}

	//牌的出场动画
	_proto_.renderPaiContentDrag = function(str){

		//先把牌初始到动画前的状态
		var pai_box = this.pai_box;
		var _x = pai_box.x;

		pai_box.x = _x - 100;
		pai_box.rotation = -20;

		pai_box.scaleX = 1;
		pai_box.scaleY = 1;

		//牌型渲染
		this.renderPaiContent(str);
		
		//牌出场动画 
		Laya.Tween.to(pai_box, {rotation: 10, x: _x}, 300, Laya.Ease.circOut, Laya.Handler.create(this, this.renderCallBack));

	}
	//出场动画摆回来的动画
	_proto_.renderCallBack = function(){
		Laya.Tween.to(this.pai_box, {rotation: 0}, 200, Laya.Ease.backOut, Laya.Handler.create(this, this.showOutendCallBack), 50);
	}

	//出场动画结束后的回调
	_proto_.showOutendCallBack = function(){
		//设置轴心点到中心
		this.setAnchor('center');
	}

	//拖拽功能 (只执行一次即初始化时)
	_proto_.drag = function(){
		this.pai_box.on(Laya.Event.MOUSE_DOWN, this, function(){

			// 首先判断是否一轮选牌已结束
			if(!this.dragAreaClass.isBegin){
				return;
			}
			
			//牌发光
			this.drag_bg.visible = true;
			//层级上来
			this.pai_box.zOrder = 10;
			this.pai_box.startDrag();
		})

		this.pai_box.on(Laya.Event.MOUSE_MOVE, this, function(){
			
			this.listenMouseToMine();
		})
		
	}

	// 监听鼠标的移动区域
	_proto_.listenMouseToMine = function(){
		var _box = this.pai_box;
		var _p = this.pointsBox;

		var _x = parseInt(_box.x + _p.x);
		var _y = parseInt(_box.y + _p.y);
		var _index = -1;

		//遍历检测该拖拽牌与我方牌区域中最近的牌
		_index = this.getWitchNear(_x, _y);

		//去检测一下该索引是否有牌
		_index = broker.MineArea.checkHasPai(_index);

		//是否是确定选择了
		this.index = _index;			//便于后面取得该值
		this.isChoiced = _index>-1;

		//利用中介者间接调用MineArea类实例方法
		broker.MineArea.paiBgLightChange(_index);

	}

	//得到最近的那个牌的索引
	_proto_.getWitchNear = function(x, y){
		var dis_arr = [];

		//后面再优化（去掉已经选中的位置，在剩下的里面选择）
		// console.log(broker.MineArea.hasPaiArr);

		this.target_arr2.forEach(function(item, index, arr){

			var _sqt = Math.sqrt( Math.pow((item.x-x), 2) + Math.pow((item.y-y), 2) );

			dis_arr.push(parseInt(_sqt));
		})

		var _min = Math.min.apply(null, dis_arr);

		return _min<=100? dis_arr.indexOf(_min) : -1; 

	}

	//重置轴心点
	_proto_.setAnchor = function(str){
		var pai_box = this.pai_box;
		if(str == 'center'){
			pai_box.anchorX = 0.5;
			pai_box.anchorY = 0.5;
			pai_box.pos(this.centerPosition.x, this.centerPosition.y);
		}else if(str == 'rightdown'){
			pai_box.anchorX = 1;
			pai_box.anchorY = 1;
			pai_box.pos(this.originPostion.x, this.originPostion.y)
		}
		
	}

	//拖动到我方确定区域内
	_proto_.confirmPos = function(){

		this.drag_bg.visible = false;

		this.dragPosToMine(this.index);

		//dragAreaClass指向DragArea实例
		this.dragAreaClass.hideOtherPai();
		
		//选定牌的放大动画
		Laya.Tween.to(this.pai_box, {scaleX: 1.6, scaleY: 1.6}, 250, Laya.Ease.circOut, Laya.Handler.create(this, this.confirmCallBack))

	}
	//确定选牌后的回调
	_proto_.confirmCallBack = function(){

		//选定牌的缩小还原动画且回调隐藏掉
		Laya.Tween.to(this.pai_box, {scaleX: 1, scaleY: 1}, 100, Laya.Ease.circIn, Laya.Handler.create(this, function(){this.hide()}));

	}

	//非确定区域内松手
	_proto_.confirmDisPos = function(){
		//层级下去
		this.pai_box.zOrder = 1;
		this.drag_bg.visible = false;
		this.pai_box.pos(this.centerPosition.x, this.centerPosition.y);

	}

	// 拖拽牌相对于我方牌区域的坐标
	_proto_.dragPosToMine = function(index){
		if(index<0){
			return;
		}
		
		var _pos = this.target_arr1[index];

		this.pai_box.pos(_pos.x, _pos.y);
	} 

	//白板牌动画结束后的回调初始化
	_proto_.whitePaiCallBack = function(){
		var white_pai = this.white_pai;
		white_pai.visible = false;
		white_pai.alpha = 1;
		white_pai.scaleX = 0;
		white_pai.scaleY = 0;
	}

	return DragPai;

})(BasePai, _, broker)