
/**
	排行版
*/
import UTILS from '../../config/utils.js';
import { messageCenter, observer} from '../../module/init_module';
export class RankPopDialog extends rankPopUI {
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

	registerAction({messageCenter, observer}) {
		// 数据传输
		
		messageCenter.registerAction("day", this.renderRankList.bind(this));   // 日周月
		messageCenter.registerAction("week", this.renderRankList.bind(this));
		messageCenter.registerAction("month", this.renderRankList.bind(this));

		messageCenter.registerAction("top3",this.renderRichList.bind(this)) //富豪榜

		messageCenter.registerAction("poolLog", this.renderPoolLog.bind(this));   // 分奖
		
		messageCenter.registerAction("myPrizeLog", this.rendermMyPrizeLog.bind(this));  // 战绩



		// 订阅弹层
		observer.subscribe("pop::rank",this.myShow.bind(this));
	}


	// 触发
	dispatchAction(messageCenter) {
		this.isLoadingOrContent(1);
		messageCenter.emitAjax('day');
		messageCenter.emit('poolLog');
		messageCenter.emit('myPrizeLog');
		messageCenter.emit('top3');

	}

	initDom() {
		// 关闭按钮
		this.dom_close_btn = this.getChildByName("close_btn");

		// 我的排名
		this.my_rank_box = this.getChildByName("myRankBox");

		// 土豪榜列表  
		this.dom_rich_list = this.getChildByName("richList").find("item",true);

	}

	// 初始化配置参数
	initConfig() {
		this.config = {
			isFirstMyList : true ,  //第一次渲染我的战绩
			perioArr : ["day", "week", "month"] ,  //日周月排行榜
			isFirst : true
		}
	}

	// 初始化事件
	initEvent() {
		this.dom_close_btn.on(Laya.Event.CLICK, this, this.close);

		// 未登录
		this.dom_unloaded.on(Laya.Event.CLICK, this, UTILS.gotoLogin);

		// tab切换
		this.tab_nav.selectHandler = Laya.Handler.create(this, this.tabSwitchHandler, null, false);

	}

	// tab切换
	tabSwitchHandler(index) {
		let target = 0;
		let type;

		if(index === 3){
			target = 1;
			this.isLoadingOrContent(1);
			// 发送分奖socket请求
			messageCenter.emit('poolLog');
			this.my_rank_box.visible = false;

		}else if(index === 4){
			target = 2;

			this.isLoadingOrContent(1);
			messageCenter.emit('myPrizeLog');
			this.my_rank_box.visible = false;

		}else{
			target = 0;
			type = this.config.perioArr[index];

			// 先是(1)加载中，，在请求成功后会执行(2)，显示数据
			this.isLoadingOrContent(1);	

			// 发送排行榜ajax请求
			messageCenter.emitAjax(type); 

			this.my_rank_box.visible = true;

		}

		this.tab_con.selectedIndex = target;

	}

	// 加载中或者显示数据
	isLoadingOrContent(type) {
		// 暂无数据
		if(type === 0){

			this.dom_loading.visible=true;
			this.dom_loading.text="暂无数据……";
			this.tab_con.visible=false;
			this.dom_unloaded.visible=false;

		// 加载中
		}else if(type === 1){

			this.dom_loading.visible=true;
			this.dom_loading.text="加载中……";
			this.tab_con.visible=false;
			this.dom_unloaded.visible=false;

		// 显示内容
		}else if(type ===2){
			this.dom_loading.visible=false;
			this.tab_con.visible=true;
			this.dom_unloaded.visible=false;

		// 未登录
		}else if(type ===3){
			this.dom_loading.visible=false;
			this.tab_con.visible=false;
			this.dom_unloaded.visible=true;
		}

	}

	// 富豪榜渲染
	renderRichList(data) {
/*		let data =   {
		    "cmd":"top3",
		    "res":
		    {
		      "code":0,
		      "info":[
		              // {"userName":"fangshuqin","amount":100, "type":5},
		              // {"userName":"fangshuqin2","amount":200,"type":5}
		            ] ,
		      "myRank":51	
		    }
		}*/

		let infoArray = data.info;

		if(data.code !== 0 ){
			return;
		}

		this.dom_rich_list.forEach((item , index) => {
			let _infoArray = infoArray[index];
			let _dom_rank  = item.getChildByName("rank");
			let _dom_name  = item.getChildByName("name");
			let _dom_point = item.getChildByName("point");

			if(_infoArray){
				_dom_rank.index = index;
				_dom_name.text  = UTILS.getActiveStr(_infoArray.user_name, 9);
				_dom_point.text = UTILS.getActiveStr(parseInt(_infoArray.amount), 10);
			}else{
				_dom_rank.index = index;
				_dom_name.text = "虚位以待……";
				_dom_name.y = 27;
				_dom_point.visible = false;
			}
		})

		

	}

