{
    let utils = (Sail && Sail.Utils) || $;

    let NotifyItem = ((_super) => {
        let Pool = [];
        let FONTSIZE = null;

        class NotifyItem extends _super {
            constructor (data) {
                super();
                
                this.init(data);
            }
            init (data) {
                this.setup();
                this.setText(data);
            }
            setText (html) {
                this.innerHTML = html;
                this.size(this.contextWidth, this.contextHeight);
            }
            setup () {
                this.style.fontSize = FONTSIZE;
                this.style.whiteSpace = "nowrap";
            }
            reset (data) {
                this.setText(data);
                return this;
            }
            recover () {
                this.innerHTML = "";
                this.removeSelf();
                Pool.push(this);
            }
        }

        NotifyItem.setup = (fontSize) => {
            FONTSIZE = fontSize;
            console.log(arguments);
        }
        NotifyItem.create = (data) => {
            if(Pool.length !== 0){
                console.log("Create NotifyItem from Pool.");
                return Pool.pop().reset(data);
            }else{
                console.log("Create NotifyItem from New Instance.");
                return new NotifyItem(data);
            }
        }
        NotifyItem.clear = () => {
            for(let i in Pool){
                Pool[i].destroy(true);
            }
            Pool.length = 0;
        }

        return NotifyItem;
    })(Laya.HTMLDivElement);

    {
        let Pool = [];
        let NotifyList = [];

        let DEFAULT_CONFIG = {
            "width"     : 600,
            "fontSize"  : 30,
            "repeat"    : true, //是否允许重复的公告
            "type"      : "single", //single : 单条   multiple : 多条连续
            "margin"    : 50,
            "tpl"       : null, //公告模板，例如 "<span style='color:#fff'>恭喜<font style='color:#fc0'>{userName}</font>获得<font style='#ff0'>{msg}</font></span>"
            "speed"     : 100, //每隔1ms移动的像素
            "delay"     : 200, //每条公告间隔的时间
            "complete"  : function () {
                console.log("公告列表为空，已执行回调函数.");
            }
        };

        class Notify extends Laya.Box {
            constructor (config) {
                super();

                this.CONFIG = null;
                this.notifyPanel = null;
                this.isAnimation = false;

                this.init(config);
            }
            destroy () {
                _super.prototype.destroy.call(this, true);
                this.CONFIG = null;
            }

            init (config) {
                config = utils.extend({}, DEFAULT_CONFIG, config);
                
                this.CONFIG = config;
                this.size(config.width, config.fontSize);
                this.scrollRect = {x : 0, y : 0, width : this.width, height : this.height};

                let panel = new Laya.HBox();
                    panel.space = config.margin;

                this.notifyPanel = panel;
                this.addChild(panel);

                NotifyItem.setup(config.fontSize);
            }
            setText (data) {
                let html = this.CONFIG.tpl;
                for(let i in data){
                    let reg = new RegExp("{" + i + "}", "g");
                    html = html.replace(reg, data[i]);
                }
                return html;
            }
            addData (data) {
                let html = this.setText(data);

                //不添加重复内容
                if(!this.CONFIG.repeat){
                    for(let i in NotifyList){
                        if(NotifyList[i] === html){return;}
                    }
                }

                NotifyList.push(html);
            }
            createNotify (type) {
                let limit = 0;
                switch(this.CONFIG.type){
                    case "single":
                        if(this.notifyPanel.numChildren !== 0){ return; }
                        limit = 1;
                        break;
                    case "multiple":
                        if(this.notifyPanel.numChildren >= 10){ return; }
                        limit = 10;
                        break;
                }
                
                while(NotifyList.length && limit){
                    this.notifyPanel.addChild(NotifyItem.create(NotifyList.shift()));
                    limit--;
                }
            }
            next () {
                if(this.notifyPanel.numChildren === 0 && NotifyList.length === 0){
                    console.log("公告列表为空，执行回调函数.");
                    this.CONFIG.complete && typeof this.CONFIG.complete === "function" && this.CONFIG.complete();
                    return;
                }
                if(this.isAnimation){return;}
                this.isAnimation = true;

                this.createNotify();

                let itemWidth = this.notifyPanel.getChildAt(0).width;
                let totalTime = itemWidth / this.CONFIG.speed * 1000;

                if(this.CONFIG.type === "single"){
                    this.notifyPanel.x = this.width;
                    totalTime += this.width / this.CONFIG.speed * 1000;
                }

                Laya.Tween.to(this.notifyPanel, {x : -itemWidth - this.CONFIG.margin}, totalTime, null, Laya.Handler.create(this, function () {
                    this.notifyPanel.x = 0;
                    this.notifyPanel.getChildAt(0).recover();
                    this.isAnimation = false;
                    
                    this.next();
                }), this.CONFIG.delay);
            }

            add (data) {
                if(data instanceof Array){
                    for(let i in data){
                        this.addData(data[i]);
                    }
                    this.createNotify();
                    this.next();
                }else{
                    this.addData(data);
                    this.createNotify();
                    this.next();
                }
            }
        }
        Sail.class(Notify, "Tools.Notify");
    }
}