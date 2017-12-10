/**
 *单个选项按钮
 * Options ui visualization of the data that model contains.
 * @class      OptionsUIView (name)
 */
export default class OptionsUIView extends Laya.Sprite {
    constructor(options) {
        super();

        this.options = options;
        this.init();
    }

    init() {
        this.options = Object.assign({
            initX: 11,
            disY: 8
        }, this.options);

        this.options.buttonSource = Laya.loader.getRes(this.options.buttonUrl);

        let sizeObj = this.computeSize();
        this.set(sizeObj);
        this.createBg(sizeObj);
        this.createButtons();
        this.initEvent();

        this.hide();
    }

    // 计算尺寸
    computeSize() {
        let buttonW = this.options.buttonSource.sourceWidth;
        let buttonH = this.options.buttonSource.sourceHeight;
        let length = this.options.itemList.length;

        return {
            width: buttonW + this.options.initX * 2,
            height: length * buttonH + this.options.disY * (length + 1)
        }
    }

    createBg(sizeObj) {
        let img = new Laya.Image(this.options.bgUrl);
        img.sizeGrid = "25,25,25,25";
        img.set(sizeObj);

        this.addChild(img);
    }

    createButtons() {
        let h = this.options.buttonSource.sourceHeight;

        this.options.itemList.forEach((item, index) => {
            let button = new Laya.Button(this.options.buttonUrl, item);
            button.set({
                stateNum: 1,
                labelFont: this.options.labelFont,
                x: this.options.initX,
                y: h * index + this.options.disY * (index + 1)
            })

            this.addChild(button);
        })
    }

    initEvent() {
        this.findType('Button').forEach((item, index) => {
            item.on(Laya.Event.CLICK, this, () => {
                this.options.clickHandler(this.options.itemList[index]);
                this.hide();
            })
        })
    }

    toggle() {
        if (this.visible) {
            this.hide();
        } else {
            this.show();
        }
    }

    // 设置中心点
    setAnchor() {
        let attr = null;
        if (this.x === 0) {
            attr = { pivotX: 0.5 * this.width, pivotY: this.height, x: 0.5 * this.width, y: 0 };
        } else {
            attr = { pivotX: 0, pivotY: 0, x: 0, y: -1 * this.height };
        }

        this.set(attr);
    }

    show() {
        this.visible = true;
        this.setAnchor();
        Laya.Tween.from(this, { scaleX: 0, scaleY: 0 }, 200, Laya.Ease.backOut, Laya.Handler.create(this, this.setAnchor));
    }

    hide() {
        this.visible = false;
    }
}