
import CallBackRegisiter from "./CallBackRegisiter";
import AABBGameObject from "./AABBShape";
import CollsionManagerThreeD from "./CollsionManagerThreeD";
import { EventManager } from "../../core/manager/EventManager";
import { EventType } from "../../core/event/EventType";



export class CollisionMask {
    public static Character = 1;
    public static Obstacle = 2;
    public static Fish = 3;
    public static Award = 4;
    public static Gold = 5;
    public static PaoDao = 6;
    public static HuaPo = 7;
    public static JiaSu = 8;
    public static End = 9;
}

export default class ShapeThreeD extends Laya.Script3D {

    constructor() { super(); }

    collisionEnter: CallBackRegisiter[] = [];
    collisionExit: CallBackRegisiter[] = [];
    collisionRayHit: CallBackRegisiter[] = [];

    public mask = 0;

    public binViewerGob: Laya.Sprite3D;


    public detectmap: { [key: number]: boolean; } = {};

    //~0000000000000000000
    //11111111111111111111
    public collisionMask = ~0;//0取反则全部是打开
    public transform: Laya.Transform3D;
    gameObject: Laya.Sprite3D;

    public moveSpeed: Laya.Vector3 = new Laya.Vector3(0, 0, 0);

    public SetMask(p: number) {
        this.mask = p;
    }

    onAwake() {
        this.gameObject = this.owner as Laya.Sprite3D;
        this.transform = this.gameObject.transform;
    }

    onStart() {

        EventManager.instance.event(EventType.ShapeThreeDEnterWorld, this);
    }

    onDestroy() {
        // if (EventCenter.shapeThreeDLeaveWorld != null)
        //      EventCenter.shapeThreeDLeaveWorld.Invoke(this);

        EventManager.instance.event(EventType.ShapeThreeDEnterWorld, this);
    }


    /**方法签名 为aabbshape */
    public RegisetCollsionEnter(callder, func: Function) {

        let pCallBackRegisiter = new CallBackRegisiter();
        pCallBackRegisiter.regisiter = callder;
        pCallBackRegisiter.enterCallbackFunc = func;
        this.collisionEnter.push(pCallBackRegisiter);
    }

    public RegisetCollsionExit(callder, func: Function) {

        let pCallBackRegisiter = new CallBackRegisiter();
        pCallBackRegisiter.regisiter = callder;
        pCallBackRegisiter.enterCallbackFunc = func;
        this.collisionExit.push(pCallBackRegisiter);
    }



    public TriggerEnterEvent(source: ShapeThreeD, target: ShapeThreeD) {
        for (var iterator of this.collisionEnter) {
            var registerObj = iterator.regisiter
            var func: Function = iterator.enterCallbackFunc
            func.apply(registerObj, [source, target])
        }
    }

    public TriggerExitEvent(source: ShapeThreeD, target: ShapeThreeD) {
        for (var iterator of this.collisionExit) {
            var registerObj = iterator.regisiter
            var func: Function = iterator.enterCallbackFunc
            func.apply(registerObj, [source, target])
        }
    }

    public RegisetRayHitEnter(callBackRegisiter: CallBackRegisiter) {
        //var obj: CallBackRegisiter = new CallBackRegisiter();

        this.collisionRayHit.push(callBackRegisiter);

        // this.collsionExit.push(callBackRegisiter);
    }

    public OnShapeRayHit(obb: ShapeThreeD) {
        for (var iterator of this.collisionRayHit) {
            var registerObj = iterator.regisiter
            var func: Function = iterator.enterCallbackFunc;
            func.apply(registerObj, [obb])
        }
    }

    public ActiveDetec() {
        CollsionManagerThreeD.instantce.SetDetectObj(this);
    }
}