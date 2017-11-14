// Common
;
(function() {
    var f = window.myUtil = {};

    // 输出log 日志
    f.log = function() {
        if (window.GM && typeof GM.log == 'function') {
            GM.log.apply(GM, arguments);
        } else {
            if (f.debugFE == true) {
                console.log.apply(console, arguments);
            }
        }
    }
    f.console_log = function() {
        console.log.apply(console, arguments);
    }

    // 是否 未登录, true 未登录, false 已登录
    f.notLogged = function() {
        var isLogged = f.config.userLogged;
        if (!isLogged) {
            window.location.href = f.config.userLoginUrl;
        }
        return !isLogged;
    }

    // 观测者模式
    f.pubsub = (function() {
        var _default = 'default';
        var Event = function() {
            var namespaceCache = {},
                _slice = Array.prototype.slice,
                _shift = Array.prototype.shift,
                _unshift = Array.prototype.unshift,
                _listen = function(key, fn, cache) {
                    if (!cache[key]) {
                        cache[key] = [];
                    }
                    cache[key].push(fn);
                },
                _remove = function(key, cache, fn) {
                    if (cache[key]) {
                        if (fn) {
                            var fns = cache[key];
                            if (!fns || !fns.length) {
                                return;
                            }

                            for (var i = 0, len = fns.length; i < len; i++) {
                                if (fns[i].fnOrg === fn.fnOrg) {
                                    fns.splice(i, 1);
                                    i--;
                                    len--;
                                }
                            }

                            if (len === 0) {
                                delete(cache[key]);
                            }
                        } else {
                            delete(cache[key]);
                        }
                    }
                },
                _fire = function() {
                    var cache = _shift.call(arguments),
                        key = _shift.call(arguments),
                        args = arguments,
                        fns = cache[key];
                    if (!fns || !fns.length) {
                        return;
                    }

                    for (var i = 0, len = fns.length; i < len; i++) {
                        var fn = fns[i];
                        if (fn.fnOrg.EXCUTED_ONCE) {
                            _remove(key, cache, fn);
                            i--;
                            len--;
                        }
                        // 先移除了, 再执行
                        fn.apply(null, args);
                    }
                },
                _create = function(namespace) {
                    var namespace = namespace || _default;
                    var cache = {};
                    var mountArr = [];
                    var isOnce = false;
                    var mountExec = function(key, fn) {
                        for (var i = 0, len = mountArr.length; i < len; i++) {
                            var item = mountArr[i];
                            if (item.key === key) {
                                fn.apply(null, item.data);
                                if (fn.EXCUTED_ONCE) {
                                    _remove(key, cache, fn);
                                }
                                if (item.isOnce) {
                                    mountArr.splice(i, 1);
                                    i--;
                                    len--;
                                }
                                // 只让执行一次
                                break;
                            }

                        }
                    }
                    ret = {
                        listenOnce: function(key, fn, context) {
                            fn.EXCUTED_ONCE = true;
                            this.listen(key, fn, context);
                            return this;
                        },
                        listen: function(key, fn, context) {
                            var fnBind = fn && fn.bind(context || window);
                            if (fnBind) {
                                fnBind.fnOrg = fn;
                            }

                            _listen(key, fnBind, cache);
                            mountExec(key, fnBind);
                            return this;
                        },
                        remove: function(key, fn, context) {
                            var fnBind = fn && fn.bind(context || window);

                            if (arguments.length === 0) {
                                cache = {};
                                mountArr = [];
                            } else {
                                if (fnBind) {
                                    fnBind.fnOrg = fn;
                                }
                                _remove(key, cache, fnBind);
                            }
                            return this;
                        },
                        fire: function() {
                            // arguments 数组前插入一个 cache参数
                            _unshift.call(arguments, cache);
                            _fire.apply(null, arguments);
                            return this;
                        },
                        // 强制执行1次
                        fireForceOnce: function() {
                            isOnce = true;
                            this.fireForce.apply(this, arguments);
                            return this;
                        },
                        fireForce: function() {
                            var args = arguments;
                            var key = args[0];

                            if (cache[key]) {
                                this.fire.apply(this, args);
                                // 若只需挂载一次
                                if (isOnce) {
                                    isMustOnce = false;
                                    return this;
                                }
                            }

                            mountArr.push({
                                key: key,
                                isOnce: isOnce,
                                data: _slice.call(arguments, 1)
                            });
                            isMustOnce = false;
                            return this;
                        }
                    };
                    return namespace ?
                        (namespaceCache[namespace] ? namespaceCache[namespace] :
                            namespaceCache[namespace] = ret) : ret;
                };
            return {
                create: _create
            };
        }();
        return Event;
    })();

    // asyn
    f.asyn = function() {
        var me = this;
        var obj = {};
        var arr = [];
        var method = {
            hook: function() {
                var args = f.util.slice.call(arguments);
                arr = arr.concat(args);
                return this;
            },
            unHook: function() {
                var args = f.util.slice.call(arguments);
                var argsLen = args.length;
                var arrLen = arr.length;
                var i, j;

                if (argsLen == 0) {
                    arr = [];
                } else {
                    for (i = 0; i < arrLen; i++) {
                        for (j = 0; j < argsLen; j++) {
                            if (arr[i] == args[j]) {
                                arr.splice(i, 1);
                                i--;
                                arrLen--;
                                break;
                            }
                        }
                    }
                }
                return this;
            },
            _done: function() {
                arr.forEach(function(item, i) {
                    item && item();
                });
                arr = [];
                return this;
            },
            isReady: {},
            ready: function(n) {
                // console.log('O(∩_∩)O ----- ready: ' + n);
                this.isReady[n] = true;
                delete(obj[n]);
                // 查看 obj 属性是否为0
                if (Object.keys(obj).length === 0) {
                    this._done();
                }
                return this;
            },
            wait: function(n) {
                // console.log('(-_-)ZZ ----- wait:  ' + n);
                obj[n] = 'wait';
                return this;
            }
        }
        return method;
    }

    /*
        毫秒数
    */
    f.DownTimeMsec = function(time, loopTime) {
        this.time = parseInt(time, 10);
        this.loopTime = loopTime || 50;
        this.timeout = null;
    }
    f.DownTimeMsec.prototype = {
        constructor: f.DownTimeMsec,
        _loopTime: function(time, func, callback) {
            var self = this;

            var d1 = new Date;
            var loop = function() {
                var d2 = new Date;
                var t = (d2 - d1);
                var timeNow = time - t;
                timeNow = timeNow < 0 ? 0 : timeNow;
                var timeSec = Math.floor(timeNow / 1000);
                if (typeof func === 'function') {
                    func(timeNow, timeSec);
                }
                if (timeNow > 0) {
                    clearTimeout(self.timeout);
                    self.timeout = setTimeout(loop, self.loopTime);
                } else {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            }
            loop();

            return this;
        },
        // 开始
        start: function(func, callback) {
            this.func = func;
            this.callback = callback;
            this._loopTime(this.time, func, callback);
            return this;
        },
        // 设置时间并且重现开始
        setTime: function(time) {
            this.stop();
            this._loopTime(time, this.func, this.callback);
        },
        stop: function() {
            clearTimeout(this.timeout);
            return this;
        }
    }

    /*
    倒计时
    time 为秒
    flag 是当小时只有1位小数并且小时小于10, 是否前面加0
  */
    f.DownTime = function(time, flag) {
        this.time = parseInt(time, 10);
        this.timeOrg = this.time;
        this.leftTime = this.time;
        this.flag = flag;
        this.timeout = null;
    }
    f.DownTime.prototype = {
        constructor: f.DownTime,
        _format: function(time) {
            var el = this.el;
            var flag = this.flag;

            var hour = time / 60;
            hour = Math.floor(hour);
            hour = hour < 0 ? 0 : hour;
            if (hour < 10 && flag === 1) {
                hour = '0' + hour;
            }
            var second = time % 60;
            second = Math.floor(second);
            second = second < 0 ? 0 : second;
            if (second < 10) {
                second = '0' + second;
            }
            var last = '' + hour + ':' + second;
            return last;
        },
        _loopTime: function(time, func, callback) {
            var d1 = new Date;
            var loop = function() {
                var d2 = new Date;
                var t = (d2 - d1) / 1000;
                t = Math.floor(t);
                var leftTime = time - t;
                leftTime = leftTime < 0 ? 0 : leftTime;
                if (typeof func === 'function') {
                    func(leftTime, this._format(leftTime));
                }
                this.leftTime = leftTime;
                if (leftTime > 0) {
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(loop, 1000);
                } else {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            }.bind(this);
            loop();
        },
        // 开始
        start: function(func, callback) {
            this.func = func;
            this.callback = callback;
            this._loopTime(this.time, func, callback);
            return this;
        },
        // 重新开始
        reStart: function() {
            this.time = this.timeOrg;
            this.start.apply(this, arguments);
        },
        // 恢复
        recover: function() {
            this._loopTime(this.leftTime, this.func, this.callback);
        },
        // 设置时间并且重现开始
        setTime: function(time) {
            this.stop();
            this._loopTime(time, this.func, this.callback);
        },
        // 停止
        stop: function() {
            clearTimeout(this.timeout);
            return this;
        }
    }

    window.convertXMLToNode = function(xmlText) {
        var node;
        var jsonObj = xml_str2json(xmlText);
        node = convertJSONToNode(jsonObj);
        return node;

        function convertJSONToNode(jsonObj) {
            var type = jsonObj.type;
            if (!laya.ui[type]) {
                return null;
            }
            var node = new laya.ui[type]();
            var props = jsonObj.props;
            for (var prop_name in props) {
                // 属性
                var prop_val = props[prop_name];

                if (!isNaN(Number(prop_val))) {
                    prop_val = Number(prop_val);
                }
                node[prop_name] = prop_val;
            }
            var childs = jsonObj.childs;
            for (var i = 0; i < childs.length; i++) {
                var child_json = childs[i];
                var child_node = convertJSONToNode(child_json);
                if (child_node) {
                    node.addChild(child_node);
                }
            }
            return node;
        }

        function xml2json(node, path) {
            var result = {};
            result.type = getNodeLocalName(node);
            result.childs = [];
            var nodeChildren = node.childNodes;
            for (var cidx = 0; cidx < nodeChildren.length; cidx++) {
                var child = nodeChildren.item(cidx);
                var childName = getNodeLocalName(child);
                var _child = xml2json(child);
                result.childs.push(_child);
            }

            // Attributes
            if (node.attributes) {
                result.props = {};
                for (var aidx = 0; aidx < node.attributes.length; aidx++) {
                    var attr = node.attributes.item(aidx);
                    result.props[attr.name] = attr.value;
                }
            }
            return result;
        }

        function getNodeLocalName(node) {
            var nodeLocalName = node.localName;
            if (nodeLocalName === null) // Yeah, this is IE!!
                nodeLocalName = node.baseName;
            if (nodeLocalName === null || nodeLocalName === "") // =="" is IE too
                nodeLocalName = node.nodeName;
            return nodeLocalName;
        }

        function xml_str2json(xmlDocStr) {
            var xmlDoc = parseXmlString(xmlDocStr);
            if (xmlDoc !== null)
                return xml2json(xmlDoc);
            else {
                return null;
            }
        }

        function parseXmlString(xmlDocStr) {
            if (xmlDocStr === undefined) {
                return null;
            }
            var xmlDoc, parser;
            if (window.DOMParser) {
                parser = new window.DOMParser();
            }
            try {
                xmlDoc = parser.parseFromString(xmlDocStr, "text/xml").firstChild;
            } catch (err) {
                xmlDoc = null;
            }
            return xmlDoc;
        }
    };


    // 页面打开时间控制
    f.timeOnPageControl = {
        fire: function(name, time) {
            f.Socket.pubsub.fire(name, time);
        },
        pageOffReset: function() {
            clearTimeout(this.pageOffTimeout);
            f.config.timeOffPage = 0;
            this.fire('timeOffPage', f.config.timeOffPage);
        },
        // 页面关闭计算时间
        pageOffStart: function() {
            var timeBegin = (new Date).getTime();
            var loop = function() {
                var timeEnd = (new Date).getTime();
                f.config.timeOffPage = timeEnd - timeBegin;
                this.fire('timeOffPage', f.config.timeOffPage);
                clearTimeout(this.pageOffTimeout);
                this.pageOffTimeout = setTimeout(loop, 1000);
            }.bind(this);
            loop();
        },
        pageOnReset: function() {
            clearTimeout(this.pageOnTimeout);
            f.config.timeOnPage = 0;
            this.fire('timeOnPage', f.config.timeOnPage);
        },
        // 页面打开计算时间
        pageOnStart: function() {
            var timeBegin = (new Date).getTime();
            var loop = function() {
                var timeEnd = (new Date).getTime();
                f.config.timeOnPage = timeEnd - timeBegin;
                this.fire('timeOnPage', f.config.timeOnPage);
                clearTimeout(this.pageOnTimeout);
                this.pageOnTimeout = setTimeout(loop, 1000);
            }.bind(this);
            loop();
        },
        pageHide: function() {
            f.timeOnPageControl.pageOnReset();
            f.timeOnPageControl.pageOffStart();
        },
        pageOn: function() {
            f.timeOnPageControl.pageOnStart();
            f.timeOnPageControl.pageOffReset();
        },
        init: function() {
            this.pageOnStart();
        }
    }

    // 状态 是否锁屏监听
    f.visibleChangeListen = function() {
        var hidden = "hidden",
            state = "visibilityState",
            visibilityChange = "visibilitychange";
        var document = window.document;
        if (typeof document.hidden !== "undefined") {
            visibilityChange = "visibilitychange";
            state = "visibilityState";
        } else if (typeof document.mozHidden !== "undefined") {
            visibilityChange = "mozvisibilitychange";
            state = "mozVisibilityState";
        } else if (typeof document.msHidden !== "undefined") {
            visibilityChange = "msvisibilitychange";
            state = "msVisibilityState";
        } else if (typeof document.webkitHidden !== "undefined") {
            visibilityChange = "webkitvisibilitychange";
            state = "webkitVisibilityState";
        }
        window.document.addEventListener(visibilityChange, visibleChangeFun);

        function visibleChangeFun() {
            // 当前页面 锁屏或者 最小化
            if (Laya.Browser.document[state] == "hidden") {
                f.timeOnPageControl.pageHide();
            } else {
                f.timeOnPageControl.pageOn();
            }
        }
    }

    // AOP装饰者模式
    Function.prototype._before = function(fn) {
        var _this = this;
        return function() {
            var retBefore = fn.apply(this, arguments);
            if (retBefore === false) {
                return;
            }
            return _this.apply(this, arguments);
        }
    }

    Function.prototype._after = function(fn) {
        var _this = this;
        return function() {
            var ret = _this.apply(this, arguments);
            fn.apply(this, arguments);

            return ret;
        }
    }

})();
