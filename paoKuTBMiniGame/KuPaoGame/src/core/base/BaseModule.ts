/*
 * @Date: 2021-06-07 09:45:33
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-01 15:19:29
 * @description: 
 */
import IModule from "../interface/IModule";
import Log from "../util/Log";
import BaseModel from "./BaseModel";
import BaseView from "./BaseView";

/**
 * 基础模块
 */
export default class BaseModule implements IModule{
    /**数据 */
    protected _model:BaseModel = null
    /**ui */
    protected _view:BaseView = null
    /**打开UI回调 */
    protected _callBack:Function = null
    constructor(){

    }

    /**
     * 初始化
     */
    public initialize():void{
        this.addModel()
        this.addView()
        if(this._model){
            this._model.regist()
        }
    }

    /**
     * 反初始化
     */
    public uninitialize():void{
        if(this._model){
            this._model.destory()
            this._model = null
        }
        if(this._view){
            this._view.destroy()
            this._view = null
        }
    }

    /**
     * 添加数据
     */
    protected addModel():void{
        Log.log("子类如果有数据需要重写")
    }

    /**
     * 添加UI
     */
    protected addView():void{
        Log.log("子类如果有UI需要重写")
    }

    /**
     * 获取数据模块
     */
    public get model():BaseModel{
        return this._model
    }

    /**
     * 打开界面
     * @param callback 打开界面的回调
     */
    public openWindow(callback:Function=null):void{
        if(callback){
            this._callBack = callback
        }
        if(this._view){
            this._view.openView(()=>{
                this.open()
            })
        }else{
            throw "该模块UI未初始化，请实现AddView函数"
        }
        if(this._callBack!=null){
            this._callBack()
        }
    }

    /**
     * 此函数是UI加载完成的回调,如果想调用控件，一定是从这个开始初始化
     */
    protected open():void{
        Log.log("此函数是UI加载完成的回调,如果想调用控件，一定是从这个开始初始化")
    }

    /**
     * 关闭弹窗
     */
    public closeWindow(destroyChild?:boolean):void{
        if(this._view){
            this._view.closeView(destroyChild)
            // this._view = null
        }
    }
}