import UTILS from '../../config/utils';

export default class GainNoticeUIView extends gainNoticeUI {
    constructor() {
        super();

        this.init();

        GainNoticeUIView.instance = this;
    }

    static getInstance() {
        return this.instance || new this();
    }

    init() {
        // 数据集合
        this.noticeDate = [];

        this.y = 80;
    }

    enter(data) {
        this.noticeDate.push(data);

        // 是否已经添加进舞台
        if (!this.parent) {
            this.show();
        }
    }

    // 渲染数据
    renderDate(name, amount) {
        this.domName.text = UTILS.getActiveStr(name);
        this.domAmount.text = UTILS.getActiveStr(amount);
    }

    show() {
        let data = this.noticeDate.shift();
        let during = 300;
        if(typeof data === 'undefined'){
            this.removeSelf();

            return;
        }
        this.renderDate(data.name, data.amount);
        this.x = Laya.stage.width;
        Laya.stage.addChild(this);
        Laya.Tween.to(this, { x: this.x - this.width + 40 }, during, Laya.Ease.backOut, Laya.Handler.create(this, () => {
            Laya.Tween.to(this, { x: Laya.stage.width}, during, Laya.Ease.backIn, Laya.Handler.create(this, this.show), 1500);
        }));
    }






}
