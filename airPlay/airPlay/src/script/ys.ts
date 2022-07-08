//import GameUI from "./GameUI";
import gameControl from "./gameControl";
/**
 * 掉落盒子脚本，实现盒子碰撞及回收流程
 */
export default class ys extends Laya.Script {
    /**盒子等级 */
    level: number = 1;
    /**等级文本对象引用 */
    private _text: Laya.Text;
    /**刚体对象引用 */
    private _rig: Laya.RigidBody

    private num = 0;;

    fs: Laya.Sprite;

    private fxNum = 0;

    constructor() { super(); }
    onEnable(): void {
        /**获得组件引用，避免每次获取组件带来不必要的查询开销 */
        this._rig = this.owner.getComponent(Laya.RigidBody);
        this.fs = this.owner.parent.parent.getChildByName("fs") as Laya.Sprite;

        //console.log(this.owner.parent)
        //this.level = Math.round(Math.random() * 5) + 1;
        //this._text = this.owner.getChildByName("levelTxt") as Laya.Text;
        //this._text.text = this.level + "";
        this.num = 2;
    }

    onUpdate(): void {
        //让持续盒子旋转
        (this.owner as Laya.Sprite).rotation++;
    }

    onTriggerEnter(other: any, self: any, contact: any): void {
        var owner: Laya.Sprite = this.owner as Laya.Sprite;
        //console.log(other)
        let sp = this.owner as Laya.Sprite;
        if (other.label === "zd") {


            if (this.num > 1) {
                this.num--;
                let tx =
                    //sp.texture("")
                    sp.loadImage("./res/ys.png")

                //sp.Te
                //let xs: number = sp.get_scaleX();
                //sp.set_scaleX(xs * 0.5)
                //sp.set_scaleY(xs * 0.5)
                owner.getComponent(Laya.RigidBody).setVelocity({ x: 0, y: -10 });
            } else {
                let effect: Laya.Animation = Laya.Pool.getItemByCreateFun("effect", this.createEffect, this);
                effect.pos(owner.x, owner.y);
                owner.parent.addChild(effect);
                effect.play(0, true);
                owner.removeSelf();
                console.log(this.fs)
                let fs_lable = this.fs.getChildByName("fs_lable") as Laya.Label;
                gameControl.instance.fsNum += 1;
                fs_lable.changeText(gameControl.instance.fsNum + "")
            }
            //碰撞到子弹后，增加积分，播放声音特效
            /* if (this.level > 1) {
                this.level--;
                //this._text.changeText(this.level + "");
                owner.getComponent(Laya.RigidBody).setVelocity({ x: 0, y: -10 });
                //Laya.SoundManager.playSound("sound/hit.wav");
            } else {
                if (owner.parent) {
                    //let effect: Laya.Animation = Laya.Pool.getItemByCreateFun("effect", this.createEffect, this);
                    //effect.pos(owner.x, owner.y);
                    //owner.parent.addChild(effect);
                    //effect.play(0, true);
                    owner.removeSelf();
                   // Laya.SoundManager.playSound("sound/destroy.wav");
                }
            } */
            //GameUI.instance.addScore(1);
        } else if (other.label === "ground") {
            //只要有一个盒子碰到地板，则停止游戏
            owner.removeSelf();
            gameControl.instance.stopGame();
        }
    }

    /**使用对象池创建爆炸动画 */
    createEffect(): Laya.Animation {
        let ani: Laya.Animation = new Laya.Animation();
        ani.loadAnimation("bzdx.ani");
        ani.on(Laya.Event.COMPLETE, null, recover);
        function recover(): void {
            ani.removeSelf();
            Laya.Pool.recover("effect", ani);
        }
        return ani;
    }

    onDisable(): void {
        //盒子被移除时，回收盒子到对象池，方便下次复用，减少对象创建开销。
        let sp = this.owner as Laya.Sprite;
        sp.loadImage("./res/ys1.png")
        //sp.set_scaleX(1)
        //sp.set_scaleY(1)
        Laya.Pool.recover("dropBox", this.owner);
    }
}