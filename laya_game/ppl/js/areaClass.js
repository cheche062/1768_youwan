// 基本区域类（对方牌的区域）
var BaseArea = (function(){
	function BaseArea(area){

		this.area = area;
		this.area_list = [];	//对方区域内的牌列表(基类牌 BasePai 实例数组)；

		this.init();
		
	}

	var _proto_ = BaseArea.prototype; 

	_proto_.init = function(){

		this.initList();
	}

	//初始化牌列表
	_proto_.initList = function(){
		var _this = this;
		var _arr = zutil.getElementsByName(this.area, 'pai_box');
		_arr.forEach(function(item, index, arr){
			_this.area_list.push(new BasePai(item));
		})

	}
	// 重置
	_proto_.reset = function(){
		this.area_list.forEach(function(item, index, arr){
			item.hide();
		})
	}
	// 渲染具体位置的牌
	_proto_.renderPaiContent = function(arrPai){
		this.area_list.forEach(function(item, index, arr){
			
			item.renderPaiContent(arrPai[index]);
		})
	}

	return BaseArea;

})()

//公共牌区域
var PublicArea = (function(_super){

	function PublicArea(area){

		PublicArea.super.call(this, [area]);
		this.wait_text = this.area.getChildByName('wait_text');	//等待提示的dom

		this.resetPublic(false);

	}
	zutil.extend(PublicArea, _super);

	var _proto_ = PublicArea.prototype;

	//游戏未开始等待中。。。(是否有对面玩家)
	_proto_.resetPublic = function(isOpp){
		this.reset();
		this.wait_text.text = isOpp?  '等待进入下一局...' : '等待其他玩家进入房间...';
		this.wait_text.visible = true;
	}

	//渲染牌的内容
	_proto_.renderPaiContentPublic = function(arrPai){
		this.wait_text.visible = false;
		this.renderPaiContent(arrPai);
	}

	return PublicArea;

})(BaseArea)


//我方牌区域
var MineArea = (function(_super){

	function MineArea(area){

		MineArea.super.call(this, [area]);

	}

	zutil.extend(MineArea, _super);

	var _proto_ = MineArea.prototype;

	_proto_.init = function(){

		//创建中介者对我方区域牌的引用
		broker.MineArea = this;

		//父类的初始化列表
		this.initList();

		//初始化dom
		this.initDom();

		//已经选择过牌的位置索引
		this.hasPaiArr = [];

		//重置
		this.resetMine();

	}
	//初始化dom
	_proto_.initDom = function(){
		var _this = this;
		//卡槽背景的box
		var pai_bg_box= this.area.getChildByName('pai_bg_box');
		//白牌背景的box
		var pai_white_box= this.area.getChildByName('pai_white_box');

		//选中的卡槽添加背景数组
		this.pai_bgLight_list = zutil.getElementsByName(pai_bg_box, 'pai_bgLight');

		//白牌数组
		this.pai_white_list = zutil.getElementsByName(pai_white_box, 'pai_white');

	}

	//牌槽改变（待选择状态）
	_proto_.paiBgLightChange = function(index){

		this.pai_bgLight_list.forEach(function(item, i, arr){
			if(index === i){
				item.visible = true;
			}else{
				item.visible = false;
			}
		})

	}
	// 渲染当前放置上的牌
	_proto_.renderCurrentPai = function(index, str){
		
		this.area_list.forEach(function(item, i, arr){
			if(index === i){
				item.renderPaiContent(str);
			}
		})

	}
	//重置
	_proto_.resetMine = function(){
		// 所有的牌隐藏
		this.reset();

		//重置已选择过的牌索引位置
		this.hasPaiArr.length = 0;

		//初始化白牌隐藏
		this.pai_white_list.forEach(function(item, index, arr){
			item.scaleX = 1;
			item.scaleY = 1;
			item.alpha =  1;
			item.visible = false;
		})

		//默认隐藏待选高亮光效
		this.pai_bgLight_list.forEach(function(item, index, arr){
			item.visible = false;
		})

	}
	//确定该索引的牌被选中
	_proto_.informPaiChecked = function(index, pai){
		var _key = String(index+1);
		var card = {};
		card[_key] = pai;

		//发送出牌请求
		broker.outCard(card);

		// 渲染牌型
		this.renderCurrentPai(index, pai);

		//对方玩家准备出牌
		broker.roomUIEx.oppositeNotice();

		this.hasPaiArr.push(index);

		// 已经确定则将其高光隐藏隐藏
		this.pai_bgLight_list[index].visible = false;

		//白牌开始做动画
		var _pai_white = this.pai_white_list[index];
		_pai_white.visible = true;

		Laya.Tween.to(_pai_white, {scaleX: 2.4, scaleY: 2.4, alpha: 0}, 400, Laya.Ease.circOut);

	}

	// 检测是否是已被选择过的索引
	_proto_.checkHasPai = function(index){
		return this.hasPaiArr.indexOf(index)>-1? -1 : index;
	}


	return MineArea;

})(BaseArea)


