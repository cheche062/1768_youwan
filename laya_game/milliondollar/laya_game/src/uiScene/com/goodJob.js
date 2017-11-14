import AudioMudule from '../../module/com/audio';


export default class GoodJobUIView extends goodJobUI{
    constructor() {
        super();

        this.init();

        GoodJobUIView.instance = this;
    }

    static getInstance() {
        return this.instance || new this();
    }

    init() {
        // 数据集合
        this.noticeDate = [];

        this.y = 220;
    }

    enter(data) {
        this.noticeDate.push(...data);

        // 是否已经添加进舞台
        if (!this.parent) {
            this.show();
        }
    }

    // 渲染数据
    renderDate(num) {
        this.dom_num.text = num;

        this.dom_gxl.x = this.dom_num.x + this.dom_num.width;
    }

    show() {
        let data = this.noticeDate.shift();
        let during = 300;
        if(typeof data === 'undefined'){
            this.removeSelf();

            return;
        }
        AudioMudule.getInstance().play('good');

        this.renderDate(data);
        this.x = Laya.stage.width;
        Laya.stage.addChild(this);
        Laya.Tween.to(this, { x: this.x - this.width + 30 }, during, Laya.Ease.backOut, Laya.Handler.create(this, () => {
            Laya.Tween.to(this, { x: Laya.stage.width}, during, Laya.Ease.backIn, Laya.Handler.create(this, this.show), 2000);
        }));
    }


}