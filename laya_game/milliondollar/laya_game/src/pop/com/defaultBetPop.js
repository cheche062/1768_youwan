/**
 * { item_description }
    默认投币额提示
 */
import { messageCenter, observer} from '../../module/init_module';


export default class DefaultBetView extends defaultBetPopUI{
    constructor() {
        super();
        this.init();

        DefaultBetView.instance = this;
    }

    static getInstance() {
        return this.instance || new this();
    }

    init() {

        this.subscribe();
    }

    // 订阅
    subscribe() {

        // 投币成功
        observer.subscribe('pop::defaultbet', this.show.bind(this));

    }

    show(txt){
        this.dom_text.text = txt;

        this.dom_text.y = (this.height - this.dom_text.displayHeight) / 2;
        this.dom_text.zOrder = 2;

        this.x = Laya.stage.width / 2;
        this.y = Laya.stage.height / 2;

        Laya.stage.addChild(this);
        Laya.Tween.from(this, {scaleX: 0, scaleY: 0}, 300, Laya.Ease.backOut);

        Laya.timer.once(3 * 1000, this, this.removeSelf);
    }



}