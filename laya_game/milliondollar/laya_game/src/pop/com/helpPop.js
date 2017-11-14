
/**
	帮助弹层
*/
import zsySlider from '../../common/laya.zsySlider';
import { messageCenter, observer} from '../../module/init_module';
export class HelpPopDialog extends helpPopUI{
	constructor(){
		super();
		this.init();
	}

	init() {
		this.initDom();
		this.initEvent();

	}

	// 注册
	registerAction({messageCenter,observer}) {

		observer.subscribe("cmd::help", this.renderBet.bind(this));   
		// 订阅弹层
		observer.subscribe('pop::help', this.myShow.bind(this));
	}

	initDom() {
		this.dom_btn_left = this.getChildByName("btn_left");
		this.dom_btn_right = this.getChildByName("btn_right");

		this.bet = this.help_glr.find("bet" ,true);
		
	    // 初始化帮助页滑动效果
	    new zsySlider(this.help_glr);

	}

	initEvent() {
		this.getChildByName("close_btn1").on(Laya.Event.CLICK, this , this.myClose);
		this.getChildByName("close_btn2").on(Laya.Event.CLICK, this, this.myClose);
		this.dom_btn_left.on(Laya.Event.CLICK, this , this.switchItem.bind(this, "left"));
		this.dom_btn_right.on(Laya.Event.CLICK, this , this.switchItem.bind(this, "right"));

	}

	switchItem(target) {
		var pagination = this.help_glr.getChildByName("pagination");
		var index = pagination.selectedIndex;

		switch(target){

			case "left":
				if(index<1){
					pagination.selectedIndex = 3;
				}else{
					pagination.selectedIndex = index - 1;
				}
				break;

			case  "right":
				if(index>2){
					pagination.selectedIndex = 0;
				}else{
					pagination.selectedIndex = index + 1;
				}
				break;

		}
		
	}

	renderBet(data) {
		let betLevel = data.info;

		if(Number(data.code) !== 0){
			return;
		}

		this.bet[0].text  = betLevel.trigger8;
		this.bet[1].text  = betLevel.trigger7;
		this.bet[2].text  = betLevel.trigger6;
		this.bet[3].text  = betLevel.trigger5;

	}

	myShow(index) {
		var pagination = this.help_glr.getChildByName("pagination");
		// 打开即第几页
		if(index){
			pagination.selectedIndex = index;
		}else{
			pagination.selectedIndex = 0;
		}
		
		messageCenter.emit('help');
		this.popup();
	}

	myClose() {
		this.help_glr.getChildByName("pagination").selectedIndex = 0 ;
		this.close();
	}
}