/*
 * @Date: 2021-06-09 10:42:04
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-10 15:32:36
 * @description: 
 */

import SceneManager from "../../core/manager/SceneManager";
import GameObject from "../../UnityEngine/GameObject";

export default class PathLineDrawer extends Laya.Script {

    constructor() { super(); }

    public start: Laya.Vector3;
    public end: Laya.Vector3;

    onAwake() {
        this.phasorSpriter3D = new Laya.PixelLineSprite3D(10, "my");

    }
    onEnable(): void {


    }

    onStart()  {
        //this.OnDrawGizmos();

        GameObject.Add2Scene(this.phasorSpriter3D,SceneManager.game);

        // this.OnDrawGizmos();
    }

    onUpdate()  {

    }



    onDisable(): void {
    }

    //顶点和矩阵相乘
    phasorSpriter3D: Laya.PixelLineSprite3D;
    public OnDrawGizmos() {
        this.phasorSpriter3D.clear()
        // var piov: Laya.Vector2 = this.transform.position;



        //画边
        // if (IsCollison) Gizmos.color = Color.red;
        //  for (let i = 0; i < this.points.length - 1; i++) {


        //var _color = new Laya.Vector4(1, 255, 0, 1);
        // var _corners = new Array();
        //_corners[0] = new Laya.Vector3(0, 0, 0);
        // _corners[1] = new Laya.Vector3(10, 10, 0);
        // var start: Laya.Vector3 = this.getPos(this.points[i]);
        //  var end: Laya.Vector3 = this.getPos(this.points[i + 1]);
        this.phasorSpriter3D.addLine(this.start, this.end, Laya.Color.RED, Laya.Color.RED)

        // Gizmos.DrawLine(getPos(points[i]), getPos(points[i+1]));
        //  }
    }

    public clear() {
        this.phasorSpriter3D.clear()

    }

    public addLine(pstart: Laya.Vector3, pend: Laya.Vector3)  {
        this.phasorSpriter3D.addLine(pstart, pend, Laya.Color.RED, Laya.Color.RED)
    }



}