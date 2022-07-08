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
        //超出警戒线1s后游戏结束
        this.warningDelayTime = 1;
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
                    this.warningDelayTime -= Laya.timer.delta / 1000;
                    return;
                }
            }
        }
        // console.log("no overing");
        this.warningDelayTime = 1;
    }
}