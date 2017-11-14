// 公共模块
{
    const GM = window.GM;
    const app = window.app;
    const { ERROR_TEXT } = app.data;
    class CommonGameModule {
        constructor() {

            this.init();
        }

        init() {
            this.registerAction();
        }

        registerAction() {
            app.messageCenter
                .registerAction("losePointStatus", this.losePointStatusFn.bind(this)) // 输分禁用
                .registerAction("losePoint", this.losePointFn.bind(this)) // 输分提醒
                .registerAction("marquee", this.noticeMainHandler.bind(this)) // 跑马灯

        }

        // 初始化跑马灯
        initMarquee(dom) {
            let options = { colorHigh: '#75e8ff', fontSize: 20, bold: true };

            // 跑马灯内容
            this.marquee_ui_box = new app.MarqueeLaya(dom, options);
        }

        // 跑马灯渲染
        noticeMainHandler(data) {
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
            let total = n1 > n2 ? n1 : n2;
            let result;
            let isAdd = false; //是否进位
            if (total <= 10000) {
                result = 100;

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

            // 最后转数字
            result = Number(result);
            result = result > 500000 ? 500000 : result;

            return result;

        }

        // 输分提醒
        losePointFn(data) {
            let losePL = data;
            let _level = losePL.level;
            let text = `您的输分金额已达上限，故账户禁用开始时间：${losePL.beginTime}，禁用结束时间：${losePL.endTime}`;
            if (_level === 2 || _level === 3) {
                app.observer.publish('commonPopShow', text);
            }

            // 停止游戏
            app.observer.publish('resetGame');
        }

        // 黑名单输分禁用
        losePointStatusFn(data) {
            let text = '客官，您已被输分禁用，请联系客服！';
            app.observer.publish('commonPopShow', text);

            // 停止游戏
            app.observer.publish('resetGame');

        }

        //救济金
        jiujijin() {
            Laya.timer.once(3000, this, () => {
                if (window.GM && window.GM.socket_RJ && window.GM.socket_RJ.exec) {
                    // 延时确保服务器那边有了
                    window.GM.socket_RJ.exec();

                    // 更新余额
                    app.messageCenter.emitAjax("userAccount");

                }
            })
        }

        // 错误处理
        errorHandler(data) {
            let code = String(data.code);
            let text = '';
            let confirmCallBack = null;
            let cancelCallBack = null;
            // otp验证 
            if (code === '81') {
                app.utils.otpCheckHandler();

                return;
            }

            // 余额不足
            if(code === '5'){
                confirmCallBack = ()=>{app.observer.publish('rechargePopShow');}
            }

            // bonus已替换完成
            if(code === '24'){
                confirmCallBack = cancelCallBack = ()=>{window.location.reload()};
            }

            if(!(code in ERROR_TEXT)){
                code = '31';
            }

            text = ERROR_TEXT[code];
            app.observer.publish('commonPopShow', text, confirmCallBack, cancelCallBack);
        }
    }

    app.CommonGameModule = CommonGameModule;
}
