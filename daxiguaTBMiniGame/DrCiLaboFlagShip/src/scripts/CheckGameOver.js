import GameManager from "./GameManager";
import Fruit from "./Fruit";

/**
*
* @ author:wcysky
* @ email:
* @ data: 2021-06-24 11:45
*/
export default class CheckGameOver extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
        this.xx = null;
        /** @prop {name:GameOverLine, tips:"游戏结束线", type:Node, default:null}*/
        this.GameOverLine = null;

        //超出警戒线1s后游戏结束
        this.warningDelayTime = 1;
    }

    onAwake() {
        // Laya.stage.height / 2
        // console.log(Laya.stage.height / 2);
        this.GameOverLine.y = (Laya.stage.height / 2) - 300;
    }

    onUpdate() {

        var isGameOver = this.owner.parent.getComponent(GameManager).isGameOver;
        if (isGameOver) {
            return
        }

        if (this.warningDelayTime <= 0) {
            this.warningDelayTime = 1
            Laya.stage.event("GameOver");
            return;
        }

        for (let i = 0; i < this.owner.parent.numChildren; i++) {
            var child = this.owner.parent.getChildAt(i);

            if (child.visible && child.getComponent(Fruit) != null && child.getComponent(Fruit).isFall) {

                if (Math.abs(this.owner.y - child.y) < child.width / 2) {
                    // console.log("this.owner.y=", this.owner.y);
                    // console.log("child.y=", child.y);
                    // console.log("child.visible=", child.visible);
                    // console.log("child.getComponent=", child.getComponent(Fruit));
                    // console.log("child.getComponent(Fruit).isFall=", child.getComponent(Fruit).isFall);
                    this.warningDelayTime -= Laya.timer.delta / 1000;
                    return;
                }
            }
        }
        // console.log("no overing");
        this.warningDelayTime = 1;
    }
}