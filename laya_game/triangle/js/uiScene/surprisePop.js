/*
 *  惊喜奖
 */
{
    const app = window.app;
    const surprisePopUI = window.surprisePopUI;
    const Sail = window.Sail;

    class SurprisePopUIView extends surprisePopUI {
        constructor(...args) {
            super(...args);
            this.init();
        }

        init() {

            this.initDom();

            this.initConfig();

            this.initEvent();

            // 注册
            this.registerAction();

        }

        // 注册
        registerAction() {
            // 订阅弹层出现
            app.observer.subscribe('surprisePopShow', this.myShow.bind(this));

        }

        initDom() {
            let dom_animate = Sail.Utils.createSkeleton('images/animation/bonusAward');
            dom_animate.pos(660, 368);
            this.pop_box.addChildAt(dom_animate, 0);
            this.dom_animate = dom_animate;

            let dom_coins = Sail.Utils.createSkeleton('images/animation/coins');
            dom_coins.pos(673, 781);
            this.pop_box.addChildAt(dom_coins, 0);
            this.dom_coins = dom_coins;

            this.dom_award = this.pop_box.getChildByName('dom_award');
            this.btn_close = this.pop_box.getChildByName('btn_close');

        }

        initEvent(){
            this.btn_close.on(Laya.Event.CLICK, this, this.myClose);
        }

        // 初始化配置参数
        initConfig() {
            this.config = {
                closedCallBack: null //关闭后的回调
            }
        }

        // 金币动画
        coinsAnimation() {
            // 动画结束后关闭
            this.dom_coins.once(Laya.Event.STOPPED, this, () => {

                this.dom_coins.play('loop', true);
            });

            this.dom_coins.play('start', false);
        }

        // 出现
        myShow(text, callback) {
            this.height = Laya.stage.height;

            // 赋值
            this.dom_award.text = text;
            this.dom_award.alpha = 0;

            this.config.closedCallBack = callback;

            // 动画结束后关闭
            this.dom_animate.once(Laya.Event.STOPPED, this, () => {

                // 关闭自己
                Laya.timer.once(1500, this, ()=>{

                    // 金币动画停止
                    this.dom_coins.stop();

                    this.myClose();
                });
            });

            this.dom_animate.play('start', false);

            // 金币动画
            this.coinsAnimation();

            Laya.Tween.to(this.dom_award, { alpha: 1 }, 500, Laya.Ease.linearIn, null, 600);

            // 添加到舞台
            Laya.stage.addChild(this);
        }

        // 关闭
        myClose() {
            // 已经移除
            if(!this.parent){
                return;
            }
            this.config.closedCallBack && this.config.closedCallBack();
            this.config.closedCallBack = null;

            this.removeSelf();
        }
    }

    app.SurprisePopUIView = SurprisePopUIView;
}
