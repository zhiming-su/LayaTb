import Fruit from "./Fruit";
/**
*
* @ author:wcysky
* @ email:
* @ data: 2021-06-23 16:50
*/
export default class GameManager extends Laya.Script {

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
        this.gameOverPanel.getChildByName("gameOverBox").getChildByName("playAgainBtn").off(Laya.Event.CLICK, this, this.playAgain)
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
            console.log("goHome")
        }


    }
    //移出监听
    removeGoHomeEvent() {
        this.gameOverPanel.getChildByName("gameOverBox").getChildByName("closeBtn").off(Laya.Event.CLICK, this, this.goHome)
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
            this.playMoveFruitXAni(this.curFruit)
        }
    }

    playMoveFruitXAni(fruit) {
        if (this.curFruit != null && this.isMouseDown) {
            this.isMouseDown = false;
            this.fallDownFruit()
            this.curFruit = null;
            this.targetLine.visible = false;
            //800ms后生成新的掉落水果
            Laya.timer.once(800, this, () => {
                if (this.isGameOver) {
                    return
                }
                this.curFruit = this.randomCreateFruit(this.owner.width / 2, 280)
            })
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
                this.curFruit.x = this.curFruit.width / 2
            }
            if (this.curFruit.x > this.owner.width - this.curFruit.width / 2) {
                this.curFruit.x = this.owner.width - this.curFruit.width / 2
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
        effect.play(0, false)
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