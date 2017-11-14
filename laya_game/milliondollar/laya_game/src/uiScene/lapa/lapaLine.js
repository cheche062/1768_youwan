import LapaCell from './lapaCell';


// 单个项
export default class LapaLine extends Laya.Sprite {
    constructor(stateList, initIndex, endCallBack, lose_lineArr) {
        super()

        this.stateList = stateList;
        this.initIndex = initIndex;
        this.endCallBack = endCallBack;
        this.lose_lineArr = lose_lineArr;

        this.init();
    }

    init() {

        // 添加lapa小单元
        this.addChildrenCell();

    }

    addChildrenCell() {
        for (let i = 0; i < 4; i++) {
            this.addChild(new LapaCell(this.stateList, i, this.stopHandler.bind(this), this.lose_lineArr[i]));
        }
    }

    go() {
        this.startAnimate();
        this.forEachChildren((child) => {
            child.go();
        })
    }

    stop(data = []) {
        this.forEachChildren((child, i) => {
            child.stop(data[i]);
        })
    }

    forEachChildren(fn) {
        for (let i = 0, l = this.numChildren; i < l; i++) {
            fn(this.getChildAt(i), i);
        }
    }

    startAnimate() {
        Laya.Tween.from(this, { y: -100 }, 100, Laya.Ease.backOut);

    }

    // 播放连线动画
    playLine(lineNumber, posLineArr, num, animateCB) {
        // 播放的元素索引
        let i = posLineArr.indexOf(lineNumber);
        let arr = [0, 0, 0];
        arr[i] = 1;
        arr.unshift(0);
        // 是否播放翻钱
        let dollarIndex = this.initIndex < num;
        this.forEachChildren((child, i) => {
            child.play(arr[i], dollarIndex, animateCB);
        })
    }

    // 播放百搭动画
    playBaida(picItem, animateCB) {
        this.forEachChildren((child, i) => {
            let bool = picItem[i] === 7;
            child.play(bool, true, animateCB);
        })
    }

    // 停止后的动画
    stopHandler(i) {
        if (i === 3) {
            Laya.Tween.from(this, { y: 200 }, 150, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                this.endCallBack(this.initIndex);
            }));
        }
    }



}
