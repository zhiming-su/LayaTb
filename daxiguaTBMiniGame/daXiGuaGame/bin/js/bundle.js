(function () {
    'use strict';

    /**
    *
    * @ author:wcysky
    * @ email:xxxxxx@gmail.com
    * @ data: 2021-08-05 10:15
    */
    class GameOverView extends Laya.Scene {

        constructor() {
            super();
        }

        onOpened(score) {
            if (this.txt_Score) {
                this.txt_Score.text = score;
            }
        }
    }

    /*
     * @Date: 2021-07-21 14:50:34
     * @Author: xlc
     * @LastEditors: xlc
     * @LastEditTime: 2021-07-22 16:04:47
     * @description: 
     */

    /**
    *
    * @ author:wcysky
    * @ email:
    * @ data: 2021-06-23 20:27
    */
    class Fruit extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
            this.xx = null;
            this.fruitId = -1;
            //是否已经落下来了
            this.isFall = false;
            this.gameManager = null;

            this._tween = null;
        }

        onAwake() {
        }

        Init(id) {
            this.fruitId = id;
            // console.log("初始化ID：", this.fruitId)
            this.gameManager = this.owner.parent.getComponent(GameManager);
            this._tween = new Laya.Tween();
        }

        /**
         * 碰撞检测
         * @param {*} other 
         * @param {*} self 
         * @returns 
         */
        onTriggerEnter(other, self) {
            this.isFall = true;
            if (this.gameManager.isGameOver) {
                return
            }

            //合成大西瓜 直接返回 this.gameManager.fruitPreArr.length - 1
            if (this.fruitId >= this.gameManager.fruitPreArr.length - 1) {
                // console.log("onTriggerEnter:", this.fruitId);
                this.gameManager.gameSound("res/sounds/victory.mp3");
                this.gameManager.addScore(this.gameManager.extraScore);
                Laya.stage.event("GameOver");
                return
            }

            if (other.owner.getComponent(Fruit) != null
                && other.owner.getComponent(Fruit).fruitId == this.fruitId && self.owner.active && other.owner.active) {
                // return
                //增加成绩分数(根据水果的ID来计算分数)
                this.gameManager.addScore((this.fruitId + 1) * 2);
                this.gameManager.gameSound("res/sounds/bomb.wav");
                // var ownerAngularVelocity = this.owner.getComponent(Laya.RigidBody).angularVelocity;
                // var otherAngularVelocity = other.owner.getComponent(Laya.RigidBody).angularVelocity;
                self.owner.active = false;
                other.owner.active = false;
                //生成一个新的水果，当前ID+1
                if (self.owner.y >= other.owner.y) {

                    let toX = self.owner.x;
                    let toY = self.owner.y;
                    this._tween.to(other.owner, { x: toX, y: toY }, 100, Laya.Ease.linearNone);
                    Laya.timer.once(80, this, this.completeSelf, [other, self]);
                } else {
                    let toX = other.owner.x;
                    let toY = other.owner.y;
                    this._tween.to(self.owner, { x: toX, y: toY }, 100, Laya.Ease.linearNone);
                    Laya.timer.once(80, this, this.completeOther, [other, self]);
                }
            } else {
                other.owner.getComponent(Laya.RigidBody).gravityScale = 5;
                other.owner.getComponent(Laya.RigidBody).linearDamping = 5;
                other.owner.getComponent(Laya.RigidBody).angularDampin = 2;
            }
        }

        completeSelf(other, self) {
            this._tween.clear();
            self.owner.visible = false;
            other.owner.visible = false;
            Laya.Pool.recover("fruit" + this.fruitId.toString(), other.owner);
            Laya.Pool.recover("fruit" + this.fruitId.toString(), self.owner);
            // console.log("新水果1",this.owner.x, this.owner.y)
            Laya.stage.event("CreateFruit", [this.fruitId + 1, self.owner.x, self.owner.y, "dynamic", 5, 0]);
            Laya.stage.event("CreateBombEffect", [this.fruitId + 1, self.owner.x, self.owner.y]);
        }

        completeOther(other, self) {
            this._tween.clear();
            other.owner.visible = false;
            self.owner.visible = false;
            Laya.Pool.recover("fruit" + this.fruitId.toString(), other.owner);
            Laya.Pool.recover("fruit" + this.fruitId.toString(), self.owner);
            // console.log("新水果2",this.owner.x, this.owner.y)
            Laya.stage.event("CreateFruit", [this.fruitId + 1, other.owner.x, other.owner.y, "dynamic", 5, 0]);
            Laya.stage.event("CreateBombEffect", [this.fruitId + 1, other.owner.x, other.owner.y]);
        }
    }

    /**
    *
    * @ author:wcysky
    * @ email:
    * @ data: 2021-06-23 16:50
    */
    class GameManager extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:targetLine, tips:"目标提示线", type:Node, default:null}*/
            this.targetLine = null;

            /** @prop {name:scoreSprit, tips:"成绩显示", type:Node, default:null}*/
            this.scoreSprit = null;

            /** @prop {name:voiceState, tips:"声音开关", type:Node, default:null}*/
            this.voiceState = null;

            this.gameOverPanel = null; //游戏结束面板
            this.curFruit = null;//当前还没有落下的水果
            this.isMouseDown = false;//鼠标是否按下
            this.bombEffectPre = null; //合成特效
            this.isGameOver = false; //游戏结束
            this.isOpenSound = true; //音效开关状态
            this.extraScore = 500;  //通关奖励金币
            this.score = 0;  //分数

            //掉落元素数组
            this.fruitPreArr = new Array();
            this.initFruitElement = [
                { url: "prefab/gold.json", type: Laya.Loader.PREFAB },
                { url: "prefab/coupon.json", type: Laya.Loader.PREFAB },
                { url: "prefab/redpacket.json", type: Laya.Loader.PREFAB },
                { url: "prefab/vipcard.json", type: Laya.Loader.PREFAB },
                { url: "prefab/blessbag.json", type: Laya.Loader.PREFAB },
                { url: "prefab/alipay.json", type: Laya.Loader.PREFAB },
                { url: "prefab/shopbag.json", type: Laya.Loader.PREFAB },
                { url: "prefab/giftbox.json", type: Laya.Loader.PREFAB },
                { url: "prefab/chestbox.json", type: Laya.Loader.PREFAB },
            ];
        }

        onAwake() {
            //指示线
            this.targetLine.visible = false;
            //初始化水果元素和特效
            this.loadFruitElement();
            //监听合成
            Laya.stage.on("CreateBombEffect", this, this.createBombEffect);
            // Laya.stage.on("CreateBombAni", this, this.createAnimation);

            //游戏结束事件
            this.gameOverEvent();
            //声音状态事件
            this.changeVoiceState();
            //生成水果事件
            this.createFruitEvent();
            //监听鼠标事件
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);

        }

        /**
         * 游戏声音
         */
        changeVoiceState() {
            this.voiceState.on(Laya.Event.CLICK, this, function () {
                this.isOpenSound = !this.isOpenSound;
                if (this.isOpenSound) {
                    this.voiceState.skin = "res/voice.png";
                } else {
                    this.voiceState.skin = "res/voice_close.png";
                }
            });
        }

        /**
         * 初始化水果元素和特效
         */
        loadFruitElement() {
            var prefabInfoArr = this.initFruitElement;
            //加载所有水果预制体
            Laya.loader.load(prefabInfoArr, Laya.Handler.create(this, function (result) {
                for (var i = 0; i < prefabInfoArr.length; i++) {
                    this.fruitPreArr[i] = Laya.loader.getRes(prefabInfoArr[i].url);
                }
                // console.log(this.owner.getChildByName("GameOverLine").y);
                this.curFruit = this.randomCreateFruit(this.owner.width / 2, 280);
            }));

            //加载爆炸特效预制体
            Laya.loader.load("prefab/bomb.json", Laya.Handler.create(this, function (pre) {
                this.bombEffectPre = pre;
            }), null, Laya.Loader.PREFAB);

            Laya.loader.load("res/atlas/effect.atlas", Laya.Handler.create(this, function (pre) {
                // console.log(pre)
                // this.bombEffectPre = pre;
            }), null, Laya.Loader.ATLAS);
        }

        /**
         * 游戏结束UI显示
         */
        gameOverEvent() {
            Laya.stage.on("GameOver", this, () => {
                //显示游戏结束界面
                this.isGameOver = true;
                Laya.Scene.open("GameOver.json", false, this.score, Laya.Handler.create(this, (result) => {
                    this.gameOverPanel = result;
                    // 再玩一次事件
                    this.playAgainEvent();
                    // 返回首页事件
                    this.goHomeEvent();
                    window.platform.updateScore(this.score);
                }));
            });
        }
        /**
         * 再玩一次监听事件
         */
        playAgainEvent() {
            this.gameOverPanel.getChildByName("gameOverBox").getChildByName("playAgainBtn").on(Laya.Event.CLICK, this, this.playAgain);
        }

        playAgain() {
            window.platform.getRest().then(
                (result) => {
                    if (result.success == true) {
                        this.gameOverPanel.visible = false;
                        //重置成绩
                        this.addScore(-this.score);
                        //回收场景中的水果
                        for (let i = 0; i < this.owner.numChildren; i++) {
                            var child = this.owner.getChildAt(i);
                            if (child.getComponent(Fruit) != null && child.visible) {
                                child.visible = false;
                                child.active = false;
                                Laya.Pool.recover("fruit" + child.getComponent(Fruit).fruitId.toString(), child);
                            }
                        }
                        this.isGameOver = false;
                        this.targetLine.visible = false;
                        this.curFruit = this.randomCreateFruit(this.owner.width / 2, 280);

                        //移出监听
                        this.removePlayAgainEvent();
                        this.removeGoHomeEvent();
                        this.gameOverPanel.close();
                    }
                }
            );


        }

        /**
         * 移出监听事件
         */
        removePlayAgainEvent() {
            this.gameOverPanel.getChildByName("gameOverBox").getChildByName("playAgainBtn").off(Laya.Event.CLICK, this, this.playAgain);
        }

        /**
         * 返回首页
         */
        goHomeEvent() {
            this.gameOverPanel.getChildByName("gameOverBox").getChildByName("closeBtn").on(Laya.Event.CLICK, this, this.goHome);
        }

        goHome() {
            //重置成绩
            this.addScore(-this.score);
            //回收场景中的水果
            for (let i = 0; i < this.owner.numChildren; i++) {
                var child = this.owner.getChildAt(i);
                if (child.getComponent(Fruit) != null && child.visible) {
                    child.visible = false;
                    child.active = false;
                    Laya.Pool.recover("fruit" + child.getComponent(Fruit).fruitId.toString(), child);
                }
            }
            // this.isGameOver = false;
            this.removePlayAgainEvent();
            //移出返回首页监听
            this.removeGoHomeEvent();
            this.gameOverPanel.close();
            //淘宝跳转首页
            if (Laya.Browser.onTBMiniGame) {
                window.platform.goHome();
            } else {
                console.log("goHome");
            }


        }
        //移出监听
        removeGoHomeEvent() {
            this.gameOverPanel.getChildByName("gameOverBox").getChildByName("closeBtn").off(Laya.Event.CLICK, this, this.goHome);
        }

        /**
         * 生成水果元素 监听事件
         */
        createFruitEvent() {
            Laya.stage.on("CreateFruit", this, function (fruitId, x, y, type, gravityScale, angularVelocity) {
                // console.log("createFruitEvent");
                var fruit = this.createFruit(fruitId, x, y, type, gravityScale, angularVelocity);
                fruit.getComponent(Fruit).isFall = true;
            });
        }


        /**
         * 鼠标按下(指示线和水果跟随)
         * @returns 
         */
        mouseDown(e) {
            if (this.isGameOver) {
                return;
            }
            //检测是否按下音效事件
            if (e.target.name == "voiceState") {
                return;
            }
            this.isMouseDown = true;
            if (this.curFruit != null) {
                this.curFruit.x = Laya.stage.mouseX;
                this.targetLine.x = Laya.stage.mouseX;
            }
        }
        /**
         * 鼠标释放
         * @returns 
         */
        mouseUp() {
            if (this.isGameOver) {
                return;
            }
            if (this.curFruit == null) {
                return
            } else {
                this.gameSound("res/sounds/spawn.mp3");
                this.playMoveFruitXAni(this.curFruit);
            }
        }

        playMoveFruitXAni(fruit) {
            if (this.curFruit != null && this.isMouseDown) {
                this.isMouseDown = false;
                this.fallDownFruit();
                this.curFruit = null;
                this.targetLine.visible = false;
                //800ms后生成新的掉落水果
                Laya.timer.once(800, this, () => {
                    if (this.isGameOver) {
                        return
                    }
                    this.curFruit = this.randomCreateFruit(this.owner.width / 2, 280);
                });
            }
        }
        //下落水果刚体属性
        fallDownFruit() {
            this.curFruit.getComponent(Laya.RigidBody).gravityScale = 1;
            this.curFruit.getComponent(Laya.RigidBody).type = "dynamic";
            this.curFruit.getComponent(Laya.RigidBody).linearVelocity = { x: 0, y: 30 };
            this.curFruit.getComponent(Laya.RigidBody).linearDamping = 0.05;
            this.curFruit.getComponent(Laya.RigidBody).angularDampin = 0.1;
            this.curFruit.getComponent(Laya.RigidBody).bullet = false;
            this.curFruit.getComponent(Laya.RigidBody).allowSleep = false;
            this.curFruit.getComponent(Laya.CircleCollider).friction = 1;
            this.curFruit.getComponent(Laya.CircleCollider).restitution = 0.1;
        }


        /**
         * 鼠标移动
         * @param {*} mouseEvent 
         * @returns 
         */
        mouseMove(mouseEvent) {
            window.platform.goHome();
            if (this.isGameOver) {
                return;
            }
            if (this.curFruit != null && this.isMouseDown) {
                this.curFruit.x = mouseEvent.stageX;
                this.targetLine.pos(this.curFruit.x, this.curFruit.y);
                if (this.curFruit.x < this.curFruit.width / 2) {
                    this.curFruit.x = this.curFruit.width / 2;
                }
                if (this.curFruit.x > this.owner.width - this.curFruit.width / 2) {
                    this.curFruit.x = this.owner.width - this.curFruit.width / 2;
                }
            }
        }


        /**
         * 生成水果
         * @param {*水果ID下标} fruitId 
         * @param {*X位置} x 
         * @param {*Y位置} y 
         */
        /**
         * 
         * @param {*水果ID下标} fruitId 
         * @param {*X位置} x 
         * @param {*Y位置} y 
         * @param {*刚体类型} type 
         * @param {*重力缩放系数} gravityScale 
         * @param {*角速度} angularVelocity 
         * @param {*水果类型 synthesisFruit 爆炸合成} fruitType 
         * @returns 
         */
        createFruit(fruitId, x, y, type = "static", gravityScale = 0, angularVelocity = 0) {

            //从对象池中取出一个当前ID所对应的水果 如果没有则创建  
            var fruit = Laya.Pool.getItemByCreateFun("fruit" + fruitId.toString(), function () {
                return this.fruitPreArr[fruitId].create();
            }, this);
            fruit.active = true;
            fruit.visible = true;
            this.owner.addChild(fruit);

            //元素刚体属性
            fruit.getComponent(Laya.RigidBody).gravityScale = gravityScale;
            fruit.getComponent(Laya.RigidBody).angularDampin = 0.1;
            fruit.getComponent(Laya.RigidBody).bullet = false;
            fruit.getComponent(Laya.RigidBody).allowSleep = false;
            fruit.getComponent(Laya.RigidBody).friction = 1;
            fruit.getComponent(Laya.RigidBody).angularVelocity = angularVelocity;
            fruit.getComponent(Laya.RigidBody).type = type;

            fruit.pos(x, y);
            fruit.getComponent(Fruit).Init(fruitId);
            return fruit;
        }

        /**
         * 生成水果销毁特效
         * @param {*} x 
         * @param {*} y 
         */
        createBombEffect(fruitId, x, y) {
            var effect = Laya.Pool.getItemByCreateFun("BombEffect", function () {
                return this.bombEffectPre.create();
            }, this);
            this.owner.addChild(effect);

            effect.visible = true;
            effect.active = true;
            effect.pos(x, y);
            effect.scaleX = (fruitId + 1) * 0.15;
            effect.scaleY = (fruitId + 1) * 0.15;
            effect.play(0, false);
            Laya.timer.once(500, this, function () {
                effect.visible = false;
                effect.active = false;
                // effect.clear()
                Laya.Pool.recover("BombEffect", effect);
            });
        }


        /**
         * 随机生成一个下标为0-4之间的水果(不包含4)
         * @param {*} x 
         * @param {*} y 
         * @returns 
         */
        randomCreateFruit(x, y) {
            // this.targetLine.visible = true;
            this.targetLine.pos(x, y);
            var randomValue = this.getRandomValue(0, 5);
            // console.log(this.fruitPreArr[randomValue].json.props.height);

            //设置结束线上方水果生成的高度位置(这个获取方式太变态了)
            var gameOverLineY = this.owner.getChildByName("GameOverLine").y;
            var fruitRadius = this.fruitPreArr[randomValue].json.props.height / 2;
            y = gameOverLineY - fruitRadius - 20;

            var fruit = this.createFruit(randomValue, x, y);
            fruit.getComponent(Fruit).isFall = false;
            return fruit;
        }

        /**
         * 获取min - max之间的随机值(左闭右开区间)
         * @param {*} min 
         * @param {*} max 
         * @returns 
         */
        getRandomValue(min, max) {
            var value = Math.random() * (max - min - 1);
            value = Math.round(value);
            return value + min;
        }
        /**
         * 当前得分
         * @param {*} value 
         */
        addScore(value) {
            this.score += value;
            this.scoreSprit.getChildByName("scoreText").text = this.score;

        }

        /**
         * 播放游戏音效
         * @param {*} url 
         */
        gameSound(url) {
            if (this.isOpenSound) {
                if (Laya.Browser.onTBMiniGame) {
                    window.platform.playSound(url);
                } else {
                    Laya.SoundManager.playSound(url, 1);
                }
            }
        }
    }

    /**
    *
    * @ author:wcysky
    * @ email:
    * @ data: 2021-06-24 10:26
    */
    class CheckWarning extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:warningText, tips:"提示文本", type:Node, default:null}*/
            this.warningText = null;
            this.reduce = false;
            this.add = false;
            //超出预警线1s后显示警示语
            this.warningDelayTime = 1;
        }

        onAwake() {
            // 测试
            // Laya.stage.on(Laya.Event.KEY_DOWN, this, function () {
            //     this.owner.y -= 5;
            // });
        }

        onUpdate() {
            // if (this.warningDelayTime <= 0) {
            //     this.warningText.visible = true;
            // } else {
            //     this.warningText.visible = false;
            // }

            // this.textAnimation();
            //超出整个屏幕的一半 显示提示语
            // for (let i = 0; i < this.owner.parent.numChildren; i++) {
            //     var child = this.owner.parent.getChildAt(i);
            //     if (child.visible && child.getComponent(Fruit) != null && child.getComponent(Fruit).isFall) {
            //         if (Math.abs(this.owner.y - child.y) < child.width / 2) {
            //             // console.log("warning");
            //             this.warningDelayTime -= Laya.timer.delta / 1000;
            //             return;
            //         }
            //     }
            // }
            // console.log(" no warning");
            // this.warningDelayTime = 1;

        }
        /**
         * 提示语渐变
         */
        textAnimation() {
            //提示语渐变
            if (this.warningText.alpha >= 1) {
                this.reduce = true;
                this.add = false;
            }
            if (this.warningText.alpha <= 0) {
                this.reduce = false;
                this.add = true;
            }
            if (this.reduce) {
                this.warningText.alpha -= 0.05;
            }
            if (this.add) {
                this.warningText.alpha += 0.05;
            }
        }
    }

    /**
    *
    * @ author:wcysky
    * @ email:
    * @ data: 2021-06-24 11:45
    */
    class CheckGameOver extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
            this.xx = null;
            //超出警戒线1s后游戏结束
            this.warningDelayTime = 1;
        }

        onUpdate() {

            var isGameOver = this.owner.parent.getComponent(GameManager).isGameOver;
            if (isGameOver) {
                return
            }

            if (this.warningDelayTime <= 0) {
                this.warningDelayTime = 1;
                Laya.stage.event("GameOver");
                return;
            }

            for (let i = 0; i < this.owner.parent.numChildren; i++) {
                var child = this.owner.parent.getChildAt(i);
                if (child.visible && child.getComponent(Fruit) != null && child.getComponent(Fruit).isFall) {
                    if (Math.abs(this.owner.y - child.y) < child.width / 2) {
                        this.warningDelayTime -= Laya.timer.delta / 1000;
                        return;
                    }
                }
            }
            // console.log("no overing");
            this.warningDelayTime = 1;
        }
    }

    /**
    *
    * @ author:wcysky
    * @ 自适应
    * @ data: 2021-06-24 15:18
    */
    class FixScreen extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:collider_Down, tips:"底部", type:Node, default:null}*/
            this.collider_Down = null;

            /** @prop {name:collider_Right, tips:"右侧边", type:Node, default:null}*/
            this.collider_Right = null;

            /** @prop {name:collider_Left, tips:"左侧边", type:Node, default:null}*/
            this.collider_Left = null;

            /** @prop {name:bg, tips:"背景", type:Node, default:null}*/
            this.bg = null;

        }

        onAwake() {
            this.collider_Down.y = Laya.stage.height - 100;
            this.collider_Down.getComponent(Laya.BoxCollider).width = Laya.stage.width;

            this.collider_Right.getComponent(Laya.BoxCollider).height = Laya.stage.height;
            this.collider_Left.getComponent(Laya.BoxCollider).height = Laya.stage.height;

            this.bg.height = Laya.stage.height;
            // this.gameOverPanel.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("scripts/GameOverView.js",GameOverView);
    		reg("scripts/GameManager.js",GameManager);
    		reg("scripts/CheckWarning.js",CheckWarning);
    		reg("scripts/CheckGameOver.js",CheckGameOver);
    		reg("scripts/FixScreen.js",FixScreen);
    		reg("scripts/Fruit.js",Fruit);
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1334;
    GameConfig.scaleMode ="fixedwidth";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Main.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;

    GameConfig.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		Laya.stage.bgColor = "#FFFFFF";
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		// Laya.URL.basePath = "https://draw-mb.oss-cn-zhangjiakou.aliyuncs.com/laya/compose/v1.0.0/"
    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError(true);

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
