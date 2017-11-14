// 公共小提示弹层
{
    const app = window.app;
    const commonPopUI = window.commonPopUI;
    const onlyReadPopUI = window.onlyReadPopUI;
    const advertisePopUI = window.advertisePopUI;
    const normalPopUI = window.normalPopUI;


    // 简单普通的提示层
    class NormalPopDialog extends normalPopUI {
        constructor() {
            super();

            this.init();

        }

        init() {
            this.initConfig();

            // 订阅弹层出现
            app.observer.subscribe('normalPopShow', this.myShow.bind(this));

        }

        initConfig() {
            this.config = {
                txtBgDis: this.txt_content.y + 5
            }
        }

        myShow(txt) {
            // 内容已经在弹出来了(防止多次弹出相同内容)
            if(this.txt_content.text === txt){

                return;
            }

            this.txt_content.text = txt;

            let _displayH = this.txt_content.displayHeight;
            let totalHeight = this.config.txtBgDis * 2 + _displayH;
            this.txt_bg.height = totalHeight;
            this.height = totalHeight;

            this.show();

            Laya.timer.clear(this, this.myClose);
            Laya.timer.once(2000, this, this.myClose);

        }

        myClose() {
            this.txt_content.text = '';
            this.close();
        }
    }

    // 广告
    class AdvertisePopDialog extends advertisePopUI {
        constructor() {
            super();

            this.init();

        }

        init() {

            this.initEvent();

            // 订阅弹层出现
            app.observer.subscribe('advertisePopShow', this.myShow.bind(this));

        }

        // 事件初始化
        initEvent(){

            // 点击图片关闭
            this.on(Laya.Event.CLICK, this, this.myClose);

        }

        myShow(data) {
            this.img.skin = data;

            this.popup();

            Laya.timer.once(5000, this, this.myClose);
        }

        myClose() {

            this.close();
        }

    }

    class OnlyReadPopDialog extends onlyReadPopUI {
        constructor() {
            super();

            this.init();

        }

        init() {
            this.initDom();

            this.initConfig();

            // 订阅弹层出现
            app.observer.subscribe('onlyReadPopShow', this.myShow.bind(this));

        }

        initDom() {
            // 弹层大背景
            this.pop_bg = this.getChildByName('pop_bg');

            // 文本背景
            this.txt_bg = this.txt_box.getChildByName('txt_bg');
            // 文字主体
            this.txt_content = this.txt_box.getChildByName('txt_content');

        }

        initConfig() {
            this.config = {
                txtBgDis: this.txt_content.y,
                popBgDis: this.pop_bg.height - this.txt_bg.height
            }
        }

        myShow(txt) {
            // 内容已经在弹出来了(防止多次弹出相同内容)
            if(this.txt_content.text === txt){

                return;
            }

            this.txt_content.text = txt;

            let _displayH = this.txt_content.displayHeight;
            this.txt_bg.height = this.config.txtBgDis * 2 + _displayH;
            this.pop_bg.height = this.config.popBgDis + this.txt_bg.height;
            this.height = this.pop_bg.height;

            this.show();

            Laya.timer.clear(this, this.myClose);
            Laya.timer.once(2000, this, this.myClose);

        }

        myClose() {
            this.txt_content.text = '';
            this.close();
        }

    }

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

            // 文本背景
            this.txt_bg = this.txt_box.getChildByName('txt_bg');
            // 文字主体
            this.txt_content = this.txt_box.getChildByName('txt_content');

        }

        initEvent() {

            // 确定关闭按钮
            this.btn_sure.on(Laya.Event.CLICK, this, this.myClose);

            // 关闭按钮
            this.btn_close.on(Laya.Event.CLICK, this, this.myClose);

            // 订阅弹层出现
            app.observer.subscribe('commonPopShow', this.myShow.bind(this));
        }

        initConfig() {
            this.config = {
                txtBgDis: this.txt_content.y,
                popBgDis: this.pop_bg.height - this.txt_bg.height,
                'timeout': '由于超时未操作，系统以为您退出房间！',
                'unstable': '客观，您的网络不稳定，请检查网络！'
            }

            this.callback = null;
        }

        myShow(txt, boolean, callback) {
            let _txt = this.config[txt] ? this.config[txt] : txt;

            // 内容已经在弹出来了(防止多次弹出相同内容)
            if(this.txt_content.text === _txt){

                return;
            }

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

    app.CommonPopDialog = CommonPopDialog;
    app.OnlyReadPopDialog = OnlyReadPopDialog;
    app.AdvertisePopDialog = AdvertisePopDialog;
    app.NormalPopDialog = NormalPopDialog;
}
