/*
 * @Date: 2021-06-11 15:50:37
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-15 14:24:55
 * @description: 
 */
import BaseView from "../base/BaseView"
import UILayer from "../base/layer/UILayer"
import Dictionary from "../util/Dictionary"
import Log from "../util/Log"

export default class UIManager{
    private static _instance:UIManager = null
    /**ui管理器 */
    private _uiDic:Dictionary<string,BaseView> = null
    private constructor(){
        this.init()
    }

    /**
     * 单例模式
     */
    public static get instance():UIManager{
        if(this._instance == null){
            this._instance = new UIManager()
        }
        return this._instance
    }

    /**
     * 初始化
     */
    private init():void{
        this._uiDic = new Dictionary<string,BaseView>()
    }

    /**
     * 销毁
     */
     public destory():void{
        if (this._uiDic != null) {
            for (var index = 0; index < this._uiDic.values.length; index++) {
                var element:BaseView = this._uiDic.values[index];
                if (element != null) {
                    element.destroy();
                }
            }
        }
    }

    /**
     * 缓存打开的界面
     * @param view 打开的界面
     */
    public open(view:BaseView){
        let isExist:boolean = this._uiDic.indexOf(view.name) > -1?true:false
        if(isExist){
            Log.log("UI已打开：" + view.name)
        }else{
            this._uiDic.setValue(view.name,view)
        }
    }
    
    /**
     *  移除关闭的界面
     * @param view 关闭界面
     */
    public close(view):void{
        let isExist:boolean = this._uiDic.indexOf(view.name) > -1?true:false
        if(isExist){
            this._uiDic.remove(view.name)
        }else{
            Log.log("UI不存在：" + view.name)
        }
    }

    /**
     * 关闭所有UI
     */
    public closeAll():void{
        for (var index = 0; index < this._uiDic.values.length; index++){
            var element:BaseView = this._uiDic.values[index];
            element.close()
            this._uiDic.remove(element.name)
        }
    }
}