'use strict';

// Common
;(function () {
  var f = window.myUtil = {};

  // 输出log 日志
  f.log = function () {
    if (window.GM && typeof GM.log == 'function') {
      GM.log.apply(GM, arguments);
    } else {
      if (f.debugFE == true) {
        console.log.apply(console, arguments);
      }
    }
  };
  f.console_log = function () {
    console.log.apply(console, arguments);
  };

  // 是否 未登录, true 未登录, false 已登录
  f.notLogged = function () {
    var isLogged = f.config.userLogged;
    if (!isLogged) {
      window.location.href = f.config.userLoginUrl;
    }
    return !isLogged;
  };

  // 观测者模式
  f.pubsub = function () {
    var _default = 'default';
    var Event = function () {
      var namespaceCache = {},
          _slice = Array.prototype.slice,
          _shift = Array.prototype.shift,
          _unshift = Array.prototype.unshift,
          _listen = function _listen(key, fn, cache) {
        if (!cache[key]) {
          cache[key] = [];
        }
        cache[key].push(fn);
      },
          _remove = function _remove(key, cache, fn) {
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
              delete cache[key];
            }
          } else {
            delete cache[key];
          }
        }
      },
          _fire = function _fire() {
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
          _create = function _create(namespace) {
        var namespace = namespace || _default;
        var cache = {};
        var mountArr = [];
        var isOnce = false;
        var mountExec = function mountExec(key, fn) {
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
        };
        ret = {
          listenOnce: function listenOnce(key, fn, context) {
            fn.EXCUTED_ONCE = true;
            this.listen(key, fn, context);
            return this;
          },
          listen: function listen(key, fn, context) {
            var fnBind = fn && fn.bind(context || window);
            if (fnBind) {
              fnBind.fnOrg = fn;
            }

            _listen(key, fnBind, cache);
            mountExec(key, fnBind);
            return this;
          },
          remove: function remove(key, fn, context) {
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
          fire: function fire() {
            // arguments 数组前插入一个 cache参数
            _unshift.call(arguments, cache);
            _fire.apply(null, arguments);
            return this;
          },
          // 强制执行1次
          fireForceOnce: function fireForceOnce() {
            isOnce = true;
            this.fireForce.apply(this, arguments);
            return this;
          },
          fireForce: function fireForce() {
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
        return namespace ? namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret : ret;
      };
      return {
        create: _create
      };
    }();
    return Event;
  }();

  // asyn
  f.asyn = function () {
    var me = this;
    var obj = {};
    var arr = [];
    var method = {
      hook: function hook() {
        var args = f.util.slice.call(arguments);
        arr = arr.concat(args);
        return this;
      },
      unHook: function unHook() {
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
      _done: function _done() {
        arr.forEach(function (item, i) {
          item && item();
        });
        arr = [];
        return this;
      },
      isReady: {},
      ready: function ready(n) {
        // console.log('O(∩_∩)O ----- ready: ' + n);
        this.isReady[n] = true;
        delete obj[n];
        // 查看 obj 属性是否为0
        if (Object.keys(obj).length === 0) {
          this._done();
        }
        return this;
      },
      wait: function wait(n) {
        // console.log('(-_-)ZZ ----- wait:  ' + n);
        obj[n] = 'wait';
        return this;
      }
    };
    return method;
  };

  /*
      毫秒数
  */
  f.DownTimeMsec = function (time, loopTime) {
    this.time = parseInt(time, 10);
    this.loopTime = loopTime || 50;
    this.timeout = null;
  };
  f.DownTimeMsec.prototype = {
    constructor: f.DownTimeMsec,
    _loopTime: function _loopTime(time, func, callback) {
      var self = this;

      var d1 = new Date();
      var loop = function loop() {
        var d2 = new Date();
        var t = d2 - d1;
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
      };
      loop();

      return this;
    },
    // 开始
    start: function start(func, callback) {
      this.func = func;
      this.callback = callback;
      this._loopTime(this.time, func, callback);
      return this;
    },
    // 设置时间并且重现开始
    setTime: function setTime(time) {
      this.stop();
      this._loopTime(time, this.func, this.callback);
    },
    stop: function stop() {
      clearTimeout(this.timeout);
      return this;
    }
  };

  /*
     倒计时
     time 为秒
     flag 是当小时只有1位小数并且小时小于10, 是否前面加0
   */
  f.DownTime = function (time, flag) {
    this.time = parseInt(time, 10);
    this.timeOrg = this.time;
    this.leftTime = this.time;
    this.flag = flag;
    this.timeout = null;
  };
  f.DownTime.prototype = {
    constructor: f.DownTime,
    _format: function _format(time) {
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
    _loopTime: function _loopTime(time, func, callback) {
      var d1 = new Date();
      var loop = function () {
        var d2 = new Date();
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
    start: function start(func, callback) {
      this.func = func;
      this.callback = callback;
      this._loopTime(this.time, func, callback);
      return this;
    },
    // 重新开始
    reStart: function reStart() {
      this.time = this.timeOrg;
      this.start.apply(this, arguments);
    },
    // 恢复
    recover: function recover() {
      this._loopTime(this.leftTime, this.func, this.callback);
    },
    // 设置时间并且重现开始
    setTime: function setTime(time) {
      this.stop();
      this._loopTime(time, this.func, this.callback);
    },
    // 停止
    stop: function stop() {
      clearTimeout(this.timeout);
      return this;
    }
  };

  // 本地相对应父元素的坐标节点
  Laya.Node.prototype.localToTarget = function (target) {
    var point = { x: 0, y: 0 };
    var ele = this;
    while (ele) {
      if (ele == target || ele == Laya.stage) break;
      point = ele.toParentPoint(point);
      ele = ele.parent;
    }
    return point;
  };

  // 获得深度节点, flag 为 找到一个就不再寻找, 还是查找所有的
  Laya.Node.prototype.find = function (name, flag) {
    var loop = function loop(nodes) {
      var childs = nodes._childs;
      var it;
      var arr = [];
      if (!childs) {
        return arr;
      }
      for (var i = 0, n = childs.length; i < n; i++) {
        var item = childs[i];
        if (item.name === name) {
          arr.push(item);
          if (flag !== true) {
            break;
          }
        } else {
          it = loop(item);
          arr = arr.concat(it);
          // 若找到了 并且当前的 flag不为true, 则直接 return
          if (it.length > 0 && flag !== true) {
            break;
          }
        }
      }
      return arr;
    };

    var res = loop(this);
    var len = res.length;
    // 张世阳加的
    if (flag) {
      return res;
    }
    if (len == 0) {
      res = null;
    } else if (len == 1) {
      res = res[0];
    }
    return res;
  };

  // 获得深度节点, flag 为 找到一个就不再寻找, 还是查找所有的
  Laya.Node.prototype.findType = function (type, flag) {
    var loop = function loop(root_dom) {
      var arr = [];
      var typeParent = mapType(type);
      if (!typeParent) {
        return arr;
      }
      for (var i = 0; i < root_dom.numChildren; i++) {
        if (root_dom.getChildAt(i) instanceof typeParent) {
          arr.push(root_dom.getChildAt(i));
        }
      }
      for (var i = 0; i < root_dom.numChildren; i++) {
        arr = arr.concat(loop(root_dom.getChildAt(i)));
      }
      return arr;
    };

    function mapType(typeStr) {
      var type_arr = typeStr.split('.');
      var result;
      for (var i = 0; i < type_arr.length; i++) {
        var type = type_arr[i];
        if (i === 0) {
          result = laya.ui[type] || ui[type] || laya.display[type];
        } else {
          result = result[type];
        }
        if (!result) {
          // 如果没有
          break;
        }
      }

      return result;
    }
    var res = loop(this);
    var len = res.length;

    if (flag) {
      return res;
    }

    if (len == 0) {
      res = null;
    } else if (len == 1) {
      res = res[0];
    }
    return res;
  };

  window.convertXMLToNode = function (xmlText) {
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
      if (xmlDoc !== null) return xml2json(xmlDoc);else {
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
    fire: function fire(name, time) {
      f.Socket.pubsub.fire(name, time);
    },
    pageOffReset: function pageOffReset() {
      clearTimeout(this.pageOffTimeout);
      f.config.timeOffPage = 0;
      this.fire('timeOffPage', f.config.timeOffPage);
    },
    // 页面关闭计算时间
    pageOffStart: function pageOffStart() {
      var timeBegin = new Date().getTime();
      var loop = function () {
        var timeEnd = new Date().getTime();
        f.config.timeOffPage = timeEnd - timeBegin;
        this.fire('timeOffPage', f.config.timeOffPage);
        clearTimeout(this.pageOffTimeout);
        this.pageOffTimeout = setTimeout(loop, 1000);
      }.bind(this);
      loop();
    },
    pageOnReset: function pageOnReset() {
      clearTimeout(this.pageOnTimeout);
      f.config.timeOnPage = 0;
      this.fire('timeOnPage', f.config.timeOnPage);
    },
    // 页面打开计算时间
    pageOnStart: function pageOnStart() {
      var timeBegin = new Date().getTime();
      var loop = function () {
        var timeEnd = new Date().getTime();
        f.config.timeOnPage = timeEnd - timeBegin;
        this.fire('timeOnPage', f.config.timeOnPage);
        clearTimeout(this.pageOnTimeout);
        this.pageOnTimeout = setTimeout(loop, 1000);
      }.bind(this);
      loop();
    },
    pageHide: function pageHide() {
      f.timeOnPageControl.pageOnReset();
      f.timeOnPageControl.pageOffStart();
    },
    pageOn: function pageOn() {
      f.timeOnPageControl.pageOnStart();
      f.timeOnPageControl.pageOffReset();
    },
    init: function init() {
      this.pageOnStart();
    }
  };

  // 状态 是否锁屏监听
  f.visibleChangeListen = function () {
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
  };
})();
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function () {
  var n = this,
      t = n._,
      r = Array.prototype,
      e = Object.prototype,
      u = Function.prototype,
      i = r.push,
      a = r.slice,
      o = r.concat,
      l = e.toString,
      c = e.hasOwnProperty,
      f = Array.isArray,
      s = Object.keys,
      p = u.bind,
      h = function h(n) {
    return n instanceof h ? n : this instanceof h ? void (this._wrapped = n) : new h(n);
  };"undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = h), exports._ = h) : n._ = h, h.VERSION = "1.7.0";var g = function g(n, t, r) {
    if (t === void 0) return n;switch (null == r ? 3 : r) {case 1:
        return function (r) {
          return n.call(t, r);
        };case 2:
        return function (r, e) {
          return n.call(t, r, e);
        };case 3:
        return function (r, e, u) {
          return n.call(t, r, e, u);
        };case 4:
        return function (r, e, u, i) {
          return n.call(t, r, e, u, i);
        };}return function () {
      return n.apply(t, arguments);
    };
  };h.iteratee = function (n, t, r) {
    return null == n ? h.identity : h.isFunction(n) ? g(n, t, r) : h.isObject(n) ? h.matches(n) : h.property(n);
  }, h.each = h.forEach = function (n, t, r) {
    if (null == n) return n;t = g(t, r);var e,
        u = n.length;if (u === +u) for (e = 0; u > e; e++) {
      t(n[e], e, n);
    } else {
      var i = h.keys(n);for (e = 0, u = i.length; u > e; e++) {
        t(n[i[e]], i[e], n);
      }
    }return n;
  }, h.map = h.collect = function (n, t, r) {
    if (null == n) return [];t = h.iteratee(t, r);for (var e, u = n.length !== +n.length && h.keys(n), i = (u || n).length, a = Array(i), o = 0; i > o; o++) {
      e = u ? u[o] : o, a[o] = t(n[e], e, n);
    }return a;
  };var v = "Reduce of empty array with no initial value";h.reduce = h.foldl = h.inject = function (n, t, r, e) {
    null == n && (n = []), t = g(t, e, 4);var u,
        i = n.length !== +n.length && h.keys(n),
        a = (i || n).length,
        o = 0;if (arguments.length < 3) {
      if (!a) throw new TypeError(v);r = n[i ? i[o++] : o++];
    }for (; a > o; o++) {
      u = i ? i[o] : o, r = t(r, n[u], u, n);
    }return r;
  }, h.reduceRight = h.foldr = function (n, t, r, e) {
    null == n && (n = []), t = g(t, e, 4);var u,
        i = n.length !== +n.length && h.keys(n),
        a = (i || n).length;if (arguments.length < 3) {
      if (!a) throw new TypeError(v);r = n[i ? i[--a] : --a];
    }for (; a--;) {
      u = i ? i[a] : a, r = t(r, n[u], u, n);
    }return r;
  }, h.find = h.detect = function (n, t, r) {
    var e;return t = h.iteratee(t, r), h.some(n, function (n, r, u) {
      return t(n, r, u) ? (e = n, !0) : void 0;
    }), e;
  }, h.filter = h.select = function (n, t, r) {
    var e = [];return null == n ? e : (t = h.iteratee(t, r), h.each(n, function (n, r, u) {
      t(n, r, u) && e.push(n);
    }), e);
  }, h.reject = function (n, t, r) {
    return h.filter(n, h.negate(h.iteratee(t)), r);
  }, h.every = h.all = function (n, t, r) {
    if (null == n) return !0;t = h.iteratee(t, r);var e,
        u,
        i = n.length !== +n.length && h.keys(n),
        a = (i || n).length;for (e = 0; a > e; e++) {
      if (u = i ? i[e] : e, !t(n[u], u, n)) return !1;
    }return !0;
  }, h.some = h.any = function (n, t, r) {
    if (null == n) return !1;t = h.iteratee(t, r);var e,
        u,
        i = n.length !== +n.length && h.keys(n),
        a = (i || n).length;for (e = 0; a > e; e++) {
      if (u = i ? i[e] : e, t(n[u], u, n)) return !0;
    }return !1;
  }, h.contains = h.include = function (n, t) {
    return null == n ? !1 : (n.length !== +n.length && (n = h.values(n)), h.indexOf(n, t) >= 0);
  }, h.invoke = function (n, t) {
    var r = a.call(arguments, 2),
        e = h.isFunction(t);return h.map(n, function (n) {
      return (e ? t : n[t]).apply(n, r);
    });
  }, h.pluck = function (n, t) {
    return h.map(n, h.property(t));
  }, h.where = function (n, t) {
    return h.filter(n, h.matches(t));
  }, h.findWhere = function (n, t) {
    return h.find(n, h.matches(t));
  }, h.max = function (n, t, r) {
    var e,
        u,
        i = -1 / 0,
        a = -1 / 0;if (null == t && null != n) {
      n = n.length === +n.length ? n : h.values(n);for (var o = 0, l = n.length; l > o; o++) {
        e = n[o], e > i && (i = e);
      }
    } else t = h.iteratee(t, r), h.each(n, function (n, r, e) {
      u = t(n, r, e), (u > a || u === -1 / 0 && i === -1 / 0) && (i = n, a = u);
    });return i;
  }, h.min = function (n, t, r) {
    var e,
        u,
        i = 1 / 0,
        a = 1 / 0;if (null == t && null != n) {
      n = n.length === +n.length ? n : h.values(n);for (var o = 0, l = n.length; l > o; o++) {
        e = n[o], i > e && (i = e);
      }
    } else t = h.iteratee(t, r), h.each(n, function (n, r, e) {
      u = t(n, r, e), (a > u || 1 / 0 === u && 1 / 0 === i) && (i = n, a = u);
    });return i;
  }, h.shuffle = function (n) {
    for (var t, r = n && n.length === +n.length ? n : h.values(n), e = r.length, u = Array(e), i = 0; e > i; i++) {
      t = h.random(0, i), t !== i && (u[i] = u[t]), u[t] = r[i];
    }return u;
  }, h.sample = function (n, t, r) {
    return null == t || r ? (n.length !== +n.length && (n = h.values(n)), n[h.random(n.length - 1)]) : h.shuffle(n).slice(0, Math.max(0, t));
  }, h.sortBy = function (n, t, r) {
    return t = h.iteratee(t, r), h.pluck(h.map(n, function (n, r, e) {
      return { value: n, index: r, criteria: t(n, r, e) };
    }).sort(function (n, t) {
      var r = n.criteria,
          e = t.criteria;if (r !== e) {
        if (r > e || r === void 0) return 1;if (e > r || e === void 0) return -1;
      }return n.index - t.index;
    }), "value");
  };var m = function m(n) {
    return function (t, r, e) {
      var u = {};return r = h.iteratee(r, e), h.each(t, function (e, i) {
        var a = r(e, i, t);n(u, e, a);
      }), u;
    };
  };h.groupBy = m(function (n, t, r) {
    h.has(n, r) ? n[r].push(t) : n[r] = [t];
  }), h.indexBy = m(function (n, t, r) {
    n[r] = t;
  }), h.countBy = m(function (n, t, r) {
    h.has(n, r) ? n[r]++ : n[r] = 1;
  }), h.sortedIndex = function (n, t, r, e) {
    r = h.iteratee(r, e, 1);for (var u = r(t), i = 0, a = n.length; a > i;) {
      var o = i + a >>> 1;r(n[o]) < u ? i = o + 1 : a = o;
    }return i;
  }, h.toArray = function (n) {
    return n ? h.isArray(n) ? a.call(n) : n.length === +n.length ? h.map(n, h.identity) : h.values(n) : [];
  }, h.size = function (n) {
    return null == n ? 0 : n.length === +n.length ? n.length : h.keys(n).length;
  }, h.partition = function (n, t, r) {
    t = h.iteratee(t, r);var e = [],
        u = [];return h.each(n, function (n, r, i) {
      (t(n, r, i) ? e : u).push(n);
    }), [e, u];
  }, h.first = h.head = h.take = function (n, t, r) {
    return null == n ? void 0 : null == t || r ? n[0] : 0 > t ? [] : a.call(n, 0, t);
  }, h.initial = function (n, t, r) {
    return a.call(n, 0, Math.max(0, n.length - (null == t || r ? 1 : t)));
  }, h.last = function (n, t, r) {
    return null == n ? void 0 : null == t || r ? n[n.length - 1] : a.call(n, Math.max(n.length - t, 0));
  }, h.rest = h.tail = h.drop = function (n, t, r) {
    return a.call(n, null == t || r ? 1 : t);
  }, h.compact = function (n) {
    return h.filter(n, h.identity);
  };var y = function y(n, t, r, e) {
    if (t && h.every(n, h.isArray)) return o.apply(e, n);for (var u = 0, a = n.length; a > u; u++) {
      var l = n[u];h.isArray(l) || h.isArguments(l) ? t ? i.apply(e, l) : y(l, t, r, e) : r || e.push(l);
    }return e;
  };h.flatten = function (n, t) {
    return y(n, t, !1, []);
  }, h.without = function (n) {
    return h.difference(n, a.call(arguments, 1));
  }, h.uniq = h.unique = function (n, t, r, e) {
    if (null == n) return [];h.isBoolean(t) || (e = r, r = t, t = !1), null != r && (r = h.iteratee(r, e));for (var u = [], i = [], a = 0, o = n.length; o > a; a++) {
      var l = n[a];if (t) a && i === l || u.push(l), i = l;else if (r) {
        var c = r(l, a, n);h.indexOf(i, c) < 0 && (i.push(c), u.push(l));
      } else h.indexOf(u, l) < 0 && u.push(l);
    }return u;
  }, h.union = function () {
    return h.uniq(y(arguments, !0, !0, []));
  }, h.intersection = function (n) {
    if (null == n) return [];for (var t = [], r = arguments.length, e = 0, u = n.length; u > e; e++) {
      var i = n[e];if (!h.contains(t, i)) {
        for (var a = 1; r > a && h.contains(arguments[a], i); a++) {}a === r && t.push(i);
      }
    }return t;
  }, h.difference = function (n) {
    var t = y(a.call(arguments, 1), !0, !0, []);return h.filter(n, function (n) {
      return !h.contains(t, n);
    });
  }, h.zip = function (n) {
    if (null == n) return [];for (var t = h.max(arguments, "length").length, r = Array(t), e = 0; t > e; e++) {
      r[e] = h.pluck(arguments, e);
    }return r;
  }, h.object = function (n, t) {
    if (null == n) return {};for (var r = {}, e = 0, u = n.length; u > e; e++) {
      t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1];
    }return r;
  }, h.indexOf = function (n, t, r) {
    if (null == n) return -1;var e = 0,
        u = n.length;if (r) {
      if ("number" != typeof r) return e = h.sortedIndex(n, t), n[e] === t ? e : -1;e = 0 > r ? Math.max(0, u + r) : r;
    }for (; u > e; e++) {
      if (n[e] === t) return e;
    }return -1;
  }, h.lastIndexOf = function (n, t, r) {
    if (null == n) return -1;var e = n.length;for ("number" == typeof r && (e = 0 > r ? e + r + 1 : Math.min(e, r + 1)); --e >= 0;) {
      if (n[e] === t) return e;
    }return -1;
  }, h.range = function (n, t, r) {
    arguments.length <= 1 && (t = n || 0, n = 0), r = r || 1;for (var e = Math.max(Math.ceil((t - n) / r), 0), u = Array(e), i = 0; e > i; i++, n += r) {
      u[i] = n;
    }return u;
  };var d = function d() {};h.bind = function (n, t) {
    var r, _e;if (p && n.bind === p) return p.apply(n, a.call(arguments, 1));if (!h.isFunction(n)) throw new TypeError("Bind must be called on a function");return r = a.call(arguments, 2), _e = function e() {
      if (!(this instanceof _e)) return n.apply(t, r.concat(a.call(arguments)));d.prototype = n.prototype;var u = new d();d.prototype = null;var i = n.apply(u, r.concat(a.call(arguments)));return h.isObject(i) ? i : u;
    };
  }, h.partial = function (n) {
    var t = a.call(arguments, 1);return function () {
      for (var r = 0, e = t.slice(), u = 0, i = e.length; i > u; u++) {
        e[u] === h && (e[u] = arguments[r++]);
      }for (; r < arguments.length;) {
        e.push(arguments[r++]);
      }return n.apply(this, e);
    };
  }, h.bindAll = function (n) {
    var t,
        r,
        e = arguments.length;if (1 >= e) throw new Error("bindAll must be passed function names");for (t = 1; e > t; t++) {
      r = arguments[t], n[r] = h.bind(n[r], n);
    }return n;
  }, h.memoize = function (n, t) {
    var r = function r(e) {
      var u = r.cache,
          i = t ? t.apply(this, arguments) : e;return h.has(u, i) || (u[i] = n.apply(this, arguments)), u[i];
    };return r.cache = {}, r;
  }, h.delay = function (n, t) {
    var r = a.call(arguments, 2);return setTimeout(function () {
      return n.apply(null, r);
    }, t);
  }, h.defer = function (n) {
    return h.delay.apply(h, [n, 1].concat(a.call(arguments, 1)));
  }, h.throttle = function (n, t, r) {
    var e,
        u,
        i,
        a = null,
        o = 0;r || (r = {});var l = function l() {
      o = r.leading === !1 ? 0 : h.now(), a = null, i = n.apply(e, u), a || (e = u = null);
    };return function () {
      var c = h.now();o || r.leading !== !1 || (o = c);var f = t - (c - o);return e = this, u = arguments, 0 >= f || f > t ? (clearTimeout(a), a = null, o = c, i = n.apply(e, u), a || (e = u = null)) : a || r.trailing === !1 || (a = setTimeout(l, f)), i;
    };
  }, h.debounce = function (n, t, r) {
    var e,
        u,
        i,
        a,
        o,
        l = function l() {
      var c = h.now() - a;t > c && c > 0 ? e = setTimeout(l, t - c) : (e = null, r || (o = n.apply(i, u), e || (i = u = null)));
    };return function () {
      i = this, u = arguments, a = h.now();var c = r && !e;return e || (e = setTimeout(l, t)), c && (o = n.apply(i, u), i = u = null), o;
    };
  }, h.wrap = function (n, t) {
    return h.partial(t, n);
  }, h.negate = function (n) {
    return function () {
      return !n.apply(this, arguments);
    };
  }, h.compose = function () {
    var n = arguments,
        t = n.length - 1;return function () {
      for (var r = t, e = n[t].apply(this, arguments); r--;) {
        e = n[r].call(this, e);
      }return e;
    };
  }, h.after = function (n, t) {
    return function () {
      return --n < 1 ? t.apply(this, arguments) : void 0;
    };
  }, h.before = function (n, t) {
    var r;return function () {
      return --n > 0 ? r = t.apply(this, arguments) : t = null, r;
    };
  }, h.once = h.partial(h.before, 2), h.keys = function (n) {
    if (!h.isObject(n)) return [];if (s) return s(n);var t = [];for (var r in n) {
      h.has(n, r) && t.push(r);
    }return t;
  }, h.values = function (n) {
    for (var t = h.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) {
      e[u] = n[t[u]];
    }return e;
  }, h.pairs = function (n) {
    for (var t = h.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) {
      e[u] = [t[u], n[t[u]]];
    }return e;
  }, h.invert = function (n) {
    for (var t = {}, r = h.keys(n), e = 0, u = r.length; u > e; e++) {
      t[n[r[e]]] = r[e];
    }return t;
  }, h.functions = h.methods = function (n) {
    var t = [];for (var r in n) {
      h.isFunction(n[r]) && t.push(r);
    }return t.sort();
  }, h.extend = function (n) {
    if (!h.isObject(n)) return n;for (var t, r, e = 1, u = arguments.length; u > e; e++) {
      t = arguments[e];for (r in t) {
        c.call(t, r) && (n[r] = t[r]);
      }
    }return n;
  }, h.pick = function (n, t, r) {
    var e,
        u = {};if (null == n) return u;if (h.isFunction(t)) {
      t = g(t, r);for (e in n) {
        var i = n[e];t(i, e, n) && (u[e] = i);
      }
    } else {
      var l = o.apply([], a.call(arguments, 1));n = new Object(n);for (var c = 0, f = l.length; f > c; c++) {
        e = l[c], e in n && (u[e] = n[e]);
      }
    }return u;
  }, h.omit = function (n, t, r) {
    if (h.isFunction(t)) t = h.negate(t);else {
      var e = h.map(o.apply([], a.call(arguments, 1)), String);t = function t(n, _t) {
        return !h.contains(e, _t);
      };
    }return h.pick(n, t, r);
  }, h.defaults = function (n) {
    if (!h.isObject(n)) return n;for (var t = 1, r = arguments.length; r > t; t++) {
      var e = arguments[t];for (var u in e) {
        n[u] === void 0 && (n[u] = e[u]);
      }
    }return n;
  }, h.clone = function (n) {
    return h.isObject(n) ? h.isArray(n) ? n.slice() : h.extend({}, n) : n;
  }, h.tap = function (n, t) {
    return t(n), n;
  };var b = function b(n, t, r, e) {
    if (n === t) return 0 !== n || 1 / n === 1 / t;if (null == n || null == t) return n === t;n instanceof h && (n = n._wrapped), t instanceof h && (t = t._wrapped);var u = l.call(n);if (u !== l.call(t)) return !1;switch (u) {case "[object RegExp]":case "[object String]":
        return "" + n == "" + t;case "[object Number]":
        return +n !== +n ? +t !== +t : 0 === +n ? 1 / +n === 1 / t : +n === +t;case "[object Date]":case "[object Boolean]":
        return +n === +t;}if ("object" != (typeof n === "undefined" ? "undefined" : _typeof(n)) || "object" != (typeof t === "undefined" ? "undefined" : _typeof(t))) return !1;for (var i = r.length; i--;) {
      if (r[i] === n) return e[i] === t;
    }var a = n.constructor,
        o = t.constructor;if (a !== o && "constructor" in n && "constructor" in t && !(h.isFunction(a) && a instanceof a && h.isFunction(o) && o instanceof o)) return !1;r.push(n), e.push(t);var c, f;if ("[object Array]" === u) {
      if (c = n.length, f = c === t.length) for (; c-- && (f = b(n[c], t[c], r, e));) {}
    } else {
      var s,
          p = h.keys(n);if (c = p.length, f = h.keys(t).length === c) for (; c-- && (s = p[c], f = h.has(t, s) && b(n[s], t[s], r, e));) {}
    }return r.pop(), e.pop(), f;
  };h.isEqual = function (n, t) {
    return b(n, t, [], []);
  }, h.isEmpty = function (n) {
    if (null == n) return !0;if (h.isArray(n) || h.isString(n) || h.isArguments(n)) return 0 === n.length;for (var t in n) {
      if (h.has(n, t)) return !1;
    }return !0;
  }, h.isElement = function (n) {
    return !(!n || 1 !== n.nodeType);
  }, h.isArray = f || function (n) {
    return "[object Array]" === l.call(n);
  }, h.isObject = function (n) {
    var t = typeof n === "undefined" ? "undefined" : _typeof(n);return "function" === t || "object" === t && !!n;
  }, h.each(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (n) {
    h["is" + n] = function (t) {
      return l.call(t) === "[object " + n + "]";
    };
  }), h.isArguments(arguments) || (h.isArguments = function (n) {
    return h.has(n, "callee");
  }), "function" != typeof /./ && (h.isFunction = function (n) {
    return "function" == typeof n || !1;
  }), h.isFinite = function (n) {
    return isFinite(n) && !isNaN(parseFloat(n));
  }, h.isNaN = function (n) {
    return h.isNumber(n) && n !== +n;
  }, h.isBoolean = function (n) {
    return n === !0 || n === !1 || "[object Boolean]" === l.call(n);
  }, h.isNull = function (n) {
    return null === n;
  }, h.isUndefined = function (n) {
    return n === void 0;
  }, h.has = function (n, t) {
    return null != n && c.call(n, t);
  }, h.noConflict = function () {
    return n._ = t, this;
  }, h.identity = function (n) {
    return n;
  }, h.constant = function (n) {
    return function () {
      return n;
    };
  }, h.noop = function () {}, h.property = function (n) {
    return function (t) {
      return t[n];
    };
  }, h.matches = function (n) {
    var t = h.pairs(n),
        r = t.length;return function (n) {
      if (null == n) return !r;n = new Object(n);for (var e = 0; r > e; e++) {
        var u = t[e],
            i = u[0];if (u[1] !== n[i] || !(i in n)) return !1;
      }return !0;
    };
  }, h.times = function (n, t, r) {
    var e = Array(Math.max(0, n));t = g(t, r, 1);for (var u = 0; n > u; u++) {
      e[u] = t(u);
    }return e;
  }, h.random = function (n, t) {
    return null == t && (t = n, n = 0), n + Math.floor(Math.random() * (t - n + 1));
  }, h.now = Date.now || function () {
    return new Date().getTime();
  };var _ = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;" },
      w = h.invert(_),
      j = function j(n) {
    var t = function t(_t2) {
      return n[_t2];
    },
        r = "(?:" + h.keys(n).join("|") + ")",
        e = RegExp(r),
        u = RegExp(r, "g");return function (n) {
      return n = null == n ? "" : "" + n, e.test(n) ? n.replace(u, t) : n;
    };
  };h.escape = j(_), h.unescape = j(w), h.result = function (n, t) {
    if (null == n) return void 0;var r = n[t];return h.isFunction(r) ? n[t]() : r;
  };var x = 0;h.uniqueId = function (n) {
    var t = ++x + "";return n ? n + t : t;
  }, h.templateSettings = { evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g };var A = /(.)^/,
      k = { "'": "'", "\\": "\\", "\r": "r", "\n": "n", "\u2028": "u2028", "\u2029": "u2029" },
      O = /\\|'|\r|\n|\u2028|\u2029/g,
      F = function F(n) {
    return "\\" + k[n];
  };h.template = function (n, t, r) {
    !t && r && (t = r), t = h.defaults({}, t, h.templateSettings);var e = RegExp([(t.escape || A).source, (t.interpolate || A).source, (t.evaluate || A).source].join("|") + "|$", "g"),
        u = 0,
        i = "__p+='";n.replace(e, function (t, r, e, a, o) {
      return i += n.slice(u, o).replace(O, F), u = o + t.length, r ? i += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'" : e ? i += "'+\n((__t=(" + e + "))==null?'':__t)+\n'" : a && (i += "';\n" + a + "\n__p+='"), t;
    }), i += "';\n", t.variable || (i = "with(obj||{}){\n" + i + "}\n"), i = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n";try {
      var a = new Function(t.variable || "obj", "_", i);
    } catch (o) {
      throw o.source = i, o;
    }var l = function l(n) {
      return a.call(this, n, h);
    },
        c = t.variable || "obj";return l.source = "function(" + c + "){\n" + i + "}", l;
  }, h.chain = function (n) {
    var t = h(n);return t._chain = !0, t;
  };var E = function E(n) {
    return this._chain ? h(n).chain() : n;
  };h.mixin = function (n) {
    h.each(h.functions(n), function (t) {
      var r = h[t] = n[t];h.prototype[t] = function () {
        var n = [this._wrapped];return i.apply(n, arguments), E.call(this, r.apply(h, n));
      };
    });
  }, h.mixin(h), h.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (n) {
    var t = r[n];h.prototype[n] = function () {
      var r = this._wrapped;return t.apply(r, arguments), "shift" !== n && "splice" !== n || 0 !== r.length || delete r[0], E.call(this, r);
    };
  }), h.each(["concat", "join", "slice"], function (n) {
    var t = r[n];h.prototype[n] = function () {
      return E.call(this, t.apply(this._wrapped, arguments));
    };
  }), h.prototype.value = function () {
    return this._wrapped;
  }, "function" == typeof define && define.amd && define("underscore", [], function () {
    return h;
  });
}).call(window);
//# sourceMappingURL=underscore-min.map
'use strict';

(function () {
  var default_config = {
    origin_index: 0, // 初始显示的index
    animate_time: 500, // 动画执行时间
    item_space: 10, // item 之间的距离
    move_scope_rate: 1 / 6,
    pagination: true, // false | true || dom
    end_call_back: null // 移动完成执行函数 @para index
  };

  function zsySlider(dom, options) {
    var self = this;
    self.dom = {
      glr: dom
    };
    self.config = {}; // 储存游戏的配置
    self.tmp = {}; // 储存游戏中数据
    self.initConfig(options);
    self.init();
  }
  Laya.class(zsySlider, 'zsySlider');
  var _proto = zsySlider.prototype;

  // 初始化配置
  _proto.initConfig = function (options) {
    var self = this;
    if (!options) {
      options = {};
    }

    self.config.cur_index = options.origin_index || default_config.origin_index;
    self.config.item_space = options.item_space || default_config.item_space;
    self.config.animate_time = options.animate_time || default_config.animate_time;
    self.config.pagination = options.pagination || default_config.pagination;
    self.config.end_call_back = options.end_call_back || default_config.end_call_back;

    // 每次移动的距离
    if (options.item_width) {
      self.config.move_space = options.item_width + self.config.item_space;
      // 每次移动超过这个阈值 才会移动到上一个或者下一个, 不然只是移动到原来的位置
      self.config.move_scope = self.config.move_space * default_config.move_scope_rate;
    }
  };

  _proto.init = function () {
    var self = this;
    self.initDom();
    self.initEvent();

    // 如果option中没有设置item_width, 就根据当前的宽度计算 应该移动的位移
    if (!self.config.move_space) {
      self.config.move_space = self.dom.con.width + self.config.item_space;
      self.config.move_scope = self.config.move_space * default_config.move_scope_rate;
    }
  };

  _proto.initDom = function () {
    var self = this;
    var dom_glr = self.dom.glr;

    self.dom.con = dom_glr.getChildByName('con');
    self.dom.list = self.dom.con.getChildByName('list');
    self.replaceGlrList();
    self.addMask();

    self.dom.items = [];
    for (var i = 0; i < self.dom.list.numChildren; i++) {
      self.dom.items.push(self.dom.list.getChildAt(i));
    }

    if (self.config.pagination) {
      self.dom.pagination = dom_glr.getChildByName('pagination');
    }
  };

  // 在con上面添加mask
  _proto.addMask = function () {
    var self = this;
    var dom_con = self.dom.con;
    dom_con.scrollRect = new laya.maths.Rectangle(0, 0, dom_con.width, dom_con.height);

    // var mask_sprite = new laya.display.Sprite();
    // dom_con.mask = mask_sprite;
  };

  // 将原来ViewStact标签换成新的HBox
  _proto.replaceGlrList = function () {
    var self = this;
    var dom_con = self.dom.con;

    var dom_list = self.dom.list;
    var dom_new_list = new Laya.Box();

    dom_new_list.name = 'list';
    var arr_items = [];
    /*
      将list添加在数组中, 然后在添加到新的list中
      保证新的list中保持原有的顺序
    */
    for (var i = 0; i < dom_list.numChildren; i++) {
      var dom_item = dom_list.getChildAt(i);
      dom_item.name = 'item';
      dom_item.visible = true;
      arr_items.push(dom_item);
    }

    for (var i = 0; i < arr_items.length; i++) {
      if (i == default_config.origin_index) {
        arr_items[i].visible = true;
      } else {
        arr_items[i].visible = false;
      }
      dom_new_list.addChild(arr_items[i]);
    }
    self.dom.list = dom_new_list;
    dom_con.addChild(dom_new_list);
    dom_new_list.space = default_config.item_space;
    dom_new_list.cacheAs = 'none';
    dom_new_list.x = dom_list.x;
    dom_new_list.y = dom_list.y;

    // 删除原有的list
    dom_con.removeChild(dom_list);
    dom_list.destroy();
  };

  _proto.initEvent = function () {
    var self = this;
    var mouse_down = Laya.Event.MOUSE_DOWN;
    var mouse_move = Laya.Event.MOUSE_MOVE;
    var mouse_up = Laya.Event.MOUSE_UP;
    var mouse_out = Laya.Event.MOUSE_OUT;
    var dom_list = self.dom.list;

    if (self.config.pagination) {
      self.dom.pagination.selectHandler = Laya.Handler.create(self, self.paginationHandler, null, false);
    }

    dom_list.on(mouse_down, self, self.onTouchStart);
    dom_list.on(mouse_move, self, self.onTouchMove);
    dom_list.on(mouse_up, self, self.onTouchEnd);
    dom_list.on(mouse_out, self, self.onTouchEnd);
  };

  // 点击paginationHandler的处理函数
  _proto.paginationHandler = function (index) {
    var self = this;
    var dom_pagination = self.dom.pagination;

    if (self.getTouchStatus() === 'onEndAnimate') {
      // 正在touchEnd动画时候不做处理
      return true;
    }
    // 如果用户点击pagination而不是滑动触发, 要移动list
    var cur_index = self.config.cur_index;
    var move_direction, next_show_index;
    next_show_index = index;
    if (cur_index > index) {
      move_direction = 'left';
    } else {
      move_direction = 'right';
    }
    self.handleMoveEffect(move_direction, next_show_index);
    self.animateMove();
  };

  // con 的 mouseDown
  _proto.onTouchStart = function (event) {
    var self = this;
    var dom_list = event.target;
    if (self.getTouchStatus() == 'onEndAnimate') {
      // 正在touchEnd动画时候不做处理
      return true;
    }
    self.tmp.start_point = {
      x: event.stageX,
      y: event.stageY
    };
    self.tmp.origin_pos = {
      x: dom_list.x
    };
    self.setTouchStatus('start');
  };

  // con 的 mouseMove
  _proto.onTouchMove = function (event) {
    var self = this;
    var dom_list = event.target;
    if (self.getTouchStatus() !== 'start' && self.getTouchStatus() !== 'move') {
      return true;
    }

    if (self.getTouchStatus() == 'start') {
      self.setTouchStatus('move');
    }
    self.tmp.move_dist = {
      x: event.stageX - self.tmp.start_point.x,
      y: event.stageY - self.tmp.start_point.y
    };
    dom_list.x = self.tmp.origin_pos.x + self.tmp.move_dist.x;
    self.detectNextShowIndex();
  };

  /*
    如果用户往前划, 将前面的item 显示到前面, 向后滑类式
    预估将要看到的item
  */
  _proto.detectNextShowIndex = function () {
    var self = this;
    var cur_index = self.config.cur_index;
    var dom_items = self.dom.items;
    var items_num = dom_items.length;
    var move_direction, next_show_index;
    var move_dist = self.tmp.move_dist.x;

    if (move_dist > 0) {
      move_direction = 'left';
    } else if (move_dist < 0) {
      move_direction = 'right';
    } else {
      // 没有移动不做处理
      self.tmp.next_show_index = cur_index;
      return true;
    }

    if (move_direction == 'left') {
      next_show_index = cur_index - 1;
    } else {
      next_show_index = cur_index + 1;
    }

    if (next_show_index < 0) {
      next_show_index = items_num - 1;
    } else if (next_show_index >= items_num) {
      next_show_index = 0;
    }
    self.handleMoveEffect(move_direction, next_show_index);
  };

  /*
    通过移动的方向, next_show_index, 将下一个显示的item 移动到相应的位置, 隐藏其他的
  */
  _proto.handleMoveEffect = function (move_direction, next_show_index) {
    var self = this;
    var cur_index = self.config.cur_index;
    var dom_items = self.dom.items;
    var move_space = self.config.move_space;
    if (move_direction == self.tmp.move_direction && next_show_index == self.tmp.next_show_index) {
      // next_show_index 已经出现 无需处理
      return true;
    }
    self.tmp.move_direction = move_direction;
    self.tmp.next_show_index = next_show_index;

    for (var i = 0; i < dom_items.length; i++) {
      if (i == cur_index || i == next_show_index) {
        continue;
      }
      dom_items[i].x = 0;
      dom_items[i].visible = false;
    }

    var dom_next_show = dom_items[next_show_index];
    dom_next_show.visible = true;
    if (move_direction == 'left') {
      dom_next_show.x = -move_space;
    } else {
      dom_next_show.x = move_space;
    }
  };

  // con 的 mouseUp
  _proto.onTouchEnd = function (event) {
    var self = this;
    var move_dist = self.tmp && self.tmp.move_dist && self.tmp.move_dist.x;
    if (self.getTouchStatus() !== 'move') {
      return true;
    }
    if (!move_dist) {
      // 没有移动距离无需做任何操作
      return true;
    }

    var move_dist = self.tmp.move_dist.x;
    if (Math.abs(move_dist) < self.config.move_scope) {
      self.tmp.next_show_index = self.config.cur_index;
    }
    self.animateMove();
  };

  // 滑动结束 滚动最终的位置动画
  _proto.animateMove = function () {
    var self = this;
    var end_call_back = self.config.end_call_back;
    var next_show_index = self.tmp.next_show_index;
    var move_space = self.config.move_space;

    self.setTouchStatus('onEndAnimate');

    if (self.config.cur_index == next_show_index) {
      // 如果两者相等 移动的距离为0
      move_space = 0;
    } else {
      self.config.cur_index = next_show_index;
      if (self.tmp.move_direction == 'right') {
        move_space = -move_space;
      }
    }

    var dom_list = self.dom.list;
    var changeProper = {
      x: move_space
    };

    var Tween = new Laya.Tween();
    Tween.to(dom_list, changeProper, self.config.animate_time, null, Laya.Handler.create(self, callLater));

    function callLater() {
      if (self.config.pagination) {
        self.dom.pagination.selectedIndex = self.config.cur_index; // pagination的处理
      }
      if (end_call_back && typeof end_call_back == 'function') {
        end_call_back(self.config.cur_index);
      }
      self.reset();
    }
  };
  // 重置游戏
  _proto.reset = function () {
    var self = this;
    self.resetGlrCon();
    self.tmp = {};

    self.setTouchStatus('end');
  };

  // 滚动结束之后, reset所有的item
  _proto.resetGlrCon = function () {
    var self = this;
    var dom_list = self.dom.list;
    var dom_items = self.dom.items;
    var cur_index = self.config.cur_index;

    // 将list回到原点, 当前显示的item
    dom_list.x = 0;
    dom_items[cur_index].x = 0;

    for (var i = 0; i < dom_items.length; i++) {
      if (i != self.config.cur_index) {
        dom_items[i].visible = false;
        continue;
      }
      dom_items[i].x = 0; // 将节点的位置设置为0
    }
  };

  // 设置滚动的状态
  _proto.setTouchStatus = function (status) {
    var self = this;
    self.dom.con._zsySlider_touchtatus = status;
  };

  // 获取 滚动的状态
  _proto.getTouchStatus = function () {
    var self = this;
    return self.dom.con._zsySlider_touchtatus;
  };
})();
'use strict';

var CLASS$ = Laya.class;
var STATICATTR$ = Laya.static;
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var smallAwardPopUI = function (_super) {
	function smallAwardPopUI() {

		this.xizhong_box = null;

		smallAwardPopUI.__super.call(this);
	}

	CLASS$(smallAwardPopUI, 'ui.animate.smallAwardPopUI', _super);
	var __proto__ = smallAwardPopUI.prototype;
	__proto__.createChildren = function () {
		View.regComponent("SkeletonPlayer", laya.ani.bone.Skeleton);

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(smallAwardPopUI.uiView);
	};

	STATICATTR$(smallAwardPopUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "width": 200, "visible": true, "height": 200 }, "child": [{ "type": "Label", "props": { "width": 1334, "visible": false, "height": 1334, "centerY": -120, "centerX": 0, "bgColor": "#000000", "alpha": 0.3, "align": "center" } }, { "type": "SkeletonPlayer", "props": { "y": -40, "x": 94, "url": "animate/smallAward.sk", "name": "bg_DB" } }, { "type": "Label", "props": { "y": 63, "x": -56, "width": 317, "text": 800, "name": "dom_text", "height": 86, "font": "award_font", "align": "center" } }, { "type": "Image", "props": { "y": -142, "x": -275, "skin": "room/xzbg.png" } }, { "type": "Box", "props": { "y": -142, "var": "xizhong_box", "centerX": 0 }, "child": [{ "type": "Image", "props": { "y": 1, "skin": "room/xizhong.png" } }, { "type": "Image", "props": { "x": 323, "skin": "room/smallbei.png", "name": "dom_bei" } }, { "type": "Label", "props": { "y": 10, "x": 192, "text": "1", "name": "dom_num", "height": 119, "font": "xizhong_font" } }] }] };
	}]);
	return smallAwardPopUI;
}(View);
var superAwardPopUI = function (_super) {
	function superAwardPopUI() {

		this.dom_blue_bg = null;
		this.xizhong_box = null;

		superAwardPopUI.__super.call(this);
	}

	CLASS$(superAwardPopUI, 'ui.animate.superAwardPopUI', _super);
	var __proto__ = superAwardPopUI.prototype;
	__proto__.createChildren = function () {
		View.regComponent("SkeletonPlayer", laya.ani.bone.Skeleton);

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(superAwardPopUI.uiView);
	};

	STATICATTR$(superAwardPopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 200, "height": 200 }, "child": [{ "type": "SkeletonPlayer", "props": { "y": -54, "x": 99, "url": "animate/superAward.sk", "name": "bg_DB" } }, { "type": "Label", "props": { "y": 130, "x": -59, "width": 317, "text": 800, "name": "dom_text", "height": 86, "font": "award_font", "align": "center" } }, { "type": "Image", "props": { "y": -160, "x": -275, "visible": false, "var": "dom_blue_bg", "skin": "room/xzbg.png" } }, { "type": "Box", "props": { "y": -160, "var": "xizhong_box", "centerX": 20 }, "child": [{ "type": "Label", "props": { "y": 15, "text": "10", "name": "dom_num", "height": 120, "font": "xizhong_font", "align": "left" } }, { "type": "Image", "props": { "x": 202, "skin": "room/Bigbei.png", "name": "dom_bei" } }] }] };
	}]);
	return superAwardPopUI;
}(Dialog);
var hallUI = function (_super) {
	function hallUI() {

		this.room_box = null;
		this.middle_box = null;
		this.header_box = null;

		hallUI.__super.call(this);
	}

	CLASS$(hallUI, 'ui.hall.hallUI', _super);
	var __proto__ = hallUI.prototype;
	__proto__.createChildren = function () {
		View.regComponent("SkeletonPlayer", laya.ani.bone.Skeleton);

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(hallUI.uiView);
	};

	STATICATTR$(hallUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "child": [{ "type": "Image", "props": { "y": 0, "skin": "hall/hallBg.jpg", "centerX": 0 } }, { "type": "Box", "props": { "y": 452, "x": 28, "var": "room_box" }, "child": [{ "type": "Box", "props": { "y": 0, "x": 5, "name": "new" }, "child": [{ "type": "SkeletonPlayer", "props": { "y": 230, "x": 164, "url": "animate/new.sk" } }, { "type": "Image", "props": { "y": 106, "x": 236, "skin": "hall/recommend.png", "name": "recommend" } }, { "type": "Label", "props": { "y": 358, "x": 100, "width": 59, "text": "10人", "name": "people", "height": 20, "fontSize": 20, "font": "Microsoft YaHei", "color": "#8be28d", "bold": false, "align": "left" } }, { "type": "Label", "props": { "y": 358, "x": 152, "width": 90, "text": "1000以上", "name": "min_num", "height": 20, "fontSize": 20, "font": "Microsoft YaHei", "color": "#8be28d", "bold": false, "align": "left" } }, { "type": "Image", "props": { "y": 328, "x": 148, "skin": "hall/beichang.png" } }, { "type": "Label", "props": { "y": 333, "x": 113, "width": 35, "text": "10", "name": "base", "height": 32, "fontSize": 20, "font": "bei_font", "color": "#8be28d", "bold": false, "align": "right" } }, { "type": "Image", "props": { "y": 359, "x": 71, "skin": "hall/new1.png" } }] }, { "type": "Box", "props": { "y": 45, "x": 348, "name": "low" }, "child": [{ "type": "SkeletonPlayer", "props": { "y": 190, "x": 180, "url": "animate/low.sk" } }, { "type": "Label", "props": { "y": 314, "x": 121, "width": 61, "text": "20人", "name": "people", "height": 20, "fontSize": 20, "font": "Microsoft YaHei", "color": "#88a5d6", "bold": false, "align": "left" } }, { "type": "Label", "props": { "y": 314, "x": 170, "width": 90, "text": "2000以上", "name": "min_num", "height": 20, "fontSize": 20, "font": "Microsoft YaHei", "color": "#88a5d6", "bold": false, "align": "left" } }, { "type": "Image", "props": { "y": 57, "x": 253.0000000000001, "skin": "hall/recommend.png", "name": "recommend" } }, { "type": "Image", "props": { "y": 283, "x": 166, "skin": "hall/beichang.png" } }, { "type": "Label", "props": { "y": 287, "x": 130, "width": 35, "text": "50", "name": "base", "height": 26, "fontSize": 20, "font": "bei_font", "color": "#8be28d", "bold": false, "align": "right" } }, { "type": "Image", "props": { "y": 315, "x": 90, "skin": "hall/low2.png" } }] }, { "type": "Box", "props": { "y": 435, "x": 0, "name": "middle" }, "child": [{ "type": "SkeletonPlayer", "props": { "y": 209, "x": 170, "url": "animate/middle.sk" } }, { "type": "Label", "props": { "y": 332, "x": 107, "width": 58, "text": "15人", "name": "people", "height": 20, "fontSize": 20, "font": "Microsoft YaHei", "color": "#edb497", "bold": false, "align": "left" } }, { "type": "Label", "props": { "y": 332, "x": 160, "width": 90, "text": "5000以上", "name": "min_num", "height": 20, "fontSize": 20, "font": "Microsoft YaHei", "color": "#edb497", "bold": false, "align": "left" } }, { "type": "Image", "props": { "y": 68, "x": 239.0000000000001, "skin": "hall/recommend.png", "name": "recommend" } }, { "type": "Image", "props": { "y": 301, "x": 152, "skin": "hall/beichang.png" } }, { "type": "Label", "props": { "y": 306, "x": 116, "width": 35, "text": "100", "name": "base", "height": 26, "fontSize": 20, "font": "bei_font", "color": "#8be28d", "bold": false, "align": "right" } }, { "type": "Image", "props": { "y": 332, "x": 77, "skin": "hall/middle3.png" } }] }, { "type": "Box", "props": { "y": 428, "x": 358, "name": "high" }, "child": [{ "type": "SkeletonPlayer", "props": { "y": 217, "x": 171, "url": "animate/high.sk" } }, { "type": "Label", "props": { "y": 339, "x": 111, "text": "5人", "name": "people", "fontSize": 20, "font": "Microsoft YaHei", "color": "#e48ae3", "bold": false, "align": "left" } }, { "type": "Label", "props": { "y": 339, "x": 162, "width": 90, "text": "10000以上", "name": "min_num", "height": 20, "fontSize": 20, "font": "Microsoft YaHei", "color": "#e48ae3", "bold": false, "align": "left" } }, { "type": "Image", "props": { "y": 71.00000000000011, "x": 241, "skin": "hall/recommend.png", "name": "recommend" } }, { "type": "Image", "props": { "y": 310, "x": 157, "skin": "hall/beichang.png" } }, { "type": "Label", "props": { "y": 314, "x": 121, "width": 35, "text": "200", "name": "base", "height": 26, "fontSize": 20, "font": "bei_font", "color": "#8be28d", "bold": false, "align": "right" } }, { "type": "Image", "props": { "y": 339, "x": 80, "skin": "hall/high4.png" } }] }] }, { "type": "Box", "props": { "y": 133, "x": 0, "width": 750, "var": "middle_box", "mouseThrough": true }, "child": [{ "type": "Image", "props": { "y": 150, "x": 151, "skin": "hall/quick.png", "name": "btn_quick" } }, { "type": "Image", "props": { "y": 55, "x": 513, "visible": false, "skin": "hall/notice.png", "name": "btn_notice" } }, { "type": "Image", "props": { "y": 56, "x": 33, "skin": "hall/gain_list.png", "name": "btn_gainList" } }, { "type": "Image", "props": { "y": -96, "x": 288, "skin": "hall/logo.png" } }, { "type": "Image", "props": { "y": 70, "x": 571, "visible": false, "skin": "hall/red.png", "name": "redPoint" } }, { "type": "Image", "props": { "y": -94, "x": 428, "skin": "load/neice.png", "scaleY": 0.6, "scaleX": 0.6 } }] }, { "type": "Box", "props": { "var": "header_box", "mouseThrough": true, "mouseEnabled": true } }] };
	}]);
	return hallUI;
}(View);
var headerUI = function (_super) {
	function headerUI() {

		this.head_box = null;
		this.you_box = null;
		this.yu_box = null;
		this.marquee_box = null;
		this.menu_box = null;

		headerUI.__super.call(this);
	}

	CLASS$(headerUI, 'ui.hall.headerUI', _super);
	var __proto__ = headerUI.prototype;
	__proto__.createChildren = function () {
		View.regComponent("SkeletonPlayer", laya.ani.bone.Skeleton);

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(headerUI.uiView);
	};

	STATICATTR$(headerUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "width": 750, "mouseThrough": true, "height": 280 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 5, "width": 740, "var": "head_box", "mouseThrough": true }, "child": [{ "type": "Image", "props": { "skin": "hall/back.png", "name": "btn_back" } }, { "type": "Image", "props": { "x": 660, "skin": "hall/menu.png", "name": "btn_menu" } }, { "type": "Image", "props": { "y": 0, "x": 567, "skin": "hall/home_icon.png", "name": "btn_home" } }, { "type": "Box", "props": { "y": 104, "x": 459, "var": "you_box" }, "child": [{ "type": "Box", "props": { "y": 5, "x": 0, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "y": 7, "x": 20, "skin": "hall/tiao_bg.png" } }, { "type": "Image", "props": { "skin": "hall/diamond.png" } }, { "type": "Label", "props": { "y": 13, "x": 57, "width": 30, "text": "游", "height": 24, "fontSize": 24, "font": "SimHei", "color": "#ecf4bb" } }] }, { "type": "Image", "props": { "x": 190, "skin": "hall/shou.png", "name": "btn_shou" } }, { "type": "Label", "props": { "y": 20, "x": 86, "width": 104, "text": "0", "name": "you_num", "height": 24, "fontSize": 20, "font": "Arial", "color": "#ecf4bb", "align": "right" } }] }, { "type": "Box", "props": { "y": 104, "x": 27, "var": "yu_box" }, "child": [{ "type": "Box", "props": { "y": 3, "x": -7.105427357601002e-15, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "y": 9, "x": 20.000000000000007, "skin": "hall/tiao_bg.png" } }, { "type": "Image", "props": { "x": -6.999999999999993, "skin": "hall/coin.png" } }, { "type": "Label", "props": { "y": 15, "x": 50, "width": 28, "text": "余", "height": 24, "fontSize": 24, "font": "SimHei", "color": "#ecf4bb" } }] }, { "type": "Image", "props": { "x": 183, "skin": "hall/chong.png", "name": "btn_chong" } }, { "type": "Label", "props": { "y": 20, "x": 74, "width": 110, "text": "0", "name": "yu_num", "height": 24, "fontSize": 20, "font": "Arial", "color": "#ecf4bb", "align": "right" } }] }, { "type": "Image", "props": { "y": 190, "x": 622, "skin": "hall/record.png", "name": "btn_record" } }, { "type": "SkeletonPlayer", "props": { "y": 360, "x": 374, "url": "animate/fudai.sk", "name": "fudai_DB" } }] }, { "type": "Box", "props": { "y": 5, "x": 115, "width": 445, "var": "marquee_box", "height": 44 }, "child": [{ "type": "Box", "props": { "name": "text_box" }, "child": [{ "type": "Label", "props": { "y": 3, "x": 0, "valign": "middle", "name": "text_content", "fontSize": 23, "font": "Microsoft YaHei", "color": "#fefefe" } }] }] }, { "type": "Box", "props": { "y": 92, "x": 403, "var": "menu_box" } }] };
	}]);
	return headerUI;
}(View);
var menuUI = function (_super) {
	function menuUI() {

		this.btn_help = null;
		this.btn_sound = null;

		menuUI.__super.call(this);
	}

	CLASS$(menuUI, 'ui.hall.menuUI', _super);
	var __proto__ = menuUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(menuUI.uiView);
	};

	STATICATTR$(menuUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "width": 337, "height": 238 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "hall/menu_add.png" } }, { "type": "Image", "props": { "y": 44, "x": 30, "skin": "hall/music.png" } }, { "type": "Label", "props": { "y": 52, "x": 116, "width": 74, "text": "音 效", "height": 48, "fontSize": 32, "font": "Microsoft YaHei", "color": "#ede6ff" } }, { "type": "Box", "props": { "y": 148, "x": 30, "var": "btn_help", "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "skin": "hall/help.png" } }, { "type": "Label", "props": { "y": 11, "x": 86, "width": 74, "text": "帮 助", "height": 48, "fontSize": 32, "font": "Microsoft YaHei", "color": "#ede6ff" } }, { "type": "Image", "props": { "y": 21, "x": 234, "skin": "hall/da.png" } }] }, { "type": "Clip", "props": { "y": 49, "x": 199, "var": "btn_sound", "skin": "hall/clip_onoff.png", "index": 0, "clipY": 2 } }] };
	}]);
	return menuUI;
}(View);
var fruitLoadingUI = function (_super) {
	function fruitLoadingUI() {

		this.fruit_box = null;
		this.txt = null;

		fruitLoadingUI.__super.call(this);
	}

	CLASS$(fruitLoadingUI, 'ui.load.fruitLoadingUI', _super);
	var __proto__ = fruitLoadingUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(fruitLoadingUI.uiView);
	};

	STATICATTR$(fruitLoadingUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "width": 750, "mouseEnabled": true, "height": 1334 }, "child": [{ "type": "Label", "props": { "width": 1334, "mouseEnabled": false, "height": 1334, "fontSize": 28, "font": "Microsoft YaHei", "color": "#ffffff", "centerX": 0, "bgColor": "#000000", "alpha": 0.7 } }, { "type": "Box", "props": { "y": 700, "x": 225, "width": 300, "var": "fruit_box", "height": 110 }, "child": [{ "type": "Image", "props": { "y": 37, "x": 50, "skin": "load/1.png", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Image", "props": { "y": 36, "x": 147, "skin": "load/2.png", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Image", "props": { "y": 38, "x": 246, "skin": "load/3.png", "anchorY": 0.5, "anchorX": 0.5 } }] }, { "type": "Label", "props": { "y": 818, "x": 274, "width": 201, "var": "txt", "text": "请稍等...", "height": 28, "fontSize": 28, "font": "Microsoft YaHei", "color": "#ffffff", "align": "center" } }] };
	}]);
	return fruitLoadingUI;
}(View);
var loadingUI = function (_super) {
	function loadingUI() {

		this.load_box = null;
		this.fruit_box = null;

		loadingUI.__super.call(this);
	}

	CLASS$(loadingUI, 'ui.load.loadingUI', _super);
	var __proto__ = loadingUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(loadingUI.uiView);
	};

	STATICATTR$(loadingUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "child": [{ "type": "Image", "props": { "y": 0, "width": 1334, "skin": "load/loading_bg.jpg", "height": 1334, "centerX": 0 } }, { "type": "Box", "props": { "y": 0, "width": 750, "height": 1334 }, "child": [{ "type": "Box", "props": { "y": 0, "width": 619, "height": 615, "centerX": 0, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "y": 213, "skin": "load/logo.png", "centerX": 0 } }, { "type": "Image", "props": { "y": 266, "x": 473, "skin": "load/neice.png" } }] }, { "type": "Box", "props": { "y": 922, "var": "load_box", "centerX": 0 }, "child": [{ "type": "Image", "props": { "y": 1, "x": 4, "skin": "load/strip_bg.png" } }, { "type": "Label", "props": { "y": 84, "x": 196, "text": "正在加载中...", "name": "txt", "fontSize": 28, "font": "Microsoft YaHei", "color": "#ffffff" } }, { "type": "Image", "props": { "y": 0, "x": 3, "skin": "load/strip.png", "name": "load_content" } }, { "type": "Box", "props": { "y": -75, "x": 108, "var": "fruit_box" }, "child": [{ "type": "Image", "props": { "y": 37, "x": 50, "skin": "load/1.png", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Image", "props": { "y": 36, "x": 147, "skin": "load/2.png", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Image", "props": { "y": 38, "x": 246, "skin": "load/3.png", "anchorY": 0.5, "anchorX": 0.5 } }] }] }] }, { "type": "Image", "props": { "y": 1131, "x": 0, "skin": "load/fangcenmi.png" } }] };
	}]);
	return loadingUI;
}(View);
var advertisePopUI = function (_super) {
	function advertisePopUI() {

		this.img = null;

		advertisePopUI.__super.call(this);
	}

	CLASS$(advertisePopUI, 'ui.pop.advertisePopUI', _super);
	var __proto__ = advertisePopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(advertisePopUI.uiView);
	};

	STATICATTR$(advertisePopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 750, "height": 1334 }, "child": [{ "type": "Image", "props": { "var": "img", "skin": "room/look.png", "centerY": 0, "centerX": 0 } }] };
	}]);
	return advertisePopUI;
}(Dialog);
var commonPopUI = function (_super) {
	function commonPopUI() {

		this.btn_close = null;
		this.btn_box = null;
		this.txt_box = null;

		commonPopUI.__super.call(this);
	}

	CLASS$(commonPopUI, 'ui.pop.commonPopUI', _super);
	var __proto__ = commonPopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(commonPopUI.uiView);
	};

	STATICATTR$(commonPopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 610, "height": 440 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 609, "skin": "pop/bg.png", "name": "pop_bg", "height": 437, "sizeGrid": "43,228,30,227" } }, { "type": "Button", "props": { "y": -15, "x": 549, "var": "btn_close", "stateNum": 1, "skin": "pop/btn_close.png" } }, { "type": "Box", "props": { "y": 324, "x": 190, "var": "btn_box", "bottom": 40 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "name": "btn_sure", "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "skin": "pop/knowbg.png" } }, { "type": "Image", "props": { "y": 34, "x": 113, "skin": "pop/txtknow.png", "pivotY": 19.130434782608745, "pivotX": 53.913043478260846, "name": "btn_txt" } }] }] }, { "type": "Box", "props": { "y": 60, "x": 36, "var": "txt_box" }, "child": [{ "type": "Image", "props": { "width": 538, "skin": "pop/txtbg.png", "name": "txt_bg", "height": 222, "sizeGrid": "13,17,17,15" } }, { "type": "Label", "props": { "y": 50, "x": 38, "wordWrap": true, "width": 462, "text": "的地方地方", "name": "txt_content", "leading": 10, "fontSize": 24, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "center" } }] }] };
	}]);
	return commonPopUI;
}(Dialog);
var gainPopUI = function (_super) {
	function gainPopUI() {

		this.txt_box = null;

		gainPopUI.__super.call(this);
	}

	CLASS$(gainPopUI, 'ui.pop.gainPopUI', _super);
	var __proto__ = gainPopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(gainPopUI.uiView);
	};

	STATICATTR$(gainPopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 610, "height": 440 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 609, "skin": "pop/bg.png", "name": "pop_bg", "height": 288, "sizeGrid": "43,228,30,227" } }, { "type": "Button", "props": { "y": -15, "x": 549, "stateNum": 1, "skin": "pop/btn_close.png", "name": "close" } }, { "type": "Box", "props": { "y": 60, "x": 36, "var": "txt_box" }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 538, "skin": "pop/txtbg.png", "name": "txt_bg", "height": 173, "sizeGrid": "13,17,17,15" } }, { "type": "Label", "props": { "y": 50, "x": 106, "wordWrap": true, "width": 213, "text": "在盈利榜中瓜分了", "leading": 10, "height": 34, "fontSize": 24, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "center" } }, { "type": "Label", "props": { "y": 83, "x": 152, "wordWrap": true, "width": 234, "visible": true, "text": "点击盈利榜查看吧！", "leading": 10, "height": 34, "fontSize": 24, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "center" } }, { "type": "Label", "props": { "y": 50, "x": 316, "wordWrap": true, "width": 213, "text": "1000", "name": "txt_content", "leading": 10, "height": 34, "fontSize": 24, "font": "Microsoft YaHei", "color": "#edf446", "align": "left" } }] }, { "type": "Image", "props": { "y": -262, "x": 54, "skin": "pop/gongxi.png" } }] };
	}]);
	return gainPopUI;
}(Dialog);
var helpPopUI = function (_super) {
	function helpPopUI() {

		this.help_glr = null;

		helpPopUI.__super.call(this);
	}

	CLASS$(helpPopUI, 'ui.pop.helpPopUI', _super);
	var __proto__ = helpPopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(helpPopUI.uiView);
	};

	STATICATTR$(helpPopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 750, "height": 1150 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 50, "width": 650, "skin": "pop/bg.png", "height": 1150, "sizeGrid": "43,228,30,227" } }, { "type": "Button", "props": { "y": -16, "x": 646, "stateNum": "1", "skin": "pop/btn_close.png", "name": "close" } }, { "type": "Box", "props": { "y": -38, "x": 151, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "skin": "pop/ylb/title_bg.png" } }, { "type": "Image", "props": { "y": 24, "x": 122, "skin": "pop/help/yxgz.png" } }] }, { "type": "Box", "props": { "y": 1087, "x": 225, "name": "close_box" }, "child": [{ "type": "Image", "props": { "skin": "pop/help/bgbtn.png" } }, { "type": "Image", "props": { "y": 31, "x": 28, "skin": "pop/help/txt.png" } }] }, { "type": "Box", "props": { "y": 83, "x": 77, "var": "help_glr" }, "child": [{ "type": "Tab", "props": { "y": 946, "x": 261, "space": 30, "skin": "pop/help/btn_help.png", "selectedIndex": 0, "name": "pagination", "direction": "horizontal" }, "child": [{ "type": "Button", "props": { "stateNum": "2", "skin": "pop/help/btn_help.png", "name": "item0" } }, { "type": "Button", "props": { "y": 10, "x": 10, "stateNum": "2", "skin": "pop/help/btn_help.png", "name": "item1" } }] }, { "type": "Box", "props": { "y": 0, "x": 12, "name": "con" }, "child": [{ "type": "ViewStack", "props": { "y": 0, "selectedIndex": 0, "name": "list" }, "child": [{ "type": "Box", "props": { "width": 595, "name": "item0", "height": 921 }, "child": [{ "type": "Image", "props": { "skin": "pop/help/first.png" } }] }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 595, "name": "item1", "height": 921 }, "child": [{ "type": "Image", "props": { "skin": "pop/help/second.png" } }] }] }] }] }] };
	}]);
	return helpPopUI;
}(Dialog);
var historyPopUI = function (_super) {
	function historyPopUI() {

		this.ylb_content_box = null;
		this.ylb_content_list = null;

		historyPopUI.__super.call(this);
	}

	CLASS$(historyPopUI, 'ui.pop.historyPopUI', _super);
	var __proto__ = historyPopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(historyPopUI.uiView);
	};

	STATICATTR$(historyPopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 660, "height": 580 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 660, "skin": "pop/bg.png", "height": 575, "sizeGrid": "43,228,30,227" } }, { "type": "Button", "props": { "y": -14, "x": 594, "stateNum": "1", "skin": "pop/btn_close.png", "name": "close" } }, { "type": "Box", "props": { "y": 60, "x": 37, "width": 575, "var": "ylb_content_box", "height": 433 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 572, "skin": "pop/txtbg.png", "height": 460, "sizeGrid": "13,17,17,15" } }, { "type": "Image", "props": { "y": 10, "x": 8, "width": 556, "skin": "pop/ylb/content_bg.png", "height": 438, "sizeGrid": "64,20,14,15" } }, { "type": "Label", "props": { "y": 27, "x": 20, "width": 534, "text": "         时间                  玩家名称           分奖金额", "height": 38, "fontSize": 24, "font": "Microsoft YaHei", "color": "#ffffff", "cacheAs": "bitmap" } }] }, { "type": "List", "props": { "y": 80, "x": 16, "width": 542, "var": "ylb_content_list", "vScrollBarSkin": "pop/help/vscroll.png", "spaceY": 5, "height": 364 }, "child": [{ "type": "Box", "props": { "name": "render" }, "child": [{ "type": "Clip", "props": { "skin": "pop/ylb/clip_tiao.png", "name": "bg", "index": 0, "clipY": 2 } }, { "type": "Label", "props": { "y": 15, "x": 0, "width": 228, "visible": true, "name": "time", "height": 22, "fontSize": 22, "font": "Microsoft YaHei", "color": "#5a3586", "align": "center" } }, { "type": "Label", "props": { "y": 15, "x": 233, "width": 163, "name": "name", "height": 27, "fontSize": 22, "font": "Microsoft YaHei", "color": "#5a3586", "align": "center" } }, { "type": "Label", "props": { "y": 15, "x": 392, "width": 132, "name": "coin", "height": 27, "fontSize": 22, "font": "Microsoft YaHei", "color": "#ffed22 ", "align": "center" } }] }] }] }, { "type": "Label", "props": { "y": 530, "x": 58, "width": 534, "visible": false, "text": "说明说明", "name": "instruction", "height": 38, "fontSize": 20, "font": "Microsoft YaHei", "color": "#ffffff", "cacheAs": "bitmap", "align": "center" } }] };
	}]);
	return historyPopUI;
}(Dialog);
var keybordUI = function (_super) {
	function keybordUI() {

		this.btn_box = null;

		keybordUI.__super.call(this);
	}

	CLASS$(keybordUI, 'ui.pop.keybordUI', _super);
	var __proto__ = keybordUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(keybordUI.uiView);
	};

	STATICATTR$(keybordUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "width": 750, "height": 350 }, "child": [{ "type": "Box", "props": { "y": 12, "x": 10, "cacheAs": "bitmap" }, "child": [{ "type": "Label", "props": { "y": -12, "x": -10, "width": 750, "height": 350, "color": "#000", "bgColor": "#000000", "alpha": 0.5 } }, { "type": "Image", "props": { "width": 138, "skin": "pop/numBtn.png", "height": 97 } }, { "type": "Image", "props": { "x": 150, "skin": "pop/numBtn.png" } }, { "type": "Image", "props": { "x": 300, "skin": "pop/numBtn.png" } }, { "type": "Image", "props": { "x": 449, "skin": "pop/numBtn.png" } }, { "type": "Image", "props": { "y": 115, "skin": "pop/numBtn.png" } }, { "type": "Image", "props": { "y": 115, "x": 150, "skin": "pop/numBtn.png" } }, { "type": "Image", "props": { "y": 115, "x": 299, "skin": "pop/numBtn.png" } }, { "type": "Image", "props": { "y": 115, "x": 449, "skin": "pop/numBtn.png" } }, { "type": "Image", "props": { "y": 229, "x": 449, "skin": "pop/numBtn.png" } }, { "type": "Image", "props": { "y": 229, "skin": "pop/numBtn.png" } }, { "type": "Image", "props": { "y": 229, "x": 150, "skin": "pop/numBtn.png" } }, { "type": "Image", "props": { "y": 229, "x": 299, "skin": "pop/numBtn.png" } }] }, { "type": "Box", "props": { "y": 11, "x": 10, "var": "btn_box" }, "child": [{ "type": "Label", "props": { "y": 2, "x": 1, "width": 138, "valign": "middle", "text": 1, "name": "num1", "mouseEnabled": true, "height": 97, "fontSize": 40, "color": "#000", "align": "center" } }, { "type": "Label", "props": { "x": 149, "width": 138, "valign": "middle", "text": 2, "name": "num2", "mouseEnabled": true, "height": 97, "fontSize": 40, "color": "#000", "align": "center" } }, { "type": "Label", "props": { "y": 2, "x": 301, "width": 138, "valign": "middle", "text": 3, "name": "num3", "mouseEnabled": true, "height": 97, "fontSize": 40, "color": "#000", "align": "center" } }, { "type": "Label", "props": { "y": 2, "x": 448, "width": 138, "valign": "middle", "text": "0", "name": "num0", "mouseEnabled": true, "height": 97, "fontSize": 40, "color": "#000", "align": "center" } }, { "type": "Label", "props": { "y": 116, "width": 138, "valign": "middle", "text": 4, "name": "num4", "mouseEnabled": true, "height": 97, "fontSize": 40, "color": "#000", "align": "center" } }, { "type": "Label", "props": { "y": 117, "x": 150, "width": 138, "valign": "middle", "text": 5, "name": "num5", "mouseEnabled": true, "height": 97, "fontSize": 40, "color": "#000", "align": "center" } }, { "type": "Label", "props": { "y": 115, "x": 300, "width": 138, "valign": "middle", "text": 6, "name": "num6", "mouseEnabled": true, "height": 97, "fontSize": 40, "color": "#000", "align": "center" } }, { "type": "Label", "props": { "y": 116, "x": 448, "width": 138, "valign": "middle", "text": "00", "name": "num00", "mouseEnabled": true, "height": 97, "fontSize": 40, "color": "#000", "align": "center" } }, { "type": "Label", "props": { "y": 230, "width": 138, "valign": "middle", "text": 7, "name": "num7", "mouseEnabled": true, "height": 97, "fontSize": 40, "color": "#000", "align": "center" } }, { "type": "Label", "props": { "y": 231, "x": 149, "width": 138, "valign": "middle", "text": 8, "name": "num8", "mouseEnabled": true, "height": 97, "fontSize": 40, "color": "#000", "align": "center" } }, { "type": "Label", "props": { "y": 229, "x": 300, "width": 138, "valign": "middle", "text": 9, "name": "num9", "mouseEnabled": true, "height": 97, "fontSize": 40, "color": "#000", "align": "center" } }, { "type": "Label", "props": { "y": 231, "x": 449, "width": 138, "valign": "middle", "text": ".", "name": "point", "height": 97, "fontSize": 40, "color": "#000", "align": "center" } }, { "type": "Button", "props": { "y": 231, "x": 597, "stateNum": 1, "skin": "pop/rBtn.png", "name": "del", "mouseEnabled": true, "labelSize": 40, "label": "删除" } }, { "type": "Button", "props": { "y": 2, "x": 597, "stateNum": 1, "skin": "pop/sBtn.png", "name": "sureBtn", "mouseEnabled": true, "labelSize": 40, "label": "确定" } }] }] };
	}]);
	return keybordUI;
}(View);
var mygradePopUI = function (_super) {
	function mygradePopUI() {

		this.ylb_content_box = null;
		this.ylb_content_list = null;
		this.unLogin_box = null;

		mygradePopUI.__super.call(this);
	}

	CLASS$(mygradePopUI, 'ui.pop.mygradePopUI', _super);
	var __proto__ = mygradePopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(mygradePopUI.uiView);
	};

	STATICATTR$(mygradePopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 660, "height": 580 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 660, "skin": "pop/bg.png", "height": 577, "sizeGrid": "43,228,30,227" } }, { "type": "Button", "props": { "y": -14, "x": 594, "stateNum": 1, "skin": "pop/btn_close.png", "name": "close" } }, { "type": "Box", "props": { "y": 90, "x": 37, "width": 575, "var": "ylb_content_box", "height": 473 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 572, "skin": "pop/txtbg.png", "height": 460, "sizeGrid": "13,17,17,15" } }, { "type": "Image", "props": { "y": 10, "x": 8, "width": 556, "skin": "pop/ylb/content_bg.png", "height": 438, "sizeGrid": "64,20,14,15" } }, { "type": "Label", "props": { "y": 22, "x": 20, "width": 534, "text": "    序号             赢得奖励                  时间", "height": 38, "fontSize": 24, "font": "Microsoft YaHei", "color": "#ffffff", "cacheAs": "bitmap" } }] }, { "type": "List", "props": { "y": 80, "x": 16, "width": 542, "visible": false, "var": "ylb_content_list", "vScrollBarSkin": "pop/help/vscroll.png", "spaceY": 5, "height": 364 }, "child": [{ "type": "Box", "props": { "name": "render" }, "child": [{ "type": "Image", "props": { "skin": "pop/ylb/myGrade_bg.png", "name": "bg" } }, { "type": "Label", "props": { "y": 15, "x": 0, "width": 98, "visible": true, "name": "num", "height": 22, "fontSize": 22, "font": "Microsoft YaHei", "color": "#5a3586", "align": "center" } }, { "type": "Label", "props": { "y": 15, "x": 102, "width": 180, "name": "point", "height": 27, "fontSize": 22, "font": "Microsoft YaHei", "color": "#ffed22 ", "align": "center" } }, { "type": "Label", "props": { "y": 15, "x": 285, "width": 236, "name": "time", "height": 27, "fontSize": 22, "font": "Microsoft YaHei", "color": "#5a3586", "align": "center" } }] }] }, { "type": "Box", "props": { "y": 200, "x": 94, "width": 354, "visible": false, "var": "unLogin_box", "height": 41 }, "child": [{ "type": "Label", "props": { "y": 3, "x": 35, "width": 238, "text": "您还未登录，请点击", "height": 38, "fontSize": 24, "font": "Microsoft YaHei", "color": "#ffffff", "cacheAs": "bitmap" } }, { "type": "Label", "props": { "y": 3, "x": 260, "width": 61, "underline": true, "text": "登录", "name": "btn_login", "height": 38, "fontSize": 24, "font": "Microsoft YaHei", "color": "#ee390c", "cacheAs": "bitmap", "align": "center" } }] }] }, { "type": "Box", "props": { "y": -38, "x": 106, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "skin": "pop/ylb/title_bg.png" } }, { "type": "Image", "props": { "y": 21, "x": 121, "skin": "pop/ylb/wdzj.png" } }] }] };
	}]);
	return mygradePopUI;
}(Dialog);
var newUserPopUI = function (_super) {
	function newUserPopUI() {

		this.dom_room_type = null;

		newUserPopUI.__super.call(this);
	}

	CLASS$(newUserPopUI, 'ui.pop.newUserPopUI', _super);
	var __proto__ = newUserPopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(newUserPopUI.uiView);
	};

	STATICATTR$(newUserPopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 750, "height": 1334 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "pop/new.png" } }, { "type": "Button", "props": { "y": 229, "x": 623, "stateNum": "1", "skin": "pop/btn_close.png", "name": "close" } }, { "type": "Box", "props": { "y": 366, "x": 30 }, "child": [{ "type": "Image", "props": { "skin": "room/dia.png" } }, { "type": "Label", "props": { "y": 12, "x": 50, "width": 81, "var": "dom_room_type", "text": "*1", "height": 32, "fontSize": 22, "font": "room_font", "color": "#fff8bc", "align": "center" } }, { "type": "Image", "props": { "y": 4, "x": 7, "skin": "hall/coin.png", "scaleY": 0.7, "scaleX": 0.7 } }] }] };
	}]);
	return newUserPopUI;
}(Dialog);
var normalPopUI = function (_super) {
	function normalPopUI() {

		this.txt_bg = null;
		this.txt_content = null;

		normalPopUI.__super.call(this);
	}

	CLASS$(normalPopUI, 'ui.pop.normalPopUI', _super);
	var __proto__ = normalPopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(normalPopUI.uiView);
	};

	STATICATTR$(normalPopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 400, "height": 120 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 400, "var": "txt_bg", "skin": "pop/help/normal_bg.png", "sizeGrid": "15,16,18,19", "height": 120 } }, { "type": "Label", "props": { "y": 30, "x": 36, "wordWrap": true, "width": 326, "var": "txt_content", "valign": "middle", "text": "hello, world", "leading": 10, "fontSize": 20, "font": "Microsoft YaHei", "color": "#ffffff", "align": "center" } }] };
	}]);
	return normalPopUI;
}(Dialog);
var onlyReadPopUI = function (_super) {
	function onlyReadPopUI() {

		this.btn_close = null;
		this.txt_box = null;

		onlyReadPopUI.__super.call(this);
	}

	CLASS$(onlyReadPopUI, 'ui.pop.onlyReadPopUI', _super);
	var __proto__ = onlyReadPopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(onlyReadPopUI.uiView);
	};

	STATICATTR$(onlyReadPopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 610, "visible": true, "height": 440 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 609, "skin": "pop/bg.png", "name": "pop_bg", "height": 347, "sizeGrid": "43,228,30,227" } }, { "type": "Button", "props": { "y": -15, "x": 549, "visible": false, "var": "btn_close", "stateNum": 1, "skin": "pop/btn_close.png" } }, { "type": "Box", "props": { "y": 60, "x": 36, "var": "txt_box" }, "child": [{ "type": "Image", "props": { "width": 538, "skin": "pop/txtbg.png", "name": "txt_bg", "height": 222, "sizeGrid": "13,17,17,15" } }, { "type": "Label", "props": { "y": 50, "x": 38, "wordWrap": true, "width": 462, "text": "的地方地方", "name": "txt_content", "leading": 10, "fontSize": 24, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "center" } }] }] };
	}]);
	return onlyReadPopUI;
}(Dialog);
var playerInfoPopUI = function (_super) {
	function playerInfoPopUI() {

		this.bg = null;
		this.play_box = null;
		this.player_list = null;
		this.table_box = null;
		this.table_list = null;

		playerInfoPopUI.__super.call(this);
	}

	CLASS$(playerInfoPopUI, 'ui.pop.playerInfoPopUI', _super);
	var __proto__ = playerInfoPopUI.prototype;
	__proto__.createChildren = function () {
		View.regComponent("ui.pop.userPopUI", ui.pop.userPopUI);

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(playerInfoPopUI.uiView);
	};

	STATICATTR$(playerInfoPopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 660, "height": 700 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 660, "var": "bg", "skin": "pop/bg.png", "height": 717, "sizeGrid": "43,228,30,227" } }, { "type": "Button", "props": { "y": -14, "x": 594, "stateNum": 1, "skin": "pop/btn_close.png", "name": "close" } }, { "type": "Box", "props": { "y": -38, "x": 106, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "skin": "pop/ylb/title_bg.png" } }, { "type": "Image", "props": { "y": 21, "x": 121, "skin": "pop/ylb/wjxi.png" } }] }, { "type": "Box", "props": { "y": 94, "x": 46, "width": 568, "var": "play_box" }, "child": [{ "type": "List", "props": { "y": 0, "x": 0, "width": 566, "var": "player_list", "spaceY": 10, "spaceX": 25, "height": 377 }, "child": [{ "type": "userPop", "props": { "name": "render", "runtime": "ui.pop.userPopUI" } }] }] }, { "type": "Box", "props": { "y": 482, "x": 45, "var": "table_box" }, "child": [{ "type": "Image", "props": { "skin": "pop/ylb/play_top.png" } }, { "type": "List", "props": { "y": 52, "x": 0, "width": 569, "var": "table_list", "height": 300 }, "child": [{ "type": "Box", "props": { "name": "render" }, "child": [{ "type": "Image", "props": { "skin": "pop/ylb/play_bottom.png", "name": "bg" } }, { "type": "Label", "props": { "y": 13, "x": 4, "width": 126, "name": "time", "height": 22, "fontSize": 22, "font": "SimHei", "color": "#ffec1a", "align": "center" } }, { "type": "Label", "props": { "y": 13, "x": 131, "width": 170, "name": "name", "height": 22, "fontSize": 22, "font": "SimHei", "color": "#ffec1a", "align": "center" } }, { "type": "Label", "props": { "y": 13, "x": 304, "width": 139, "name": "type", "height": 22, "fontSize": 22, "font": "SimHei", "color": "#ffec1a", "align": "center" } }, { "type": "Label", "props": { "y": 13, "x": 446, "width": 116, "name": "award", "height": 22, "fontSize": 22, "font": "SimHei", "color": "#ffec1a", "align": "center" } }] }] }] }] };
	}]);
	return playerInfoPopUI;
}(Dialog);
var quit_rechargePopUI = function (_super) {
	function quit_rechargePopUI() {

		this.btn_box = null;
		this.quit = null;
		this.less = null;
		this.txt_box = null;

		quit_rechargePopUI.__super.call(this);
	}

	CLASS$(quit_rechargePopUI, 'ui.pop.quit_rechargePopUI', _super);
	var __proto__ = quit_rechargePopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(quit_rechargePopUI.uiView);
	};

	STATICATTR$(quit_rechargePopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 610, "height": 440 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 609, "skin": "pop/bg.png", "name": "pop_bg", "height": 437, "sizeGrid": "43,228,30,227" } }, { "type": "Button", "props": { "y": -15, "x": 549, "visible": false, "stateNum": 1, "skin": "pop/btn_close.png", "name": "close" } }, { "type": "Box", "props": { "x": 54, "var": "btn_box", "bottom": 40 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "var": "quit" }, "child": [{ "type": "Box", "props": { "name": "btn_sure", "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "skin": "pop/surebg.png" } }, { "type": "Image", "props": { "y": 15, "x": 36, "skin": "pop/quik.png" } }] }, { "type": "Box", "props": { "x": 291, "name": "close", "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "skin": "pop/quxbg.png" } }, { "type": "Image", "props": { "y": 15, "x": 36, "skin": "pop/txtno.png" } }] }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "less" }, "child": [{ "type": "Box", "props": { "visible": true, "name": "btn_sure", "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "skin": "pop/surebg.png" } }, { "type": "Image", "props": { "y": 15, "x": 49, "skin": "pop/chongzhi.png" } }] }, { "type": "Box", "props": { "x": 291, "name": "close", "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "skin": "pop/quxbg.png" } }, { "type": "Image", "props": { "y": 15, "x": 68, "skin": "pop/ok.png" } }] }] }] }, { "type": "Box", "props": { "y": 60, "x": 36, "var": "txt_box" }, "child": [{ "type": "Image", "props": { "width": 538, "skin": "pop/txtbg.png", "name": "txt_bg", "height": 222, "sizeGrid": "13,17,17,15" } }, { "type": "Label", "props": { "y": 75, "x": 38, "wordWrap": true, "width": 462, "text": "现在离开房间将不能获得当前未结算的奖励，是否确认退出？", "name": "txt_content", "leading": 10, "fontSize": 24, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "center" } }] }] };
	}]);
	return quit_rechargePopUI;
}(Dialog);
var rechargeUI = function (_super) {
	function rechargeUI() {

		this.btn_click = null;
		this.btn_close = null;
		this.input_box = null;
		this.keybord_box = null;

		rechargeUI.__super.call(this);
	}

	CLASS$(rechargeUI, 'ui.pop.rechargeUI', _super);
	var __proto__ = rechargeUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(rechargeUI.uiView);
	};

	STATICATTR$(rechargeUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 700, "height": 970 }, "child": [{ "type": "Image", "props": { "y": 108, "x": 28, "width": 650, "skin": "pop/bg.png", "height": 850, "sizeGrid": "43,228,30,227" } }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 700, "height": 788 }, "child": [{ "type": "Image", "props": { "y": 110, "x": 59, "width": 582, "skin": "pop/txtbg.png", "height": 678, "sizeGrid": "13,17,17,15" } }, { "type": "Image", "props": { "y": 810, "x": 60, "width": 580, "skin": "pop/txtbg.png", "height": 116, "sizeGrid": "13,17,17,15" } }, { "type": "Tab", "props": { "y": 220, "x": 103, "width": 503, "var": "btn_click", "selectedIndex": 2, "mouseEnabled": true, "height": 535 }, "child": [{ "type": "Button", "props": { "stateNum": "2", "skin": "pop/btn_tab.png", "name": "item0" } }, { "type": "Button", "props": { "x": 267, "stateNum": "2", "skin": "pop/btn_tab.png", "name": "item1" } }, { "type": "Button", "props": { "y": 275, "stateNum": "2", "skin": "pop/btn_tab.png", "name": "item2" } }, { "type": "Button", "props": { "y": 275, "x": 267, "stateNum": "2", "skin": "pop/btn_tab.png", "name": "item3" } }] }, { "type": "Box", "props": { "y": 219, "x": 121, "cacheAs": "bitmap" }, "child": [{ "type": "Box", "props": { "y": 1, "x": -19, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "y": 29, "x": 31, "skin": "pop/zuan1.png" } }, { "type": "Image", "props": { "y": 203, "x": 84, "skin": "pop/10.png" } }] }, { "type": "Box", "props": { "y": 1, "x": 248, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "y": 203, "x": 84, "skin": "pop/50.png" } }, { "type": "Image", "props": { "y": -1, "x": 20, "skin": "pop/zuan2.png" } }] }, { "type": "Box", "props": { "y": 276, "x": -19, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "y": 3, "x": 19, "skin": "pop/zuan3.png" } }, { "type": "Image", "props": { "y": 203, "x": 75, "skin": "pop/100.png" } }] }, { "type": "Box", "props": { "y": 276, "x": 248, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "y": -2.999999999999943, "x": 17.999999999999943, "skin": "pop/zuan4.png" } }, { "type": "Image", "props": { "y": 203, "x": 75, "skin": "pop/200.png" } }] }] }] }, { "type": "Label", "props": { "y": 187, "x": 147, "width": 414, "text": "充值钻石成功后将为您自动兑换为欢乐豆", "height": 42, "fontSize": 22, "font": "Microsoft YaHei", "color": "#896fb5", "cacheAs": "bitmap", "bold": true, "align": "center" } }, { "type": "Box", "props": { "y": 0, "x": 0 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "pop/head.png" } }, { "type": "Image", "props": { "y": 106.99999999999997, "x": 127.00000000000001, "skin": "pop/txt_top.png" } }, { "type": "Button", "props": { "y": 81.99999999999999, "x": 609.9999999999999, "var": "btn_close", "stateNum": "1", "skin": "pop/btn_close.png" } }] }, { "type": "Box", "props": { "y": 831, "x": 82, "var": "input_box" }, "child": [{ "type": "Image", "props": { "skin": "pop/txt_bg.png" } }, { "type": "Button", "props": { "x": 365, "stateNum": "1", "skin": "pop/btn_buy.png", "name": "btn_buy" } }, { "type": "Label", "props": { "y": 15, "x": 20, "width": 258, "text": "请输入大于0的整数", "name": "input_txt", "height": 42, "fontSize": 30, "font": "Microsoft YaHei", "color": "#725b99", "bold": false } }] }, { "type": "Box", "props": { "y": 970, "var": "keybord_box" } }] };
	}]);
	return rechargeUI;
}(Dialog);
var shouhuoPopUI = function (_super) {
	function shouhuoPopUI() {

		this.bg = null;
		this.dom_yxb = null;
		this.dom_hlz = null;
		this.dom_jf = null;
		this.dom_hld = null;
		this.dom_cj = null;
		this.dom_zs = null;
		this.dom_cf = null;
		this.dom_jkj = null;
		this.dom_liuliang = null;
		this.btn_other = null;
		this.btn_sure = null;

		shouhuoPopUI.__super.call(this);
	}

	CLASS$(shouhuoPopUI, 'ui.pop.shouhuoPopUI', _super);
	var __proto__ = shouhuoPopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(shouhuoPopUI.uiView);
	};

	STATICATTR$(shouhuoPopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 610, "height": 700 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 610, "var": "bg", "skin": "pop/bg.png", "height": 717, "sizeGrid": "43,228,30,227" } }, { "type": "Button", "props": { "y": -17, "x": 549, "stateNum": 1, "skin": "pop/btn_close.png", "name": "close" } }, { "type": "Box", "props": { "y": -38, "x": 86, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "skin": "pop/ylb/title_bg.png" } }, { "type": "Image", "props": { "y": 21, "x": 173, "skin": "pop/shouhuo.png" } }] }, { "type": "Box", "props": { "y": 93, "x": 55 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 500, "skin": "pop/txtbg.png", "height": 424, "sizeGrid": "13,17,17,15" } }, { "type": "Image", "props": { "y": 9, "x": 5, "skin": "pop/tiao.png" } }, { "type": "Box", "props": { "y": 9, "x": 83 }, "child": [{ "type": "Label", "props": { "y": 1, "width": 156, "valign": "middle", "text": "我的游戏币：", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#ffda0e", "align": "right" } }, { "type": "Label", "props": { "x": 185, "width": 156, "var": "dom_yxb", "valign": "middle", "text": "0", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#ffda0e", "align": "left" } }] }, { "type": "Box", "props": { "y": 60, "x": 137 }, "child": [{ "type": "Label", "props": { "width": 104, "valign": "middle", "text": "欢乐值：", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "right" } }, { "type": "Label", "props": { "y": 5.684341886080802e-14, "x": 131.00000000000006, "width": 156, "var": "dom_hlz", "valign": "middle", "text": "0", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "left" } }] }, { "type": "Box", "props": { "y": 102, "x": 137 }, "child": [{ "type": "Label", "props": { "width": 104, "valign": "middle", "text": "积分：", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "right" } }, { "type": "Label", "props": { "y": 5.684341886080802e-14, "x": 131.00000000000006, "width": 156, "var": "dom_jf", "valign": "middle", "text": "0", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "left" } }] }, { "type": "Box", "props": { "y": 144, "x": 137 }, "child": [{ "type": "Label", "props": { "width": 104, "valign": "middle", "text": "欢乐豆：", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "right" } }, { "type": "Label", "props": { "y": 8.526512829121202e-14, "x": 131.00000000000006, "width": 156, "var": "dom_hld", "valign": "middle", "text": "0", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "left" } }] }, { "type": "Box", "props": { "y": 186, "x": 137 }, "child": [{ "type": "Label", "props": { "width": 104, "valign": "middle", "text": "彩金：", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "right" } }, { "type": "Label", "props": { "y": 0, "x": 131.00000000000006, "width": 156, "var": "dom_cj", "valign": "middle", "text": "0", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "left" } }] }, { "type": "Box", "props": { "y": 228, "x": 137 }, "child": [{ "type": "Label", "props": { "width": 104, "valign": "middle", "text": "钻石：", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "right" } }, { "type": "Label", "props": { "y": 0, "x": 131.00000000000006, "width": 156, "var": "dom_zs", "valign": "middle", "text": "0", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "left" } }] }, { "type": "Box", "props": { "y": 270, "x": 137 }, "child": [{ "type": "Label", "props": { "width": 104, "valign": "middle", "text": "彩分：", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "right" } }, { "type": "Label", "props": { "y": 5.684341886080802e-14, "x": 131.00000000000006, "width": 156, "var": "dom_cf", "valign": "middle", "text": "0", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "left" } }] }, { "type": "Box", "props": { "y": 312, "x": 137 }, "child": [{ "type": "Label", "props": { "width": 104, "valign": "middle", "text": "健康金：", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "right" } }, { "type": "Label", "props": { "y": 1.1368683772161603e-13, "x": 131.00000000000006, "width": 156, "var": "dom_jkj", "valign": "middle", "text": "0", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "left" } }] }, { "type": "Box", "props": { "y": 354, "x": 138, "visible": false }, "child": [{ "type": "Label", "props": { "y": 0, "x": -45, "width": 149, "valign": "middle", "text": "平安流量：", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "right" } }, { "type": "Label", "props": { "y": 1.1368683772161603e-13, "x": 131.00000000000006, "width": 156, "var": "dom_liuliang", "valign": "middle", "text": "0", "height": 50, "fontSize": 26, "font": "Microsoft YaHei", "color": "#d3cbf7", "align": "left" } }] }] }, { "type": "Image", "props": { "y": 657, "x": 197, "var": "btn_other", "skin": "pop/other.png" } }, { "type": "Box", "props": { "y": 560, "x": 190, "var": "btn_sure" }, "child": [{ "type": "Image", "props": { "skin": "pop/knowbg.png" } }, { "type": "Image", "props": { "y": 20, "x": 42, "skin": "pop/confimshou.png" } }] }] };
	}]);
	return shouhuoPopUI;
}(Dialog);
var userPopUI = function (_super) {
	function userPopUI() {

		userPopUI.__super.call(this);
	}

	CLASS$(userPopUI, 'ui.pop.userPopUI', _super);
	var __proto__ = userPopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(userPopUI.uiView);
	};

	STATICATTR$(userPopUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "width": 272, "height": 117 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "pop/ylb/play_bg.png" } }, { "type": "Label", "props": { "y": 17, "x": 109, "name": "name", "fontSize": 22, "font": "Microsoft YaHei", "color": "#a65921" } }, { "type": "Label", "props": { "y": 59, "x": 164, "width": 81, "name": "coin", "height": 22, "fontSize": 22, "font": "Microsoft YaHei", "color": "#ffec1a" } }, { "type": "Image", "props": { "y": 8, "x": 8, "skin": "pop/ylb/head0.png", "name": "head" } }] };
	}]);
	return userPopUI;
}(View);
var yinglibangPopUI = function (_super) {
	function yinglibangPopUI() {

		this.ylb_top_box = null;
		this.ylb_bottom_box = null;
		this.ylb_content_box = null;
		this.ylb_content_list = null;
		this.my_self_box = null;
		this.unLogin_box = null;

		yinglibangPopUI.__super.call(this);
	}

	CLASS$(yinglibangPopUI, 'ui.pop.yinglibangPopUI', _super);
	var __proto__ = yinglibangPopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(yinglibangPopUI.uiView);
	};

	STATICATTR$(yinglibangPopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 660, "height": 960 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 660, "skin": "pop/bg.png", "height": 960, "sizeGrid": "43,228,30,227" } }, { "type": "Box", "props": { "y": -37, "x": 106, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "skin": "pop/ylb/title_bg.png" } }, { "type": "Image", "props": { "y": 21, "x": 147, "skin": "pop/ylb/ylb.png" } }] }, { "type": "Button", "props": { "y": -14, "x": 594, "stateNum": "1", "skin": "pop/btn_close.png", "name": "close" } }, { "type": "Box", "props": { "y": 80, "x": 37, "var": "ylb_top_box" }, "child": [{ "type": "Image", "props": { "skin": "pop/ylb/ylb_middle.png" } }, { "type": "Label", "props": { "y": 185, "x": 182, "text": "分奖倒计时：", "fontSize": 22, "font": "Microsoft YaHei", "color": "#ffffff", "cacheAs": "bitmap" } }, { "type": "Label", "props": { "y": 185, "x": 321, "name": "time", "fontSize": 22, "font": "Microsoft YaHei", "color": "#ffffff", "cacheAs": "none" } }, { "type": "Label", "props": { "y": 111, "x": 306, "width": 247, "text": "0", "name": "coin_num", "height": 32, "fontSize": 22, "font": "bang_font", "color": "#ffffff", "cacheAs": "none", "align": "center" } }] }, { "type": "Box", "props": { "y": 840, "x": 92, "var": "ylb_bottom_box" }, "child": [{ "type": "Button", "props": { "x": 405, "stateNum": "1", "skin": "pop/ylb/btn_history.png", "name": "btn_history" } }, { "type": "Image", "props": { "y": 28, "skin": "pop/ylb/txt_bottom.png" } }, { "type": "Image", "props": { "y": 27, "x": 336, "skin": "pop/ylb/wan.png", "name": "text_wan" } }, { "type": "Label", "props": { "y": 30, "x": 293, "text": "500", "name": "ylb_cond", "font": "ylb_font" } }] }, { "type": "Box", "props": { "y": 391, "x": 37, "width": 586, "var": "ylb_content_box", "height": 433 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 586, "skin": "pop/txtbg.png", "height": 442, "sizeGrid": "13,17,17,15" } }, { "type": "Image", "props": { "y": 17, "x": 15, "width": 556, "skin": "pop/ylb/content_bg.png", "height": 344, "sizeGrid": "64,20,14,15" } }, { "type": "Label", "props": { "y": 27, "x": 49, "width": 505, "text": "排名     玩家名称     当日累计赢取      排名奖励", "height": 38, "fontSize": 24, "font": "Microsoft YaHei", "color": "#ffffff", "cacheAs": "bitmap" } }] }, { "type": "List", "props": { "y": 80, "x": 23, "width": 542, "var": "ylb_content_list", "vScrollBarSkin": "pop/help/vscroll.png", "spaceY": 5, "height": 272 }, "child": [{ "type": "Box", "props": { "name": "render" }, "child": [{ "type": "Clip", "props": { "skin": "pop/ylb/clip_tiao.png", "name": "bg", "clipY": 2 } }, { "type": "Label", "props": { "y": 17, "x": 26, "width": 30, "visible": true, "text": "1", "name": "rank", "height": 22, "fontSize": 22, "font": "Microsoft YaHei", "color": "#5a3586", "align": "center" } }, { "type": "Clip", "props": { "y": 5, "x": 9, "visible": true, "skin": "pop/ylb/clip_crown.png", "name": "crown", "clipY": 3 } }, { "type": "Label", "props": { "y": 17, "x": 70, "width": 163, "name": "name", "height": 27, "fontSize": 22, "font": "Microsoft YaHei", "color": "#5a3586", "align": "center" } }, { "type": "Label", "props": { "y": 17, "x": 232, "width": 160, "text": "0", "name": "coin", "height": 27, "fontSize": 22, "font": "Microsoft YaHei", "color": "#ffed22 ", "align": "center" } }, { "type": "Label", "props": { "y": 17, "x": 392, "width": 134, "name": "award", "height": 27, "fontSize": 22, "font": "Microsoft YaHei", "color": "#5a3586", "align": "center" } }] }] }, { "type": "Box", "props": { "y": 370, "x": 23, "visible": false, "var": "my_self_box" }, "child": [{ "type": "Clip", "props": { "skin": "pop/ylb/clip_tiao.png", "name": "bg", "index": 1, "clipY": 2 } }, { "type": "Label", "props": { "y": 17, "x": 26, "width": 30, "text": "1", "name": "rank", "height": 22, "fontSize": 22, "font": "Microsoft YaHei", "color": "#5a3586", "align": "center" } }, { "type": "Clip", "props": { "y": 5, "x": 9, "skin": "pop/ylb/clip_crown.png", "name": "crown", "clipY": 3 } }, { "type": "Label", "props": { "y": 17, "x": 70, "width": 163, "name": "name", "height": 27, "fontSize": 22, "font": "Microsoft YaHei", "color": "#5a3586", "align": "center" } }, { "type": "Label", "props": { "y": 17, "x": 232, "width": 160, "text": "0", "name": "coin", "height": 27, "fontSize": 22, "font": "Microsoft YaHei", "color": "#ffed22 ", "align": "center" } }, { "type": "Label", "props": { "y": 17, "x": 392, "width": 134, "name": "award", "height": 27, "fontSize": 22, "font": "Microsoft YaHei", "color": "#5a3586", "align": "center" } }] }, { "type": "Box", "props": { "y": 383, "x": 132, "visible": false, "var": "unLogin_box" }, "child": [{ "type": "Label", "props": { "y": 3, "x": 35, "width": 238, "text": "您还未登录，请点击", "height": 38, "fontSize": 24, "font": "Microsoft YaHei", "color": "#ffffff", "cacheAs": "bitmap" } }, { "type": "Label", "props": { "y": 3, "x": 260, "width": 61, "underline": true, "text": "登录", "name": "btn_login", "height": 38, "fontSize": 24, "font": "Microsoft YaHei", "color": "#ee390c", "cacheAs": "bitmap", "align": "center" } }] }] }] };
	}]);
	return yinglibangPopUI;
}(Dialog);
var matterViewUI = function (_super) {
	function matterViewUI() {

		matterViewUI.__super.call(this);
	}

	CLASS$(matterViewUI, 'ui.room.matterViewUI', _super);
	var __proto__ = matterViewUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(matterViewUI.uiView);
	};

	STATICATTR$(matterViewUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "width": 750, "height": 1334 } };
	}]);
	return matterViewUI;
}(View);
var roomUI = function (_super) {
	function roomUI() {

		this.laba_box = null;
		this.laba_mask_box = null;
		this.cover_box = null;
		this.sameRound_box = null;
		this.threeLine_box = null;
		this.turntable_box = null;
		this.star_box = null;
		this.top_light_box = null;
		this.nail_box = null;
		this.spin_box = null;
		this.skill_box = null;
		this.car_box = null;
		this.dom_car_boxMove = null;
		this.dom_plus = null;
		this.dom_text_box = null;
		this.dom_text_move = null;
		this.car_text0 = null;
		this.car_text1 = null;
		this.coin_box = null;
		this.coin = null;
		this.swing0 = null;
		this.swing1 = null;
		this.fan0 = null;
		this.fan1 = null;
		this.middle_box = null;
		this.ylb_box = null;
		this.btn_auto_box = null;
		this.header_box = null;
		this.btn_addCoin = null;
		this.look_box = null;
		this.dom_room_type = null;

		roomUI.__super.call(this);
	}

	CLASS$(roomUI, 'ui.room.roomUI', _super);
	var __proto__ = roomUI.prototype;
	__proto__.createChildren = function () {
		View.regComponent("SkeletonPlayer", laya.ani.bone.Skeleton);
		View.regComponent("ui.room.turntableUI", ui.room.turntableUI);

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(roomUI.uiView);
	};

	STATICATTR$(roomUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "width": 750, "mouseThrough": true, "height": 1334 }, "child": [{ "type": "Image", "props": { "y": 0, "skin": "room/room_bg.jpg", "centerX": 0 } }, { "type": "Box", "props": { "y": 628, "x": 53, "var": "laba_box" }, "child": [{ "type": "Image", "props": { "skin": "room/laba_bg.png" } }, { "type": "Box", "props": { "y": 49, "x": 186, "width": 270, "visible": true, "var": "laba_mask_box", "height": 250 }, "child": [{ "type": "Box", "props": { "x": 2, "name": "item0", "cacheAs": "none" } }, { "type": "Box", "props": { "y": 0, "x": 95, "name": "item1", "cacheAs": "none" } }, { "type": "Box", "props": { "y": 0, "x": 189, "name": "item2", "cacheAs": "none" } }] }, { "type": "Box", "props": { "y": 49, "x": 188, "visible": true, "cacheAs": "bitmap", "alpha": 0.4 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "room/fruit_mask.png" } }, { "type": "Image", "props": { "y": 203, "x": -1, "width": 264, "skin": "room/fruit_mask.png", "rotation": 180, "height": 47, "anchorY": 1, "anchorX": 1 } }] }, { "type": "Box", "props": { "y": 48, "x": 186, "visible": true, "var": "cover_box" }, "child": [{ "type": "Image", "props": { "y": 159.00001436206566, "skin": "room/shadow0.png", "name": "cover_down", "alpha": 0.95 } }, { "type": "Image", "props": { "y": 0.000014362065641648769, "width": 268, "skin": "room/shadow0.png", "rotation": 180, "name": "cover_up", "height": 91, "anchorY": 1, "anchorX": 1, "alpha": 0.95 } }] }, { "type": "Box", "props": { "y": 115, "x": 225, "visible": false, "var": "sameRound_box" }, "child": [{ "type": "SkeletonPlayer", "props": { "url": "animate/kuang.sk", "name": "item" } }, { "type": "SkeletonPlayer", "props": { "y": 0, "x": 96, "url": "animate/kuang.sk", "name": "item" } }, { "type": "SkeletonPlayer", "props": { "y": 0, "x": 190, "url": "animate/kuang.sk", "name": "item" } }] }, { "type": "Box", "props": { "y": 75, "x": 131.99999999999997, "visible": false, "var": "threeLine_box" }, "child": [{ "type": "Image", "props": { "x": 0, "skin": "room/2.png", "name": "item0", "cacheAs": "none" } }, { "type": "Image", "props": { "y": 81, "x": 0, "skin": "room/1.png", "name": "item1" } }, { "type": "Image", "props": { "y": 162, "x": 0, "skin": "room/3.png", "name": "item2" } }] }, { "type": "Box", "props": { "y": 49, "x": 173, "visible": false, "var": "turntable_box" }, "child": [{ "type": "turntable", "props": { "runtime": "ui.room.turntableUI" } }, { "type": "SkeletonPlayer", "props": { "y": -7, "x": 144, "url": "animate/truntable.sk", "name": "table_DB" } }] }] }, { "type": "Box", "props": { "y": 585, "x": 102, "var": "star_box" }, "child": [{ "type": "Label", "props": { "y": 15, "x": 40, "font": "star_font" } }, { "type": "Label", "props": { "y": 15, "x": 245, "font": "star_font" } }, { "type": "Label", "props": { "y": 15, "x": 465, "font": "star_font" } }, { "type": "Box", "props": { "y": 0, "x": 0, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "x": -10, "skin": "room/one_star.png" } }, { "type": "Image", "props": { "x": 146, "skin": "room/two_star.png" } }, { "type": "Image", "props": { "x": 352, "skin": "room/three_star.png" } }] }, { "type": "Box", "props": { "y": 51.999999999999886, "x": 230.00000000000006, "var": "top_light_box" }, "child": [{ "type": "Clip", "props": { "skin": "room/clip_top.png", "name": "item0", "index": 0, "clipY": 2 } }, { "type": "Clip", "props": { "x": 20, "skin": "room/clip_top.png", "name": "item1", "clipY": 2 } }, { "type": "Clip", "props": { "x": 40, "skin": "room/clip_top.png", "name": "item2", "clipY": 2 } }, { "type": "Clip", "props": { "x": 60, "skin": "room/clip_top.png", "name": "item3", "clipY": 2 } }] }, { "type": "SkeletonPlayer", "props": { "y": 83, "x": 267, "url": "animate/star.sk", "name": "star_DB" } }] }, { "type": "Box", "props": { "var": "nail_box", "mouseThrough": false, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "y": 652, "x": 157, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 652, "x": 231, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 652, "x": 315, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 652, "x": 412, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 652, "x": 495, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 652, "x": 573, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 794, "x": 39, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 794, "x": 686, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 936, "x": 97, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 936, "x": 182, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 936, "x": 267, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 936, "x": 352, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 936, "x": 437, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 936, "x": 522, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 936, "x": 607, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1027, "x": 41, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1027, "x": 688, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1067, "x": 53, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1067, "x": 673, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1107, "x": 65, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1107, "x": 150, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1107, "x": 235, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1107, "x": 320, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1107, "x": 405, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1107, "x": 490, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1107, "x": 575, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1107, "x": 660, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1189, "x": 107, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1189, "x": 192, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1189, "x": 277, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1189, "x": 362, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1189, "x": 447, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1189, "x": 532, "skin": "room/nail.png" } }, { "type": "Image", "props": { "y": 1189, "x": 617, "skin": "room/nail.png" } }] }, { "type": "Box", "props": { "y": 1007, "x": 0, "var": "spin_box" }, "child": [{ "type": "Image", "props": { "y": 27, "x": 92.99999999999991, "skin": "room/ganzi.png" } }] }, { "type": "Box", "props": { "y": 1169, "x": 10, "width": 736, "visible": true, "var": "skill_box", "height": 83 }, "child": [{ "type": "Image", "props": { "y": 31, "x": 65, "skin": "room/jiangli.png", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Image", "props": { "y": 31, "x": 150, "skin": "room/jiangli.png", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Image", "props": { "y": 31, "x": 235, "skin": "room/stop.png", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Image", "props": { "y": 31, "x": 320, "skin": "room/bei.png", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Image", "props": { "y": 31, "x": 405, "skin": "room/add_3.png", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Image", "props": { "y": 31, "x": 490, "skin": "room/add_spin.png", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Image", "props": { "y": 31, "x": 575, "skin": "room/jiangli.png", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Image", "props": { "y": 31, "x": 660, "skin": "room/jiangli.png", "anchorY": 0.5, "anchorX": 0.5 } }] }, { "type": "Box", "props": { "y": 1247, "x": 375, "width": 200, "visible": false, "var": "car_box", "pivotY": 0, "pivotX": 100, "height": 111 }, "child": [{ "type": "Clip", "props": { "y": 8, "x": 38, "width": 77, "skin": "room/clip_car_left.png", "pivotY": 10, "pivotX": 40, "name": "car_ear", "interval": 260, "height": 53, "clipY": 2, "autoPlay": false } }, { "type": "Clip", "props": { "y": 8, "x": 160, "width": 77, "skin": "room/clip_car_right.png", "pivotY": 10, "pivotX": 40, "name": "car_ear", "interval": 260, "height": 53, "clipY": 2, "autoPlay": false } }, { "type": "Image", "props": { "y": 47, "x": 97, "width": 105, "skin": "room/car_body.png", "pivotY": 29.245283018867894, "pivotX": 50.943396226415075, "name": "car_body", "height": 64 } }, { "type": "SkeletonPlayer", "props": { "y": 22, "x": 101, "url": "animate/buff.sk", "name": "car_DB" } }, { "type": "Box", "props": { "y": 37, "x": 72, "var": "dom_car_boxMove" }, "child": [{ "type": "Label", "props": { "y": 1, "var": "dom_plus", "text": "+", "font": "car_font", "align": "center" } }, { "type": "Box", "props": { "y": 0, "x": 23, "width": 104, "var": "dom_text_box", "height": 60 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "var": "dom_text_move" }, "child": [{ "type": "Label", "props": { "y": 0, "x": 0, "var": "car_text0", "text": "0", "height": 28, "font": "car_font", "align": "left" } }, { "type": "Label", "props": { "y": 28, "x": 0, "var": "car_text1", "text": "0", "font": "car_font", "align": "left" } }] }] }] }] }, { "type": "Box", "props": { "y": 338, "x": 287, "cacheAs": "bitmap" }, "child": [{ "type": "Box", "props": { "y": -338, "x": -287, "visible": false, "var": "coin_box", "mouseThrough": false }, "child": [{ "type": "Image", "props": { "y": 443, "x": 489, "width": 46, "var": "coin", "skin": "room/coin_10.png", "pivotY": 25.423728813559364, "pivotX": 24.576271186440692, "height": 46 } }, { "type": "Image", "props": { "y": 510, "x": 287, "width": 113, "var": "swing0", "skin": "room/swing.png", "height": 20 } }, { "type": "Image", "props": { "y": 510, "x": 412, "var": "swing1", "skin": "room/swing.png" } }, { "type": "Image", "props": { "y": 800, "x": 167.0000000000001, "var": "fan0", "skin": "room/fan.png", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Image", "props": { "y": 800, "x": 583, "var": "fan1", "skin": "room/fan.png", "anchorY": 0.5, "anchorX": 0.5 } }] }, { "type": "Image", "props": { "x": 89, "visible": true, "skin": "room/cut.png", "name": "flag" } }] }, { "type": "Box", "props": { "y": 200, "x": 0, "var": "middle_box", "mouseThrough": false }, "child": [{ "type": "Box", "props": { "y": 24, "x": 170, "var": "ylb_box" }, "child": [{ "type": "Image", "props": { "skin": "room/ylb_bg.png" } }, { "type": "Label", "props": { "y": 75, "x": 50, "width": 308, "valign": "middle", "text": "0", "name": "ylb_num", "height": 109, "font": "bang_font", "align": "center" } }, { "type": "Image", "props": { "y": 135.00000000000006, "x": 390.0000000000001, "skin": "room/plank.png" } }, { "type": "Box", "props": { "y": 106, "x": 441, "var": "btn_auto_box" }, "child": [{ "type": "Clip", "props": { "skin": "room/clip_auto.png", "name": "auto", "index": 0, "clipY": 4, "autoPlay": false } }, { "type": "Clip", "props": { "y": -16, "x": -11, "skin": "room/clip_light.png", "name": "light", "interval": 500, "clipY": 2, "autoPlay": false } }] }] }, { "type": "SkeletonPlayer", "props": { "y": 470, "x": 376, "url": "animate/bglight.sk", "name": "ballLight_DB" } }] }, { "type": "Box", "props": { "var": "header_box", "mouseThrough": true, "mouseEnabled": true } }, { "type": "Box", "props": { "y": 494, "x": 0, "width": 750, "var": "btn_addCoin", "height": 840, "bottom": 0 } }, { "type": "Box", "props": { "y": 200, "x": 0, "var": "look_box", "mouseThrough": true }, "child": [{ "type": "Image", "props": { "y": 0, "x": -20, "skin": "room/left_bg.png" } }, { "type": "Image", "props": { "y": 38, "x": 40, "skin": "room/look.png", "name": "btn_look", "mouseThrough": true } }, { "type": "Label", "props": { "y": 8, "x": 6.000000000000051, "text": "当前在桌人数：", "fontSize": 17, "font": "Microsoft YaHei", "color": "#fffdcd" } }, { "type": "Label", "props": { "y": 9, "x": 127, "text": 0, "name": "online_num", "fontSize": 16, "font": "Microsoft YaHei", "color": "#fffdcd" } }, { "type": "Box", "props": { "y": 164, "x": 27 }, "child": [{ "type": "Image", "props": { "skin": "room/dia.png" } }, { "type": "Label", "props": { "y": 12, "x": 50, "width": 81, "var": "dom_room_type", "text": "*1", "height": 32, "fontSize": 22, "font": "room_font", "color": "#fff8bc", "align": "center" } }, { "type": "Image", "props": { "y": 4, "x": 7, "skin": "hall/coin.png", "scaleY": 0.7, "scaleX": 0.7 } }] }] }] };
	}]);
	return roomUI;
}(View);
var spinUI = function (_super) {
	function spinUI() {

		this.up = null;
		this.down = null;
		this.dom_spin = null;

		spinUI.__super.call(this);
	}

	CLASS$(spinUI, 'ui.room.spinUI', _super);
	var __proto__ = spinUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(spinUI.uiView);
	};

	STATICATTR$(spinUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "x": 0, "width": 114, "height": 72 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "room/spin.png" } }, { "type": "Box", "props": { "y": -2, "x": 5, "var": "up" }, "child": [{ "type": "Clip", "props": { "y": 26, "skin": "room/clip_spin.png", "name": "0", "index": 1, "clipY": 2 } }, { "type": "Clip", "props": { "y": 17, "x": 5, "skin": "room/clip_spin.png", "name": "1", "index": 1, "clipY": 2 } }, { "type": "Clip", "props": { "y": 10, "x": 13, "skin": "room/clip_spin.png", "name": "2", "index": 1, "clipY": 2 } }, { "type": "Clip", "props": { "y": 5, "x": 22, "skin": "room/clip_spin.png", "name": "3", "clipY": 2 } }, { "type": "Clip", "props": { "y": 1, "x": 32, "skin": "room/clip_spin.png", "name": "4", "clipY": 2 } }, { "type": "Clip", "props": { "x": 43, "skin": "room/clip_spin.png", "name": "5", "clipY": 2 } }, { "type": "Clip", "props": { "x": 54, "skin": "room/clip_spin.png", "name": "6", "clipY": 2 } }, { "type": "Clip", "props": { "y": 2, "x": 63, "skin": "room/clip_spin.png", "name": "7", "clipY": 2 } }, { "type": "Clip", "props": { "y": 5, "x": 72, "skin": "room/clip_spin.png", "name": "8", "clipY": 2 } }, { "type": "Clip", "props": { "y": 10, "x": 79, "skin": "room/clip_spin.png", "name": "9", "clipY": 2 } }, { "type": "Clip", "props": { "y": 17, "x": 86, "skin": "room/clip_spin.png", "name": "10", "clipY": 2 } }, { "type": "Clip", "props": { "y": 26, "x": 90, "skin": "room/clip_spin.png", "name": "11", "clipY": 2 } }] }, { "type": "Box", "props": { "y": 35, "x": 5, "var": "down" }, "child": [{ "type": "Clip", "props": { "y": 1, "skin": "room/clip_spin.png", "name": "0", "clipY": 2 } }, { "type": "Clip", "props": { "y": 9, "x": 5, "skin": "room/clip_spin.png", "name": "1", "clipY": 2 } }, { "type": "Clip", "props": { "y": 16, "x": 13, "skin": "room/clip_spin.png", "name": "2", "clipY": 2 } }, { "type": "Clip", "props": { "y": 21, "x": 22, "skin": "room/clip_spin.png", "name": "3", "clipY": 2 } }, { "type": "Clip", "props": { "y": 24, "x": 32, "skin": "room/clip_spin.png", "name": "4", "clipY": 2 } }, { "type": "Clip", "props": { "y": 25, "x": 43, "skin": "room/clip_spin.png", "name": "5", "clipY": 2 } }, { "type": "Clip", "props": { "y": 25, "x": 54, "skin": "room/clip_spin.png", "name": "6", "clipY": 2 } }, { "type": "Clip", "props": { "y": 23, "x": 63, "skin": "room/clip_spin.png", "name": "7", "clipY": 2 } }, { "type": "Clip", "props": { "y": 19, "x": 72, "skin": "room/clip_spin.png", "name": "8", "clipY": 2 } }, { "type": "Clip", "props": { "y": 14, "x": 79, "skin": "room/clip_spin.png", "name": "9", "index": 1, "clipY": 2 } }, { "type": "Clip", "props": { "y": 8, "x": 86, "skin": "room/clip_spin.png", "name": "10", "index": 1, "clipY": 2 } }, { "type": "Clip", "props": { "x": 90, "skin": "room/clip_spin.png", "name": "11", "index": 1, "clipY": 2 } }] }, { "type": "Clip", "props": { "y": 11, "x": 17, "var": "dom_spin", "skin": "room/clip_spin2.png", "interval": 260, "clipY": 2, "autoPlay": false } }] };
	}]);
	return spinUI;
}(View);
var turntableUI = function (_super) {
	function turntableUI() {

		turntableUI.__super.call(this);
	}

	CLASS$(turntableUI, 'ui.room.turntableUI', _super);
	var __proto__ = turntableUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(turntableUI.uiView);
	};

	STATICATTR$(turntableUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "width": 294, "height": 250 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "room/turn_bg.png" } }, { "type": "Image", "props": { "y": 125, "x": 147, "skin": "room/turntable.png", "name": "turntable", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Image", "props": { "y": 18, "x": 27, "skin": "room/arrows.png" } }] };
	}]);
	return turntableUI;
}(View);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 大奖小奖弹层动画
{
            (function () {
                        var app = window.app;
                        var smallAwardPopUI = window.smallAwardPopUI;
                        var superAwardPopUI = window.superAwardPopUI;

                        // 小奖

                        var SmallAwardPop = function (_smallAwardPopUI) {
                                    _inherits(SmallAwardPop, _smallAwardPopUI);

                                    function SmallAwardPop() {
                                                _classCallCheck(this, SmallAwardPop);

                                                var _this = _possibleConstructorReturn(this, (SmallAwardPop.__proto__ || Object.getPrototypeOf(SmallAwardPop)).call(this));

                                                _this.init();

                                                return _this;
                                    }

                                    _createClass(SmallAwardPop, [{
                                                key: 'init',
                                                value: function init() {
                                                            this.initDom();

                                                            this.zOrder = 2;

                                                            this.bg_DB.stop();

                                                            // 订阅弹层出现
                                                            app.observer.subscribe('smallAwardPopShow', this.myShow.bind(this));
                                                }
                                    }, {
                                                key: 'initDom',
                                                value: function initDom() {
                                                            // 动画背景
                                                            this.bg_DB = this.getChildByName('bg_DB');
                                                            // 文本dom
                                                            this.dom_text = this.getChildByName('dom_text');

                                                            // 喜中多少倍
                                                            this.dom_bei = this.xizhong_box.getChildByName('dom_bei');
                                                            this.dom_num = this.xizhong_box.getChildByName('dom_num');
                                                }
                                    }, {
                                                key: 'myShow',
                                                value: function myShow(txt) {
                                                            this.bg_DB.once(Laya.Event.STOPPED, this, this.myClose);

                                                            // 中奖金额数据写入
                                                            this.dom_text.text = txt;

                                                            this.x = (Laya.stage.width - this.width) / 2;
                                                            this.y = (Laya.stage.height - this.height) / 2 + 120;

                                                            // 喜中多少倍居中
                                                            this.setXiZhongCenter(txt);

                                                            Laya.stage.addChild(this);

                                                            this.bg_DB.play('start', false);
                                                }

                                                // 喜中多少倍居中

                                    }, {
                                                key: 'setXiZhongCenter',
                                                value: function setXiZhongCenter(txt) {
                                                            this.dom_num.text = Math.floor(Number(txt) / Number(app.gameConfig.baseCoin));
                                                            this.dom_bei.x = this.dom_num.x + this.dom_num.displayWidth;
                                                }
                                    }, {
                                                key: 'myClose',
                                                value: function myClose() {
                                                            this.bg_DB.stop();

                                                            this.removeSelf();
                                                }
                                    }]);

                                    return SmallAwardPop;
                        }(smallAwardPopUI);

                        // 超级大奖


                        var SuperAwardPop = function (_superAwardPopUI) {
                                    _inherits(SuperAwardPop, _superAwardPopUI);

                                    function SuperAwardPop() {
                                                _classCallCheck(this, SuperAwardPop);

                                                var _this2 = _possibleConstructorReturn(this, (SuperAwardPop.__proto__ || Object.getPrototypeOf(SuperAwardPop)).call(this));

                                                _this2.init();

                                                return _this2;
                                    }

                                    _createClass(SuperAwardPop, [{
                                                key: 'init',
                                                value: function init() {

                                                            this.initDom();

                                                            this.dom_blue_bg.visible = false;

                                                            this.bg_DB.stop();

                                                            // 订阅弹层出现
                                                            app.observer.subscribe('superAwardPopShow', this.myShow.bind(this));
                                                }
                                    }, {
                                                key: 'initDom',
                                                value: function initDom() {
                                                            // 动画背景
                                                            this.bg_DB = this.getChildByName('bg_DB');
                                                            // 文本dom
                                                            this.dom_text = this.getChildByName('dom_text');

                                                            // 喜中倍数
                                                            this.dom_bei = this.xizhong_box.getChildByName('dom_bei');
                                                            this.dom_num = this.xizhong_box.getChildByName('dom_num');
                                                }
                                    }, {
                                                key: 'myShow',
                                                value: function myShow(txt) {
                                                            var _this3 = this;

                                                            // 绑定一次
                                                            this.bg_DB.once(Laya.Event.STOPPED, this, function () {
                                                                        _this3.bg_DB.play('loop', true);
                                                                        Laya.timer.once(2500, _this3, _this3.myClose);
                                                            });

                                                            // 中奖金额数据写入
                                                            this.dom_text.text = txt;

                                                            this.setXiZhongCenter(txt);

                                                            this.popup();

                                                            this.bg_DB.play('start', false);
                                                }

                                                // 喜中多少倍居中

                                    }, {
                                                key: 'setXiZhongCenter',
                                                value: function setXiZhongCenter(txt) {
                                                            this.dom_num.text = Math.floor(Number(txt) / Number(app.gameConfig.baseCoin));
                                                            this.dom_bei.x = this.dom_num.x + this.dom_num.displayWidth;
                                                }
                                    }, {
                                                key: 'myClose',
                                                value: function myClose() {
                                                            this.bg_DB.stop();
                                                            this.close();
                                                }
                                    }]);

                                    return SuperAwardPop;
                        }(superAwardPopUI);

                        app.SmallAwardPop = SmallAwardPop;
                        app.SuperAwardPop = SuperAwardPop;
            })();
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 公共小提示弹层
{
            (function () {
                        var app = window.app;
                        var commonPopUI = window.commonPopUI;
                        var onlyReadPopUI = window.onlyReadPopUI;
                        var advertisePopUI = window.advertisePopUI;
                        var normalPopUI = window.normalPopUI;

                        // 简单普通的提示层

                        var NormalPopDialog = function (_normalPopUI) {
                                    _inherits(NormalPopDialog, _normalPopUI);

                                    function NormalPopDialog() {
                                                _classCallCheck(this, NormalPopDialog);

                                                var _this = _possibleConstructorReturn(this, (NormalPopDialog.__proto__ || Object.getPrototypeOf(NormalPopDialog)).call(this));

                                                _this.init();

                                                return _this;
                                    }

                                    _createClass(NormalPopDialog, [{
                                                key: 'init',
                                                value: function init() {
                                                            this.initConfig();

                                                            // 订阅弹层出现
                                                            app.observer.subscribe('normalPopShow', this.myShow.bind(this));
                                                }
                                    }, {
                                                key: 'initConfig',
                                                value: function initConfig() {
                                                            this.config = {
                                                                        txtBgDis: this.txt_content.y + 5
                                                            };
                                                }
                                    }, {
                                                key: 'myShow',
                                                value: function myShow(txt) {
                                                            // 内容已经在弹出来了(防止多次弹出相同内容)
                                                            if (this.txt_content.text === txt) {

                                                                        return;
                                                            }

                                                            this.txt_content.text = txt;

                                                            var _displayH = this.txt_content.displayHeight;
                                                            var totalHeight = this.config.txtBgDis * 2 + _displayH;
                                                            this.txt_bg.height = totalHeight;
                                                            this.height = totalHeight;

                                                            this.show();

                                                            Laya.timer.clear(this, this.myClose);
                                                            Laya.timer.once(2000, this, this.myClose);
                                                }
                                    }, {
                                                key: 'myClose',
                                                value: function myClose() {
                                                            this.txt_content.text = '';
                                                            this.close();
                                                }
                                    }]);

                                    return NormalPopDialog;
                        }(normalPopUI);

                        // 广告


                        var AdvertisePopDialog = function (_advertisePopUI) {
                                    _inherits(AdvertisePopDialog, _advertisePopUI);

                                    function AdvertisePopDialog() {
                                                _classCallCheck(this, AdvertisePopDialog);

                                                var _this2 = _possibleConstructorReturn(this, (AdvertisePopDialog.__proto__ || Object.getPrototypeOf(AdvertisePopDialog)).call(this));

                                                _this2.init();

                                                return _this2;
                                    }

                                    _createClass(AdvertisePopDialog, [{
                                                key: 'init',
                                                value: function init() {

                                                            this.initEvent();

                                                            // 订阅弹层出现
                                                            app.observer.subscribe('advertisePopShow', this.myShow.bind(this));
                                                }

                                                // 事件初始化

                                    }, {
                                                key: 'initEvent',
                                                value: function initEvent() {

                                                            // 点击图片关闭
                                                            this.on(Laya.Event.CLICK, this, this.myClose);
                                                }
                                    }, {
                                                key: 'myShow',
                                                value: function myShow(data) {
                                                            this.img.skin = data;

                                                            this.popup();

                                                            Laya.timer.once(5000, this, this.myClose);
                                                }
                                    }, {
                                                key: 'myClose',
                                                value: function myClose() {

                                                            this.close();
                                                }
                                    }]);

                                    return AdvertisePopDialog;
                        }(advertisePopUI);

                        var OnlyReadPopDialog = function (_onlyReadPopUI) {
                                    _inherits(OnlyReadPopDialog, _onlyReadPopUI);

                                    function OnlyReadPopDialog() {
                                                _classCallCheck(this, OnlyReadPopDialog);

                                                var _this3 = _possibleConstructorReturn(this, (OnlyReadPopDialog.__proto__ || Object.getPrototypeOf(OnlyReadPopDialog)).call(this));

                                                _this3.init();

                                                return _this3;
                                    }

                                    _createClass(OnlyReadPopDialog, [{
                                                key: 'init',
                                                value: function init() {
                                                            this.initDom();

                                                            this.initConfig();

                                                            // 订阅弹层出现
                                                            app.observer.subscribe('onlyReadPopShow', this.myShow.bind(this));
                                                }
                                    }, {
                                                key: 'initDom',
                                                value: function initDom() {
                                                            // 弹层大背景
                                                            this.pop_bg = this.getChildByName('pop_bg');

                                                            // 文本背景
                                                            this.txt_bg = this.txt_box.getChildByName('txt_bg');
                                                            // 文字主体
                                                            this.txt_content = this.txt_box.getChildByName('txt_content');
                                                }
                                    }, {
                                                key: 'initConfig',
                                                value: function initConfig() {
                                                            this.config = {
                                                                        txtBgDis: this.txt_content.y,
                                                                        popBgDis: this.pop_bg.height - this.txt_bg.height
                                                            };
                                                }
                                    }, {
                                                key: 'myShow',
                                                value: function myShow(txt) {
                                                            // 内容已经在弹出来了(防止多次弹出相同内容)
                                                            if (this.txt_content.text === txt) {

                                                                        return;
                                                            }

                                                            this.txt_content.text = txt;

                                                            var _displayH = this.txt_content.displayHeight;
                                                            this.txt_bg.height = this.config.txtBgDis * 2 + _displayH;
                                                            this.pop_bg.height = this.config.popBgDis + this.txt_bg.height;
                                                            this.height = this.pop_bg.height;

                                                            this.show();

                                                            Laya.timer.clear(this, this.myClose);
                                                            Laya.timer.once(2000, this, this.myClose);
                                                }
                                    }, {
                                                key: 'myClose',
                                                value: function myClose() {
                                                            this.txt_content.text = '';
                                                            this.close();
                                                }
                                    }]);

                                    return OnlyReadPopDialog;
                        }(onlyReadPopUI);

                        var CommonPopDialog = function (_commonPopUI) {
                                    _inherits(CommonPopDialog, _commonPopUI);

                                    function CommonPopDialog() {
                                                _classCallCheck(this, CommonPopDialog);

                                                var _this4 = _possibleConstructorReturn(this, (CommonPopDialog.__proto__ || Object.getPrototypeOf(CommonPopDialog)).call(this));

                                                _this4.init();

                                                return _this4;
                                    }

                                    _createClass(CommonPopDialog, [{
                                                key: 'init',
                                                value: function init() {
                                                            this.initDom();
                                                            this.initEvent();

                                                            this.initConfig();
                                                }
                                    }, {
                                                key: 'initDom',
                                                value: function initDom() {
                                                            // 弹层大背景
                                                            this.pop_bg = this.getChildByName('pop_bg');
                                                            // 确定按钮
                                                            this.btn_sure = this.btn_box.getChildByName('btn_sure');

                                                            // 文本背景
                                                            this.txt_bg = this.txt_box.getChildByName('txt_bg');
                                                            // 文字主体
                                                            this.txt_content = this.txt_box.getChildByName('txt_content');
                                                }
                                    }, {
                                                key: 'initEvent',
                                                value: function initEvent() {

                                                            // 确定关闭按钮
                                                            this.btn_sure.on(Laya.Event.CLICK, this, this.myClose);

                                                            // 关闭按钮
                                                            this.btn_close.on(Laya.Event.CLICK, this, this.myClose);

                                                            // 订阅弹层出现
                                                            app.observer.subscribe('commonPopShow', this.myShow.bind(this));
                                                }
                                    }, {
                                                key: 'initConfig',
                                                value: function initConfig() {
                                                            this.config = {
                                                                        txtBgDis: this.txt_content.y,
                                                                        popBgDis: this.pop_bg.height - this.txt_bg.height,
                                                                        'timeout': '由于超时未操作，系统以为您退出房间！',
                                                                        'unstable': '客观，您的网络不稳定，请检查网络！'
                                                            };

                                                            this.callback = null;
                                                }
                                    }, {
                                                key: 'myShow',
                                                value: function myShow(txt, boolean, callback) {
                                                            var _txt = this.config[txt] ? this.config[txt] : txt;

                                                            // 内容已经在弹出来了(防止多次弹出相同内容)
                                                            if (this.txt_content.text === _txt) {

                                                                        return;
                                                            }

                                                            this.txt_content.text = _txt;

                                                            var _displayH = this.txt_content.displayHeight;

                                                            this.txt_bg.height = this.config.txtBgDis * 2 + _displayH;
                                                            this.pop_bg.height = this.config.popBgDis + this.txt_bg.height;
                                                            this.height = this.pop_bg.height;

                                                            if (typeof callback === 'function') {
                                                                        this.callback = callback;
                                                            } else {
                                                                        this.callback = null;
                                                            }

                                                            if (boolean) {
                                                                        this.popup();
                                                            } else {
                                                                        this.show();
                                                            }
                                                }
                                    }, {
                                                key: 'myClose',
                                                value: function myClose() {
                                                            if (typeof this.callback === 'function') {
                                                                        this.callback();

                                                                        this.callback = null;
                                                            }
                                                            this.txt_content.text = '';
                                                            this.close();
                                                }
                                    }]);

                                    return CommonPopDialog;
                        }(commonPopUI);

                        app.CommonPopDialog = CommonPopDialog;
                        app.OnlyReadPopDialog = OnlyReadPopDialog;
                        app.AdvertisePopDialog = AdvertisePopDialog;
                        app.NormalPopDialog = NormalPopDialog;
            })();
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 盈利榜中奖弹层
{
    (function () {
        var app = window.app;
        var gainPopUI = window.gainPopUI;

        var GainPopUIDialog = function (_gainPopUI) {
            _inherits(GainPopUIDialog, _gainPopUI);

            function GainPopUIDialog() {
                _classCallCheck(this, GainPopUIDialog);

                var _this = _possibleConstructorReturn(this, (GainPopUIDialog.__proto__ || Object.getPrototypeOf(GainPopUIDialog)).call(this));

                _this.init();

                return _this;
            }

            _createClass(GainPopUIDialog, [{
                key: 'init',
                value: function init() {
                    this.initDom();

                    // 订阅弹层出现
                    app.observer.subscribe('gainPopShow', this.myShow.bind(this));
                }
            }, {
                key: 'initDom',
                value: function initDom() {
                    // 文字主体
                    this.txt_content = this.txt_box.getChildByName('txt_content');
                }
            }, {
                key: 'myShow',
                value: function myShow(txt) {
                    var _this2 = this;

                    this.txt_content.text = txt;
                    this.show();

                    // 3秒后自动关闭
                    Laya.timer.once(4000, this, function () {
                        _this2.close();
                    });
                }
            }]);

            return GainPopUIDialog;
        }(gainPopUI);

        app.GainPopUIDialog = GainPopUIDialog;
    })();
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//大厅
{
    (function () {
        var app = window.app;
        var GM = window.GM;
        var hallUI = window.hallUI;

        var HallScene = function (_hallUI) {
            _inherits(HallScene, _hallUI);

            function HallScene(options) {
                _classCallCheck(this, HallScene);

                var _this = _possibleConstructorReturn(this, (HallScene.__proto__ || Object.getPrototypeOf(HallScene)).call(this));

                _this.sceneName = "hallScene";
                _this.init();
                return _this;
            }

            //初始化


            _createClass(HallScene, [{
                key: "init",
                value: function init() {

                    this.initDom();
                    this.initEvent();

                    //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
                    app.observer.subscribe(this.sceneName + "_enter", this.onEnter.bind(this));
                }
            }, {
                key: "onEnter",
                value: function onEnter() {
                    app.utils.log(this.sceneName + " enter");
                    //取消订阅时不用传递回调函数
                    app.observer.unsubscribe(this.sceneName + "_enter");

                    // 添加头部
                    this.addHeader();

                    // 注册
                    this.registerAction();

                    // 系统公告
                    this.noticeSystem();

                    // 准备完毕且已登录触发请求
                    if (app.utils.checkLoginStatus()) {
                        this.dispatchAction();
                    }
                }

                // 注册

            }, {
                key: "registerAction",
                value: function registerAction() {
                    app.messageCenter.registerAction("roomList", this.renderRoomList.bind(this)) // 房间列表
                    .registerAction("onlineUserNum", this.renderOnLineUser.bind(this)) // 更新房间在线人数
                    .registerAction("enterRoom", app.enterRoom.bind(app)); // 请求进入房间

                }

                // 取消注册

            }, {
                key: "unRegisterAction",
                value: function unRegisterAction() {
                    app.messageCenter.unRegisterAction('roomList').unRegisterAction('onlineUserNum').unRegisterAction('enterRoom');
                }

                // 触发

            }, {
                key: "dispatchAction",
                value: function dispatchAction() {
                    app.messageCenter.emit("roomList");

                    //5分钟
                    Laya.timer.loop(300000, this, this.onlineUserNum);
                }

                // 请求在线人数

            }, {
                key: "onlineUserNum",
                value: function onlineUserNum() {
                    app.messageCenter.emit("onlineUserNum");
                }

                // 清除5分钟一次的在线人数请求

            }, {
                key: "clearOnlineUserNum",
                value: function clearOnlineUserNum() {
                    Laya.timer.clear(this, this.onlineUserNum);
                }
            }, {
                key: "initDom",
                value: function initDom() {
                    // 快速开始
                    this.btn_quick = this.middle_box.getChildByName('btn_quick');
                    // 公告按钮
                    this.btn_notice = this.middle_box.getChildByName('btn_notice');
                    // 小红点
                    this.redPoint = this.middle_box.getChildByName('redPoint');
                    // 盈利榜按钮
                    this.btn_gainList = this.middle_box.getChildByName('btn_gainList');

                    // 房间列表
                    this.roomList = {
                        new: this.room_box.getChildByName('new'),
                        low: this.room_box.getChildByName('low'),
                        middle: this.room_box.getChildByName('middle'),
                        high: this.room_box.getChildByName('high')
                    };
                }

                // 加载头部

            }, {
                key: "addHeader",
                value: function addHeader() {
                    var _header = app.header_ui_box;
                    _header.btn_back.visible = false;
                    _header.btn_shou.visible = true;

                    this.header_box.addChild(_header);
                }
            }, {
                key: "initEvent",
                value: function initEvent() {
                    var _this2 = this;

                    // 公告请求
                    // this.btn_notice.on(Laya.Event.CLICK, this, this.noticeFn);

                    // 快速进入房间
                    this.btn_quick.on(Laya.Event.CLICK, this, function () {
                        // 是否登录
                        app.utils.willGotoLogin();

                        // 加载弹层显示
                        app.observer.publish('fruitLoadingShow');

                        app.messageCenter.emit("enterRoom", { type: 'quick' });
                    });

                    // 盈利榜按钮
                    this.btn_gainList.on(Laya.Event.CLICK, this, function () {
                        // 盈利榜开启时才发送命令
                        if (app.gameConfig.ylbStatus === 1) {

                            app.messageCenter.emit("profixRank");

                            app.observer.publish('yinglibangPopShow');
                        } else {
                            // 错误提示
                            app.observer.publish('commonPopShow', '盈利榜暂未开放');
                        }
                    });

                    //房间列表添加事件请求 
                    Object.values(this.roomList).forEach(function (item, index, arr) {
                        item.on(Laya.Event.CLICK, _this2, function () {
                            // 是否登录
                            app.utils.willGotoLogin();

                            // 加载弹层显示
                            app.observer.publish('fruitLoadingShow');

                            app.messageCenter.emit("enterRoom", { type: item.name });
                        });
                    });
                }

                // 系统公告

            }, {
                key: "noticeSystem",
                value: function noticeSystem() {
                    if (window.GM && GM.isCall_out === 1 && GM.noticeStatus_out) {

                        GM.noticeStatus_out(this.noticeCallBack.bind(this));
                    }
                }
            }, {
                key: "noticeCallBack",
                value: function noticeCallBack() {
                    var _this3 = this;

                    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                    // 是否显示系统公告
                    if (!data.isShowNotice) {

                        return;
                    }

                    // 是否需要显示小红点
                    if (data.isShowRedPoint) {
                        // 显示小红点
                        this.redPoint.visible = true;
                    }

                    this.btn_notice.on(Laya.Event.CLICK, this, function () {
                        // audio.play('an_niu');

                        // 直接隐藏小红点
                        _this3.redPoint.visible = false;
                        GM.noticePopShow_out && GM.noticePopShow_out();
                    });

                    // 显示出公告按钮
                    this.btn_notice.visible = true;
                }

                // 渲染各房间在线人数

            }, {
                key: "renderOnLineUser",
                value: function renderOnLineUser(data) {
                    var _this4 = this;

                    var _list = data.onlineList;
                    Object.keys(_list).forEach(function (item, index) {
                        _this4.roomList[item].find('people').text = _list[item] || '0';
                    });
                }

                // 渲染房间列表信息

            }, {
                key: "renderRoomList",
                value: function renderRoomList(data) {
                    var _this5 = this;

                    var onlineList = data.onlineList;
                    var roomTypeList = data.roomTypeList;

                    Object.keys(onlineList).forEach(function (item, index) {
                        var _room = _this5.roomList[item];
                        var _data = roomTypeList[item];

                        // 该房间数据存在
                        if (_data) {
                            _room.visible = _data.switch === '1' ? true : false;
                            _room.find('min_num').text = _data.condition + '以上';
                            _room.find('base').text = _data.rate;
                            _room.find('people').text = onlineList[item] + '人';
                        }
                    });
                }

                // 退出场景

            }, {
                key: "onExit",
                value: function onExit() {
                    app.utils.log(this.sceneName + " exit");

                    app.header_ui_box.removeHeader();

                    // 取消大厅所有注册
                    this.unRegisterAction();

                    // 取消5分钟一次的在线人数请求
                    this.clearOnlineUserNum();

                    //发布退出事件
                    app.observer.publish(this.sceneName + "_exit");

                    this.clear();
                }

                //自定义方法，场景退出的时候是销毁还是removeself请自行抉择

            }, {
                key: "clear",
                value: function clear() {
                    this.destroy(true);
                }
            }]);

            return HallScene;
        }(hallUI);

        app.HallScene = HallScene;
    })();
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 *  菜单只包含在头部场景中，所以菜单只在头部场景实例化
 */
{
    (function () {
        var app = window.app;
        var GM = window.GM;
        var menuUI = window.menuUI;
        var headerUI = window.headerUI;

        var MenuScene = function (_menuUI) {
            _inherits(MenuScene, _menuUI);

            function MenuScene() {
                _classCallCheck(this, MenuScene);

                var _this = _possibleConstructorReturn(this, (MenuScene.__proto__ || Object.getPrototypeOf(MenuScene)).call(this));

                _this.sceneName = 'menuScene';
                _this.init();

                return _this;
            }

            _createClass(MenuScene, [{
                key: 'init',
                value: function init() {
                    this.hide();
                    // 初始状态开
                    this.initState();
                    this.initEvent();
                }
            }, {
                key: 'initState',
                value: function initState() {
                    // 存cookie
                    var _current = app.audio.getCookie('fruit_sound');

                    if (_current === '' || _current === 'true') {
                        app.audio.setCookie('fruit_sound', 'true');
                        this.stateSound = 'true';
                        this.btn_sound.index = 0;
                    } else if (_current === 'false') {
                        this.stateSound = 'false';
                        this.btn_sound.index = 1;
                    }
                }
            }, {
                key: 'initEvent',
                value: function initEvent() {
                    // 声音按钮
                    this.btn_sound.on(Laya.Event.CLICK, this, this.soundFn);
                    // 帮助按钮
                    this.btn_help.on(Laya.Event.CLICK, this, this.helpFn);
                    // 战绩
                    this.btn_help.on(Laya.Event.CLICK, this, this.helpFn);
                }
            }, {
                key: 'helpFn',
                value: function helpFn() {
                    // 发布帮助弹层出现
                    app.observer.publish('helpPopShow');

                    this.hide();
                }
            }, {
                key: 'soundFn',
                value: function soundFn() {
                    if (this.stateSound === 'true') {
                        this.stateSound = 'false';
                        this.btn_sound.index = 1;
                        app.audio.setMuted();
                    } else {
                        this.stateSound = 'true';
                        this.btn_sound.index = 0;
                        app.audio.setMutedNot();
                    }

                    app.audio.setCookie('fruit_sound', this.stateSound);
                }
            }, {
                key: 'show',
                value: function show() {
                    this.visible = true;
                }
            }, {
                key: 'hide',
                value: function hide() {
                    this.visible = false;
                }
            }]);

            return MenuScene;
        }(menuUI);

        var HeaderScene = function (_headerUI) {
            _inherits(HeaderScene, _headerUI);

            function HeaderScene() {
                _classCallCheck(this, HeaderScene);

                var _this2 = _possibleConstructorReturn(this, (HeaderScene.__proto__ || Object.getPrototypeOf(HeaderScene)).call(this));

                _this2.sceneName = 'headerScene';
                _this2.init();

                return _this2;
            }

            _createClass(HeaderScene, [{
                key: 'init',
                value: function init() {

                    this.initDom();

                    this.initConfig();

                    // 初始化事件
                    this.initEvent();

                    this.initBtnHome();

                    // 跑马灯遮罩
                    this.addMaqueeMask();

                    // 注册
                    this.registerAction();
                }

                // 注册

            }, {
                key: 'registerAction',
                value: function registerAction() {
                    app.messageCenter.registerAction("userAccount", this.renderUserAmount.bind(this)) // 用户信息
                    .registerAction("exitRoom", app.enterHall) // 注册退出房间
                    .registerAction("gameNotice", this.marqueeGo.bind(this)) // 注册公告信息
                    .registerAction("getProfitPool", this.getProfitPoolFn) // 注册盈利榜奖池10分钟一次
                    .registerAction("awardTips", this.awardFudaiGo.bind(this)) // 进入游戏福袋分奖提示
                    .registerAction("losePoint", this.losePointFn.bind(this)) // 输分提醒
                    .registerAction("losePointStatus", this.losePointStatusFn.bind(this)) // 输分禁用
                    .registerAction("cmd::caution", this.wltCaution.bind(this)) // 万里通积分改造
                    .registerAction("transferToPlatform", this.transferToPlatformFn.bind(this)) // 确认收获
                    .registerAction("exchangeGameCoin", this.exchangeGameCoinFn.bind(this)) // 正在兑入
                    .registerAction("advertise", this.advertiseHandle.bind(this)) // 广告
                    .registerAction("activity", this.activityShow.bind(this)); // 不中险
                }

                // 触发

            }, {
                key: 'dispatchAction',
                value: function dispatchAction() {

                    app.messageCenter.emit("userAccount");

                    this.onceEmitGetProfitPool();
                }

                // 触发一次

            }, {
                key: 'onceEmitGetProfitPool',
                value: function onceEmitGetProfitPool() {
                    this.loopGetProfitPool();

                    Laya.timer.clear(this, this.loopGetProfitPool);
                    //3分钟
                    Laya.timer.loop(3 * 60 * 1000, this, this.loopGetProfitPool);
                }

                // 获取盈利榜奖池

            }, {
                key: 'loopGetProfitPool',
                value: function loopGetProfitPool() {
                    app.messageCenter.emit("getProfitPool");
                }
            }, {
                key: 'initDom',
                value: function initDom() {
                    // 初始化菜单
                    this.menuUI = new MenuScene();
                    this.menu_box.addChild(this.menuUI);

                    // 退出房间按钮
                    this.btn_back = this.head_box.getChildByName('btn_back');
                    // 菜单
                    this.btn_menu = this.head_box.getChildByName('btn_menu');
                    // 主页按钮
                    this.btn_home = this.head_box.getChildByName('btn_home');
                    // 充值按钮
                    this.btn_chong = this.yu_box.getChildByName('btn_chong');
                    // 收获按钮
                    this.btn_shou = this.you_box.getChildByName('btn_shou');

                    // 游戏值
                    this.you_num = this.you_box.getChildByName('you_num');
                    // 余额值
                    this.yu_num = this.yu_box.getChildByName('yu_num');

                    // 战绩按钮
                    this.btn_record = this.head_box.getChildByName('btn_record');

                    // 跑马灯
                    this.dom_text_box = this.marquee_box.getChildByName('text_box');
                    // 跑马灯内容
                    this.dom_text_content = this.dom_text_box.getChildByName('text_content');

                    // 福袋分奖骨骼动画
                    this.fudai_DB = this.head_box.getChildByName('fudai_DB');
                    this.fudai_DB.visible = false;
                    this.fudai_DB.stop();
                }

                // 初始化配置参数

            }, {
                key: 'initConfig',
                value: function initConfig() {
                    this.config = {
                        LEFT: this.marquee_box.width, //信息内容初始的x坐标
                        intervalTime: { //时间间隔
                            1: 10 * 1000, //普通跑马灯 
                            2: 2 * 1000 //获奖跑马灯
                        },
                        currentType: 1, //当前跑马灯类型   1:普通型， 2：获奖型
                        modelData: ['恭喜*赢了*，实在是太厉害了！', '祝贺*赢取*，积少成多从现在开始。', '恭喜*赢取*，满屏掌声献给他！'],
                        count: 0,
                        youxiBi: 0, //游戏币
                        yuNum: 0, //余额
                        noticeMsgData: [],
                        isGoing: false //是否已经启动
                    };
                }

                // 初始化事件可能会在频繁remove后被移除，故在外部被add后初始化
                //直接写在内部的事件却不会被移除（疑问？？？）

            }, {
                key: 'initEvent',
                value: function initEvent() {
                    var _this3 = this;

                    // 退出房间
                    this.btn_back.on(Laya.Event.CLICK, this, function () {

                        // 判断是否还有币 || 拉吧依然在转动
                        if (app.matterCenter.coinCount > 0 || app.room_ui_box.configLaba.loopHasStart) {
                            app.observer.publish('quit_rechargePopShow', 'quit', true);

                            // 页面切换带来的事件(暂停自动玩)
                            app.room_ui_box.pageChange(true, 3);

                            // 直接退出
                        } else {

                            // 加载弹层显示
                            app.observer.publish('fruitLoadingShow');
                            app.messageCenter.emit('exitRoom');
                        }
                    });

                    // 菜单
                    this.btn_menu.on(Laya.Event.CLICK, this, function () {
                        _this3.menuUI.visible = !_this3.menuUI.visible;
                    });

                    // 余额查询
                    this.yu_num.on(Laya.Event.CLICK, this, function () {
                        _this3.yuNumPopBalanceShow();
                    });

                    // 充值按钮
                    this.btn_chong.on(Laya.Event.CLICK, this, function () {
                        // 发布
                        app.observer.publish("rechargePopShow");
                    });

                    // 收获按钮
                    this.btn_shou.on(Laya.Event.CLICK, this, function () {
                        // 未登录
                        if (!app.utils.checkLoginStatus()) {
                            app.utils.gotoLogin();

                            return;
                        }

                        // 发送请求
                        app.messageCenter.emit('accoutDetail');

                        // 发布
                        app.observer.publish("shouhuoPopShow", _this3.you_num.text);
                    });

                    // 我的战绩弹层
                    this.btn_record.on(Laya.Event.CLICK, this, function () {
                        // 登录才发送命令
                        if (app.utils.checkLoginStatus()) {
                            app.messageCenter.emit('betPrizeList');
                        }

                        app.observer.publish("mygradePopShow");
                    });

                    // 点击其它区域菜单隐藏
                    Laya.stage.on(Laya.Event.CLICK, this, function (event) {
                        var _target = event.target;
                        if (_this3.menuUI.visible && _target !== _this3.btn_menu && _target !== _this3.menuUI && !_this3.menuUI.contains(_target)) {
                            _this3.menuUI.hide();
                        }
                    });
                }

                // 初始化主页按钮

            }, {
                key: 'initBtnHome',
                value: function initBtnHome() {
                    var btnHomeUrl = this.btn_home;

                    // 默认 不显示按钮
                    btnHomeUrl.visible = false;
                    if (GM.backHomeUrl) {
                        // 显示按钮
                        btnHomeUrl.visible = true;
                        // 绑定事件
                        btnHomeUrl.on('click', this, function () {
                            location.href = GM.backHomeUrl;
                        });
                    }
                }

                // 渲染用户金额

            }, {
                key: 'renderUserAmount',
                value: function renderUserAmount(data) {
                    this.config.youxiBi = Number(data.amount);
                    this.config.yuNum = Number(data.totalScore);
                    var _yu = app.utils.getActiveStr(data.totalScore);
                    var _you = app.utils.getActiveStr(data.amount);
                    this.yu_num.text = _yu;
                    this.you_num.text = _you;
                }

                // 更新用户游戏币（右边）

            }, {
                key: 'updateUserCoin',
                value: function updateUserCoin(num) {
                    var result = Number(this.config.youxiBi) + Number(num);

                    if (result < 0) {
                        app.messageCenter.emit("userAccount");
                    } else {
                        // 当前游戏币存好
                        this.config.youxiBi = result;

                        this.you_num.text = app.utils.getActiveStr(result);
                    }
                }

                // 更新用户余额（左边）

            }, {
                key: 'updateUserYu',
                value: function updateUserYu(num) {
                    var result = Number(this.config.yuNum) + Number(num);
                    this.config.yuNum = result;

                    this.yu_num.text = app.utils.getActiveStr(result);
                }

                // 跑马灯遮罩

            }, {
                key: 'addMaqueeMask',
                value: function addMaqueeMask() {
                    var marquee = this.marquee_box;
                    marquee.mask = new Laya.Sprite();
                    marquee.mask.graphics.clear();
                    marquee.mask.graphics.drawRect(0, 0, marquee.width, marquee.height, '#000000');
                }

                // 当前跑马灯信息进场

            }, {
                key: 'currentNoticeIn',
                value: function currentNoticeIn(text) {
                    var _box = this.dom_text_box;
                    this.dom_text_content.text = text;
                    _box.x = this.config.LEFT;

                    Laya.Tween.to(_box, { x: 0 }, 3000, Laya.Ease.linearIn, Laya.Handler.create(this, this.currentNoticeOut));
                }

                // 当前跑马灯信息离场

            }, {
                key: 'currentNoticeOut',
                value: function currentNoticeOut() {
                    var config = this.config;
                    var _box = this.dom_text_box;
                    var moveX = parseInt(_box.displayWidth);

                    Laya.Tween.to(_box, { x: -moveX }, 2000, Laya.Ease.linearIn, Laya.Handler.create(this, this.renderNextNotice), config.intervalTime[config.currentType]);
                }

                // 渲染下一条公告

            }, {
                key: 'renderNextNotice',
                value: function renderNextNotice() {
                    var config = this.config;
                    var noticeMsgData = config.noticeMsgData;
                    // let text = '';
                    // 当前信息
                    var msg = noticeMsgData.shift();
                    noticeMsgData.push(msg);

                    // 普通公告(由后台做了这段逻辑)
                    /*if(config.currentType === 1){
                        text = msg;
                      // 获奖公告
                    }else{
                        let modelData = config.modelData;
                        let modelArr = modelData[(config.count++)%3].split('*');
                        text = `${modelArr[0]}${msg.name}${modelArr[1]}${msg.award}${modelArr[2]}`;
                    }*/

                    this.currentNoticeIn(msg);
                }

                // 跑马灯开启

            }, {
                key: 'marqueeGo',
                value: function marqueeGo(data) {
                    var config = this.config;
                    config.currentType = Number(data.type) || 2;
                    config.noticeMsgData = data.notice || config.noticeMsgData;

                    // 只启动一次
                    if (!config.isGoing) {
                        config.isGoing = true;
                        this.renderNextNotice();
                    }
                }

                // 盈利榜奖池(写入数据)

            }, {
                key: 'getProfitPoolFn',
                value: function getProfitPoolFn(data) {
                    if (Number(data.code) === 0) {
                        var pool = Number(data.pool);
                        app.gameConfig.pool = parseInt(pool);
                        app.observer.publish('upDatePool', pool);
                    }

                    // 盈利榜是否关闭
                    app.gameConfig.ylbStatus = data.ylbStatus;
                }

                // 不中险&救济金

            }, {
                key: 'activityShow',
                value: function activityShow(data) {
                    var _prize = '';
                    var txt = '';
                    if (data.buzhongxian) {
                        _prize = data.buzhongxian.prizePoint;
                        txt = '\u522B\u62C5\u5FC3\uFF0C\u201C\u5E73\u5B89\u4E0D\u4E2D\u9669\u201D\u5DF2\u4E3A\u60A8\u7684\u635F\u5931\u4E70\u5355\uFF01\u8FD1\u671F\u635F\u5931\u7684' + _prize + '\u6B22\u4E50\u503C\u5DF2\u8FD4\u8FD8\u7ED9\u60A8';
                    } else if (data.helpAmount) {
                        _prize = data.helpAmount.prizePoint;
                        txt = "恭喜赢取救济金，金额： " + _prize;
                    }

                    // 不中险加入余额中
                    this.updateUserYu(_prize);

                    // 仅读弹层
                    app.observer.publish('onlyReadPopShow', txt);
                }

                // 福袋分奖骨骼动画

            }, {
                key: 'awardFudaiGo',
                value: function awardFudaiGo(data) {
                    var _this4 = this;

                    if (Number(data.code) !== 0) {

                        return;
                    }

                    var prize = data.award;

                    this.fudai_DB.once(Laya.Event.STOPPED, this, function () {
                        _this4.fudai_DB.play('loop', true);

                        Laya.timer.once(3000, _this4, function () {
                            _this4.fudai_DB.play('end', false);

                            // 福袋奖励弹层
                            app.observer.publish('gainPopShow', prize);
                            // 更新余额
                            _this4.updateUserYu(prize);
                            // 获取奖池数据
                            _this4.loopGetProfitPool();
                        });
                    });

                    this.fudai_DB.visible = true;
                    this.fudai_DB.play('start', false);
                }

                // 输分提醒

            }, {
                key: 'losePointFn',
                value: function losePointFn(data) {
                    var losePL = data;
                    var _level = Number(losePL.level);
                    var text = '';
                    if (typeof _level !== 'number') {
                        return;
                    }
                    if (_level === 1) {
                        text = '客官，休息一会儿，说不定还可以转转运哦~';
                    }
                    if (_level === 2 || _level === 3) {
                        text = '\u60A8\u7684\u8F93\u5206\u91D1\u989D\u5DF2\u8FBE\u4E0A\u9650\uFF0C\u6545\u8D26\u6237\u7981\u7528\u5F00\u59CB\u65F6\u95F4\uFF1A' + losePL.beginTime + '\uFF0C\u7981\u7528\u7ED3\u675F\u65F6\u95F4\uFF1A' + losePL.endTime;
                    }

                    app.observer.publish('commonPopShow', text, true);

                    // 如果正在自动玩则停止
                    app.room_ui_box.willStopAutoPlay();
                }

                // 黑名单输分禁用

            }, {
                key: 'losePointStatusFn',
                value: function losePointStatusFn(data) {
                    var text = '客官，您已被输分禁用，请联系客服！';
                    app.observer.publish('commonPopShow', text, true);

                    // 如果正在自动玩则停止
                    app.room_ui_box.willStopAutoPlay();
                }

                // 万里通积分改造

            }, {
                key: 'wltCaution',
                value: function wltCaution(data) {
                    //万里通积分授权
                    if (data.code == "1001") {
                        GM.accredit && GM.accredit();
                    }
                    //输分禁用
                    if (data.code == "1000") {
                        GM.jumpToHomePage && GM.jumpToHomePage("blacklist_disable");
                    }
                }

                // 余额查询

            }, {
                key: 'yuNumPopBalanceShow',
                value: function yuNumPopBalanceShow() {
                    if (GM && GM.isCall_out === 1 && GM.popBalanceShow_out) {
                        // audio.play('an_niu');

                        GM.popBalanceShow_out(GM.gameType);
                    }
                }

                // 确认收获

            }, {
                key: 'transferToPlatformFn',
                value: function transferToPlatformFn(data) {
                    if (Number(data.code) === 0 && data.userAccount.code === 'success') {
                        app.observer.publish('commonPopShow', '收获成功！', true);
                    }
                    var result = {
                        amount: 0,
                        totalScore: this.config.youxiBi + this.config.yuNum
                    };

                    this.renderUserAmount(result);
                }

                // 兑入提示

            }, {
                key: 'exchangeGameCoinFn',
                value: function exchangeGameCoinFn(data) {
                    if (Number(data.code) === 0) {
                        var _txt = '\u81EA\u52A8\u4E3A\u60A8\u5E26\u5165' + data.changeCoin + '\u6E38\u620F\u5E01...';
                        app.observer.publish('normalPopShow', _txt);
                    }
                }

                // 广告

            }, {
                key: 'advertiseHandle',
                value: function advertiseHandle(data) {
                    var _pic = '';
                    if (typeof data.pic === 'string') {
                        _pic = data.pic.trim();
                    }
                    if (Number(data.code) === 0 && _pic !== '') {
                        Laya.loader.load(_pic, Laya.Handler.create(this, function () {
                            app.observer.publish('advertisePopShow', _pic);
                        }));
                    }
                }

                // 被移除头部

            }, {
                key: 'removeHeader',
                value: function removeHeader() {

                    this.removeSelf();

                    // 切换场景后必然更新
                    this.dispatchAction();
                }
            }]);

            return HeaderScene;
        }(headerUI);

        app.HeaderScene = HeaderScene;
    })();
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 帮助弹层 & 新手引导
{
        (function () {
                var app = window.app;
                var helpPopUI = window.helpPopUI;
                var newUserPopUI = window.newUserPopUI;

                var HelpPopUIDialog = function (_helpPopUI) {
                        _inherits(HelpPopUIDialog, _helpPopUI);

                        function HelpPopUIDialog() {
                                _classCallCheck(this, HelpPopUIDialog);

                                var _this = _possibleConstructorReturn(this, (HelpPopUIDialog.__proto__ || Object.getPrototypeOf(HelpPopUIDialog)).call(this));

                                _this.init();

                                return _this;
                        }

                        _createClass(HelpPopUIDialog, [{
                                key: 'init',
                                value: function init() {
                                        this.initDom();
                                        this.initEvent();

                                        // 初始化帮助页滑动效果
                                        new window.zsySlider(this.help_glr);

                                        // 订阅弹层出现
                                        app.observer.subscribe('helpPopShow', this.popup.bind(this));
                                }
                        }, {
                                key: 'initDom',
                                value: function initDom() {
                                        this.close_box = this.getChildByName('close_box');
                                }
                        }, {
                                key: 'initEvent',
                                value: function initEvent() {
                                        this.close_box.on(Laya.Event.CLICK, this, this.close);
                                }
                        }]);

                        return HelpPopUIDialog;
                }(helpPopUI);

                var NewUserPopUIDialog = function (_newUserPopUI) {
                        _inherits(NewUserPopUIDialog, _newUserPopUI);

                        function NewUserPopUIDialog() {
                                _classCallCheck(this, NewUserPopUIDialog);

                                var _this2 = _possibleConstructorReturn(this, (NewUserPopUIDialog.__proto__ || Object.getPrototypeOf(NewUserPopUIDialog)).call(this));

                                _this2.init();

                                return _this2;
                        }

                        _createClass(NewUserPopUIDialog, [{
                                key: 'init',
                                value: function init() {

                                        this.initEvent();

                                        // 订阅弹层出现
                                        app.observer.subscribe('newUserPopShow', this.myShow.bind(this));
                                }
                        }, {
                                key: 'initEvent',
                                value: function initEvent() {

                                        this.on(Laya.Event.CLICK, this, this.close);
                                }
                        }, {
                                key: 'myShow',
                                value: function myShow(txt) {

                                        // 倍率赋值
                                        this.dom_room_type.text = txt;

                                        this.popup();
                                }
                        }]);

                        return NewUserPopUIDialog;
                }(newUserPopUI);

                app.HelpPopUIDialog = HelpPopUIDialog;
                app.NewUserPopUIDialog = NewUserPopUIDialog;
        })();
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 历史记录弹框（福袋分奖）
{
    (function () {
        var app = window.app;
        var historyPopUI = window.historyPopUI;

        var HistoryPopUI = function (_historyPopUI) {
            _inherits(HistoryPopUI, _historyPopUI);

            function HistoryPopUI() {
                _classCallCheck(this, HistoryPopUI);

                var _this = _possibleConstructorReturn(this, (HistoryPopUI.__proto__ || Object.getPrototypeOf(HistoryPopUI)).call(this));

                _this.init();

                return _this;
            }

            _createClass(HistoryPopUI, [{
                key: "init",
                value: function init() {

                    // 注册
                    this.registerAction();
                }
            }, {
                key: "initConfig",
                value: function initConfig() {
                    this.config = {};
                }

                // 注册

            }, {
                key: "registerAction",
                value: function registerAction() {
                    // 盈利榜
                    app.messageCenter.registerAction("awardList", this.renderContentList.bind(this));

                    app.observer.subscribe('historyPopShow', this.myShow.bind(this));
                }

                // 渲染内容

            }, {
                key: "renderContentList",
                value: function renderContentList(data) {
                    var array = [];

                    data.award.forEach(function (item, index) {
                        var _name = app.utils.getActiveStr(item.nickname, 12);
                        array.push({
                            bg: item.userid ? 1 : 0,
                            time: item.raw_add_time,
                            name: _name,
                            coin: item.point
                        });
                    });

                    this.ylb_content_list.array = array;
                }
            }, {
                key: "myShow",
                value: function myShow() {
                    this.popup();
                }
            }]);

            return HistoryPopUI;
        }(historyPopUI);

        app.HistoryPopUI = HistoryPopUI;
    })();
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// loading页
{
    (function () {
        var app = window.app;

        var commonFunction = {
            myPromise: function myPromise(obj, parame, ease, time) {
                var _this = this;

                return new Promise(function (resolve, reject) {
                    Laya.Tween.to(obj, parame, time, Laya.Ease[ease], Laya.Handler.create(_this, resolve));
                });
            },


            // 水果动画
            animateFruit: function animateFruit() {
                var _this2 = this;

                var fruitArr = this.fruitArr;
                var _initY = this.config.initY;

                _initY.forEach(function (item, index) {
                    fruitArr[index].rotation = 0;
                    Laya.timer.once(index * 200, _this2, function () {
                        _this2.myPromise(fruitArr[index], { y: item - 50 }, 'linear', 240).then(function () {
                            return _this2.myPromise(fruitArr[index], { y: item }, 'linear', 240);
                        }).then(function () {
                            return _this2.myPromise(fruitArr[index], { rotation: 360 }, 'bounceOut', 800);
                        });
                    });
                });
            },


            // 动画启动
            fruitGo: function fruitGo() {
                this.animateFruit();
                Laya.timer.loop(3000, this, this.animateFruit);
            },


            // 清除水果动画
            clearAnimateFruit: function clearAnimateFruit() {
                Laya.timer.clear(this, this.animateFruit);
            }
        };

        var FruitLoadingUIDialog = function (_window$fruitLoadingU) {
            _inherits(FruitLoadingUIDialog, _window$fruitLoadingU);

            function FruitLoadingUIDialog() {
                _classCallCheck(this, FruitLoadingUIDialog);

                var _this3 = _possibleConstructorReturn(this, (FruitLoadingUIDialog.__proto__ || Object.getPrototypeOf(FruitLoadingUIDialog)).call(this));

                _this3.init();

                return _this3;
            }

            _createClass(FruitLoadingUIDialog, [{
                key: 'init',
                value: function init() {
                    this.initDom();
                    this.initFruitY();
                    this.registerAction();

                    // 扩展方法
                    Object.assign(this, commonFunction);
                }

                // 注册

            }, {
                key: 'registerAction',
                value: function registerAction() {

                    // 弹层出现
                    app.observer.subscribe('fruitLoadingShow', this.myShow.bind(this));

                    // 弹层消失
                    app.observer.subscribe('fruitLoadingClose', this.myClose.bind(this));
                }
            }, {
                key: 'initDom',
                value: function initDom() {

                    // 水果元素数组
                    this.fruitArr = this.fruit_box.findType('Image');

                    // 最上层（压过spin）
                    this.zOrder = 2;
                }
            }, {
                key: 'initFruitY',
                value: function initFruitY() {
                    var _this4 = this;

                    this.config = {
                        initY: [],
                        timeOut: 30 * 1000 //请求超时时间
                    };

                    this.fruitArr.forEach(function (item, index) {
                        _this4.config.initY.push(item.y);
                    });
                }

                // 刷新页面的提示

            }, {
                key: 'reloadGame',
                value: function reloadGame() {

                    // 断开socket
                    app.messageCenter.disconnectSocket();

                    // 提示弹层
                    app.observer.publish('commonPopShow', '请求超时，请刷新页面！', true, function () {
                        window.location.reload();
                    });
                }
            }, {
                key: 'myShow',
                value: function myShow() {
                    // 定时器开启
                    Laya.timer.once(this.config.timeOut, this, this.reloadGame);
                    this.fruitGo();
                    this.visible = true;
                    this.x = app.gameConfig.viewLeft;

                    Laya.stage.addChild(this);
                }
            }, {
                key: 'myClose',
                value: function myClose() {
                    // 清除定时器
                    Laya.timer.clear(this, this.reloadGame);
                    this.clearAnimateFruit();
                    this.visible = false;
                    Laya.stage.removeChild(this);
                }
            }]);

            return FruitLoadingUIDialog;
        }(window.fruitLoadingUI);

        var LoadingScene = function (_window$loadingUI) {
            _inherits(LoadingScene, _window$loadingUI);

            function LoadingScene() {
                _classCallCheck(this, LoadingScene);

                var _this5 = _possibleConstructorReturn(this, (LoadingScene.__proto__ || Object.getPrototypeOf(LoadingScene)).call(this));

                _this5.sceneName = "loadingScene";
                _this5.init();
                return _this5;
            }

            //初始化


            _createClass(LoadingScene, [{
                key: 'init',
                value: function init() {

                    this.initDom();

                    this.initConfig();
                    // 添加遮罩
                    this.addMask();

                    // 初始y坐标
                    this.initFruitY();

                    // 扩展方法
                    Object.assign(this, commonFunction);

                    //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
                    app.observer.subscribe(this.sceneName + "_enter", this.onEnter.bind(this));
                }
            }, {
                key: 'onEnter',
                value: function onEnter() {

                    app.utils.log(this.sceneName + " enter");

                    // 水果动画启动
                    this.fruitGo();

                    //取消订阅时不用传递回调函数
                    app.observer.unsubscribe(this.sceneName + "_enter");
                }
            }, {
                key: 'initDom',
                value: function initDom() {

                    // 加载条
                    this.load_content = this.load_box.getChildByName('load_content');

                    this.fruitArr = this.fruit_box.findType('Image');
                }

                // 初始水果的y坐标

            }, {
                key: 'initFruitY',
                value: function initFruitY() {
                    var _this6 = this;

                    this.fruitArr.forEach(function (item, index) {
                        _this6.config.initY.push(item.y);
                    });
                }
            }, {
                key: 'initConfig',
                value: function initConfig() {
                    this.config = {
                        maskH: this.load_content.displayHeight,
                        maskW: this.load_content.displayWidth,
                        initY: [] //小水果的初始y坐标集合
                    };
                }
            }, {
                key: 'addMask',
                value: function addMask() {
                    var _load = this.load_content;
                    _load.mask = new Laya.Sprite();

                    this.loading(0);
                }

                // 加载运动条

            }, {
                key: 'loading',
                value: function loading(percent) {
                    var w = this.config.maskW * percent;
                    var _load = this.load_content;
                    _load.mask.graphics.clear();
                    _load.mask.graphics.drawRect(0, 0, w, this.config.maskH, '#000000');
                }

                // 退出场景

            }, {
                key: 'onExit',
                value: function onExit() {
                    app.utils.log(this.sceneName + " exit");

                    // 清除动画
                    this.clearAnimateFruit();

                    //发布退出事件
                    app.observer.publish(this.sceneName + "_exit");

                    this.clear();
                }

                //自定义方法，场景退出的时候是销毁还是removeself请自行抉择

            }, {
                key: 'clear',
                value: function clear() {
                    this.destroy(true);
                }
            }]);

            return LoadingScene;
        }(window.loadingUI);

        app.LoadingScene = LoadingScene;
        app.FruitLoadingUIDialog = FruitLoadingUIDialog;
    })();
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 我的战绩弹框
{
    (function () {
        var app = window.app;
        var mygradePopUI = window.mygradePopUI;

        var MyGradePopUIView = function (_mygradePopUI) {
            _inherits(MyGradePopUIView, _mygradePopUI);

            function MyGradePopUIView() {
                _classCallCheck(this, MyGradePopUIView);

                var _this = _possibleConstructorReturn(this, (MyGradePopUIView.__proto__ || Object.getPrototypeOf(MyGradePopUIView)).call(this));

                _this.init();

                return _this;
            }

            _createClass(MyGradePopUIView, [{
                key: 'init',
                value: function init() {
                    this.initDom();

                    this.initEvent();

                    this.registerAction();
                }

                // 注册

            }, {
                key: 'registerAction',
                value: function registerAction() {
                    // 我的战绩信息处理
                    app.messageCenter.registerAction("betPrizeList", this.renderPlayersList.bind(this));

                    // 弹层出现
                    app.observer.subscribe('mygradePopShow', this.myShow.bind(this));
                }
            }, {
                key: 'initDom',
                value: function initDom() {
                    // 登录按钮
                    this.btn_login = this.unLogin_box.getChildByName('btn_login');
                }
            }, {
                key: 'initEvent',
                value: function initEvent() {

                    // 登录按钮
                    this.btn_login.on(Laya.Event.CLICK, this, function () {
                        app.utils.gotoLogin();
                    });
                }

                // 渲染内容

            }, {
                key: 'renderPlayersList',
                value: function renderPlayersList(data) {

                    var array = [];

                    data.list.forEach(function (item, index) {
                        array.push({
                            num: index + 1,
                            point: item.win_amount,
                            time: item.raw_add_time
                        });
                    });

                    this.ylb_content_list.visible = true;
                    this.unLogin_box.visible = false;
                    this.ylb_content_list.array = array;
                }
            }, {
                key: 'myShow',
                value: function myShow() {
                    // 未登录
                    if (!app.utils.checkLoginStatus()) {
                        this.unLogin_box.visible = true;
                        this.ylb_content_list.visible = false;
                    }

                    this.popup();
                }
            }]);

            return MyGradePopUIView;
        }(mygradePopUI);

        app.MyGradePopUIView = MyGradePopUIView;
    })();
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 玩家信息弹框
{
    (function () {
        var app = window.app;
        var playerInfoPopUI = window.playerInfoPopUI;

        var PlayerInfoPopUIView = function (_playerInfoPopUI) {
            _inherits(PlayerInfoPopUIView, _playerInfoPopUI);

            function PlayerInfoPopUIView() {
                _classCallCheck(this, PlayerInfoPopUIView);

                var _this = _possibleConstructorReturn(this, (PlayerInfoPopUIView.__proto__ || Object.getPrototypeOf(PlayerInfoPopUIView)).call(this));

                _this.init();

                return _this;
            }

            _createClass(PlayerInfoPopUIView, [{
                key: "init",
                value: function init() {
                    this.initConfig();
                    this.initDom();

                    this.registerAction();
                }
            }, {
                key: "initConfig",
                value: function initConfig() {
                    this.config = {
                        baseUserHeight: 130, //玩家的一行基数高度
                        baseTableHeight: 50, //下面table一行基数高度
                        play_boxY: this.play_box.y, //固定的
                        userRowNum: 0, //玩家行数
                        tableRowNum: 0 //table行数
                    };
                }

                // 注册

            }, {
                key: "registerAction",
                value: function registerAction() {
                    var _this2 = this;

                    app.messageCenter.registerAction("myTableList", function (data) {
                        _this2.renderPlayersList(data);

                        _this2.renderTableList(data);

                        _this2.myShow();
                    });

                    // 挂载 (长度需要信息返回后才能确定)
                    // app.observer.subscribe('playerInfoPopShow', this.myShow.bind(this));

                }
            }, {
                key: "initDom",
                value: function initDom() {}

                // 渲染内容

            }, {
                key: "renderPlayersList",
                value: function renderPlayersList(data) {
                    var array = [];
                    var _dataArr = data.userAmounts;

                    _dataArr.forEach(function (item) {
                        var _head = app.utils.randomNumber(5);
                        var _name = app.utils.getActiveStr(item.user_name, 12);

                        array.push({
                            name: _name,
                            coin: item.winAmount,
                            head: "pop/ylb/head" + _head + ".png"
                        });
                    });

                    // 玩家有几行
                    this.config.userRowNum = _dataArr.length >= 6 ? 3 : Math.ceil(_dataArr.length / 2);
                    this.player_list.array = array;
                }

                // 渲染table奖项

            }, {
                key: "renderTableList",
                value: function renderTableList(data) {
                    var array = [];
                    var _dataArr = data.userPrize;

                    _dataArr.forEach(function (item) {
                        var _name = app.utils.getActiveStr(item.name, 12);

                        array.push({
                            time: item.time,
                            name: _name,
                            type: item.type,
                            award: item.prize
                        });
                    });

                    this.config.tableRowNum = _dataArr.length >= 6 ? 6 : _dataArr.length;
                    this.table_list.array = array;

                    // 判断表格数据是否显示
                    this.table_box.visible = array.length === 0 ? false : true;
                }

                // 设置各部分位置及高度

            }, {
                key: "setPositionSize",
                value: function setPositionSize() {
                    var _config = this.config;
                    var tableY = _config.play_boxY + _config.baseUserHeight * _config.userRowNum + 10;

                    this.table_box.y = tableY;

                    // 整个弹层的高度(算上table头部)
                    var popHeight = tableY + _config.baseTableHeight * (_config.tableRowNum + 1) + 50;

                    //  弹层的高度 = 弹层背景高度
                    this.height = this.bg.height = popHeight;
                }
            }, {
                key: "myShow",
                value: function myShow() {

                    this.setPositionSize();

                    this.popup();
                }
            }]);

            return PlayerInfoPopUIView;
        }(playerInfoPopUI);

        app.PlayerInfoPopUIView = PlayerInfoPopUIView;
    })();
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 是否退出提示 && 金额不足或去充值或换别场
{
            (function () {
                        var app = window.app;
                        var quit_rechargePopUI = window.quit_rechargePopUI;

                        var Quit_rechargePopUIDialog = function (_quit_rechargePopUI) {
                                    _inherits(Quit_rechargePopUIDialog, _quit_rechargePopUI);

                                    function Quit_rechargePopUIDialog() {
                                                _classCallCheck(this, Quit_rechargePopUIDialog);

                                                var _this = _possibleConstructorReturn(this, (Quit_rechargePopUIDialog.__proto__ || Object.getPrototypeOf(Quit_rechargePopUIDialog)).call(this));

                                                _this.init();

                                                return _this;
                                    }

                                    _createClass(Quit_rechargePopUIDialog, [{
                                                key: 'init',
                                                value: function init() {
                                                            this.initDom();
                                                            this.initEvent();

                                                            this.initConfig();

                                                            // 注册
                                                            this.registerAction();
                                                }

                                                // 注册

                                    }, {
                                                key: 'registerAction',
                                                value: function registerAction() {
                                                            // 订阅弹层出现
                                                            app.observer.subscribe('quit_rechargePopShow', this.myShow.bind(this));
                                                }
                                    }, {
                                                key: 'initDom',
                                                value: function initDom() {
                                                            // 弹层大背景
                                                            this.pop_bg = this.getChildByName('pop_bg');
                                                            // 文本背景
                                                            this.txt_bg = this.txt_box.getChildByName('txt_bg');
                                                            // 文字主体
                                                            this.txt_content = this.txt_box.getChildByName('txt_content');

                                                            // 退出的确定按钮
                                                            this.btn_quit_sure = this.quit.getChildByName('btn_sure');
                                                            // 退出的取消按钮
                                                            this.btn_quit_cancel = this.quit.getChildByName('close');

                                                            // 去充值的确定按钮
                                                            this.btn_less_sure = this.less.getChildByName('btn_sure');
                                                            // 去充值的取消按钮
                                                            this.btn_less_cancel = this.less.getChildByName('close');
                                                }
                                    }, {
                                                key: 'initEvent',
                                                value: function initEvent() {
                                                            var _this2 = this;

                                                            // 两个取消关闭按钮
                                                            this.btn_quit_cancel.on(Laya.Event.CLICK, this, function () {
                                                                        _this2.myClose();

                                                                        // 页面切换带来的事件(继续自动玩)
                                                                        app.room_ui_box && app.room_ui_box.pageChange(true, 2);
                                                            });

                                                            this.btn_less_cancel.on(Laya.Event.CLICK, this, this.myClose);

                                                            // 确认退出
                                                            this.btn_quit_sure.on(Laya.Event.CLICK, this, this.sureQuit);

                                                            // 充值
                                                            this.btn_less_sure.on(Laya.Event.CLICK, this, this.goToRecharge);
                                                }
                                    }, {
                                                key: 'initConfig',
                                                value: function initConfig() {
                                                            this.config = {
                                                                        isShow: false,
                                                                        txtBgDis: this.txt_content.y,
                                                                        popBgDis: this.pop_bg.height - this.txt_bg.height,
                                                                        quit: '离开房间将不能获得当前未结算的奖励，是否确认退出？',
                                                                        less: '您当前余额不足此房间最低带入要求，请先充值或选择其它房间'
                                                            };
                                                }

                                                // 去充值

                                    }, {
                                                key: 'goToRecharge',
                                                value: function goToRecharge() {
                                                            this.myClose();

                                                            app.observer.publish("rechargePopShow");
                                                }

                                                // 确认退出

                                    }, {
                                                key: 'sureQuit',
                                                value: function sureQuit() {
                                                            this.myClose();

                                                            // 加载弹层显示
                                                            app.observer.publish('fruitLoadingShow');
                                                            app.messageCenter.emit('exitRoom');
                                                }
                                    }, {
                                                key: 'myShow',
                                                value: function myShow(txt, boolean, context) {
                                                            // 如果已经显示就不做处理
                                                            if (this.config.isShow) {
                                                                        return;
                                                            }

                                                            this.config.isShow = true;
                                                            var _other = txt === 'quit' ? 'less' : 'quit';

                                                            this.txt_content.text = context || this.config[txt];
                                                            this[txt].visible = true;
                                                            this[_other].visible = false;

                                                            var _displayH = this.txt_content.displayHeight;

                                                            this.txt_bg.height = this.config.txtBgDis * 2 + _displayH;
                                                            this.pop_bg.height = this.config.popBgDis + this.txt_bg.height;
                                                            this.height = this.pop_bg.height;

                                                            if (boolean) {
                                                                        this.popup();
                                                            } else {
                                                                        this.show();
                                                            }
                                                }
                                    }, {
                                                key: 'myClose',
                                                value: function myClose() {
                                                            this.config.isShow = false;
                                                            this.close();
                                                }
                                    }]);

                                    return Quit_rechargePopUIDialog;
                        }(quit_rechargePopUI);

                        app.Quit_rechargePopUIDialog = Quit_rechargePopUIDialog;
            })();
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 充值弹框
{
    (function () {
        var app = window.app;
        var rechargeUI = window.rechargeUI;
        var keybordUI = window.keybordUI;

        var RechargeUIDialog = function (_rechargeUI) {
            _inherits(RechargeUIDialog, _rechargeUI);

            function RechargeUIDialog() {
                _classCallCheck(this, RechargeUIDialog);

                var _this = _possibleConstructorReturn(this, (RechargeUIDialog.__proto__ || Object.getPrototypeOf(RechargeUIDialog)).call(this));

                _this.init();

                return _this;
            }

            _createClass(RechargeUIDialog, [{
                key: 'init',
                value: function init() {
                    this.initConfig();
                    this.initDom();
                    this.initEvent();

                    // 注册挂载
                    this.registerAction();
                }
            }, {
                key: 'initConfig',
                value: function initConfig() {
                    this.config = {
                        rechargeNum: ['10', '50', '100', '200'],
                        info: '请输入大于0的整数',
                        HEIGHT: this.height //初始的高度
                    };
                }
            }, {
                key: 'initDom',
                value: function initDom() {
                    // 购买按钮
                    this.btn_buy = this.input_box.getChildByName('btn_buy');
                    // 输入框值
                    this.input_txt = this.input_box.getChildByName('input_txt');
                    this.input_txt.text = '100';

                    // 添加键盘
                    this.keybord_box.addChild(new keybordUI());
                    this.keybord_box.visible = false;
                }
            }, {
                key: 'initEvent',
                value: function initEvent() {
                    this.btn_buy.on(Laya.Event.CLICK, this, this.ensureFn);

                    this.btn_click.selectHandler = Laya.Handler.create(this, this.tabBtnChoose, null, false);

                    this.keybord_box.on(Laya.Event.CLICK, this, this.enterKey);

                    this.input_txt.on(Laya.Event.CLICK, this, this.keybordShow);

                    this.btn_close.on(Laya.Event.CLICK, this, this.myClose);
                }

                // 注册

            }, {
                key: 'registerAction',
                value: function registerAction() {
                    // 弹层挂载
                    app.observer.subscribe("rechargePopShow", this.myShow.bind(this));
                }
            }, {
                key: 'keybordShow',
                value: function keybordShow() {
                    // 纪录居中时的y值
                    this.config.centerY = this.y;

                    if (this.input_txt.text === this.config.info) {
                        this.input_txt.text = '';
                    }

                    this.keybord_box.visible = true;
                    this.height = this.config.HEIGHT + this.keybord_box.height;
                    Laya.Tween.to(this, { y: 0 }, 300, Laya.Ease.backOut);
                }
            }, {
                key: 'enterKey',
                value: function enterKey(event) {
                    var _target = event.target;
                    var _name = _target.name;
                    var _input = this.input_txt;
                    var _txt = _input.text;

                    if (_name.indexOf('num') > -1) {
                        _input.text = _txt + _target.text;

                        if (_input.text.length > 8) {
                            _input.text = _input.text.slice(0, 8);
                        }
                    } else if (_name === 'del') {
                        _input.text = _txt.slice(0, _txt.length - 1);
                    } else if (_name === 'sureBtn') {
                        _input.text = +_input.text + '';

                        if (_input.text === '' || _input.text === '0') {
                            _input.text = this.config.info;
                        }

                        // 回到居中位置
                        this.resetHeight();
                    }

                    this.btn_click.selectedIndex = -1;

                    this.handleTextInput();
                }
            }, {
                key: 'handleTextInput',
                value: function handleTextInput() {
                    var _this2 = this;

                    var val = this.input_txt.text;
                    this.config.rechargeNum.forEach(function (item, index) {
                        if (item === val) {
                            _this2.btn_click.selectedIndex = index;
                            return true;
                        }
                    });
                }

                // 重置居中位置(之所以要改变高度，是因为在父容器外的元素无法接受点击事件)

            }, {
                key: 'resetHeight',
                value: function resetHeight() {
                    // 还原高度
                    this.height = this.config.HEIGHT;
                    this.keybord_box.visible = false;

                    Laya.Tween.to(this, { y: this.config.centerY }, 300, Laya.Ease.backOut);
                }

                // 选中金额的tab切换

            }, {
                key: 'tabBtnChoose',
                value: function tabBtnChoose(index) {
                    if (index === -1) {
                        return;
                    }

                    this.input_txt.text = this.config.rechargeNum[index];
                }

                // 确定购买

            }, {
                key: 'ensureFn',
                value: function ensureFn() {
                    var pplgameId = window.gameId;
                    var gameName = window.tradeName;
                    var shuoldPay = this.input_txt.text;
                    var gameplatform = window.platform;
                    var currentUrl = window.redirect_uri;
                    var _targetUrl = '';
                    if (Number(shuoldPay) > 0) {

                        // 提示页面跳转
                        // app.observer.publish('commonPopShow', '正在跳转中...');

                        _targetUrl = '/?act=payment&gameId=' + pplgameId + '&tradeName=' + gameName + '&amount=' + shuoldPay + '&platform=' + gameplatform + '&redirect_uri=' + currentUrl;

                        window.location.href = _targetUrl;
                    }
                }
            }, {
                key: 'myShow',
                value: function myShow() {
                    this.keybord_box.visible = false;
                    this.popup();
                }
            }, {
                key: 'myClose',
                value: function myClose() {
                    this.resetHeight();
                    this.close();
                }
            }]);

            return RechargeUIDialog;
        }(rechargeUI);

        app.RechargeUIDialog = RechargeUIDialog;
    })();
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 房间
{
    (function () {
        var app = window.app;
        var roomUI = window.roomUI;
        var GM = window.GM;

        var RoomScene = function (_roomUI) {
            _inherits(RoomScene, _roomUI);

            function RoomScene() {
                _classCallCheck(this, RoomScene);

                var _this = _possibleConstructorReturn(this, (RoomScene.__proto__ || Object.getPrototypeOf(RoomScene)).call(this));

                _this.sceneName = 'roomScene';
                _this.init();
                return _this;
            }

            _createClass(RoomScene, [{
                key: "init",
                value: function init() {
                    // 配置参数
                    this.initConfig();
                    this.initDom();
                    this.initEvent();

                    // 重置技能
                    this.skillReset();
                    // 计算位置坐标
                    this.addPositions();

                    // 拉吧水果添加遮罩
                    this.addLabaMask();

                    // 小车添加遮罩
                    this.addCarMask();

                    // 初始化拉吧
                    this.initLaba();

                    // 限制laba累计灯函数的执行频率
                    this.renderSaveLight = window._.throttle(this._renderSaveLight, 500);

                    //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
                    app.observer.subscribe(this.sceneName + "_enter", this.onEnter.bind(this));
                }
            }, {
                key: "onEnter",
                value: function onEnter() {
                    app.utils.log(this.sceneName + " enter");

                    //取消订阅时不用传递回调函数
                    app.observer.unsubscribe(this.sceneName + "_enter");

                    // 场景进入完毕后再添加头部；
                    this.addHeader();

                    // 循环背景灯闪动
                    this.ballLightLoop();

                    // 注册
                    this.registerAction();

                    // 触发
                    this.dispatchAction();
                }

                // 注册

            }, {
                key: "registerAction",
                value: function registerAction() {
                    var _this2 = this;

                    app.messageCenter.registerAction("pullStart", this.labaDataCome.bind(this)) // 拉吧数据来了
                    .registerAction("enterRoom", this.enterRoomFn.bind(this)) // 投币没钱后会返回这个接口
                    .registerAction("buffStart", this.renderSkill.bind(this)) // buff
                    .registerAction("buff", this.buffWork.bind(this)) // buff效果
                    .registerAction("show", this.renderStarNum.bind(this)) // 星星奖励
                    .registerAction("pallet", this.palletAward.bind(this)) // 托盘奖励
                    .registerAction("onlineTableNum", this.renderTableNum.bind(this)) // 在桌子上的人数
                    .registerAction("isNew", this.isNewHandle.bind(this)) // 是否是新用户
                    .registerAction("palletTrigger", this.renderCarBase.bind(this)); // （风扇）倍率变化;

                    // 绑定盈利榜金额
                    app.observer.subscribe('upDatePool', function (data) {
                        var _num = Math.floor(data);
                        // 盈利榜金额
                        _this2.ylb_num.text = _num === 0 ? "0" : _num;
                    });
                }

                // 取消注册

            }, {
                key: "unRegisterAction",
                value: function unRegisterAction() {
                    // 取消订阅盈利榜金额更新
                    app.observer.unsubscribe('upDatePool');

                    app.messageCenter.unRegisterAction('pullStart').unRegisterAction('enterRoom').unRegisterAction('buffStart').unRegisterAction('buff').unRegisterAction('palletTrigger').unRegisterAction('pallet').unRegisterAction('onlineTableNum').unRegisterAction('isNew').unRegisterAction('show');
                }

                // 触发

            }, {
                key: "dispatchAction",
                value: function dispatchAction() {
                    app.messageCenter.emit('isNew');
                }

                // 配置参数

            }, {
                key: "initConfig",
                value: function initConfig() {
                    this.config = {
                        nailPosList: [], //钉子坐标集合
                        skillPosList: [], //技能坐标集合
                        coinInitPos: { x: this.coin.x, y: this.coin.y }, //金币初始坐标
                        fansInitPos: [//风扇初始坐标
                        { x: this.fan0.x, y: this.fan0.y }, { x: this.fan1.x, y: this.fan1.y }],
                        swingsInitPos: [//摆针初始坐标
                        { x: this.swing0.x, y: this.swing0.y }, { x: this.swing1.x, y: this.swing1.y }],
                        swingSize: { w: this.swing0.width, h: this.swing0.height },
                        STATIC_Y: this.spin_box.y, //spin的固定y坐标
                        carEarPosList: [], //两只车柄
                        carPos: null //车
                    };

                    // 技能名字与背景对应
                    this.skillNameUrl = {
                        jetton: 'jiangli', //奖(筹码)
                        pallet: 'stop', //托盘停
                        mul: 'bei', //倍率
                        light: 'add_3', //增加累计灯
                        spin: 'add_spin' //spin 
                    };

                    // laba相关的状态配置，水果与索引的对应
                    this.configLaba = {
                        fruitTypeNum: 9, //水果的种类个数（包括星星）
                        sameRoundBoxYarr: [115, 196, 281], //光圈的y坐标数组
                        highLineCount: 0, //高亮线闪烁计数
                        labaStopCount: 0, //laba将要停止的计数
                        loopHasStart: false, //laba循环已经开始
                        totalResult: [], //所有的水果结果
                        fruitResult: [//当前这一把的水果结果
                        [0, 0, 0], [1, 1, 1], [2, 2, 2]]
                    };

                    //  轮盘参数
                    this.configTurntableList = {
                        one: { 100: 0, 1000: 60, 200: 120, 400: 180, 300: 240, 500: 300 },
                        two: { 300: 0, 1000: 60, 400: 120, 600: 180, 500: 240, 800: 300 },
                        three: { 1000: 0, 10000: 60, 2000: 120, 4000: 180, 3000: 240, 5000: 300 }
                    };

                    // 关于房间配置
                    this.configRoom = {
                        secondPrize: 0, // 二等奖界限
                        skillExist: [0, 1, 2, 3, 4, 5, 6, 7], //技能存在的位置
                        labaCover_stauts_save: null, //laba遮罩状态存储值
                        currentLabaStatus: 0, //纪录当前的laba蒙层状态值（为了判断是否改变，如不变的话就不处理）
                        currentSaveLight: 0, //纪录当前laba累计灯数量，理由同上
                        isTurntable: false, //这把是否是轮盘奖
                        luckyNum: 0, //第几排中奖
                        luckyArr: [], //中奖的图标索引（光效）
                        roomType: '',
                        prize: 0,
                        isAutoPlay: false, //是否是自动玩
                        top_listActivate: false, //累计灯是否激活
                        labaCoverActivate: false, //laba上下两行是否同时激活
                        willExitRoom: false //用户点开退出按钮（可能要离开）
                    };

                    // 小车托盘配置数据
                    this.configCar = {
                        plusWidth: this.dom_plus.displayWidth, //‘+’宽度
                        carBoxWidth: this.car_box.displayWidth, //‘car_box’宽度
                        HEIGHT: this.car_text0.height, //一个文本数字的高度
                        WIDTH: this.dom_text_box.width, //多个文本数字的宽度
                        totalCarBase: [], //小车数字的数组
                        currentBase: 0, //当前的数字
                        isGoing: false //是否正在滚动
                    };
                }
            }, {
                key: "initDom",
                value: function initDom() {
                    // 查看按钮
                    this.btn_look = this.look_box.getChildByName('btn_look');
                    // 在线人数
                    this.online_num = this.look_box.getChildByName('online_num');

                    // 盈利榜奖励
                    this.ylb_num = this.ylb_box.getChildByName('ylb_num');

                    // 星星奖励
                    this.star_list = this.star_box.findType('Label');
                    // 星星的骨骼动画
                    this.star_DB = this.star_box.getChildByName('star_DB');
                    this.star_DB.stop();

                    // top小灯
                    this.top_list = this.top_light_box.findType('Clip');

                    // 钉子集合
                    this.nail_list = this.nail_box.findType('Image');

                    // 技能集合
                    this.skill_list = this.skill_box.findType('Image');
                    // 遮挡小旗
                    this.flag = this.getChildByName('flag');

                    // 小车
                    this.car_earList = this.car_box.find('car_ear', true);
                    this.car_body = this.car_box.find('car_body');
                    // 小车骨骼动画
                    this.car_DB = this.car_box.find('car_DB');
                    this.car_DB.visible = false;
                    this.car_DB.stop();

                    // 拉吧区域
                    // 拉吧蒙层上
                    this.dom_cover_up = this.cover_box.getChildByName('cover_up');
                    // 拉吧蒙层下
                    this.dom_cover_down = this.cover_box.getChildByName('cover_down');

                    // 拉吧3列水果集合
                    this.laba_item_list = this.laba_mask_box.findType('Box');

                    // 轮盘
                    this.dom_turntable = this.turntable_box.getChildAt(0).getChildByName('turntable');
                    // 转盘骨骼动画
                    this.table_DB = this.turntable_box.getChildByName('table_DB');
                    this.table_DB.stop();

                    // 自动玩按钮
                    this.dom_auto = this.btn_auto_box.getChildByName('auto');
                    // 自动投币的光效
                    this.dom_light = this.btn_auto_box.getChildByName('light');

                    // 背景闪灯(骨骼动画)
                    this.ballLight_DB = this.middle_box.getChildByName('ballLight_DB');
                    this.ballLight_DB.stop();

                    // 高亮的线(集合)
                    this.highLineList = this.threeLine_box.findType('Image');

                    // 相同水果转的光效
                    this.sameRoundList = this.sameRound_box.find('item', true);
                    this.sameRoundList.forEach(function (item) {
                        item.stop();
                    });

                    // 房间场型和赔率金币
                    // this.dom_room_type = this.look_box.getChildByName('room_type');
                }

                // 添加坐标

            }, {
                key: "addPositions",
                value: function addPositions() {

                    // 钉子坐标集合
                    var _arr = [];
                    this.nail_list.forEach(function (item) {
                        _arr.push({ x: item.x, y: item.y });
                    });
                    this.config.nailPosList = _arr;

                    // 技能坐标集合
                    var _arr2 = [];
                    var _pX = this.skill_box.x;
                    var _pY = this.skill_box.y + this.skill_list[0].y;
                    this.skill_list.forEach(function (item) {
                        _arr2.push({ x: item.x + _pX, y: _pY });
                    });
                    this.config.skillPosList = _arr2;

                    // 小车坐标
                    var _arr3 = [];
                    var car_box = this.car_box;
                    this.car_earList.forEach(function (item) {
                        _arr3.push({ x: item.x + car_box.x - 100, y: item.y + car_box.y });
                    });
                    this.config.carEarPosList = _arr3;
                    this.config.carPos = { x: this.car_body.x - 100 + car_box.x, y: this.car_body.y + car_box.y };
                }

                // 事件初始化

            }, {
                key: "initEvent",
                value: function initEvent() {
                    var _this3 = this;

                    // 自动玩启动
                    this.btn_auto_box.on(Laya.Event.CLICK, this, this.autoAddCoin);
                    // 自动按钮(状态变化)
                    this.dom_auto.on(Laya.Event.CHANGE, this, function () {
                        var _index = _this3.dom_auto.index;
                        if (_index === 2) {
                            _this3.dom_light.autoPlay = true;
                            Laya.timer.loop(500, _this3, _this3.loopAddCoin);
                        } else if (_index === 0 || _index === 3) {
                            _this3.dom_light.autoPlay = false;
                            _this3.dom_light.index = 0;

                            Laya.timer.clear(_this3, _this3.loopAddCoin);
                        }
                    });

                    // 掉金币的按钮（大的空box）
                    this.btn_addCoin.on(Laya.Event.CLICK, this, function () {
                        // 判断自动玩
                        if (!_this3.configRoom.isAutoPlay) {
                            // 已经限制住了
                            if (app.gameConfig.timeLimit) {
                                return;
                            }

                            app.gameConfig.timeLimit = true;
                            Laya.timer.once(250, _this3, function () {
                                app.gameConfig.timeLimit = false;
                            });
                            app.messageCenter.emit('bet', { type: _this3.configRoom.roomType, auto: 0 });
                        }
                    });

                    // 查看玩家
                    this.btn_look.on(Laya.Event.CLICK, this, function () {
                        // 查看当前桌上的所有玩家
                        app.messageCenter.emit('myTableList');
                    });

                    // 盈利榜按钮
                    this.ylb_num.on(Laya.Event.CLICK, this, function () {
                        // 盈利榜开启时才发送命令
                        if (app.gameConfig.ylbStatus === 1) {

                            app.messageCenter.emit("profixRank");

                            app.observer.publish('yinglibangPopShow');
                        } else {
                            // 公共提示                                          
                            app.observer.publish('commonPopShow', '盈利榜暂未开放');
                        }
                    });

                    // 切换页面事件
                    window.$(document).on('visibilitychange', this.pageChange.bind(this, false));
                }

                // 页面切换事件(type:如果点开退出弹框则为true， 否则是false, false时候第二个参数指定index)
                // index: 2 自动玩； index: 3 暂停

            }, {
                key: "pageChange",
                value: function pageChange(type, index) {
                    // 用户点开了退出弹框
                    this.configRoom.willExitRoom = type;
                    if (this.configRoom.isAutoPlay) {
                        this.dom_auto.index = this.dom_auto.index === 2 ? 3 : 2;
                        if (type) {
                            this.dom_auto.index = index;
                            // 关掉退出弹框
                            if (index === 2) {
                                this.configRoom.willExitRoom = false;
                            }
                        } else {
                            this.dom_auto.index = this.dom_auto.index === 2 ? 3 : 2;
                        }
                    }
                }

                // 是否是新用户

            }, {
                key: "isNewHandle",
                value: function isNewHandle(data) {
                    if (Number(data.code) === 0 && Number(data.result) === 0) {
                        app.observer.publish('newUserPopShow', '*' + app.gameConfig.baseCoin);
                    }
                }

                // 处理投币没钱的情况

            }, {
                key: "enterRoomFn",
                value: function enterRoomFn(data) {
                    if (data.code === 10) {
                        // 暂停自动玩
                        this.dom_auto.index = 3;
                        app.observer.publish('quit_rechargePopShow', 'less', true, '余额不足，请先充值');
                    }
                }

                // 自动投币

            }, {
                key: "autoAddCoin",
                value: function autoAddCoin() {
                    var _this4 = this;

                    this.configRoom.isAutoPlay = !this.configRoom.isAutoPlay;
                    this.dom_auto.index = 1;

                    Laya.timer.once(200, this, function () {
                        _this4.dom_auto.index = _this4.configRoom.isAutoPlay ? 2 : 0;
                    });
                }

                // 自动投币

            }, {
                key: "loopAddCoin",
                value: function loopAddCoin() {
                    app.messageCenter.emit('bet', { type: this.configRoom.roomType, auto: 1 });
                }

                // 由于投币后错误就停止自动玩

            }, {
                key: "willStopAutoPlay",
                value: function willStopAutoPlay() {
                    if (this.configRoom.isAutoPlay) {
                        this.btn_auto_box.event(Laya.Event.CLICK);
                    }
                }

                /**
                 * { item_description }
                 * 
                 * 渲染房间信息
                 * 
                 */

                // 渲染房间信息

            }, {
                key: "renderRoomInfo",
                value: function renderRoomInfo(data) {
                    var tableInfo = data.tableInfo;

                    // 星星奖励
                    this.renderStarNum(tableInfo);

                    // 累计灯(一排四盏)
                    this.renderSaveLight(tableInfo.pull.lamp);

                    // 拉吧部分蒙层的渲染
                    this.labaCoverStatus(tableInfo.pull.status);

                    // 渲染小车的倍率(托盘)
                    this.renderCarBase(tableInfo);

                    // 盈利榜金额
                    this.ylb_num.text = Math.floor(data.poolAmount);

                    // 房间类型&基本倍率
                    this.renderTypeCoin(tableInfo);

                    // 渲染场次对应的轮盘皮肤
                    this.renderTableSkin();
                }

                // 渲染场次对应的轮盘皮肤

            }, {
                key: "renderTableSkin",
                value: function renderTableSkin() {
                    var _type = this.configRoom.roomType;
                    var _url = '';
                    var key = '';
                    switch (_type) {
                        case 'new':
                            _url = 'turntable';
                            key = 'one';
                            break;
                        case 'low':
                            _url = 'turntable';
                            key = 'one';
                            break;
                        case 'middle':
                            _url = 'turntable_middle';
                            key = 'two';
                            break;
                        case 'high':
                            _url = 'turntable_high';
                            key = 'three';
                            break;
                    }

                    // 转盘皮肤
                    this.dom_turntable.skin = "room/" + _url + ".png";

                    // 对应金额和角度
                    this.configTurntable = this.configTurntableList[key];
                }

                // 在桌人数

            }, {
                key: "renderTableNum",
                value: function renderTableNum(data) {
                    this.online_num.text = data.count;
                }

                // 房间类型&基本倍率

            }, {
                key: "renderTypeCoin",
                value: function renderTypeCoin(tableInfo) {
                    // 金币基数 
                    var _base = Number(tableInfo.base);
                    var _type = tableInfo.tableId.slice(0, tableInfo.tableId.indexOf(':'));
                    var name = '';
                    // 房间类型
                    this.configRoom.roomType = _type;

                    /*switch (_type) {
                        case 'new':
                            name = '新手场';
                            break;
                        case 'low':
                            name = '初级场';
                            break;
                        case 'middle':
                            name = '中级场';
                            break;
                        case 'high':
                            name = '高级场';
                            break;
                    }*/

                    app.gameConfig.baseCoin = _base;
                    this.dom_room_type.text = '*' + _base;
                }

                // 星星值变化

            }, {
                key: "renderStarNum",
                value: function renderStarNum(data) {
                    // 颠倒一下渲染
                    if (!Array.isArray(data.prize)) {
                        return;
                    }

                    var _data = data.prize.reverse();
                    this.star_list.forEach(function (item, index) {
                        item.text = _data[index];
                    });
                    // 赋值二等奖界限
                    this.configRoom.secondPrize = Number(_data[1]);
                    this.star_DB.play('start', false);
                }

                // 渲染laba的累计灯
                // 该函数的执行需要限制频率

            }, {
                key: "_renderSaveLight",
                value: function _renderSaveLight(data) {
                    // 累计灯数量
                    var num = Number(data);

                    // 判断是否改变
                    if (this.configRoom.currentSaveLight === num) {

                        return;
                    }
                    // 当前累计灯赋值
                    this.configRoom.currentSaveLight = num;

                    this.top_list.forEach(function (item, index) {
                        item.index = index < num ? 1 : 0;
                    });

                    // 每次都来初始一下未激活
                    this.configRoom.top_listActivate = false;

                    // 没暂停
                    if (this.dom_auto.index !== 3 && num === 4) {

                        // 更改累计灯的激活状态
                        this.configRoom.top_listActivate = true;
                    }

                    // 暂停
                    if (this.dom_auto.index === 3 && num !== 0) {

                        // 更改累计灯的激活状态
                        this.configRoom.top_listActivate = true;
                    }

                    // 检验是否暂停自动玩
                    return this.checkPauseAutoPlay();
                }

                // 存储laba遮罩状态
                // 存储的目的：防止上一把的中奖结果还未结束就更新遮罩区，造成中奖动效出现在未开放区的误导

            }, {
                key: "saveLabaCoverStatus",
                value: function saveLabaCoverStatus(data) {
                    // 判断laba是否在循环运行中(是的话就要暂先存储)
                    if (this.configLaba.loopHasStart) {
                        this.configRoom.labaCover_stauts_save = data;
                    } else {
                        this.labaCoverStatus(data);
                    }
                }

                // 拉吧部分蒙层的渲染

            }, {
                key: "labaCoverStatus",
                value: function labaCoverStatus() {
                    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                    var num = Number(data);
                    var _up = 0;
                    var _down = 0;

                    // 判断是否改变
                    if (this.configRoom.currentLabaStatus === num) {

                        return;
                    }
                    // 当前laba状态值
                    this.configRoom.currentLabaStatus = num;
                    // 高亮线
                    this.highLineAnimate(num);
                    switch (num) {
                        case 0:
                            break;
                        case 1:
                            _up = 1;
                            _down = 1;
                            break;
                        case 2:
                            _up = 1;
                            break;
                        case 3:
                            _down = 1;
                            break;
                    }

                    this.dom_cover_up.visible = _up ? false : true;
                    this.dom_cover_down.visible = _down ? false : true;

                    // 更改laba遮罩区的激活状态
                    if (_up && _down) {
                        this.configRoom.labaCoverActivate = true;
                    } else {
                        this.configRoom.labaCoverActivate = false;
                    }

                    // 检验是否暂停自动玩
                    return this.checkPauseAutoPlay();
                }

                // 高亮线的闪烁效果

            }, {
                key: "highLineAnimate",
                value: function highLineAnimate() {
                    var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                    // 如果为0 不予处理
                    if (Number(num) === 0) {

                        return;
                    }
                    switch (Number(num)) {
                        case 1:
                            this.highLineList.forEach(function (item, index) {
                                item.visible = true;
                            });

                            break;
                        case 2:
                            this.highLineList.forEach(function (item, index) {
                                if (index === 0 || index === 1) {
                                    item.visible = true;
                                } else {
                                    item.visible = false;
                                }
                            });
                            break;
                        case 3:
                            this.highLineList.forEach(function (item, index) {
                                if (index === 2 || index === 1) {
                                    item.visible = true;
                                } else {
                                    item.visible = false;
                                }
                            });
                            break;
                    }

                    Laya.timer.clear(this, this.highLineLoop);
                    Laya.timer.loop(500, this, this.highLineLoop);
                }

                // 高亮线的循环

            }, {
                key: "highLineLoop",
                value: function highLineLoop() {
                    if (this.configLaba.highLineCount++ > 5) {
                        Laya.timer.clear(this, this.highLineLoop);
                        this.configLaba.highLineCount = 0;
                        this.threeLine_box.visible = false;

                        return;
                    }
                    this.threeLine_box.visible = !this.threeLine_box.visible;
                }

                // 检验是否暂停自动玩

            }, {
                key: "checkPauseAutoPlay",
                value: function checkPauseAutoPlay() {
                    // 并没有开启自动玩 用户点开退出按钮
                    if (this.dom_auto.index === 0 || this.configRoom.willExitRoom) {

                        return;
                    }

                    // 页面已切走
                    if (document.visibilityState && document.visibilityState === 'hidden') {
                        return;
                    }

                    // laba累计灯 上下两行都打开  同时激活状态
                    if (this.configRoom.labaCoverActivate && this.configRoom.top_listActivate) {
                        // 暂停
                        if (this.dom_auto.index !== 3) {
                            this.dom_auto.index = 3;
                            app.observer.publish('normalPopShow', '累计灯已满，自动为您暂停投币');
                        }
                    } else {
                        // 自动玩
                        if (this.dom_auto.index !== 2) {
                            this.dom_auto.index = 2;
                        }
                    }
                }

                // 加载头部

            }, {
                key: "addHeader",
                value: function addHeader() {
                    var _header = app.header_ui_box;
                    _header.btn_back.visible = true;
                    _header.btn_shou.visible = false;

                    return this.header_box.addChild(_header);
                }

                /**
                 * { item_description }
                 * 
                 * 
                 * buff 逻辑区域
                 */

                // 技能重置

            }, {
                key: "skillReset",
                value: function skillReset() {
                    this.skill_list.forEach(function (item) {
                        item.visible = false;
                    });
                }

                // 技能渲染 (索引位置， 类型)

            }, {
                key: "renderSkill",
                value: function renderSkill(data) {
                    var target = this.configRoom.skillExist;
                    var buff = data.buff;
                    var type = buff.type;
                    var skillNameUrl = this.skillNameUrl;

                    if (target.length === 0) {
                        app.utils.log('技能没有空位。。。');
                        return;
                    }
                    // 随机索引
                    var _index = app.utils.randomNumber(target.length - 1);
                    var target_index = target[_index];
                    var _skill = this.skill_list[target_index];
                    target.splice(_index, 1);

                    _skill.skin = 'room/' + skillNameUrl[type] + '.png';
                    _skill.alpha = 1;
                    _skill.visible = true;

                    // buff8秒后渐隐
                    Laya.Tween.to(_skill, { alpha: 0 }, 2 * 1000, Laya.Ease.linearIn, null, 8 * 1000);

                    // 刚体渲染buff
                    return app.matterCenter.addSkills(target_index, buff);
                }

                // buff生效

            }, {
                key: "buffWork",
                value: function buffWork(data) {
                    var _type = data.type;

                    switch (_type) {
                        // 奖励金额
                        case 'jetton':
                            app.header_ui_box.updateUserCoin(data.amount);
                            app.utils.log('奖励:' + data.amount);
                            break;

                        // 托盘停
                        case 'pallet':
                            app.matterCenter.buffSkillStop('pallet', data.time);
                            app.utils.log('托盘停止时间:' + data.time);
                            break;

                        // 倍率
                        case 'mul':

                            app.utils.log('倍率变化:');
                            break;

                        // 累计灯加三个
                        case 'light':
                            this.renderSaveLight(data.lamp);
                            app.utils.log('累计灯现在是:' + data.lamp);
                            break;

                        // spin停止
                        case 'spin':
                            app.matterCenter.buffSkillStop('spin', data.time);
                            app.utils.log('spin停止时间:' + data.time);
                            break;
                    }
                }

                /**
                 * { item_description }
                 * 
                 * 
                 * 
                 * 托盘区域逻辑(小车)
                 */

                // 添加小车遮罩

            }, {
                key: "addCarMask",
                value: function addCarMask() {
                    var text_box = this.dom_text_box;
                    text_box.mask = new Laya.Sprite();
                    text_box.mask.graphics.clear();
                    text_box.mask.graphics.drawRect(0, 0, this.configCar.WIDTH, this.configCar.HEIGHT, '#000000');
                }

                // 托盘奖励

            }, {
                key: "palletAward",
                value: function palletAward(data) {
                    if (data.code !== 0) {
                        app.utils.warn(data.msg);
                        return;
                    }
                    // 中奖金额
                    return app.header_ui_box.updateUserCoin(data.amount);
                }

                // 小车倍数

            }, {
                key: "renderCarBase",
                value: function renderCarBase(data) {
                    var current = data.amount || data.pallet || '0';
                    this.configCar.totalCarBase.push(current);
                    this.configCar.currentBase = current;

                    if (!this.configCar.isGoing) {
                        this.configCar.isGoing = true;
                        return this.animationCarBase();
                    }
                }

                // 倍数动画

            }, {
                key: "animationCarBase",
                value: function animationCarBase() {
                    var _this5 = this;

                    var topY = this.configCar.HEIGHT * -1;
                    var _box = this.dom_text_move;
                    var current = this.configCar.totalCarBase.shift();

                    if (typeof current === 'undefined') {

                        this.configCar.isGoing = false;
                        return;
                    }
                    this.car_text1.text = current;
                    Laya.Tween.to(_box, { y: topY }, 800, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
                        // 恢复位置
                        _this5.car_text0.text = current;
                        _box.y = 0;

                        // 调整一下位置居中
                        var centerX = (_this5.configCar.carBoxWidth - _this5.configCar.plusWidth - _this5.car_text0.displayWidth) / 2;
                        _this5.dom_car_boxMove.x = centerX;

                        // 再次自调用
                        return _this5.animationCarBase();
                    }));
                }

                // 小车的动画效果（把手闪动）

            }, {
                key: "cartoonFn",
                value: function cartoonFn(index, position) {
                    // 小车两只把手
                    var _ear = null;
                    var _index = Number(index);
                    var text = Number(this.configCar.currentBase);
                    // 车身
                    if (_index === 2) {
                        // 小车身的骨骼动画
                        _ear = this.car_body;
                        this.car_DB.visible = true;
                        this.car_DB.play('car', false);

                        // 左右把手
                    } else {
                        _ear = this.car_earList[_index];
                        _ear.autoPlay = true;

                        var callback = _index === 0 ? this.earStopLeft : this.earStopRight;
                        Laya.timer.clear(this, callback);
                        Laya.timer.once(2200, this, callback);
                        text = Math.floor(text / 2);
                    }

                    // 飘字效果
                    this.cartoonFontAnimate(text, position);
                }

                // 托盘奖励飘字效果

            }, {
                key: "cartoonFontAnimate",
                value: function cartoonFontAnimate(text, position) {
                    var domLabel = new Laya.Label();
                    domLabel.font = 'car_font';
                    domLabel.text = '+' + text;
                    this.addChild(domLabel);
                    domLabel.pos(position.x, position.y - 30);

                    Laya.Tween.to(domLabel, { y: domLabel.y - 80 }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
                        domLabel.destroy(true);
                    }));
                }

                // 把手停止闪动

            }, {
                key: "earStopLeft",
                value: function earStopLeft() {
                    this.car_earList[0].autoPlay = false;
                    this.car_earList[0].index = 0;
                }
            }, {
                key: "earStopRight",
                value: function earStopRight() {
                    this.car_earList[1].autoPlay = false;
                    this.car_earList[1].index = 0;
                }

                /**
                 * { item_description }
                 * { item_description }
                 * { item_description }
                 * { item_description }
                 * { item_description }
                 * 
                 * laba 逻辑区域
                 * 数据来了读取数据，放入数组，启动循环laba，取出首个数据开始laba，
                 * 
                 */

                // 拉吧添加遮罩

            }, {
                key: "addLabaMask",
                value: function addLabaMask() {
                    var laba = this.laba_mask_box;
                    laba.mask = new Laya.Sprite();
                    laba.mask.graphics.clear();
                    laba.mask.graphics.drawRect(0, 0, laba.width, laba.height, '#000000');
                }

                // 创建水果元素

            }, {
                key: "createFruit",
                value: function createFruit(index) {
                    var _clip = new Laya.Clip();
                    var _num = this.configLaba.fruitTypeNum;
                    if (index === -1) {
                        index = app.utils.randomNumber(_num - 1);
                    }
                    _clip.skin = 'room/clip_fruit.png';
                    _clip.clipY = _num;
                    _clip.index = index;

                    return _clip;
                }

                // 初始化拉吧水果

            }, {
                key: "initLaba",
                value: function initLaba() {
                    var _this6 = this;

                    var fruitIndex = [-1, -1, -1, -1, -1, -1];

                    this.laba_item_list.forEach(function (item, index) {
                        var _clipArr = [];
                        fruitIndex.forEach(function (current, i) {
                            var _f = _this6.createFruit(current);
                            _f.y = 80 * i;
                            _clipArr.push(_f);
                        });

                        // 一列列存放
                        item.addChildren.apply(item, _clipArr);
                        // 只算一次
                        if (index === 0) {
                            // 倒数第四个水果
                            _this6.config.labaInitPostionY = -(item.getChildAt(item.numChildren - 4).y + 80);
                        }
                        //位置放上边
                        item.y = _this6.config.labaInitPostionY;

                        // 标志符号
                        item.count = 0;
                    });
                }

                // laba数据来了

            }, {
                key: "labaDataCome",
                value: function labaDataCome(data) {

                    // 存储数据
                    this.configLaba.totalResult.push(data);

                    // 开始拉吧的数据循环读取并显示水果结果
                    // 添加标识符, laba循环已经开始就不需要再次循环
                    if (this.configLaba.loopHasStart) {

                        return;
                    }

                    this.configLaba.loopHasStart = true;

                    // 首先执行一次(现在不使用循环laba，而是通过回调再来读取数据启动laba)
                    this.loopLaba();
                }

                // 循环laba的数据读取并启动laba

            }, {
                key: "loopLaba",
                value: function loopLaba() {
                    // 取出第一个数据
                    var data = this.configLaba.totalResult.shift();

                    // 拉吧每次启动后再去检查更新laba的状态（laba遮罩渲染）
                    if (this.configRoom.labaCover_stauts_save !== null) {
                        this.labaCoverStatus(this.configRoom.labaCover_stauts_save);
                        this.configRoom.labaCover_stauts_save = null;
                    }

                    if (typeof data === 'undefined') {
                        // 清除循环

                        return this.clearLoopLaba();
                    } else {
                        // 启动laba
                        return this.labaGo(data);
                    }
                }

                // 清除laba循环数据读取

            }, {
                key: "clearLoopLaba",
                value: function clearLoopLaba() {
                    this.configLaba.loopHasStart = false;
                }

                // 停止拉吧(由于公用一个循环函数存在变量变化时机的互相影响，所以要先后的去变)

            }, {
                key: "labaStop",
                value: function labaStop() {
                    var _this7 = this;

                    this.laba_item_list.forEach(function (item, index) {
                        (function (item, index) {
                            Laya.timer.once(index * 400, _this7, function () {
                                item.count = 1;
                            });
                        })(item, index);
                    });
                }

                // 拉吧启动

            }, {
                key: "labaGo",
                value: function labaGo(data) {
                    var arr = data.icon;

                    // 中轮盘将
                    this.configRoom.isTurntable = data.type === 4 ? true : false;

                    // 中奖金额
                    this.configRoom.prize = Number(data.prize);

                    // 计算几排 光圈(只有中奖了才有必要计算)
                    if (Number(data.prize) > 0) {
                        this.getSameRoundPosition(data.luckyNum, arr);
                    }
                    // 存储灯
                    this.renderSaveLight(data.lamp);

                    // 数据写入
                    this.configLaba.fruitResult.forEach(function (item, index) {
                        arr.forEach(function (itemIner, indexIner) {
                            item[indexIner] = itemIner[index];
                        });
                    });

                    // laba停止的计数器置0
                    this.configLaba.labaStopCount = 0;

                    // 先后的开始laba动画
                    for (var i = 0; i < 3; i++) {
                        Laya.timer.once(400 * i, this, this.labaAnimate.bind(this, i));
                    }
                }

                // 拉吧运动开始

            }, {
                key: "labaAnimate",
                value: function labaAnimate(listIndex) {
                    var _this8 = this;

                    var labaItem = this.laba_item_list[listIndex];
                    var callback = null;
                    var _prize = this.configRoom.prize;

                    // 可以停止了（三条拉吧需要各自判断）
                    if (labaItem.count === 1) {
                        var _result = this.configLaba.fruitResult;
                        labaItem.count = 0;
                        labaItem.getChildAt(0).index = _result[listIndex][0];
                        labaItem.getChildAt(1).index = _result[listIndex][1];
                        labaItem.getChildAt(2).index = _result[listIndex][2];

                        // 最后一行停止后即出获奖弹层
                        if (listIndex === 2) {
                            (function () {
                                var fn = null;
                                // 出轮盘奖
                                if (_this8.configRoom.isTurntable) {
                                    fn = _this8.turntableGo.bind(_this8, _prize);

                                    // 直接出中奖弹层
                                } else if (_prize > 0) {
                                    fn = function fn() {

                                        // 中奖结果
                                        _this8.showAwardResult(_prize);
                                    };
                                }
                                // else if (_prize <= 0) {
                                //     // 救济金调用
                                //     // app.jiujijin();

                                // }

                                // 转盘或者出中奖弹层
                                if (!!fn) {
                                    callback = Laya.Handler.create(_this8, function () {

                                        // 开始先光圈高亮
                                        _this8.sameRoundShow();

                                        Laya.timer.once(2000, _this8, function () {
                                            // 停止光圈
                                            _this8.stopAllSameRound();

                                            fn();
                                        });
                                    });
                                } else {
                                    callback = Laya.Handler.create(_this8, function () {
                                        return _this8.loopLaba();
                                    });
                                }
                            })();
                        }

                        // 还未停止继续拉吧ing
                    } else {
                        // laba继续
                        callback = Laya.Handler.create(this, this.labaToTop, [listIndex]);
                    }

                    // 为下一次运动做准备
                    if (labaItem.y === 0) {
                        return this.labaToTop(listIndex);
                    } else {
                        return Laya.Tween.to(labaItem, { y: 0 }, 400, Laya.Ease.linearIn, callback);
                    }
                }

                // 拉吧回到初始位置且看起来不动

            }, {
                key: "labaToTop",
                value: function labaToTop(listIndex) {
                    var labaItem = this.laba_item_list[listIndex];
                    var randomNumber = app.utils.randomNumber;
                    var _num = this.configLaba.fruitTypeNum - 1;

                    var child0 = labaItem.getChildAt(0);
                    var child1 = labaItem.getChildAt(1);
                    var child2 = labaItem.getChildAt(2);
                    // 下边三只同步到下边三只
                    labaItem.getChildAt(3).index = child0.index;
                    labaItem.getChildAt(4).index = child1.index;
                    labaItem.getChildAt(5).index = child2.index;

                    labaItem.y = this.config.labaInitPostionY;

                    child0.index = randomNumber(_num);
                    child1.index = randomNumber(_num);
                    child2.index = randomNumber(_num);

                    // 拉吧停止的计数（不用定时器去停止laba，因为不准, 数字25是测出来的）
                    if (this.configLaba.labaStopCount++ >= 25) {
                        this.configLaba.labaStopCount = 0;
                        this.labaStop();
                    }

                    // 再次运动
                    return this.labaAnimate(listIndex);
                }

                // 异步优化

            }, {
                key: "myPromise",
                value: function myPromise(context, delay) {
                    return new Promise(function (resolve, reject) {
                        Laya.timer.once(delay, context, resolve);
                    });
                }

                // 轮盘中奖启动(中奖金额)

            }, {
                key: "turntableGo",
                value: function turntableGo(data) {
                    var _this9 = this;

                    var _prize = data || this.configRoom.prize;
                    var _turntable = this.dom_turntable;
                    var _rotation = this.configTurntable[_prize] + 3 * 360;

                    // 晚些显示转盘
                    _turntable.rotation = 0;

                    return this.myPromise(this, 0).then(function () {
                        _this9.turntable_box.visible = true;

                        return _this9.myPromise(_this9, 500);
                    }).then(function () {
                        Laya.Tween.to(_turntable, { rotation: _rotation }, 1000, Laya.Event.circOut);

                        return _this9.myPromise(_this9, 1000);
                    }).then(function () {
                        _this9.table_DB.once(Laya.Event.STOPPED, _this9, function () {

                            _this9.turntable_box.visible = false;

                            // 中奖结果
                            _this9.showAwardResult(_prize);
                        });

                        // 骨骼动画
                        _this9.table_DB.play('turntable', false);
                    });
                }

                // 中奖结果

            }, {
                key: "showAwardResult",
                value: function showAwardResult(_prize) {
                    var type = '';

                    if (_prize >= this.configRoom.secondPrize) {
                        type = 'superAwardPopShow';

                        // 播放音效
                        Laya.timer.once(350, this, function () {
                            app.audio.play('bigWin');
                        });
                    } else {
                        type = 'smallAwardPopShow';

                        // 播放音效
                        app.audio.play('smallWin');
                    }

                    // 更新余额
                    app.header_ui_box.updateUserCoin(_prize);

                    app.observer.publish(type, _prize);

                    // 再次读取拉吧数据启动laba
                    return this.loopLaba();
                }

                /**
                 * { function_description }
                 * { function_description }
                 * { function_description }
                 * 拉吧高亮的线条
                 * 
                 * 拉吧相同水果的光圈
                 * 
                 */

                // 判断第几行中奖 中奖图标的位置

            }, {
                key: "getSameRoundPosition",
                value: function getSameRoundPosition(luckyNum, icon) {
                    var whichIndex = 0;
                    var luckyArr = [];
                    var obj = {};
                    // 第几排中奖
                    this.configRoom.luckyNum = Number(luckyNum);
                    whichIndex = '102'.charAt(Number(luckyNum) - 1);

                    var targetArr = icon[whichIndex];
                    // 找出相同项，并把对应的索引扔进数组
                    targetArr.forEach(function (item, index, array) {
                        if (typeof obj[item] === 'undefined') {
                            obj[item] = index;
                        } else {
                            luckyArr.push(obj[item]);
                            if (luckyArr[luckyArr.length - 1] === luckyArr[luckyArr.length - 2]) {
                                luckyArr.pop();
                            }
                            luckyArr.push(index);
                            obj[item] = index;
                        }
                    });

                    // 有可能没有相同水果但是有单独的星星
                    if (luckyArr.length === 0) {
                        targetArr.forEach(function (item, index) {
                            if (item === 8) {
                                luckyArr.push(index);
                            }
                        });
                    }

                    // 赋值
                    this.configRoom.luckyArr = luckyArr;
                }

                // 光圈显示(number, arr)

            }, {
                key: "sameRoundShow",
                value: function sameRoundShow() {
                    var which = Number(this.configRoom.luckyNum);
                    var luckyArr = this.configRoom.luckyArr;
                    which = '102'.charAt(which - 1);

                    this.sameRoundList.forEach(function (item, index) {
                        if (luckyArr.indexOf(index) > -1) {
                            item.visible = true;
                            item.play('start', true);
                        } else {
                            item.visible = false;
                        }
                    });

                    // 光圈的box显示
                    this.sameRound_box.visible = true;
                    this.sameRound_box.y = this.configLaba.sameRoundBoxYarr[which];
                }

                // 停止所有的动态光圈

            }, {
                key: "stopAllSameRound",
                value: function stopAllSameRound() {
                    // 全部停止
                    this.sameRoundList.forEach(function (item, index) {
                        item.stop();
                    });

                    // box隐藏
                    this.sameRound_box.visible = false;
                }

                // 循环背景灯闪动

            }, {
                key: "ballLightLoop",
                value: function ballLightLoop() {
                    Laya.timer.loop(30 * 1000, this, this.ballLightPlay);
                }
            }, {
                key: "ballLightClear",
                value: function ballLightClear() {
                    Laya.timer.clear(this, this.ballLightPlay);
                }

                // 背景灯30秒闪动

            }, {
                key: "ballLightPlay",
                value: function ballLightPlay() {
                    this.ballLight_DB.play('bglight', false);
                }
            }, {
                key: "onExit",
                value: function onExit() {
                    app.utils.log(this.sceneName + " exit");

                    // 解除页面切换侦听事件
                    window.$(document).off('visibilitychange');

                    // 清除laba循环
                    this.clearLoopLaba();

                    // 清除背景灯循环闪动
                    this.ballLightClear();

                    // 停止自动投币
                    this.dom_auto.index = 0;

                    // 离开房间把laba停止
                    this.labaStop();

                    // 取消所有注册
                    this.unRegisterAction();

                    // 退出场景前把头部移除
                    app.header_ui_box.removeHeader();

                    // 离开物理引擎世界
                    app.matterCenter.leaveMatter();

                    //发布退出事件
                    app.observer.publish(this.sceneName + "_exit");

                    this.clear();
                }

                //自定义方法，场景退出的时候是销毁还是removeself请自行抉择

            }, {
                key: "clear",
                value: function clear() {
                    this.destroy(true);
                }
            }]);

            return RoomScene;
        }(roomUI);

        app.RoomScene = RoomScene;
    })();
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 收获弹层
{
            (function () {
                        var app = window.app;
                        var shouhuoPopUI = window.shouhuoPopUI;

                        var ShouhuoPopUIDialog = function (_shouhuoPopUI) {
                                    _inherits(ShouhuoPopUIDialog, _shouhuoPopUI);

                                    function ShouhuoPopUIDialog() {
                                                _classCallCheck(this, ShouhuoPopUIDialog);

                                                var _this = _possibleConstructorReturn(this, (ShouhuoPopUIDialog.__proto__ || Object.getPrototypeOf(ShouhuoPopUIDialog)).call(this));

                                                _this.init();

                                                return _this;
                                    }

                                    _createClass(ShouhuoPopUIDialog, [{
                                                key: "init",
                                                value: function init() {

                                                            this.initConfig();
                                                            this.initDom();

                                                            this.initEvent();

                                                            // 注册
                                                            this.registerAction();
                                                }
                                    }, {
                                                key: "initConfig",
                                                value: function initConfig() {
                                                            this.config = {};
                                                }
                                    }, {
                                                key: "initDom",
                                                value: function initDom() {}
                                    }, {
                                                key: "initEvent",
                                                value: function initEvent() {
                                                            var _this2 = this;

                                                            // 确认收获
                                                            this.btn_sure.on(Laya.Event.CLICK, this, function () {
                                                                        // 确认收获带出
                                                                        app.messageCenter.emit('transferToPlatform');

                                                                        _this2.close();
                                                            });

                                                            // 查看别处游戏币
                                                            this.btn_other.on(Laya.Event.CLICK, this, function () {
                                                                        app.utils.checkOtherYxb();

                                                                        _this2.close();
                                                            });
                                                }

                                                // 注册

                                    }, {
                                                key: "registerAction",
                                                value: function registerAction() {
                                                            // 注册信息处理（渲染信息）
                                                            app.messageCenter.registerAction("accoutDetail", this.renderContentList.bind(this));

                                                            // 弹层挂载（出现弹层）  两者分开的原因：弹层优先出来，以防用户多次点击
                                                            app.observer.subscribe("shouhuoPopShow", this.myShow.bind(this));
                                                }

                                                // 渲染内容

                                    }, {
                                                key: "renderContentList",
                                                value: function renderContentList(data) {
                                                            var _this3 = this;

                                                            if (data.code !== 0 || data.userAccount.code !== 'success') {
                                                                        return;
                                                            }

                                                            var msg = data.userAccount.msg;

                                                            // 1: '欢乐值', 2: '积分', 3: '欢乐豆', 4: '彩金', 5:'钻石', 9: '彩分', 10: '健康金', 11: '平安流量'
                                                            var typeObj = { 1: 'hlz', 2: 'jf', 3: 'hld', 4: 'cj', 5: 'zs', 9: 'cf', 10: 'jkj', 11: 'liuliang' };

                                                            msg.details.forEach(function (item) {
                                                                        _this3['dom_' + typeObj[item.accountType]].text = item.amountAvailable;

                                                                        // 平安流量
                                                                        if (Number(item.accountType) === 11 && Number(item.amountAvailable) > 0) {
                                                                                    _this3['dom_' + typeObj[11]].parent.visible = true;
                                                                        }
                                                            });
                                                }
                                    }, {
                                                key: "myShow",
                                                value: function myShow(txt) {
                                                            // 游戏币
                                                            this.dom_yxb.text = txt;

                                                            this.popup();
                                                }
                                    }]);

                                    return ShouhuoPopUIDialog;
                        }(shouhuoPopUI);

                        app.ShouhuoPopUIDialog = ShouhuoPopUIDialog;
            })();
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

{
    (function () {
        var app = window.app;
        var spinUI = window.spinUI;

        var SpinViewUI = function (_spinUI) {
            _inherits(SpinViewUI, _spinUI);

            function SpinViewUI() {
                _classCallCheck(this, SpinViewUI);

                var _this = _possibleConstructorReturn(this, (SpinViewUI.__proto__ || Object.getPrototypeOf(SpinViewUI)).call(this));

                _this.sceneName = 'spinScene';
                _this.init();

                return _this;
            }

            _createClass(SpinViewUI, [{
                key: 'init',
                value: function init() {

                    this.initConfig();
                    this.initDom();

                    // 上下灯亮起的循环执行的函数（不能共用）
                    this.initHandleLightManage();

                    // 注册
                    this.registerAction();

                    // 重置
                    this.reset();
                }

                // 注册

            }, {
                key: 'registerAction',
                value: function registerAction() {
                    var _this2 = this;

                    // 进入房间
                    app.messageCenter.registerAction("spin", function (data) {

                        if (data.code !== 0) {

                            app.utils.warn(data.msg);
                            return;
                        }

                        // spin灯
                        _this2.renderLight(data.spin);

                        // 拉吧存储灯
                        data.pull.lamp && app.room_ui_box.renderSaveLight(data.pull.lamp);

                        // laba遮罩状态存储
                        app.room_ui_box.saveLabaCoverStatus(data.pull.status);
                    });

                    // 挂载spin上下的动效处理
                    app.observer.subscribe('spinPlay', this.spinPlay.bind(this));
                }
            }, {
                key: 'initConfig',
                value: function initConfig() {
                    this.config = {
                        MIN_X: 60,
                        MAX_X: 570
                    };

                    // 上一排灯的配置
                    this.upConfig = {
                        isGoing: false, //是否处于动画状态
                        index: 0, //当前需要处理灯的索引
                        changeState: 1, //当前灯需要更改到的状态（如1：该灯应该亮）
                        leftToRight: true, //从左到右
                        count: 0 //计数器（）
                    };

                    // 下一排灯的配置
                    this.downConfig = {
                        isGoing: false, //是否处于动画状态
                        index: 0,
                        changeState: 1,
                        leftToRight: true,
                        count: 0
                    };
                }
            }, {
                key: 'initDom',
                value: function initDom() {
                    // 初始x坐标
                    var currentScene = app.sceneManager.currentScene;

                    this.x = currentScene.width / 2 - this.width / 2;
                    this.y = currentScene.spin_box.y;
                    this.zOrder = 1;

                    // 上排小灯
                    this.up_list = this.up.findType('Clip');
                    // 下排小灯
                    this.down_list = this.down.findType('Clip');
                }

                // spin字闪动

            }, {
                key: 'spinPlay',
                value: function spinPlay() {
                    this.dom_spin.autoPlay = true;

                    Laya.timer.clear(this, this.spinStop);
                    Laya.timer.once(2200, this, this.spinStop);
                }

                // spin停止闪动

            }, {
                key: 'spinStop',
                value: function spinStop() {
                    this.dom_spin.autoPlay = false;
                    this.dom_spin.index = 0;
                }

                // 渲染灯（上面几盏， 下面几盏）

            }, {
                key: 'renderLight',
                value: function renderLight(spin) {

                    if ('lampUp' in spin) {
                        this._renderLight('up', Number(spin.lampUp));
                    }

                    if ('lampDown' in spin) {
                        this._renderLight('down', Number(spin.lampDown));
                    }
                }

                // 渲染

            }, {
                key: '_renderLight',
                value: function _renderLight(which, lamp) {
                    // 动画激活中 && 灯不为0
                    if (this[which + 'Config'].isGoing && lamp !== 0) {

                        return;
                    }

                    // 动画未激活中，则渲染几盏灯
                    if (!this[which + 'Config'].isGoing) {
                        this[which + '_list'].forEach(function (item, index) {
                            item.index = index < lamp ? 1 : 0;
                        });
                    }

                    // 满格动效
                    if (lamp === 12) {
                        this.animationMoving(which);
                    } else if (lamp === 0) {
                        this.clearAnimation(which, lamp);
                    }
                }

                // 重置

            }, {
                key: 'reset',
                value: function reset() {
                    // 灭掉所有灯
                    [].concat(_toConsumableArray(this.up_list), _toConsumableArray(this.down_list)).forEach(function (item, index) {
                        item.index = 0;
                    });
                }

                // 一排灯跑动动画

            }, {
                key: 'animationMoving',
                value: function animationMoving(which) {
                    this[which + 'Config'].isGoing = true;
                    Laya.timer.loop(36, this, this[which + 'handleLightManage']);
                }

                // 清除动画

            }, {
                key: 'clearAnimation',
                value: function clearAnimation(which, lamp) {
                    Laya.timer.clear(this, this[which + 'handleLightManage']);
                    this[which + '_list'].forEach(function (item, index) {
                        item.index = index < lamp ? 1 : 0;
                    });

                    var _config = this[which + 'Config'];
                    // 重置
                    _config.isGoing = false;
                    _config.index = 0;
                    _config.changeState = 1;
                    _config.leftToRight = true;
                    _config.count = 0;
                }

                // 初始化上下灯的控制

            }, {
                key: 'initHandleLightManage',
                value: function initHandleLightManage() {

                    // 上排灯需要循环执行
                    this.uphandleLightManage = this._handleLightManage.bind(this, 'up');

                    // 下排灯需要循环执行
                    this.downhandleLightManage = this._handleLightManage.bind(this, 'down');
                }

                // 控制下一个灯的处理

            }, {
                key: '_handleLightManage',
                value: function _handleLightManage(which) {
                    var _list = this[which + '_list'];
                    var _config = this[which + 'Config'];
                    if (_config.count++ >= 24) {
                        _config.leftToRight = !_config.leftToRight;
                        _config.count = 1;
                        _config.index = _config.leftToRight ? 0 : 11;
                        _config.changeState = 1;
                    }

                    // 是 从左到右
                    if (_config.leftToRight) {
                        if (_config.index === 12) {
                            _config.changeState = 0;
                            _config.index = 0;
                        }

                        _list[_config.index++].index = _config.changeState;

                        // 否 从右到左
                    } else {
                        if (_config.index === -1) {
                            _config.changeState = 0;
                            _config.index = 11;
                        }

                        _list[_config.index--].index = _config.changeState;
                    }
                }

                // 重新载入

            }, {
                key: 'reLoad',
                value: function reLoad(spin) {

                    this.reset();

                    // 渲染spin灯
                    this.renderLight(spin);

                    this.show();
                }
            }, {
                key: 'show',
                value: function show() {
                    this.visible = true;
                }
            }, {
                key: 'hide',
                value: function hide() {
                    this.visible = false;
                }
            }]);

            return SpinViewUI;
        }(spinUI);

        app.SpinViewUI = SpinViewUI;
    })();
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 盈利榜弹框
{
    (function () {
        var app = window.app;
        var yinglibangPopUI = window.yinglibangPopUI;

        var YinglibangPopUIView = function (_yinglibangPopUI) {
            _inherits(YinglibangPopUIView, _yinglibangPopUI);

            function YinglibangPopUIView() {
                _classCallCheck(this, YinglibangPopUIView);

                var _this = _possibleConstructorReturn(this, (YinglibangPopUIView.__proto__ || Object.getPrototypeOf(YinglibangPopUIView)).call(this));

                _this.init();

                return _this;
            }

            _createClass(YinglibangPopUIView, [{
                key: 'init',
                value: function init() {
                    this.initConfig();
                    this.initDom();

                    this.initEvent();

                    // 注册
                    this.registerAction();
                }
            }, {
                key: 'initConfig',
                value: function initConfig() {
                    this.config = {};
                }
            }, {
                key: 'initDom',
                value: function initDom() {

                    // 盈利榜奖励总金额
                    this.dom_coin_num = this.ylb_top_box.getChildByName('coin_num');
                    // 倒计时
                    this.dom_time = this.ylb_top_box.getChildByName('time');

                    // 万
                    this.dom_text_wan = this.ylb_bottom_box.getChildByName('text_wan');
                    this.dom_text_wan.visible = false;

                    // 金额
                    this.dom_ylb_cond = this.ylb_bottom_box.getChildByName('ylb_cond');

                    // 历史记录
                    this.dom_btn_history = this.ylb_bottom_box.getChildByName('btn_history');

                    // 登录按钮
                    this.btn_login = this.unLogin_box.getChildByName('btn_login');
                }
            }, {
                key: 'initEvent',
                value: function initEvent() {
                    // 历史记录
                    this.dom_btn_history.on(Laya.Event.CLICK, this, function () {
                        app.messageCenter.emit("awardList");

                        app.observer.publish('historyPopShow');
                    });

                    // 登录按钮
                    this.btn_login.on(Laya.Event.CLICK, this, function () {
                        app.utils.gotoLogin();
                    });
                }

                // 注册

            }, {
                key: 'registerAction',
                value: function registerAction() {
                    var _this2 = this;

                    // 盈利榜
                    app.messageCenter.registerAction("profixRank", function (data) {
                        // 渲染自己
                        _this2.renderMyself(data.myRank);

                        _this2.renderContentList(data.rank);

                        // 分奖倒计时
                        _this2.renderTime(data.datetime);

                        // 累计赢取多少万
                        _this2.renderCond(data.cond);

                        // 盈利榜金额
                        if (app.gameConfig.pool) {
                            _this2.dom_coin_num.text = app.gameConfig.pool;
                        }
                    });

                    // 挂载弹层
                    app.observer.subscribe('yinglibangPopShow', this.myShow.bind(this));
                }

                // 渲染内容

            }, {
                key: 'renderContentList',
                value: function renderContentList(rank) {
                    var array = [];
                    rank.forEach(function (item) {
                        var _name = app.utils.getActiveStr(item.name, 12);
                        array.push({
                            bg: 0,
                            rank: item.rank,
                            crown: item.rank - 1,
                            name: _name,
                            coin: item.award,
                            award: '\u798F\u888B' + item.percent + '%\u5956\u52B1'
                        });
                    });

                    this.ylb_content_list.array = array;
                }

                // 渲染自己

            }, {
                key: 'renderMyself',
                value: function renderMyself(data) {
                    // 未登录
                    if (Object.keys(data).length === 0) {
                        this.unLogin_box.visible = true;

                        return;
                    }
                    // 已登录
                    this.my_self_box.visible = true;
                    var _name = app.utils.getActiveStr(data.name, 12);
                    var _str = data.rank;
                    if (String(_str).indexOf('>') > -1) {
                        _str = data.rank.slice(1);
                    }

                    this.my_self_box.dataSource = {
                        bg: 1,
                        rank: data.rank,
                        crown: Number(_str) - 1,
                        name: _name,
                        coin: data.award,
                        award: Number(data.percent) === 0 ? '' : '\u798F\u888B' + data.percent + '%\u5956\u52B1'
                    };
                }

                // 分奖倒计时

            }, {
                key: 'renderTime',
                value: function renderTime(datetime) {
                    this.dom_time.text = datetime;
                }

                // 累计赢取多少万

            }, {
                key: 'renderCond',
                value: function renderCond(cond) {
                    var _cond = this.dom_ylb_cond;
                    _cond.text = cond;
                    this.dom_text_wan.x = _cond.x + _cond.displayWidth;
                }
            }, {
                key: 'myShow',
                value: function myShow() {
                    this.popup();
                }
            }]);

            return YinglibangPopUIView;
        }(yinglibangPopUI);

        app.YinglibangPopUIView = YinglibangPopUIView;
    })();
}
'use strict';

{
    window.app.audio = {
        loaded: false,
        audioSources: {
            btn_niu: 'btn_niu', //按钮
            hall_bgm: 'hall_bgm', //大厅背景乐
            smallWin: 'smallWin', //大厅背景乐
            bigWin: 'bigWin' //大厅背景乐

        },

        init: function init() {
            var self = this;
            if (!self.loaded) {
                self.loaded = true;
                Laya.SoundManager.setMusicVolume(1);
                Laya.SoundManager.setSoundVolume(3);
            }
            if (self.getCookie("fruit_sound") === 'false') {

                self.setMuted();
            } else {
                self.setMutedNot();
            }

            // 初始化加载资源（除背景乐）
            this.initResource();
        },
        play: function play(id) {
            var self = this;
            var src = 'audio/' + self.audioSources[id] + '.mp3?v=' + window.staticVertion;
            if (id == 'hall_bgm' || id == 'room_bgm') {

                Laya.SoundManager.playMusic(src, 0);
            } else {

                Laya.SoundManager.playSound(src, 1);
            }
        },


        // 初始化加载资源（除背景乐）
        initResource: function initResource() {

            this.play('bigWin');
            this.play('smallWin');

            Laya.SoundManager.stopAllSound(); //停止所有音效（除了背景音乐）
        },


        //设置静音
        setMuted: function setMuted() {
            var self = this;
            Laya.SoundManager.muted = true;
        },


        //设置非静音(如果需要在播放背景音乐，需要重新play('gameBg')方法);
        setMutedNot: function setMutedNot() {
            var self = this;
            Laya.SoundManager.muted = false;
            self.play('hall_bgm');
        },


        //停止背景音乐播放
        stopBgMusic: function stopBgMusic() {
            var self = this;
            Laya.SoundManager.stopMusic(); //停止背景音乐
        },


        //设置cookie
        setCookie: function setCookie(cname, cvalue) {
            var exdays = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 7;

            var self = this;
            var d = new Date();
            d.setTime(d.getTime() + exdays * 24 * 60 * 1000);
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires;
        },


        //获取cookie
        getCookie: function getCookie(cname) {
            var self = this;
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0).trim() === '') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) !== -1) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        clearCookie: function clearCookie(name) {
            var self = this;
            self.setCookie(name, "", -1);
        }
    };
}
"use strict";

//配置
{
    var config = window.app.config = {};

    config.debug = true; //是否开启debug模式

    config.gameWidth = 750; //游戏宽度
    config.gameHeight = 1334; //游戏高度
    config.screenMode = Laya.Stage.SCREEN_VERTICAL; //游戏垂直竖屏
    config.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT; //屏幕适配
    config.alignH = Laya.Stage.ALIGN_CENTER; //水平居中
    config.alignV = Laya.Stage.ALIGN_MIDDLE; //垂直居中

    //资源
    config.RESOURCE = {};
    // 游戏版本号
    config.GAME_VERSION = {};
}
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//io
{
    (function () {
        var app = window.app;
        var CryptoJS = window.CryptoJS;
        var Base64 = window.Base64;

        var messageCenterModule = function () {
            function messageCenterModule(options) {
                _classCallCheck(this, messageCenterModule);

                this.ajaxTimeout = 30000;
                this.socket = null;
                this.ajaxUrl = {};
                this.cmd = {};
                this.registedAction = {};
                this.websocketurl = options.websocketurl || "";
                //启用primus的话，默认开启加解密
                this.lib = options.lib || "socketio";
                this.publicKey = options.publicKey || "";
                this._commKey = "";
                this.encryptedString = "";
                this.token = options.token;
                this.jwtToken = "";
                this.init();
            }

            _createClass(messageCenterModule, [{
                key: "init",
                value: function init() {
                    this.cmd = {
                        userAccount: 'userAccount', //用户余额及游戏币
                        roomList: 'roomList', //房间列表
                        enterRoom: 'enterRoom', //请求进入房间
                        betPrizeList: 'betPrizeList', //我的战绩
                        onlineUserNum: 'onlineUserNum', //在线人数
                        gameNotice: 'gameNotice', //公告
                        exitRoom: 'exitRoom', //退出房间
                        myTableList: 'myTableList', //查看本桌玩家数据
                        profixRank: 'profixRank', //盈利榜
                        awardList: 'awardList', //历史福袋分奖
                        accoutDetail: 'accoutDetail', //查询账号资金详情
                        transferToPlatform: 'transferToPlatform', //确认收获带出

                        awardTips: 'awardTips', // 进入游戏福袋分奖提示
                        advertise: 'advertise', // 弹窗广告

                        bet: 'bet', //投金币
                        spin: 'spin', //金币进过spin
                        pullStart: 'pullStart', //拉吧
                        palletStart: 'palletStart', //转盘
                        buff: 'buff', //buff
                        getProfitPool: 'getProfitPool' //盈利榜奖池接口
                    };
                }

                //注册

            }, {
                key: "registerAction",
                value: function registerAction(key, callback) {
                    if (typeof callback === "function") {
                        this.registedAction[key] = callback;
                    }

                    return this;
                }

                //取消注册

            }, {
                key: "unRegisterAction",
                value: function unRegisterAction(key) {
                    if (typeof this.registedAction[key] !== "undefined") {
                        delete this.registedAction[key];
                    }

                    return this;
                }

                //触发

            }, {
                key: "dispatchAction",
                value: function dispatchAction(key, data, type) {
                    var callback = this.registedAction[key];
                    if (typeof callback === "function") {
                        if (type === "ajax") {
                            callback(data);
                        } else {
                            callback(data.res || data.rep);
                        }
                    } else {
                        //未注册过的行为静默失败，给出提示
                        app.utils.log("未注册行为：" + key, data);
                    }
                }

                //获取数据

            }, {
                key: "emit",
                value: function emit(key, type, params, callback) {
                    // 说明未登录
                    if (typeof type === 'function') {
                        callback = type;
                    }
                    if ((typeof type === "undefined" ? "undefined" : _typeof(type)) === 'object') {
                        params = type;
                    }
                    //注册
                    this.registerAction(key, callback);

                    if (type === "ajax") {
                        this.emitAjax(key, params);
                    } else {
                        this.emitSocket({
                            cmd: key,
                            params: params
                        });
                    }
                }

                //获取ajax数据

            }, {
                key: "emitAjax",
                value: function emitAjax(key, params) {
                    var self = this;
                    var _url = this.ajaxurl[key];

                    window.$.ajax({
                        // type: type,
                        url: _url,
                        data: params,
                        timeout: this.ajaxTimeout,
                        success: function success(response) {
                            app.utils.log(_url, response);

                            response = response || {};
                            self.dispatchAction(key, response, "ajax");
                        },
                        error: function error() {
                            //异常处理
                        }
                    });
                }

                //获取socket数据

            }, {
                key: "emitSocket",
                value: function emitSocket(data) {
                    if (this.socket) {
                        if (this.lib === "socketio") {
                            console.info("推送：", data.cmd, data);
                            this.socket.emit("router", Base64.encode(JSON.stringify(data)));
                        } else {
                            //为data增加token
                            if (data.params) {
                                data.params.jwt = this.jwtToken;
                            } else {
                                data.params = { jwt: this.jwtToken };
                            }

                            data.status = { time: new Date().getTime() };

                            app.utils.info("推送：", JSON.stringify(data));

                            //加密
                            var encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(this._commKey), {
                                mode: CryptoJS.mode.ECB,
                                padding: CryptoJS.pad.Pkcs7
                            });

                            //发送加密数据
                            this.socket.write(encryptData.toString());
                        }
                    }
                }

                //生成commkey

            }, {
                key: "generateCommKey",
                value: function generateCommKey() {
                    try {
                        //默认32位编码
                        this._commKey = Date.parse(new Date()).toString() + Date.parse(new Date()).toString() + Date.parse(new Date()).toString().substring(0, 6);
                    } catch (e) {
                        app.utils.log("初始化commKey失败", e);
                    }

                    return this;
                }

                //生成encryptedString

            }, {
                key: "generateEncryptedString",
                value: function generateEncryptedString() {
                    try {
                        var params = "jwt=" + this.token + "&commKey=" + this._commKey;
                        var jsencrypt = new window.JSEncrypt();
                        jsencrypt.setPublicKey(this.publicKey);
                        this.encryptedString = jsencrypt.encrypt(params);
                    } catch (e) {
                        app.utils.log("初始化encryptedString失败", e);
                    }

                    return this;
                }

                //连接socket

            }, {
                key: "connectSocket",
                value: function connectSocket() {
                    var self = this;

                    if (this.lib === "primus") {
                        this.generateCommKey();
                        this.generateEncryptedString();
                    }

                    try {
                        if (this.lib === "socketio") {
                            this.socket = window.io(this.websocketurl, { "force new connection": true });
                        } else {
                            this.socket = window.Primus.connect(this.websocketurl);
                        }
                    } catch (e) {
                        app.utils.log(e);
                        return;
                    }

                    if (this.lib === "socketio") {
                        this.socket.on('router', function (data) {
                            var _data = JSON.parse(Base64.decode(data));
                            console.info("接收数据：", _data.cmd, _data);

                            this.dispatchAction(_data.cmd, _data, "socket");
                        }.bind(this));

                        this.socket.on('connect', function () {
                            app.utils.log("连接已建立");
                        });

                        this.socket.on('disconnect', function (data) {
                            app.utils.log("连接已断开");
                        });

                        this.socket.on('close', function (data) {
                            app.utils.log("连接已关闭");
                        });

                        this.socket.on('connect_error', function (error) {
                            app.utils.log("连接发生错误");
                        });

                        this.socket.on('reconnecting', function () {
                            app.utils.log("重连中");
                        });
                    } else {
                        this.socket.on('outgoing::url', function (url) {
                            url.query = 'login=' + self.encryptedString;
                            console.info("outgoing::url", url.query);
                        });

                        this.socket.on('open', function () {
                            app.utils.log("连接成功");

                            //  未登录
                            if (!app.utils.checkLoginStatus()) {
                                // 未登录情况下无法知道sokcet已连接
                                app.hall_ui_box.dispatchAction();

                                // 头部触发一下是否有盈利榜
                                app.messageCenter.emit("getProfitPool");
                            }
                        });

                        this.socket.on('data', function (data) {
                            //解密
                            var decryptstr = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(this._commKey), {
                                mode: CryptoJS.mode.ECB,
                                padding: CryptoJS.pad.Pkcs7
                            });

                            var dataString = decryptstr.toString(CryptoJS.enc.Utf8);
                            var parsedData = JSON.parse(dataString);

                            // 临时 将公告打印不展开
                            if (parsedData.cmd !== "gameNotice") {
                                app.utils.info("接收数据：===>", parsedData.cmd, JSON.stringify(parsedData, null, 4));
                            } else {
                                // 公告不展开
                                app.utils.info("接收数据：===>", parsedData.cmd, parsedData);
                            }

                            //更新jwt token
                            if (parsedData.cmd === "conn::init") {
                                this.jwtToken = parsedData.res;
                            }

                            this.dispatchAction(parsedData.cmd, parsedData, "socket");
                        }.bind(this));

                        this.socket.on('error', function (data) {
                            app.utils.log("连接出错");
                        });

                        this.socket.on('reconnect', function () {
                            // 重连刷新
                            self.disconnectSocket();
                            window.location.reload();
                            app.utils.log("重连中");
                        });

                        this.socket.on('end', function () {
                            app.utils.log("连接已关闭");
                        });
                    }
                }

                //断开socket

            }, {
                key: "disconnectSocket",
                value: function disconnectSocket() {
                    if (this.socket) {
                        if (this.lib === "socketio") {
                            this.socket.close();
                            this.socket.removeAllListeners();
                        } else {
                            this.socket.end();
                        }

                        this.socket = null;
                    }
                }
            }]);

            return messageCenterModule;
        }();

        window.messageCenterModule = messageCenterModule;
    })();
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//观察者
{
    var observerModule = function () {
        function observerModule(options) {
            _classCallCheck(this, observerModule);

            //订阅者的引用
            this.subscribers = {};
        }

        //发布


        _createClass(observerModule, [{
            key: "publish",
            value: function publish(type) {
                var _subscribers = this.subscribers[type];
                if (_subscribers) {
                    for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        data[_key - 1] = arguments[_key];
                    }

                    for (var i = 0; i < _subscribers.length; i++) {
                        _subscribers[i].apply(_subscribers, data);
                    }
                }

                return this;
            }

            //订阅

        }, {
            key: "subscribe",
            value: function subscribe(type, handler) {
                if (this.subscribers[type] === undefined) {
                    this.subscribers[type] = [];
                }

                this.subscribers[type].push(handler);

                return this;
            }

            //取消订阅
            //如果传递了handler，只取消该订阅，否则取消全部订阅

        }, {
            key: "unsubscribe",
            value: function unsubscribe(type, handler) {
                var _subscribers = this.subscribers[type];
                if (_subscribers) {
                    if (handler) {
                        for (var i = _subscribers.length - 1; i >= 0; i--) {
                            if (handler === _subscribers[i]) {
                                _subscribers.splice(i, 1);
                                break;
                            }
                        }
                    } else {
                        for (var _i = _subscribers.length - 1; _i >= 0; _i--) {
                            _subscribers.splice(_i, 1);
                        }
                    }
                }

                return this;
            }
        }]);

        return observerModule;
    }();

    window.observerModule = observerModule;
}
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

{
    (function () {
        var app = window.app;
        var stageWidth = app.config.gameWidth;
        var stageHeight = app.config.gameHeight;

        var Matter = window.Matter;
        var LayaRender = window.LayaRender;

        var mouseConstraint = void 0; //matter鼠标限制实例
        var engine = void 0; //matter引擎实例
        var layaRenderEx = null; //layarender实例

        var Body = Matter.Body;
        var Composite = Matter.Composite;
        var Composites = Matter.Composites;
        var Bodies = Matter.Bodies;

        // matter引擎
        app.matterCenter = {
            // 刚体收集器
            childBodies: {
                allCoinArr: [], //所有金币（50个）
                allSkillArr: [], //所有buff传感器刚体集合(共8个轮流使用)
                walls: null, //静态墙
                nails: null, //钉子
                swings: null, //摆针
                compound: null, //spin一对小耳朵
                spin: null, //spin
                ground: null, //地面
                skills: [], //技能
                carEars: [], //车小耳朵（把手）
                car: null, //小车身
                fans: null //风扇
            },
            debugCoinCount: 0,
            coinCount: 0, //金币计数器
            // 经过spin的刚体id集合
            spinPassArr: [],
            // 击中风扇集合
            fanPassArr: [],
            config: {
                coninTypeArr: [10, 50, 100, 1000], //金币基数种类
                conin_r: 23, //金币半径
                wall_ply: 32, //墙体厚度
                hasInited: false, //是否初始化过
                render: { visible: false } //渲染方式便于debug
                // render: { fillStyle: '#edc51e', strokeStyle: '#b5a91c' }

            },
            // 技能对照
            skillsInfo: {
                stop_spin: false, //spin暂停器
                count_spin: 0, //spin暂停器计数
                stop_car: false, //小车暂停器
                count_car: 0 //小车暂停器计数
            },

            init: function init(data) {
                // 是否初始化过
                if (this.config.hasInited) {
                    // 再次进入引擎世界
                    this.enterMatterAgain(data);
                    return;
                }

                this.config.hasInited = true;
                this.createMatterView();
                this.addSpinView(data);
                this.getUIPos();
                this.initMatter();

                // 向引擎世界添加刚体
                this.initWorld();

                // 刚体开始移动
                this.bodyMoving();

                // 碰撞检测
                this.collisionTest();

                // 注册
                this.registerAction();

                // 首先执行一下鼠标生效
                // this.onResize();
                // Laya.stage.on('resize', this, this.onResize);
            },


            // 创建matter的容器
            createMatterView: function createMatterView() {
                this.matterView_ui_box = new window.matterViewUI();
                this.matterView_ui_box.x = app.gameConfig.viewLeft;
                this.matterView_ui_box.zOrder = 1;
                Laya.stage.addChild(this.matterView_ui_box);
            },


            // 添加spin
            addSpinView: function addSpinView(data) {
                // 添加spin元素(注意层级)
                this.spin_ui_box = new app.SpinViewUI();

                this.matterView_ui_box.addChild(this.spin_ui_box);
                this.spin_ui_box.renderLight(data);
            },
            initMatter: function initMatter() {
                // 初始化物理引擎
                engine = Matter.Engine.create({
                    enableSleeping: true
                });
                // 引擎运行
                Matter.Engine.run(engine);

                layaRenderEx = LayaRender.create({
                    engine: engine,
                    container: this.matterView_ui_box,
                    width: stageWidth,
                    height: stageHeight
                });

                // laya渲染器运行
                LayaRender.run(layaRenderEx);

                /*mouseConstraint = Matter.MouseConstraint.create(engine, {
                    constraint: {
                        angularStiffness: 0.1,
                        stiffness: 2
                    },
                    element: Laya.Render.canvas
                })
                  // 是否添加鼠标控制
                Matter.World.add(engine.world, mouseConstraint);
                layaRenderEx.mouse = mouseConstraint.mouse;*/
                engine.world.gravity.scale = 0.001;
            },

            // 刚体的集中创建
            initWorld: function initWorld() {
                var arr = [];
                var _walls = this.addWalls();
                this.childBodies.ground = _walls[0];
                this.childBodies.walls = _walls.slice(1);
                arr.push.apply(arr, _toConsumableArray(_walls));

                var _nails = this.childBodies.nails = this.addNails();
                arr.push.apply(arr, _toConsumableArray(_nails));

                var _swings = this.childBodies.swings = this.addSwings();
                arr.push.apply(arr, _toConsumableArray(_swings));

                var _spin = this.addSpin();
                this.childBodies.compound = _spin[0];
                this.childBodies.spin = _spin[1];
                arr.push.apply(arr, _toConsumableArray(_spin));

                var _cars = this.addCar();
                this.childBodies.carEars = _cars.slice(0, 2);
                this.childBodies.car = _cars[2];
                arr.push.apply(arr, _toConsumableArray(_cars));

                // 添加风扇
                var _fan = this.childBodies.fans = this.addFan();
                arr.push.apply(arr, _toConsumableArray(_fan));

                // 创建金币刚体对象池
                this.createCoinBody();

                // 创建buff刚体对象池
                this.createSkillBody();

                // 引擎世界添加刚体
                Matter.World.add(engine.world, arr);
            },


            // 扩展配置对象，方便读取
            getUIPos: function getUIPos() {
                // 浅拷贝配置数据
                Object.assign(this.config, app.room_ui_box.config, this.spin_ui_box.config);

                var _config = this.config;

                // 摆针旋转的中心
                _config.swingRotatePos = _config.swingsInitPos.map(function (item) {
                    return {
                        x: item.x + 10,
                        y: item.y + 10
                    };
                });

                // console.log(this.config);
            },


            // 添加静态墙
            addWalls: function addWalls() {
                // 墙体厚度
                var ply = this.config.wall_ply;
                var r = this.config.conin_r;
                var groundY = stageHeight;
                groundY = stageHeight + ply / 2 + r * 2;
                var swingPos = this.config.swingsInitPos[0];
                var render = this.config.render;

                // 地面墙
                var ground = Bodies.rectangle(stageWidth / 2, groundY, stageWidth, ply, {
                    // 是否静止
                    isStatic: true,
                    // 渲染形式
                    render: render
                });

                // 摆针上边的隐藏墙
                var wallSwing = Bodies.rectangle(swingPos.x + 10, swingPos.y - 80, 10, 200, {
                    isStatic: true,
                    render: render
                });

                // 墙（左）
                var wallLeft = Bodies.rectangle(ply / 2, stageHeight / 2, ply, stageHeight, {
                    isStatic: true,
                    render: render
                });

                // 墙（右）
                var wallRight = Bodies.rectangle(stageWidth - ply / 2, stageHeight / 2, ply, stageHeight, {
                    isStatic: true,
                    render: render
                });

                // 管道上边的坡
                var wallPoTop = Bodies.rectangle(503, 400, 200, 10, {
                    isStatic: true,
                    angle: Math.PI * -0.12,
                    render: render
                });

                // 管道下边的坡
                var wallPoBottom = Bodies.rectangle(503, 470, 170, 10, {
                    isStatic: true,
                    angle: Math.PI * -0.12,
                    render: render
                });

                var _result = [ground, wallLeft, wallRight, wallPoTop, wallPoBottom, wallSwing];
                _result.forEach(function (item) {
                    if (item.id !== ground.id) {
                        // nail 便于后面碰撞检测忽略它，提高性能
                        item.myName = 'nail';
                    }
                });
                return _result;
            },


            // 添加摆针
            addSwings: function addSwings() {
                var swingsInitPos = this.config.swingsInitPos;
                var swingRotatePos = this.config.swingRotatePos;
                var swingSize = this.config.swingSize;
                var _result = [];
                var options = {
                    isStatic: true,
                    render: {
                        sprite: {
                            texture: 'room/swing.png',
                            xOffset: swingSize.w / 2,
                            yOffset: swingSize.h / 2
                        }
                    }
                };
                swingsInitPos.forEach(function (item, index) {
                    var _sw = Composites.stack(item.x, item.y, 1, 1, 0, 0, function (x, y) {
                        var _b = Bodies.rectangle(x, y, swingSize.w, swingSize.h, options);
                        _b.myName = 'nail';
                        return _b;
                    });
                    _result.push(_sw);

                    // 自定义角度（便于后面读取）
                    _sw.myAngle = 2.4;
                    _sw.myName = 'nail';
                    Composite.rotate(_sw, 2.4, swingRotatePos[index]);
                });

                return _result;
            },


            // 添加风扇
            addFan: function addFan() {
                var _this = this;

                var fansInitPos = this.config.fansInitPos;
                var size = { w: 100, h: 18 };
                var result = [];
                var options = {
                    texture: 'room/fan.png',
                    xOffset: size.w / 2,
                    yOffset: size.h / 2
                };

                fansInitPos.forEach(function (item) {
                    var part1 = Bodies.rectangle(item.x, item.y, size.w, size.h, {
                        density: 0.005,
                        render: {
                            sprite: options
                        }
                    });

                    var constraint = Matter.Constraint.create({
                        pointA: item,
                        bodyB: part1,
                        stiffness: 1,
                        render: _this.config.render
                    });

                    part1.myName = 'fan';
                    result.push(part1, constraint);
                });

                return result;
            },


            // 添加钉子
            addNails: function addNails() {
                var nailPosList = this.config.nailPosList;
                var _result = [];
                var r = 10;
                // 不通过Laya来映射刚体（减少sprit数量提高性能）
                var options = {
                    frictionStatic: 0.15,
                    isStatic: true,
                    render: this.config.render
                };
                nailPosList.forEach(function (item) {
                    var _nail = Bodies.circle(item.x + r, item.y + r, r, options);
                    _nail.myName = 'nail';
                    _result.push(_nail);
                });

                return _result;
            },


            // 创建金币刚体
            createCoinBody: function createCoinBody() {
                // 金币半径
                var r = this.config.conin_r;
                var arr = this.childBodies.allCoinArr;
                // 金币(默认皮肤)
                var coinOptions = {
                    density: 0.01,
                    friction: 0.05,
                    frictionAir: 0.005, //空气摩擦力
                    frictionStatic: 0.08, //静止摩擦力
                    render: {
                        sprite: {
                            texture: 'room/coin_10.png',
                            xOffset: r,
                            yOffset: r
                        }
                    }
                };

                // 一共创建50个金币
                for (var i = 0; i < 50; i++) {
                    var coin = Matter.Bodies.circle(0, -100, r, coinOptions);
                    // 添加自定义名字
                    coin.myName = 'coin';

                    // 扔进金币数组
                    arr.push(coin);

                    // 硬性给金币刚体添加layaSprit
                    LayaRender.body(layaRenderEx, coin);
                }
            },


            // 添加金币
            addCoin: function addCoin(orderId) {
                var initPos = this.config.coinInitPos;
                var _baseCoin = Number(app.gameConfig.baseCoin);
                var coin = this.childBodies.allCoinArr.shift();

                if (typeof coin === 'undefined') {

                    console.warn('金币刚体对象池空了');
                    return;
                }

                if (this.config.coninTypeArr.indexOf(_baseCoin) === -1) {
                    _baseCoin = '10';
                    console.warn('测试同学请注意：目前金币样式只有10,50,100,1000。默认为10');
                }

                this.coinCount++;
                this.debugCoinCount++;

                // 唯一标识符(后台校验)
                coin.orderId = orderId;

                // 给金币换成该场次的金币皮肤
                coin.layaSprite.loadImage('room/coin_' + _baseCoin + '.png');

                // 初始作用力
                // 这种方式力道不兼容（原因不详）
                // Matter.Body.applyForce(coin, coin.position, { x: _x, y: _y });

                var _x = -Math.round(Math.random() * 15 + 10);
                var _y = Math.round(Math.random() * 10 + 10);

                // 初始坐标
                Matter.Body.setPosition(coin, { x: initPos.x, y: initPos.y });

                // 向物理世界添加金币
                Matter.World.add(engine.world, coin);

                // 初始速度
                Matter.Body.setVelocity(coin, { x: _x, y: _y });
            },


            // 金币销毁的自转动画
            animateCoin: function animateCoin(position) {
                var mFactory = new Laya.Templet();
                var num = Number(app.gameConfig.baseCoin);
                if (this.config.coninTypeArr.indexOf(num) === -1) {
                    num = 10;
                    console.warn('测试同学请注意：目前金币样式只有10,50,100,1000。默认为10');
                }
                mFactory.parseData(Laya.loader.getRes('animate/' + num + '.png'), Laya.loader.getRes('animate/' + num + '.sk'), 24);
                var maidenArmat = mFactory.buildArmature();
                var type = '';

                switch (num) {
                    case 10:
                        type = 'shi';
                        break;
                    case 50:
                        type = 'wushi';
                        break;
                    case 100:
                        type = 'yibai';
                        break;
                    case 1000:
                        type = 'qian';
                        break;
                }
                maidenArmat.pos(position.x, position.y);
                this.matterView_ui_box.addChild(maidenArmat);

                maidenArmat.play(type, true);

                // 1秒后销毁
                Laya.timer.once(1000, this, function () {
                    maidenArmat.destroy(true);
                });
            },


            // buff骨骼动画
            animateBuff: function animateBuff(type, position) {
                var mFactory = new Laya.Templet();
                mFactory.parseData(Laya.loader.getRes("animate/buff.png"), Laya.loader.getRes("animate/buff.sk"), 24);
                var maidenArmat = mFactory.buildArmature();

                // 刚体创建时往下挪了10，所以要往上回来10
                maidenArmat.pos(position.x, position.y - 10);
                this.matterView_ui_box.addChild(maidenArmat);

                // 播放一遍后销毁 (会报错，原因不详)
                // maidenArmat.once(Laya.Event.STOPPED, this, () => {
                //     maidenArmat.destroy(true);
                //     console.log('end');
                // })

                maidenArmat.play(type, false);
                // 2秒后销毁
                Laya.timer.once(2000, this, function () {
                    maidenArmat.destroy(true);
                });
            },


            // 添加spin和一对耳朵（组合器）
            addSpin: function addSpin() {
                var MIN_X = this.config.MIN_X;
                var _y = this.config.STATIC_Y;
                var r = 10;
                var disX = 80;
                var render = this.config.render;
                var spinLeft = Bodies.circle(MIN_X + 15, _y + 10, r, { render: render });
                var spinRight = Bodies.circle(MIN_X + disX + 15, _y + 10, r, { render: render });
                spinLeft.myName = 'nail';
                spinRight.myName = 'nail';
                // 组合器
                var compoundEar = Body.create({
                    parts: [spinLeft, spinRight],
                    isStatic: true,
                    render: render
                });
                compoundEar.myName = 'nail';

                var spin = Bodies.rectangle(MIN_X + 15 + disX / 2, _y + 20, disX - 50, 10, {
                    isSensor: true,
                    isStatic: true,
                    render: render
                });

                spin.myName = 'spin';

                return [compoundEar, spin];
            },


            // 创建技能传感器刚体对象池
            createSkillBody: function createSkillBody() {
                var arr = this.childBodies.allSkillArr;
                var r = 6;

                // 不通过Laya来映射刚体（减少sprit数量提高性能）
                var options = {
                    isSensor: true,
                    isStatic: true,
                    render: this.config.render
                };

                for (var i = 0; i < 10; i++) {
                    var bodySkill = Bodies.circle(0, 0, r, options);
                    bodySkill.myName = 'buff';
                    arr.push(bodySkill);
                }
            },


            // 添加技能传感器
            addSkills: function addSkills(targetIndex, buff) {
                var skillPosList = this.config.skillPosList;
                var position = skillPosList[targetIndex];
                var bodySkill = this.childBodies.allSkillArr.shift();

                if (typeof bodySkill === 'undefined') {

                    console.warn('buff刚体对象池空了');
                    return;
                }

                // buff的类型和id
                bodySkill.buff_id = buff.id;
                bodySkill.targetIndex = targetIndex;
                // 技能类型
                bodySkill.buffType = buff.type;
                this.childBodies.skills.push(bodySkill);

                // 初始坐标
                Matter.Body.setPosition(bodySkill, { x: position.x, y: position.y + 10 });

                Matter.World.add(engine.world, bodySkill);

                // 10秒后销毁buff
                Laya.timer.once(10 * 1000, this, this.destroyBuff.bind(this, { id: buff.id }));
            },


            // 添加小车
            addCar: function addCar() {
                var _carEarPosList = this.config.carEarPosList;
                var _carPos = this.config.carPos;
                var _bodyCarEars = [];
                var _result = [];
                var options = {
                    isStatic: true,
                    render: this.config.render
                };
                // 把手刚体
                _carEarPosList.forEach(function (item, index) {
                    var _x = index === 0 ? item.x - 5 : item.x + 5;
                    var _ear = Bodies.rectangle(_x, item.y, 30, 5, options);
                    _ear.myName = index + '把手';
                    _bodyCarEars.push(_ear);
                });

                // 车体刚体
                var bodyCar = Bodies.rectangle(_carPos.x, _carPos.y - 10, 20, 5, options);
                bodyCar.myName = '2小车';
                _result = [].concat(_bodyCarEars, [bodyCar]);

                return _result;
            },


            // 开始移动
            bodyMoving: function bodyMoving() {
                var _this2 = this;

                var swingRotatePos = this.config.swingRotatePos;
                var _bodys = this.childBodies;
                var compound = _bodys.compound;
                var spin = _bodys.spin;
                var swings = _bodys.swings;
                var carEars = _bodys.carEars;
                var car = _bodys.car;
                var spinSprite = this.spin_ui_box;

                var compoundY = compound.position.y;
                var spinY = spin.position.y;
                var carEarY = carEars[0].position.y;
                var carY = car.position.y;

                var centerX = 750 / 2;
                var counter = 0;
                var counter2 = 0;
                var speed = 0.01;
                var px = 0;
                var px2 = 0;

                // 运动部分
                Matter.Events.on(engine, 'beforeUpdate', function () {
                    // spin随时暂停
                    if (!_this2.skillsInfo.stop_spin) {
                        counter += 0.01;
                    }
                    // 小车随时暂停
                    if (!_this2.skillsInfo.stop_car) {
                        counter2 += 0.0102;
                    }

                    // 摆针运动
                    swings.forEach(function (item, index) {
                        // 2.4, 0.8 由测试得到
                        if (item.myAngle >= 2.4) {
                            speed = -Math.abs(speed);
                        } else if (item.myAngle <= 0.8) {
                            speed = Math.abs(speed);
                        }

                        Composite.rotate(item, speed, swingRotatePos[index]);
                        item.myAngle = item.myAngle + speed;
                    });

                    // spin运动
                    {
                        // Math.sin(counter)值得范围 -1~1;
                        px = centerX + 230 * Math.sin(counter);
                        // body is static so must manually update velocity for friction to work
                        // Body.setVelocity(compound, { x: px - compound.position.x, y: 0 });
                        Body.setPosition(compound, { x: px, y: compoundY });

                        // Body.setVelocity(spin, { x: _x, y: 0 });
                        Body.setPosition(spin, { x: px, y: spinY });

                        // 让laya的元素spin保持同步
                        spinSprite.x = px - 56;
                    }

                    // 小车运动
                    {
                        px2 = centerX + 280 * Math.sin(counter2);
                        Body.setPosition(carEars[0], { x: px2 - 60, y: carEarY });
                        Body.setPosition(carEars[1], { x: px2 + 60, y: carEarY });
                        Body.setPosition(car, { x: px2, y: carY });

                        // 没有销毁
                        var car_box = app.room_ui_box.car_box;
                        if (!car_box.destroyed) {
                            if (!car_box.visible) {
                                car_box.visible = true;
                            }
                            car_box.x = px2;
                        }
                    }
                });
            },


            /*碰撞检测
             *bodyA是先生成的刚体, bodyB后生成的刚体；
             *新版本layarender不需要手动销毁sprite
             *
             */
            collisionTest: function collisionTest() {
                var _this3 = this;

                var _bodies = this.childBodies;
                var groundId = _bodies.ground.id;
                var spinId = _bodies.spin.id;
                var skillBodies = _bodies.skills;
                var fans0Id = _bodies.fans[0].id;
                var fans1Id = _bodies.fans[2].id;
                var carEars_car = [].concat(_toConsumableArray(_bodies.carEars), [_bodies.car]);

                Matter.Events.on(engine, 'collisionStart', function (event) {
                    event.pairs.forEach(function (item) {
                        var bodyA = item.bodyA;
                        var bodyAid = bodyA.id;
                        var bodyB = item.bodyB;
                        var bodyBid = bodyB.id;

                        // 如果是钉子就不处理
                        if (bodyA.myName === 'nail') {
                            return;
                        }
                        // 金币与金币碰撞
                        if (bodyA.myName === 'coin' && bodyB.myName === 'coin') {
                            return;
                        }

                        // console.log('bodyA:_' + bodyA.myName,'          ', 'bodyB:_' + bodyB.myName)

                        // 击中风扇
                        if (bodyAid === fans0Id || bodyAid === fans1Id) {

                            _this3.enterFan(bodyBid);
                        }

                        // 经过spin区
                        if (bodyAid === spinId) {
                            _this3.enterToSpin(bodyB);
                        }

                        // 接触地面销毁(接触地面后就结束了)
                        if (bodyAid === groundId) {
                            _this3.enterToOut(bodyB);

                            return;
                        }

                        // 经过buff
                        _this3.enterToBuff(bodyA, skillBodies, bodyB);

                        // 经过托盘小车
                        _this3.enterToCar(bodyAid, carEars_car, bodyB);
                    });
                });
            },


            // 击中风扇
            enterFan: function enterFan(bodyBid) {
                if (this.fanPassArr.indexOf(bodyBid) === -1) {
                    this.fanPassArr.push(bodyBid);

                    // 发送(击中风扇)
                    app.messageCenter.emit("palletTrigger");
                }
            },


            // 处理经过spin
            enterToSpin: function enterToSpin(bodyB) {
                // 已经击中spin
                bodyB.isHitSpin = true;

                // 发送spin
                app.messageCenter.emit('spin', { orderId: bodyB.orderId, isHit: true });

                // spin闪烁
                app.observer.publish('spinPlay');
            },


            // 处理经过地面销毁
            enterToOut: function enterToOut(bodyB) {
                // console.log(item.bodyB.position);
                // console.log(item.bodyB.id);

                // 未击中过spin
                if (!bodyB.isHitSpin) {
                    app.messageCenter.emit('spin', { orderId: bodyB.orderId, isHit: false });
                }

                // 未击中托盘
                app.messageCenter.emit('pallet', { orderId: bodyB.orderId, isHit: false, area: '' });

                var _index = this.fanPassArr.indexOf(bodyB.id);
                if (_index > -1) {
                    // 销毁
                    this.fanPassArr.splice(_index, 1);
                }

                // 刚体销毁的同时(laya创建的sprite也同时销毁了)
                Matter.World.remove(engine.world, bodyB, true);

                // 重新丢回金币刚体池 
                this.childBodies.allCoinArr.push(bodyB);

                // 救济金
                app.jiujijin();

                // 金币计数
                this.coinCount--;
            },


            // 经过buff区(特殊情况：bodyA有可能是coin， bodyB有可能是buff)
            enterToBuff: function enterToBuff(bodyA, skillBodies, bodyB) {

                // 经过技能
                for (var i = 0, len = skillBodies.length; i < len; i++) {
                    var item = skillBodies[i];
                    if (bodyA.id === item.id || bodyB.id === item.id) {

                        // 发送击中buff命令(buffde id, 金币 id)
                        app.messageCenter.emit('buff', { buffId: item.buff_id, orderId: bodyB.orderId || bodyA.orderId });

                        // 销毁lab buff元素以及刚体数组更新
                        this.destroyBuff({ id: item.buff_id });

                        // buff骨骼动画
                        if (bodyA.buffType) {
                            this.animateBuff(bodyA.buffType, bodyA.position);
                        } else if (bodyB.buffType) {
                            this.animateBuff(bodyB.buffType, bodyB.position);
                        }

                        break;
                    }
                }
            },


            // buff技能销毁
            destroyBuff: function destroyBuff(data) {
                var _skills = this.childBodies.skills;
                var _index = -1;

                // 刚体销毁 & laya元素消除
                for (var i = 0, len = _skills.length; i < len; i++) {
                    if (_skills[i].buff_id === data.id) {
                        // 销毁刚体
                        Matter.World.remove(engine.world, _skills[i], true);
                        _index = i;

                        break;
                    }
                }

                // 在数组中干掉
                if (_index > -1) {
                    var spliceItem = _skills.splice(_index, 1)[0];

                    // 丢回技能刚体对象池
                    this.childBodies.allSkillArr.push(spliceItem);

                    // 更新
                    this.updateLayaBuff(_skills);
                }
            },


            // 同步laya buff元素
            updateLayaBuff: function updateLayaBuff(_skills) {
                var _room = app.room_ui_box;
                var _skillExist = [0, 1, 2, 3, 4, 5, 6, 7];

                _skills.forEach(function (item) {
                    var _index = item.targetIndex;
                    _skillExist.splice(_skillExist.indexOf(_index), 1);
                    _room.skill_list[_index].visible = true;
                });

                _skillExist.forEach(function (item) {
                    _room.skill_list[item].visible = false;
                });

                // 可提供存放buff的位置索引
                _room.configRoom.skillExist = _skillExist;
            },


            // 经过托盘小车
            enterToCar: function enterToCar(bodyAid, carEars_car, bodyB) {
                // 经过小车
                for (var i = 0, len = carEars_car.length; i < len; i++) {
                    if (bodyAid === carEars_car[i].id) {
                        var _area = carEars_car[i].myName.indexOf('小车') > -1 ? 'chief' : 'vice';

                        // 索引
                        app.room_ui_box.cartoonFn(carEars_car[i].myName.slice(0, 1), bodyB.position);
                        // 击中托盘
                        app.messageCenter.emit('pallet', { orderId: bodyB.orderId, isHit: true, area: _area });

                        // 未击中过spin
                        if (!bodyB.isHitSpin) {
                            app.messageCenter.emit('spin', { orderId: bodyB.orderId, isHit: false });
                        }

                        var _index = this.fanPassArr.indexOf(bodyB.id);
                        if (_index > -1) {
                            // 销毁
                            this.fanPassArr.splice(_index, 1);
                        }

                        // 销毁金币
                        Matter.World.remove(engine.world, bodyB, true);

                        // 重新丢回金币刚体池 
                        this.childBodies.allCoinArr.push(bodyB);

                        // 救济金
                        app.jiujijin();

                        // 击中把手
                        if (_area === 'vice') {
                            this.animateCoin(bodyB.position);
                        }

                        // 金币计数
                        this.coinCount--;

                        break;
                    }
                }
            },


            // buff技能托盘暂停
            buffSkillStop: function buffSkillStop(type, time) {
                var info = this.skillsInfo;

                // 小车停止
                if (type === 'pallet') {
                    info.count_car += Number(time);
                    info.stop_car = true;

                    Laya.timer.clear(this, this.carDecreaseCount);
                    Laya.timer.loop(1000, this, this.carDecreaseCount);

                    // spin停止
                } else {
                    info.count_spin += Number(time);
                    info.stop_spin = true;

                    Laya.timer.clear(this, this.spinDecreaseCount);
                    Laya.timer.loop(1000, this, this.spinDecreaseCount);
                }
            },


            // car计数递减
            carDecreaseCount: function carDecreaseCount() {
                var info = this.skillsInfo;

                if (info.count_car > 0) {
                    info.count_car--;
                } else {
                    Laya.timer.clear(this, this.carDecreaseCount);
                    info.stop_car = false;
                    info.count_car = 0;
                }
            },


            // spin计数递减
            spinDecreaseCount: function spinDecreaseCount() {
                var info = this.skillsInfo;

                if (info.count_spin > 0) {
                    info.count_spin--;
                } else {
                    Laya.timer.clear(this, this.spinDecreaseCount);
                    info.stop_spin = false;
                    info.count_spin = 0;
                }
            },


            // 注册
            registerAction: function registerAction() {
                // 投金币
                app.messageCenter.registerAction("bet", this.betHandle.bind(this));

                //buff销毁
                app.messageCenter.registerAction("buffEnd", this.destroyBuff.bind(this));
            },


            // 取消注册
            unRegisterAction: function unRegisterAction() {

                app.messageCenter.unRegisterAction("bet").unRegisterAction("buffEnd");
            },


            // 投币处理
            betHandle: function betHandle(data) {
                var code = Number(data.code);

                // 投币成功
                if (code === 0) {
                    // 更新余额
                    app.header_ui_box.updateUserCoin(app.gameConfig.baseCoin * -1);
                    // 添加金币刚体
                    this.addCoin(data.orderId);

                    return;
                }

                // 投币失败的情况 
                // 余额不足
                if (code === 10) {
                    app.observer.publish('quit_rechargePopShow', 'less', true, '余额不足，请先充值');

                    // 房间关闭 || 已不在桌子中
                } else if (code === 27 || code === 16) {
                    // 错误信息
                    app.observer.publish('commonPopShow', data.msg, true, function () {
                        // 加载弹层显示
                        app.observer.publish('fruitLoadingShow');
                        // 退出房间
                        app.messageCenter.emit('exitRoom');
                    });
                }

                // 如果正在自动玩则停止
                app.room_ui_box.willStopAutoPlay();
            },


            // 离开matter
            leaveMatter: function leaveMatter() {
                var _this4 = this;

                var _world = engine.world;
                var _move = Matter.World.remove;
                var _set = Matter.Sleeping.set;
                var bodyArr = Matter.Composite.allBodies(_world);

                // 销毁所有的金币 & 剩下的所有刚体睡眠
                bodyArr.forEach(function (item) {
                    if (item.myName === 'coin') {
                        _move(_world, item, true);

                        // 重新丢回金币刚体池
                        _this4.childBodies.allCoinArr.push(item);
                    } else {
                        _set(item, true);
                    }
                });

                // 取消注册
                this.unRegisterAction();

                this.matterView_ui_box.visible = false;

                document.onkeyup = null;
            },


            // 再次进入matter
            enterMatterAgain: function enterMatterAgain(data) {
                var _set = Matter.Sleeping.set;

                // 唤醒刚体
                Matter.Composite.allBodies(engine.world).forEach(function (item) {
                    _set(item, false);
                });

                // 命令消息注册一下
                this.registerAction();

                // 重新载入
                this.spin_ui_box.reLoad(data);

                this.matterView_ui_box.visible = true;
            }

            /*onResize() {
                Matter.Mouse.setScale(mouseConstraint.mouse, {
                    x: 1 / (Laya.stage.clientScaleX * Laya.stage._canvasTransform.a),
                    y: 1 / (Laya.stage.clientScaleY * Laya.stage._canvasTransform.d)
                })
            }*/

        };
    })();
}
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

{
	(function () {
		var app = window.app;
		var RESOURCE = app.config.RESOURCE;

		// 字体资源
		var fonts = [{ url: "font/bang_font.fnt", name: 'bang_font', type: Laya.Loader.XML }, { url: "font/bei_font.fnt", name: 'bei_font', type: Laya.Loader.XML }, { url: "font/car_font.fnt", name: 'car_font', type: Laya.Loader.XML }, { url: "font/ylb_font.fnt", name: 'ylb_font', type: Laya.Loader.XML }, { url: "font/award_font.fnt", name: 'award_font', type: Laya.Loader.XML }, { url: "font/room_font.fnt", name: 'room_font', type: Laya.Loader.XML }, { url: "font/xizhong_font.fnt", name: 'xizhong_font', type: Laya.Loader.XML }, { url: "font/star_font.fnt", name: 'star_font', type: Laya.Loader.XML }];

		// loading需要的资源优先加载
		var loadingRes = [
		// load
		{ url: "load/loading_bg.jpg", type: Laya.Loader.IMAGE }, { url: "load/logo.png", type: Laya.Loader.IMAGE }, { url: "load/strip.png", type: Laya.Loader.IMAGE }, { url: "load/strip_bg.png", type: Laya.Loader.IMAGE }, { url: "load/fangcenmi.png", type: Laya.Loader.IMAGE }, { url: 'res/atlas/load.json', type: Laya.Loader.ATLAS }];

		// 不打包图片资源
		var unPackRes = [
		// hall
		{ url: "hall/hallBg.jpg", type: Laya.Loader.IMAGE },

		// room
		{ url: "room/ganzi.png", type: Laya.Loader.IMAGE }, { url: "room/laba_bg.png", type: Laya.Loader.IMAGE }, { url: "room/room_bg.jpg", type: Laya.Loader.IMAGE }, { url: "room/clip_fruit.png", type: Laya.Loader.IMAGE },

		// pop
		{ url: "pop/bg.png", type: Laya.Loader.IMAGE }, { url: "pop/btn_tab.png", type: Laya.Loader.IMAGE }, { url: "pop/new.png", type: Laya.Loader.IMAGE }, { url: "pop/head.png", type: Laya.Loader.IMAGE }, { url: "pop/ylb/ylb_middle.png", type: Laya.Loader.IMAGE }, { url: "pop/help/first.png", type: Laya.Loader.IMAGE }, { url: "pop/help/second.png", type: Laya.Loader.IMAGE }];

		// 打包的json文件
		var packRes = [{ url: 'res/atlas/comp.json', type: Laya.Loader.ATLAS }, { url: 'res/atlas/hall.json', type: Laya.Loader.ATLAS }, { url: 'res/atlas/room.json', type: Laya.Loader.ATLAS }, { url: 'res/atlas/pop/ylb.json', type: Laya.Loader.ATLAS }, { url: 'res/atlas/pop/help.json', type: Laya.Loader.ATLAS }, { url: 'res/atlas/pop.json', type: Laya.Loader.ATLAS },

		// 骨骼动画的资源
		// 金币
		{ url: 'animate/10.png', type: Laya.Loader.IMAGE }, { url: 'animate/10.sk', type: Laya.Loader.BUFFER }, { url: 'animate/50.png', type: Laya.Loader.IMAGE }, { url: 'animate/50.sk', type: Laya.Loader.BUFFER }, { url: 'animate/100.png', type: Laya.Loader.IMAGE }, { url: 'animate/100.sk', type: Laya.Loader.BUFFER }, { url: 'animate/1000.png', type: Laya.Loader.IMAGE }, { url: 'animate/1000.sk', type: Laya.Loader.BUFFER },

		//房间列表
		{ url: 'animate/new.png', type: Laya.Loader.IMAGE }, { url: 'animate/new.sk', type: Laya.Loader.BUFFER }, { url: 'animate/low.png', type: Laya.Loader.IMAGE }, { url: 'animate/low.sk', type: Laya.Loader.BUFFER }, { url: 'animate/middle.png', type: Laya.Loader.IMAGE }, { url: 'animate/middle.sk', type: Laya.Loader.BUFFER }, { url: 'animate/high.png', type: Laya.Loader.IMAGE }, { url: 'animate/high.sk', type: Laya.Loader.BUFFER },

		// 房间动画
		{ url: 'animate/bglight.png', type: Laya.Loader.IMAGE }, { url: 'animate/bglight.sk', type: Laya.Loader.BUFFER }, { url: 'animate/star.png', type: Laya.Loader.IMAGE }, { url: 'animate/star.sk', type: Laya.Loader.BUFFER }, { url: 'animate/smallAward.png', type: Laya.Loader.IMAGE }, { url: 'animate/smallAward.sk', type: Laya.Loader.BUFFER }, { url: 'animate/fudai.png', type: Laya.Loader.IMAGE }, { url: 'animate/fudai.sk', type: Laya.Loader.BUFFER }, { url: 'animate/superAward.png', type: Laya.Loader.IMAGE }, { url: 'animate/superAward.sk', type: Laya.Loader.BUFFER }, { url: 'animate/truntable.png', type: Laya.Loader.IMAGE }, { url: 'animate/truntable.sk', type: Laya.Loader.BUFFER }, { url: 'animate/kuang.png', type: Laya.Loader.IMAGE }, { url: 'animate/kuang.sk', type: Laya.Loader.BUFFER }, { url: 'animate/buff.png', type: Laya.Loader.IMAGE }, { url: 'animate/buff.sk', type: Laya.Loader.BUFFER }];

		// 字体
		RESOURCE.fonts = fonts;
		// 加载页资源
		RESOURCE.loadingRes = loadingRes;
		// 非加载页资源
		RESOURCE.disLoadingRes = [].concat(unPackRes, packRes);

		// 总的资源
		RESOURCE.images = [].concat(unPackRes, packRes, loadingRes);

		// 添加版本号
		var _GAME_RES = [].concat(_toConsumableArray(RESOURCE.fonts), _toConsumableArray(RESOURCE.images));
		var GAME_VERSION = app.config.GAME_VERSION;

		var staticVertion = window.staticVertion || Date.now();
		var loop = function loop(arr) {
			if ((typeof arr === "undefined" ? "undefined" : _typeof(arr)) !== 'object') {
				return;
			}
			arr.forEach(function (item, i) {
				var newUrl = void 0;
				var jsonIndex = void 0;
				var fntIndex = void 0;
				if (typeof item.url === 'string') {
					// 若加载后缀有 .json 和.fnt 的, 则连它们对应的 png一起添加了
					jsonIndex = item.url.indexOf('.json');
					fntIndex = item.url.indexOf('.fnt');
					if (jsonIndex > -1) {
						newUrl = item.url.substr(0, jsonIndex) + '.png';
					} else if (fntIndex > -1) {
						newUrl = item.url.substr(0, fntIndex) + '.png';
					}

					if (newUrl) {
						GAME_VERSION[newUrl] = staticVertion;
					}

					GAME_VERSION[item.url] = staticVertion;
				} else {
					loop(item);
				}
			});
		};

		loop(_GAME_RES);
	})();
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//场景
{
    var sceneManagerModule = function () {
        function sceneManagerModule(options) {
            _classCallCheck(this, sceneManagerModule);

            this.currentScene = null;
            this.nextScene = null;

            this.init();
        }

        _createClass(sceneManagerModule, [{
            key: "init",
            value: function init() {}

            //加载场景

        }, {
            key: "loadScene",
            value: function loadScene(sceneobj) {
                this.nextScene = sceneobj || this.nextScene;

                //如果当前场景不为空，那么调用当前场景的退出功能，并且订阅当前场景退出事件，以便触发loadNextScene加载下一个需要加载的场景
                if (this.currentScene != null) {
                    app.observer.subscribe(this.currentScene.sceneName + "_exit", this.loadNextScene.bind(this));
                    this.currentScene.onExit();
                } else {
                    this.currentScene = this.nextScene;
                    //添加到stage上
                    Laya.stage.addChild(this.currentScene);
                    //发布场景加载事件
                    app.observer.publish(this.currentScene.sceneName + "_enter");
                }
            }

            //加载下一个场景

        }, {
            key: "loadNextScene",
            value: function loadNextScene() {
                //取消订阅
                app.observer.unsubscribe(this.currentScene.sceneName + "_exit");
                //将当前场景置空
                this.currentScene = null;
                this.loadScene();
            }
        }]);

        return sceneManagerModule;
    }();

    window.sceneManagerModule = sceneManagerModule;
}
'use strict';

//工具
{
    (function () {
        var app = window.app;
        var GM = window.GM;
        var utils = app.utils = {};

        utils.log = function () {
            var _window$console;

            app.config.debug && window.console && (_window$console = window.console).log.apply(_window$console, arguments);
        };
        utils.warn = function () {
            var _window$console2;

            app.config.debug && window.console && (_window$console2 = window.console).warn.apply(_window$console2, arguments);
        };
        utils.info = function () {
            var _window$console3;

            app.config.debug && window.console && (_window$console3 = window.console).info.apply(_window$console3, arguments);
        };

        // 是否打印信息
        utils.initDebug = function (key, val) {
            var arr = location.search.slice(1).split('&');
            var debugFE = false;
            arr.forEach(function (item) {
                var list = item.split('=');
                if (list[0] === key && list[1] === val) {
                    debugFE = true;
                }
            });

            return debugFE;
        };

        //生产0-num范围的随机数
        utils.randomNumber = function (num) {
            return Math.round(Math.random() * num);
        };

        //登录
        utils.gotoLogin = function () {
            location.href = GM.userLoginUrl;
        };

        //验证登录
        utils.checkLoginStatus = function () {
            return window.token && GM.userLogged;
        };

        utils.willGotoLogin = function () {
            if (!utils.checkLoginStatus()) {
                utils.gotoLogin();
            }
        };

        // 查看别处游戏币
        utils.checkOtherYxb = function () {
            if (window.GM && GM.whereYxb) {
                GM.whereYxb();
            }
        };

        //获取字符串长度，支持中文
        utils.getStringLength = function () {
            var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            return ("" + str.replace(/[^\x00-\xff]/gi, "ox")).length;
        };

        // 截取字符长度限制以内的字符
        utils.getActiveStr = function () {
            var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var total = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;

            var realLength = 0;
            str = String(str);
            var len = str.length;
            var result = '';
            if (len === 0) {
                return '';
            }
            for (var i = 0; i < len; i++) {
                if (str.charCodeAt(i) > 128) {
                    realLength += 2;
                } else {
                    realLength += 1;
                }
                if (realLength > total) {
                    return result + '...';
                }
                result = result + str.charAt(i);
            }
            return result;
        };
    })();
};
'use strict';

//游戏基础模块
{
            (function () {
                        var app = window.app;
                        //场景管理器
                        app.sceneManager = null;
                        //顶层观察者，各模块间可以通过观察者来通信
                        app.observer = null;
                        //io模块
                        app.messageCenter = null;
                        // gameConfig关于游戏部分配置
                        app.gameConfig = {
                                    viewLeft: 0, //视图位移
                                    ylbStatus: 1, //盈利榜是否关闭
                                    timeLimit: false, //时间限制
                                    baseCoin: 10 //游戏币基数
                        };

                        // app添加方法
                        Object.assign(app, {
                                    init: function init() {

                                                this.initDebug();

                                                this.layaInit();
                                                // 模块初始化
                                                this.moduleInit();
                                                // loading页优先
                                                this.loadingPageShow();

                                                // 5s内执行一次
                                                this.jiujijin = window._.throttle(this._jiujijin, 5000);
                                    },
                                    initDebug: function initDebug() {
                                                this.config.debug = app.utils.initDebug('debugFE', '1');
                                    },
                                    layaInit: function layaInit() {
                                                var config = this.config;
                                                //配置宽高以及启用webgl(如果浏览器支持的话)
                                                Laya.init(config.gameWidth, config.gameHeight, Laya.WebGL);
                                                //是否开启FPS监听
                                                if (app.utils.initDebug('stat', '1')) {
                                                            Laya.Stat.show(0, 0);
                                                }
                                                //设置适配模式
                                                Laya.stage.scaleMode = config.scaleMode;
                                                //设置横屏
                                                Laya.stage.screenMode = config.screenMode;
                                                //设置水平对齐
                                                Laya.stage.alignH = config.alignH;
                                                //设置垂直对齐
                                                Laya.stage.alignV = config.alignV;
                                                //设置basepath
                                                Laya.URL.basePath = typeof window.cdnpath === "string" ? window.cdnpath : "";
                                                //版本号
                                                Laya.URL.version = config.GAME_VERSION;

                                                // 点击阴影无法关闭弹层
                                                window.UIConfig.closeDialogOnSide = false;
                                    },
                                    moduleInit: function moduleInit() {
                                                // 场景切换
                                                this.sceneManager = new window.sceneManagerModule();
                                                // 场景切换的观察者
                                                this.observer = new window.observerModule();
                                                // 通信
                                                this.messageCenter = new window.messageCenterModule({
                                                            websocketurl: window.websocketurl,
                                                            lib: typeof window.Primus === "undefined" ? "socketio" : "primus", //io就是socketio的namespace
                                                            publicKey: typeof window.publicKey === "undefined" ? "" : window.publicKey,
                                                            token: window.token
                                                });

                                                // 测试用
                                                window.checheEmit = this.messageCenter.emit.bind(this.messageCenter);
                                    },


                                    // 加载字体
                                    loadFont: function loadFont() {
                                                var _this = this;

                                                //全局字体资源
                                                this.config.RESOURCE.fonts.forEach(function (item, i, arr) {
                                                            var bitmapfont = new Laya.BitmapFont();
                                                            bitmapfont.loadFont(item.url, Laya.Handler.create(_this, function () {
                                                                        Laya.Text.registerBitmapFont(item.name, bitmapfont);
                                                            }));
                                                });
                                    },


                                    // 加载图片
                                    loadImages: function loadImages() {
                                                Laya.loader.load(this.config.RESOURCE.disLoadingRes, Laya.Handler.create(this, this.onLoaded), Laya.Handler.create(this, this.onLoading, null, false));
                                    },


                                    // loading条动画
                                    onLoading: function onLoading(percent) {
                                                // 当前场景是loading
                                                this.sceneManager.currentScene.loading(percent);
                                    },


                                    // load
                                    loadingPageShow: function loadingPageShow() {
                                                var _this2 = this;

                                                Laya.loader.load(this.config.RESOURCE.loadingRes, Laya.Handler.create(this, function () {

                                                            // loading场景
                                                            _this2.sceneManager.loadScene(new _this2.LoadingScene());

                                                            // 设置视图居中
                                                            app.setViewCenter();

                                                            // 浏览器窗口大小变化
                                                            Laya.stage.on(Laya.Event.RESIZE, _this2, _this2.setViewCenter);

                                                            // 加载字体
                                                            _this2.loadFont();
                                                            // 加载图片
                                                            _this2.loadImages();
                                                }));
                                    },
                                    onLoaded: function onLoaded() {
                                                console.warn('大厅&房间————资源加载完成');

                                                // 初始化所有弹层
                                                this.initAllPop();

                                                // 首先实例头部
                                                if (!app.header_ui_box) {
                                                            app.header_ui_box = new app.HeaderScene();
                                                }

                                                //  判断是进大厅还是房间 (首先挂载好消息处理函数)
                                                this.initGame();

                                                // 连接服务器
                                                this.messageCenter.connectSocket();
                                    },


                                    // 初始化游戏
                                    initGame: function initGame() {
                                                var _this3 = this;

                                                // 是否登录(未登录直接跳大厅)
                                                if (!app.utils.checkLoginStatus()) {

                                                            this.enterHall();

                                                            // 初始化声音
                                                            app.audio.init();

                                                            return;
                                                }

                                                //一切请求等待首次连接后在发出 
                                                app.messageCenter.registerAction("conn::init", function () {
                                                            // 初始化游戏
                                                            app.messageCenter.emit('initGame');

                                                            // 头部的首次触发
                                                            app.header_ui_box.dispatchAction();

                                                            // 发送广告(仅仅一次)
                                                            app.messageCenter.emit("advertise");
                                                });

                                                // 注册初始化游戏
                                                app.messageCenter.registerAction('enterRoom', function (data) {
                                                            if (Object.keys(data.tableInfo).length === 0) {
                                                                        _this3.enterHall();
                                                            } else {
                                                                        _this3.enterRoom(data);
                                                            }

                                                            // 初始化声音
                                                            app.audio.init();
                                                });

                                                // 错误信息处理
                                                app.messageCenter.registerAction('conn::error', function (data) {
                                                            _this3.connError(data);
                                                });
                                    },


                                    // 进入大厅
                                    enterHall: function enterHall() {

                                                app.hall_ui_box = new app.HallScene();

                                                // 加载页去掉
                                                app.observer.publish('fruitLoadingClose');

                                                // 大厅场景
                                                app.sceneManager.loadScene(app.hall_ui_box);

                                                // 设置视图居中
                                                app.setViewCenter();
                                    },


                                    // 进入房间
                                    enterRoom: function enterRoom(data) {
                                                // 进入房间失败
                                                if (data.code !== 0) {
                                                            // 加载页去掉
                                                            app.observer.publish('fruitLoadingClose');

                                                            if (data.code === 10) {

                                                                        app.observer.publish('quit_rechargePopShow', 'less');
                                                            } else {
                                                                        // 错误信息
                                                                        app.observer.publish('commonPopShow', data.msg);
                                                            }

                                                            return;
                                                }

                                                // 成功进房间
                                                this.enterRoomSuccess(data);
                                    },


                                    // 成功进房间
                                    enterRoomSuccess: function enterRoomSuccess(data) {
                                                app.room_ui_box = new app.RoomScene();

                                                // 渲染房间信息
                                                app.room_ui_box.renderRoomInfo(data);

                                                // 加载页去掉
                                                app.observer.publish('fruitLoadingClose');

                                                // 房间场景
                                                app.sceneManager.loadScene(app.room_ui_box);

                                                // 设置视图居中
                                                app.setViewCenter();

                                                // 物理引擎初始化
                                                app.matterCenter.init(data.tableInfo.spin);
                                    },


                                    // 初始化所有弹层
                                    initAllPop: function initAllPop() {
                                                // 充值弹层
                                                new app.RechargeUIDialog();

                                                // 公共提示弹层
                                                new app.CommonPopDialog();

                                                // 仅读的弹层
                                                new app.OnlyReadPopDialog();

                                                // 确认是否退出房间 && 金额不足是否去充值
                                                new app.Quit_rechargePopUIDialog();

                                                // 盈利榜中奖提示
                                                new app.GainPopUIDialog();

                                                // 盈利榜弹层
                                                new app.YinglibangPopUIView();

                                                // 玩家信息
                                                new app.PlayerInfoPopUIView();

                                                // 我的战绩
                                                new app.MyGradePopUIView();

                                                // 历史记录
                                                new app.HistoryPopUI();

                                                // 收获弹层
                                                new app.ShouhuoPopUIDialog();

                                                // 加载中
                                                new app.FruitLoadingUIDialog();

                                                // 小奖
                                                new app.SmallAwardPop();

                                                // 大奖
                                                new app.SuperAwardPop();

                                                // 帮助
                                                new app.HelpPopUIDialog();

                                                // 广告
                                                new app.AdvertisePopDialog();

                                                // 普通文本提示弹层
                                                new app.NormalPopDialog();

                                                // 新手引导
                                                new app.NewUserPopUIDialog();
                                    },


                                    // 错误信息处理
                                    connError: function connError(data) {
                                                switch (Number(data.code)) {
                                                            // 异地登陆
                                                            case 1003:

                                                                        // 断开socket
                                                                        app.messageCenter.disconnectSocket();

                                                                        // 提示弹层
                                                                        app.observer.publish('commonPopShow', '异地登录，请刷新页面', true, function () {
                                                                                    window.location.reload();
                                                                        });

                                                                        break;

                                                }
                                    },


                                    //救济金
                                    _jiujijin: function _jiujijin() {
                                                Laya.timer.once(5000, this, function () {
                                                            if (window.GM && window.GM.socket_RJ && window.GM.socket_RJ.exec) {
                                                                        // 延时确保服务器那边有了
                                                                        window.GM.socket_RJ.exec();
                                                                        // 更新余额
                                                                        app.messageCenter.emit("userAccount");
                                                            }
                                                });
                                    },


                                    // 设置视图居中
                                    setViewCenter: function setViewCenter() {
                                                var _width = Laya.stage.width;
                                                var currentView = app.sceneManager.currentScene;
                                                var _x = _width > 750 ? (_width - 750) / 2 : 0;

                                                currentView.x = _x;
                                                app.gameConfig.viewLeft = _x;

                                                // 位置
                                                if (app.matterCenter.matterView_ui_box) {
                                                            app.matterCenter.matterView_ui_box.x = _x;
                                                }
                                    }
                        });

                        app.init();
            })();
}