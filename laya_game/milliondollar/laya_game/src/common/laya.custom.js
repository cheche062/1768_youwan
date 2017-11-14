/**
 * @public
 * 创建骨骼动画
 * @param {String} path 骨骼动画路径
 * @param {Number} rate 骨骼动画帧率，引擎默认为30，一般传24
 * @param {Number} type 动画类型 
 * 0,使用模板缓冲的数据，模板缓冲的数据，不允许修改  （内存开销小，计算开销小，不支持换装） 
 * 1,使用动画自己的缓冲区，每个动画都会有自己的缓冲区，相当耗费内存 （内存开销大，计算开销小，支持换装） 
 * 2,使用动态方式，去实时去画 （内存开销小，计算开销大，支持换装,不建议使用）
 * @return Skeleton骨骼动画
 */
let paths = [];
let temps = [];
export function createSkeleton(path, rate, type) {
    rate = rate || 24;
    type = type || 0;
    var png = Laya.loader.getRes(path + ".png");
    var sk = Laya.loader.getRes(path + ".sk");
    if (!png || !sk) {
        console.error("资源没有预加载:" + path);
        return null;
    }
    let index = paths.indexOf(path),
        templet;
    if (index === -1) {
        templet = new Laya.Templet();
        let len = paths.length;
        paths[len] = path;
        temps[len] = templet;
        templet.parseData(png, sk, rate);
    } else {
        templet = temps[index];
    }
    return new Laya.Skeleton(templet, type);
}

// 扩展Dialog可以随时决定是否点击遮罩关闭弹层
laya.ui.DialogManager.prototype._closeOnSide = function() {
    if (!window.UIConfig.closeDialogOnSide) return;
    var dialog = this.getChildAt(this.numChildren - 1);
    if ((dialog instanceof laya.ui.Dialog)) dialog.close("side");
}

Laya.Node.prototype.set = function(param) {
    var self = this;
    Object.keys(param).forEach(function(key, i) {
        switch (key) {
            case 'pos':
                self.pos(param[key][0], param[key][1]);
                break;
            default:
                self[key] = param[key];
                break;
        }
    });
    return self;
};

// 获得深度节点, flag 为 找到一个就不再寻找, 还是查找所有的
Laya.Node.prototype.findType = function(type, flag) {
    var loop = function(root_dom) {
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

// 本地相对应父元素的坐标节点
Laya.Node.prototype.localToTarget = function(target) {
    var point = { x: 0, y: 0 };
    var ele = this;
    while (ele) {
        if (ele == target || ele == Laya.stage) break;
        point = ele.toParentPoint(point);
        ele = ele.parent;
    }
    return point;
}

// 获得深度节点, flag 为 找到一个就不再寻找, 还是查找所有的
Laya.Node.prototype.find = function(name, flag) {
    var loop = function(nodes) {
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
    }

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
}


// 点击小弹层以外的区域则隐藏
export function clickOtherAreaHandler(btn, viewBox) {
    Laya.stage.on(Laya.Event.CLICK, this, (event) => {
        if (!event) {
            return;
        }
        let _target = event.target;
        let child = viewBox.getChildAt(0);

        // 菜单栏
        if (child && child.visible && _target !== btn && !viewBox.contains(_target)) {
            child.visible = false;
        }
    });
}

export function addLongClickEvent(dom, clickHandler, longClickHandler) {
    let DURING_TIME = 1000;
    let startTime = 0;

    dom.on(Laya.Event.MOUSE_DOWN, this, () => {
        startTime = Date.now();
        Laya.timer.once(DURING_TIME, this, longClickHandler);

    })

    dom.on(Laya.Event.MOUSE_UP, this, () => {
        let during = Date.now() - startTime;

        // 长按时间短
        if (during < DURING_TIME) {
            Laya.timer.clear(null, longClickHandler);
            clickHandler();
        }
    })

    dom.on(Laya.Event.MOUSE_OUT, this, () => {
        Laya.timer.clear(null, longClickHandler);

    })

}
