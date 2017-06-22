//工具
(function(){
    var utils = app.utils = {};

    utils.log = function(params){
        app.config.debug && window.console && window.console.log(params);
    }

    //生产0-num范围的随机数
    utils.randomNumber = function(num){
        return Math.round(Math.random() * num);
    }

    //登录
    utils.gotoLogin = function(){
        location.href = GM.userLoginUrl;
    }

    //验证登录
    utils.checkLoginStatus = function(){
        return token && GM.userLogged;
    }

    //获取字符串长度，支持中文
    utils.getStringLength = function(str){
        return ("" + str.replace(/[^\x00-\xff]/gi,"ox")).length;
    }

    // 打乱数组
    utils.confuseArr = function(arr){
        var result = [];
        var l = arr.length;
        while(l--){
            var index = Math.round(Math.random() * l);
            result.push(arr.splice(index, 1)[0]);
        }

        return result;
    }


})();