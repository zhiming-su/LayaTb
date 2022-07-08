(function () {
    'use strict';

    class sc02 extends Laya.Script {
        constructor() {
            super();
            this.intType = 1000;
            this.numType = 1000;
            this.strType = "hello laya";
            this.boolType = true;
            sc02.instance = this;
        }
        onEnable() {
        }
        onDisable() {
        }
        hello() {
            console.log("hello sc02");
        }
    }

    class sc01 extends Laya.Script {
        constructor() {
            super();
            this.intType = 1000;
            this.numType = 1000;
            this.strType = "hello laya";
            this.boolType = true;
        }
        onEnable() {
        }
        onDisable() {
        }
        onStart() {
            console.log(this.intType);
            console.log(this.owner);
            var owner = this.owner;
            console.log(owner.visible);
            console.log(owner.x);
            sc02.instance.hello();
            console.log(this.owner.parent.numChildren);
            var btn = this.owner.parent.getChildByName("button01");
            console.log(btn.label);
            console.log(btn.scene);
        }
    }

    class sc03 extends Laya.Script {
        constructor() {
            super();
            this.intType = 1000;
            this.numType = 1000;
            this.strType = "hello laya";
            this.boolType = true;
        }
        onEnable() {
        }
        onDisable() {
        }
        onMouseDown(e) {
            console.log(e);
            e.stopPropagation();
        }
        onClick() {
            let xxSprite = this.owner.parent.getChildByName("xxSprite");
            Laya.Tween.to(xxSprite, { y: 200 }, 3000);
        }
        onAwake() {
            var btn = this.owner;
            this.owner.numChildren;
            var had = Laya.Handler.create("hello world!1111", function (x, y, a) {
                console.log(this);
                console.log(x, y, a);
            }, null, false);
        }
        clickEvent() {
            console.log("ok click!");
            var tex = new Laya.Text;
            tex.text = "hello world!";
            tex.color = "#d9110e";
            tex.fontSize = 26;
            this.owner.parent.addChild(tex);
        }
    }

    class TweenSc extends Laya.Script {
        constructor() { super(); }
        onEnable() {
        }
        onDisable() {
        }
        onAwake() {
        }
        onStart() {
            let progressBar = Laya.Handler.create(this, function (num) {
                console.log(num);
                this.progressB.value = num;
            });
            let myTl = Laya.TimeLine.to(this.xxSprite, { y: 600 }, 3000);
            this.myButton.alpha = 0;
            myTl.to(this.myButton, { y: 300, alpha: 1 }, 3000, Laya.Ease.bounceInOut);
            myTl.play();
        }
    }

    class xx extends Laya.Script {
        constructor() {
            super();
            this.intType = 1000;
            this.numType = 1000;
            this.strType = "hello laya";
            this.boolType = true;
        }
        onEnable() {
        }
        onDisable() {
        }
        onTriggerEnter(other, self, contact) {
            console.log("开始碰撞了！");
            console.log(other);
            console.log(self);
        }
        onTriggerStay(other, self, contact) {
            console.log("开始碰撞中！");
        }
        onTriggerExit(other, self, contact) {
            console.log("开始碰撞结束！");
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/sc01.ts", sc01);
            reg("script/sc02.ts", sc02);
            reg("script/sc03.ts", sc03);
            reg("script/TweenSc.ts", TweenSc);
            reg("script/xx.ts", xx);
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "gameScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = true;
    GameConfig.stat = true;
    GameConfig.physicsDebug = true;
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
