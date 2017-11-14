/*
 *  赢取底部的动画
 */
{
    const app = window.app;
    const winUI = window.winUI;

    class WinUIView extends winUI {
        constructor(...args) {
            super(...args);
            this.init();
        }

        init() {

            this.initDom();

            this.initConfig();

            // 注册
            this.registerAction();

        }

        // 注册
        registerAction() {

            app.observer
                .subscribe('winOpen', this.winOpen.bind(this)) // 打开
                .subscribe('winClose', this.winClose.bind(this)) // 关闭


        }

        initDom() {
            this.win_text.visible = false;
            this.win_skeleton.play('close_static', false);

        }

        // 初始化配置参数
        initConfig() {
            this.config = {
                award: 0
            }
        }

        // 出现
        winOpen(text) {
            let num = Number(text);

            if (this.config.award !== 0) {
                this.config.award = this.config.award + num;
                this.win_text.text = this.config.award;

                return;
            }

            this.config.award = num;

            // 动画结束后关闭
            this.win_skeleton.once(Laya.Event.STOPPED, this, () => {
                this.win_text.text = String(this.config.award);
                this.win_text.visible = true;
            });

            this.win_skeleton.play('open_animate', false);

        }

        // 关闭
        winClose() {
            if (this.config.award === 0) {
                return;
            }

            this.win_text.visible = false;
            this.config.award = 0;
            this.win_skeleton.play('close_animate', false);

        }


    }

    app.WinUIView = WinUIView;


}
