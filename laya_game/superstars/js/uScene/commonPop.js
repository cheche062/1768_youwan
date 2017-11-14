// 公共小提示弹层
{
    const app = window.app;
    const commonPopUI = window.commonPopUI;
    const warmNoticeUI = window.warmNoticeUI;

    class CommonPopDialog extends commonPopUI {
        constructor() {
            super();

            this.init();

        }

        init() {
            this.initDom();
            this.initEvent();

            this.initConfig();

        }

        initDom() {
            // 弹层大背景
            this.pop_bg = this.getChildByName('pop_bg');
            // 确定按钮
            this.btn_sure = this.btn_box.getChildByName('btn_sure');
            // 取消按钮
            this.btn_no = this.btn_box.getChildByName('btn_no');

            // 文本背景
            this.txt_bg = this.txt_box.getChildByName('txt_bg');
            // 文字主体
            this.txt_content = this.txt_box.getChildByName('txt_content');


        }

        initEvent() {

            // 确定关闭按钮
            this.btn_sure.on(Laya.Event.CLICK, this, this.myClose);

            // 关闭按钮
            this.btn_no.on(Laya.Event.CLICK, this, this.close);

            // 订阅弹层出现
            app.observer.subscribe('commonPopShow', this.myShow.bind(this));
        }

        initConfig() {
            this.config = {
                limitTime: false, //限制时间
                txtBgDis: this.txt_content.y,
                popBgDis: this.pop_bg.height - this.txt_bg.height,
                'timeout': '由于超时未操作，系统以为您退出房间！',
                'unstable': '客观，您的网络不稳定，请检查网络！'
            }

            this.callback = null;
        }

        myShow(txt, boolean = true, callback) {
            let _txt = this.config[txt] ? this.config[txt] : txt;

            // 内容已经在弹出来了(防止多次弹出相同内容)
            if (this.txt_content.text === _txt && this.config.limitTime) {

                return;
            }

            this.config.limitTime = true;
            Laya.timer.once(3000, this, () => { this.config.limitTime = false; });

            this.txt_content.text = _txt;

            let _displayH = this.txt_content.displayHeight;

            this.txt_bg.height = this.config.txtBgDis * 2 + _displayH;
            this.pop_bg.height = this.config.popBgDis + this.txt_bg.height;
            this.height = this.pop_bg.height;

            if (typeof callback === 'function') {
                this.callback = callback;

            } else {
                this.callback = null;
            }

            if (boolean) {
                this.popup();

            } else {
                this.show();
            }
        }

        myClose() {
            if (typeof this.callback === 'function') {
                this.callback();

                this.callback = null;
            }
            this.txt_content.text = '';
            this.close();
        }

    }


    class WarmNoticePopDialog extends warmNoticeUI {
        constructor() {
            super();

            this.init();

        }

        init() {
            this.initDom();
            this.initEvent();

            this.initConfig();

        }

        initDom() {
            // 弹层大背景
            this.pop_bg = this.getChildByName('pop_bg');
            // 确定按钮
            this.btn_sure = this.btn_box.getChildByName('btn_sure');

            // 文本背景
            this.txt_bg = this.txt_box.getChildByName('txt_bg');
            // 文字主体
            this.txt_content = this.txt_box.getChildByName('txt_content');


        }

        initEvent() {

            // 确定关闭按钮
            this.btn_sure.on(Laya.Event.CLICK, this, this.close);

            // 订阅弹层出现
            app.observer.subscribe('warmNoticePopShow', this.myShow.bind(this));

            // 自动关闭
            app.observer.subscribe('warmNoticePopHide', this.myClose.bind(this));
        }

        initConfig() {
            this.config = {
                limitTime: false, //限制时间
                txtBgDis: this.txt_content.y,
                popBgDis: this.pop_bg.height - this.txt_bg.height
            }

            this.callback = null;
        }

        myShow(txt, boolean = true, callback) {
            let _txt = this.config[txt] ? this.config[txt] : txt;

            // 内容已经在弹出来了(防止多次弹出相同内容)
            if (this.txt_content.text === _txt && this.config.limitTime) {

                return;
            }
            
            this.config.limitTime = true;
            Laya.timer.once(3000, this, () => { this.config.limitTime = false; });

            this.txt_content.text = _txt;

            let _displayH = this.txt_content.displayHeight;

            this.txt_bg.height = this.config.txtBgDis * 2 + _displayH;
            this.pop_bg.height = this.config.popBgDis + this.txt_bg.height;
            this.height = this.pop_bg.height;

            if (boolean) {
                this.popup();

            } else {
                this.show();
            }
        }

        myClose() {

            this.txt_content.text = '';
            this.close();

        }

    }

    app.CommonPopDialog = CommonPopDialog;
    app.WarmNoticePopDialog = WarmNoticePopDialog;

}
