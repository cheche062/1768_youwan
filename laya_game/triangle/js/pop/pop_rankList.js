// "use strict";
//【排行榜弹框  
(function() {
    function RankList() {
        RankList.super(this);
        this.init();
    }
    Laya.class(RankList, "app.RankList", ui.pop.pop_rankUI);
    var _proto = RankList.prototype;
    _proto.init = function() {
        this.myList1.vScrollBarSkin = '';
        this.myList2.vScrollBarSkin = '';
        this.smallList.vScrollBarSkin = '';
        this.bindEvent();
        this.loading0.visible = false;
        this.inLoading1.visible = false;
        this.inLoading2.visible = false;
        this.noLogin.visible = false;
        this.myList0.array = [];
        this.myList2.array = [];
        this.myList1.array = [];

        this.dom_richList = this.getChildByName('richList');

        app.messageCenter.registerAction("top3", this.show.bind(this)) // 土豪榜
        app.messageCenter.registerAction("bpLog", this.myprizelist.bind(this)) //  分奖记录
        app.messageCenter.registerAction("myPrize", this.mywinlist.bind(this)) //  我的记录

        // 挂载弹层出现
        app.observer.subscribe('rankPopShow', this.popup.bind(this));

        // 初始化富豪榜
        this.initRichList();

    }

    // 初始化富豪榜
    _proto.initRichList = function() {
        this.dom_richList._childs.forEach((item, index) => {
            item.getChildByName('icon').skin = 'images/pop/icon' + (index + 1) + '.png';
            item.getChildByName('title').skin = 'images/pop/title' + (index + 1) + '.png';
        })
    }

    _proto.bindEvent = function() {
            this.tabList.on(Laya.Event.CLICK, this, function() {
                app.audio.play('click');

                var index = this.tabList.selectedIndex;
                this.tabPage.selectedIndex = index;
                if (index == 0) {
                    this.myList0.visible = true;
                    this.myList1.visible = false;
                    this.myList2.visible = false;
                    this.smallTab.selectedIndex = 0;
                    this.rankingList(0);
                } else if (index == 1) {
                    this.myList0.visible = false;
                    this.myList1.visible = true;
                    this.myList2.visible = false;
                    app.messageCenter.emit('bpLog');
                } else if (index == 2) {
                    this.myList0.visible = false;
                    this.myList1.visible = false;
                    this.myList2.visible = true;
                    if (window.token == '') {
                        this.mywinlist();
                        return;
                    }
                    app.messageCenter.emit('myPrize');
                }
            });
            this.noLogin.on(Laya.Event.CLICK, this, function() {
                location.href = GM.userLoginUrl;
                return;
            });
            this.smallTab.on(Laya.Event.CLICK, this, function() {
                var index = this.smallTab.selectedIndex;
                this.rankingList(index);
                app.audio.play('click');

            });
        }
        //处理字符过长
    _proto.strCount = function(text, long) {
            var text = text + '';
            var reallong = text.length; //字节长度
            var strLength = text.length; //字符串长度
            var maxlong = long;
            var textold = '';
            var textoldLength;
            var textnew = '';
            if (reallong <= maxlong) {
                return text;
            } else {
                for (var i = 0; i < strLength; i++) {
                    textold += text[i];
                    textoldLength = textold.length;
                    if (textoldLength <= maxlong) {
                        textnew = textold;
                    } else {
                        return textnew + '...';
                    }
                }
            }
        }
        //日周月排行榜
    _proto.rankingList = function(index) {
        // data = {"statusCode":"0000","message":"success","richList":[{"amount":"2676400","user_id":"2301944","disName":"\u7ed9\u8001\u5b50\u7684\u5410\u51fa..."},{"amount":"748100","user_id":"12511926","disName":"\u6d6a\u5b50\u7684\u5fc3"},{"amount":"485400","user_id":"176466","disName":"fcx818"}]};
        var self = this;
        var type = "";
        switch (index) {
            case 0:
                type = "day";
                break;
            case 1:
                type = "week";
                break;
            case 2:
                type = "month";
                break;
        }
        this.loading0.visible = true;
        this.loading0.text = '正在加载中';
        self.smallList.array = [];
        $.ajax({
            type: 'GET',
            url: '/?act=game_triangle&st=get_bet_rank&type=' + type + '',
            timeout: 12000,
            dataType: 'json',
            success: function(data) {
                // data = {"code":"000","data":[{"rank":1,"userid":23860078,"amount":"23900","rank_trend":3,"gameid":"1564","period":1,"nickname":"\u5927\u7c73\u7a00\u996d"},{"rank":2,"userid":15610007,"amount":"14700","rank_trend":1,"gameid":"1564","period":1,"nickname":"15610007"},{"rank":3,"userid":84020886,"amount":"5300","rank_trend":3,"gameid":"1564","period":1,"nickname":"84***86"},{"rank":4,"userid":22955194,"amount":"3100","rank_trend":3,"gameid":"1564","period":1,"nickname":"\u5f00\u54c7"},{"rank":5,"userid":29782102,"amount":"2400","rank_trend":3,"gameid":"1564","period":1,"nickname":"29***02"},{"rank":6,"userid":84007618,"amount":"1900","rank_trend":3,"gameid":"1564","period":1,"nickname":"84***18"},{"rank":7,"userid":83864452,"amount":"1500","rank_trend":3,"gameid":"1564","period":1,"nickname":"83***52"},{"rank":8,"userid":130164,"amount":"1100","rank_trend":3,"gameid":"1564","period":1,"nickname":"jackytang168"},{"rank":9,"userid":28893654,"amount":"900","rank_trend":3,"gameid":"1564","period":1,"nickname":"28***54"},{"rank":10,"userid":216154,"amount":"600","rank_trend":3,"gameid":"1564","period":1,"nickname":"cheng"},{"rank":11,"userid":74126882,"amount":"200","rank_trend":3,"gameid":"1564","period":1,"nickname":"xjk126"},{"rank":12,"userid":71314352,"amount":"100","rank_trend":3,"gameid":"1564","period":1,"nickname":"71***52"}]}
                if (data.code == '000') {
                    var richList = data.data;
                    var richListlen = richList.length;
                    var list = [];
                    if (richListlen == 0) {
                        self.loading0.text = '暂无记录';
                        return;
                    }
                    self.loading0.visible = false;

                    for (var i = 0; i < richListlen; i++) {
                        var rank = parseInt(richList[i].rank);
                        var name = self.strCount(richList[i].nickname, 10);
                        var amount = self.strCount(parseInt(richList[i].amount), 8);
                        var trend = parseInt(richList[i].rank_trend);
                        var status;
                        switch (trend) {
                            case 1:
                                status = 2;
                                break;
                            case 2:
                                status = 1;
                                break;
                            case 3:
                                status = 0;
                                break;
                        }
                        list.push({ 'item0': rank, 'item1': name, 'item2': amount, 'item3': status });
                    }
                    self.smallList.array = list;
                }
            },
            error: function(xhr, type) {}
        });
    }

    //富豪榜
    _proto.richList = function(data) {
            /*data = {
            cmd:'top3', 
            res:{'code':0, 
            'info':[
            {"name":"凤飞飞的", "amount": "4200000"},
            {"name":"凤飞飞的"},
            {"name":"凤飞飞的"}
            ]
            }}
            data = data.res;*/

            if (Number(data.code) !== 0) {
                return;
            }

            var infoArray = data.info;

            for (var i = 0, l = infoArray.length; i < 3 - l; i++) {
                infoArray.push({ name: "虚位以待", amount: '0' });
            }

            this.dom_richList._childs.forEach((item, index) => {
                item.getChildByName('userName').text = this.strCount(infoArray[index].name, 12);
                item.getChildByName('amount').text = this.strCount(infoArray[index].amount, 12);
            })

        }
        //分奖纪录
    _proto.myprizelist = function(data) {
            //分大奖记录： {cmd:'bpLog', res:{'code':0, 'info':[ {‘name’:xx,’amount’:xx,’time’:xxxx}]}}
            var self = this;
            self.inLoading1.visible = true;
            self.inLoading1.text = "";
            // data = {cmd:'bpLog', res:{'code':0, 'info':[{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},
            // {"name":"凤飞凤飞飞的飞的","amount":"1212343343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},
            // {"name":"凤飞凤飞飞的飞的","amount":"1231234343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},
            // {"name":"凤飞飞的","amount":"1231234343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},
            // {"name":"凤飞凤飞飞的飞的","amount":"12343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},
            // {"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},
            // {"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},]}}
            // data = data.res;
            if (data.code == 0) {
                var prizelist = data.info;
                self.myList1.array = [];
                if (prizelist.length == 0 || prizelist == '') {
                    self.inLoading1.text = "暂无游戏记录！赶紧游戏赢大奖吧!";
                    return false;
                }
                var len = prizelist.length;
                var list = [];
                for (var i = 0; i < len; i++) {
                    var prize_amount = self.strCount(prizelist[i].amount, 9);
                    var raw_add_time = prizelist[i].time;
                    var raw_add_name = self.strCount(prizelist[i].name, 12);
                    list.push({ 'item0': raw_add_time, 'item1': raw_add_name, 'item2': prize_amount });
                };
                self.myList1.array = list;
            }
        }
        //我的赢奖
    _proto.mywinlist = function(data) {
        //我的赢奖： {cmd:'myPrize', res:{'code':0, 'info':[ {amount’:xx,’time’:xxxx}] }      
        var self = this;
        self.inLoading2.visible = true;
        self.inLoading2.text = "";
        if (window.token == '') {
            self.noLogin.visible = true;
            return;
        } else {
            self.noLogin.visible = false;
        }
        // data = {cmd:'myPrize', res:{'code':0, 'info':[{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},
        // {"name":"凤飞凤飞飞的飞的","amount":"1212343343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},
        // {"name":"凤飞凤飞飞的飞的","amount":"1231234343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},
        // {"name":"凤飞飞的","amount":"1231234343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},
        // {"name":"凤飞凤飞飞的飞的","amount":"12343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},
        // {"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},
        // {"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},{"name":"凤飞飞的","amount":"12343","time":"2017-09-09"},]}}
        // data = data.res;
        if (data.code == 0) {
            var prizelist = data.info;
            self.myList2.array = [];
            if (prizelist.length == 0 || prizelist == '') {
                self.inLoading2.text = "暂无游戏记录！赶紧游戏赢大奖吧!";
                return false;
            }
            var len = prizelist.length;
            var list = [];
            for (var i = 0; i < len; i++) {
                var prize_amount = self.strCount(prizelist[i].amount, 12);
                var raw_add_time = prizelist[i].time;
                list.push({ 'item0': raw_add_time, 'item1': prize_amount });
            };
            self.myList2.array = list;
        }
    }
    _proto.show = function(data) {
        this.richList(data);
        this.tabList.selectedIndex = 0;
        this.tabPage.selectedIndex = 0;
        this.smallTab.selectedIndex = 0;
        this.rankingList(0);
        this.popup();
    }

})();