//可拖拽牌区域
var DragArea  = (function(_super){

	function DragArea(area){

		DragArea.super.call(this, [area]);
		
	}

	zutil.extend(DragArea, _super);


	var _proto_ = DragArea.prototype;

	_proto_.init = function(){

		//初始化多拽区域的坐标
		this.drag_area_point = {
			x: this.area.x,
			y: this.area.y
		}

		this.initList();
	}

	//初始化牌列表
	_proto_.initList = function(){
		var _this = this;
		var _arr = zutil.getElementsByName(this.area, 'pai_box');
		
		_arr.forEach(function(item, index, arr){
			var oDrag = new DragPai(item, _this.drag_area_point);	
			oDrag.dragAreaClass = _this;	//创建对DragArea实例的引用
			_this.area_list.push(oDrag);

		})

		// 给舞台添加鼠标抬起事件(以防重复添加事件)
		Laya.stage.on(Laya.Event.MOUSE_UP, this, function(){

			_this.area_list.forEach(function(item, index, arr){
				if(item.drag_bg.visible == true && _this.isBegin){
					if(item.isChoiced){

						//一轮出牌结束 
						_this.isBegin = false;

						//拖动到我方确定区域内
						item.confirmPos();

						audio.play('bai_pai');

						//将牌型告诉我方区域内该位置的牌进行渲染
						// broker.MineArea.renderCurrentPai(item.index, item.pai_info);

						//通知MineArea我方区域内多增加一张牌
						broker.MineArea.informPaiChecked(item.index, item.pai_info);

					}else{
						//非确定区域内松手
						item.confirmDisPos();
					}
				}
			})
		})

	}

	// 渲染具体位置的牌
	_proto_.renderPaiContent = function(arrPai){

		// 一轮出牌开始了(防止连续点击时重复发送请求)
		this.isBegin = true;

		// 首先重置一下
		this.resetDrag();

		this.area_list.forEach(function(item, index, arr){
			item.renderPaiContentDrag(arrPai[index]);
		})
	}

	//未被选择的牌隐藏动画
	_proto_.hideOtherPai = function(){
		var _this = this;
		this.area_list.forEach(function(item, index, arr){

			if(!item.isChoiced){

				Laya.Tween.to(item.pai_box, {scaleX: 0, scaleY: 0}, 200, Laya.Ease.linearIn);
			}
		})
	}

	_proto_.resetDrag = function(){
		this.area_list.forEach(function(item, index, arr){

			item.reset();
		})
	}



	return DragArea;

})(BaseArea)

//房间类型区域
var RoomType = (function(){

	function RoomType(box){

		//房间底注
		this.base_point = box.getChildByName('base_point_num');
		//房间场次标志
		this.chang_xin = box.getChildByName('chang_xin');
	}

	var _proto_ = RoomType.prototype;

	//渲染房间类型
	_proto_.renderRoomType = function(index, txt){
		this.renderBasePoint(txt);
		this.renderChangXin(index);
	}

	//渲染场次标志
	_proto_.renderChangXin = function(i){
		// 1-> 平民场  2->小资场   3-> 老板场  4->土豪场
		var index = Number(i);
		if(index == 2){
			index = 3;
		}else if(index == 3){
			index = 2;
		}
		
		this.chang_xin.index = index - 1;
	}

	//渲染底注
	_proto_.renderBasePoint = function(txt){
		this.base_point.text = '底分: ' + txt;
	}

	//重置
	_proto_.reset = function(){
		this.renderBasePoint('');
		this.renderChangXin(-1);
	}


	return RoomType;

})()