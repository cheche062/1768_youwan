/**
	美金大赛结束记录
*/
import UTILS from "../../config/utils.js";

//io模块 && 顶层观察者，各模块间可以通过观察者来通信 && 场景管理器
import { messageCenter, observer } from '../../module/init_module';

export class MatchFinishPopDialog extends matchFinishPopUI {

    constructor(...args) {
        super(...args);
        this.init();
    }

    init() {
        this.initDom();

        // this.initConfig();

        this.initEvent();

        this.initReset();

    }

    // 注册
    registerAction({ messageCenter, observer }) {
        // 数据传输
        // messageCenter.registerAction("matchResult", this.renderMatchResult.bind(this));

        observer.subscribe("matchResult", this.renderMatchResult.bind(this));

    }


    initDom() {
        // 关闭按钮
        this.dom_close_btn1 = this.getChildByName("close_btn1");
        this.dom_close_btn2 = this.getChildByName("close_btn2");

    }

    // 初始化参数配置
    /*initConfig() {
    	this.config = {
    		isFirst :true
    	}
    }*/

    // 初始化事件
    initEvent() {

        this.dom_close_btn1.on(Laya.Event.CLICK, this, this.confirmClose);
        this.dom_close_btn2.on(Laya.Event.CLICK, this, this.confirmClose);

        // 未登录
        this.dom_unloaded.on(Laya.Event.CLICK, this, UTILS.gotoLogin);
    }

    // 重置
    initReset() {

        this.rankTitle.visible = false;
        this.amountTitle.visible = false;
        this.rankTips.visible = false;
        this.matchFile.visible = false;
    }

    // 加载中或者显示数据
    isLoadingOrContent(type) {
        // 暂无数据
        if (type === 0) {
            this.dom_loading.visible = true;
            this.dom_loading.text = "虚位以待……";
            this.awardResult.visible = false;
            this.dom_unloaded.visible = false;

            // 加载中
        } else if (type === 1) {
            this.dom_loading.visible = true;
            this.dom_loading.text = "加载中……";
            this.awardResult.visible = false;
            this.dom_unloaded.visible = false;

            //显示内容 
        } else if (type === 2) {
            this.dom_loading.visible = false;
            this.awardResult.visible = true;
            this.dom_unloaded.visible = false;

            //未登录 
        } else if (type === 3) {
            this.dom_loading.visible = false;
            this.awardResult.visible = false;
            this.dom_unloaded.visible = true;
        }
    }


    renderMatchResult(data) {

        /*		let data = {
        			"cmd": "matchResult",
        		    "code": 0,
        		    "result": [
        	            {
        	                "extra_amount": 82,
        	                "rank": 1,
        	                "win_amount": 7536,
        	                "user_id": 40813152,
        	                "user_name": "贫僧夜探青楼",
        	                "isPrizeOk": 1
        	            }
        		        ],
        		    "myRank": {
        		            "extra_amount": '1111234562220',
        		            "rank": '340',
        		            "win_amount": 1910,
        		            "user_id": 2037610954,
        		            "user_name": "qianqian",
        		            "isPrizeOk": 1
        		    },
        		    "nextTime": {
                    	"start": "12:00~13:00",
                    	"end": 0
                	}
        		}*/

        this.myshow();

        let matchResult = data.result;
        let myMatchResult = data.myRank;
        let result = [];

        if (Number(data.code) !== 0) {
            return;
        }

        // 重置一下
        this.initReset();

        matchResult.forEach((item, index) => {
            let _matchResult = item;
            result.push({
                rankIcon: index,
                rankNum: {
                    text: index + 1,
                    visible: index > 2 ? true : false
                },
                nick: UTILS.getActiveStr(_matchResult.user_name, 9),
                winAmount: UTILS.getActiveStr(parseInt(_matchResult.win_amount), 10),
                deviceAmount: UTILS.getActiveStr(parseInt(_matchResult.extra_amount), 10)

            })
        })

        this.list_rank_all.array = result;


        if (Number(myMatchResult.rank) > 0 && Number(myMatchResult.extra_amount) > 0) {

            this.my_rank.text = myMatchResult.rank;
            this.my_amount.text = myMatchResult.extra_amount;

            this.rankTitle.visible = true;
            this.amountTitle.visible = true;

        } else if (Number(myMatchResult.rank) > 0 && Number(myMatchResult.extra_amount) <= 0) {

            this.my_rank.text = myMatchResult.rank;

            this.rankTitle.visible = true;
            this.rankTips.visible = true;

        } else if (Number(myMatchResult.rank) <= 0 && Number(myMatchResult.extra_amount) <= 0) {

            this.matchFile.visible = true;
            this.nextTime.text = data.nextTime.start;

        }


        let rank_move_width = this.my_rank.displayWidth - 20;
        let amount_move_width = this.my_amount.displayWidth - 25;

        this.txt_title03.x = 213 + rank_move_width;
        this.txt_title05.x = 108 + amount_move_width;

        this.rankTitle.x = (1334 - this.rankTitle.width) / 2;
        this.amountTitle.x = (1334 - this.amountTitle.width) / 2;

        this.tipsTime.x = (880 - this.tipsTime.width) / 2;

        if (matchResult.length === 0) {
            // 已经登陆
            if (UTILS.checkLoginStatus()) {
                this.isLoadingOrContent(0);
            } else {
                this.isLoadingOrContent(3);
            }

        } else {
            this.isLoadingOrContent(2);
        }



    }

    // 弹层出现
    myshow() {
        this.isLoadingOrContent(1);
        // 控制点击遮罩区域不关闭弹层
        window.UIConfig.closeDialogOnSide = false;
        this.popup();
    }

    // 关闭时候发命令
    confirmClose() {
        messageCenter.emit('confirm');
        window.UIConfig.closeDialogOnSide = true;
        this.close();
    }

}