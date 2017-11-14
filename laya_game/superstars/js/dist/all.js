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
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class for marquee laya
 * @class      MarqueeLaya (name)跑马灯
 * 
 * 
 */
{
    var app = window.app;

    var MarqueeLaya = function (_Laya$Box) {
        _inherits(MarqueeLaya, _Laya$Box);

        function MarqueeLaya(parentNode, options) {
            _classCallCheck(this, MarqueeLaya);

            var _this = _possibleConstructorReturn(this, (MarqueeLaya.__proto__ || Object.getPrototypeOf(MarqueeLaya)).call(this));

            _this.init(parentNode, options);
            return _this;
        }

        // 初始化


        _createClass(MarqueeLaya, [{
            key: 'init',
            value: function init(parentNode, options) {
                var DEFAULT = {
                    duraing: 3000, //运动的持续时间
                    intervalTime: { //时间间隔
                        nomal: 10 * 1000, //普通跑马灯 
                        win: 3 * 1000 //获奖跑马灯
                    },
                    modelData: [//数据模板
                    '恭喜*赢了*，实在是太厉害了！', '祝贺*赢取*，积少成多从现在开始。', '恭喜*赢取*，满屏掌声献给他！'],
                    fontSize: 30,
                    color: '#fff',
                    colorHigh: '#14e3f7',
                    font: "微软雅黑"

                };

                if (!(parentNode instanceof Laya.Node)) {
                    console.log(new Error('父元素Error...'));

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

        }, {
            key: '_initConfig',
            value: function _initConfig() {
                this.config = {
                    MASKWIDTH: this.parentNode.displayWidth, //遮罩宽
                    MASKHEIGHT: this.parentNode.displayHeight, //遮罩高
                    currentType: 'nomal', //当前跑马灯类型   1:普通型， 2：获奖型
                    isDataLoop: false, //是否需要重复播放的数据
                    count: 0,
                    noticeArr: [], //跑马灯数据
                    isGoing: false //是否已经启动
                };

                this._labelChildren = null; //label数组
            }

            // 添加遮罩

        }, {
            key: '_addMask',
            value: function _addMask() {
                this.parentNode.mask = new Laya.Sprite();
                this.parentNode.mask.graphics.clear();
                this.parentNode.mask.graphics.drawRect(0, 0, this.config.MASKWIDTH, this.config.MASKHEIGHT, '#000000');
            }

            // 添加子元素

        }, {
            key: '_createChild',
            value: function _createChild() {
                var _arr = [];
                for (var i = 0; i < 5; i++) {
                    var _label = new Laya.Label();
                    _label.fontSize = this.options.fontSize;
                    _label.font = this.options.font;
                    _arr.push(_label);
                }

                this._labelChildren = _arr;
            }

            // 开始轮播

        }, {
            key: 'start',
            value: function start(data) {
                if (typeof data === 'string' || typeof data === 'number') {
                    this.config.noticeArr.unshift(data);
                } else if (Array.isArray(data)) {
                    this.config.noticeArr = data.concat(this.config.noticeArr);
                }

                this._marqueeGo();
            }

            // 跑马灯开启

        }, {
            key: '_marqueeGo',
            value: function _marqueeGo(data) {
                var config = this.config;

                // 只启动一次
                if (!config.isGoing) {
                    config.isGoing = true;
                    this._renderNextNotice();
                }
            }

            // 渲染下一条公告

        }, {
            key: '_renderNextNotice',
            value: function _renderNextNotice() {
                var config = this.config;
                var noticeArr = config.noticeArr;

                // 当前信息
                var msg = noticeArr.shift();

                // 表示没有内容了
                if (typeof msg === 'undefined') {
                    // 结束
                    this.config.isGoing = false;

                    return;
                }

                // 是否需要重复播放
                if (config.isDataLoop) {
                    noticeArr.push(msg);
                }

                // 处理当条文字信息
                var txtArr = this._dealWithMsg(msg);

                // 渲染文字
                this._renderLabel(txtArr);

                // 当前公告入场
                this._currentNoticeIn();
            }

            // 处理当条文字信息

        }, {
            key: '_dealWithMsg',
            value: function _dealWithMsg(msg) {
                var txtArr = [msg];

                // 拆分字符串
                if (typeof msg === 'string') {
                    var _index0 = msg.indexOf('恭喜');
                    var _index1 = msg.indexOf('赢取');

                    if (_index0 !== -1 && _index1 !== -1) {
                        txtArr = [msg.slice(0, _index0 + 2), msg.slice(_index0 + 2, _index1), msg.slice(_index1, _index1 + 2), msg.slice(_index1 + 2)];
                    }
                }

                // 使用本地模板
                if ((typeof msg === 'undefined' ? 'undefined' : _typeof(msg)) === 'object' && 'name' in msg && 'award' in msg) {
                    // 获奖公告
                    var modelArr = this.options.modelData[this.config.count++ % 3].split('*');
                    txtArr = [modelArr[0], msg.name, modelArr[1], msg.award, modelArr[2]];
                }

                return txtArr;
            }

            // 渲染文字

        }, {
            key: '_renderLabel',
            value: function _renderLabel(txtArr) {
                var _this2 = this;

                // 移除所有子节点
                this.removeChildren();

                // 当前公告类型
                this.config.currentType = txtArr.length === 1 ? 'nomal' : 'win';

                // 渲染文本的text 和 color
                txtArr.forEach(function (item, index) {
                    var _color = '';
                    _this2._labelChildren[index].text = item;
                    if (index === 1) {
                        _color = _this2.options.colorHigh;
                    } else if (index === 3) {
                        _color = _this2.options.colorHigh2 || _this2.options.colorHigh;
                    } else {
                        _color = _this2.options.color;
                    }

                    _this2._labelChildren[index].color = _color;
                });

                // 坐标计算
                for (var i = 0; i < txtArr.length; i++) {
                    if (i !== 0) {
                        this._labelChildren[i].x = this._labelChildren[i - 1].x + this._labelChildren[i - 1].displayWidth + 2;
                    }

                    // 添加文本元素
                    this.addChild(this._labelChildren[i]);
                }
            }

            // 当前跑马灯信息入场

        }, {
            key: '_currentNoticeIn',
            value: function _currentNoticeIn(text) {
                this.x = this.config.MASKWIDTH;

                Laya.Tween.to(this, { x: 0 }, this.options.duraing, Laya.Ease.linearIn, Laya.Handler.create(this, this._currentNoticeOut));
            }

            // 当前跑马灯信息离场

        }, {
            key: '_currentNoticeOut',
            value: function _currentNoticeOut() {
                var config = this.config;
                var moveX = Math.ceil(this.displayWidth);

                Laya.Tween.to(this, { x: -1 * moveX }, this.options.duraing, Laya.Ease.linearIn, Laya.Handler.create(this, this._renderNextNotice), this.options.intervalTime[config.currentType]);
            }
        }]);

        return MarqueeLaya;
    }(Laya.Box);

    app.MarqueeLaya = MarqueeLaya;
}
'use strict';

var CLASS$ = Laya.class;
var STATICATTR$ = Laya.static;
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var commonPopUI = function (_super) {
	function commonPopUI() {

		this.txt_box = null;
		this.btn_box = null;

		commonPopUI.__super.call(this);
	}

	CLASS$(commonPopUI, 'ui.pop.commonPopUI', _super);
	var __proto__ = commonPopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(commonPopUI.uiView);
	};

	STATICATTR$(commonPopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 640, "height": 430 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 640, "skin": "pop/bg-base.png", "name": "pop_bg", "height": 430, "sizeGrid": "50,62,70,54" } }, { "type": "Box", "props": { "y": 32, "x": 20, "var": "txt_box" }, "child": [{ "type": "Image", "props": { "width": 600, "skin": "pop/bottombg.png", "name": "txt_bg", "height": 238, "sizeGrid": "31,41,42,44" } }, { "type": "Label", "props": { "y": 64, "x": 26, "wordWrap": true, "width": 548, "text": "我是内容部分我是内", "name": "txt_content", "leading": 5, "fontSize": 28, "font": "Microsoft YaHei", "color": "#c9bde1", "align": "center" } }] }, { "type": "Box", "props": { "x": 62, "var": "btn_box", "bottom": 20 }, "child": [{ "type": "Box", "props": { "name": "btn_sure" }, "child": [{ "type": "Image", "props": { "skin": "pop/recharge/bg22.png" } }, { "type": "Image", "props": { "y": 42, "x": 75, "skin": "pop/recharge/queding.png" } }] }, { "type": "Box", "props": { "x": 280, "name": "btn_no" }, "child": [{ "type": "Image", "props": { "skin": "pop/recharge/bg1.png" } }, { "type": "Image", "props": { "y": 41, "x": 74, "skin": "pop/recharge/quxiao.png" } }] }] }, { "type": "Button", "props": { "top": -15, "stateNum": "1", "skin": "pop/close-btn.png", "right": -15, "name": "close" } }] };
	}]);
	return commonPopUI;
}(Dialog);
var fudaiPopUI = function (_super) {
	function fudaiPopUI() {

		this.dom_fudai = null;
		this.dom_content_box = null;
		this.text_content = null;

		fudaiPopUI.__super.call(this);
	}

	CLASS$(fudaiPopUI, 'ui.pop.fudaiPopUI', _super);
	var __proto__ = fudaiPopUI.prototype;
	__proto__.createChildren = function () {
		View.regComponent("SkeletonPlayer", laya.ani.bone.Skeleton);

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(fudaiPopUI.uiView);
	};

	STATICATTR$(fudaiPopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 750, "height": 1334 }, "child": [{ "type": "SkeletonPlayer", "props": { "y": 613, "x": 375, "var": "dom_fudai", "url": "animate/fudai.sk" } }, { "type": "Box", "props": { "y": 581, "x": 165, "width": 430, "var": "dom_content_box", "height": 47 }, "child": [{ "type": "Label", "props": { "y": 0, "x": 0, "width": 430, "visible": true, "var": "text_content", "text": "800", "height": 32, "font": "fudai_pop_font", "align": "center" } }] }] };
	}]);
	return fudaiPopUI;
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
		return this.uiView = { "type": "Dialog", "props": { "y": 0, "x": 0, "width": 700, "height": 1040 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 700, "skin": "pop/bg-base.png", "height": 1040, "sizeGrid": "50,62,70,54" } }, { "type": "Image", "props": { "y": 107, "x": 18, "width": 660, "skin": "pop/bottombg.png", "height": 909, "sizeGrid": "31,41,42,44" } }, { "type": "Image", "props": { "y": 27, "x": 234, "skin": "pop/help_txt.png" } }, { "type": "Box", "props": { "width": 700, "var": "help_glr" }, "child": [{ "type": "Tab", "props": { "y": 943, "x": 313, "space": 30, "selectedIndex": 0, "name": "pagination", "direction": "horizontal" }, "child": [{ "type": "Button", "props": { "stateNum": "2", "skin": "pop/btn_help.png", "name": "item0" } }, { "type": "Button", "props": { "y": 10, "x": 10, "stateNum": "2", "skin": "pop/btn_help.png", "name": "item1" } }] }, { "type": "Box", "props": { "y": 126, "x": 51, "name": "con" }, "child": [{ "type": "ViewStack", "props": { "selectedIndex": 1, "name": "list" }, "child": [{ "type": "Box", "props": { "width": 600, "name": "item0", "height": 808 }, "child": [{ "type": "Image", "props": { "skin": "pop/page1.png" } }] }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 600, "name": "item1", "height": 808 }, "child": [{ "type": "Image", "props": { "skin": "pop/page2.png" } }] }] }] }] }, { "type": "Button", "props": { "y": -16, "x": 646, "stateNum": "1", "skin": "pop/close-btn.png", "name": "close1" } }, { "type": "Image", "props": { "y": 966, "x": 217, "skin": "pop/jump.png", "name": "close2" } }] };
	}]);
	return helpPopUI;
}(Dialog);
var rankPopUI = function (_super) {
	function rankPopUI() {

		this.rich_box = null;
		this.tab_nav = null;
		this.tab_con = null;
		this.list_rank_all = null;
		this.list_rank_my = null;
		this.dom_loading = null;
		this.dom_unloaded = null;

		rankPopUI.__super.call(this);
	}

	CLASS$(rankPopUI, 'ui.pop.rankPopUI', _super);
	var __proto__ = rankPopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(rankPopUI.uiView);
	};

	STATICATTR$(rankPopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 712, "skin": "pop/clip_rich.png", "height": 1040 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 712, "skin": "pop/bg-base.png", "height": 1040, "sizeGrid": "50,62,70,54" } }, { "type": "Box", "props": { "y": 76, "x": 24, "var": "rich_box" }, "child": [{ "type": "Image", "props": { "skin": "pop/top-bg.png" } }, { "type": "Image", "props": { "y": 31, "x": 0, "skin": "pop/rich.png" } }, { "type": "Box", "props": { "y": 38, "x": 240, "name": "item" }, "child": [{ "type": "Clip", "props": { "visible": true, "skin": "pop/clip_richNew.png", "name": "rank", "clipY": 3 } }, { "type": "Label", "props": { "y": 4, "x": 57, "width": 155, "text": "虚位以待...", "name": "name", "height": 27, "fontSize": 27, "font": "Microsoft YaHei", "color": "#d9a5f6", "bold": false } }, { "type": "Label", "props": { "y": 4, "x": 220, "width": 169, "name": "point", "height": 27, "fontSize": 27, "font": "Microsoft YaHei", "color": "#dce2fa", "bold": false } }] }, { "type": "Box", "props": { "y": 98, "x": 240, "name": "item" }, "child": [{ "type": "Clip", "props": { "skin": "pop/clip_richNew.png", "name": "rank", "index": 1, "clipY": 3 } }, { "type": "Label", "props": { "y": 4, "x": 57, "width": 155, "text": "虚位以待...", "name": "name", "height": 27, "fontSize": 27, "font": "Microsoft YaHei", "color": "#d9a5f6", "bold": false } }, { "type": "Label", "props": { "y": 4, "x": 220, "width": 169, "name": "point", "height": 27, "fontSize": 27, "font": "Microsoft YaHei", "color": "#dce2fa", "bold": false } }] }, { "type": "Box", "props": { "y": 158, "x": 240, "name": "item" }, "child": [{ "type": "Clip", "props": { "skin": "pop/clip_richNew.png", "name": "rank", "index": 2, "clipY": 3 } }, { "type": "Label", "props": { "y": 4, "x": 57, "width": 155, "text": "虚位以待...", "name": "name", "height": 27, "fontSize": 27, "font": "Microsoft YaHei", "color": "#d9a5f6", "bold": false } }, { "type": "Label", "props": { "y": 4, "x": 220, "width": 169, "name": "point", "height": 27, "fontSize": 27, "font": "Microsoft YaHei", "color": "#dce2fa", "bold": false } }] }] }, { "type": "Image", "props": { "y": -115, "x": 112, "skin": "pop/phb.png", "cacheAs": "normal" } }, { "type": "Image", "props": { "y": 384, "x": 21, "width": 670, "skin": "pop/bottombg.png", "height": 632, "sizeGrid": "31,41,42,44" } }, { "type": "Tab", "props": { "y": 310, "x": 36, "var": "tab_nav", "space": 5, "selectedIndex": 0, "direction": "horizontal" }, "child": [{ "type": "Button", "props": { "stateNum": 2, "skin": "pop/btn_day.png", "name": "item0" } }, { "type": "Button", "props": { "stateNum": 2, "skin": "pop/btn_week.png", "name": "item1" } }, { "type": "Button", "props": { "stateNum": 2, "skin": "pop/btn_month.png", "name": "item2" } }, { "type": "Button", "props": { "stateNum": 2, "skin": "pop/btn_my.png", "name": "item3" } }] }, { "type": "ViewStack", "props": { "y": 405, "x": 61, "var": "tab_con", "selectedIndex": 0 }, "child": [{ "type": "Box", "props": { "name": "item0" }, "child": [{ "type": "HBox", "props": { "y": 0, "x": 0, "space": 35, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "skin": "pop/paim.png" } }, { "type": "Image", "props": { "skin": "pop/txt-playname.png" } }, { "type": "Image", "props": { "skin": "pop/txt-toubi.png" } }, { "type": "Image", "props": { "skin": "pop/paimbh.png" } }] }, { "type": "Image", "props": { "y": 50, "x": 1, "skin": "pop/xuxian.png" } }, { "type": "List", "props": { "y": 66, "x": 17, "width": 573, "var": "list_rank_all", "vScrollBarSkin": "pop/vscroll.png", "spaceY": 18, "height": 500 }, "child": [{ "type": "Box", "props": { "space": 45, "name": "render", "height": 50 }, "child": [{ "type": "Clip", "props": { "skin": "pop/clip_rich.png", "name": "rankIcon", "clipY": 3 } }, { "type": "Label", "props": { "y": 2, "x": 11, "width": 34, "text": 1, "name": "rankNum", "height": 26, "fontSize": 26, "font": "Microsoft YaHei", "color": "#fff", "align": "left" } }, { "type": "Label", "props": { "y": 2, "x": 91, "width": 160, "name": "name", "height": 26, "fontSize": 26, "font": "Microsoft YaHei", "color": "#fff", "align": "center" } }, { "type": "Label", "props": { "y": 2, "x": 267, "width": 160, "name": "point", "fontSize": 26, "font": "Microsoft YaHei", "color": "#fff", "align": "center" } }, { "type": "Clip", "props": { "y": 3, "x": 500, "skin": "pop/clip_tend.png", "name": "tend", "clipY": 3 } }] }] }] }, { "type": "Box", "props": { "y": 0, "x": 0, "name": "item1" }, "child": [{ "type": "HBox", "props": { "y": 0, "x": 104, "space": 200, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "skin": "pop/txt-time.png" } }, { "type": "Image", "props": { "skin": "pop/txt-yingde.png" } }] }, { "type": "Image", "props": { "y": 50, "x": 1, "skin": "pop/xuxian.png" } }, { "type": "List", "props": { "y": 66, "x": -5, "width": 595, "var": "list_rank_my", "vScrollBarSkin": "pop/vscroll.png", "spaceY": 18, "height": 500 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 540, "space": 30, "name": "render", "height": 50 }, "child": [{ "type": "Label", "props": { "y": 2, "x": 0, "width": 314, "text": "0", "name": "time", "height": 26, "fontSize": 26, "font": "Microsoft YaHei", "color": "#fff", "align": "center" } }, { "type": "Image", "props": { "y": 2, "x": 320, "visible": false, "skin": "pop/fudai-s.png", "name": "isSelf" } }, { "type": "Label", "props": { "y": 2, "x": 380, "width": 160, "text": "0", "name": "point", "fontSize": 26, "font": "Microsoft YaHei", "color": "#fff", "align": "center" } }] }] }] }] }, { "type": "Image", "props": { "y": -15, "x": 651, "skin": "pop/close-btn.png", "name": "close_btn" } }, { "type": "Label", "props": { "y": 664, "x": 304, "visible": false, "var": "dom_loading", "text": "加载中...", "fontSize": 26, "font": "Microsoft YaHei", "color": "#fff" } }, { "type": "Label", "props": { "y": 664, "x": 304, "visible": false, "var": "dom_unloaded", "underline": true, "text": "请登录...", "fontSize": 26, "font": "Microsoft YaHei", "color": "#d9e200" } }] };
	}]);
	return rankPopUI;
}(Dialog);
var rechargePopUI = function (_super) {
	function rechargePopUI() {

		this.tab_nav = null;
		this.btn_buy = null;
		this.btn_input = null;

		rechargePopUI.__super.call(this);
	}

	CLASS$(rechargePopUI, 'ui.pop.rechargePopUI', _super);
	var __proto__ = rechargePopUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(rechargePopUI.uiView);
	};

	STATICATTR$(rechargePopUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 650, "height": 1070 }, "child": [{ "type": "Image", "props": { "y": 45, "x": 0, "width": 650, "skin": "pop/bg-base.png", "height": 1022, "sizeGrid": "50,62,70,54" } }, { "type": "Box", "props": { "y": -27, "x": -30, "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "y": 122, "x": 51, "width": 606, "skin": "pop/bottombg.png", "height": 837, "sizeGrid": "31,41,42,44" } }, { "type": "Image", "props": { "skin": "pop/recharge/top.png" } }, { "type": "Image", "props": { "y": 12, "x": 148, "skin": "pop/recharge/chong.png" } }, { "type": "Image", "props": { "y": 163, "x": 94, "skin": "pop/recharge/txt_asdf.png" } }] }, { "type": "Tab", "props": { "y": 211, "x": 55, "var": "tab_nav", "selectedIndex": 2 }, "child": [{ "type": "Button", "props": { "stateNum": "2", "skin": "pop/recharge/btn_tab.png", "name": "item0" } }, { "type": "Button", "props": { "y": 0, "x": 274, "stateNum": "2", "skin": "pop/recharge/btn_tab.png", "name": "item1" } }, { "type": "Button", "props": { "y": 284, "x": 0, "stateNum": "2", "skin": "pop/recharge/btn_tab.png", "name": "item2" } }, { "type": "Button", "props": { "y": 284, "x": 274, "stateNum": "2", "skin": "pop/recharge/btn_tab.png", "name": "item3" } }] }, { "type": "Box", "props": { "y": 211, "x": 55, "mouseThrough": true, "cacheAs": "bitmap" }, "child": [{ "type": "Box", "props": { "width": 266, "name": "item0", "height": 276 }, "child": [{ "type": "Image", "props": { "y": 30, "x": 45, "skin": "pop/recharge/coin_4.png" } }, { "type": "Image", "props": { "y": 194, "x": 28, "skin": "pop/recharge/bg_zhi.png" } }, { "type": "Image", "props": { "y": 208, "x": 92, "skin": "pop/recharge/10元.png" } }] }, { "type": "Box", "props": { "x": 274, "width": 266, "name": "item1", "height": 276 }, "child": [{ "type": "Image", "props": { "y": 25, "x": 53, "skin": "pop/recharge/coin_3.png" } }, { "type": "Image", "props": { "y": 194, "x": 28, "skin": "pop/recharge/bg_zhi.png" } }, { "type": "Image", "props": { "y": 208, "x": 92, "skin": "pop/recharge/50元.png" } }] }, { "type": "Box", "props": { "y": 284, "width": 266, "name": "item2", "height": 276 }, "child": [{ "type": "Image", "props": { "y": 6, "x": 33, "skin": "pop/recharge/coin_2.png" } }, { "type": "Image", "props": { "y": 194, "x": 28, "skin": "pop/recharge/bg_zhi.png" } }, { "type": "Image", "props": { "y": 208, "x": 81, "skin": "pop/recharge/100元.png" } }] }, { "type": "Box", "props": { "y": 284, "x": 274, "width": 266, "name": "item3", "height": 276 }, "child": [{ "type": "Image", "props": { "y": 5, "x": 33, "skin": "pop/recharge/coin_1.png" } }, { "type": "Image", "props": { "y": 194, "x": 28, "skin": "pop/recharge/bg_zhi.png" } }, { "type": "Image", "props": { "y": 208, "x": 81, "skin": "pop/recharge/500元.png" } }] }] }, { "type": "Box", "props": { "y": 943, "x": 198, "var": "btn_buy" }, "child": [{ "type": "Button", "props": { "stateNum": "1", "skin": "pop/recharge/btn_bg.png" } }, { "type": "Image", "props": { "y": 26, "x": 54, "skin": "pop/recharge/txt_qcz.png" } }] }, { "type": "Button", "props": { "stateNum": "1", "skin": "pop/close-btn.png", "right": 0, "name": "close" } }, { "type": "Box", "props": { "y": 810, "x": 68, "var": "btn_input" }, "child": [{ "type": "Image", "props": { "skin": "pop/recharge/bg_input.png" } }, { "type": "Label", "props": { "y": 16, "x": 43, "text": "请输入大于0的整数", "name": "input_txt", "fontSize": 30, "font": "Microsoft YaHei", "color": "#bf93ca" } }] }, { "type": "Label", "props": { "y": 891, "x": 100, "text": "充值钻石成功后将为您自动兑换为欢乐豆", "fontSize": 25, "font": "Microsoft YaHei", "color": "#a9a692" } }] };
	}]);
	return rechargePopUI;
}(Dialog);
var warmNoticeUI = function (_super) {
	function warmNoticeUI() {

		this.txt_box = null;
		this.btn_box = null;

		warmNoticeUI.__super.call(this);
	}

	CLASS$(warmNoticeUI, 'ui.pop.warmNoticeUI', _super);
	var __proto__ = warmNoticeUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(warmNoticeUI.uiView);
	};

	STATICATTR$(warmNoticeUI, ['uiView', function () {
		return this.uiView = { "type": "Dialog", "props": { "width": 640, "height": 460 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 640, "skin": "pop/bg-base.png", "name": "pop_bg", "height": 460, "sizeGrid": "50,62,70,54" } }, { "type": "Image", "props": { "y": 28, "x": 227, "skin": "pop/recharge/wenxin.png" } }, { "type": "Box", "props": { "y": 95, "x": 20, "var": "txt_box" }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 600, "skin": "pop/bottombg.png", "name": "txt_bg", "height": 193, "sizeGrid": "31,41,42,44" } }, { "type": "Label", "props": { "y": 64, "x": 26, "wordWrap": true, "width": 548, "text": "我是内容部分我是内", "name": "txt_content", "leading": 5, "fontSize": 28, "font": "Microsoft YaHei", "color": "#c9bde1", "align": "center" } }] }, { "type": "Box", "props": { "y": 286, "x": 202, "var": "btn_box", "bottom": 20 }, "child": [{ "type": "Box", "props": { "name": "btn_sure" }, "child": [{ "type": "Image", "props": { "skin": "pop/recharge/bg22.png" } }, { "type": "Image", "props": { "y": 42, "x": 61, "skin": "pop/recharge/zhidao.png" } }] }] }, { "type": "Button", "props": { "top": -15, "stateNum": "1", "skin": "pop/close-btn.png", "right": -15, "name": "close" } }] };
	}]);
	return warmNoticeUI;
}(Dialog);
var winPopUI = function (_super) {
	function winPopUI() {

		winPopUI.__super.call(this);
	}

	CLASS$(winPopUI, 'ui.pop.winPopUI', _super);
	var __proto__ = winPopUI.prototype;
	__proto__.createChildren = function () {
		View.regComponent("SkeletonPlayer", laya.ani.bone.Skeleton);

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(winPopUI.uiView);
	};

	STATICATTR$(winPopUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "child": [{ "type": "Label", "props": { "width": 1334, "text": "label", "height": 1334, "centerY": 0, "centerX": 0, "bgColor": "#000", "alpha": 0.5 } }, { "type": "SkeletonPlayer", "props": { "y": 696, "x": 389, "url": "animate/win.sk", "name": "dom_animate" } }, { "type": "Label", "props": { "y": 696, "x": 248, "width": 294, "text": "+200", "name": "dom_award", "height": 65, "font": "result_win_font", "align": "center" } }, { "type": "Label", "props": { "y": 630, "x": 248, "width": 294, "text": "*2", "name": "dom_inner", "height": 65, "font": "yellow_font", "align": "center" } }, { "type": "Label", "props": { "y": 565, "x": 248, "width": 294, "text": "*1.2", "name": "dom_outer", "height": 65, "font": "purple_font", "align": "center" } }] };
	}]);
	return winPopUI;
}(View);
var loadingUI = function (_super) {
	function loadingUI() {

		this.dom_process_txt = null;
		this.dom_process_img = null;

		loadingUI.__super.call(this);
	}

	CLASS$(loadingUI, 'ui.room.loadingUI', _super);
	var __proto__ = loadingUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(loadingUI.uiView);
	};

	STATICATTR$(loadingUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "child": [{ "type": "Image", "props": { "y": 0, "skin": "loading/loadingbg.jpg", "centerX": 0 } }, { "type": "Image", "props": { "y": 1180, "x": 74, "skin": "loading/notice.png" } }, { "type": "Image", "props": { "y": 1080, "x": 70, "skin": "loading/bg.png", "sizeGrid": "0,10,0,10" } }, { "type": "Box", "props": { "y": 1018, "x": 273 }, "child": [{ "type": "Label", "props": { "text": "加载中...", "fontSize": 30, "font": "Microsoft YaHei", "color": "#fff", "bold": false } }, { "type": "Label", "props": { "x": 158, "var": "dom_process_txt", "text": "0%", "fontSize": 30, "font": "Microsoft YaHei", "color": "#fff", "bold": false, "align": "right" } }] }, { "type": "Image", "props": { "y": 1087, "x": 75, "width": 30, "var": "dom_process_img", "skin": "loading/prosess.png", "sizeGrid": "0,15,0,15" } }, { "type": "Image", "props": { "y": 305, "x": 584, "skin": "loading/neice.png" } }] };
	}]);
	return loadingUI;
}(View);
var roomUI = function (_super) {
	function roomUI() {

		this.dom_light_start = null;
		this.middle_box = null;
		this.rotation_box = null;
		this.dom_small_light = null;
		this.fudai_box = null;
		this.star_box = null;
		this.star_num_box = null;
		this.bottom_box = null;
		this.top_box = null;

		roomUI.__super.call(this);
	}

	CLASS$(roomUI, 'ui.room.roomUI', _super);
	var __proto__ = roomUI.prototype;
	__proto__.createChildren = function () {
		View.regComponent("SkeletonPlayer", laya.ani.bone.Skeleton);

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(roomUI.uiView);
	};

	STATICATTR$(roomUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "y": 0, "width": 750, "name": "yu_num", "height": 1334 }, "child": [{ "type": "Image", "props": { "y": 0, "skin": "room/roombg.jpg", "centerX": 0 } }, { "type": "SkeletonPlayer", "props": { "y": 710, "x": 397, "var": "dom_light_start", "url": "animate/light.sk" } }, { "type": "Box", "props": { "y": 0, "x": 1, "width": 750, "var": "middle_box" }, "child": [{ "type": "SkeletonPlayer", "props": { "y": 624, "x": 350, "url": "animate/girl.sk" } }, { "type": "SkeletonPlayer", "props": { "y": 243, "x": 372, "url": "animate/logo.sk" } }, { "type": "Image", "props": { "y": 205.00000000000003, "x": 536.0000000000001, "skin": "loading/neice.png" } }, { "type": "Image", "props": { "y": 167, "x": 620, "skin": "room/rank.png", "name": "btn_rank" } }, { "type": "Image", "props": { "y": 302, "x": 646, "visible": false, "skin": "room/notice.png", "name": "btn_notice" } }, { "type": "Image", "props": { "y": 315, "x": 699, "visible": false, "skin": "room/red.png", "name": "dom_redPoint" } }, { "type": "Box", "props": { "y": 654, "x": 371, "width": 749, "var": "rotation_box", "rotation": 0, "pivotY": 375, "pivotX": 375, "height": 749 }, "child": [{ "type": "Image", "props": { "skin": "room/outround.png" } }, { "type": "Label", "props": { "y": 85, "x": 540, "text": "*8", "rotation": 30, "font": "outer_base_font", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Label", "props": { "y": 373, "x": 710, "text": "*2", "rotation": 90, "font": "outer_base_font", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Label", "props": { "y": 664, "x": 213, "text": "*4", "rotation": 210, "font": "outer_base_font", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Label", "props": { "y": 381, "x": 45, "text": "*2", "rotation": 270, "font": "outer_base_font", "anchorY": 0.5, "anchorX": 0.5 } }, { "type": "Box", "props": { "y": 631, "x": 509, "name": "wenhao" }, "child": [{ "type": "Label", "props": { "y": 35, "x": 33, "width": 80, "text": "?", "rotation": 150, "height": 32, "font": "outer_base_font", "anchorY": 0.5, "anchorX": 0.5, "align": "center" } }, { "type": "Image", "props": { "y": 32, "x": 25, "width": 55, "visible": false, "skin": "room/bang.png", "rotation": 185, "pivotY": 36.76662202421965, "pivotX": 25.49976969737452, "height": 75 } }] }, { "type": "Box", "props": { "y": 64, "x": 183.1435929640691, "name": "wenhao" }, "child": [{ "type": "Label", "props": { "y": 23, "x": 25, "width": 80, "text": "?", "rotation": 330, "font": "outer_base_font", "anchorY": 0.5, "anchorX": 0.5, "align": "center" } }, { "type": "Image", "props": { "y": -9, "x": 2, "visible": false, "skin": "room/bang.png" } }] }] }, { "type": "SkeletonPlayer", "props": { "y": 650, "x": 371, "url": "animate/spark.sk", "name": "dom_fire_animate" } }, { "type": "Image", "props": { "y": 326, "x": 51, "skin": "room/round.png" } }, { "type": "SkeletonPlayer", "props": { "y": 655, "x": 372, "var": "dom_small_light", "url": "animate/round.sk" } }, { "type": "Box", "props": { "y": 473, "x": 190, "width": 360, "var": "fudai_box", "height": 360 }, "child": [{ "type": "Image", "props": { "y": 145, "x": 26, "width": 307, "skin": "room/coin_bg.png", "height": 72 } }, { "type": "Image", "props": { "y": 48, "x": 64, "skin": "room/fudai.png" } }, { "type": "Image", "props": { "y": 238, "x": 61, "skin": "room/win_bg.png" } }, { "type": "SkeletonPlayer", "props": { "y": 96, "x": 218, "url": "animate/magic.sk", "name": "dom_magic" } }, { "type": "Label", "props": { "y": 164, "x": 39, "width": 281, "text": "0", "name": "fudai_all", "height": 32, "font": "fudai_all_font", "align": "center" } }, { "type": "Label", "props": { "y": 254, "x": 115, "width": 177, "text": "0", "name": "fudai_win", "height": 32, "font": "fudai_win_font", "align": "center" } }, { "type": "Label", "props": { "y": 102, "x": 240, "width": 91, "text": "0/10", "name": "bang_num", "height": 32, "fontSize": 32, "font": "Microsoft YaHei", "color": "#522c03", "bold": true, "align": "right" } }, { "type": "SkeletonPlayer", "props": { "y": 207, "x": 200, "url": "animate/magic2.sk", "name": "dom_magic_big" } }] }, { "type": "Image", "props": { "y": 653, "x": 372, "width": 331, "skin": "room/saoguang.png", "rotation": 0, "pivotY": 274, "pivotX": 262, "name": "dom_three_light", "height": 228 } }, { "type": "Box", "props": { "x": 0, "var": "star_box" }, "child": [{ "type": "Image", "props": { "y": 368, "x": 320, "skin": "room/star_blue.png" } }, { "type": "Image", "props": { "y": 397, "x": 443, "skin": "room/star_yellow.png" } }, { "type": "Image", "props": { "y": 484, "x": 522, "skin": "room/star_blue.png" } }, { "type": "Image", "props": { "y": 604, "x": 551, "skin": "room/star_yellow.png" } }, { "type": "Image", "props": { "y": 720, "x": 526, "skin": "room/star_blue.png" } }, { "type": "Image", "props": { "y": 799, "x": 436, "skin": "room/star_yellow.png" } }, { "type": "Image", "props": { "y": 840, "x": 321, "skin": "room/star_blue.png" } }, { "type": "Image", "props": { "y": 799, "x": 205, "skin": "room/star_yellow.png" } }, { "type": "Image", "props": { "y": 719, "x": 116, "skin": "room/star_blue.png" } }, { "type": "Image", "props": { "y": 601, "x": 90, "skin": "room/star_yellow.png" } }, { "type": "Image", "props": { "y": 483, "x": 124, "skin": "room/star_blue.png" } }, { "type": "Image", "props": { "y": 397, "x": 205, "skin": "room/star_yellow.png" } }] }, { "type": "Box", "props": { "x": -4, "var": "star_num_box", "cacheAs": "bitmap" }, "child": [{ "type": "Image", "props": { "y": 406, "x": 350, "skin": "room/1.2.png" } }, { "type": "Image", "props": { "y": 435, "x": 471, "skin": "room/1.5.png" } }, { "type": "Image", "props": { "y": 523, "x": 565, "skin": "room/2.png" } }, { "type": "Image", "props": { "y": 642, "x": 580, "skin": "room/1.2.png" } }, { "type": "Image", "props": { "y": 759, "x": 554, "skin": "room/1.5.png" } }, { "type": "Image", "props": { "y": 837, "x": 478, "skin": "room/2.png" } }, { "type": "Image", "props": { "y": 879, "x": 350, "skin": "room/1.2.png" } }, { "type": "Image", "props": { "y": 837, "x": 233, "skin": "room/1.5.png" } }, { "type": "Image", "props": { "y": 758, "x": 158, "skin": "room/2.png" } }, { "type": "Image", "props": { "y": 640, "x": 118, "skin": "room/1.2.png" } }, { "type": "Image", "props": { "y": 522, "x": 152, "skin": "room/1.5.png" } }, { "type": "Image", "props": { "y": 435, "x": 247, "skin": "room/2.png" } }] }, { "type": "SkeletonPlayer", "props": { "y": 662, "x": 369, "url": "animate/star.sk", "name": "star_light" } }, { "type": "SkeletonPlayer", "props": { "y": 656, "x": 371, "url": "animate/star.sk", "rotation": 0, "name": "star_ladder" } }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "bottom_box", "mouseThrough": true }, "child": [{ "type": "Image", "props": { "y": 919, "x": 22, "skin": "room/recharge.png", "name": "btn_recharge" } }, { "type": "Image", "props": { "y": 1100, "x": 30, "skin": "room/help_bg.png" } }, { "type": "Image", "props": { "y": 1216, "x": 176, "skin": "room/sub.png", "name": "btn_sub" } }, { "type": "Image", "props": { "y": 1216, "x": 623, "skin": "room/add.png", "name": "btn_add" } }, { "type": "Image", "props": { "y": 1216, "x": 29, "skin": "room/max.png", "name": "btn_max" } }, { "type": "Box", "props": { "y": 980, "x": 598, "width": 144, "name": "start_blue_box", "height": 146 }, "child": [{ "type": "SkeletonPlayer", "props": { "y": 80, "x": 71, "url": "animate/button.sk" } }] }, { "type": "Box", "props": { "y": 1067, "x": 402, "width": 144, "name": "start_yellow_box", "height": 146 }, "child": [{ "type": "SkeletonPlayer", "props": { "y": 80, "x": 71, "url": "animate/button.sk" } }] }, { "type": "Box", "props": { "y": 1218, "x": 285, "name": "input_box" }, "child": [{ "type": "Image", "props": { "skin": "room/inp_bg.png" } }, { "type": "Label", "props": { "y": 30, "x": 39, "width": 259, "text": "100", "name": "dom_input", "height": 32, "font": "input_font", "align": "center" } }] }, { "type": "SkeletonPlayer", "props": { "y": 1127, "x": 694, "url": "animate/finger.sk", "name": "dom_finger", "mouseEnabled": true } }] }, { "type": "Box", "props": { "y": 0, "x": 0, "width": "750", "var": "top_box" }, "child": [{ "type": "Image", "props": { "y": 0, "x": 13, "skin": "room/top_bg.png" } }, { "type": "Image", "props": { "y": 9, "x": 10, "skin": "room/back.png", "name": "btn_back" } }, { "type": "Image", "props": { "y": 98, "x": 10, "skin": "room/home.png", "name": "btn_home" } }, { "type": "Box", "props": { "y": 93, "x": 648, "visible": false, "name": "more_box" }, "child": [{ "type": "Image", "props": { "skin": "pop/morebg.png" } }, { "type": "Clip", "props": { "y": 89, "x": 7, "skin": "pop/clip_sound.png", "name": "sound_btn", "clipY": 2 } }, { "type": "Image", "props": { "y": 171, "x": 7, "skin": "pop/help.png", "name": "help_btn" } }] }, { "type": "Image", "props": { "y": 98, "x": 657, "skin": "room/caidan.png", "name": "btn_menu" } }, { "type": "Box", "props": { "y": 107, "x": 45, "name": "marquee_box" }, "child": [{ "type": "Image", "props": { "skin": "room/marquee_bg.png" } }, { "type": "Box", "props": { "y": 0, "x": 55, "width": 549, "name": "dom_marquee", "height": 52 } }] }, { "type": "Box", "props": { "y": 9, "x": 128, "name": "yu_box" }, "child": [{ "type": "Image", "props": { "skin": "room/num_bg.png" } }, { "type": "Image", "props": { "y": -5, "x": -9, "skin": "room/you.png" } }, { "type": "Image", "props": { "y": -1, "x": 217, "skin": "room/add_zhi.png", "name": "btn_chong" } }, { "type": "Label", "props": { "y": 10, "x": 59, "width": 157, "text": "0", "name": "yu_num", "height": 30, "fontSize": 30, "font": "Microsoft YaHei", "color": "#c4c4c4", "align": "right" } }] }, { "type": "Box", "props": { "y": 9, "x": 430, "name": "you_box" }, "child": [{ "type": "Image", "props": { "skin": "room/num_bg.png" } }, { "type": "Image", "props": { "y": -1, "x": -8, "skin": "room/yu.png" } }, { "type": "Label", "props": { "y": 10, "x": 59, "width": 157, "text": "0", "name": "you_num", "height": 30, "fontSize": 30, "font": "Microsoft YaHei", "color": "#c4c4c4", "align": "right" } }] }] }] };
	}]);
	return roomUI;
}(View);
var testUI = function (_super) {
	function testUI() {

		testUI.__super.call(this);
	}

	CLASS$(testUI, 'ui.room.testUI', _super);
	var __proto__ = testUI.prototype;
	__proto__.createChildren = function () {

		laya.ui.Component.prototype.createChildren.call(this);
		this.createView(testUI.uiView);
	};

	STATICATTR$(testUI, ['uiView', function () {
		return this.uiView = { "type": "View", "props": { "x": 407, "width": 750, "height": 1334 } };
	}]);
	return testUI;
}(View);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function () {
    window.Sail = window.Sail || {};

    var isPlainObject = function () {
        var class2type = {};
        var toString = class2type.toString;
        var hasOwn = class2type.hasOwnProperty;
        var fnToString = hasOwn.toString;
        var ObjectFunctionString = fnToString.call(Object);

        function isPlainObject(obj) {
            var proto, Ctor;

            if (!obj || toString.call(obj) !== "[object Object]") {
                return false;
            }

            proto = Object.getPrototypeOf(obj);

            if (!proto) {
                return true;
            }

            Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
            return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
        };

        return isPlainObject;
    }();

    function Utils() {}
    Laya.class(Utils, "Sail.Utils");

    /**
     * @public
     * 创建骨骼动画
     * @param {String} path 骨骼动画路径
     * @param {Number} rate 骨骼动画帧率，引擎默认为30，一般传24
     * @param {Number} type 动画类型 0,使用模板缓冲的数据，模板缓冲的数据，不允许修改	（内存开销小，计算开销小，不支持换装） 1,使用动画自己的缓冲区，每个动画都会有自己的缓冲区，相当耗费内存 （内存开销大，计算开销小，支持换装） 2,使用动态方式，去实时去画	（内存开销小，计算开销大，支持换装,不建议使用）
     * 
     * @return 骨骼动画
     */
    Utils.createSkeleton = function (path, rate, type) {
        rate = rate || 30;
        type = type || 0;
        var png = Laya.loader.getRes(path + ".png");
        var sk = Laya.loader.getRes(path + ".sk");
        if (!png || !sk) {
            return null;
        }

        var templet = new Laya.Templet();
        templet.parseData(png, sk, rate);

        return templet.buildArmature(type);
    };

    /**
     * @public
     * 获取字符串长度，支持中文
     * @param {String} str 要获取长度的字符串
     * 
     * @return 字符串长度
     */
    Utils.getStringLength = function (str) {
        return ("" + str.replace(/[^\x00-\xff]/gi, "ox")).length;
    };
    /**
     * @public
     * 按指定长度截取字符串
     * @param {String} str 要截取长度的字符串
     * @param {Number} length 字符串长度
     * 
     * @return 截取长度后的字符串
     */
    Utils.cutStr = function (text, length) {
        text = text + "";
        var reg = /[^\x00-\xff]/g;
        if (text.replace(reg, "mm").length <= length) {
            return text;
        }
        var m = Math.floor(length / 2);
        for (var i = m; i < text.length; i++) {
            if (text.substr(0, i).replace(reg, "mm").length >= length) {
                return text.substr(0, i) + "...";
            }
        }
        return text;
    };
    /**
     * @public
     * 获取URL中指定参数的值
     * @param {String} name 参数名
     * 
     * @return 参数值
     */
    Utils.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);

        if (r != null) {
            return unescape(r[2]);
        }

        return null;
    };

    /**
     * @public
     * 将两个或更多对象的内容合并到第一个对象。使用方式见Jquery.extend
     * 调用方式
     * Sail.Utils.extend( [deep ], target, object1 [, objectN ] )
     * Sail.Utils.extend( target [, object1 ] [, objectN ] )
     * 
     * @return 合并后的对象
     */
    Utils.extend = function () {
        var options,
            name,
            src,
            copy,
            copyIsArray,
            clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === "boolean") {
            deep = target;target = arguments[i] || {};i++;
        }
        if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object" && !(typeof target === "undefined" ? "undefined" : _typeof(target)) !== "function") {
            target = {};
        }
        if (i === length) {
            target = this;i--;
        }

        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
                        target[name] = Utils.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };
})();
"use strict";

