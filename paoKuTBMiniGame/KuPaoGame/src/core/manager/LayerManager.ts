/*
 * @Date: 2021-06-03 20:06:05
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-15 11:25:53
 * @description: 
 */
import Layer from "../base/layer/Layer"
import Dictionary from "../util/Dictionary"
import Log from "../util/Log"

/*
 * @Date: 2021-05-26 10:11:31
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-01 15:07:38
 * @description: 层级管理器
 */
export default class LayerManager{
    /**层级管理器 */
    private _layerDic:Dictionary<any,Layer>

    private static _instance:LayerManager = null

    private constructor(){
        this._layerDic = new Dictionary<string,Layer>()
    }
    

    public static get instance():LayerManager{
        if(this._instance == null){
            this._instance = new LayerManager()
        }
        return this._instance
    }

    /**
     * 销毁
     */
    public destory():void{
        for (const layer of this._layerDic.values) {
            layer.removeSelf()
            layer.destroy()
        }
        this._layerDic = null
    }

    /**
     * 添加层
     * @param layerClass 层类名
     * @returns 
     */
    public addLayer<T extends Layer>(layerClass:new ()=>T):T{
        let layer = this.getExistLayer(layerClass)
        if(layer == null){
            layer = new layerClass()
            layer.name = layerClass.prototype.constructor.name
            this._layerDic.setValue(layerClass,layer)
            Laya.stage.addChild(layer)
        }else{
            Log.log("该图层已经添加，请检查:",layerClass.prototype.name)
        }
        return layer
    }

    /**
     * 获取层
     * @param layerClass 层级类
     * @returns 层级实例
     */
    private getExistLayer<T extends Layer>(layerClass:new ()=>T):T{
        let index = this._layerDic.indexOf(layerClass)
        if(index >= 0){
            return this._layerDic.values[index] as T
        }
        return null
    }

    /**
     *  获取层
     * @param layerClass 层类
     * @returns 
     */
    public getLayer <T extends Layer>(layerClass:new ()=>T):T{
        return this.getExistLayer(layerClass) as T
    }

    /**
     * 
     * @param scene 添加场景
     * @param layerClass 层级
     * @returns 
     */
    public addScene<T extends Layer>(scene:Laya.Sprite,layerClass:new ()=>T):Laya.Sprite{
        let layer = this.getExistLayer(layerClass)
        if(layer){
            layer.addChild(scene)
        }else{
            throw new Error("该层级未创建")
        }
        return scene
    }

    /**
     * 移除场景
     * @param scene 场景
     * @param layerClass 场景类名 
     * @returns 
     */
    public removeScene<T extends Layer>(scene:Laya.Sprite,layerClass:new ()=>T):Laya.Sprite{
        let layer = this.getExistLayer(layerClass)
        if(layer){
            scene.removeSelf()
        }else{
            throw new Error("该层级未创建")
        }
        return scene
    }
}