//io
{
    const app = window.app;
    const CryptoJS = window.CryptoJS;
    const Base64 = window.Base64;
    class messageCenterModule {
        constructor(options) {
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
        init() {
            this.cmd = {

            }

        }

        //注册
        registerAction(key, callback) {
            if (typeof callback === "function") {
                this.registedAction[key] = callback;
            }

            return this;
        }

        //取消注册
        unRegisterAction(key) {
            if (typeof this.registedAction[key] !== "undefined") {
                delete this.registedAction[key];
            }

            return this;
        }

        //触发
        dispatchAction(key, data, type) {
            let callback = this.registedAction[key];
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
        emit(key, type, params, callback) {
            // 说明未登录
            if (typeof type === 'function') {
                callback = type;
            }
            if (typeof type === 'object') {
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
        emitAjax(key, params) {
            let self = this;
            let _url = this.ajaxUrl[key];
            if(key === 'userAccount'){
                let time = new Date().getTime();
                _url = _url.replace(/\*/, time);
            }
            window.$.ajax({
                url: _url,
                data: params,
                timeout: this.ajaxTimeout,
                success: function(response) {
                    app.utils.log(_url, response);

                    response = response || {};
                    self.dispatchAction(key, response, "ajax");
                },
                error: function() {
                    //异常处理
                }
            });
        }

        //获取socket数据
        emitSocket(data) {
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
                    let encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(this._commKey), {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    });

                    //发送加密数据
                    this.socket.write(encryptData.toString());
                }
            }
        }

        //生成commkey
        generateCommKey() {
            try {
                //默认32位编码
                this._commKey = Date.parse(new Date()).toString() + Date.parse(new Date()).toString() + Date.parse(new Date()).toString().substring(0, 6);
            } catch (e) {
                app.utils.log("初始化commKey失败", e);
            }

            return this;
        }

        //生成encryptedString
        generateEncryptedString() {
            try {
                let params = "jwt=" + this.token + "&commKey=" + this._commKey;
                let jsencrypt = new window.JSEncrypt();
                jsencrypt.setPublicKey(this.publicKey);
                this.encryptedString = jsencrypt.encrypt(params);
            } catch (e) {
                app.utils.log("初始化encryptedString失败", e);
            }

            return this;
        }

        //连接socket
        connectSocket() {
            let self = this;

            if (this.lib === "primus") {
                this.generateCommKey();
                this.generateEncryptedString();
            }

            try {
                if (this.lib === "socketio") {
                    this.socket = window.io && window.io(this.websocketurl, { "force new connection": true });
                } else if (this.lib === "primus") {
                    this.socket = window.Primus.connect(this.websocketurl);
                }
            } catch (e) {
                app.utils.log(e);
                return;
            }

            if (this.lib === "socketio") {
                this.socket.on('router', function(data) {
                    let _data = JSON.parse(Base64.decode(data));
                    console.log("接收数据：", _data.cmd, _data);

                    this.dispatchAction(_data.cmd, _data, "socket");
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
            } else if (this.lib === "primus") {

                this.socket.on('outgoing::url', function(url) {
                    url.query = 'login=' + self.encryptedString;
                    console.log("outgoing::url", url.query);
                });

                this.socket.on('open', function() {
                    app.utils.log("连接成功");

                    // 未登录情况下无法知道sokcet已连接
                    if (!app.utils.checkLoginStatus()) {
                        // 进房间
                        app.enterRoom(false);
                        console.log('open~~~未登录。。。');
                    }

                });

                this.socket.on('data', function(data) {
                    //解密
                    let decryptstr = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(this._commKey), {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    });

                    let dataString = decryptstr.toString(CryptoJS.enc.Utf8);
                    let parsedData = JSON.parse(dataString);

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

                this.socket.on('error', function(data) {
                    app.utils.log("连接出错");
                });

                this.socket.on('reconnect', function() {
                    app.utils.log("重连中");
                    // 断开socket
                    self.disconnectSocket();
                    setTimeout(function(){window.location.reload()}, 2000);
                });

                this.socket.on('end', function() {
                    app.utils.log("连接已关闭");
                });
            }
        }

        //断开socket
        disconnectSocket() {
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
    }

    window.messageCenterModule = messageCenterModule;

}
