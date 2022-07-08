(function () {
    'use strict';

    class gameControl extends Laya.Script {
        constructor() {
            super();
            this._time = 0;
            this.startFlag = false;
            this.zdFlage = false;
            this.startGame = false;
            this.createBoxInterval = 1000;
            this.fsNum = 0;
            gameControl.instance = this;
            Laya.MouseManager.multiTouchEnabled = false;
        }
        onEnable() {
            this._time = Date.now();
            this._gameBox = this.owner.getChildByName("gameBox");
        }
        onDisable() {
        }
        stopGame() {
            this.startGame = false;
            let sp = this.owner.getChildByName("end");
            sp.visible = true;
        }
        createBox() {
            let box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
            box.pos(Math.random() * (Laya.stage.width - 100), -100);
            this._gameBox.addChild(box);
        }
        onStart() {
            this.startImg.on(Laya.Event.CLICK, this, function () {
                window.platform.goHome();
                this.startGame = true;
                this.startImg.visible = false;
                this.player.visible = true;
                this.fs.visible = true;
                this.player.pos(Laya.stage.width / 2, Laya.stage.height - this.player.height);
                let now = Date.now();
                if (now - this._time > this.createBoxInterval && this._started) {
                    this._time = now;
                    this.createBox();
                }
            });
            this.player.on(Laya.Event.MOUSE_MOVE, this, this.onClickPlayer);
            Laya.timer.loop(300, this, function () {
                if (this.startGame) {
                    let flyer = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet);
                    this.zd = flyer;
                    if (this.startFlag && this.zdFlage) {
                        flyer.pos(Laya.stage.mouseX - flyer.width / 2, Laya.stage.mouseY);
                    }
                    else {
                        flyer.pos(this.player.x - flyer.width / 2, this.player.y - flyer.height);
                    }
                    this._gameBox.addChild(flyer);
                    this.player.on(Laya.Event.MOUSE_UP, this, function () {
                        this.zdFlage = false;
                    });
                }
            });
        }
        onUpdate() {
            let now = Date.now();
            if (now - this._time > this.createBoxInterval && this.startGame) {
                this._time = now;
                this.createBox();
            }
        }
        onClickPlayer() {
            if (this.startFlag) {
                this.zdFlage = true;
                this.player.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            }
        }
        onStageMouseMove() {
            this.startFlag = true;
        }
        onStageClick(e) {
        }
    }

    class ys extends Laya.Script {
        constructor() {
            super();
            this.level = 1;
            this.num = 0;
            this.fxNum = 0;
        }
        ;
        onEnable() {
            this._rig = this.owner.getComponent(Laya.RigidBody);
            this.fs = this.owner.parent.parent.getChildByName("fs");
            this.num = 2;
        }
        onUpdate() {
            this.owner.rotation++;
        }
        onTriggerEnter(other, self, contact) {
            var owner = this.owner;
            let sp = this.owner;
            if (other.label === "zd") {
                if (this.num > 1) {
                    this.num--;
                    let tx = sp.loadImage("./res/ys.png");
                    owner.getComponent(Laya.RigidBody).setVelocity({ x: 0, y: -10 });
                }
                else {
                    let effect = Laya.Pool.getItemByCreateFun("effect", this.createEffect, this);
                    effect.pos(owner.x, owner.y);
                    owner.parent.addChild(effect);
                    effect.play(0, true);
                    owner.removeSelf();
                    console.log(this.fs);
                    let fs_lable = this.fs.getChildByName("fs_lable");
                    gameControl.instance.fsNum += 1;
                    fs_lable.changeText(gameControl.instance.fsNum + "");
                }
            }
            else if (other.label === "ground") {
                owner.removeSelf();
                gameControl.instance.stopGame();
            }
        }
        createEffect() {
            let ani = new Laya.Animation();
            ani.loadAnimation("bzdx.ani");
            ani.on(Laya.Event.COMPLETE, null, recover);
            function recover() {
                ani.removeSelf();
                Laya.Pool.recover("effect", ani);
            }
            return ani;
        }
        onDisable() {
            let sp = this.owner;
            sp.loadImage("./res/ys1.png");
            Laya.Pool.recover("dropBox", this.owner);
        }
    }

    class Bullet extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            var rig = this.owner.getComponent(Laya.RigidBody);
            rig.setVelocity({ x: 0, y: -10 });
        }
        onTriggerEnter(other, self, contact) {
            this.owner.removeSelf();
        }
        onUpdate() {
            if (this.owner.y < -10) {
                this.owner.removeSelf();
            }
        }
        onDisable() {
            Laya.Pool.recover("bullet", this.owner);
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/gameControl.ts", gameControl);
            reg("script/ys.ts", ys);
            reg("script/zd.ts", Bullet);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "main.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
