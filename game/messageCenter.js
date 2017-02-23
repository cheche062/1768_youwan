//io
(function(){
    var messageCenterModule = app.messageCenterModule = function(options){
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

        //注册
        this.registerAction = function(key,callback){
            if(typeof callback == "function"){
                this.registedAction[key] = callback;
            }
        }

        //触发
        this.dispatchAction = function(key,data,type){
            var callback = this.registedAction[key];
            if(typeof callback == "function"){
                if(type == "ajax"){
                    callback(data);
                }
                else{
                    callback(data.res || data.rep);
                }
            }
            else{
                //未注册过的行为静默失败，给出提示
                app.utils.log("未注册行为：" + key,data);
            }
        }

        //获取数据
        this.emit = function(key,type,params,callback){
            //注册
            this.registerAction(key,callback);

            if(type == "ajax"){
                this.emitAjax(key,params);
            }else{
                if(!app.utils.checkLoginStatus()){
                    app.utils.gotoLogin();
                    return;
                }

                this.emitSocket({
                    cmd : key,
                    params : params
                });
            }
        }

        //获取ajax数据
        this.emitAjax = function(key,params){
            var self = this;
            var _url = this.ajaxurl[key];

            $.ajax({
                type: type,
                url: _url,
                data : params,
                timeout : this.ajaxTimeout,
                success: function(response){
                    app.utils.log(_url,response);

                    response = response || {};
                    self.dispatchAction(key,response,"ajax");
                },
                error: function(){
                    //异常处理
                }
            });
        }

        //获取socket数据
        this.emitSocket = function(data){
            if(this.socket){
                if(this.lib == "socketio"){
                    app.utils.log("推送：",data.cmd,data);
                    this.socket.emit("router",Base64.encode(JSON.stringify(data)));
                }
                else{
                    //为data增加token
                    if(data.params){
                        data.params.jwt = jwtToken;
                    }
                    else{
                        data.params = { jwt : jwtToken };
                    }

                    data.status = { time : new Date().getTime() };

                    app.utils.log("推送：",JSON.stringify(data));

                    //加密
                    var encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(_commKey), {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    });
                    //发送加密数据
                    this.socket.write(encryptData.toString());
                }
            }
        }

        //生成commkey
        this.generateCommKey = function(){
            try{
                //默认32位编码
                this._commKey = Date.parse(new Date()).toString() + Date.parse(new Date()).toString() + Date.parse(new Date()).toString().substring(0,6);
            }
            catch(e){
                app.utils.log("初始化commKey失败",e);
            }

            return this;
        }

        //生成encryptedString
        this.generateEncryptedString = function(){
            try{
                var params = "jwt=" + token + "&commKey=" + this._commKey;
                var jsencrypt = new JSEncrypt();
                jsencrypt.setPublicKey(this.publicKey);
                this.encryptedString = jsencrypt.encrypt(params);
            }
            catch(e){
                app.utils.log("初始化encryptedString失败",e);
            }

            return this;
        }

        //连接socket
        this.connectSocket = function(){
            var self = this;

            if(this.lib == "primus"){
                this.generateCommKey();
		        this.generateEncryptedString();
            }

            try{
                if(this.lib == "socketio"){
                    this.socket = io(this.websocketurl,{"force new connection" : true});
                }
                else{
                    this.socket = Primus.connect(this.websocketurl);
                }
            }
            catch(e){
                app.utils.log(e);
                return;
            }

            if(this.lib == "socketio"){
                this.socket.on('router', function(data) {
                    var _data = JSON.parse(Base64.decode(data));
                    app.utils.log("接收数据：",_data.cmd,_data);

                    this.dispatchAction(_data.cmd,_data,"socket");
                }.bind(this));

                this.socket.on('connect', function() {
                    app.utils.log("连接已建立");
                });

                this.socket.on('disconnect', function(data) {
                    app.utils.log("连接已断开");            
                });

                this.socket.on('close', function(data) {
                    app.utils.log("连接已关闭");
                });

                this.socket.on('connect_error', function(error) {
                    app.utils.log("连接发生错误");
                });

                this.socket.on('reconnecting', function() {
                    app.utils.log("重连中");
                });
            }
            else{
                this.socket.on('outgoing::url', function(url){
                    url.query = 'login=' + self.encryptedString;
                    app.utils.log("outgoing::url",url.query);
                });

                this.socket.on('open', function(){
                    app.utils.log("连接成功");	        
                });

                this.socket.on('data', function(data){
                    //解密
                    var decryptstr = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(_commKey), {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    });

                    var dataString = decryptstr.toString(CryptoJS.enc.Utf8);
                    var parsedData = JSON.parse(dataString);
                    app.utils.log("接收数据：",parsedData.cmd,parsedData);

                    //更新jwt token
                    if(parsedData.cmd == "conn::init"){
                        jwtToken = parsedData.res;
                    }
                    else{
                        this.dispatchAction(parsedData.cmd,parsedData,"socket");
                    }
                }.bind(this));

                this.socket.on('error', function(data){
                    app.utils.log("连接出错");
                });

                this.socket.on('reconnect', function(){
                    app.utils.log("重连中");	        
                });

                this.socket.on('end', function(){
                    app.utils.log("连接已关闭");     
                });
            }
        }

        //断开socket
        this.disconnectSocket = function(){
            if(this.socket){
                if(this.lib == "socketio"){
                    this.socket.close();
                    this.socket.removeAllListeners();
                }
                else{
                    this.socket.end();
                }
                
                this.socket = null;
            }
        }
    };    
})();