// 是否退出提示 && 金额不足或去充值或换别场
{
    const app = window.app;
    const quit_rechargePopUI = window.quit_rechargePopUI;

    class Quit_rechargePopUIDialog extends quit_rechargePopUI {
        constructor() {
            super();

            this.init();

        }

        init() {
            this.initDom();
            this.initEvent();

            this.initConfig();

            // 注册
            this.registerAction();

        }

        // 注册
        registerAction() {
            // 订阅弹层出现
            app.observer.subscribe('quit_rechargePopShow', this.myShow.bind(this));
        }

        initDom() {
            // 弹层大背景
            this.pop_bg = this.getChildByName('pop_bg');
            // 文本背景
            this.txt_bg = this.txt_box.getChildByName('txt_bg');
            // 文字主体
            this.txt_content = this.txt_box.getChildByName('txt_content');

            // 退出的确定按钮
            this.btn_quit_sure = this.quit.getChildByName('btn_sure');
            // 退出的取消按钮
            this.btn_quit_cancel = this.quit.getChildByName('close');

            // 去充值的确定按钮
            this.btn_less_sure = this.less.getChildByName('btn_sure');
            // 去充值的取消按钮
            this.btn_less_cancel = this.less.getChildByName('close');

        }

        initEvent() {

            // 两个取消关闭按钮
            this.btn_quit_cancel.on(Laya.Event.CLICK, this, ()=>{
                this.myClose();

                // 页面切换带来的事件(继续自动玩)
                app.room_ui_box && app.room_ui_box.pageChange(true, 2);

            });
            
            this.btn_less_cancel.on(Laya.Event.CLICK, this, this.myClose);

            // 确认退出
            this.btn_quit_sure.on(Laya.Event.CLICK, this, this.sureQuit);

            // 充值
            this.btn_less_sure.on(Laya.Event.CLICK, this, this.goToRecharge);


        }

        initConfig() {
            this.config = {
                isShow: false,
                txtBgDis: this.txt_content.y,
                popBgDis: this.pop_bg.height - this.txt_bg.height,
                quit: '离开房间将不能获得当前未结算的奖励，是否确认退出？',
                less: '您当前余额不足此房间最低带入要求，请先充值或选择其它房间'
            }

        }

        // 去充值
        goToRecharge() {
            this.myClose();

            app.observer.publish("rechargePopShow");

        }

        // 确认退出
        sureQuit() {
            this.myClose();

            // 加载弹层显示
            app.observer.publish('fruitLoadingShow');
            app.messageCenter.emit('exitRoom');

        }


        myShow(txt, boolean, context) {
            // 如果已经显示就不做处理
            if(this.config.isShow){
                return;
            }

            this.config.isShow = true;
            let _other = txt === 'quit' ? 'less' : 'quit';

            this.txt_content.text = context || this.config[txt];
            this[txt].visible = true;
            this[_other].visible = false;

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
            this.config.isShow = false;
            this.close();
        }

    }

    app.Quit_rechargePopUIDialog = Quit_rechargePopUIDialog;
}
