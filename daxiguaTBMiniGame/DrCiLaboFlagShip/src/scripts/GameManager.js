import Fruit from "./Fruit";
import GlobalGameData from "./GlobalGameData";
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

        this.gameOverPanel = null; //游戏结束面板
        this.curFruit = null;//当前还没有落下的水果
        this.isMouseDown = false;//鼠标是否按下
        this.bombEffectPre = null; //合成特效
        this.isGameOver = false; //游戏结束
        this.score = 0;  //分数
        this.isMaxElement = false;

        this.bombData = [];
        this.destroyFruitArray = []

        //掉落元素数组
        this.fruitPreArr = new Array();
        this.initFruitElement = [
            { url: "prefab/element_01.json", type: Laya.Loader.PREFAB },
            { url: "prefab/element_02.json", type: Laya.Loader.PREFAB },
            { url: "prefab/element_03.json", type: Laya.Loader.PREFAB },
            { url: "prefab/element_04.json", type: Laya.Loader.PREFAB },
            { url: "prefab/element_05.json", type: Laya.Loader.PREFAB },
            { url: "prefab/element_06.json", type: Laya.Loader.PREFAB },
            { url: "prefab/element_07.json", type: Laya.Loader.PREFAB },
            { url: "prefab/element_08.json", type: Laya.Loader.PREFAB },
            { url: "prefab/element_09.json", type: Laya.Loader.PREFAB },
        ];

        this.elementScore = [0, 5, 10, 20, 30, 40, 50, 60, 100];

        this.globalData = null;

        this.effectIndex = 0
    }

    onAwake() {
        this.globalData = new GlobalGameData();
        this.scoreSprit.getChildByName("scoreName").text = this.globalData.scoreName;
        //指示线
        this.targetLine.visible = false;
        //初始化水果元素和特效
        this.loadFruitElement();
        //监听合成
        Laya.stage.on("CreateBombEffect", this, this.createBombEffect);
        // Laya.stage.on("CreateBombAni", this, this.createAnimation);

        //游戏结束事件
        this.gameOverEvent();
        //生成水果事件
        this.createFruitEvent();
        //监听鼠标事件
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);

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
            this.getAllFruit()
            this.playBombAni()
        });
    }


    /**
     * 获取所有水果
     */
    getAllFruit() {
        this.destroyFruitArray = []
        this.effectArray = []
        for (let i = 0; i < this.owner.numChildren; i++) {
            var child = this.owner.getChildAt(i);
            if (child.getComponent(Fruit) != null && child.visible) {
                this.destroyFruitArray.push(child)
                //创建特效
                var effect = Laya.Pool.getItemByCreateFun("BombEffect", function () {
                    return this.bombEffectPre.create();
                }, this);
                this.effectIndex += 1
                effect.name = this.effectIndex.toString()

                effect.visible = false;
                effect.active = false;
                effect.pos(child.x, child.y)
                effect.on(Laya.Event.COMPLETE, this, () => {
                    this.onEffectPlayComplete(effect)
                })
                this.owner.addChild(effect);
                this.effectArray.push(effect);
            }
        }

    }


    /**
     * 播放爆炸动画
     */
    playBombAni() {
        // console.log("特效数量：",this.destroyFruitArray.length)
        if (this.destroyFruitArray.length > 0) {
            let effect = this.effectArray.pop();
            effect.visible = true;
            effect.active = true;
            effect.play(7, false);
        } else {
            this.openGameOverView();
        }
    }

    onEffectPlayComplete(effect) {
        if (this.destroyFruitArray.length == 0) {
            return
        }
        // console.log("播放完成");
        effect.off(Laya.Event.COMPLETE, this, this.onEffectPlayComplete)
        let fruit = this.destroyFruitArray.pop()
        effect.visible = false;
        effect.active = false;
        effect.removeSelf()
        if (fruit) {
            fruit.visible = false;
            fruit.active = false;
            fruit.removeSelf()
            Laya.Pool.recover("fruit" + fruit.getComponent(Fruit).fruitId.toString(), fruit);
        }
        effect.name = "0"
        Laya.Pool.recover("BombEffect", effect);
        this.playBombAni()
    }

    /**
     * 打开结算面板
     */
    openGameOverView() {
        let gameOverViewData = {};
        gameOverViewData.scoreName = this.globalData.scoreName;
        gameOverViewData.maxLevelPrizeName = this.globalData.maxLevelPrizeName;
        gameOverViewData.score = this.score;
        gameOverViewData.isMaxElement = this.isMaxElement;
        Laya.Scene.open("GameOver.json", false, gameOverViewData, Laya.Handler.create(this, (result) => {
            this.gameOverPanel = result;
            // 再玩一次事件
            this.playAgainEvent();
            // 返回首页事件
            this.goHomeEvent();
            window.platform.updateScore(this.score);
        }));
    }

    /**
     * 再玩一次监听事件
     */
    playAgainEvent() {
        // console.log("再玩一次")
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
        // this.curFruit.getComponent(Laya.RigidBody).linearDamping = 0.05;
        // this.curFruit.getComponent(Laya.RigidBody).angularDampin = 0.1;
        this.curFruit.getComponent(Laya.RigidBody).bullet = false;
        this.curFruit.getComponent(Laya.RigidBody).allowSleep = false;
        this.curFruit.getComponent(Laya.CircleCollider).friction = 1;
        this.curFruit.getComponent(Laya.CircleCollider).restitution = 0.2;
    }


    /**
     * 鼠标移动
     * @param {*} mouseEvent 
     * @returns 
     */
    mouseMove(mouseEvent) {
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
            this.effectIndex += 1
            this.bombEffectPre.name = this.effectIndex.toString()
            // console.log("特效1：", this.bombEffectPre.name);
            return this.bombEffectPre.create();
        }, this);
        this.owner.addChild(effect);

        effect.visible = true;
        effect.active = true;
        effect.pos(x, y);
        // effect.scaleX = (fruitId + 1) * 0.3;
        // effect.scaleY = (fruitId + 1) * 0.3;
        effect.play(0, false)
        Laya.timer.once(500, this, function () {
            effect.visible = false;
            effect.active = false;
            // effect.clear()
            effect.name = "0"
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
        if (this.isGameOver) {
            return;
        }

        this.targetLine.pos(x, y);
        var randomValue = this.getRandomValue(0, 5);
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

}