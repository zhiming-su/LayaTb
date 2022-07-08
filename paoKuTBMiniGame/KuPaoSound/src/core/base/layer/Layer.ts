/*
 * @Date: 2021-06-03 19:55:03
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-03 19:55:52
 * @description: 
 */
import { LayerType } from "./LayerType";

export default class Layer extends Laya.Sprite{
    /**层级类型 */
    private _type:LayerType
    constructor(type:LayerType){
        super()
        this._type = type
        this.init()
    }

    protected init():void{

    }
    
    public destroy():void{
        super.destroy()
    }

    public get type():LayerType{
        return this._type
    }
}