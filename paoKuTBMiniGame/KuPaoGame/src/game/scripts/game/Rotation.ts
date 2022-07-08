import MathUtli from "../../../core/util/MathUtli"

/*
 * @Date: 2021-06-24 17:27:11
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-25 14:37:22
 * @description: 旋转脚本
 */
export default class Rotation extends Laya.Script{
    private _transform:Laya.Transform3D = null

    private _speed:number = 0.1
    constructor(){
        super()
    }

    onAwake():void{
        this._transform = (this.owner as Laya.Sprite3D).transform
    }

    onUpdate():void{
        if(this._transform == null) return
        let speed = Laya.timer.delta * this._speed
        if(this.owner.active){
            this._transform.rotate(new Laya.Vector3(0,speed,0),true,false)
        }else{
            // console.log("未激活")
        }
    }

    /**
     *  从回收池取用时候 重transform
     * @param value 
     */
    resetTransform(value):void{
        this._transform = value
    }

    recover():void{
        this._transform = null
    }
}