import BaseModule from "../base/BaseModule";
import Dictionary from "../util/Dictionary";
import Log from "../util/Log";

/*
 * @Date: 2021-06-05 11:25:41
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-11 16:19:36
 * @description: 模块管理器
 */
export default class ModuleManager{
    private _modules:Dictionary<any,BaseModule> = null
    constructor(){
        this._modules = new Dictionary<any,BaseModule>()
    }
    /**
     * 初始化
     */
    public initialize(): void {
        this._modules.values.forEach(element => {
            element.initialize();
        });
    }

    /**
     * 反初始化
     */
     public uninitialize(): void {
        this._modules.values.forEach(element => {
            element.uninitialize();
        });
    }
        
    /**
     * 添加模块
     */
    public addModule<T extends BaseModule>(moduleClass:new ()=>T):void{
        if(this._modules == null){
            return 
        }
        if(this._modules.indexOf(moduleClass) > -1){
            throw "重复添加模块：" + moduleClass.prototype.constructor.name
        }
        this._modules.setValue(moduleClass,new moduleClass())
    }

    public getModule<ModuleClass extends BaseModule>(moduleClass:new ()=>ModuleClass):ModuleClass{
        if(this._modules == null){
            return 
        }
        return this._modules.getValue(moduleClass) as ModuleClass
    }
    
    /**
     * 移除模块
     * @param moduleClass 模块类
     */
    public removeModule<T extends BaseModule>(moduleClass:new ()=>T):void{
        if(this._modules == null){
            return 
        }
        let removeModule = this.getModule(moduleClass)
        if(removeModule){
            this._modules.remove(moduleClass)
        }else{
            Log.log("该模块不存在：" + moduleClass.prototype.constructor.name)
        }
    }
    
    /**
     * 移除所有模块
     */
    public removeAllModule():void{
        if(this._modules.length > 0){
            this._modules.forEach((k,v)=>{
                this.removeModule(k)
            })
        }
    }

    /**
     * 销毁
     */
    public destroy(): void {
        this._modules.clear();
        this._modules = null;
    }
}

