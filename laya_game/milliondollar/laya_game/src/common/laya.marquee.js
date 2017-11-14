/**
 * Class for marquee laya
 * @class      MarqueeLaya (name)跑马灯
 * 
 * 
 */


export default class MarqueeLaya extends Laya.Box {
    constructor(parentNode, options) {
        super();

        this.init(parentNode, options);
    }

    // 初始化
    init(parentNode, options) {
        let DEFAULT = {
            duraing: 3000, //运动的持续时间
            intervalTime: { //时间间隔
                nomal: 10 * 1000, //普通跑马灯 
                win: 3 * 1000 //获奖跑马灯
            },
            modelData: [ //数据模板
                '恭喜*赢了*，实在是太厉害了！',
                '祝贺*赢取*，积少成多从现在开始。',
                '恭喜*赢取*，满屏掌声献给他！'
            ],
            fontSize: 30,
            bold: false,
            color: '#fff',
            colorHigh: '#75e8ff',
            font: "微软雅黑"

        }

        if (!(parentNode instanceof Laya.Node)) {
            throw new Error('父元素Error...');

            return;
        }

        this.parentNode = parentNode;
        this.options = Object.assign({}, DEFAULT, options);
        this._initConfig();
        this._addMask();

        // 创建lable元素
        this._createChild();

        // 将自己添加到父元素中
        this.parentNode.addChild(this);
    }

    // 初始化配置
    _initConfig() {
        this.config = {
            MASKWIDTH: this.parentNode.displayWidth, //遮罩宽
            MASKHEIGHT: this.parentNode.displayHeight, //遮罩高
            currentType: 'nomal', //当前跑马灯类型   1:普通型， 2：获奖型
            isDataLoop: false, //是否需要重复播放的数据
            count: 0,
            noticeArr: [], //跑马灯数据
            isGoing: false //是否已经启动
        }

        this._labelChildren = null; //label数组
    }

    // 添加遮罩
    _addMask() {
        this.parentNode.mask = new Laya.Sprite();
        this.parentNode.mask.graphics.clear();
        this.parentNode.mask.graphics.drawRect(0, 0, this.config.MASKWIDTH, this.config.MASKHEIGHT, '#000000');
    }

    // 添加子元素
    _createChild() {
        let _arr = [];
        for (let i = 0; i < 5; i++) {
            let _label = new Laya.Label();
            _label.fontSize = this.options.fontSize;
            _label.font = this.options.font;
            _label.bold = this.options.bold;
            _arr.push(_label);
        }

        this._labelChildren = _arr;
    }

    // 开始轮播
    start(data) {
        if (typeof data === 'string' || typeof data === 'number') {
            this.config.noticeArr.unshift(data);

        } else if (Array.isArray(data)) {
            this.config.noticeArr = data.concat(this.config.noticeArr);
        }

        this._marqueeGo();

    }

    // 跑马灯开启
    _marqueeGo(data) {
        let config = this.config;

        // 只启动一次
        if (!config.isGoing) {
            config.isGoing = true;
            this.parentNode.parent.visible = true;

            this._renderNextNotice();
        }
    }

    // 渲染下一条公告
    _renderNextNotice() {
        let config = this.config;
        let noticeArr = config.noticeArr;

        // 当前信息
        let msg = noticeArr.shift();

        // 表示没有内容了
        if (typeof msg === 'undefined') {
            // 结束
            this.config.isGoing = false;
            this.parentNode.parent.visible = false;

            return;
        }

        // 是否需要重复播放
        if (config.isDataLoop) {
            noticeArr.push(msg);
        }

        // 处理当条文字信息
        let txtArr = this._dealWithMsg(msg);

        // 渲染文字
        this._renderLabel(txtArr);

        // 当前公告入场
        this._currentNoticeIn();

    }

    // 处理当条文字信息
    _dealWithMsg(msg) {
        let txtArr = [msg];

        // 拆分字符串
        if (typeof msg === 'string') {
            let _index0 = msg.indexOf('恭喜');
            let _index1 = msg.indexOf('赢取');

            let _index2 = msg.indexOf('，');
            let _index3 = msg.indexOf('赢得了');

            if (_index0 !== -1 && _index1 !== -1) {
                txtArr = [msg.slice(0, _index0 + 2), msg.slice(_index0 + 2, _index1), msg.slice(_index1, _index1 + 2), msg.slice(_index1 + 2)];
            } else if (_index2 !== -1 && _index3 !== -1) {
                txtArr = [msg.slice(0, _index2 + 1), msg.slice(_index2 + 1, _index3), msg.slice(_index3, _index3 + 3), msg.slice(_index3 + 3)];
            }
        }

        // 使用本地模板
        if (typeof msg === 'object' && 'name' in msg && 'award' in msg) {
            // 获奖公告
            let modelArr = this.options.modelData[(this.config.count++) % 3].split('*');
            txtArr = [modelArr[0], msg.name, modelArr[1], msg.award, modelArr[2]];
        }

        return txtArr;

    }

    // 渲染文字
    _renderLabel(txtArr) {
        // 移除所有子节点
        this.removeChildren();

        // 当前公告类型
        this.config.currentType = txtArr.length === 1 ? 'nomal' : 'win';

        // 渲染文本的text 和 color
        txtArr.forEach((item, index) => {
            let _color = '';
            this._labelChildren[index].text = item;
            if (index === 1) {
                _color = this.options.colorHigh;
            } else if (index === 3) {
                _color = this.options.colorHigh2 || this.options.colorHigh;
            } else {
                _color = this.options.color;
            }

            this._labelChildren[index].color = _color;
        })

        // 坐标计算
        for (let i = 0; i < txtArr.length; i++) {
            if (i !== 0) {
                this._labelChildren[i].x = this._labelChildren[i - 1].x + this._labelChildren[i - 1].displayWidth + 2;
            }

            // 添加文本元素
            this.addChild(this._labelChildren[i]);
        }

    }

    // 当前跑马灯信息入场
    _currentNoticeIn(text) {
        this.x = this.config.MASKWIDTH;

        Laya.Tween.to(this, { x: 0 }, this.options.duraing, Laya.Ease.linearIn, Laya.Handler.create(this, this._currentNoticeOut));

    }

    // 当前跑马灯信息离场
    _currentNoticeOut() {
        let config = this.config;
        let moveX = Math.ceil(this.displayWidth);

        Laya.Tween.to(this, { x: -1 * moveX }, this.options.duraing, Laya.Ease.linearIn, Laya.Handler.create(this, this._renderNextNotice), this.options.intervalTime[config.currentType]);

    }

}
