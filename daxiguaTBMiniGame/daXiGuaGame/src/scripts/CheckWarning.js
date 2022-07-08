import Fruit from "./Fruit";

/**
*
* @ author:wcysky
* @ email:
* @ data: 2021-06-24 10:26
*/
export default class CheckWarning extends Laya.Script {

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