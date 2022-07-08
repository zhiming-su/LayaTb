/**
*
* @ author:wcysky
* @ 自适应
* @ data: 2021-06-24 15:18
*/
export default class FixScreen extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:collider_Down, tips:"底部", type:Node, default:null}*/
        this.collider_Down = null;

        /** @prop {name:collider_Right, tips:"右侧边", type:Node, default:null}*/
        this.collider_Right = null;

        /** @prop {name:collider_Left, tips:"左侧边", type:Node, default:null}*/
        this.collider_Left = null;

        /** @prop {name:bg, tips:"背景", type:Node, default:null}*/
        this.bg = null;

        /** @prop {name:disableMouse, tips:"禁用鼠标事件", type:Node, default:null}*/
        this.disableMouse = null;

    }

    onAwake() {
        this.collider_Down.y = Laya.stage.height - 80;
        this.collider_Down.getComponent(Laya.BoxCollider).width = Laya.stage.width;

        this.collider_Right.getComponent(Laya.BoxCollider).height = Laya.stage.height;
        this.collider_Left.getComponent(Laya.BoxCollider).height = Laya.stage.height;

        this.bg.height = Laya.stage.height;

        // this.gameOverPanel.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        if (this.disableMouse != null) {
            this.disableMouse.y = Laya.stage.height - 120;
            this.disableMouse.on(Laya.Event.MOUSE_DOWN, this, this.disableMouseEvent);
        }
    }

    onDisable() {
        if (this.disableMouse != null) {
            this.disableMouse.off(Laya.Event.MOUSE_DOWN, this, this.disableMouseEvent);
        }
    }

    disableMouseEvent(e) {
        e.stopPropagation();
    }
}