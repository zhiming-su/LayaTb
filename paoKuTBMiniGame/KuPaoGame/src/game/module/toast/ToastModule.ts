import BaseModule from "../../../core/base/BaseModule"
import ToastView from "./ToastView"

/*
 * @Date: 2021-06-09 15:07:37
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-01 15:21:42
 * @description: 
 */
export default class ToastModule extends BaseModule{
    private _tips:any
    constructor(){
        super()
    }
    
    protected addView():void{
        this._view = new ToastView()
    }
    
    /**
    * 界面打开后执行
    */
    protected open():void{
        let view = this._view as ToastView
        view.pushtoas(this._tips)
    }

    public showToas(str):void{
        this._tips = str
    }
}