/**
*
* @ author:wcysky
* @ email:xxxxxx@gmail.com
* @ data: 2021-09-27 20:07
*/
export default class Guide extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:nextStepBtn, tips:"下一步", type:Node, default:null}*/
        this.nextStepBtn = null;

        /** @prop {name:startGameBtn, tips:"开始游戏", type:Node, default:null}*/
        this.startGameBtn = null;

        /** @prop {name:skipBtn, tips:"跳过", type:Node, default:null}*/
        this.skipBtn = null;

        /** @prop {name:stepBg, tips:"引导图片", type:Node, default:null}*/
        this.stepBg = null;

        /** @prop {name:dotStep, tips:"轮播点", type:Node, default:null}*/
        this.dotStep = null;

        this.initStep = 1;

    }

    onAwake() {
        this.skipBtn.on(Laya.Event.CLICK, this, this.startGame);
        this.nextStepBtn.on(Laya.Event.CLICK, this, this.nextStep);
        this.startGameBtn.on(Laya.Event.CLICK, this, this.startGame);
    }

    startGame() {
        Laya.Scene.open("Main.scene");
    }

    nextStep() {
        this.initStep++;
        if (this.initStep == 3) {
            this.nextStepBtn.visible = false;
            this.startGameBtn.visible = true;
        }
        this.dotStep.skin = "res/dot_" + this.initStep + ".png";
        this.stepBg.skin = "res/step_" + this.initStep + ".png";
    }




}