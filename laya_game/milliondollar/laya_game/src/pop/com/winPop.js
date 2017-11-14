/**
 * Class for window pop dialog.
 *赢得金额弹层
 * @class      WinPopDialog (name)
 */
import { createSkeleton } from '../../common/laya.custom';
import UTILS from '../../config/utils';
import AudioMudule from '../../module/com/audio';


export default class WinPopDialog extends winPopUI {
    constructor() {
        super();

        this.init();
    }

    // 注册
    registerAction({ messageCenter, observer }) {

        // 订阅弹层
        observer.subscribe('pop::win', this.popup.bind(this));
    }

    init() {
        let skeletonPos = { x: 670, y: 712 };

        this.flag = false; // 锁定的开关

        // 创建骨骼动画
        this.dom_skeleton = createSkeleton('images/animate/winpop');
        this.dom_skeleton.set(skeletonPos);
        this.addChildAt(this.dom_skeleton, 0);


        // 确定按钮
        this.on(Laya.Event.CLICK, this, this.close);


    }

    // 赢取金额，投币金额，动画完成的回调
    popup(win_amount, bet_amount, callBack) {
        AudioMudule.getInstance().play('coin');
        this.flag = true;
        // 控制点击遮罩区域不关闭弹层
        window.UIConfig.closeDialogOnSide = false;

        this.callBack = callBack;
        this.dom_skeleton.once(Laya.Event.STOPPED, this, () => {
            this.dom_skeleton.play('loop', true);
        });

        this.dom_skeleton.play('start', false);

        this.renderWinAmount(win_amount, ()=>{
            this.flag = false;
            Laya.timer.once(3000, this, this.close);
        });
        this.dom_win_title.index = this.renderRate(win_amount, bet_amount);
        super.popup();
    }

    // 动态渲染获得金额
    renderWinAmount(amount, callBack) {
        let dom = this.dom_amount;
        let target = Number(amount);
        let currentNum = 0;
        let step = Math.max(1, Math.floor(target * 2 / 100));

        let loop = () => {
            currentNum += step;
            if (currentNum >= target) {
                currentNum = target;

                // 动画结束后回调
                callBack && callBack();
            } else {
                Laya.timer.frameOnce(2, null, loop);
            }

            dom.text = '$' + UTILS.addThousandSymbol(currentNum);
        }

        loop();
    }

    // 渲染倍率题目
    renderRate(win_amount, bet_amount) {
        let rate = win_amount / bet_amount;
        let i = 0;
        if (rate > 5 && rate <= 10) {
            i = 0;
        } else if (rate > 10 && rate <= 30) {
            i = 1;
        } else if (rate > 30) {
            i = 2;
        }

        return i;
    }

    close() {
        if(this.flag) return;
        window.UIConfig.closeDialogOnSide = true;

        this.dom_skeleton.stop();
        this.dom_skeleton.offAll();
        this.callBack && this.callBack();
        this.callBack = null;
        Laya.timer.clear(this, this.close);

        super.close();
    }
}
