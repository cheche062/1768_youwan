/**
 * Class for window pop dialog.
 *百搭分奖
 * @class      BaidafjPopDialog (name)
 */
import { createSkeleton } from '../../common/laya.custom';
import UTILS from '../../config/utils';


export default class BaidafjPopDialog extends baidafjPopUI {
    constructor() {
        super();

        this.init();
    }

    // 注册
    registerAction({ messageCenter, observer }) {

        // 订阅弹层
        observer.subscribe('pop::baida', this.baidaPopup.bind(this));
        observer.subscribe('pop::match::start', this.matchPopup.bind(this));
    }

    init() {
        let skeletonPos = { x: 678, y: 379 };

        // 创建骨骼动画
        this.dom_skeleton = createSkeleton('images/animate/baidafj');
        this.dom_skeleton.set(skeletonPos);
        this.addChildAt(this.dom_skeleton, 0);

        // 确定按钮
        this.btn_confirm.on(Laya.Event.CLICK, this, this.close);
        this.btn_close.on(Laya.Event.CLICK, this, this.close);
    }

    // 几个百搭图案，福袋额外返奖，动画完成的回调
    baidaPopup(num, extra_amount, callBack) {
        // 控制点击遮罩区域不关闭弹层
        window.UIConfig.closeDialogOnSide = false;
        this.callBack = callBack;
        let text = `转到${num}个百搭图案赢得\n${extra_amount}`;

        this.popup(0, text);
    }

    // 美元战场开始
    matchPopup(){
        this.popup(1, '美元战场开始啦！');
    }

    popup(title, content){
        this.dom_skeleton.once(Laya.Event.STOPPED, this, ()=>{
            this.dom_skeleton.play('loop', true);
        })
        this.dom_skeleton.play('start', false);
        this.dom_amount.text = content; 
        this.dom_title.index = title;
        Laya.timer.once(5 * 1000, this, this.close);

        super.popup()
    }

    close() {
        window.UIConfig.closeDialogOnSide = true;
        this.dom_skeleton.stop();
        this.dom_skeleton.offAll();
        this.callBack && this.callBack();
        this.callBack = null;
        Laya.timer.clear(this, this.close);

        super.close();
    }



}
