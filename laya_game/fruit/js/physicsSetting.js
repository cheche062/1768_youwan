{
    const app = window.app;
    let stageWidth = app.config.gameWidth;
    let stageHeight = app.config.gameHeight;

    let Matter = window.Matter;
    let LayaRender = window.LayaRender;

    let mouseConstraint; //matter鼠标限制实例
    let engine; //matter引擎实例
    let layaRenderEx = null; //layarender实例

    let Body = Matter.Body;
    let Composite = Matter.Composite;
    let Composites = Matter.Composites;
    let Bodies = Matter.Bodies;

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

        init(data) {
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
        createMatterView() {
            this.matterView_ui_box = new window.matterViewUI();
            this.matterView_ui_box.x = app.gameConfig.viewLeft;
            this.matterView_ui_box.zOrder = 1;
            Laya.stage.addChild(this.matterView_ui_box);
        },

        // 添加spin
        addSpinView(data) {
            // 添加spin元素(注意层级)
            this.spin_ui_box = new app.SpinViewUI();

            this.matterView_ui_box.addChild(this.spin_ui_box);
            this.spin_ui_box.renderLight(data);
        },

        initMatter() {
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
        initWorld() {
            let arr = [];
            let _walls = this.addWalls();
            this.childBodies.ground = _walls[0];
            this.childBodies.walls = _walls.slice(1);
            arr.push(..._walls);

            let _nails = this.childBodies.nails = this.addNails();
            arr.push(..._nails);

            let _swings = this.childBodies.swings = this.addSwings();
            arr.push(..._swings);

            let _spin = this.addSpin();
            this.childBodies.compound = _spin[0];
            this.childBodies.spin = _spin[1];
            arr.push(..._spin);

            let _cars = this.addCar();
            this.childBodies.carEars = _cars.slice(0, 2);
            this.childBodies.car = _cars[2];
            arr.push(..._cars);

            // 添加风扇
            let _fan = this.childBodies.fans = this.addFan();
            arr.push(..._fan);

            // 创建金币刚体对象池
            this.createCoinBody();

            // 创建buff刚体对象池
            this.createSkillBody();

            // 引擎世界添加刚体
            Matter.World.add(engine.world, arr);

        },

        // 扩展配置对象，方便读取
        getUIPos() {
            // 浅拷贝配置数据
            Object.assign(this.config, app.room_ui_box.config, this.spin_ui_box.config);

            let _config = this.config;

            // 摆针旋转的中心
            _config.swingRotatePos = _config.swingsInitPos.map((item) => {
                return {
                    x: item.x + 10,
                    y: item.y + 10
                }
            })

            // console.log(this.config);
        },

        // 添加静态墙
        addWalls() {
            // 墙体厚度
            let ply = this.config.wall_ply;
            let r = this.config.conin_r;
            let groundY = stageHeight;
            groundY = stageHeight + ply / 2 + r * 2;
            let swingPos = this.config.swingsInitPos[0];
            let render = this.config.render;

            // 地面墙
            let ground = Bodies.rectangle(stageWidth / 2, groundY, stageWidth, ply, {
                // 是否静止
                isStatic: true,
                // 渲染形式
                render
            })

            // 摆针上边的隐藏墙
            let wallSwing = Bodies.rectangle(swingPos.x + 10, swingPos.y - 80, 10, 200, {
                isStatic: true,
                render
            })

            // 墙（左）
            let wallLeft = Bodies.rectangle(ply / 2, stageHeight / 2, ply, stageHeight, {
                isStatic: true,
                render
            })

            // 墙（右）
            let wallRight = Bodies.rectangle(stageWidth - ply / 2, stageHeight / 2, ply, stageHeight, {
                isStatic: true,
                render
            })

            // 管道上边的坡
            let wallPoTop = Bodies.rectangle(503, 400, 200, 10, {
                isStatic: true,
                angle: Math.PI * -0.12,
                render
            })

            // 管道下边的坡
            let wallPoBottom = Bodies.rectangle(503, 470, 170, 10, {
                isStatic: true,
                angle: Math.PI * -0.12,
                render
            })

            let _result = [ground, wallLeft, wallRight, wallPoTop, wallPoBottom, wallSwing];
            _result.forEach((item) => {
                if (item.id !== ground.id) {
                    // nail 便于后面碰撞检测忽略它，提高性能
                    item.myName = 'nail';
                }
            })
            return _result;
        },

        // 添加摆针
        addSwings() {
            let swingsInitPos = this.config.swingsInitPos;
            let swingRotatePos = this.config.swingRotatePos;
            let swingSize = this.config.swingSize;
            let _result = [];
            let options = {
                isStatic: true,
                render: {
                    sprite: {
                        texture: 'room/swing.png',
                        xOffset: swingSize.w / 2,
                        yOffset: swingSize.h / 2
                    }
                }
            };
            swingsInitPos.forEach((item, index) => {
                let _sw = Composites.stack(item.x, item.y, 1, 1, 0, 0, (x, y) => {
                    let _b = Bodies.rectangle(x, y, swingSize.w, swingSize.h, options);
                    _b.myName = 'nail';
                    return _b;
                })
                _result.push(_sw);

                // 自定义角度（便于后面读取）
                _sw.myAngle = 2.4;
                _sw.myName = 'nail';
                Composite.rotate(_sw, 2.4, swingRotatePos[index]);
            })

            return _result;
        },

        // 添加风扇
        addFan() {
            let fansInitPos = this.config.fansInitPos;
            let size = { w: 100, h: 18 };
            let result = [];
            let options = {
                texture: 'room/fan.png',
                xOffset: size.w / 2,
                yOffset: size.h / 2
            }

            fansInitPos.forEach((item) => {
                let part1 = Bodies.rectangle(item.x, item.y, size.w, size.h, {
                    density: 0.005,
                    render: {
                        sprite: options
                    }
                });

                let constraint = Matter.Constraint.create({
                    pointA: item,
                    bodyB: part1,
                    stiffness: 1,
                    render: this.config.render
                });

                part1.myName = 'fan';
                result.push(part1, constraint);

            })

            return result;

        },

        // 添加钉子
        addNails() {
            let nailPosList = this.config.nailPosList;
            let _result = [];
            let r = 10;
            // 不通过Laya来映射刚体（减少sprit数量提高性能）
            let options = {
                frictionStatic: 0.15,
                isStatic: true,
                render: this.config.render
            };
            nailPosList.forEach((item) => {
                let _nail = Bodies.circle(item.x + r, item.y + r, r, options);
                _nail.myName = 'nail';
                _result.push(_nail);
            })

            return _result;
        },

        // 创建金币刚体
        createCoinBody() {
            // 金币半径
            let r = this.config.conin_r;
            let arr = this.childBodies.allCoinArr;
            // 金币(默认皮肤)
            let coinOptions = {
                density: 0.01,
                friction: 0.05,
                frictionAir: 0.005, //空气摩擦力
                frictionStatic: 0.08, //静止摩擦力
                render: {
                    sprite: {
                        texture: `room/coin_10.png`,
                        xOffset: r,
                        yOffset: r
                    }
                }
            }

            // 一共创建50个金币
            for (let i = 0; i < 50; i++) {
                let coin = Matter.Bodies.circle(0, -100, r, coinOptions);
                // 添加自定义名字
                coin.myName = 'coin';

                // 扔进金币数组
                arr.push(coin);

                // 硬性给金币刚体添加layaSprit
                LayaRender.body(layaRenderEx, coin);
            }

        },

        // 添加金币
        addCoin(orderId) {
            let initPos = this.config.coinInitPos;
            let _baseCoin = Number(app.gameConfig.baseCoin);
            let coin = this.childBodies.allCoinArr.shift();

            if (typeof coin === 'undefined') {

                console.warn('金币刚体对象池空了');
                return;
            }

            if (this.config.coninTypeArr.indexOf(_baseCoin) === -1) {
                _baseCoin = '10';
                console.warn('测试同学请注意：目前金币样式只有10,50,100,1000。默认为10')
            }

            this.coinCount++;
            this.debugCoinCount++;

            // 唯一标识符(后台校验)
            coin.orderId = orderId;

            // 给金币换成该场次的金币皮肤
            coin.layaSprite.loadImage(`room/coin_${_baseCoin}.png`);

            // 初始作用力
            // 这种方式力道不兼容（原因不详）
            // Matter.Body.applyForce(coin, coin.position, { x: _x, y: _y });

            let _x = -Math.round(Math.random() * 15 + 10);
            let _y = Math.round(Math.random() * 10 + 10);

            // 初始坐标
            Matter.Body.setPosition(coin, { x: initPos.x, y: initPos.y });

            // 向物理世界添加金币
            Matter.World.add(engine.world, coin);

            // 初始速度
            Matter.Body.setVelocity(coin, { x: _x, y: _y });

        },

        // 金币销毁的自转动画
        animateCoin(position) {
            let mFactory = new Laya.Templet();
            let num = Number(app.gameConfig.baseCoin);
            if (this.config.coninTypeArr.indexOf(num) === -1) {
                num = 10;
                console.warn('测试同学请注意：目前金币样式只有10,50,100,1000。默认为10')
            }
            mFactory.parseData(Laya.loader.getRes(`animate/${num}.png`), Laya.loader.getRes(`animate/${num}.sk`), 24);
            let maidenArmat = mFactory.buildArmature();
            let type = '';

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
            Laya.timer.once(1000, this, () => { maidenArmat.destroy(true) });

        },

        // buff骨骼动画
        animateBuff(type, position) {
            let mFactory = new Laya.Templet();
            mFactory.parseData(Laya.loader.getRes("animate/buff.png"), Laya.loader.getRes("animate/buff.sk"), 24);
            let maidenArmat = mFactory.buildArmature();

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
            Laya.timer.once(2000, this, () => { maidenArmat.destroy(true) });
        },

        // 添加spin和一对耳朵（组合器）
        addSpin() {
            let MIN_X = this.config.MIN_X;
            let _y = this.config.STATIC_Y;
            let r = 10;
            let disX = 80;
            let render = this.config.render;
            let spinLeft = Bodies.circle(MIN_X + 15, _y + 10, r, { render });
            let spinRight = Bodies.circle(MIN_X + disX + 15, _y + 10, r, { render });
            spinLeft.myName = 'nail';
            spinRight.myName = 'nail';
            // 组合器
            let compoundEar = Body.create({
                parts: [spinLeft, spinRight],
                isStatic: true,
                render
            });
            compoundEar.myName = 'nail';

            let spin = Bodies.rectangle(MIN_X + 15 + disX / 2, _y + 20, disX - 50, 10, {
                isSensor: true,
                isStatic: true,
                render
            });

            spin.myName = 'spin';

            return [compoundEar, spin];
        },

        // 创建技能传感器刚体对象池
        createSkillBody() {
            let arr = this.childBodies.allSkillArr;
            let r = 6;

            // 不通过Laya来映射刚体（减少sprit数量提高性能）
            let options = {
                isSensor: true,
                isStatic: true,
                render: this.config.render
            };

            for (let i = 0; i < 10; i++) {
                let bodySkill = Bodies.circle(0, 0, r, options);
                bodySkill.myName = 'buff';
                arr.push(bodySkill);
            }

        },

        // 添加技能传感器
        addSkills(targetIndex, buff) {
            let skillPosList = this.config.skillPosList;
            let position = skillPosList[targetIndex];
            let bodySkill = this.childBodies.allSkillArr.shift();

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
        addCar() {
            let _carEarPosList = this.config.carEarPosList;
            let _carPos = this.config.carPos;
            let _bodyCarEars = [];
            let _result = [];
            let options = {
                isStatic: true,
                render: this.config.render
            };
            // 把手刚体
            _carEarPosList.forEach((item, index) => {
                let _x = index === 0 ? item.x - 5 : item.x + 5;
                let _ear = Bodies.rectangle(_x, item.y, 30, 5, options);
                _ear.myName = index + '把手';
                _bodyCarEars.push(_ear);
            })

            // 车体刚体
            let bodyCar = Bodies.rectangle(_carPos.x, _carPos.y - 10, 20, 5, options);
            bodyCar.myName = '2小车';
            _result = [..._bodyCarEars, bodyCar];

            return _result;

        },

        // 开始移动
        bodyMoving() {
            let swingRotatePos = this.config.swingRotatePos;
            let _bodys = this.childBodies;
            let compound = _bodys.compound;
            let spin = _bodys.spin;
            let swings = _bodys.swings;
            let carEars = _bodys.carEars;
            let car = _bodys.car;
            let spinSprite = this.spin_ui_box;

            let compoundY = compound.position.y;
            let spinY = spin.position.y;
            let carEarY = carEars[0].position.y;
            let carY = car.position.y;

            let centerX = 750 / 2;
            let counter = 0;
            let counter2 = 0;
            let speed = 0.01;
            let px = 0;
            let px2 = 0;

            // 运动部分
            Matter.Events.on(engine, 'beforeUpdate', () => {
                // spin随时暂停
                if (!this.skillsInfo.stop_spin) {
                    counter += 0.01;
                }
                // 小车随时暂停
                if (!this.skillsInfo.stop_car) {
                    counter2 += 0.0102;
                }

                // 摆针运动
                swings.forEach((item, index) => {
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
                    let car_box = app.room_ui_box.car_box;
                    if (!car_box.destroyed) {
                        if (!car_box.visible) { car_box.visible = true; }
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
        collisionTest() {
            let _bodies = this.childBodies;
            let groundId = _bodies.ground.id;
            let spinId = _bodies.spin.id;
            let skillBodies = _bodies.skills;
            let fans0Id = _bodies.fans[0].id;
            let fans1Id = _bodies.fans[2].id;
            let carEars_car = [..._bodies.carEars, _bodies.car];

            Matter.Events.on(engine, 'collisionStart', (event) => {
                event.pairs.forEach((item) => {
                    let bodyA = item.bodyA;
                    let bodyAid = bodyA.id;
                    let bodyB = item.bodyB;
                    let bodyBid = bodyB.id;

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

                        this.enterFan(bodyBid);

                    }

                    // 经过spin区
                    if (bodyAid === spinId) {
                        this.enterToSpin(bodyB);

                    }

                    // 接触地面销毁(接触地面后就结束了)
                    if (bodyAid === groundId) {
                        this.enterToOut(bodyB);

                        return;
                    }

                    // 经过buff
                    this.enterToBuff(bodyA, skillBodies, bodyB);

                    // 经过托盘小车
                    this.enterToCar(bodyAid, carEars_car, bodyB);
                })
            });
        },

        // 击中风扇
        enterFan(bodyBid) {
            if (this.fanPassArr.indexOf(bodyBid) === -1) {
                this.fanPassArr.push(bodyBid);

                // 发送(击中风扇)
                app.messageCenter.emit("palletTrigger");

            }

        },

        // 处理经过spin
        enterToSpin(bodyB) {
            // 已经击中spin
            bodyB.isHitSpin = true;

            // 发送spin
            app.messageCenter.emit('spin', { orderId: bodyB.orderId, isHit: true });

            // spin闪烁
            app.observer.publish('spinPlay');

        },

        // 处理经过地面销毁
        enterToOut(bodyB) {
            // console.log(item.bodyB.position);
            // console.log(item.bodyB.id);

            // 未击中过spin
            if (!bodyB.isHitSpin) {
                app.messageCenter.emit('spin', { orderId: bodyB.orderId, isHit: false });
            }

            // 未击中托盘
            app.messageCenter.emit('pallet', { orderId: bodyB.orderId, isHit: false, area: '' });

            let _index = this.fanPassArr.indexOf(bodyB.id);
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
        enterToBuff(bodyA, skillBodies, bodyB) {

            // 经过技能
            for (let i = 0, len = skillBodies.length; i < len; i++) {
                let item = skillBodies[i];
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
        destroyBuff(data) {
            let _skills = this.childBodies.skills;
            let _index = -1;

            // 刚体销毁 & laya元素消除
            for (let i = 0, len = _skills.length; i < len; i++) {
                if (_skills[i].buff_id === data.id) {
                    // 销毁刚体
                    Matter.World.remove(engine.world, _skills[i], true);
                    _index = i;

                    break;
                }
            }

            // 在数组中干掉
            if (_index > -1) {
                let spliceItem = _skills.splice(_index, 1)[0];

                // 丢回技能刚体对象池
                this.childBodies.allSkillArr.push(spliceItem);

                // 更新
                this.updateLayaBuff(_skills);
            }

        },

        // 同步laya buff元素
        updateLayaBuff(_skills) {
            let _room = app.room_ui_box;
            let _skillExist = [0, 1, 2, 3, 4, 5, 6, 7];

            _skills.forEach((item) => {
                let _index = item.targetIndex;
                _skillExist.splice(_skillExist.indexOf(_index), 1);
                _room.skill_list[_index].visible = true;

            });

            _skillExist.forEach((item) => {
                _room.skill_list[item].visible = false;

            })

            // 可提供存放buff的位置索引
            _room.configRoom.skillExist = _skillExist;

        },

        // 经过托盘小车
        enterToCar(bodyAid, carEars_car, bodyB) {
            // 经过小车
            for (let i = 0, len = carEars_car.length; i < len; i++) {
                if (bodyAid === carEars_car[i].id) {
                    let _area = carEars_car[i].myName.indexOf('小车') > -1 ? 'chief' : 'vice';

                    // 索引
                    app.room_ui_box.cartoonFn(carEars_car[i].myName.slice(0, 1), bodyB.position);
                    // 击中托盘
                    app.messageCenter.emit('pallet', { orderId: bodyB.orderId, isHit: true, area: _area });

                    // 未击中过spin
                    if (!bodyB.isHitSpin) {
                        app.messageCenter.emit('spin', { orderId: bodyB.orderId, isHit: false });
                    }

                    let _index = this.fanPassArr.indexOf(bodyB.id);
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
        buffSkillStop(type, time) {
            let info = this.skillsInfo;

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
        carDecreaseCount() {
            let info = this.skillsInfo;

            if (info.count_car > 0) {
                info.count_car--;

            } else {
                Laya.timer.clear(this, this.carDecreaseCount);
                info.stop_car = false;
                info.count_car = 0;
            }

        },

        // spin计数递减
        spinDecreaseCount() {
            let info = this.skillsInfo;

            if (info.count_spin > 0) {
                info.count_spin--;

            } else {
                Laya.timer.clear(this, this.spinDecreaseCount);
                info.stop_spin = false;
                info.count_spin = 0;
            }

        },

        // 注册
        registerAction() {
            // 投金币
            app.messageCenter.registerAction("bet", this.betHandle.bind(this));

            //buff销毁
            app.messageCenter.registerAction("buffEnd", this.destroyBuff.bind(this));

        },

        // 取消注册
        unRegisterAction() {

            app.messageCenter.unRegisterAction("bet")
                .unRegisterAction("buffEnd");

        },

        // 投币处理
        betHandle(data) {
            let code = Number(data.code);

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
                app.observer.publish('commonPopShow', data.msg, true, () => {
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
        leaveMatter() {
            let _world = engine.world;
            let _move = Matter.World.remove;
            let _set = Matter.Sleeping.set;
            let bodyArr = Matter.Composite.allBodies(_world);

            // 销毁所有的金币 & 剩下的所有刚体睡眠
            bodyArr.forEach((item) => {
                if (item.myName === 'coin') {
                    _move(_world, item, true);

                    // 重新丢回金币刚体池
                    this.childBodies.allCoinArr.push(item);

                } else {
                    _set(item, true);
                }
            })

            // 取消注册
            this.unRegisterAction();

            this.matterView_ui_box.visible = false;

            document.onkeyup = null;
        },

        // 再次进入matter
        enterMatterAgain(data) {
            let _set = Matter.Sleeping.set;

            // 唤醒刚体
            Matter.Composite.allBodies(engine.world).forEach((item) => {
                _set(item, false);
            })

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

    }




}
