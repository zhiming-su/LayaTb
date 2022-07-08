import ShapeThreeD from "./ShapeThreeD";
import PathLineDrawer from "../JTools/PathLineDrawer";
import GameDesgin from "../Game/GameDesgin";
import Vector3Ext from "../Core/Vector3Ext";
import { Obstacle } from "../../game/gameobject/ObstacleSpawn";

export default class AABBShape extends ShapeThreeD {


    constructor() { super(); }

    line: PathLineDrawer;
    drawAABBLine = false;

    objdata:Obstacle;

    onStart() {
        super.onStart();
    }


    public tag;

    onUpdate() {

        this.UpdateShape(this.transform);



        if (this.line != null) {

            this.line.clear();
            var list = this.FacePonintsA();
            this.line.addLine(list[0], list[1]);
            this.line.addLine(list[2], list[3]);
            this.line.addLine(list[4], list[5]);
            this.line.addLine(list[6], list[7]);


            var list2 = this.FacePonintsTop();
            this.line.addLine(list2[0], list2[1]);
            this.line.addLine(list2[2], list2[3]);
            this.line.addLine(list2[4], list2[5]);
            this.line.addLine(list2[6], list2[7]);
            //  this.line.OnDrawGizmos();
        }
    }

    onAwake() {
        super.onAwake();

        this.onUpdate()
        if (GameDesgin.showaabbBoxLine)
            this.line = this.owner.addComponent(PathLineDrawer);

    }

    onEnable() {
    }

    onDisable() {
        if (this.line != null) {
            this.line.clear();
        }
    }

    public minPoint: Laya.Vector3 = new Laya.Vector3();

    public maxPoint: Laya.Vector3 = new Laya.Vector3();

    public halfSize: Laya.Vector3 = new Laya.Vector3();

    public center: Laya.Vector3 = new Laya.Vector3();
    private _center: Laya.Vector3 = new Laya.Vector3();

    public size: Laya.Vector3;

    public rightBottomPonint(): Laya.Vector3 {

        return new Laya.Vector3(0, this.minPoint.y, this.maxPoint.z);
    }

    public FacePonintsA(): Laya.Vector3[] {
        var list: Laya.Vector3[] = [];
        var minz = this.minPoint.z;
        list.push(new Laya.Vector3(this.minPoint.x, this.minPoint.y, minz));
        list.push(new Laya.Vector3(this.maxPoint.x, this.minPoint.y, minz));

        // list.push(new Laya.Vector3(this.minPoint.x, this.minPoint.y, minz));
        // list.push(new Laya.Vector3(this.maxPoint.x, this.minPoint.y, minz));
        list.push(new Laya.Vector3(this.minPoint.x, this.maxPoint.y, minz));
        list.push(new Laya.Vector3(this.maxPoint.x, this.maxPoint.y, minz));


        list.push(new Laya.Vector3(this.minPoint.x, this.minPoint.y, minz));
        list.push(new Laya.Vector3(this.minPoint.x, this.maxPoint.y, minz));

        list.push(new Laya.Vector3(this.maxPoint.x, this.minPoint.y, minz));
        list.push(new Laya.Vector3(this.maxPoint.x, this.maxPoint.y, minz));


        return list//new Laya.Vector3(this.minPoint.x, this.minPoint.y, this.maxPoint.z);
    }

    public FacePonintsTop(): Laya.Vector3[] {
        var list: Laya.Vector3[] = [];
        var maxz = this.maxPoint.z;
        var minz = this.minPoint.z;
        //距离自己最近的线
        //
        //
        list.push(new Laya.Vector3(this.minPoint.x, this.maxPoint.y, minz));
        list.push(new Laya.Vector3(this.maxPoint.x, this.maxPoint.y, minz));

        //左边

        list.push(new Laya.Vector3(this.minPoint.x, this.maxPoint.y, maxz));
        list.push(new Laya.Vector3(this.minPoint.x, this.maxPoint.y, minz));
        //右边
        list.push(new Laya.Vector3(this.maxPoint.x, this.maxPoint.y, maxz));
        list.push(new Laya.Vector3(this.maxPoint.x, this.maxPoint.y, minz));

        //距离最远的线
        list.push(new Laya.Vector3(this.minPoint.x, this.maxPoint.y, maxz));
        list.push(new Laya.Vector3(this.maxPoint.x, this.maxPoint.y, maxz));


        return list//new Laya.Vector3(this.minPoint.x, this.minPoint.y, this.maxPoint.z);
    }


    public UpdateShape(transform: Laya.Transform3D) {
        //this._center= this.center = transform.position;

        

        Vector3Ext.add_Fast(this.center, transform.position, this._center);

        Vector3Ext.mul_Num_Fast(this.size, 0.5, this.halfSize);

        Vector3Ext.sub_Fast(this._center, this.halfSize, this.minPoint);

        Vector3Ext.add_Fast(this._center, this.halfSize, this.maxPoint);

    }

    public Intersects(aabb: AABBShape): boolean {
        return this.minPoint.x < aabb.maxPoint.x &&
            this.minPoint.y < aabb.maxPoint.y &&
            this.minPoint.z < aabb.maxPoint.z &&
            aabb.minPoint.x < this.maxPoint.x &&
            aabb.minPoint.y < this.maxPoint.y &&
            aabb.minPoint.z < this.maxPoint.z;
    }







}