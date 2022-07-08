import ShapeThreeD, { CollisionMask } from "./ShapeThreeD";

import GameDesgin from "../Game/GameDesgin";
import Vector3Ext from "../Core/Vector3Ext";
import AABBShape from "./AABBShape";
import { EventManager } from "../../core/manager/EventManager";
import { EventType } from "../../core/event/EventType";

export default class CollsionManagerThreeD extends Laya.Script {

    constructor() { super(); }

    detectObjs: ShapeThreeD[] = [];
    public static instantce: CollsionManagerThreeD;
    public Itemlist: ShapeThreeD[] = [];

    onAwake() {
        CollsionManagerThreeD.instantce = this;

        EventManager.instance.on(EventType.ShapeThreeDEnterWorld, this, this.OnShapeThreeDEnterWorld);


    }

    OnShapeThreeDEnterWorld(o: ShapeThreeD) {

        this.Itemlist.push(o);

        this.UpdateDetectMap();
    }


    SetDetectObj(o: ShapeThreeD) {
        this.detectObjs.push(o);
        this.UpdateDetectMap();
    }

    UpdateDetectMap() {
        for (let i = 0; i < this.detectObjs.length; i++) {
            for (let j = 0; j < this.Itemlist.length; j++) {
                const item = this.Itemlist[j];

                if (this.detectObjs[i].detectmap[item.id] == null)
                    this.detectObjs[i].detectmap[item.id] = false;

            }
        }
    }





    enterList = [];
    exitList = [];
    datacg: any = {};

    onLateUpdate() {
        if (GameDesgin.enableCollsion) {
            if (this.detectObjs.length >= 1) {
                for (let i = 0; i < this.detectObjs.length; i++) {

                    let detectAABB = this.detectObjs[i] as AABBShape;
                    //进行粗略检测
                    //结合案例，主角前面20米之内的对象才进行检测
                    //大多数物理引擎采用的是二叉树，，四叉树，八叉树，进行粗略检测
                    this.GetFilterZItems(this.detectObjs[i].transform.position.z, detectAABB);

                    this.Detect(detectAABB, detectAABB.moveSpeed);
                }
            }
        }
    }
    public Detect(source: ShapeThreeD, movedir: Laya.Vector3) {
        let sourcraabb = source as AABBShape;


        let testCount = 0;
        for (let index = 0; index < this.filerZList.length; index++) {
            let element = this.filerZList[index] as AABBShape;

            let isCollstionTest = (source.collisionMask & 1 << element.mask) > 0;

            if (source.id != element.id && isCollstionTest) {

                let targetId = element.id;
                let targetaabb = element;
                let collsion = false;

                if (source.detectmap[targetId])
                    testCount += 1;


                let t = new Laya.Vector3();
                collsion = sourcraabb.Intersects(targetaabb);
                // let movespeed = Laya.Vector3.subtract(sourcraabb.moveSpeed, targetaabb.moveSpeed, t)
                //  collsion = this.SweepTestCollision(sourcraabb, sourcraabb, t);

                if (collsion) {


                    let collsioning = false;
                    // let haskey2 = false;
                    // haskey2 = source.detectmap[targetId] != null;
                    // if (!haskey2) {
                    //     console.log("not key:" + targetId);
                    // }


                    if (source.detectmap[targetId] == false) {

                        source.TriggerEnterEvent(source, element);
                        source.detectmap[targetId] = true;
                    }

                }
                else {

                    if (source.detectmap[targetId]) {

                        source.TriggerExitEvent(source, element);

                        source.detectmap[targetId] = false;
                    }

                }

            }


        }

    }


    filerZList: ShapeThreeD[] = [];
    GetFilterZItems(zStart: number, remove_aabb: AABBShape) {
        this.filerZList = [];
        for (let index = 0; index < this.Itemlist.length; index++) {
            let element = this.Itemlist[index] as AABBShape;
            if (element.gameObject.displayedInStage == false) continue;
            if (element.gameObject.activeInHierarchy == false) continue;
            if (element.gameObject.id == remove_aabb.gameObject.id) continue;
            if (Math.abs(zStart - element.transform.position.z) > 20) continue;
            this.filerZList.push(this.Itemlist[index]);
        }
    }



