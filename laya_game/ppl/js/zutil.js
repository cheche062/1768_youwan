/*
    从前往后寻找 和从后往前寻找有什么区别？
    queryElements 我先写一个从前往后寻找的
*/
var zutil = {
  getElementsByName: function (root_dom, name) {
    var self = this;
    var arr = [];
    if (root_dom.getChildByName && root_dom.getChildByName(name)) {
      for (var i = 0; i < root_dom.numChildren; i++) {
        if (root_dom.getChildAt(i).name == name) {
          arr.push(root_dom.getChildAt(i));
        }
      }
    }
    for (var i = 0; i < root_dom.numChildren; i++) {
      arr = arr.concat(self.getElementsByName(root_dom.getChildAt(i), name));
    }
    return arr;
  },
  // Button Image Label ... laya.ui 中的组件
  getElementsByType: function (root_dom, type) {
    var self = this;
    var arr = [];
    var typeParent = laya.ui[type] || ui[type] || laya.display[type];
    if (!typeParent) {
      return arr;
    }
    for (var i = 0; i < root_dom.numChildren; i++) {
      if (root_dom.getChildAt(i) instanceof typeParent) {
        arr.push(root_dom.getChildAt(i));
      }
    }
    for (var i = 0; i < root_dom.numChildren; i++) {
      arr = arr.concat(self.getElementsByType(root_dom.getChildAt(i), type));
    }
    return arr;
  },
  // 通过属性来寻找子类 propertyName:value
  getElementsByProperty: function (root_dom, propStr) {
    var self = this;
    var arr = [];
    var propArr = propStr.split(':');
    if (!propArr.length) {
      return arr;
    }
    if (propArr[1] == 'false') {
      propArr[1] = false;
    } else if (propArr[1] == 'true') {
      propArr[1] = true;
    }
    for (var i = 0; i < root_dom.numChildren; i++) {
      if (root_dom.getChildAt(i)[propArr[0]] == propArr[1]) {
        arr.push(root_dom.getChildAt(i));
      }
    }
    for (var i = 0; i < root_dom.numChildren; i++) {
      arr = arr.concat(self.getElementsByProperty(root_dom.getChildAt(i), propStr));
    }
    return arr;
  },
  // 获取所有下级node
  getAllElements: function (root_dom) {
    var self = this;
    var arr = [];
    for (var i = 0; i < root_dom.numChildren; i++) {
      arr.push(root_dom.getChildAt(i));
      arr = arr.concat(self.getAllElements(root_dom.getChildAt(i)));
    }
    return arr;
  },
  // 通过 (name:nameStr type:typeStr).. 形式查询
  queryElements: function (root_dom, queryString) {
    var self = this;
    var arr = [];
    var queryArr = queryString.split(' ');
    if (!queryArr) {
      return arr;
    }
    var lastQueryStr = queryArr[queryArr.length - 1];

    var allElements = self.getAllElements(root_dom);
    for (var i = 0; i < allElements.length; i++) {
      if (!self.isChecked(allElements[i], lastQueryStr)) {
        continue;
      }
      if (self._itemParentCheck(root_dom, allElements[i], queryArr)) {
        arr.push(allElements[i]);
      }
    }
    return arr;
  },
  querySiblings: function (dom_origin) {
    var self = this;
    var arr = [];
    var dom_parent = dom_origin.parent;
    for (var i = 0; i < dom_parent.numChildren; i++) {
      var dom_item = dom_parent.getChildAt(i);
      if (dom_item == dom_origin) {
        continue;
      }
      arr.push(dom_item);
    }
    return arr;
  },
  // 寻找最近符合条件的父类
  queryClosest: function (dom_item, queryString) {
    var self = this;
    var parent = dom_item.parent;
    if (!parent) {
      return null;
    }
    if (self.isChecked(parent, queryString)) {
      return parent;
    }
    return self.queryClosest(parent, queryString);
  },
  isClosest: function (dom_item, dom_parent) {
    var self = this;
    if (!dom_item) {
      return false;
    }
    if (dom_item == dom_parent) {
      return true;
    }
    var parent = dom_item.parent;
    return self.isClosest(parent, dom_parent);
  },
  wrapElementByClass: function (dom_origin, ClassName) {
    var dom_parent = dom_origin.parent;
    var index = zutil.getElementIndex(dom_origin);
    var new_class_dom = new ClassName(dom_origin);
    dom_parent.addChildAt(new_class_dom, index);
    return new_class_dom;
  },
  // dom_list中符合condition_str的元素 提取出来放在一个数组中
  filterElements: function (dom_list, filter_str) {
    var self = this;
    var arr = [];
    return dom_list.filter(function (dom_item, index) {
      return self.isChecked(dom_item, filter_str);
    });
  },
  getElementIndex: function (dom_item) {
    var self = this;
    var dom_parent = dom_item.parent;
    if (!parent) {
      return -1;
    }
    for (var i = 0; i < dom_parent.numChildren; i++) {
      if (dom_parent.getChildAt(i) == dom_item) {
        return i;
      }
    }
    return -1;
  },
  callSuperFunc: function (func_name, sub_obj, param_list) {
    var self = this;
    if (!sub_obj.__super) {
      zutil.log('sub_obj has not superClass');
      return false;
    }
    if (!func_name) {
      if (Array.isArray(param_list)) {
        sub_obj.__super.apply(sub_obj, param_list);
      } else {
        sub_obj.__super.call(sub_obj);
      }
      return true;
    }
    if (Array.isArray(param_list)) {
      sub_obj.__super.prototype[func_name].apply(sub_obj, param_list);
    } else {
      sub_obj.__super.prototype[func_name].call(sub_obj);
    }
    return true;
  },
  _itemParentCheck: function (root_dom, item_dom, queryArr) {
    var self = this;
    var lastQueryStr = queryArr[queryArr.length - 1];
    var funcSelf = self._itemParentCheck.bind(self);
    var parent_dom = item_dom._parent;
    if (self.isChecked(item_dom, lastQueryStr)) {
      queryArr = queryArr.slice(0, -1);
    }
    if (queryArr.length === 0) {
      return true;
    }
    if (parent_dom == root_dom) {
      // 如果已经找到最顶级 queryArr还没有完成所有匹配 返回false
      return false;
    }
    return self._itemParentCheck(root_dom, parent_dom, queryArr);
  },
  isChecked: function (check_item, condition_str) {
    var self = this;
    if (condition_str.indexOf('|') == -1) {
      return self._typeIsChecked(check_item, condition_str);
    }

    var condition_arr = condition_str.split('|');
    for (var i = 0; i < condition_arr.length; i++) {
      if (!self._typeIsChecked(check_item, condition_arr[i])) {
        return false;
      }
    }
    return true;
  },
  // 判断item是否符合条件 name:nameStr
  _typeIsChecked: function (check_item, type_str) {
    var self = this;

    var queryArr = type_str.split(':');
    var queryType = queryArr[0];
    var queryStr = queryArr[1];
    if (queryType == 'name') {
      return check_item.name == queryStr;
    } else if (queryType == 'type') {
      var typeParent = laya.ui[queryStr] || ui[queryStr] || laya.display[type];
      return check_item instanceof typeParent;
    } else if (queryType == 'property') {
      var propertyName = queryStr;
      var propertyValue = queryArr[2];
      if (propertyValue == 'false') {
        propertyValue = false;
      } else if (propertyValue == 'true') {
        propertyValue = true;
      }
      return check_item[propertyName] == propertyValue;
    }
  },
  // 防止按钮多次点击 按钮锁定一秒
  isSpriteLock: function (sprite) {
    var self = zutil;
    if (sprite.isLock) {
      return true;
    }
    sprite.isLock = true;
    Laya.timer.once(1000, self.sprite, function () {
      sprite.isLock = false;
    });
    return false;
  },
  // log
  log: function () {
    var self = zutil;

    if (self.isDebug()) {
      console.log.apply(console, arguments);
    }
  },
  // 分析url字符串
  getQueryString: function (query) {
    var query_string = {};
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
        query_string[pair[0]] = arr;
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return query_string;
  },
  isDebug: function () {
    var self = this;
    return self.testDebugModule('debugFE')
  },
  isAutoTest: function () {
    var self = this;
    return self.testDebugModule('autoTest')
  },
  isShowOberverCmd: function () {
    var self = this;
    return self.testDebugModule('showOberverCmd')
  },
  testDebugModule: function (state) {
    var self = this;
    var queryStr = location.href.split('?')[1];
    if (!queryStr) {
      return false;
    }
    var query = self.getQueryString(queryStr)[state];
    if (query) {
      return true;
    }
    return false;
  },
  extend: function(subClass, superClass){
    var F = function(){};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.super = function(arr){
    	superClass.apply(this, arr);
    }
  },
  getActiveStr: function(str, total){
    var realLength = 0;
    var len = str.length;
    var result = '';
    for(var i=0; i<len; i++){
      if(str.charCodeAt(i) > 128){
        realLength += 2;

      }else{
        realLength += 1;
      }

      if(realLength>total){
        return result+'...';
      }

      result = result + str.charAt(i);

    }

    return result;
  },

  // 取随机数
  getRandomNum: function(start, end){

    return Math.round(Math.random()*(end - start)) + start;

  }
  
};