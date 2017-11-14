/*
 *  大三角
 */
{
    const app = window.app;
    const Bezier = window.Bezier;
    const main_triangleUI = window.main_triangleUI;
    const {
        COLOR_TO_NUMBER,    //颜色对应数字
        ALL_ANGLE,
        BEZIER_MIDDLEPOS, //贝塞尔曲线的坐标（中间点）
        END_POSITION_LIST, // 小三角的坐标（终止点）
        CANCEL_LIGHT_POS, // 删除的高光坐标
        LIGHT_AND_INDEX_TABLE // 高亮光线与索引的对应关系
    } = app.data;


    class Main_triangleView extends main_triangleUI {
        constructor(...args) {
            super(...args);
            this.init();
        }

        init() {

            this.initDom();

            this.initConfig();

            // 创建贝塞尔曲线
            this._createBezierCurve();

            // 注册
            this.registerAction();

        }

        // 触发
        dispatchAction(callBack) {
            let arr = JSON.parse(JSON.stringify(ALL_ANGLE));
            this.enter(arr, callBack);
        }

        // 注册
        registerAction() {

            // 订阅弹层出现
            // app.observer.subscribe('rankPopShow', this.myShow.bind(this));
        }

        initDom() {
            // 添加小三角的盒子
            this.dom_angle_box = this.getChildByName('angle_box');
            // 删除高光
            this.dom_cancel_box = this.getChildByName('cancel_box');
            // 大三角黄色光
            this.dom_yellow_light = this.getChildByName('yellow_light');
            this.dom_yellow_light.stop();
            this.dom_yellow_light.visible = false;
        }

        // 初始化配置参数
        initConfig() {
            //全部小三角列表
            let angleList = this.createAngleChildren();
            // 创建删除高光
            let cancelLightList = this._createCancelLight();

            this.config = {
                bezierStartPos: { x: 580, y: 485 }, //贝塞尔曲线的坐标（起始点）
                currentBetCallBack: null, //当局投币的回调函数
                exitCompleted: true, //退场是否完毕
                gameData: {}, //游戏数据
                isBonusWork: false, // bonus点击是否生效
                bonusSelectedList: [], // 已选好的bonus三角
                angleList,
                cancelLightList
            }

        }

        // 创建小三角
        createAngleChildren() {
            // 小三角点击后的回调
            let cb = (obj) => {
                // 这个顺序是固定的
                let index = this.config.angleList.indexOf(obj);

                let serverIndex = this._localIndexToServer(index);

                // 不可点
                if (!this.config.isBonusWork) {
                    app.utils.log(serverIndex, 'bonus 无效');

                } else {
                    let list = this.config.bonusSelectedList;
                    if (!list.includes(obj) && list.length < 3) {
                        list.push(obj);

                        // 渲染为彩色
                        obj.rotateAnimate(()=>{
                            obj.renderSkin(8, obj.isBonus);

                            // 发送命令
                            app.messageCenter.emit('bonus', { pos: serverIndex });
                        })

                        app.audio.play('change');
                        app.utils.log(serverIndex, 'bonus 生效');

                    } else {
                        app.utils.log(serverIndex, 'bonus 已选');
                    }

                }
            }

            return END_POSITION_LIST.map((item, index) => {
                return new app.AngleView(cb);
            })
        }

        // 后台数据处理
        serverDataHandler(data) {
            let result = [];
            let nArray = [];
            data.forEach((item, index) => {
                let n = this._serverIndexToLocal(item.n);
                item.n = n;
                nArray.push(n);
            })

            nArray.sort((n1, n2) => {
                return n1 - n2;
            })

            // 排序对应到我本地的顺序
            nArray.forEach((item, index) => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].n === item) {
                        result.push(data.splice(i, 1)[0]);
                        i--;
                        break;
                    }
                }
            })

            return result;
        }

        // 测试时间
        testTime(fn, data) {
            let t1 = Date.now();
            fn(data);

            let t2 = Date.now();

            console.log(t2 - t1);

        }

        // 复盘
        recoverBonus(data, callBack) {
            let initial = data.initial;
            data.replace.forEach((item, index) => {
                for (let i = 0, l = initial.length; i < l; i++) {
                    if (initial[i].n === item) {
                        // 变彩色
                        initial[i].c = 8;

                        // 表示玩家已经选中过了
                        let _i = this._serverIndexToLocal(item);
                        this.config.bonusSelectedList.push(this.config.angleList[_i]);

                        break;
                    }
                }
            })

            this.enter(initial, callBack);
        }

        // 开场数据接收回调
        gameDataCome(data, cb) {

            this.config.gameData = data;
            this.config.currentBetCallBack = cb;

            // 开始小三角数据渲染
            this.startGameDataRender();

        }

        // 开始小三角数据渲染
        startGameDataRender() {
            let _config = this.config;
            let _gameData = _config.gameData;

            // 有数据 && 退场完毕
            if (_gameData.initial && _gameData.initial.length && _config.exitCompleted) {
                this.enter(_gameData.initial, this.config.currentBetCallBack);
            }
        }

        // 进场
        enter(data, callBack) {
            this.config.exitCompleted = false;
            data = this.serverDataHandler(data);
            let cb = (index) => {
                if(index === 8){
                    // 旋转音效
                    app.audio.play('rotate');
                }

                if (index === 0) {
                    // 计算bonus个数（决定点击是否生效）
                    this.isBonusWorkFn();

                    let gameData = this.config.gameData;
                    // 判断是否有消减数据
                    if (gameData.change && gameData.change.length) {
                        let changeItem = gameData.change.splice(0, 1)[0];

                        // 判断是否有福袋大奖奖励
                        if (gameData.bpAmount) {
                            //中奖弹层
                            app.observer.publish('bigPrisePopShow', 'fudai', gameData.bpAmount, this.cancelAngle.bind(this, changeItem, callBack));

                            // room底部赢打开
                            app.observer.publish('winOpen', gameData.bpAmount);
                            // 更新用户余额
                            app.observer.publish('updateUserYuDou', gameData.bpAmount);

                            app.audio.play('fudai');

                            // 清除福袋中奖金额
                            gameData.bpAmount = 0;

                        } else {
                            this.cancelAngle(changeItem, callBack);
                        }

                    } else {
                        callBack && callBack();

                    }

                    app.utils.log('进场结束。。。');
                }
            }

            let targeAngleList = this.computeWhichAngle(data);
            let len = targeAngleList.length;
            let dom_angle_box = this.dom_angle_box;
            targeAngleList.forEach((item, index) => {
                Laya.timer.once((len - index) * 80, this, () => {
                    let _data = data[index];
                    item.renderSkin(_data.c, _data.b);

                    // 设置层级
                    dom_angle_box.addChildAt(item, 0);

                    // 开始动画
                    item.enter(cb, index);

                    app.audio.play('enter');
                });
            })
        }

        // 全体离场
        exit() {
            // 已经离场完成
            if (this.config.exitCompleted) {
                return;
            }

            let angleList = this.config.angleList;
            let len = angleList.length - 1;
            let cb = (index) => {
                if (index === len) {
                    this.config.exitCompleted = true;

                    // 开始小三角数据渲染
                    this.startGameDataRender();

                    app.utils.log('离场结束。。。');
                }
            }

            angleList.forEach((item, index) => {
                // 调节一下层次
                Laya.timer.once(index * 60, this, () => {
                    // 开始动画
                    item.exit(cb, index);
                });
            })

            // 播放3次
            app.audio.play('exit', 2);

        }

        // 消除
        cancelAngle(data, callBack, lastTargetAngleList) {
            // 是否多条线继续旋转
            let isContinue = data.remove.length > 0;

            // 继续转
            if (isContinue) {
                // 每一项待删除的三角索引数组
                let itemRemove = data.remove.splice(0, 1)[0];

                // 处理成想要的顺序结果
                let triangleItem = this.serverDataHandler(itemRemove.triangle);

                // 添加高光线 && 该线的中奖金额
                this.addCancelLight(triangleItem, itemRemove.prize_color, itemRemove.prize_amount);

                // 待处理的三角
                let targeAngleList = this.computeWhichAngle(triangleItem);

                // 缓存一下
                let cb1 = this.removeAllCancelLight.bind(this);

                let cb2 = (index) => {
                    if (index === 0) {
                        // 把上一次的目标三角合并起来
                        if (Array.isArray(lastTargetAngleList)) {
                            targeAngleList = targeAngleList.concat(lastTargetAngleList);
                        }

                        this.cancelAngle(data, callBack, targeAngleList);
                        app.utils.log('继续旋转。。。')
                    }
                }

                targeAngleList.forEach((item, index) => {
                    // 设置层级
                    this.dom_angle_box.setChildIndex(item, 0);

                    // 开始动画
                    item.cancelAngle(cb1, cb2, index);
                })

                // 删减的三角全部消除
            } else {
                let cb = (index) => {
                    if (index === lastTargetAngleList.length - 1) {
                        // 回调重新填充的三角
                        this.enter(data.fill, callBack);

                        app.utils.log('消除结束。。。')
                    }
                }

                lastTargetAngleList.forEach((item, index) => {
                    // 设置层级
                    this.dom_angle_box.setChildIndex(item, 0);

                    // 开始动画
                    item.exit(cb, index);
                })

                app.audio.play('exit');

            }

        }

        // 移除全部高光线
        removeAllCancelLight(index) {
            if (index === 0) {
                let cancelLightList = this.config.cancelLightList;
                cancelLightList.forEach((item, index) => {
                    item.removeSelf();
                })
            }
        }

        // bonus惊喜
        bonusCancelAngle(data, callBack) {
            this.config.gameData.change = data;

            // 消除所有的bonus
            let changeItem = this.config.gameData.change.splice(0, 1)[0];

            // 有可能没中奖就是空数组
            if (typeof changeItem === 'undefined') {
                callBack && callBack();
            } else {
                this.cancelAngle(changeItem, callBack);
            }

            this.dom_yellow_light.stop();
            this.dom_yellow_light.visible = false;
        }

        // 消除所有的bonusIcon
        removeAllBonusIcon() {
            this.config.angleList.forEach((item, index) => {
                if (item.isBonus) {
                    item.removeBonusIcon();
                }
            })
        }

        // 计算bonus个数（决定点击是否生效）
        isBonusWorkFn() {
            let count = 0;
            let result = false;
            this.config.angleList.forEach((item, index) => {
                if (item.isBonus) {
                    count++;
                }
            })

            // 大于3个 && 消除所有的bonus图标
            if (count >= 3) {
                this.removeAllBonusIcon();
                result = true;

                // 清空已点击bonus列表
                this.config.bonusSelectedList.length = 0;

                this.dom_yellow_light.play('start', true);
                this.dom_yellow_light.visible = true;
            }

            // bonus高亮
            app.observer.publish('leftBonusRender', count);

            this.config.isBonusWork = result;
        }

        // 后台返回的索引处理
        _serverIndexToLocal(i) {
            let result;
            i = Number(i);
            switch (true) {
                case i === 15:
                    result = 0;
                    break;
                case (i >= 12 && i <= 14):
                    result = i - 11;
                    break;
                case (i >= 7 && i <= 11):
                    result = i - 3;
                    break;
                default:
                    result = i + 9;
                    break;
            }

            // 暂不修改
            return result;

        }

        // 后台返回的索引处理
        _localIndexToServer(i) {
            let result;
            i = Number(i);
            switch (true) {
                case i === 0:
                    result = 15;
                    break;
                case (i >= 1 && i <= 3):
                    result = i + 11;
                    break;
                case (i >= 4 && i <= 8):
                    result = i + 3;
                    break;
                default:
                    result = i - 9;
                    break;
            }

            return result;
        }

        // 创建删除高光
        _createCancelLight() {
            let cancelLightList = [];

            CANCEL_LIGHT_POS.forEach((item, index) => {
                let { x, y, direction } = item;
                let light = new Laya.Clip();
                light.skin = 'images/room/clip_colors.png';
                light.clipX = 8;
                if (direction === 1) {
                    light.rotation = 90;
                    x += 69;
                }

                light.pos(x, y);
                cancelLightList.push(light);
            })

            return cancelLightList;
        }

        // 高亮线的颜色索引对应关系
        heightLightColorToIndex(num) {
            let index;
            switch (Number(num)) {
                case 1:
                    index = 4;
                    break;
                case 2:
                    index = 6;
                    break;
                case 3:
                    index = 3;
                    break;
                case 4:
                    index = 5;
                    break;
                case 5:
                    index = 0;
                    break;
                case 6:
                    index = 2;
                    break;
                case 7:
                    index = 1;
                    break;
                case 8:
                    index = 7;
                    break;
            }

            return index;
        }

        // 添加删除高光 & 颜色
        addCancelLight(data, color, prize) {
            let cancelLightList = this.config.cancelLightList;

            // 获取高亮光线对应的颜色索引()
            let lightIndex = this.heightLightColorToIndex(color);
            let keyList = [];
            let indexList = [];
            let arr = data.map((item, index) => {
                return item.n;
            })

            let upDownLine = ['0-2', '1-5', '3-7', '4-10', '6-12', '8-14'];

            // 获得高亮线的索引
            arr.forEach((item, index, array) => {
                // 每次都遍历一下
                for (let val of upDownLine) {
                    let partedArr = val.split('-');
                    if (item === Number(partedArr[0]) && array.includes(Number(partedArr[1]))) {
                        keyList.push(val);

                        break;
                    }
                }

                let after = array[index + 1];
                if (typeof after !== 'undefined') {
                    keyList.push(item + '-' + after);
                }
            })

            keyList.forEach((item, index) => {
                let value = LIGHT_AND_INDEX_TABLE[item];
                if (typeof value !== 'undefined') {
                    indexList.push(value);
                }
            })

            // 高亮光线
            indexList.forEach((item, index) => {
                let dom = cancelLightList[item];
                dom.index = lightIndex;
                this.dom_cancel_box.addChild(dom);
            })

            // 最上面的高亮线元素
            let minDom = cancelLightList[Math.min(...indexList)];
            let x = minDom.x;
            let y = minDom.y;

            // 金额数字
            this.awardFontAnimate(prize, { x, y }, color);

            // room底部赢打开
            app.observer.publish('winOpen', prize);

            // 右侧中奖倍率高亮
            app.observer.publish('rightBaseRender', color);

            app.audio.play('line');

        }

        // 奖励飘字
        awardFontAnimate(text, { x, y }, color) {
            let domLabel = new Laya.Label();
            domLabel.font = COLOR_TO_NUMBER[Number(color) - 1];
            domLabel.text = text;
            domLabel.pos(x - 50, y - 100);
            this.addChild(domLabel);

            Laya.timer.once(850, this, () => {
                domLabel.destroy(true);
            });

        }

        // 创建贝塞尔曲线
        _createBezierCurve() {
            let config = this.config;
            let startPos = config.bezierStartPos;
            let angleList = config.angleList;

            END_POSITION_LIST.forEach((item, index) => {
                let middle = BEZIER_MIDDLEPOS[index];
                let bezier = new Bezier(startPos.x, startPos.y, middle.x, middle.y, item.x - 61, item.y - 61);
                let angle = angleList[index];

                // 贝塞尔曲线 & 角度 & bouns的坐标 （一次性确定）
                angle.addCurve(bezier).addIsUpProperty(item.isUp);
            })
        }

        // 计算当前是哪些三角开始动画
        computeWhichAngle(data) {
            let angleList = this.config.angleList;
            let targeAngleList = [];

            data.forEach((item, index) => {
                let dom = angleList[item.n];
                if (!targeAngleList.includes(dom)) {
                    targeAngleList.push(dom);
                }
            })

            return targeAngleList;
        }
    }

    app.Main_triangleView = Main_triangleView;


}
