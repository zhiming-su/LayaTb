/*
 * @Date: 2021-07-21 14:50:34
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-22 16:04:47
 * @description: 
 */
import GameManager from "./GameManager";
export default class Fruit extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
        this.xx = null;
        this.fruitId = -1;
        //是否已经落下来了
        this.isFall = false;
        this.gameManager = null;

        this._tween = null
    }

    onAwake() {
    }

    Init(id) {
        this.fruitId = id;
        // console.log("初始化ID：", this.fruitId)
        this.gameManager = this.owner.parent.getComponent(GameManager);
        this._tween = new Laya.Tween()
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
            this.gameManager.isMaxElement = true;
            Laya.stage.event("GameOver");
            return
        }

        if (other.owner.getComponent(Fruit) != null
            && other.owner.getComponent(Fruit).fruitId == this.fruitId && self.owner.active && other.owner.active) {
            //增加成绩分数(根据水果的ID来计算分数)
            this.gameManager.addScore(this.gameManager.elementScore[this.fruitId + 1]);
            // this.gameManager.addScore((this.fruitId + 1) * 2);
            // var ownerAngularVelocity = this.owner.getComponent(Laya.RigidBody).angularVelocity;
            // var otherAngularVelocity = other.owner.getComponent(Laya.RigidBody).angularVelocity;
            self.owner.active = false;
            other.owner.active = false;
            //生成一个新的水果，当前ID+1
            if (self.owner.y >= other.owner.y) {

                let toX = self.owner.x
                let toY = self.owner.y
                this._tween.to(other.owner, { x: toX, y: toY }, 100, Laya.Ease.linearNone)
                Laya.timer.once(80, this, this.completeSelf, [other, self])
            } else {
                let toX = other.owner.x
                let toY = other.owner.y
                this._tween.to(self.owner, { x: toX, y: toY }, 100, Laya.Ease.linearNone)
                Laya.timer.once(80, this, this.completeOther, [other, self])
            }
        } else {
            other.owner.getComponent(Laya.RigidBody).gravityScale = 5;
            // other.owner.getComponent(Laya.RigidBody).linearDamping = 5;
            // other.owner.getComponent(Laya.RigidBody).angularDampin = 2;
        }
    }

    completeSelf(other, self) {
        this._tween.clear()
        self.owner.visible = false;
        other.owner.visible = false;
        Laya.Pool.recover("fruit" + this.fruitId.toString(), other.owner);
        Laya.Pool.recover("fruit" + this.fruitId.toString(), self.owner);
        // console.log("新水果1",this.owner.x, this.owner.y)
        Laya.stage.event("CreateFruit", [this.fruitId + 1, self.owner.x, self.owner.y, "dynamic", 5, 0]);
        Laya.stage.event("CreateBombEffect", [this.fruitId + 1, self.owner.x, self.owner.y]);
    }

    completeOther(other, self) {
        this._tween.clear()
        other.owner.visible = false;
        self.owner.visible = false;
        Laya.Pool.recover("fruit" + this.fruitId.toString(), other.owner);
        Laya.Pool.recover("fruit" + this.fruitId.toString(), self.owner);
        // console.log("新水果2",this.owner.x, this.owner.y)
        Laya.stage.event("CreateFruit", [this.fruitId + 1, other.owner.x, other.owner.y, "dynamic", 5, 0]);
        Laya.stage.event("CreateBombEffect", [this.fruitId + 1, other.owner.x, other.owner.y]);
    }
}