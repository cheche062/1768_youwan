/*
 *  惊喜奖
 */
{
    const app = window.app;
    const bigPrizePopUI = window.bigPrizePopUI;
    const Sail = window.Sail;

    class BigPrizePopUIView extends bigPrizePopUI {
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
            // 订阅弹层出现
            app.observer.subscribe('bigPrisePopShow', this.myShow.bind(this));

        }

        initDom() {
            // 太棒了
            this.addSkeleton('fantastic', { x: 392, y: 245 });
            // 完美
            this.addSkeleton('perfect', { x: 368, y: 245 });

            // 福袋
            this.addSkeleton('fudai', { x: 392, y: 265 });

            // 中奖金额
            this.dom_award = this.getChildByName('dom_award');
            this.dom_award.visible = false;
        }

        // 添加骨骼动画
        addSkeleton(type, { x, y }) {
            let dom = Sail.Utils.createSkeleton('images/animation/' + type);
            dom.pos(x, y);
            dom.visible = false;
            this.addChildAt(dom, 1);
            this['dom_' + type] = dom;
        }


        // 初始化配置参数
        initConfig() {
            this.config = {

            }
        }

        // 出现
        myShow(type, text, callback) {
            let dom_animate = this['dom_' + type];
            let x = (Laya.stage.width - this.width) / 2;
            let y = (Laya.stage.height - this.height) / 2;
            let delay = 0;

            // 福袋情况就延迟文案赋值
            if(type === 'fudai'){
                delay = 300;
            }

            dom_animate.visible = true;

            // 动画结束后关闭
            dom_animate.once(Laya.Event.STOPPED, this, () => {
                // 关闭自己
                this.myClose();

                dom_animate.visible = false;

                // 回调
                callback && callback();
            });

            dom_animate.play('start', false);
            this.pos(x, y);

            // 中奖金额动画
            Laya.timer.once(delay, this, ()=>{
                // 赋值
                this.dom_award.text = text;
                this.dom_award.visible = true;
                Laya.Tween.from(this.dom_award, {alpha: 0, scaleX: 3, scaleY: 2}, 200, Laya.Ease.linearIn);
                Laya.stage.addChild(this);
            })
        }

        // 关闭
        myClose() {
            this.dom_award.visible = false;
            this.removeSelf();
        }


    }

    app.BigPrizePopUIView = BigPrizePopUIView;


}
