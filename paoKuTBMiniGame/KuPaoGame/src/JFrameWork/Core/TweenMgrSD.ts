/*
 * @Date: 2021-06-15 10:27:15
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-15 16:03:13
 * @description: 
 */
import Time from "../../UnityEngine/Time";
import Vector3Ext from "./Vector3Ext";

export default class TweenMgrSD extends Laya.Script {


    private static mTweenMgrSD: TweenMgrSD;

    public static getInstantce(): TweenMgrSD  {
        if (TweenMgrSD.mTweenMgrSD == null)  {
            TweenMgrSD.mTweenMgrSD = new TweenMgrSD();
        }
        return TweenMgrSD.mTweenMgrSD;
    }


    constructor() { super(); }

    onEnable(): void {
    }

    onDisable(): void {
    }

    public DoMve(endTimeSc: number, target: Laya.Transform3D, start: Laya.Vector3, end: Laya.Vector3, startTime: number, obj) {

        Laya.timer.loop(10, obj, () => {
            let t = (Time.time - startTime) / endTimeSc;
            let p = Vector3Ext.Lerp(start, end, t);

            target.position = p;

            if (t >= 1) {
                target.position = end;
                Laya.timer.clear(obj, obj.func);
            }
        });
    }


//    private func_A(startTime,endTimeSc,start,end,target,callder,cb)
//     {
//         let t = (Time.time - startTime) / endTimeSc;
//             let p = Vector3Ext.Lerp(start, end.position, t);

//             target.position = p;

//             if (t >= 1) {
//                 target.position = end.position;
//                 Laya.timer.clear(callder, this,this.func_A);
//                 cb.apply(callder);
//             }
        
            
//     }

    public DoMveCb(endTimeSc: number, target: Laya.Transform3D, start: Laya.Vector3, end: Laya.Transform3D, startTime: number,callder,cb:Function) {


        let fc=() => {
            let t = (Time.time - startTime) / endTimeSc;
            let p = Vector3Ext.Lerp(start, end.position, t);
            target.position = p;

            if (t >= 1) {
                target.position = end.position;
                Laya.timer.clear(callder, fc);
                cb.apply(callder);
            }
        };

        
        Laya.timer.loop(10, callder, fc);



    }

    private m_DoMveCb(endTimeSc: number, target: Laya.Transform3D, start: Laya.Vector3, end: Laya.Vector3, startTime: number,callder,cb:Function) {

        Laya.timer.loop(10, callder, () => {
            let t = (Time.time - startTime) / endTimeSc;
            let p = Vector3Ext.Lerp(start, end, t);

            target.position = p;

            if (t >= 1) {
                target.position = end;
                Laya.timer.clear(callder, callder.DoMveCb);
                cb.apply(callder);
            }
        });

        

    }
}