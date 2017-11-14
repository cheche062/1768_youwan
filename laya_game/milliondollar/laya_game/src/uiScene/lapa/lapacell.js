// 单个项
import { createSkeleton } from '../../common/laya.custom';
import UTILS from '../../config/utils';
import { DOLLAR_TYPE_LIST } from '../../config/data';

const requestAnimationFrame = window.requestAnimationFrame;
const cancelAnimationFrame = window.cancelAnimationFrame;

export default class LapaCell extends Laya.Sprite {
    constructor(stateList, initState, endCallBack, initSkin) {
        super()

        // 状态列表
        this.stateList = stateList;
        // 初始状态
        this.initState = initState;
        // 当前状态
        this.currentState = initState;
        this.initSkin = initSkin;
        this.endCallBack = endCallBack;
        this.init()
    }

    init() {
        this.shouldStop = false;

        // 添加中奖高光的骨骼动画
        if (this.initState !== 0) {
            this.addSkeleton();
        }
        // 美元皮肤
        this.renderDollarSkin(this.initSkin);

    }

    addSkeleton() {
        let dom = this.domSkele = createSkeleton('images/animate/icon', 60);
        dom.visible = false;
        dom.set({ scaleX: 1.2, scaleY: 0.8 });
        dom.set(this.stateList[this.currentState]);
        dom.y = dom.y + 7;

        this.addChild(dom);
    }

    // 渲染美元皮肤
    renderDollarSkin(skin) {
        if (skin) {
            skin = DOLLAR_TYPE_LIST[skin - 1];
        } else {
            if (this.initState === 0) {
                skin = DOLLAR_TYPE_LIST[this.initSkin - 1];
            } else {
                skin = DOLLAR_TYPE_LIST[UTILS.randomNumber(DOLLAR_TYPE_LIST.length - 1)];
            }
        }

        this.createAnimation(skin);
    }

    // 创建图集动画
    createAnimation(skin) {
        if (this.domDollar) {
            this.domDollar.destroy(true);
            this.domDollar = null;
        }

        let ani = new Laya.Animation();
        ani.loadAtlas(`images/animate/${skin}.atlas`); // 加载图集动画

        // 获取动画的边界信息
        let bounds = ani.getGraphicBounds();
        ani.pivot(bounds.width / 2 - 8, bounds.height / 2);
        ani.set(this.stateList[this.currentState]);
        ani.interval = skin === 'baida' ? 30 : 40; // 设置播放间隔（单位：毫秒）
        ani.x = skin === 'baida' ? ani.x - 8 : ani.x;
        this.domDollar = ani;

        this.addChild(ani);
    }

    go(during = 100, ease = Laya.Ease.linearIn) {
        // 运动之前停止动画
        this.domDollar.gotoAndStop(0);
        this.domDollar.off(Laya.Event.COMPLETE);
        if (this.domSkele) {
            this.domSkele.isPlaying && this.domSkele.stop()
            this.domSkele.visible = false;
        }

        this.currentState++;
        if (this.currentState === this.stateList.length) {
            this.currentState = 0;

            // 美元渲染皮肤
            this.renderDollarSkin();
            this.goon(during);

        } else {

            this.animateToNextState();
        }
    }

    // 动画运动到下一个状态
    animateToNextState() {
        let startState = this.stateList[this.currentState - 1];
        let targetState = this.stateList[this.currentState];
        let dom = this.domDollar;
        let targetY = targetState.y;
        let stepY = 35;
        this.isStop = false;
        this.timer = null;

        let stepHandler = () => {
            // 停止
            if (this.isStop) {
                cancelAnimationFrame(this.timer);
                this.timer = null;

                this.goon();

            } else {
                dom.y += stepY;
                if (dom.y >= targetY) {
                    dom.set({ x: targetState.x, y: targetY, skewX: targetState.skewX });
                    this.isStop = true;
                }

                this.timer = requestAnimationFrame(stepHandler);
            }
        }

        this.timer = requestAnimationFrame(stepHandler);
    }

    goon(during) {
        // 为初始的状态 && 应该停止 (运动停止)
        if (this.currentState === this.initState && this.shouldStop) {
            this.renderDollarSkin(this.skin);
            this.endCallBack(this.initState);

            this.shouldStop = false;

        } else {
            let ease = Laya.Ease.linearIn;
            let targetState = this.initState - 1 === -1 ? this.stateList.length : this.initState - 1;
            if (this.currentState === targetState && this.shouldStop) {
                ease = Laya.Ease.elasticOut;
            }

            this.go(during, ease);
        }
    }

    stop(skin) {
        this.shouldStop = true;
        this.skin = skin;
    }

    reset() {
        this.shouldStop = false;
    }

    // 播放动画
    play(bool, dollar, animateCB) {
        // 0索引统一不播放
        if (this.initState === 0) {
            return;
        }

        if (bool) {
            if (dollar) {
                this.domDollar.once(Laya.Event.COMPLETE, this, () => {
                    this.domDollar.gotoAndStop(0);
                    this.domSkele.stop();
                    this.domSkele.visible = false;

                    animateCB();
                });
                this.domDollar.play(0, false);
            }

            this.domSkele.visible = true;
            this.domSkele.play('start', true);

        } else {
            this.domSkele.visible = false;
            this.domSkele.stop();
        }

    }

}
