import BaseModule from "../../../core/base/BaseModule";
import ModuleManager from "../../../core/manager/ModuleManager";
import Log from "../../../core/util/Log";
import ModuleCenter from "../../../ModuleCenter";
import { Platform } from "../../platform/Platform";
import GameModule from "../game/GameModule";
import { LoadingType } from "./LoadingType";
import LoadingView from "./LoadingView";

/*
 * @Date: 2021-06-07 14:45:18
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-17 16:58:07
 * @description: 
 */
export default class LoadingModule extends BaseModule{
    /**资源加载完毕 */
    private fileLoadOk:boolean = false
    /**当前进度条值 */
    private currentProgress:number = 0
    
    protected _view:LoadingView = null

    constructor(){
        super()
        
    }

    protected open():void{
        let self = this
        ModuleCenter.instance.openGameScene(true,(value)=>{
            this._view.updataProgress(value)
        })
    }
    
    public addView():void{
        this._view = new LoadingView()
    }

    public closeWindow():void{
        super.closeWindow()
    }
}

export class LoadingViewArg {
    subpackgeName = '';
    loadokfunc: Function;
    caller: any;
}