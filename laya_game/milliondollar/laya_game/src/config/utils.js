//工具
import GAME_CONFIG from './config.js';

const UTILS = {};

UTILS.log = (...args) => {
    GAME_CONFIG.debug && window.console && window.console.log(...args);
}
UTILS.warn = (...args) => {
    GAME_CONFIG.debug && window.console && window.console.warn(...args);
}
UTILS.info = (...args) => {
    GAME_CONFIG.debug && window.console && window.console.info(...args);
}

// 是否打印信息
UTILS.initDebug = (key, val) => {
    let arr = location.search.slice(1).split('&');
    let result = false;
    arr.forEach((item) => {
        let list = item.split('=');
        if (list[0] === key && list[1] === val) {
            result = true;
        }
    })

    return result;
}

//生产0-num范围的随机数
UTILS.randomNumber = (n1, n2) => {
    let start = n1,
        end = n2;
    if (typeof n2 === 'undefined') {
        start = 0;
        end = n1;
    }
    return Math.round(Math.random() * (end - start) + start);
}

//登录
UTILS.gotoLogin = () => {
    location.href = GM.userLoginUrl;
}

//验证登录
UTILS.checkLoginStatus = () => {
    return GAME_CONFIG.localStatus || (window.token && GM.userLogged);
}

// otp验证
UTILS.otpCheckHandler = () => {
    location.href = "/?act=otp&st=otpPage";
}

UTILS.willGotoLogin = () => {
    if (!UTILS.checkLoginStatus()) {
        UTILS.gotoLogin();
        return true;
    }
}

// 查看别处游戏币
UTILS.checkOtherYxb = () => {
    if (window.GM && GM.whereYxb) {
        GM.whereYxb();
    }
}

//获取字符串长度，支持中文
UTILS.getStringLength = (str = '') => {
    return ("" + str.replace(/[^\x00-\xff]/gi, "ox")).length;
}

// 截取字符长度限制以内的字符
UTILS.getActiveStr = (str = '', total = 8) => {
    let realLength = 0;
    str = String(str);
    let len = str.length;
    let result = '';
    if (len === 0) {
        return '';
    }
    for (let i = 0; i < len; i++) {
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
}

// 深度克隆
UTILS.extendDeep = (parent, child) => {
    var child = child || {};
    var _tostr = Object.prototype.toString;
    for (var key in parent) {
        if (parent.hasOwnProperty(key)) {
            if (typeof _val === 'object') {
                child[key] = (_tostr.call(parent[key]) === '[object Array]') ? [] : {};
                extendDeep(parent[key], child[key]);
            } else {
                child[key] = parent[key];
            }
        }
    }
    return child;
}

// 运行时间
UTILS.runningTime = (fn) => {
    let time1 = Date.now();
    fn();
    let time2 = Date.now();

    console.log(time2 - time1);
}

UTILS.getCookie = (name) => {
    var cookieName = encodeURIComponent(name) + "=",
        cookieStart = document.cookie.indexOf(cookieName),
        cookieValue = null;

    if (cookieStart > -1) {
        var cookieEnd = document.cookie.indexOf(";", cookieStart)
        if (cookieEnd == -1) {
            cookieEnd = document.cookie.length;
        }
        cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }

    return cookieValue;
}

UTILS.setCookie = (cname, cvalue, exdays = 7) => {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires;
}

UTILS.clearCookie = (name) => {
    UTILS.setCookie(name, "", -1);
}

// 输入框投币额加减的粒度计算
UTILS.addSubHandler = (type, base, min, max, current) => {
    if (type === 'sub') {
        if (current <= 1000) {
            base = -1 * base;
        } else if (current > 1000 && current <= 10000) {
            base = -1000;
            if (current < 2000) {
                base = -250;
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
    current = Math.min(current, max);
    current = Math.max(current, min);

    return current;
}

// 添加千分符
UTILS.addThousandSymbol = (num) => {
    let str = String(num);
    let result = '';
    let count = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        count++;
        result = str.charAt(i) + result;
        if (count % 3 === 0 && i !== 0) {
            result = ',' + result;
        }
    }

    return result;
}

// 转化为万为单位
UTILS.toWanSymbol = (num) => {
    let s = Number(num) / 10000;

    if (s >= 1) {
        return Math.floor(s) + '万';
    } else {
        return num;
    }
}

// 把秒转化为时分秒
UTILS.toDetailTime = (num) => {
    var time = Number(num);
    var days = Math.floor(time / 1440 / 60);
    var hours = Math.floor((time - days * 1440 * 60) / 3600);
    var minutes = Math.floor((time - days * 1440 * 60 - hours * 3600) / 60);
    var seconds = (time - days * 1440 * 60 - hours * 3600 - minutes * 60);
    var result = '';
    if (days) result += days + '日';
    if (hours) result += hours + '时';
    if (minutes) result += minutes + '分';
    if (seconds) result += seconds + '秒';

    return result;
}

// 倒计时
UTILS.createTimeCountDown = function() {
    return {
        // 创建 (总时间, 倒计时进行回调， 倒计时结束回调)
        start(time, timeGoingCb, timeOutCb) {
            let count = Number(time);

            this.loop = () => {
                if (--count > 0) {
                    timeGoingCb && timeGoingCb(count);
                    Laya.timer.once(1000, this, this.loop);

                } else {
                    timeOutCb && timeOutCb();
                    this.clear();
                }
            }

            this.loop();
        },
        clear() {
            if(this.loop){
                Laya.timer.clear(this, this.loop);
                this.loop = null;
            }

        }
    }
}




export default UTILS;
