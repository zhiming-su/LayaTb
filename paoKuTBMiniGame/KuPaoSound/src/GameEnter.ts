import Scene3DLayer from "./core/base/layer/Scene3DLayer"
import TipsLayer from "./core/base/layer/TipsLayer"
import UILayer from "./core/base/layer/UILayer"
import LayerManager from "./core/manager/LayerManager"
import ModuleCenter from "./ModuleCenter"
import { UnityEnagine } from "./unityEngine/UnityEnagine"

/*
 * @Date: 2021-06-11 15:48:45
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-16 13:47:13
 * @description: 
 */
export default class GameEnter{
    private _loadUrlArray:Array<string> = null

    constructor(){
        this._loadUrlArray = [
            "config/random.json",
            "config/model_0.json",
            "config/model_1.json",
            "config/model_2.json",
            "config/model_3.json",
            "config/model_4.json",
            "config/model_5.json",
            "config/model_6.json",
            "config/model_7.json",
            "config/model_8.json",
            "config/model_9.json",
            "config/model_10.json",
            "config/model_11.json",
            "config/model_12.json",
            "over/starsky.png"
        ]
        Laya.loader.load(this._loadUrlArray,Laya.Handler.create(this,this.init))
    }

    /**
     * 初始化
     */
    private init():void{
        this.initUnityEngine()
        this.initLayer()
        ModuleCenter.instance.create()
        this.startGame()
    }

    /**
     * 初始化模拟Unity脚本
     */
    private initUnityEngine():void{
		let node = new Laya.Node();
		Laya.stage.addChild(node);
		node.addComponent(UnityEnagine);
    }

    /**
    * 初始化层级
    */
    private initLayer():void{
        LayerManager.instance.addLayer(Scene3DLayer)
        LayerManager.instance.addLayer(UILayer)
        LayerManager.instance.addLayer(TipsLayer)
    }

    /**
     * 开始游戏
     */
    private startGame():void{
        ModuleCenter.instance.openLoadingView(true)
    }

}