;(function () {
    var utils = Sail && Sail.Utils || $;

    var SKIN = {
        "confirm": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAWlBMVEUAAADMQkLLQkLLQkL9Y2PLQkLLQkL9Y2PMQkL9Y2PLQkLLQkLdTk75YGD7YmL9Y2P2Xl77YmL9Y2P9Y2P9Y2PLQkL9Y2PLQkL3Xl7cTU3tWFj5YGDoVVXmVFTAQB7jAAAAFnRSTlMA4qyPiltUU9sGBvr59e3cyl/fplYHf9H6ogAAAJVJREFUKM/lzFkOhCAQRdEHCs5TD1WAuv9ttm00xii1Ae/vSS7Wis/7Ree6DHtZRzelm6Z0XyrpUvY/U7S2QNFSvAEDCfXoJW7QkBTooTzK7CR1CBIH1BLXyIX7qKB9nL2G4TmmMxuUiqd7nVh9Acvs3RWdZ7ZYSpjZB3eysCAnwOaXDgVsfsXcAnul0ao6qFLalCv8AOM4RjeBMUEAAAAAAElFTkSuQmCC",
        "delete": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAb1BMVEUAAADLy8ttbGzMzMzMzMxtbGzMzMxtbGzMzMxtbGzMzMxubW3MzMxtbGxtbGyQj4/MzMxtbGxtbGzMzMzMzMzMzMzMzMzMzMzMzMxwb29tbGzMzMxtbGzBwcGtra2NjIy/vr6goKCPjo6kpKSko6Pen5mzAAAAG3RSTlMA/N2piVtVVAYGA+ParPr54ZSKW1Hz5OPf2quDrJY6AAAAqklEQVQoz9XPSQ6DMBBE0TKEeR4yum0Dyf3PGCARLLA76/ztk0oqrMWhfxNy65z7YYytPpeH8v6L6UlaO6Urz+rwRUPpLATiq5svMTrJ1MHn2EfNcQ3BsYBk+2P+8XvgWEFzrFFxXOGumO0MD+NmUyCg0aUjBUgyetn1SVkCRETG8m4wRBHmWiKatBI7CaUnImqxlDZkrUnxKfKO6EXYSoLCK3cqvSJIVngDsvlU0+yaOfMAAAAASUVORK5CYII=",
        "number": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAeFBMVEUAAADGxsa3t7f///////////////////+3t7e3t7fo6Oi3t7fT09P///////+3t7e6urr///+3t7f///+3t7e3t7f///////////////+3t7e3t7f///+3t7fQ0ND29vb19fX7+/v39/fo6Ojh4eHe3t65ubm4uLiqIy5xAAAAHHRSTlMABeKJVQb64VtV/Prp5NvbrqysppSKW1Hz11xTZZ6wfwAAAKVJREFUKM/d00cSgzAQRNEWOefgIIkM97+hMbhwuUBzAP/tq1nMorFlGrlt8aPbPTdMHNURPxXVH2Q6v0xnG6+q8LcaXJkBmKGaQxMVJ6qQUpzCptiGRbEFTva/3FHaoaW4gUexh4DiAEmv1j6BI9UsH2DapNJJY4C7jNc6Li7WSiHbM7ZSlPsMCjHLofn5d5CzKBj2nrE4Fbs4Yk6m+V/ytczZT1+rJlhgr8lBXAAAAABJRU5ErkJggg=="
    };
    var SKIN_PATH = "public/keyboard_" + (Math.random() * 9999999 | 0) + "/";
    var KEYS = [{ text: "1", skin: "number", x: 20, y: 15 }, { text: "2", skin: "number", x: 280, y: 15 }, { text: "3", skin: "number", x: 545, y: 15 }, { text: "4", skin: "number", x: 20, y: 125 }, { text: "5", skin: "number", x: 280, y: 125 }, { text: "6", skin: "number", x: 545, y: 125 }, { text: "7", skin: "number", x: 20, y: 235 }, { text: "8", skin: "number", x: 280, y: 235 }, { text: "9", skin: "number", x: 545, y: 235 }, { text: "0", skin: "number", x: 810, y: 15 }, { text: "00", skin: "number", x: 810, y: 125 }, { text: ".", skin: "number", x: 810, y: 235 }, { text: "确定", skin: "confirm", x: 1070, y: 15 }, { text: "删除", skin: "delete", x: 1070, y: 235 }];
    var EVENT_CLICK = Laya.Event.CLICK;

    var KeyBoardMask = function (_super) {
        function KeyBoardMask() {
            KeyBoardMask.super(this);

            this.configAlpha = null;
            this.configColor = null;
            this.closeOnSide = false;

            this.on(EVENT_CLICK, this, function () {
                if (this.closeOnSide) {
                    this.event("exit", ["mask", null]);
                }
            });
        }
        Laya.class(KeyBoardMask, "", _super);
        var _proto = KeyBoardMask.prototype;

        _proto.update = function (width, height, alpha, color, closeOnSide) {
            this.alpha = this.configAlpha = alpha;
            this.configColor = color;
            this.closeOnSide = closeOnSide;

            this.resize(width, height);
        };
        _proto.resize = function (width, height) {
            this.size(width, height);
            this.graphics.clear();
            this.graphics.drawRect(0, 0, this.width, this.height, this.configColor);
            this.alpha = this.configAlpha;
        };

        return KeyBoardMask;
    }(Laya.Sprite);

    var InputText = function (_super) {
        function InputText() {
            InputText.super(this);

            this.Mask = null;
            this.textValue = null;
            this.originHeight = null;

            this.init();
        }
        Laya.class(InputText, "KeyBoard.InputText", _super);
        var _proto = InputText.prototype;
        _proto.destroy = function () {
            _super.prototype.destroy.call(this, true);
            this.Mask = null;
            this.textValue = null;
            this.originHeight = null;
        };
        _proto.init = function (width) {
            this.originHeight = 60;

            var mask = new KeyBoardMask();
            mask.update(this.width, this.height, 0.5, "#000000", false);

            var text = new Laya.Label();
            text.height = 30;
            text.fontSize = 30;
            text.align = "center";

            this.Mask = mask;
            this.textValue = text;
            this.addChildren(mask, text);
        };
        _proto.update = function (value, color) {
            this.textValue.color = color;
            this.textValue.text = value;
        };
        _proto.resize = function (width, height) {
            var yrate = height / 1334;

            this.size(width, this.originHeight * yrate);
            this.Mask.resize(this.width, this.height);
            this.textValue.width = width;
            this.textValue.bottom = 0;
            this.top = -this.height;
        };

        return InputText;
    }(Laya.Box);

    var KeyBoardButton = function (_super) {
        function KeyBoardButton(config, callback) {
            KeyBoardButton.super(this);

            this.config = null;
            this.callback = null;
            this.label = null;

            this.init(config, callback);
        }

        Laya.class(KeyBoardButton, "", _super);
        var _proto = KeyBoardButton.prototype;
        _proto.destroy = function () {
            _super.prototype.destroy.call(this, true);

            this.config = null;
            this.callback = null;
            this.label = null;
        };

        _proto.init = function (config, callback) {
            config.width = 240;
            config.height = config.skin === "confirm" ? 210 : 100;
            this.config = config;

            this.skin = SKIN_PATH + config.skin + ".png";
            this.sizeGrid = "15,15,15,15";

            this.resize(Laya.stage.width, Laya.stage.height);
            this.create(config);

            this.on(EVENT_CLICK, this, callback, [config.text]);
        };
        _proto.create = function (config) {
            var label = new Laya.Label(config.text);
            label.color = config.skin === "confirm" ? "#ffffff" : "#1c1c1c";
            label.font = "arial";
            label.align = "center";
            label.fontSize = 40;
            label.size(this.width, label.fontSize);
            label.centerY = 0;

            this.label = label;
            this.addChild(label);
        };
        _proto.resize = function (width, height) {
            var xrate = width / 1334;
            var yrate = height / 1334;

            this.size(this.config.width * xrate, this.config.height * yrate);
            this.pos(this.config.x * xrate, this.config.y * yrate);
            this.label && (this.label.width = this.width);
        };

        return KeyBoardButton;
    }(Laya.Image);

    var KeyBoardPanel = function (_super) {
        function KeyBoardPanel() {
            KeyBoardPanel.super(this);

            this.keys = [];
            this.textValue = "";
            this.inputText = null;
            this.panelMask = null;

            this.init();
        }
        Laya.class(KeyBoardPanel, "", _super);
        var _proto = KeyBoardPanel.prototype;
        _proto.destroy = function () {
            _super.prototype.destroy.call(this, true);
        };

        _proto.init = function () {
            var height = Laya.stage.height;
            height = height < 750 ? 750 : height;

            this.size(Laya.stage.width, height / 1334 * 350);
            this.bottom = -this.height;

            var panelMask = new KeyBoardMask();
            panelMask.update(this.width, this.height, 0.5, "#000000", false);

            var inputText = new InputText();
            inputText.resize(this.width, height);

            this.inputText = inputText;
            this.panelMask = panelMask;
            this.addChildren(panelMask, inputText);

            for (var i in KEYS) {
                this.keys.push(new KeyBoardButton(KEYS[i], this.onClick.bind(this)));
            }
            _super.prototype.addChildren.apply(this, this.keys);
        };
        _proto.onClick = function (text) {
            this.event("input", [text]);
        };

        _proto.update = function (value, color) {
            this.inputText.update(value, color);
        };
        _proto.enter = function (value) {
            this.inputText.update(value, "#ffffff");

            Laya.Tween.to(this, { bottom: 0 }, 300, Laya.Ease.linearIn);
        };
        _proto.exit = function (type) {
            Laya.Tween.to(this, { bottom: -this.height }, 200, Laya.Ease.linearIn, Laya.Handler.create(this, function (type) {
                this.event("exit", [type]);
            }, [type]));
        };
        _proto.resize = function (width, height) {
            height = height < 750 ? 750 : height;

            var xrate = width / 1334;
            var yrate = height / 1334;

            this.size(width, 350 * yrate);
            this.panelMask.resize(this.width, this.height);

            this.inputText.resize(width, height);
            for (var i in this.keys) {
                this.keys[i].resize(width, height);
            }
        };

        return KeyBoardPanel;
    }(Laya.Box);

    (function (_super) {
        var DEFAULT_CONFIG = {
            "closeOnSide": true, //点击遮罩关闭键盘
            "shadowAlpha": 0.3, //遮罩的透明度
            "shadowColor": "#000000", //遮罩的颜色值
            "nullMsg": "输入的值不能为空", //输入的值为空时的提示
            "length": 11, //输入字段的最大长度（只针对整数位）
            "float": false, //是否允许有小数点
            "fixed": 4, //保留的小数位，仅在 float:true 时起作用
            "input": function input(value) {
                //输入时的回调函数，参数为当前输入的值
                console.log("当前输入值：" + value);
            },
            "close": function close(type, value) {
                //键盘关闭时的回调函数，参数为 type:(confirm|mask)从哪儿关闭， value:当前输入的值
                if (type === "confirm") {
                    console.log("点击了确定按钮，关闭输入键盘，当前值：" + value);
                } else {
                    console.log("点击了遮罩，关闭输入键盘。");
                }
            }
        };

        function KeyBoardNumber() {
            KeyBoardNumber.super(this);

            this.keyBoardMask = null;
            this.keyBoardPanel = null;
            this.config = null;
            this.textValue = "";
            this.firstInput = false;

            this.loadAssets();
        }

        Laya.class(KeyBoardNumber, "Tools.KeyBoardNumber", _super);
        var _proto = KeyBoardNumber.prototype;
        _proto.destroy = function () {
            Laya.stage.off(Laya.Event.RESIZE, this, this.onResize);
            _super.prototype.destroy.call(this, true);

            this.keyBoardMask = null;
            this.keyBoardPanel = null;
            this.config = null;
            this.textValue = null;
        };

        _proto.loadAssets = function () {
            var self = this;
            var loadedNum = 0;
            var totalNum = Object.keys(SKIN).length;

            for (var i in SKIN) {
                (function (url, data) {
                    var img = new Laya.HTMLImage.create(data, {
                        onload: function onload() {
                            Laya.Loader.cacheRes(SKIN_PATH + url + ".png", new Laya.Texture(img));
                            loadedNum++;
                            if (loadedNum === totalNum) {
                                self.init();
                            }
                        }
                    });
                })(i, SKIN[i]);
            }
        };
        _proto.init = function () {
            this.size(Laya.stage.width, Laya.stage.height);
            this.zOrder = 1000;

            var keyBoardPanel = new KeyBoardPanel(this.removeSelf.bind(this));
            keyBoardPanel.on("input", this, this.onInput);
            keyBoardPanel.on("exit", this, this.onExit);
            var keyBoardMask = new KeyBoardMask();
            keyBoardMask.on("exit", this, function (type) {
                keyBoardPanel.exit(type);
            });

            this.keyBoardMask = keyBoardMask;
            this.keyBoardPanel = keyBoardPanel;
            this.addChildren(keyBoardMask, keyBoardPanel);

            Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
        };
        _proto.onExit = function (type) {
            this.removeSelf();
            this.config.close && this.config.close(type, type === "confirm" ? this.textValue + "" : null);
            this.textValue = "";
            this.firstInput = false;
        };
        _proto.onInput = function (text) {
            switch (text) {
                case "删除":
                    var text = this.textValue.split("");
                    text.pop();
                    this.textValue = text.join("");

                    if (this.textValue) {
                        this.keyBoardPanel.update(this.textValue, "#ffffff");
                    } else {
                        this.keyBoardPanel.update(this.config.nullMsg, "#ff0000");
                    }
                    this.config.input && this.config.input(this.textValue);
                    break;
                case "确定":
                    this.keyBoardPanel.exit("confirm");
                    break;
                default:
                    if (this.firstInput) {
                        this.textValue = "";
                        this.firstInput = false;
                    }
                    if (text === ".") {
                        if (this.config.float !== true) {
                            return;
                        }
                        if (this.textValue == "") {
                            text = "0.";
                        }
                        if (this.textValue.indexOf(".") != -1) {
                            return;
                        }
                    }
                    if (this.config.float === true) {
                        var decimal = this.textValue.split(".")[1];
                        if (decimal && decimal.length >= this.config.fixed) {
                            return;
                        }
                    }
                    if ((this.textValue + text).length > this.config.length) {
                        return;
                    }

                    this.textValue = this.textValue + text;
                    this.textValue = this.textValue.replace(/^0+/, "");

                    this.config.input && this.config.input(this.textValue);
                    if (this.textValue) {
                        this.keyBoardPanel.update(this.textValue, "#ffffff");
                    } else {
                        this.keyBoardPanel.update(this.config.nullMsg, "#ff0000");
                    }
            }
        };

        _proto.enter = function (value, config) {
            // this.firstInput = true;
            this.config = utils.extend({}, DEFAULT_CONFIG, config);
            this.textValue = value + "";

            Laya.timer.callLater(this, function () {
                this.keyBoardMask.update(this.width, this.height, this.config.shadowAlpha, this.config.shadowColor, this.config.closeOnSide);
                this.keyBoardPanel.enter(this.textValue, this.config);
            });
            Laya.stage.addChild(this);
        };
        _proto.onResize = function () {
            var width = Laya.stage.width;
            var height = Laya.stage.height;
            this.size(width, height);

            this.keyBoardMask.resize(width, height);
            this.keyBoardPanel.resize(width, height);
        };
    })(Laya.Box);
})();
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
                        var warmNoticeUI = window.warmNoticeUI;

                        var CommonPopDialog = function (_commonPopUI) {
                                    _inherits(CommonPopDialog, _commonPopUI);

                                    function CommonPopDialog() {
                                                _classCallCheck(this, CommonPopDialog);

                                                var _this = _possibleConstructorReturn(this, (CommonPopDialog.__proto__ || Object.getPrototypeOf(CommonPopDialog)).call(this));

                                                _this.init();

                                                return _this;
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
                                                            // 取消按钮
                                                            this.btn_no = this.btn_box.getChildByName('btn_no');

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
                                                            this.btn_no.on(Laya.Event.CLICK, this, this.close);

                                                            // 订阅弹层出现
                                                            app.observer.subscribe('commonPopShow', this.myShow.bind(this));
                                                }
                                    }, {
                                                key: 'initConfig',
                                                value: function initConfig() {
                                                            this.config = {
                                                                        limitTime: false, //限制时间
                                                                        txtBgDis: this.txt_content.y,
                                                                        popBgDis: this.pop_bg.height - this.txt_bg.height,
                                                                        'timeout': '由于超时未操作，系统以为您退出房间！',
                                                                        'unstable': '客观，您的网络不稳定，请检查网络！'
                                                            };

                                                            this.callback = null;
                                                }
                                    }, {
                                                key: 'myShow',
                                                value: function myShow(txt) {
                                                            var _this2 = this;

                                                            var boolean = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
                                                            var callback = arguments[2];

                                                            var _txt = this.config[txt] ? this.config[txt] : txt;

                                                            // 内容已经在弹出来了(防止多次弹出相同内容)
                                                            if (this.txt_content.text === _txt && this.config.limitTime) {

                                                                        return;
                                                            }

                                                            this.config.limitTime = true;
                                                            Laya.timer.once(3000, this, function () {
                                                                        _this2.config.limitTime = false;
                                                            });

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

                        var WarmNoticePopDialog = function (_warmNoticeUI) {
                                    _inherits(WarmNoticePopDialog, _warmNoticeUI);

                                    function WarmNoticePopDialog() {
                                                _classCallCheck(this, WarmNoticePopDialog);

                                                var _this3 = _possibleConstructorReturn(this, (WarmNoticePopDialog.__proto__ || Object.getPrototypeOf(WarmNoticePopDialog)).call(this));

                                                _this3.init();

                                                return _this3;
                                    }

                                    _createClass(WarmNoticePopDialog, [{
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
                                                            this.btn_sure.on(Laya.Event.CLICK, this, this.close);

                                                            // 订阅弹层出现
                                                            app.observer.subscribe('warmNoticePopShow', this.myShow.bind(this));

                                                            // 自动关闭
                                                            app.observer.subscribe('warmNoticePopHide', this.myClose.bind(this));
                                                }
                                    }, {
                                                key: 'initConfig',
                                                value: function initConfig() {
                                                            this.config = {
                                                                        limitTime: false, //限制时间
                                                                        txtBgDis: this.txt_content.y,
                                                                        popBgDis: this.pop_bg.height - this.txt_bg.height
                                                            };

                                                            this.callback = null;
                                                }
                                    }, {
                                                key: 'myShow',
                                                value: function myShow(txt) {
                                                            var _this4 = this;

                                                            var boolean = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
                                                            var callback = arguments[2];

                                                            var _txt = this.config[txt] ? this.config[txt] : txt;

                                                            // 内容已经在弹出来了(防止多次弹出相同内容)
                                                            if (this.txt_content.text === _txt && this.config.limitTime) {

                                                                        return;
                                                            }

                                                            this.config.limitTime = true;
                                                            Laya.timer.once(3000, this, function () {
                                                                        _this4.config.limitTime = false;
                                                            });

                                                            this.txt_content.text = _txt;

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

                                                            this.txt_content.text = '';
                                                            this.close();
                                                }
                                    }]);

                                    return WarmNoticePopDialog;
                        }(warmNoticeUI);

                        app.CommonPopDialog = CommonPopDialog;
                        app.WarmNoticePopDialog = WarmNoticePopDialog;
            })();
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 *  福袋弹层
 */
{
        (function () {
                var app = window.app;
                var fudaiPopUI = window.fudaiPopUI;

                var FudaiPopUIDialog = function (_fudaiPopUI) {
                        _inherits(FudaiPopUIDialog, _fudaiPopUI);

                        function FudaiPopUIDialog() {
                                var _ref;

                                _classCallCheck(this, FudaiPopUIDialog);

                                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                                        args[_key] = arguments[_key];
                                }

                                var _this = _possibleConstructorReturn(this, (_ref = FudaiPopUIDialog.__proto__ || Object.getPrototypeOf(FudaiPopUIDialog)).call.apply(_ref, [this].concat(args)));

                                _this.init();
                                return _this;
                        }

                        _createClass(FudaiPopUIDialog, [{
                                key: 'init',
                                value: function init() {

                                        this.initDom();

                                        this.initConfig();

                                        this.addMask();

                                        // 注册
                                        this.registerAction();
                                }

                                // 注册

                        }, {
                                key: 'registerAction',
                                value: function registerAction() {

                                        // 订阅弹层出现
                                        app.observer.subscribe('fudaiPopShow', this.myShow.bind(this));
                                }

                                // 触发

                        }, {
                                key: 'dispatchAction',
                                value: function dispatchAction(data) {

                                        // 更新用户钥匙数目
                                        // app.observer.publish('updateKeyNum', Number(data.totalKeys));

                                        // 更新用户余额
                                        app.messageCenter.emitAjax("userAccount");
                                }
                        }, {
                                key: 'initDom',
                                value: function initDom() {

                                        this.dom_fudai.stop();
                                }

                                // 初始化配置参数

                        }, {
                                key: 'initConfig',
                                value: function initConfig() {
                                        this.config = {
                                                MASK_W: this.dom_content_box.width,
                                                MASK_H: this.dom_content_box.height,
                                                currentW: 0 //遮罩当前的宽
                                        };
                                }
                        }, {
                                key: 'initEvent',
                                value: function initEvent() {}

                                // 添加遮罩

                        }, {
                                key: 'addMask',
                                value: function addMask() {
                                        this.text_content.mask = new Laya.Sprite();
                                }

                                // 遮罩变化

                        }, {
                                key: 'maskChange',
                                value: function maskChange() {
                                        this.config.currentW += 16;
                                        var _x = this.config.MASK_W / 2 - this.config.currentW / 2;
                                        if (_x <= 0) {
                                                Laya.timer.clear(this, this.maskChange);
                                                return;
                                        }
                                        this.text_content.mask.graphics.clear();
                                        this.text_content.mask.graphics.drawRect(_x, 0, this.config.currentW, this.config.MASK_H, '#000000');
                                }

                                // 开启遮罩动画

                        }, {
                                key: 'maskAnimateGo',
                                value: function maskAnimateGo() {
                                        Laya.timer.loop(50, this, this.maskChange);
                                }

                                // 出现

                        }, {
                                key: 'myShow',
                                value: function myShow(data, callback) {
                                        var _this2 = this;

                                        if (Number(data.code) !== 0) {
                                                return;
                                        }

                                        this.dom_fudai.once(Laya.Event.STOPPED, this, function () {
                                                _this2.dom_fudai.play('loop', true);

                                                // 更新钥匙数量
                                                callback && callback(data.totalKeys);
                                                Laya.timer.once(5000, _this2, _this2.reset);
                                        });

                                        // 开启遮罩动画
                                        this.maskAnimateGo();

                                        this.dom_fudai.play('start', false);

                                        this.text_content.text = data.amount;

                                        // 触发
                                        this.dispatchAction(data);

                                        this.popup();
                                }

                                // 重置

                        }, {
                                key: 'reset',
                                value: function reset() {
                                        this.dom_fudai.stop();
                                        Laya.timer.clear(this, this.maskChange);
                                        this.config.currentW = 0;
                                        this.close();
                                }
                        }]);

                        return FudaiPopUIDialog;
                }(fudaiPopUI);

                app.FudaiPopUIDialog = FudaiPopUIDialog;
        })();
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 *  菜单只包含在头部场景中，所以菜单只在头部场景实例化
 */
{
    (function () {
        var app = window.app;
        var GM = window.GM;

        var HeaderScene = function () {
            function HeaderScene(obj) {
                _classCallCheck(this, HeaderScene);

                this.sceneName = 'headerScene';

                // 父元素传进来
                this.top_box = obj;
                this.init();
            }

            _createClass(HeaderScene, [{
                key: "init",
                value: function init() {

                    // 提高层级
                    this.top_box.zOrder = 1;

                    this.initDom();

                    this.initConfig();

                    // 初始化事件
                    this.initEvent();

                    this.initSoundState();

                    // 注册
                    this.registerAction();

                    // 是否显示返回按钮
                    this.isShowBtnBackHandler();

                    // 是否要显示主页按钮
                    this.isShowBtnHomeHandler();
                }

                // 注册

            }, {
                key: "registerAction",
                value: function registerAction() {
                    app.messageCenter.registerAction("userAccount", this.renderUserAmount.bind(this)) // 用户余额
                    .registerAction("marquee", this.noticeMainHandler.bind(this)) // 公告
                    .registerAction("losePointStatus", this.losePointStatusFn.bind(this)) // 输分禁用
                    .registerAction("losePoint", this.losePointFn.bind(this)); // 输分提醒

                    app.observer.subscribe('updateUserYuDou', this.updateUserYuDou.bind(this));
                }

                // 触发

            }, {
                key: "dispatchAction",
                value: function dispatchAction() {
                    app.messageCenter.emitAjax("userAccount");
                }
            }, {
                key: "initDom",
                value: function initDom() {

                    // 退出房间按钮
                    this.btn_back = this.top_box.getChildByName('btn_back');
                    this.btn_back.visible = false;
                    this.btn_home = this.top_box.getChildByName('btn_home');
                    this.btn_home.visible = false;
                    // 菜单
                    this.btn_menu = this.top_box.getChildByName('btn_menu');
                    this.more_box = this.top_box.getChildByName('more_box');
                    // 声音按钮
                    this.sound_btn = this.more_box.getChildByName('sound_btn');
                    this.help_btn = this.more_box.getChildByName('help_btn');

                    this.yu_box = this.top_box.getChildByName('yu_box');
                    this.you_box = this.top_box.getChildByName('you_box');

                    // 跑马灯
                    this.marquee_box = this.top_box.getChildByName('marquee_box');
                    this.dom_marquee = this.marquee_box.getChildByName('dom_marquee');

                    // 充值按钮
                    this.btn_chong = this.yu_box.getChildByName('btn_chong');
                    // 挺豆
                    this.dom_dou_num = this.yu_box.getChildByName('yu_num');
                    // 余额
                    this.dom_yu_num = this.you_box.getChildByName('you_num');

                    // 初始化跑马灯
                    this.initMarquee();
                }
            }, {
                key: "initConfig",
                value: function initConfig() {
                    this.config = {
                        isFirstDefault: false, // 是否第一次默认押注金额提示
                        soundStateKey: 'superstars_sound', //声音的状态
                        stateSound: '', //声音的状态
                        tingDou: 0,
                        yuNum: 0
                    };
                }

                // 初始化事件可能会在频繁remove后被移除，故在外部被add后初始化
                //直接写在内部的事件却不会被移除（疑问？？？）

            }, {
                key: "initEvent",
                value: function initEvent() {
                    var _this = this;

                    // 菜单
                    this.btn_menu.on(Laya.Event.CLICK, this, function () {

                        _this.more_box.visible = !_this.more_box.visible;
                        app.audio.play('click');
                    });

                    // 声音
                    this.sound_btn.on(Laya.Event.CLICK, this, this.changeSoundState);

                    // 帮助按钮
                    this.help_btn.on(Laya.Event.CLICK, this, function () {
                        app.observer.publish('helpPopShow');
                        _this.more_box.visible = false;
                        app.audio.play('click');
                    });

                    // 余额查询
                    this.dom_yu_num.on(Laya.Event.CLICK, this, this.yuNumPopBalanceShow);

                    // 充值按钮
                    this.btn_chong.on(Laya.Event.CLICK, this, function () {

                        // 发布
                        app.observer.publish("rechargePopShow");
                        app.audio.play('click');
                    });

                    // 点击其它区域菜单隐藏
                    Laya.stage.on(Laya.Event.CLICK, this, function (event) {
                        var _target = event.target;
                        if (_this.more_box.visible && _target !== _this.btn_menu && _target !== _this.more_box && !_this.more_box.contains(_target)) {

                            _this.more_box.visible = false;
                        }
                    });
                }

                // 初始化跑马灯

            }, {
                key: "initMarquee",
                value: function initMarquee() {
                    var options = { colorHigh2: '#ffe400', fontSize: 25 };
                    // y方向更居中一点
                    this.dom_marquee.y = 8;

                    // 跑马灯内容
                    this.marquee_ui_box = new app.MarqueeLaya(this.dom_marquee, options);
                }

                // 公告渲染

            }, {
                key: "noticeMainHandler",
                value: function noticeMainHandler(data) {
                    if (Number(data.code) === 0) {
                        this.marquee_ui_box.start(data.notice);
                    }
                }

                // 初始化声音状态

            }, {
                key: "initSoundState",
                value: function initSoundState() {
                    // 存cookie
                    var _current = app.audio.getCookie(this.config.soundStateKey);

                    if (_current === 'false') {
                        this.config.stateSound = 'false';
                        this.sound_btn.index = 1;

                        // 静音
                        app.audio.setMuted();

                        return;
                    }

                    if (_current === '') {
                        app.audio.setCookie(this.config.soundStateKey, 'true');
                    }

                    this.config.stateSound = 'true';
                    this.sound_btn.index = 0;

                    // 打开声音
                    app.audio.setMutedNot();
                }

                // 改变声音状态

            }, {
                key: "changeSoundState",
                value: function changeSoundState() {
                    app.audio.play('click');

                    if (this.config.stateSound === 'true') {
                        this.config.stateSound = 'false';
                        this.sound_btn.index = 1;
                        app.audio.setMuted();
                    } else {
                        this.config.stateSound = 'true';
                        this.sound_btn.index = 0;
                        app.audio.setMutedNot();
                    }

                    app.audio.setCookie(this.config.soundStateKey, this.config.stateSound);
                }

                // 渲染用户金额

            }, {
                key: "renderUserAmount",
                value: function renderUserAmount(data) {
                    this.config.tingDou = Number(data.TCoin) || 0;
                    this.config.yuNum = Number(data.total) - this.config.tingDou || 0;

                    this.dom_dou_num.text = app.utils.getActiveStr(this.config.tingDou);
                    this.dom_yu_num.text = app.utils.getActiveStr(this.config.yuNum);

                    // 默认押注金额提示
                    this.defaultInputNotice();
                }

                // 游戏中更新挺豆 & 余额

            }, {
                key: "updateUserYuDou",
                value: function updateUserYuDou(num) {
                    // 增加余额
                    if (num >= 0) {
                        this._updateUserYu(num);

                        // 扣减余额
                    } else {
                        //挺豆够扣的话就扣挺豆
                        if (this.config.tingDou + num >= 0) {
                            this._updateUserDou(num);

                            //否则扣余额
                        } else {
                            this._updateUserYu(num);
                        }
                    }
                }

                // 更新用户余额（右边）

            }, {
                key: "_updateUserYu",
                value: function _updateUserYu(num) {
                    this.config.yuNum = this.config.yuNum + num;
                    this.dom_yu_num.text = app.utils.getActiveStr(this.config.yuNum);
                }

                // 更新用户挺豆（左边）

            }, {
                key: "_updateUserDou",
                value: function _updateUserDou(num) {
                    this.config.tingDou = this.config.tingDou + num;
                    this.dom_dou_num.text = app.utils.getActiveStr(this.config.tingDou);
                }

                // 默认提示按住额提示

            }, {
                key: "defaultInputNotice",
                value: function defaultInputNotice() {
                    if (this.config.isFirstDefault) {
                        return;
                    }
                    this.config.isFirstDefault = true;

                    var tingDou = this.config.tingDou;
                    var yuNum = this.config.yuNum;
                    var total = tingDou > yuNum ? tingDou : yuNum;
                    var inputNum = void 0;
                    var cookieBet = this.defaultBetHandler(yuNum);

                    if (typeof cookieBet === 'number') {
                        inputNum = cookieBet;
                    } else {
                        // 处理倍率
                        inputNum = this.dealWithNum(total);
                    }

                    // 默认按住额
                    app.observer.publish('warmNoticePopShow', "默认投币额：" + inputNum);

                    Laya.timer.once(1500, this, function () {
                        app.observer.publish('warmNoticePopHide');
                    });

                    //更新投币金额
                    app.observer.publish('updateDomInput', inputNum);
                }

                // 初始化默认投注额

            }, {
                key: "defaultBetHandler",
                value: function defaultBetHandler(restScore) {
                    var cookie = GM.CookieUtil.get("defaultBet" + GM.gameId + GM.user_id);
                    var defaultBet = cookie ? parseInt(cookie, 10) : null;

                    if (defaultBet && defaultBet <= Number(restScore)) {
                        // restScore 平台子账户余额
                        return defaultBet; //  将游戏原有的默认押注额改为cookies里面存的值
                    }
                }

                // 处理倍率

            }, {
                key: "dealWithNum",
                value: function dealWithNum(total) {
                    var result = void 0;
                    var isAdd = false; //是否进位
                    if (total <= 10000) {
                        result = 100;
                    } else {
                        result = Math.ceil(total / 100);

                        // 先转字符串
                        result = String(result);
                        for (var i = 1, l = result.length; i < l; i++) {
                            if (result[i] !== '0') {
                                isAdd = true;
                            }
                        }

                        result = isAdd ? Number(result[0]) + 1 + result.slice(1).replace(/\d/g, '0') : result;
                    }

                    // 最后转数字
                    result = Number(result);
                    result = result > 500000 ? 500000 : result;

                    return result;
                }

                // 不中险&救济金

            }, {
                key: "activityShow",
                value: function activityShow(data) {
                    var _prize = '';
                    var txt = '';
                    if (data.buzhongxian) {
                        _prize = data.buzhongxian.prizePoint;
                        txt = "恭喜赢取不中险，金额： " + _prize;
                    } else if (data.helpAmount) {
                        _prize = data.helpAmount.prizePoint;
                        txt = "恭喜赢取救济金，金额： " + _prize;
                    }

                    // 不中险加入余额中
                    this.updateUserYuDou(_prize);

                    // 仅读弹层
                    app.observer.publish('onlyReadPopShow', txt);
                }

                // 输分提醒

            }, {
                key: "losePointFn",
                value: function losePointFn(data) {
                    var losePL = data;
                    var _level = losePL.level;
                    var text = "\u60A8\u7684\u8F93\u5206\u91D1\u989D\u5DF2\u8FBE\u4E0A\u9650\uFF0C\u6545\u8D26\u6237\u7981\u7528\u5F00\u59CB\u65F6\u95F4\uFF1A" + losePL.beginTime + "\uFF0C\u7981\u7528\u7ED3\u675F\u65F6\u95F4\uFF1A" + losePL.endTime;
                    if (_level === 2 || _level === 3) {
                        app.observer.publish('commonPopShow', text, true);
                    }

                    // 停止游戏
                    app.observer.publish('errorHandler', { code: 'losePoint' });
                }

                // 黑名单输分禁用

            }, {
                key: "losePointStatusFn",
                value: function losePointStatusFn(data) {
                    var text = '客官，您已被输分禁用，请联系客服！';
                    app.observer.publish('commonPopShow', text, true);

                    // 停止游戏
                    app.observer.publish('errorHandler', { code: 'losePoint' });
                }

                // 余额查询

            }, {
                key: "yuNumPopBalanceShow",
                value: function yuNumPopBalanceShow() {
                    app.audio.play('click');
                    if (GM && GM.isCall_out === 1 && GM.popBalanceShow_out) {
                        // audio.play('an_niu');

                        GM.popBalanceShow_out(GM.gameType);
                    }
                }

                // 是否要显示返回按钮

            }, {
                key: "isShowBtnBackHandler",
                value: function isShowBtnBackHandler() {
                    // Laya 返回按钮
                    if (window.GM && GM.isCall_out === 1 && GM.isShowBtnBack_out && GM.btnBackCall_out) {
                        this.btn_back.visible = true; // 显示返回按钮
                        this.btn_back.on(Laya.Event.CLICK, this, GM.btnBackCall_out);
                    }
                }

                // 是否要显示home主页按钮

            }, {
                key: "isShowBtnHomeHandler",
                value: function isShowBtnHomeHandler() {
                    if (GM.backHomeUrl) {
                        // 显示按钮
                        this.btn_home.visible = true;
                        // 绑定事件
                        this.btn_home.on(Laya.Event.CLICK, this, function () {
                            location.href = GM.backHomeUrl;
                        });
                    }
                }
            }]);

            return HeaderScene;
        }();

        app.HeaderScene = HeaderScene;
    })();
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 *  帮助页
 */
{
        (function () {
                var app = window.app;
                var helpPopUI = window.helpPopUI;

                var HelpPopUIDialog = function (_helpPopUI) {
                        _inherits(HelpPopUIDialog, _helpPopUI);

                        function HelpPopUIDialog() {
                                var _ref;

                                _classCallCheck(this, HelpPopUIDialog);

                                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                                        args[_key] = arguments[_key];
                                }

                                var _this = _possibleConstructorReturn(this, (_ref = HelpPopUIDialog.__proto__ || Object.getPrototypeOf(HelpPopUIDialog)).call.apply(_ref, [this].concat(args)));

                                _this.init();
                                return _this;
                        }

                        _createClass(HelpPopUIDialog, [{
                                key: 'init',
                                value: function init() {

                                        this.initDom();

                                        this.initConfig();

                                        // 初始化事件
                                        this.initEvent();

                                        // 注册
                                        this.registerAction();
                                }

                                // 注册

                        }, {
                                key: 'registerAction',
                                value: function registerAction() {
                                        // app.messageCenter.registerAction("rankInfomation", this.renderUserAmount.bind(this))

                                        // 订阅弹层出现
                                        app.observer.subscribe('helpPopShow', this.myShow.bind(this));
                                }

                                // 触发

                        }, {
                                key: 'dispatchAction',
                                value: function dispatchAction() {}
                        }, {
                                key: 'initDom',
                                value: function initDom() {

                                        // 初始化帮助页滑动效果
                                        new window.zsySlider(this.help_glr);
                                }

                                // 初始化配置参数

                        }, {
                                key: 'initConfig',
                                value: function initConfig() {
                                        this.config = {};
                                }
                        }, {
                                key: 'initEvent',
                                value: function initEvent() {
                                        this.getChildByName('close1').on(Laya.Event.CLICK, this, this.close);
                                        this.getChildByName('close2').on(Laya.Event.CLICK, this, this.close);
                                }

                                // 出现

                        }, {
                                key: 'myShow',
                                value: function myShow() {

                                        // 触发
                                        this.dispatchAction();

                                        this.popup();
                                }
                        }]);

                        return HelpPopUIDialog;
                }(helpPopUI);

                app.HelpPopUIDialog = HelpPopUIDialog;
        })();
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// loading页
{
    (function () {
        var app = window.app;

        var LoadingScene = function (_window$loadingUI) {
            _inherits(LoadingScene, _window$loadingUI);

            function LoadingScene() {
                _classCallCheck(this, LoadingScene);

                var _this = _possibleConstructorReturn(this, (LoadingScene.__proto__ || Object.getPrototypeOf(LoadingScene)).call(this));

                _this.sceneName = "loadingScene";
                _this.init();
                return _this;
            }

            //初始化


            _createClass(LoadingScene, [{
                key: "init",
                value: function init() {

                    this.initDom();

                    //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
                    app.observer.subscribe(this.sceneName + "_enter", this.onEnter.bind(this));
                }
            }, {
                key: "onEnter",
                value: function onEnter() {

                    app.utils.log(this.sceneName + " enter");

                    //取消订阅时不用传递回调函数
                    app.observer.unsubscribe(this.sceneName + "_enter");
                }
            }, {
                key: "initDom",
                value: function initDom() {}

                // 加载运动条

            }, {
                key: "loading",
                value: function loading(percent) {
                    var per = Math.floor(percent * 100);
                    var w = per / 100 * 600;
                    this.dom_process_txt.text = per > 97 ? 100 + '%' : per + '%';
                    this.dom_process_img.width = w < 30 ? 30 : w;
                }

                // 退出场景

            }, {
                key: "onExit",
                value: function onExit() {
                    app.utils.log(this.sceneName + " exit");

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

            return LoadingScene;
        }(window.loadingUI);

        app.LoadingScene = LoadingScene;
    })();
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 *  排行榜
 */
{
    (function () {
        var app = window.app;
        var rankPopUI = window.rankPopUI;

        var RankPopDialog = function (_rankPopUI) {
            _inherits(RankPopDialog, _rankPopUI);

            function RankPopDialog() {
                var _ref;

                _classCallCheck(this, RankPopDialog);

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var _this = _possibleConstructorReturn(this, (_ref = RankPopDialog.__proto__ || Object.getPrototypeOf(RankPopDialog)).call.apply(_ref, [this].concat(args)));

                _this.init();
                return _this;
            }

            _createClass(RankPopDialog, [{
                key: "init",
                value: function init() {

                    this.initDom();

                    this.initConfig();

                    // 初始化事件
                    this.initEvent();

                    // 注册
                    this.registerAction();
                }

                // 注册

            }, {
                key: "registerAction",
                value: function registerAction() {
                    app.messageCenter.registerAction("rank", this.renderUserAmount.bind(this)).registerAction("day", this.renderRankList.bind(this)).registerAction("week", this.renderRankList.bind(this)).registerAction("month", this.renderRankList.bind(this));

                    // 订阅弹层出现
                    app.observer.subscribe('rankPopShow', this.myShow.bind(this));
                }

                // 触发

            }, {
                key: "dispatchAction",
                value: function dispatchAction() {

                    // 加载中
                    this.isLoadingOrContent(1);
                    // 发送ajax
                    app.messageCenter.emitAjax('day');
                    app.messageCenter.emit('rank');
                }
            }, {
                key: "initDom",
                value: function initDom() {

                    // 关闭
                    this.dom_close_btn = this.getChildByName('close_btn');

                    // 土豪榜列表
                    this.dom_rich_list = this.find('item', true);
                }

                // 初始化配置参数

            }, {
                key: "initConfig",
                value: function initConfig() {
                    this.config = {
                        isFirstMyList: true, //第一次渲染我的战绩
                        periodArr: ['day', 'week', 'month'],
                        isFirst: true //第一次进来
                    };
                }

                //直接写在内部的事件却不会被移除（疑问？？？）

            }, {
                key: "initEvent",
                value: function initEvent() {

                    // 关闭按钮
                    this.dom_close_btn.on(Laya.Event.CLICK, this, this.close);

                    // 跳登录
                    this.dom_unloaded.on(Laya.Event.CLICK, this, app.utils.gotoLogin);
                    this.dom_unloaded.color = '#d9e200';

                    // tab切换
                    this.tab_nav.selectHandler = Laya.Handler.create(this, this.tabSwitchHandler, null, false);
                }

                // tab切换

            }, {
                key: "tabSwitchHandler",
                value: function tabSwitchHandler(index) {
                    var _target = 0;
                    var type = void 0;

                    if (index === 3) {
                        _target = 1;

                        this.isLoadingOrContent(1);

                        // 发送排行榜请求
                        app.messageCenter.emit('rank');
                    } else {
                        _target = 0;
                        type = this.config.periodArr[index];

                        // 加载中
                        this.isLoadingOrContent(1);
                        // 发送ajax
                        app.messageCenter.emitAjax(type);
                    }

                    this.tab_con.selectedIndex = _target;

                    app.audio.play('click');
                }

                // 加载中。。。or 显示数据

            }, {
                key: "isLoadingOrContent",
                value: function isLoadingOrContent(type) {
                    // 暂无数据
                    if (type === 0) {
                        this.dom_loading.visible = true;
                        this.dom_loading.text = '虚位以待...';
                        this.tab_con.visible = false;
                        this.dom_unloaded.visible = false;

                        // 加载中
                    } else if (type === 1) {
                        this.dom_loading.visible = true;
                        this.dom_loading.text = '加载中...';
                        this.tab_con.visible = false;
                        this.dom_unloaded.visible = false;

                        // 显示内容
                    } else if (type === 2) {
                        this.dom_loading.visible = false;
                        this.tab_con.visible = true;
                        this.dom_unloaded.visible = false;

                        // 未登录
                    } else if (type === 3) {
                        this.dom_loading.visible = false;
                        this.tab_con.visible = false;
                        this.dom_unloaded.visible = true;
                    }
                }

                // 富豪榜渲染

            }, {
                key: "renderRichList",
                value: function renderRichList(data) {
                    var top3 = data.top3;

                    this.dom_rich_list.forEach(function (item, index) {
                        var _data = top3[index];
                        var _dom_rank = item.getChildByName('rank');
                        var _dom_name = item.getChildByName('name');
                        var _dom_point = item.getChildByName('point');

                        if (_data) {
                            _dom_rank.visible = true;
                            _dom_name.text = app.utils.getActiveStr(_data.userName, 9);
                            _dom_point.text = app.utils.getActiveStr(parseInt(_data.amount), 10);
                            _dom_point.visible = true;
                        } else {
                            _dom_rank.visible = true;
                            _dom_name.text = '虚位以待...';
                            _dom_point.visible = false;
                        }
                    });
                }

                // 富豪榜和我的战绩

            }, {
                key: "renderUserAmount",
                value: function renderUserAmount(data) {

                    this.renderRichList(data);

                    // 第一次不渲染了
                    if (this.config.isFirstMyList) {
                        this.config.isFirstMyList = false;
                        return;
                    }

                    this.renderMyList(data);
                }

                // 渲染周期日周月排行

            }, {
                key: "renderRankList",
                value: function renderRankList(response) {
                    if (Number(response.code) !== 0) {
                        return;
                    }

                    var result = [];
                    response.data.forEach(function (item, index) {
                        var trend = Number(item.rank_trend);
                        result.push({
                            rankIcon: index,
                            rankNum: {
                                text: index + 1,
                                visible: index > 2 ? true : false
                            },
                            name: app.utils.getActiveStr(item.nickname, 9),
                            point: app.utils.getActiveStr(parseInt(item.amount), 10),
                            tend: trend === 3 ? 0 : trend
                        });
                    });

                    // 年月日公共的list
                    this.list_rank_all.array = result;

                    if (response.data.length === 0) {
                        this.isLoadingOrContent(0);
                    } else {
                        this.isLoadingOrContent(2);
                    }
                }

                // 我的战绩渲染

            }, {
                key: "renderMyList",
                value: function renderMyList(data) {
                    var myRewards = data.myRewards;
                    var result = [];
                    myRewards.forEach(function (item, index) {
                        result.push({
                            time: item.addTime,
                            point: {
                                text: app.utils.getActiveStr(parseInt(item.amount), 10),
                                color: item.isTreasure ? '#ffec4f' : '#fff'
                            },
                            isSelf: {
                                visible: item.isTreasure
                            }
                        });
                    });

                    // 我的战绩
                    this.list_rank_my.array = result;

                    if (myRewards.length === 0) {
                        // 已登录
                        if (app.utils.checkLoginStatus()) {
                            this.isLoadingOrContent(0);
                        } else {
                            this.isLoadingOrContent(3);
                        }
                    } else {
                        this.isLoadingOrContent(2);
                    }
                }

                // 出现

            }, {
                key: "myShow",
                value: function myShow() {
                    if (this.config.isFirst) {
                        // 触发
                        this.dispatchAction();
                        this.config.isFirst = false;
                    }

                    this.popup();
                }
            }]);

            return RankPopDialog;
        }(rankPopUI);

        app.RankPopDialog = RankPopDialog;
    })();
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 *  帮助页
 */
{
        (function () {
                var app = window.app;
                var rechargePopUI = window.rechargePopUI;

                var RechargePopDialog = function (_rechargePopUI) {
                        _inherits(RechargePopDialog, _rechargePopUI);

                        function RechargePopDialog() {
                                var _ref;

                                _classCallCheck(this, RechargePopDialog);

                                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                                        args[_key] = arguments[_key];
                                }

                                var _this = _possibleConstructorReturn(this, (_ref = RechargePopDialog.__proto__ || Object.getPrototypeOf(RechargePopDialog)).call.apply(_ref, [this].concat(args)));

                                _this.init();
                                return _this;
                        }

                        _createClass(RechargePopDialog, [{
                                key: 'init',
                                value: function init() {

                                        this.initDom();

                                        this.initConfig();

                                        // 初始化事件
                                        this.initEvent();

                                        // 注册
                                        this.registerAction();
                                }

                                // 注册

                        }, {
                                key: 'registerAction',
                                value: function registerAction() {
                                        // app.messageCenter.registerAction("rankInfomation", this.renderUserAmount.bind(this))


                                        // 订阅弹层
                                        app.observer.subscribe('rechargePopShow', this.myShow.bind(this));
                                }

                                // 触发

                        }, {
                                key: 'dispatchAction',
                                value: function dispatchAction() {}
                        }, {
                                key: 'initDom',
                                value: function initDom() {
                                        // 输入框值
                                        this.input_txt = this.btn_input.getChildByName('input_txt');
                                        this.input_txt.text = '100';
                                }

                                // 初始化配置参数

                        }, {
                                key: 'initConfig',
                                value: function initConfig() {
                                        this.config = {
                                                rechargeNum: ['10', '50', '100', '500'],
                                                info: '请输入大于0的整数'
                                        };
                                }
                        }, {
                                key: 'initEvent',
                                value: function initEvent() {

                                        // 确定充值
                                        this.btn_buy.on(Laya.Event.CLICK, this, this.ensureFn);

                                        // 输入框
                                        this.btn_input.on(Laya.Event.CLICK, this, this.showKeyBoardNumber);

                                        this.tab_nav.selectHandler = Laya.Handler.create(this, this.tabBtnChoose, null, false);
                                }

                                // 显示键盘

                        }, {
                                key: 'showKeyBoardNumber',
                                value: function showKeyBoardNumber() {
                                        // let txt = this.input_txt.text;
                                        app.keyBoardNumber_ui_pop.enter('', {
                                                length: 8,
                                                close: this.hideKeyBoardNumber.bind(this),
                                                input: null
                                        });
                                }

                                // 键盘退出

                        }, {
                                key: 'hideKeyBoardNumber',
                                value: function hideKeyBoardNumber(type, value) {
                                        if (type === "confirm") {
                                                var _index = this.config.rechargeNum.indexOf(String(value));
                                                this.input_txt.text = value;
                                                this.tab_nav.selectedIndex = _index;
                                        }
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

                                // 出现

                        }, {
                                key: 'myShow',
                                value: function myShow() {

                                        // 触发
                                        this.dispatchAction();

                                        this.popup();
                                }
                        }]);

                        return RechargePopDialog;
                }(rechargePopUI);

                app.RechargePopDialog = RechargePopDialog;
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
                                                            this.initDom();
                                                            this.initAnimate();
                                                            this.initConfig();
                                                            this.initEvent();

                                                            // 两只按钮准备
                                                            this.buttonPrepare();

                                                            //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
                                                            app.observer.subscribe(this.sceneName + "_enter", this.onEnter.bind(this));
                                                }
                                    }, {
                                                key: "onEnter",
                                                value: function onEnter() {
                                                            app.utils.log(this.sceneName + " enter");

                                                            //取消订阅时不用传递回调函数
                                                            app.observer.unsubscribe(this.sceneName + "_enter");

                                                            // 头部初始化
                                                            this.header_ui_box = new app.HeaderScene(this.top_box);

                                                            // 注册
                                                            this.registerAction();

                                                            // 触发
                                                            this.dispatchAction();

                                                            // 开启变换小手
                                                            this.startChangeFinger();

                                                            // 登录在触发
                                                            if (this.config.isLogin) {
                                                                        // 头部触发
                                                                        this.header_ui_box.dispatchAction();
                                                            }

                                                            // 公告
                                                            this.noticeSystem();

                                                            // 开启随机渲染问号
                                                            this.startRandomWenhao();
                                                }

                                                // 注册

                                    }, {
                                                key: "registerAction",
                                                value: function registerAction() {
                                                            app.messageCenter.registerAction("initGame", this.initGameRoomInfo.bind(this)) // 初始化游戏信息
                                                            .registerAction("bet", this.resultCome.bind(this)) //结果过来了
                                                            .registerAction("pool", this.renderPool.bind(this)) // 渲染福袋奖池总金额
                                                            .registerAction("treasure", this.treasureHandler.bind(this)); // 福袋中奖

                                                            app.observer.subscribe('updateDomInput', this.updateDomInput.bind(this)) //更新投币金额
                                                            .subscribe('errorHandler', this.errorHandler.bind(this)); //错误处理
                                                }

                                                // 取消注册

                                    }, {
                                                key: "unRegisterAction",
                                                value: function unRegisterAction() {}
                                                // 取消订阅盈利榜金额更新
                                                // app.observer.unsubscribe('upDatePool');

                                                // app.messageCenter.unRegisterAction('initGame')

                                                // 触发

                                    }, {
                                                key: "dispatchAction",
                                                value: function dispatchAction() {
                                                            // 初始化游戏
                                                            app.messageCenter.emit('initGame');
                                                }

                                                // 配置参数

                                    }, {
                                                key: "initConfig",
                                                value: function initConfig() {
                                                            // 全体左移4px
                                                            this.starArr.forEach(function (item, index) {
                                                                        item.x = item.x - 4;
                                                            });
                                                            var _disX = this.starArr[0].x - this.dom_star_light.x;
                                                            var _disY = this.starArr[0].y - this.dom_star_light.y;

                                                            var starLightPosArr = this.starArr.map(function (item, index) {
                                                                        return { x: item.x - _disX, y: item.y - _disY };
                                                            });

                                                            this.config = {
                                                                        btnType: '', // 当前选择的按钮颜色 
                                                                        isPlayOuterCount: 0, // 是否播放外圈声音
                                                                        fastCount: 0, // 预备加速
                                                                        slowDown: false, //减速状态
                                                                        handPosArr: [{ x: 694, y: 1127 }, { x: 492, y: 1203 }], //小手坐标数组
                                                                        handIndex: 0, //当前小手的位置
                                                                        fudaiCallBack: null, //福袋中奖
                                                                        isDropKey: false, //当局是否中得钥匙
                                                                        wenhaoMark: [3, 5, 6, 10, 20, 30, 50, 'key'], // ?号对应的倍率 
                                                                        totalKeys: 0, // 钥匙总数
                                                                        currentAmount: 0, // 当次中奖金额
                                                                        winTotalAmount: 0, // 总共赢得金额
                                                                        isGameGoing: false, //游戏是否正在进行
                                                                        isTIMEOUT: false, //请求超时
                                                                        isLogin: app.utils.checkLoginStatus(), //是否登录
                                                                        MIN_TIMES: 60, // 星星跳转的最少次数 
                                                                        MAX_TIMES: 120, // 星星跳转的最多次数 
                                                                        MIN_INPUT: 100,
                                                                        MAX_INPUT: 500000,
                                                                        user_input_text: 100, //投币金额
                                                                        starLightPosArr: starLightPosArr, //高亮星星pos的数组
                                                                        rotationAngle: { //外环对应角度
                                                                                    "*0": [0, -60, -120, -180, -240, -300],
                                                                                    "*8": -30,
                                                                                    "*2": [-90, -270],
                                                                                    "*4": -210,
                                                                                    "?": [-150, -330]
                                                                        },
                                                                        innerBaseArray: [1.2, 1.5, 2, 1.2, 1.5, 2, 1.2, 1.5, 2, 1.2, 1.5, 2], // 内圈索引对应的倍率
                                                                        currentStarIndex: 0, // 高亮星星当前的位置索引
                                                                        isStartStoped: true, // 高亮星星是否停止
                                                                        innerResultIndex: -1, // 内环的结果位置索引
                                                                        innerResultIndexNew: -1, // 内环对应的倍率
                                                                        outerResultBase: -1, //外环的结果倍率
                                                                        outerResultBaseNew: -1 //外环的结果倍率(真实的)
                                                            };
                                                }

                                                // 初始化dom

                                    }, {
                                                key: "initDom",
                                                value: function initDom() {

                                                            // 美女
                                                            this.dom_girl = this.middle_box.getChildAt(0);
                                                            // 排行榜按钮
                                                            this.dom_btn_rank = this.middle_box.getChildByName('btn_rank');
                                                            // 公告按钮
                                                            this.dom_btn_notice = this.middle_box.getChildByName('btn_notice');
                                                            this.dom_redPoint = this.middle_box.getChildByName('dom_redPoint');

                                                            // 高亮的星星
                                                            this.dom_star_light = this.middle_box.getChildByName('star_light');
                                                            this.dom_star_light.visible = false;
                                                            this.dom_star_ladder = this.middle_box.getChildByName('star_ladder');
                                                            // 火花
                                                            this.dom_fire_animate = this.middle_box.getChildByName('dom_fire_animate');

                                                            // 所有的星星数组
                                                            this.starArr = this.star_box.findType('Image');

                                                            // 开始按钮
                                                            this.start_yellow_box = this.bottom_box.getChildByName('start_yellow_box');
                                                            this.start_yellow_btn = this.start_yellow_box.getChildAt(0);
                                                            this.start_blue_box = this.bottom_box.getChildByName('start_blue_box');
                                                            this.start_blue_btn = this.start_blue_box.getChildAt(0);

                                                            // 充值按钮
                                                            this.dom_btn_recharge = this.bottom_box.getChildByName('btn_recharge');
                                                            // 减法
                                                            this.dom_btn_sub = this.bottom_box.getChildByName('btn_sub');
                                                            // 加法
                                                            this.dom_btn_add = this.bottom_box.getChildByName('btn_add');
                                                            // 最大
                                                            this.dom_btn_max = this.bottom_box.getChildByName('btn_max');
                                                            // 输入框box
                                                            this.input_box = this.bottom_box.getChildByName('input_box');
                                                            // 输入文本
                                                            this.dom_input = this.input_box.getChildByName('dom_input');
                                                            // 小手
                                                            this.dom_finger = this.bottom_box.getChildByName('dom_finger');

                                                            // 福袋相关
                                                            this.dom_fudai_all = this.fudai_box.getChildByName('fudai_all');
                                                            // 小魔法棒
                                                            this.dom_magic = this.fudai_box.getChildByName('dom_magic');
                                                            // 大魔法棒
                                                            this.dom_magic_big = this.fudai_box.getChildByName('dom_magic_big');
                                                            this.dom_magic_big.visible = false;
                                                            this.dom_magic_big.stop();

                                                            // 当局赢得金额
                                                            this.dom_fudai_win = this.fudai_box.getChildByName('fudai_win');
                                                            // 总钥匙数
                                                            this.dom_bang_num = this.fudai_box.getChildByName('bang_num');

                                                            // ？元素
                                                            this.dom_wenhao_list = this.rotation_box.find('wenhao', true);

                                                            // 三格扫光
                                                            this.dom_three_light = this.middle_box.getChildByName('dom_three_light');
                                                            this.dom_three_light.visible = false;
                                                }

                                                // 初始化动画

                                    }, {
                                                key: "initAnimate",
                                                value: function initAnimate() {
                                                            // 开始前的光效
                                                            this.dom_light_start.stop();
                                                            this.dom_small_light.play('wait', true);
                                                            this.dom_magic.play('wait', true);

                                                            // 火花
                                                            this.setFireVisible(false);

                                                            // 中奖梯形
                                                            this.dom_star_ladder.stop();
                                                            this.dom_star_ladder.visible = false;

                                                            // 初始化都为‘？’
                                                            // this.renderWenhao('?', '?');
                                                }

                                                // 事件初始化

                                    }, {
                                                key: "initEvent",
                                                value: function initEvent() {
                                                            var _this2 = this;

                                                            // 开始
                                                            this.start_yellow_box.on(Laya.Event.CLICK, this, this.emitStartGame.bind(this, 'y'));
                                                            this.start_blue_box.on(Laya.Event.CLICK, this, this.emitStartGame.bind(this, 'b'));

                                                            // 键盘出现
                                                            this.input_box.on(Laya.Event.CLICK, this, this.showKeyBoardNumber);

                                                            // 减法加法按钮
                                                            this.dom_btn_sub.on(Laya.Event.CLICK, this, this.addSubHandler.bind(this, 'sub'));
                                                            this.dom_btn_add.on(Laya.Event.CLICK, this, this.addSubHandler.bind(this, 'add'));
                                                            // max
                                                            this.dom_btn_max.on(Laya.Event.CLICK, this, this.maxHandler);

                                                            // 充值弹层
                                                            this.dom_btn_recharge.on(Laya.Event.CLICK, this, function () {
                                                                        app.observer.publish("rechargePopShow");
                                                                        app.audio.play('click');
                                                            });

                                                            // 排行榜
                                                            this.dom_btn_rank.on(Laya.Event.CLICK, this, function () {
                                                                        app.observer.publish("rankPopShow");
                                                                        app.audio.play('click');
                                                            });

                                                            this.dom_girl.on(Laya.Event.CLICK, this, function () {
                                                                        app.audio.play('girl');
                                                            });

                                                            // 开启小手倒计时
                                                            Laya.stage.on(Laya.Event.CLICK, this, function () {
                                                                        Laya.timer.once(2 * 60 * 1000, _this2, _this2.startChangeFinger);
                                                            });
                                                }

                                                // 大魔法棒动画

                                    }, {
                                                key: "bigMagicAnimate",
                                                value: function bigMagicAnimate() {
                                                            var _this3 = this;

                                                            // 不中钥匙
                                                            if (!this.config.isDropKey) {
                                                                        return;
                                                            }

                                                            this.dom_magic_big.once(Laya.Event.STOPPED, this, function () {
                                                                        // 钥匙总数目
                                                                        _this3.dom_bang_num.text = _this3.config.totalKeys + '/10';

                                                                        _this3.dom_magic_big.visible = false;

                                                                        // 福袋中奖
                                                                        _this3.config.fudaiCallBack && _this3.config.fudaiCallBack();
                                                                        _this3.config.fudaiCallBack = null;
                                                            });

                                                            this.dom_magic_big.visible = true;
                                                            this.dom_magic_big.play('start', false);
                                                }

                                                // 福袋中奖

                                    }, {
                                                key: "treasureHandler",
                                                value: function treasureHandler(data) {
                                                            var _this4 = this;

                                                            this.config.fudaiCallBack = function () {
                                                                        // 更新钥匙数量
                                                                        app.observer.publish('fudaiPopShow', data, _this4.updateKeyNum.bind(_this4));
                                                            };
                                                }

                                                // 两只按钮准备

                                    }, {
                                                key: "buttonPrepare",
                                                value: function buttonPrepare() {
                                                            this.start_yellow_btn.play('yellow_wait', true);
                                                            this.start_blue_btn.play('blue_wait', true);
                                                }

                                                // 初始化信息

                                    }, {
                                                key: "initGameRoomInfo",
                                                value: function initGameRoomInfo(data) {
                                                            if (Number(data.code) !== 0) {
                                                                        return;
                                                            }

                                                            this.dom_fudai_all.text = data.treasurePool;

                                                            // 钥匙数目
                                                            this.updateKeyNum(data.totalKeys);
                                                }

                                                // 发送开始游戏

                                    }, {
                                                key: "emitStartGame",
                                                value: function emitStartGame(type) {
                                                            // 防止用户重复点击
                                                            if (this.config.isGameGoing) {
                                                                        app.utils.log('游戏正在进行。。。');
                                                                        return;
                                                            }

                                                            // 关闭小手
                                                            this.endchangeFinger();
                                                            app.audio.play('click');

                                                            // 未登录
                                                            if (!this.config.isLogin) {
                                                                        app.utils.gotoLogin();
                                                                        return;
                                                            }

                                                            if (!this.dom_star_light.visible) {
                                                                        this.dom_star_light.visible = true;
                                                            }

                                                            // 开启随机渲染问号
                                                            Laya.timer.clear(this, this.startRandomWenhao);
                                                            this.startRandomWenhao();

                                                            this.config.isGameGoing = true;

                                                            // 发送投币
                                                            app.messageCenter.emit('bet', {
                                                                        amount: this.config.user_input_text,
                                                                        color: type,
                                                                        restPoint: this.header_ui_box.config.yuNum,
                                                                        tpoint: this.header_ui_box.config.tingDou
                                                            });
                                                            this.config.btnType = type; //按钮颜色

                                                            var key = type === 'y' ? 'yellow' : 'blue';
                                                            var otherKey = type === 'y' ? 'blue' : 'yellow';
                                                            var dom_btn = this['start_' + key + '_btn'];
                                                            var dom_btn_other = this['start_' + otherKey + '_btn'];
                                                            dom_btn.once(Laya.Event.STOPPED, this, function () {
                                                                        dom_btn.play(key + '_wait', true);
                                                            });

                                                            dom_btn.play(key + '_press', false);

                                                            // 另一只禁用状态
                                                            dom_btn_other.play('disable', true);

                                                            // 开始光效
                                                            this.dom_light_start.play('start', false);

                                                            // 游戏启动
                                                            this.gameGo();
                                                }

                                                // 游戏启动

                                    }, {
                                                key: "gameGo",
                                                value: function gameGo() {
                                                            // 游戏重置
                                                            this.resetGame();
                                                            this.starGo();
                                                            this.outerRotationGo();

                                                            // 开启火花
                                                            this.setFireVisible(true);
                                                }

                                                // 游戏重置

                                    }, {
                                                key: "resetGame",
                                                value: function resetGame() {
                                                            this.config.innerResultIndex = -1;
                                                            this.config.innerResultIndexNew = -1;
                                                            this.config.outerResultBase = -1;
                                                            this.config.outerResultBaseNew = -1;
                                                            this.config.isTIMEOUT = false;
                                                            this.config.currentAmount = 0;
                                                            this.config.isDropKey = false;

                                                            this.config.isStartStoped = false;
                                                            this.config.slowDown = false;
                                                            this.config.fastCount = 0;

                                                            // 打开三光
                                                            this.dom_three_light.visible = true;

                                                            // 当局赢重置为0
                                                            this.dom_fudai_win.text = '0';
                                                }

                                                // 结果来了

                                    }, {
                                                key: "resultCome",
                                                value: function resultCome(data) {
                                                            if (Number(data.code !== 0)) {

                                                                        // 错误处理
                                                                        this.errorHandler(data);
                                                                        return;
                                                            }

                                                            // 设置投币默认额cookie
                                                            GM.CookieUtil.set("defaultBet" + GM.gameId + GM.user_id, String(this.config.user_input_text)); // val为押注额

                                                            var mul = data.mul;
                                                            var outKey = '*' + mul.out;

                                                            // 内圈倍率
                                                            this.config.innerResultIndex = Number(mul.in) === 12 ? 0 : mul.in;
                                                            this.config.innerResultIndexNew = this.config.innerBaseArray[this.config.innerResultIndex];

                                                            // 掉钥匙
                                                            if (Number(data.isDropKey) === 1) {
                                                                        // 当局中得钥匙
                                                                        this.config.isDropKey = true;
                                                                        outKey = 'key';
                                                            }

                                                            this.config.outerResultBaseNew = outKey;
                                                            // 外圈倍率
                                                            if (!(outKey in this.config.rotationAngle)) {
                                                                        outKey = "?";
                                                            }
                                                            this.config.outerResultBase = outKey;

                                                            // 总共赢得金额
                                                            // this.config.winTotalAmount += Number(data.amount);

                                                            // 总钥匙数目
                                                            if ("totalKeys" in data) {
                                                                        this.config.totalKeys = data.totalKeys;
                                                            }

                                                            // 当次中奖金额
                                                            this.config.currentAmount = Number(data.amount);

                                                            // 更新用户余额
                                                            this.header_ui_box.updateUserYuDou(-1 * this.config.user_input_text);
                                                }

                                                // 错误处理

                                    }, {
                                                key: "errorHandler",
                                                value: function errorHandler(data) {
                                                            var code = Number(data.code);

                                                            // 请求超时 || 异常
                                                            this.config.isTIMEOUT = true;
                                                            this.starStop();

                                                            // otp验证 
                                                            if (code === 81) {
                                                                        app.utils.otpCheckHandler();

                                                                        return;
                                                            }

                                                            // 输分提醒
                                                            if (data.code === 'losePoint') {

                                                                        return;
                                                            }

                                                            app.observer.publish('warmNoticePopShow', data.msg);
                                                }

                                                // 星星启动

                                    }, {
                                                key: "starGo",
                                                value: function starGo() {
                                                            this.changeStarPos();
                                                            Laya.timer.loop(400, this, this.changeStarPos);
                                                }

                                                // 星星停止

                                    }, {
                                                key: "starStop",
                                                value: function starStop() {
                                                            Laya.timer.clear(this, this.changeStarPos);
                                                            this.config.currentStarIndex = this.config.currentStarIndex % 12;
                                                            this.config.isStartStoped = true;

                                                            // 星星停止就快速闪动
                                                            this.dom_star_light.play('fast', true);

                                                            // 隐藏扫光
                                                            this.dom_three_light.visible = false;
                                                }

                                                // 变换高亮星星的位置

                                    }, {
                                                key: "changeStarPos",
                                                value: function changeStarPos() {
                                                            app.audio.play('innerStart');

                                                            var _config = this.config;
                                                            var _index = this.config.currentStarIndex++ % 12;
                                                            var j = 5; //加速减速的标记
                                                            _config.fastCount++;
                                                            var pos = _config.starLightPosArr[_index];
                                                            this.dom_star_light.pos(pos.x, pos.y);
                                                            this.dom_three_light.rotation = _index * 30;

                                                            // 开始变快
                                                            if (_config.fastCount === j) {
                                                                        Laya.timer.loop(100, this, this.changeStarPos);
                                                            }

                                                            // 减速 || 停止
                                                            if (_config.currentStarIndex > _config.MIN_TIMES && _config.innerResultIndex > -1) {

                                                                        // 到达当前结果索引位置 && 减速状态
                                                                        if (_config.slowDown && _index === _config.innerResultIndex) {
                                                                                    this.starStop();

                                                                                    return;
                                                                        }

                                                                        // 减速(开始减速的索引)
                                                                        var slowIndex = _config.innerResultIndex - j >= 0 ? _config.innerResultIndex - j : _config.innerResultIndex - j + 12;

                                                                        if (_index === slowIndex) {
                                                                                    _config.slowDown = true;
                                                                                    Laya.timer.loop(400, this, this.changeStarPos);
                                                                        }
                                                            }

                                                            // 请求超时
                                                            if (_config.currentStarIndex >= _config.MAX_TIMES) {
                                                                        this.config.isTIMEOUT = true;
                                                                        this.starStop();
                                                                        app.observer.publish('warmNoticePopShow', '网络异常...');
                                                            }
                                                }

                                                // 外圈转盘转动

                                    }, {
                                                key: "outerRotationGo",
                                                value: function outerRotationGo() {
                                                            var targetRotation = -360;
                                                            var _config = this.config;
                                                            var cb = this.outerRotationGoCallBack;
                                                            var _randomNumber = app.utils.randomNumber;
                                                            var _wenhaoMark = _config.wenhaoMark;
                                                            var during = 1500;

                                                            // 重置角度为0
                                                            this.rotation_box.rotation = 0;

                                                            // 内圈开始减速 && 有结果值
                                                            if (this.config.slowDown && _config.outerResultBase in _config.rotationAngle) {
                                                                        var _value = _config.rotationAngle[_config.outerResultBase];

                                                                        // 停止随机渲染问号
                                                                        this.endRandomWenhao();

                                                                        // 如果是数组就得在里面随机一个位置出来
                                                                        if (Array.isArray(_value)) {
                                                                                    var _random = _randomNumber(_value.length - 1);
                                                                                    // 在已有的倍率数组里随机取一个位置
                                                                                    targetRotation = _value[_random];

                                                                                    // 说明是？后台配置中奖
                                                                                    if (_config.outerResultBase === '?') {
                                                                                                var _num = _wenhaoMark[_randomNumber(_wenhaoMark.length - 1)];
                                                                                                if (_random === 0) {
                                                                                                            this.renderWenhao(_config.outerResultBaseNew, _num);
                                                                                                } else {
                                                                                                            this.renderWenhao(_num, _config.outerResultBaseNew);
                                                                                                }
                                                                                                // 给？号随机配值
                                                                                    } else {
                                                                                                this.renderWenhao(_wenhaoMark[_randomNumber(_wenhaoMark.length - 1)], _wenhaoMark[_randomNumber(_wenhaoMark.length - 1)]);
                                                                                    }

                                                                                    // 非数组直接就是那个位置
                                                                        } else {
                                                                                    targetRotation = _value;
                                                                        }

                                                                        // 计算角度
                                                                        targetRotation = targetRotation - (360 - _config.innerResultIndex * 30);
                                                                        // 将角度限制在-360以内
                                                                        targetRotation = targetRotation < -360 ? targetRotation + 360 : targetRotation;
                                                                        // during = Math.abs(Math.floor(targetRotation / 120)) * 800;
                                                                        during = 2000;

                                                                        // 游戏停止
                                                                        cb = this.gameStop.bind(this, false);
                                                            }

                                                            // 请求超时 || 异常
                                                            if (this.config.isTIMEOUT) {
                                                                        // 停止随机渲染问号
                                                                        this.endRandomWenhao();

                                                                        // 游戏停止
                                                                        cb = this.gameStop.bind(this, true);
                                                            }

                                                            // 隔一次播放外圈声音
                                                            if (this.config.isPlayOuterCount++ % 2 === 0) {
                                                                        app.audio.play('outerStart');
                                                            }

                                                            Laya.Tween.to(this.rotation_box, { rotation: targetRotation }, during, Laya.Ease.linearIn, Laya.Handler.create(this, cb));
                                                }

                                                //  转盘继续

                                    }, {
                                                key: "outerRotationGoCallBack",
                                                value: function outerRotationGoCallBack() {
                                                            this.outerRotationGo();
                                                }

                                                // 重置游戏停止

                                    }, {
                                                key: "_resetAfterGameOver",
                                                value: function _resetAfterGameOver() {

                                                            // 恢复慢速闪动
                                                            this.dom_star_light.play('slow', true);

                                                            // 开始准备按钮
                                                            this.buttonPrepare();

                                                            this.config.isGameGoing = false;

                                                            // 4秒后开启
                                                            Laya.timer.once(4000, this, this.startRandomWenhao);

                                                            app.utils.log('游戏停止。。。');
                                                }

                                                // 游戏停止

                                    }, {
                                                key: "gameStop",
                                                value: function gameStop(isTimeout) {
                                                            var _this5 = this;

                                                            var _config = this.config;

                                                            // 火花隐藏
                                                            this.setFireVisible(false);

                                                            // 超时
                                                            if (isTimeout) {
                                                                        // 重置游戏停止
                                                                        this._resetAfterGameOver();

                                                                        return;
                                                            }

                                                            /*  非超时(正常出结果)  */
                                                            // 未中奖
                                                            if (_config.currentAmount <= 0) {
                                                                        app.audio.play('lose');

                                                                        // 重置游戏停止
                                                                        this._resetAfterGameOver();

                                                                        // 未中奖执行救济金
                                                                        app.jiujijin();

                                                                        // 中奖
                                                            } else {
                                                                        // 如果外圈是不中或掉钥匙
                                                                        if (_config.outerResultBaseNew === '*0' || _config.outerResultBaseNew === 'key') {
                                                                                    _config.outerResultBaseNew = '*1';
                                                                        }

                                                                        // 梯形出现
                                                                        this.dom_star_ladder.visible = true;
                                                                        this.dom_star_ladder.rotation = _config.innerResultIndex * 30;
                                                                        this.dom_star_ladder.play('result', true);

                                                                        var showResultFn = function showResultFn() {
                                                                                    // 中奖音效
                                                                                    app.audio.play('win');

                                                                                    // 梯形消失
                                                                                    _this5.dom_star_ladder.visible = false;
                                                                                    _this5.dom_star_ladder.stop();

                                                                                    // 弹层关闭后的回调
                                                                                    var callback = function callback() {

                                                                                                // 更新用户余额
                                                                                                _this5.header_ui_box.updateUserYuDou(_config.currentAmount);

                                                                                                // 当局赢得金额
                                                                                                _this5.dom_fudai_win.text = _config.currentAmount;

                                                                                                // 播放模仿棒跳出动画
                                                                                                _this5.bigMagicAnimate();

                                                                                                // 重置游戏停止(防止弹层还未出现重复点击开始按钮)
                                                                                                _this5._resetAfterGameOver();

                                                                                                // 美女声音
                                                                                                Laya.timer.once(1000, _this5, function () {
                                                                                                            app.audio.play('girl');
                                                                                                });
                                                                                    };

                                                                                    app.observer.publish('winPopShow', _config.outerResultBaseNew, '*' + _config.innerResultIndexNew, '+' + _config.currentAmount, _config.btnType, callback.bind(_this5));
                                                                        };

                                                                        // 延迟1000ms出现
                                                                        Laya.timer.once(1000, this, showResultFn);
                                                            }
                                                }

                                                // 钥匙数目更新

                                    }, {
                                                key: "updateKeyNum",
                                                value: function updateKeyNum(num) {
                                                            var _this6 = this;

                                                            this.dom_bang_num.text = num + '/10';
                                                            this.dom_magic.play('start', true);
                                                            Laya.timer.once(3000, this, function () {
                                                                        _this6.dom_magic.play('wait', true);
                                                            });
                                                            this.config.totalKeys = num;
                                                }

                                                // 渲染福袋奖池总金额

                                    }, {
                                                key: "renderPool",
                                                value: function renderPool(data) {
                                                            this.dom_fudai_all.text = data.treasure;
                                                }

                                                // 开启随机

                                    }, {
                                                key: "startRandomWenhao",
                                                value: function startRandomWenhao() {
                                                            Laya.timer.loop(1000, this, this.randomRenderWenhao);
                                                }

                                                // 关闭随机

                                    }, {
                                                key: "endRandomWenhao",
                                                value: function endRandomWenhao() {
                                                            Laya.timer.clear(this, this.randomRenderWenhao);
                                                }

                                                // 随机渲染不定项倍率

                                    }, {
                                                key: "randomRenderWenhao",
                                                value: function randomRenderWenhao() {
                                                            var _randomNumber = app.utils.randomNumber;
                                                            var _wenhaoMark = this.config.wenhaoMark;
                                                            var len = _wenhaoMark.length - 1;
                                                            var num1 = _wenhaoMark[_randomNumber(len)];
                                                            var num2 = _wenhaoMark[_randomNumber(len)];

                                                            this.renderWenhao(num1, num2);
                                                }

                                                // ？元素的内容渲染

                                    }, {
                                                key: "renderWenhao",
                                                value: function renderWenhao(str1, str2) {
                                                            var item0 = this.dom_wenhao_list[0];
                                                            var item1 = this.dom_wenhao_list[1];

                                                            this._renderWenhao(item0, str1);
                                                            this._renderWenhao(item1, str2);
                                                }

                                                // ？元素渲染

                                    }, {
                                                key: "_renderWenhao",
                                                value: function _renderWenhao(obj, str) {
                                                            if (str === 'key') {
                                                                        obj.getChildAt(0).visible = false;
                                                                        obj.getChildAt(0).text = '?';
                                                                        obj.getChildAt(1).visible = true;
                                                            } else {
                                                                        obj.getChildAt(0).visible = true;
                                                                        obj.getChildAt(0).text = String(str).charAt(0) === '*' ? str : '*' + str;
                                                                        obj.getChildAt(1).visible = false;
                                                            }
                                                }

                                                // 火花

                                    }, {
                                                key: "setFireVisible",
                                                value: function setFireVisible(bool) {
                                                            // 火花开启
                                                            this.dom_fire_animate.visible = bool;

                                                            if (bool) {
                                                                        this.dom_fire_animate.play('start', true);
                                                            } else {
                                                                        this.dom_fire_animate.stop();
                                                            }
                                                }

                                                // max最大值按钮

                                    }, {
                                                key: "maxHandler",
                                                value: function maxHandler() {
                                                            // 未登录
                                                            if (!this.config.isLogin) {
                                                                        app.utils.gotoLogin();
                                                                        return;
                                                            }

                                                            // 游戏进行中
                                                            if (this.config.isGameGoing) {
                                                                        return;
                                                            }

                                                            app.audio.play('click');

                                                            var yuNum = this.header_ui_box.config.yuNum;
                                                            var current = yuNum - yuNum % 100;
                                                            current = current < this.config.MIN_INPUT ? this.config.MIN_INPUT : current;
                                                            current = current > this.config.MAX_INPUT ? this.config.MAX_INPUT : current;

                                                            this.updateDomInput(Number(current));
                                                }

                                                // 减法加法

                                    }, {
                                                key: "addSubHandler",
                                                value: function addSubHandler(type) {
                                                            // 游戏进行中
                                                            if (this.config.isGameGoing) {
                                                                        return;
                                                            }
                                                            app.audio.play('click');

                                                            var max = this.config.MAX_INPUT;
                                                            var min = this.config.MIN_INPUT;
                                                            var current = this.config.user_input_text;
                                                            var base = 100;
                                                            if (type === 'sub') {
                                                                        if (current <= 1000) {
                                                                                    base = -100;
                                                                        } else if (current > 1000 && current <= 10000) {
                                                                                    base = -1000;
                                                                                    if (current < 2000) {
                                                                                                base = -100;
                                                                                    }
                                                                        } else if (current > 10000 && current <= 100000) {
                                                                                    base = -10000;
                                                                                    if (current < 20000) {
                                                                                                base = -1000;
                                                                                    }
                                                                        } else if (current > 100000 && current <= 1000000) {
                                                                                    base = -100000;
                                                                                    if (current < 200000) {
                                                                                                base = -10000;
                                                                                    }
                                                                        }
                                                            } else if (type === 'add') {
                                                                        if (current >= 1000 && current < 10000) {
                                                                                    base = 1000;
                                                                        } else if (current >= 10000 && current < 100000) {
                                                                                    base = 10000;
                                                                        } else if (current >= 100000) {
                                                                                    base = 100000;
                                                                        }
                                                            }

                                                            current += base;
                                                            current = current > max ? max : current;
                                                            current = current < min ? min : current;

                                                            this.updateDomInput(Number(current));
                                                }

                                                // 修改投币金额

                                    }, {
                                                key: "updateDomInput",
                                                value: function updateDomInput(num) {
                                                            this.dom_input.text = num;
                                                            this.config.user_input_text = num;
                                                }

                                                // 键盘出现

                                    }, {
                                                key: "showKeyBoardNumber",
                                                value: function showKeyBoardNumber() {
                                                            // 游戏进行中
                                                            if (this.config.isGameGoing) {
                                                                        return;
                                                            }

                                                            app.audio.play('click');

                                                            // let txt = this.config.user_input_text;
                                                            app.keyBoardNumber_ui_pop.enter('', {
                                                                        length: 6,
                                                                        close: this.hideKeyBoardNumber.bind(this),
                                                                        input: null
                                                            });
                                                }

                                                // 隐藏键盘

                                    }, {
                                                key: "hideKeyBoardNumber",
                                                value: function hideKeyBoardNumber(type, value) {
                                                            var max = this.config.MAX_INPUT;
                                                            var min = this.config.MIN_INPUT;
                                                            if (type === "confirm") {
                                                                        var _value = Number(value);

                                                                        _value = _value > max ? max : _value;
                                                                        _value = _value < min ? min : _value;

                                                                        _value = _value - _value % min;

                                                                        this.updateDomInput(_value);
                                                            }
                                                }

                                                // 系统公告

                                    }, {
                                                key: "noticeSystem",
                                                value: function noticeSystem() {
                                                            if (window.GM && GM.isCall_out === 1 && GM.noticeStatus_out) {

                                                                        GM.noticeStatus_out(this.noticeCallBack.bind(this));
                                                            }
                                                }

                                                // 关闭小手变换

                                    }, {
                                                key: "endchangeFinger",
                                                value: function endchangeFinger() {
                                                            this.dom_finger.visible = false;
                                                            this.dom_finger.stop();
                                                            Laya.timer.clear(this, this.changeFinger);
                                                }

                                                // 开启小手变换

                                    }, {
                                                key: "startChangeFinger",
                                                value: function startChangeFinger() {
                                                            this.dom_finger.visible = true;
                                                            this.dom_finger.play('start', true);
                                                            Laya.timer.loop(5 * 1000, this, this.changeFinger);

                                                            // 每次开启后固定10秒关闭小手
                                                            Laya.timer.once(10 * 1000, this, this.endchangeFinger);
                                                }

                                                // 变换小手

                                    }, {
                                                key: "changeFinger",
                                                value: function changeFinger() {
                                                            var posArr = this.config.handPosArr;

                                                            this.config.handIndex = this.config.handIndex === 0 ? 1 : 0;
                                                            this.dom_finger.pos(posArr[this.config.handIndex].x, posArr[this.config.handIndex].y);
                                                }
                                    }, {
                                                key: "noticeCallBack",
                                                value: function noticeCallBack() {
                                                            var _this7 = this;

                                                            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                                            // 是否显示系统公告
                                                            if (!data.isShowNotice) {

                                                                        return;
                                                            }

                                                            // 是否需要显示小红点
                                                            if (data.isShowRedPoint) {
                                                                        // 显示小红点
                                                                        this.dom_redPoint.visible = true;
                                                            }

                                                            this.dom_btn_notice.on(Laya.Event.CLICK, this, function () {
                                                                        // 直接隐藏小红点
                                                                        _this7.dom_redPoint.visible = false;
                                                                        GM.noticePopShow_out && GM.noticePopShow_out();
                                                            });

                                                            // 显示出公告按钮
                                                            this.dom_btn_notice.visible = true;
                                                }

                                                // 异步优化

                                    }, {
                                                key: "myPromise",
                                                value: function myPromise(context, delay) {
                                                            return new Promise(function (resolve, reject) {
                                                                        Laya.timer.once(delay, context, resolve);
                                                            });
                                                }
                                    }, {
                                                key: "onExit",
                                                value: function onExit() {
                                                            app.utils.log(this.sceneName + " exit");

                                                            // 取消所有注册
                                                            this.unRegisterAction();

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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 *  福袋弹层
 */
{
        (function () {
                var app = window.app;
                var winPopUI = window.winPopUI;

                var WinPopView = function (_winPopUI) {
                        _inherits(WinPopView, _winPopUI);

                        function WinPopView() {
                                var _ref;

                                _classCallCheck(this, WinPopView);

                                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                                        args[_key] = arguments[_key];
                                }

                                var _this = _possibleConstructorReturn(this, (_ref = WinPopView.__proto__ || Object.getPrototypeOf(WinPopView)).call.apply(_ref, [this].concat(args)));

                                _this.init();
                                return _this;
                        }

                        _createClass(WinPopView, [{
                                key: 'init',
                                value: function init() {

                                        this.initDom();

                                        this.initConfig();

                                        this.reset();

                                        // 注册
                                        this.registerAction();
                                }

                                // 注册

                        }, {
                                key: 'registerAction',
                                value: function registerAction() {
                                        // 订阅弹层出现
                                        app.observer.subscribe('winPopShow', this.myShow.bind(this));
                                }
                        }, {
                                key: 'initDom',
                                value: function initDom() {

                                        // 动画dom
                                        this.dom_animate = this.getChildByName('dom_animate');
                                        this.dom_animate.stop();

                                        // 赢得金额
                                        this.dom_award = this.getChildByName('dom_award');
                                        // 外圈倍率
                                        this.dom_outer = this.getChildByName('dom_outer');
                                        // 内圈倍率
                                        this.dom_inner = this.getChildByName('dom_inner');
                                }

                                // 初始化配置参数

                        }, {
                                key: 'initConfig',
                                value: function initConfig() {
                                        this.config = {
                                                currentIndex: 0,
                                                delayArr: [50, 200, 500], //延迟时间数组
                                                arrPos: [this.dom_outer.y, this.dom_inner.y, this.dom_award.y] //由上至下的y坐标
                                        };
                                }
                        }, {
                                key: 'initEvent',
                                value: function initEvent() {}

                                // 文字渐变出现

                        }, {
                                key: 'textAnimate',
                                value: function textAnimate(obj) {
                                        var i = this.config.currentIndex++;
                                        obj.y = this.config.arrPos[i];
                                        Laya.timer.once(this.config.delayArr[i], this, function () {
                                                obj.visible = true;
                                                Laya.Tween.from(obj, { alpha: 0, y: obj.y - 50 }, 500, Laya.Ease.linearIn);
                                        });
                                }

                                // 出现

                        }, {
                                key: 'myShow',
                                value: function myShow(outer, inner, award, type, callback) {
                                        var _this2 = this;

                                        // 居中
                                        this.x = Math.floor((Laya.stage.width - this.width) / 2);

                                        // 赋值
                                        this.dom_award.text = award;
                                        this.dom_inner.text = inner;
                                        this.dom_outer.text = outer;

                                        // 动画结束后关闭
                                        this.dom_animate.once(Laya.Event.STOPPED, this, function () {
                                                // 关闭自己
                                                _this2.myClose();

                                                // 回调
                                                callback && callback();
                                        });

                                        this.dom_animate.play('start', false);
                                        this.zOrder = 2;

                                        // 内圈的字体颜色
                                        this.dom_inner.font = type === 'y' ? 'yellow_font' : 'blue_font';
                                        this.textAnimate(this.dom_inner);
                                        // 不为1倍时显示
                                        if (outer !== '*1') {
                                                this.textAnimate(this.dom_outer);
                                        }
                                        this.textAnimate(this.dom_award);

                                        Laya.stage.addChild(this);
                                }

                                // 重置

                        }, {
                                key: 'reset',
                                value: function reset() {
                                        this.config.currentIndex = 0;
                                        this.dom_award.visible = false;
                                        this.dom_outer.visible = false;
                                        this.dom_inner.visible = false;
                                }

                                // 关闭

                        }, {
                                key: 'myClose',
                                value: function myClose() {
                                        this.zOrder = 1;
                                        this.removeSelf();
                                        this.reset();
                                }
                        }]);

                        return WinPopView;
                }(winPopUI);

                app.WinPopView = WinPopView;
        })();
}
"use strict";

//配置
{
    var app = window.app || {};
    var config = app.config = {};

    config.localStatus = false; //本地
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
                this.ajaxUrl = options.ajaxUrl || {};
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
                    this.cmd = {};
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
                    var _url = this.ajaxUrl[key];
                    if (key === 'userAccount') {
                        var time = new Date().getTime();
                        _url = _url.replace(/\*/, time);
                    }
                    window.$.ajax({
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
                            console.log("推送：", data.cmd, data);
                            this.socket.emit("router", Base64.encode(JSON.stringify(data)));
                        } else {
                            //为data增加token
                            if (data.params) {
                                data.params.jwt = this.jwtToken;
                            } else {
                                data.params = { jwt: this.jwtToken };
                            }

                            data.status = { time: new Date().getTime() };

                            app.utils.log("推送：", JSON.stringify(data));

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
                        } else if (this.lib === "primus") {
                            this.socket = window.Primus.connect(this.websocketurl);
                        }
                    } catch (e) {
                        app.utils.log(e);
                        return;
                    }

                    if (this.lib === "socketio") {
                        this.socket.on('router', function (data) {
                            var _data = JSON.parse(Base64.decode(data));
                            console.log("接收数据：", _data.cmd, _data);

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
                    } else if (this.lib === "primus") {

                        this.socket.on('outgoing::url', function (url) {
                            url.query = 'login=' + self.encryptedString;
                            console.log("outgoing::url", url.query);
                        });

                        this.socket.on('open', function () {
                            app.utils.log("连接成功");

                            // 未登录情况下无法知道sokcet已连接
                            if (!app.utils.checkLoginStatus()) {
                                // 进房间
                                app.enterRoom();
                                console.log('open~~~未登录。。。');
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
                            if (parsedData.cmd !== "marquee") {
                                app.utils.log("接收数据：===>", parsedData.cmd, JSON.stringify(parsedData, null, 4));
                            } else {
                                // 公告不展开
                                app.utils.log("接收数据：===>", parsedData.cmd, parsedData);
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
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

{
    (function () {
        var app = window.app;
        var RESOURCE = app.config.RESOURCE;

        // 字体资源
        var fonts = [{ url: "font/blue_font.fnt", name: 'blue_font', type: Laya.Loader.XML }, { url: "font/purple_font.fnt", name: 'purple_font', type: Laya.Loader.XML }, { url: "font/yellow_font.fnt", name: 'yellow_font', type: Laya.Loader.XML }, { url: "font/fudai_all_font.fnt", name: 'fudai_all_font', type: Laya.Loader.XML }, { url: "font/fudai_win_font.fnt", name: 'fudai_win_font', type: Laya.Loader.XML }, { url: "font/fudai_pop_font.fnt", name: 'fudai_pop_font', type: Laya.Loader.XML }, { url: "font/outer_base_font.fnt", name: 'outer_base_font', type: Laya.Loader.XML }, { url: "font/input_font.fnt", name: 'input_font', type: Laya.Loader.XML }, { url: "font/result_win_font.fnt", name: 'result_win_font', type: Laya.Loader.XML }];

        // loading需要的资源优先加载
        var loadingRes = [{ url: "loading/loadingbg.jpg", type: Laya.Loader.IMAGE }, { url: "res/atlas/loading.json", type: Laya.Loader.ATLAS }];

        // 不打包图片资源
        var unPackRes = [
        // room
        { url: "room/roombg.jpg", type: Laya.Loader.IMAGE }, { url: "room/marquee_bg.png", type: Laya.Loader.IMAGE }, { url: "room/outround.png", type: Laya.Loader.IMAGE }, { url: "room/round.png", type: Laya.Loader.IMAGE },

        // pop
        { url: "pop/page1.png", type: Laya.Loader.IMAGE }, { url: "pop/page2.png", type: Laya.Loader.IMAGE }];

        // 打包的json文件
        var packRes = [{ url: 'res/atlas/comp.json', type: Laya.Loader.ATLAS }, { url: 'res/atlas/pop.json', type: Laya.Loader.ATLAS }, { url: 'res/atlas/pop/recharge.json', type: Laya.Loader.ATLAS }, { url: 'res/atlas/room.json', type: Laya.Loader.ATLAS },

        // 骨骼动画的资源
        { url: 'animate/fudai.png', type: Laya.Loader.IMAGE }, { url: 'animate/fudai.sk', type: Laya.Loader.BUFFER }, { url: 'animate/spark.png', type: Laya.Loader.IMAGE }, { url: 'animate/spark.sk', type: Laya.Loader.BUFFER }, { url: 'animate/star.png', type: Laya.Loader.IMAGE }, { url: 'animate/star.sk', type: Laya.Loader.BUFFER }, { url: 'animate/round.png', type: Laya.Loader.IMAGE }, { url: 'animate/round.sk', type: Laya.Loader.BUFFER }, { url: 'animate/magic.png', type: Laya.Loader.IMAGE }, { url: 'animate/magic.sk', type: Laya.Loader.BUFFER }, { url: 'animate/magic2.png', type: Laya.Loader.IMAGE }, { url: 'animate/magic2.sk', type: Laya.Loader.BUFFER }, { url: 'animate/win.png', type: Laya.Loader.IMAGE }, { url: 'animate/win.sk', type: Laya.Loader.BUFFER }, { url: 'animate/light.png', type: Laya.Loader.IMAGE }, { url: 'animate/light.sk', type: Laya.Loader.BUFFER }, { url: 'animate/button.png', type: Laya.Loader.IMAGE }, { url: 'animate/button.sk', type: Laya.Loader.BUFFER }, { url: 'animate/finger.png', type: Laya.Loader.IMAGE }, { url: 'animate/finger.sk', type: Laya.Loader.BUFFER }, { url: 'animate/girl.png', type: Laya.Loader.IMAGE }, { url: 'animate/girl.sk', type: Laya.Loader.BUFFER }, { url: 'animate/logo.png', type: Laya.Loader.IMAGE }, { url: 'animate/logo.sk', type: Laya.Loader.BUFFER }];

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
            return app.config.localStatus || window.token && GM.userLogged;
        };

        // otp验证
        utils.otpCheckHandler = function () {
            location.href = "/?act=otp&st=otpPage";
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

{
    window.app.audio = {
        loaded: false,
        audioSources: {
            bg: 'bg', // 背景音乐
            click: 'click', // 点击
            girl: 'girl', // 美女
            win: 'win', // 赢了
            lose: 'lose', // 输了
            outerStart: 'outerStart', // 外圈音效
            // Sound007: 'Sound007', // 
            // Sound015: 'Sound015', // 
            innerStart: 'innerStart' // 内圈音效
        },

        init: function init() {
            if (!this.loaded) {
                this.loaded = true;
                Laya.SoundManager.setMusicVolume(0.3);
                Laya.SoundManager.setSoundVolume(1);
            }

            // 初始化加载资源（除背景乐）
            this.initResource();
        },
        play: function play(id) {
            var src = 'audio/' + this.audioSources[id] + '.mp3?v=' + window.staticVertion;
            var volume = 1;
            if (id === 'bg') {
                Laya.SoundManager.playMusic(src, 0);
            } else {
                // 胜利声音调小
                if (id === 'win') {
                    volume = 0.5;
                }
                Laya.SoundManager.setSoundVolume(volume);
                Laya.SoundManager.playSound(src, 1);
            }
        },


        // 初始化加载资源（除背景乐）
        initResource: function initResource() {
            for (var key in this.audioSources) {
                if (key !== 'bg') {
                    this.play(this.audioSources[key]);
                }
            }

            Laya.SoundManager.stopAllSound(); //停止所有音效（除了背景音乐）
        },


        //设置静音
        setMuted: function setMuted() {
            Laya.SoundManager.muted = true;
        },


        //设置非静音(如果需要在播放背景音乐，需要重新play('gameBg')方法);
        setMutedNot: function setMutedNot() {
            Laya.SoundManager.muted = false;
            this.play('bg');
        },


        //停止背景音乐播放
        stopBgMusic: function stopBgMusic() {
            Laya.SoundManager.stopMusic(); //停止背景音乐
        },


        //设置cookie
        setCookie: function setCookie(cname, cvalue) {
            var exdays = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 7;

            var d = new Date();
            d.setTime(d.getTime() + exdays * 24 * 60 * 1000);
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires;
        },


        //获取cookie
        getCookie: function getCookie(cname) {
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
            this.setCookie(name, "", -1);
        }
    };
}
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
            viewLeft: 0
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
                    token: window.token,
                    ajaxUrl: {
                        day: '/?act=game_superstars&st=get_bet_rank&type=day',
                        week: '/?act=game_superstars&st=get_bet_rank&type=week',
                        month: '/?act=game_superstars&st=get_bet_rank&type=month',
                        userAccount: '/?act=game_gamebase&st=queryUserAccount&data=*&gameId=' + gameId + '&type=1'
                    }
                });

                // 测试用
                // window.checheEmit = this.messageCenter.emit.bind(this.messageCenter);
            },


            // 加载字体&&图片
            loadFontAndImage: function loadFontAndImage() {
                var _this = this;

                var count = 0;
                var length = this.config.RESOURCE.fonts.length;
                //全局字体资源
                this.config.RESOURCE.fonts.forEach(function (item, i, arr) {
                    var bitmapfont = new Laya.BitmapFont();
                    bitmapfont.loadFont(item.url, Laya.Handler.create(_this, function () {
                        Laya.Text.registerBitmapFont(item.name, bitmapfont);

                        // 字体全部加载完成
                        if (++count === length) {
                            // 加载图片
                            _this.loadImages();
                        }
                    }));
                });
            },


            // 加载图片
            loadImages: function loadImages() {
                Laya.loader.load(this.config.RESOURCE.disLoadingRes, Laya.Handler.create(this, this.onLoaded), Laya.Handler.create(this.loading_ui_view, this.loading_ui_view.loading, null, false));
            },


            // load
            loadingPageShow: function loadingPageShow() {
                var _this2 = this;

                Laya.loader.load(this.config.RESOURCE.loadingRes, Laya.Handler.create(this, function () {

                    // loading场景
                    _this2.loading_ui_view = new _this2.LoadingScene();
                    _this2.sceneManager.loadScene(_this2.loading_ui_view);

                    // 设置视图居中
                    app.setViewCenter();

                    // 浏览器窗口大小变化
                    Laya.stage.on(Laya.Event.RESIZE, _this2, _this2.setViewCenter);

                    // 加载字体&&图片
                    _this2.loadFontAndImage();
                }));
            },
            onLoaded: function onLoaded() {
                console.warn('大厅&房间————资源加载完成');

                // 初始化所有弹层
                this.initAllPop();

                // 首先挂载好消息处理函数
                this.initGame();

                // 连接服务器
                this.messageCenter.connectSocket();
            },


            // 初始化游戏
            initGame: function initGame() {
                var _this3 = this;

                //一切请求等待首次连接后在发出 
                app.messageCenter.registerAction("conn::init", function () {
                    // 进房间
                    _this3.enterRoom();
                });

                // 错误信息处理
                app.messageCenter.registerAction('conn::error', function (data) {
                    _this3.connError(data);
                });
            },


            // 进房间
            enterRoom: function enterRoom() {
                // 直接进房间
                app.room_ui_box = new app.RoomScene();
                app.sceneManager.loadScene(app.room_ui_box);

                // 居中
                this.setViewCenter();

                // 初始化声音
                app.audio.init();
            },


            // 初始化所有弹层
            initAllPop: function initAllPop() {
                // 键盘
                app.keyBoardNumber_ui_pop = new window.Tools.KeyBoardNumber();

                // 排行榜
                new app.RankPopDialog();

                // 帮助页
                new app.HelpPopUIDialog();

                // 充值弹层
                new app.RechargePopDialog();

                // 普通弹层
                new app.CommonPopDialog();

                // 温馨提示
                new app.WarmNoticePopDialog();

                // 福袋弹层
                new app.FudaiPopUIDialog();

                // 赢弹层
                new app.WinPopView();
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
            jiujijin: function jiujijin() {
                Laya.timer.once(3000, this, function () {
                    if (window.GM && window.GM.socket_RJ && window.GM.socket_RJ.exec) {
                        // 延时确保服务器那边有了
                        window.GM.socket_RJ.exec();

                        // 更新余额
                        app.messageCenter.emitAjax("userAccount");
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
            }
        });

        // window.onerror = function(e){
        //     alert(e)
        // }

        app.init();
    })();
}