	// 分奖渲染
	renderPoolLog(data) {
/*		let data = {

		    "cmd":"poolLog",
		    "res":
		    {
		      "code":0,
		      "info":[
		            {"user_name":"fangshuqin", "pool":"2","amount":100,"raw_add_time":"2017-10-10 10:10:10"},
		            {"user_name":"方书琴2", "pool":"2","amount":100,"raw_add_time":"2017-10-10 10:10:10"},
		            {"user_name":"方书琴3", "pool":"2","amount":100,"raw_add_time":"2017-10-10 10:10:10"},
		            {"user_name":"fangshuqin", "pool":"3","amount":100,"raw_add_time":"17年11月11日17:54:12"},
		            {"user_name":"fangshuqin", "pool":"4","amount":6666666600,"raw_add_time":"17年10月11日17:54:12"},
		            {"user_name":"fangshuqin", "pool":"5","amount":7777777700,"raw_add_time":"17年11月11日17:54:12"},
		            {"user_name":"方书琴8", "pool":"5","amount":888888800,"raw_add_time":"17年12月11日17:54:12"},
		            {"user_name":"方书琴89", "pool":"5","amount":888888800,"raw_add_time":"17年12月11日17:54:12"},
		            {"user_name":"方书琴99", "pool":"5","amount":888888888888800800,"raw_add_time":"17年12月11日17:54:12"},

		        ]
		  	}
			
		}*/


		let poolLog = data.info;
		let result = [];

		if(data.code !== 0 ){
			return;
		}


		poolLog.forEach( (item, index)=> {
			let _poolLog = poolLog[index];

			result.push({
				name:  _poolLog.user_name,
				award: Number(_poolLog.pool)+3+"百搭",
				amount: UTILS.getActiveStr(parseInt(_poolLog.amount), 10),
				time:  _poolLog.raw_add_time
			})
		})

		this.list_rank_award.array = result;

		if(poolLog.length === 0 ){
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
	// 我的战绩
	rendermMyPrizeLog(data) {
/*		let data =   {
		    "cmd":"myPrizeLog",
		    "res":
		    {
		       "code":0,
		       "info":[
		              {"win_amount":100,"raw_add_time":"2017-10-10 10:10:10"},
		              {"win_amount":100,"raw_add_time":"2017-10-10 10:10:10"},
		              {"win_amount":100,"raw_add_time":"2017-10-10 10:10:10"},
		              {"win_amount":100,"raw_add_time":"2017-10-10 10:10:10"},
		              {"win_amount":100,"raw_add_time":"2017-10-10 10:10:10"},
		              {"win_amount":100,"raw_add_time":"2017-10-10 10:10:10"},
		              {"win_amount":100,"raw_add_time":"2017-10-10 10:10:10"},
		              {"win_amount":100,"raw_add_time":"2017-10-10 10:10:10"},
		              {"win_amount":100,"raw_add_time":"2017-10-10 10:10:10"},

		        ] 
		    }
		}*/

		let myRewards = data.info ; 
		let result = [] ;

		if(data.code !== 0 ){
			return;
		}

		myRewards.forEach((item , index) => {
			let _myRewards = myRewards[index];

			result.push({
				order: index+1 , 
				amount:  UTILS.getActiveStr(parseInt(_myRewards.win_amount), 10),
				time: _myRewards.raw_add_time
			})

		})

		// 我的战绩
		this.list_rank_gains.array = result;

		if(myRewards.length === 0 ){

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

	// 日周月排行榜
	renderRankList(response) {
/*		let response = {
        	"code":"0",
        	"data":[
	        	{"rank":0,"userid":2421710,"amount":"60.0000","rank_trend":3,"gameid":1052,"period":1,"nickname":"senko"},
	        	{"rank":2,"userid":12675964,"amount":"20.0000","rank_trend":3,"gameid":1052,"period":1,"nickname":"12****64"},
	        	{"rank":2,"userid":12675964,"amount":"20.0000","rank_trend":3,"gameid":1052,"period":1,"nickname":"12****64"},
	        	{"rank":3,"userid":12675964,"amount":"20.0000","rank_trend":1,"gameid":1052,"period":1,"nickname":"12****64"},
	        	{"rank":4,"userid":12675964,"amount":"20.0000","rank_trend":1,"gameid":1052,"period":1,"nickname":"12****64"},
	        	{"rank":5,"userid":12675964,"amount":"20.0000","rank_trend":3,"gameid":1052,"period":1,"nickname":"12****64"},
	        	{"rank":6,"userid":12675964,"amount":"20.0000","rank_trend":2,"gameid":1052,"period":1,"nickname":"12****64"},
	        	{"rank":7,"userid":12675964,"amount":"40.0000","rank_trend":2,"gameid":1052,"period":1,"nickname":"方书琴"},
	        	{"rank":8,"userid":12675964,"amount":"60.0000","rank_trend":3,"gameid":1052,"period":1,"nickname":"fangshuqin"}
	        ],
	        "myRank":52
    	}*/

		if(Number(response.code) !== 0){
			return;
		}
		
		let result = [];
		let myRank = Number(response.myRank);

		response.data.forEach((item , index) => {
			let trend = Number(item.rank_trend);

			result.push({
				rankIcon : index,
				rankNum : {
					text : index+1,
					visible : index >2 ? true : false
				},
				name : UTILS.getActiveStr(item.nickname , 9),
				point : UTILS.getActiveStr(parseInt(item.amount) , 10),
				trend :  {
					index : trend === 3 ? 0 : trend
				}
			})
		})

		this.tab_con.selectedIndex =0;
		this.list_rank_all.array = result;
		
		if(response.data.length === 0 ){
			// 已经登陆
			if(UTILS.checkLoginStatus()){

				this.isLoadingOrContent(0);
				this.myrank.text = "当前排名>50";
				this.my_rank_box.x = 50;

			}else{

				this.isLoadingOrContent(0);      //日周月不用判断是否是登陆状态
				this.myrank.text = "您尚未登录！";
				this.my_rank_box.x = 50;
			}
		}else{
			this.isLoadingOrContent(2);

			if( myRank > 0 && myRank < 51){

				this.myrank.text = myRank;
				this.my_rank_box.x = 90;

			}else if( myRank > 50 ){

				this.myrank.text = "当前排名>50";
				this.my_rank_box.x = 50;
			}else{

				this.myrank.text = "您尚未登录！";
				this.my_rank_box.x = 50;
			}
		}
	
	}

	// 出现
	myShow(messageCenter) {
		if(this.config.isFirst){
			// 触发
			this.dispatchAction(messageCenter);
			this.config.isFirst = false;

		}

		// 弹层显示
		this.popup();
	}


}