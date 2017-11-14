//工具
{
    const app = window.app;
    const GM = window.GM;
    const utils = app.utils = {};

    utils.log = (...args) => {
        app.config.debug && window.console && window.console.log(...args);
    }
    utils.warn = (...args) => {
        app.config.debug && window.console && window.console.warn(...args);
    }
    utils.info = (...args) => {
        app.config.debug && window.console && window.console.info(...args);
    }

    // 是否打印信息
    utils.initDebug = (key, val) => {
        let arr = location.search.slice(1).split('&');
        let debugFE = false;
        arr.forEach((item) => {
            let list = item.split('=');
            if (list[0] === key && list[1] === val) {
                debugFE = true;
            }
        })

        return debugFE;
    }

    //生产0-num范围的随机数
    utils.randomNumber = (n1, n2) => {
        let start = n1,
            end = n2;
        if (typeof n2 === 'undefined') {
            start = 0;
            end = n1;
        }
        return Math.round(Math.random() * (end - start) + start);
    }

    //登录
    utils.gotoLogin = () => {
        location.href = GM.userLoginUrl;
    }

    //验证登录
    utils.checkLoginStatus = () => {
        return app.config.localStatus || (window.token && GM.userLogged);
    }

    // otp验证
    utils.otpCheckHandler = () => {
        location.href = "/?act=otp&st=otpPage";
    }

    utils.willGotoLogin = () => {
        if (!utils.checkLoginStatus()) {
            utils.gotoLogin();
            return true;
        }
    }

    // 查看别处游戏币
    utils.checkOtherYxb = () => {
        if (window.GM && GM.whereYxb) {
            GM.whereYxb();
        }
    }

    //获取字符串长度，支持中文
    utils.getStringLength = (str = '') => {
        return ("" + str.replace(/[^\x00-\xff]/gi, "ox")).length;
    }

    // 截取字符长度限制以内的字符
    utils.getActiveStr = (str = '', total = 8) => {
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
    utils.extendDeep = (parent, child) => {
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



};
