/*
 *  福袋弹层
 */
{
    const app = window.app;
    const winPopUI = window.winPopUI;

    class WinPopView extends winPopUI {
        constructor(...args) {
            super(...args);
            this.init();
        }

        init() {

            this.initDom();

            this.initConfig();

            this.reset();

            // 注册
            this.registerAction();

        }

        // 注册
        registerAction() {
            // 订阅弹层出现
            app.observer.subscribe('winPopShow', this.myShow.bind(this));


        }

        initDom() {

            // 动画dom
            this.dom_animate = this.getChildByName('dom_animate');
            this.dom_animate.stop();

            // 赢得金额
            this.dom_award = this.getChildByName('dom_award');
            // 外圈倍率
            this.dom_outer = this.getChildByName('dom_outer');
            // 内圈倍率
            this.dom_inner = this.getChildByName('dom_inner');

        }

        // 初始化配置参数
        initConfig() {
            this.config = {
                currentIndex: 0,
                delayArr: [50, 200, 500],   //延迟时间数组
                arrPos: [this.dom_outer.y, this.dom_inner.y, this.dom_award.y]  //由上至下的y坐标
            }
        }

        initEvent() {

        }

        // 文字渐变出现
        textAnimate(obj){
            let i = this.config.currentIndex++;
            obj.y = this.config.arrPos[i];
            Laya.timer.once(this.config.delayArr[i], this, ()=>{
                obj.visible = true;
                Laya.Tween.from(obj, {alpha: 0, y: obj.y - 50}, 500, Laya.Ease.linearIn);
            });
        }

        // 出现
        myShow(outer, inner, award, type, callback) {

            // 居中
            this.x = Math.floor((Laya.stage.width - this.width)/2);

            // 赋值
            this.dom_award.text = award;
            this.dom_inner.text = inner;
            this.dom_outer.text = outer;

            // 动画结束后关闭
            this.dom_animate.once(Laya.Event.STOPPED, this, ()=>{
                // 关闭自己
                this.myClose();

                // 回调
                callback && callback();
            });

            this.dom_animate.play('start', false);
            this.zOrder = 2;

            // 内圈的字体颜色
            this.dom_inner.font = type === 'y'? 'yellow_font' : 'blue_font';
            this.textAnimate(this.dom_inner);
            // 不为1倍时显示
            if(outer !== '*1'){
                this.textAnimate(this.dom_outer);
            }
            this.textAnimate(this.dom_award);

            Laya.stage.addChild(this);

        }

        // 重置
        reset(){
            this.config.currentIndex = 0;
            this.dom_award.visible = false;
            this.dom_outer.visible = false;
            this.dom_inner.visible = false;
        }

        // 关闭
        myClose() {
            this.zOrder = 1;
            this.removeSelf();
            this.reset()

        }


    }

    app.WinPopView = WinPopView;


}
