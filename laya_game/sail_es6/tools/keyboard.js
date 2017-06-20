{
    let utils = (Sail && Sail.Utils) || $;

    let SKIN = {
        "confirm" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAWlBMVEUAAADMQkLLQkLLQkL9Y2PLQkLLQkL9Y2PMQkL9Y2PLQkLLQkLdTk75YGD7YmL9Y2P2Xl77YmL9Y2P9Y2P9Y2PLQkL9Y2PLQkL3Xl7cTU3tWFj5YGDoVVXmVFTAQB7jAAAAFnRSTlMA4qyPiltUU9sGBvr59e3cyl/fplYHf9H6ogAAAJVJREFUKM/lzFkOhCAQRdEHCs5TD1WAuv9ttm00xii1Ae/vSS7Wis/7Ree6DHtZRzelm6Z0XyrpUvY/U7S2QNFSvAEDCfXoJW7QkBTooTzK7CR1CBIH1BLXyIX7qKB9nL2G4TmmMxuUiqd7nVh9Acvs3RWdZ7ZYSpjZB3eysCAnwOaXDgVsfsXcAnul0ao6qFLalCv8AOM4RjeBMUEAAAAAAElFTkSuQmCC",
        "delete" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAb1BMVEUAAADLy8ttbGzMzMzMzMxtbGzMzMxtbGzMzMxtbGzMzMxubW3MzMxtbGxtbGyQj4/MzMxtbGxtbGzMzMzMzMzMzMzMzMzMzMzMzMxwb29tbGzMzMxtbGzBwcGtra2NjIy/vr6goKCPjo6kpKSko6Pen5mzAAAAG3RSTlMA/N2piVtVVAYGA+ParPr54ZSKW1Hz5OPf2quDrJY6AAAAqklEQVQoz9XPSQ6DMBBE0TKEeR4yum0Dyf3PGCARLLA76/ztk0oqrMWhfxNy65z7YYytPpeH8v6L6UlaO6Urz+rwRUPpLATiq5svMTrJ1MHn2EfNcQ3BsYBk+2P+8XvgWEFzrFFxXOGumO0MD+NmUyCg0aUjBUgyetn1SVkCRETG8m4wRBHmWiKatBI7CaUnImqxlDZkrUnxKfKO6EXYSoLCK3cqvSJIVngDsvlU0+yaOfMAAAAASUVORK5CYII=",
        "number" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAeFBMVEUAAADGxsa3t7f///////////////////+3t7e3t7fo6Oi3t7fT09P///////+3t7e6urr///+3t7f///+3t7e3t7f///////////////+3t7e3t7f///+3t7fQ0ND29vb19fX7+/v39/fo6Ojh4eHe3t65ubm4uLiqIy5xAAAAHHRSTlMABeKJVQb64VtV/Prp5NvbrqysppSKW1Hz11xTZZ6wfwAAAKVJREFUKM/d00cSgzAQRNEWOefgIIkM97+hMbhwuUBzAP/tq1nMorFlGrlt8aPbPTdMHNURPxXVH2Q6v0xnG6+q8LcaXJkBmKGaQxMVJ6qQUpzCptiGRbEFTva/3FHaoaW4gUexh4DiAEmv1j6BI9UsH2DapNJJY4C7jNc6Li7WSiHbM7ZSlPsMCjHLofn5d5CzKBj2nrE4Fbs4Yk6m+V/ytczZT1+rJlhgr8lBXAAAAABJRU5ErkJggg=="
    };
    let SKIN_PATH = "public/keyboard_" + (Math.random() * 9999999 | 0) + "/";
    let KEYS = [
        {text : "1", skin : "number", x : 20, y : 15},
        {text : "2", skin : "number", x : 280, y : 15},
        {text : "3", skin : "number", x : 545, y : 15},
        {text : "4", skin : "number", x : 20, y : 125},
        {text : "5", skin : "number", x : 280, y : 125},
        {text : "6", skin : "number", x : 545, y : 125},
        {text : "7", skin : "number", x : 20, y : 235},
        {text : "8", skin : "number", x : 280, y : 235},
        {text : "9", skin : "number", x : 545, y : 235},
        {text : "0", skin : "number", x : 810, y : 15},
        {text : "00", skin : "number", x : 810, y : 125},
        {text : ".", skin : "number", x : 810, y : 235},
        {text : "确定", skin : "confirm", x : 1070, y : 15},
        {text : "删除", skin : "delete", x : 1070, y : 235}
    ];
    let EVENT_CLICK = Laya.Event.CLICK;

    class KeyBoardMask extends Laya.Sprite {
        constructor () {
            super();

            this.configAlpha = null;
            this.configColor = null;
            this.closeOnSide = false;

            this.on(EVENT_CLICK, this, function () {
                if(this.closeOnSide){
                    this.event("exit", ["mask", null]);
                }
            });
        }
        destroy () {
            super.destroy.call(this);

            this.configAlpha = null;
            this.configColor = null;
            this.closeOnSide = false;
        }

        update (width, height, alpha, color, closeOnSide) {
            this.alpha = this.configAlpha = alpha;
            this.configColor = color;
            this.closeOnSide = closeOnSide;

            this.resize(width, height);
        }
        resize (width, height) {
            this.size(width, height);
            this.graphics.clear();
            this.graphics.drawRect(0, 0, this.width, this.height, this.configColor);
            this.alpha = this.configAlpha;
        }
    }

    class InputText extends Laya.Box {
        constructor () {
            super();

            this.Mask = null;
            this.textValue = null;
            this.originHeight = null;

            this.init();
        }
        destroy () {
            super.destroy.call(this);
            this.Mask = null;
            this.textValue = null;
            this.originHeight = null;
        }
        init (width) {
            this.originHeight = 60;

            let mask = new KeyBoardMask();
                mask.update(this.width, this.height, 0.5, "#000000", false);

            let text = new Laya.Label();
                text.height = 30;
                text.fontSize = 30;
                text.align = "center";

            this.Mask = mask;
            this.textValue = text;
            this.addChildren(mask, text);
        }
        update (value, color) {
            this.textValue.color = color;
            this.textValue.text = value;
        }
        resize (width, height) {
            let yrate = height / 1334;

            this.size(width, this.originHeight * yrate);
            this.Mask.resize(this.width, this.height);
            this.textValue.width = width;
            this.textValue.bottom = 0;
            this.top = -this.height;
        }
    }

    class KeyBoardButton extends Laya.Image {
        constructor (config, callback) {
            super();

            this.config = null;
            this.callback = null;
            this.label = null;

            this.init(config, callback);
        }
        destroy () {
            super.destroy.call(this);

            this.config = null;
            this.callback = null;
            this.label = null;
        }

        init (config, callback) {
            config.width = 240;
            config.height = config.skin === "confirm" ? 210 : 100;
            this.config = config;

            this.skin = SKIN_PATH + config.skin + ".png";
            this.sizeGrid = "15,15,15,15";

            this.resize(Laya.stage.width, Laya.stage.height);
            this.create(config);

            this.on(EVENT_CLICK, this, callback, [config.text]);
        }
        create (config) {
            let label = new Laya.Label(config.text);
                label.color = config.skin === "confirm" ? "#ffffff" : "#1c1c1c";
                label.font = "arial";
                label.align = "center";
                label.fontSize = 40;
                label.size(this.width, label.fontSize);
                label.centerY = 0;

            this.label = label;
            this.addChild(label);
        }
        resize (width, height) {
            let xrate = width / 1334;
            let yrate = height / 1334;

            this.size(this.config.width * xrate, this.config.height * yrate);
            this.pos(this.config.x * xrate, this.config.y * yrate);
            this.label && (this.label.width = this.width);
        }
    }

    class KeyBoardPanel extends Laya.Box {
        constructor () {
            super();

            this.keys = [];
            this.textValue = "";
            this.inputText = null;
            this.panelMask = null;

            this.init();
        }
        destroy () {
            super.destroy.call(this);

            this.keys = null;
            this.textValue = null;
            this.inputText = null;
            this.panelMask = null;
        }

        init () {
            let height = Laya.stage.height;
                height = height < 750 ? 750 : height;

            this.size(Laya.stage.width, height / 1334 * 350);
            this.bottom = -this.height;

            let panelMask = new KeyBoardMask();
                panelMask.update(this.width, this.height, 0.5, "#000000", false);

            let inputText = new InputText();
                inputText.resize(this.width, height);

            this.inputText = inputText;
            this.panelMask = panelMask;
            this.addChildren(panelMask, inputText);

            for(let i in KEYS){
                this.keys.push(new KeyBoardButton(KEYS[i], this.onClick.bind(this)));
            }
            super.addChildren.apply(this, this.keys);
        }
        onClick (text) {
            this.event("input", [text]);
        }

        update (value, color) {
            this.inputText.update(value, color);
        }
        enter (value) {
            this.inputText.update(value, "#ffffff");

            Laya.Tween.to(this, {bottom : 0}, 300, Laya.Ease.linearIn);
        }
        exit (type) {
            Laya.Tween.to(this, {bottom : -this.height}, 200, Laya.Ease.linearIn, Laya.Handler.create(this, function (type) {
                this.event("exit", [type]);
            }, [type]));
        }
        resize (width, height) {
            height = height < 750 ? 750 : height;

            let xrate = width / 1334;
            let yrate = height / 1334;

            this.size(width, 350 * yrate);
            this.panelMask.resize(this.width, this.height);

            this.inputText.resize(width, height);
            for(let i in this.keys){
                this.keys[i].resize(width, height);
            }
        }
    }

    {
        let DEFAULT_CONFIG = {
            "closeOnSide" : true, //点击遮罩关闭键盘
            "shadowAlpha" : 0.3, //遮罩的透明度
            "shadowColor" : "#000000", //遮罩的颜色值
            "nullMsg" : "输入的值不能为空", //输入的值为空时的提示
            "length" : 11, //输入字段的最大长度（只针对整数位）
            "float" : false, //是否允许有小数点
            "fixed" : 4, //保留的小数位，仅在 float:true 时起作用
            "input" : function (value) { //输入时的回调函数，参数为当前输入的值
                console.log("当前输入值：" + value);
            },
            "close" : function (type, value) { //键盘关闭时的回调函数，参数为 type:(confirm|mask)从哪儿关闭， value:当前输入的值
                if(type === "confirm"){
                    console.log("点击了确定按钮，关闭输入键盘，当前值：" + value);
                }else{
                    console.log("点击了遮罩，关闭输入键盘。");
                }
            }
        };

        class KeyBoardNumber extends Laya.Box {
            constructor () {
                super();

                this.keyBoardMask = null;
                this.keyBoardPanel = null;
                this.config = null;
                this.textValue = "";

                this.loadAssets();
            }
            destroy () {
                Laya.stage.off(Laya.Event.RESIZE, this, this.onResize);
                super.destroy.call(this);

                this.keyBoardMask = null;
                this.keyBoardPanel = null;
                this.config = null;
                this.textValue = null;
            }

            loadAssets () {
                let self = this;
                let loadedNum = 0;
                let totalNum = Object.keys(SKIN).length;

                for(let i in SKIN){
                    (function (url, data) {
                        let img = new Laya.HTMLImage.create(data, {
                            onload : function () {
                                Laya.Loader.cacheRes(SKIN_PATH + url + ".png", new Laya.Texture(img));
                                loadedNum++;
                                if(loadedNum === totalNum){
                                    self.init();
                                }
                            }
                        });
                    })(i, SKIN[i]);
                }
            }
            init () {
                this.size(Laya.stage.width, Laya.stage.height);
                this.zOrder = 1000;

                let keyBoardPanel = new KeyBoardPanel(this.removeSelf.bind(this));
                    keyBoardPanel.on("input", this, this.onInput);
                    keyBoardPanel.on("exit", this, this.onExit);
                let keyBoardMask = new KeyBoardMask();
                    keyBoardMask.on("exit", this, function (type) {
                        keyBoardPanel.exit(type);
                    });
                
                this.keyBoardMask = keyBoardMask;
                this.keyBoardPanel = keyBoardPanel;
                this.addChildren(keyBoardMask, keyBoardPanel);

                Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
            }
            onExit (type) {
                this.removeSelf();
                this.config.close && this.config.close(type, type === "confirm" ? this.textValue + "" : null);
                this.textValue = "";
            }
            onInput (text) {
                switch(text){
                    case "删除":
                        let text = this.textValue.split("");
                            text.pop();
                        this.textValue = text.join("");

                        if(this.textValue){
                            this.keyBoardPanel.update(this.textValue, "#ffffff");
                        }else{
                            this.keyBoardPanel.update(this.config.nullMsg, "#ff0000");
                        }
                        this.config.input && this.config.input(this.textValue);
                        break;
                    case "确定":
                        this.keyBoardPanel.exit("confirm");
                        break;
                    default:
                        if(text === "."){
                            if(this.config.float !== true){return;}
                            if(this.textValue == ""){text = "0.";}
                            if((this.textValue.indexOf(".") != -1)){return;}
                        }
                        if(this.config.float === true){
                            let decimal = this.textValue.split(".")[1];
                            if(decimal && decimal.length >= this.config.fixed){return;}
                        }
                        if((this.textValue + text).length > this.config.length){return;}

                        this.textValue = this.textValue + text;
                        this.textValue = this.textValue.replace(/^0+/, "");

                        this.config.input && this.config.input(this.textValue);
                        if(this.textValue){
                            this.keyBoardPanel.update(this.textValue, "#ffffff");
                        }else{
                            this.keyBoardPanel.update(this.config.nullMsg, "#ff0000");
                        }
                }
            }

            enter (value, config) {
                this.config = utils.extend({}, DEFAULT_CONFIG, config);
                this.textValue = value + "";

                Laya.timer.callLater(this, function () {
                    this.keyBoardMask.update(this.width, this.height, this.config.shadowAlpha, this.config.shadowColor, this.config.closeOnSide);
                    this.keyBoardPanel.enter(this.textValue, this.config);
                });
                Laya.stage.addChild(this);
            }
            onResize () {
                let width = Laya.stage.width;
                let height = Laya.stage.height;
                this.size(width, height);

                this.keyBoardMask.resize(width, height);
                this.keyBoardPanel.resize(width, height);
            }
        }
        Sail.class(KeyBoardNumber, "Tools.KeyBoardNumber");
    }
}