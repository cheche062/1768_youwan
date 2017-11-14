// 公共模块
import { observer, messageCenter } from '../init_module';
import { ERROR_TEXT } from '../../config/data';
import MarqueeLaya from '../../common/laya.marquee';



export default class CommonGameModule {
    constructor() {

        CommonGameModule.instance = this;
    }

    static getInstance() {
        return this.instance || new this();
    }

    registerAction(messageCenter, observer) {
        messageCenter.registerAction("losePointStatus", this.losePointStatusFn.bind(this)) // 输分禁用
        messageCenter.registerAction("losePoint", this.losePointFn.bind(this)) // 输分提醒

        observer.subscribe("msg::marquee", this.marqueeHandler.bind(this)) // 跑马灯
    }

    // 初始化跑马灯
    initMarquee(dom) {
        let options = { colorHigh: '#75e8ff', fontSize: 22, bold: true };

        // 跑马灯内容
        this.marquee_ui_box = new MarqueeLaya(dom, options);
    }

    // 跑马灯渲染
    marqueeHandler(data) {
        if (Number(data.code) === 0) {
            this.marquee_ui_box.start(data.notice);
        }
    }

    // 是否要显示返回按钮
    isShowBtnBackHandler(dom) {
        // Laya 返回按钮
        if (window.GM && GM.isCall_out === 1 && GM.isShowBtnBack_out && GM.btnBackCall_out) {
            dom.visible = true; // 显示返回按钮
            dom.on(Laya.Event.CLICK, null, GM.btnBackCall_out);
        }
    }

    // 是否要显示home主页按钮
    isShowBtnHomeHandler(dom) {
        if (GM.backHomeUrl) {
            // 显示按钮
            dom.visible = true;
            // 绑定事件
            dom.on(Laya.Event.CLICK, null, () => { location.href = GM.backHomeUrl; });
        }
    }

    // 系统公告
    noticeSystem(menu_box, height) {
        let btn_notice = menu_box.getChildByName('btn_notice');
        let dom_red = btn_notice.getChildByName('red');

        let noticeCallBack = (data = {}) => {
            // 是否显示系统公告
            if (!data.isShowNotice) {

                return;
            }

            // 是否需要显示小红点
            if (data.isShowRedPoint) {
                // 显示小红点
                dom_red.visible = true;
            }

            btn_notice.on(Laya.Event.CLICK, this, () => {
                // 直接隐藏小红点
                dom_red.visible = false;
                menu_box.visible = false;
                GM.noticePopShow_out && GM.noticePopShow_out();
            });

            // 显示出公告按钮
            btn_notice.visible = true;

            // 长背景
            menu_box.getChildByName('bg').height = height;
        }

        if (window.GM && GM.isCall_out === 1 && GM.noticeStatus_out) {
            GM.noticeStatus_out(noticeCallBack);
        }
    }


    // 默认提示押注额提示
    defaultInputNotice(n1, n2) {
        let total = Math.max(n1, n2);
        let result;
        let isAdd = false; //是否进位
        if (total <= 10000) {
            result = 250;

        } else {
            result = Math.ceil(total / 100);

            // 先转字符串
            result = String(result);
            for (let i = 1, l = result.length; i < l; i++) {
                if (result[i] !== '0') {
                    isAdd = true;
                }
            }
            result = isAdd ? Number(result[0]) + 1 + result.slice(1).replace(/\d/g, '0') : result;
        }

        return Number(result);

    }

    // 输分提醒
    losePointFn(data) {
        let losePL = data;
        let _level = losePL.level;
        let text = `您的输分金额已达上限，故账户禁用开始时间：${losePL.beginTime}，禁用结束时间：${losePL.endTime}`;
        if (_level === 2 || _level === 3) {
            // 停止游戏
            observer.publish('game::reset');
            
        }else if(_level === 1){
            text = '今天输分金额即将达到上限，注意休息...'
        }

        observer.publish('common::tips', text);
    }

    // 黑名单输分禁用
    losePointStatusFn(data) {
        let text = '客官，您已被输分禁用，请联系客服！';
        observer.publish('common::tips', text);

        // 停止游戏
        observer.publish('game::reset');

    }

    //救济金
    jiujijin() {
        Laya.timer.once(3000, this, () => {
            if (window.GM && window.GM.socket_RJ && window.GM.socket_RJ.exec) {
                // 延时确保服务器那边有了
                window.GM.socket_RJ.exec();

                // 更新余额
                messageCenter.emitAjax("userAccount");

            }
        })
    }

    // 错误处理
    errorHandler(data) {
        let code = String(data.code);
        let text = '';
        let confirmCallBack = null;
        let cancelCallBack = null;

        // 接口返回正常直接返回
        if(code === '0'){
            return false;
        }

        let reload = () => window.location.reload();

        switch (code){
            // otp验证 
            case '81':
                UTILS.otpCheckHandler();
                return;

                break;

            // 余额不足
            case '5':
                confirmCallBack = () => { observer.publish('pop::recharge'); }
                break;
            case '21':
                confirmCallBack = cancelCallBack = reload;
                break;
        }

        // 没有这项默认为31错误码
        if(!ERROR_TEXT.hasOwnProperty(code)){
            code = '31';
        }

        text = ERROR_TEXT[code];
        observer.publish('common::tips', text, confirmCallBack, cancelCallBack);

        return true;

    }
}
