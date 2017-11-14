/*
 *  小三角
 */
{
    const app = window.app;
    const angleUI = window.angleUI;
    const requestAnimationFrame = window.requestAnimationFrame;
    const cancelAnimationFrame = window.cancelAnimationFrame;
    // 颜色与数字的对应
    const COLOR_TO_NUMBER = app.data.COLOR_TO_NUMBER;

    /*  '1' : {c:'灰色', m:0.1},
        '2' : {c:'紫色', m:0.2},
        '3' : {c:'浅蓝色', m:0.5},
        '4' : {c:'红色', m:1.5},
        '5' : {c:'绿色', m:3},
        '6' : {c:'蓝色', m:4},
        '7' : {c:'黄色', m:5},
        '8' : {c:'彩色', m:10}*/

    class AngleView extends angleUI {
        constructor(cb) {
            super();
            this.init();
            // 点击回调
            this.clickHandlerCallBack = cb;
        }

        init() {
            this.initDom();

            this.initConfig();

            // 初始化事件
            this.initEvent();

        }

        // 初始化配置参数
        initConfig() {

            this.bonusPos = null;

            this.curve = null; // 贝塞尔曲线
            this.isUp = null; // 是否向上
            this.animateType = null; // 动画类型（方向 & 颜色，都包含在内）
            this.count = 0; // 计数
            this.timer = null; // requestAnimationFrame
            this.isStop = true; // 是否是停止状态
            this.isBonus = true; // 是否是bonus
        }

        // 获取元素
        initDom() {
            this.dom_btn_text = this.getChildByName('btn_text');

        }

        initEvent() {
            // 给隐藏的label添加事件
            this.dom_btn_text.on(Laya.Event.CLICK, this, this.clickHandler);

        }

        // 点击事件
        clickHandler(){
            this.clickHandlerCallBack(this);
        }

        // 进场
        enter(callback, index) {
            // 清除
            cancelAnimationFrame(this.timer);
            this.timer = null;
            this.isStop = false;
            this.count = 0;

            let current = 0;
            let step = 3.5;
            let { x, y } = this.curve.get(current);
            this.pos(x, y);
            this.scaleX = current;
            this.scaleY = current;

            let stepHandler = () => {
                if (this.isStop) {
                    let dom = this.getChildAt(0); 
                    dom.once(Laya.Event.STOPPED, this, () => {
                        callback && callback(index);
                    })

                    // 进场结束后旋转动画
                    dom.play(this.animateType + '_start', false);

                    cancelAnimationFrame(this.timer);
                    this.timer = null;

                } else {
                    this.count += step;
                    if (this.count >= 100) {
                        this.count = 100;
                        this.isStop = true;
                    }

                    let _count = this.count;
                    let rate = _count / 100;
                    let { x, y } = this.curve.get(rate);
                    this.scaleX = rate;
                    this.scaleY = rate;
                    this.pos(x, y);

                    this.timer = requestAnimationFrame(stepHandler);
                }
            }

            this.timer = requestAnimationFrame(stepHandler);
        }

        // 离场
        exit(callback, index) {
            // 清除
            cancelAnimationFrame(this.timer);
            this.timer = null;
            this.isStop = false;
            this.count = 100;

            let current = 1
            let step = -3.5;

            let { x, y } = this.curve.get(current);
            this.pos(x, y);
            this.scaleX = current;
            this.scaleY = current;

            let stepHandler = () => {
                if (this.isStop) {
                    // 离场结束后销毁骨骼动画 && 移除自己
                    let dom = this.getChildByName('angle');
                    if(dom){
                        dom.destroy(true);
                    }
                    this.removeSelf();

                    // 动画结束后回调
                    callback && callback(index);

                    cancelAnimationFrame(this.timer);
                    this.timer = null;

                } else {
                    this.count += step;
                    if (this.count <= 0) {
                        this.count = 0;
                        this.isStop = true;
                    }

                    let _count = this.count;
                    let rate = _count / 100;
                    let { x, y } = this.curve.get(rate);
                    this.scaleX = rate;
                    this.scaleY = rate;
                    this.pos(x, y);

                    this.timer = requestAnimationFrame(stepHandler);
                }
            }

            // 判断是否动画后在运动
            this.timer = requestAnimationFrame(stepHandler);
        }

        // 删除消减(去除高光线， 动画完结后的回调)
        cancelAngle(cb1, cb2, index) {
            let dom = this.getChildByName('angle');
            dom.once(Laya.Event.STOPPED, this, () => {
                cb1(index);
                cb2(index);
            })

            // 旋转动画
            dom.play(this.animateType + '_start', false);
        }

        // 旋转
        rotateAnimate(callback){
            let dom = this.getChildAt(0);
            dom.once(Laya.Event.STOPPED, this, () => {
                Laya.timer.once(50, this, ()=>{
                    callback && callback();
                })
            })

            // 进场结束后旋转动画
            dom.play(this.animateTypeNoBonus + '_start', false);
        }

        // 添加贝塞尔曲线
        addCurve(curve) {
            this.curve = curve;

            return this;
        }

        //添加是否向上属性
        addIsUpProperty(isUp) {
            this.isUp = isUp;
            this.upOrDown = this.isUp ? 'up' : 'down';
            this.animateTypeNoBonus = `${this.upOrDown}_no`;
            let y = this.dom_btn_text.y;
            this.dom_btn_text.y = isUp ? y + 10 : y - 10;

            return this;
        }

        // 移除bonusIcon
        removeBonusIcon(){
            this.isBonus = false;
            this.animateType = this.animateTypeNoBonus;
            this.getChildByName('angle').play(`${this.upOrDown}_no_static`, false);
        }
        
        // 渲染皮肤 & bonus
        renderSkin(c, b) {
            let isB = b === 1 ? 'yes' : 'no';
            this.isBonus = Boolean(b);
            this.color = c;
            this.animateType = `${this.upOrDown}_${isB}`;
            this.createAnimate(c);
            this.getChildByName('angle').play(this.animateType + '_static', false);
        }

        // 创建骨骼动画(必须手动创建否则动画相互间会有影响，原因不详)
        createAnimate(color) {
            let old = this.getChildByName('angle');
            if(old){
                old.destroy(true);
            }
            let colorType = COLOR_TO_NUMBER[Number(color) - 1];
            let mFactory = new Laya.Templet();
            let getRes = Laya.loader.getRes;
            mFactory.parseData(getRes(`images/animation/triangle/${colorType}.png`), getRes(`images/animation/triangle/${colorType}.sk`));
            let maidenArmat = mFactory.buildArmature();
            maidenArmat.pos(61, 61);
            maidenArmat.name = 'angle';
            this.addChildAt(maidenArmat, 0);
        }

    }

    app.AngleView = AngleView;
}
