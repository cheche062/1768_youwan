/**
 * Jackpot ui visualization of the data that model contains.
 *奖池类
 * @class      JackpotUIView (name)
 */
import UTILS from '../config/utils';
import { BASE_RATE } from '../config/data';
import { observer } from '../module/init_module';



export default class JackpotUIView extends jackpotUI {
    constructor() {
        super();
        this.init();

        JackpotUIView.instance = this;
    }

    static getInstance() {
        return this.instance || new this();
    }

    init() {
        // 更新用户的明暗的遮罩数据
        this.inputNumArr = null;
        this.initSkin();

        observer.subscribe('jackpot::open', this.renderWhetherOpen.bind(this));

    }

    initSkin() {
        for (let i = 0, l = this.numChildren; i < l; i++) {
            let child = this.getChildAt(i);
            let ge;
            if (i === 0 || i === 1) {
                ge = 1;
            } else {
                ge = 2;
            }
            child.domNum.skin = `images/room/room_match/num${i+5}.png`;
            child.domGe.skin = `images/room/room_match/ge${ge}_txt.png`;
        }
    }

    // 是否开启(用户投币金额)
    renderWhetherOpen(user_input_text) {
        let num = user_input_text;
        for (let i = 0, l = this.numChildren; i < l; i++) {
            let child = this.getChildAt(i);
            child.user_input_text = num;
            child.domMask.visible = true;
            this.renderDomAcountText(false, child, i);
        }
        if (this.inputNumArr) {
            this.inputNumArr.forEach((item, index) => {
                if (num >= item) {
                    this.getChildAt(index).domMask.visible = false;
                }
            })
        }
    }

    // 渲染后台配置奖池数据
    renderInfo(data) {
        // 奖池数据
        let matchArr = ['5', '6', '7', '8'];
        let matchData = [];
        let inputNumArr = [];
        matchArr.forEach((item, index) => {
            matchData.push(data['allMatch' + item]);
            inputNumArr.push(data['trigger' + item]);
        })

        // 有效
        if(inputNumArr[0]){
            this.inputNumArr = inputNumArr;
        }

        matchData.forEach((item, index) => {
            let child = this.getChildAt(index);
            child.server_amount = item;
            this.renderDomAcountText(true, child, index);
        })
    }

    // 渲染最终的金额 (是否动画展示金额)
    renderDomAcountText(bool, child, index) {
        // 用户投币金额 && 后台配置奖池金额
        if (child.user_input_text && child.server_amount) {
            let endNum = child.user_input_text * BASE_RATE[index] + child.server_amount;
            let activeText = '$' + UTILS.addThousandSymbol(endNum);

            // 前后不一样的时候才变
            if (child.domAcount.text !== activeText) {
                this.loop && Laya.timer.clear(this, this.loop);
                if (bool) {
                    this.textAnimate.call(child, endNum);
                } else {
                    // 第一次允许动画
                    if(!child.isFirstRender){
                        child.isFirstRender = true;
                        this.textAnimate.call(child, endNum);
                    }else{
                        child.domAcount.text = activeText;
                    }
                }
            }
        }
    }

    // 数据动态变化
    textAnimate(endNum, beginNum = 0) {
        endNum = Number(endNum);
        beginNum = Number(beginNum);
        let step = Math.max(1, Math.floor((endNum - beginNum) * 2 / 100));

        let loop = this.loop = () => {
            beginNum += step;
            if (beginNum >= endNum) {
                beginNum = endNum;
                loop = this.loop = null;
            } else {
                Laya.timer.frameOnce(2, this, loop);
            }

            this.domAcount.text = '$' + UTILS.addThousandSymbol(beginNum);
        }

        loop();
    }

}
