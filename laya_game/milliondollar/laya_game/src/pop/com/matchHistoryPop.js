/**
	美金大赛记录
*/
import UTILS from '../../config/utils.js';
import { messageCenter, observer} from '../../module/init_module';
export class MatchHistoryPopDialog extends matchHistoryPopUI{
	constructor(...args){
		super(...args);

		this.init();
	}

	init() {
		this.initDom();

		this.initConfig();

		this.initEvent();
	}

	// 注册
	registerAction({messageCenter,observer}){

		// 数据传输
		observer.subscribe("lastMatch",this.renderRankResult.bind(this));

		// 订阅弹层
		observer.subscribe("pop::match::history",this.myshow.bind(this));
	}



	initDom() {
		// 关闭按钮
		this.dom_close_btn1 = this.getChildByName("close_btn1");

		this.dom_close_btn2 = this.getChildByName("close_btn2");

	}

		// 初始化配置参数
	initConfig() {
		this.config = {
			isFirst : true
		}
	}

	// 初始化事件
	initEvent() {

		this.dom_close_btn1.on(Laya.Event.CLICK, this, this.close);
		this.dom_close_btn2.on(Laya.Event.CLICK, this, this.close);

		// 未登录
		this.dom_unloaded.on(Laya.Event.CLICK, this, UTILS.gotoLogin);

	}

	// 加载中或者显示数据
	isLoadingOrContent(type) {
		// 暂无数据
		if(type === 0){
			this.dom_loading.visible = true;
			this.dom_loading.text = "虚位以待……";
			this.awardResult.visible = false;
			this.dom_unloaded.visible = false;

		// 加载中
		}else if(type === 1){
			this.dom_loading.visible = true;
			this.dom_loading.text = "加载中……";
			this.awardResult.visible = false;
			this.dom_unloaded.visible = false;

		//显示内容 
		}else if(type === 2){
			this.dom_loading.visible = false;
			this.awardResult.visible = true;
			this.dom_unloaded.visible = false;

		//未登录 
		}else if(type ===3){
			this.dom_loading.visible = false;
			this.awardResult.visible = false;
			this.dom_unloaded.visible = true;
		}
	}

	// 大赛结果排行榜及我的排名
	renderRankResult(data){

	    let matchResult = data.info;
	    let myMatchResult = data.userInfo;
	    let result = [];

	   	if(Number(data.code) !== 0){
			return ; 
		}

		matchResult.forEach((item,index) => {
			let _matchResult = matchResult[index];
			result.push({
				rankIcon : index,
				rankNum :{
					text:index+1,
					visible : index > 2 ? true : false
				},
				nick : UTILS.getActiveStr(_matchResult.user_name , 9),
				winAmount : UTILS.getActiveStr(parseInt(_matchResult.win_amount) , 10),
				deviceAmount : UTILS.getActiveStr(parseInt(_matchResult.extra_amount) , 10)

			})
		})



		this.list_rank_all.array = result ; 
		this.last_extra_time.text = data.time;
		this.my_rank.text = myMatchResult.rank;
		this.my_amount.text = myMatchResult.extra_amount;

		if (matchResult.length === 0) {
            // 已经登陆
			if(UTILS.checkLoginStatus()){
				this.isLoadingOrContent(0);
			}else{
				this.isLoadingOrContent(3);
			}

        }else{
            this.isLoadingOrContent(2);
		}
	}

	// 弹层出现
	myshow(messageCenter) {
		this.isLoadingOrContent(1);

		this.popup();
	}


}
