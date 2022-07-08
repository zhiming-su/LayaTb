import ModuleManager from "./core/manager/ModuleManager";
import GameModule from "./game/module/game/GameModule";
import LoadingModule from "./game/module/loading/LoadingModule";
import { LoadingType } from "./game/module/loading/LoadingType";
import OverModule from "./game/module/over/OverModule";
import ToastModule from "./game/module/toast/ToastModule";

/*
 * @Date: 2021-06-11 15:51:51
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-17 17:59:03
 * @description: 
 */
export default class ModuleCenter{
    /**模块管理器 */
    private _moduleManager:ModuleManager = null
    /**单例 */
    private static _instance:ModuleCenter = null
    private constructor(){
        
    }

    public static get instance():ModuleCenter{
        if(this._instance == null){
            this._instance = new ModuleCenter()
        }
        return this._instance
    }

    /**
     * 创建管理器
     */
    public create():void{
        this._moduleManager = new ModuleManager()
        this.createModule()
        this._moduleManager.initialize()
    }

    /**
     * 创建模块
     */
    private createModule():void{
        /**-----------------------------添加各个模块Start---------------------------------- */
        // this._moduleManager.addModule(InitModule)
        this._moduleManager.addModule(LoadingModule)
        // this._moduleManager.addModule(HomeModule)
        this._moduleManager.addModule(GameModule)
        this._moduleManager.addModule(OverModule)
        this._moduleManager.addModule(ToastModule)
        /**-----------------------------添加各个模块End---------------------------------- */
    }

    public destory():void{
        this._moduleManager.uninitialize()
        this._moduleManager.removeAllModule()
        this._moduleManager = null
    }

    /**
     * 打开loading界面
     * @param b 
     */
    public openLoadingView(b:boolean){
        let loadingModule:LoadingModule = this._moduleManager.getModule(LoadingModule)
        if(b){
            loadingModule.openWindow()
        }else{
            loadingModule.closeWindow()
        }
    }

    //-----------------------------Game模块Start---------------------------------------------//
    /**
     *  打开游戏
     * @param open 是否打开
     */
    public openGameScene(open:boolean,callBack:(value)=>void):void{
        let gameModule:GameModule = this._moduleManager.getModule(GameModule)
        if(open){
            gameModule.setCallBack(callBack)
            gameModule.openWindow()
        }else{
            gameModule.closeWindow()
        }
    }

    public restartGame():void{
        let gameModule:GameModule = this._moduleManager.getModule(GameModule)
        gameModule.uninitialize()
        gameModule.initialize()
        gameModule.openWindow()
    }

    public get gameModule():GameModule{
        return this._moduleManager.getModule(GameModule)
    }

    //-----------------------------Game模块End---------------------------------------------//

    /**
     *  显示提示
     * @param content 提示内容
     */
    public showTips(content):void{
        let toastModule:ToastModule = this._moduleManager.getModule(ToastModule)
        toastModule.showToas(content)
        toastModule.openWindow();
    }


    /**---------------------------Over模块Start-------------------------------------------------- */
    public openOverView(b:boolean){
        let overModule:OverModule = this._moduleManager.getModule(OverModule)
        if(b){
            overModule.openWindow()
        }else{
            overModule.closeWindow()
        }
    }
    /**---------------------------Over模块End-------------------------------------------------- */
}