    public IsSweepTestCollision(from: AABBShape, other: AABBShape, movement: Laya.Vector3): boolean {
        let deltaX = movement.x;
        let deltaY = movement.y;
        let deltaZ = movement.z;
        if (from.maxPoint.y > other.minPoint.y && from.minPoint.y < other.maxPoint.y && from.maxPoint.z > other.minPoint.z && from.minPoint.z < other.maxPoint.z) {
            let d1 = 0;

            if (deltaX > 0.0 && from.maxPoint.x <= other.minPoint.x) {
                d1 = other.minPoint.x - from.maxPoint.x;

                if (d1 < deltaX) {
                    deltaX = d1;
                    return true;
                }
            }
            else if (deltaX < 0.0 && from.minPoint.x >= other.maxPoint.x) {
                d1 = other.maxPoint.x - from.minPoint.x;

                if (d1 > deltaX) {
                    deltaX = d1;
                    return true;
                }
            }
        }

        if (from.maxPoint.x > other.minPoint.x && from.minPoint.x < other.maxPoint.x && from.maxPoint.z > other.minPoint.z && from.minPoint.z < other.maxPoint.z) {
            let d1;
            if (deltaY > 0 && from.maxPoint.y <= other.minPoint.y) {
                d1 = other.minPoint.y - from.maxPoint.y;
                if (d1 < deltaY) {
                    deltaY = d1;
                    return true;
                }
            }
            else if (deltaY < 0 && from.minPoint.y >= other.maxPoint.y) {
                d1 = other.maxPoint.y - from.minPoint.y;

                if (d1 > deltaY) {
                    deltaY = d1;
                    return true;
                }
            }
        }

        if (from.maxPoint.x > other.minPoint.x && from.minPoint.x < other.maxPoint.x && from.maxPoint.y > other.minPoint.y && from.minPoint.y < other.maxPoint.y) {
            let d1;

            if (deltaZ > 0.0 && from.maxPoint.z <= other.minPoint.z) {
                d1 = other.minPoint.z - from.maxPoint.z;

                if (d1 < deltaZ) {
                    deltaZ = d1;
                    return true;
                }
            }
            else if (deltaZ < 0.0 && from.minPoint.z >= other.maxPoint.z) {
                d1 = other.maxPoint.z - from.minPoint.z;

                if (d1 > deltaZ) {
                    deltaZ = d1;
                    return true;
                }
            }
        }
        return false;
    }

    public SweepTestCollision(from: AABBShape, other: AABBShape, movement: Laya.Vector3): Laya.Vector3 {
        let deltaX = movement.x;
        let deltaY = movement.y;
        let deltaZ = movement.z;
        if (from.maxPoint.y > other.minPoint.y && from.minPoint.y < other.maxPoint.y && from.maxPoint.z > other.minPoint.z && from.minPoint.z < other.maxPoint.z) {
            let d1 = 0;

            if (deltaX > 0.0 && from.maxPoint.x <= other.minPoint.x) {
                d1 = other.minPoint.x - from.maxPoint.x;

                if (d1 < deltaX) {
                    deltaX = d1;

                }
            }
            else if (deltaX < 0.0 && from.minPoint.x >= other.maxPoint.x) {
                d1 = other.maxPoint.x - from.minPoint.x;

                if (d1 > deltaX) {
                    deltaX = d1;

                }
            }
        }

        if (from.maxPoint.x > other.minPoint.x && from.minPoint.x < other.maxPoint.x && from.maxPoint.z > other.minPoint.z && from.minPoint.z < other.maxPoint.z) {
            let d1;
            if (deltaY > 0 && from.maxPoint.y <= other.minPoint.y) {
                d1 = other.minPoint.y - from.maxPoint.y;
                if (d1 < deltaY) {
                    deltaY = d1;

                }
            }
            else if (deltaY < 0 && from.minPoint.y >= other.maxPoint.y) {
                d1 = other.maxPoint.y - from.minPoint.y;

                if (d1 > deltaY) {
                    deltaY = d1;

                }
            }
        }

        if (from.maxPoint.x > other.minPoint.x && from.minPoint.x < other.maxPoint.x && from.maxPoint.y > other.minPoint.y && from.minPoint.y < other.maxPoint.y) {
            let d1;

            if (deltaZ > 0.0 && from.maxPoint.z <= other.minPoint.z) {
                d1 = other.minPoint.z - from.maxPoint.z;

                if (d1 < deltaZ) {
                    deltaZ = d1;

                }
            }
            else if (deltaZ < 0.0 && from.minPoint.z >= other.maxPoint.z) {
                d1 = other.maxPoint.z - from.minPoint.z;

                if (d1 > deltaZ) {
                    deltaZ = d1;

                }
            }
        }
        return new Laya.Vector3(deltaX, deltaY, deltaZ);;
    }

}