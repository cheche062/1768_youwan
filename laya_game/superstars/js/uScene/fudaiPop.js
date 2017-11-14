/*
 *  福袋弹层
 */
{
    const app = window.app;
    const fudaiPopUI = window.fudaiPopUI;

    class FudaiPopUIDialog extends fudaiPopUI {
        constructor(...args) {
            super(...args);
            this.init();
        }

        init() {

            this.initDom();

            this.initConfig();

            this.addMask();

            // 注册
            this.registerAction();

        }

        // 注册
        registerAction() {

            // 订阅弹层出现
            app.observer.subscribe('fudaiPopShow', this.myShow.bind(this));

        }

        // 触发
        dispatchAction(data) {

            // 更新用户钥匙数目
            // app.observer.publish('updateKeyNum', Number(data.totalKeys));

            // 更新用户余额
            app.messageCenter.emitAjax("userAccount");
        }

        initDom() {

            this.dom_fudai.stop();



        }

        // 初始化配置参数
        initConfig() {
            this.config = {
                MASK_W: this.dom_content_box.width,
                MASK_H: this.dom_content_box.height,
                currentW: 0 //遮罩当前的宽
            }
        }

        initEvent() {

        }

        // 添加遮罩
        addMask() {
            this.text_content.mask = new Laya.Sprite();
        }

        // 遮罩变化
        maskChange() {
            this.config.currentW += 16;
            let _x = this.config.MASK_W / 2 - this.config.currentW / 2;
            if (_x <= 0) {
                Laya.timer.clear(this, this.maskChange);
                return;

            }
            this.text_content.mask.graphics.clear();
            this.text_content.mask.graphics.drawRect(_x, 0, this.config.currentW, this.config.MASK_H, '#000000');
        }

        // 开启遮罩动画
        maskAnimateGo() {
            Laya.timer.loop(50, this, this.maskChange);
        }

        // 出现
        myShow(data, callback) {
            if(Number(data.code) !== 0){
                return;
            }

            this.dom_fudai.once(Laya.Event.STOPPED, this, () => {
                this.dom_fudai.play('loop', true);

                // 更新钥匙数量
                callback && callback(data.totalKeys);
                Laya.timer.once(5000, this, this.reset);
            });

            // 开启遮罩动画
            this.maskAnimateGo();

            this.dom_fudai.play('start', false);

            this.text_content.text = data.amount;

            // 触发
            this.dispatchAction(data);

            this.popup();
        }

        // 重置
        reset() {
            this.dom_fudai.stop();
            Laya.timer.clear(this, this.maskChange);
            this.config.currentW = 0;
            this.close();
        }


    }

    app.FudaiPopUIDialog = FudaiPopUIDialog;


}
