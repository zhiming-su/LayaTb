/*
 * @Date: 2021-06-07 13:56:00
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-01 17:10:59
 * @description: 
 */
import UIEvent from "../event/UIEvent"
import LayerManager from "../manager/LayerManager"
import UIManager from "../manager/UIManager"
import Layer from "./layer/Layer"
import UILayer from "./layer/UILayer"

/**
 * 
 */
/**资源url(包括图集和scene生成的json) */
export default class BaseView extends Laya.Scene{
    private _urlArray:Array<any>  = null
    /**图集地址 */
    protected _atlasUrl:string = ""
    /**是否正在加载 */
    private _isLoading:boolean = false
    /**是否加载完成 */
    private _isLoaded:boolean = false
    /**父层级 */
    protected _parentLayer:Layer = null
    /**是否播放入场动画 */
    private _isAnimation:boolean = true
    /**UI加载完成 */
    private _loadCompleteCallBack:Function = null
    constructor(){
        super(false)
        this.init()
    }

    init():void{
        this.setBindUrl()
        this._urlArray = [
            {url:this._atlasUrl,type:Laya.Loader.ATLAS},
            {url:this.url,type:Laya.Loader.JSON}
        ]
        this.setParentLayer()
    }

    protected setBindUrl():void{
        
    }
    
    protected setParentLayer():void{
        this._parentLayer = LayerManager.instance.getLayer(UILayer)
    }

    /**
     * 是否显示窗口动画
     */
    public set isAnimation(val:boolean)
    {
        this._isAnimation = val;
    }

    /**
     * 打开UI
     */
    public openView(open):void{
        if(this._isLoading){
            return 
        }
        this._loadCompleteCallBack = open
        if(this._isLoaded){
            this.doOpen()
        }else{
            this.doLoad()
        }  
    }

    /**
     * 加载相关资源
     */
    private doLoad():void{
        Laya.loader.load(this._urlArray,Laya.Handler.create(this,this.onLoadComplete))
        this._isLoading = true
    }

    /**
     * 资源加载完成
     */
    private onLoadComplete():void{
        this._isLoading = false
        this._isLoaded = true
        this.doOpen()
    }

    private doOpen():void{
        this.createChildren()
        this.open()
    }

    protected createChildren():void {
        super.createChildren();
        this.createView(Laya.loader.getRes(this.url))
        this.initChildren()
    }

    /**
     * 文件模式 在此函数中把要用到的控件取出来
     */
    protected initChildren():void{

    }
    
    /**
     *  资源页面加载完成  打开页面
     * @param closeOther 
     * @param param 
     */
    public open(closeOther?:boolean,param?:any):void{
        if (closeOther)
            UIManager.instance.closeAll() ;
        if(this._parentLayer == null){
            throw "this._parent未赋值，请使用openView函数"
        }
        this.initAnchor()
        this.initScaleAndAlpha()
        this._parentLayer.addChild(this);
        this.onOpened(param);
        if(this._isAnimation){
            this.openAnimation()
        }else{
            UIManager.instance.open(this)
        }
        this._loadCompleteCallBack()
    }

    /**
     * 初始化锚点
     */
    private initAnchor():void{
        if(this.width && this.height){
            this.width = Laya.stage.width
            this.height = Laya.stage.height
            this.pivot(Laya.stage.width/2,Laya.stage.height/2)
            this.x = Laya.stage.width/2
            this.y = Laya.stage.height/2
        }
    }

    /**
     * 初始化缩放,Alpha
     */
    private initScaleAndAlpha():void{
        this.scale(0,0)
        this.alpha = 0
    }

    private openAnimation():void{
        Laya.Tween.to(this,{
            scaleX: 1,scaleY: 1,alpha: 1
        },400,Laya.Ease.backOut,Laya.Handler.create(this,this.onOpenAniComplete))
    }
    
    private onOpenAniComplete():void{
        UIManager.instance.open(this)
    }

    /**
     * 关闭动画
     */
    private closeAnimation():void{
        Laya.Tween.to(this,{
            scaleX: 0,scaleY: 0,alpha: 0
        },400,Laya.Ease.backIn,Laya.Handler.create(this,this.onCloseAniComplete))
    }

    private hideWindow(destroy?:boolean,destroyChild?:boolean):void{
        this.removeSelf()
        UIManager.instance.close(this)
        this.event(UIEvent.CLOSE)
        if(destroy){
            this.destroy(destroyChild)
        }
    }

    /**
     * 关闭动画结束
     */
    private onCloseAniComplete():void{
        this.hideWindow()
    }

    /**
     * 取消加载
     */
    private cancelLoad():void{
        if(this._urlArray != null){
            Laya.loader.cancelLoadByUrls(this._urlArray)
            // this._urlArray.splice(0, this._urlArray.length)
            // this._urlArray = null
        }
    }

    /**
     * 关闭UI
     */
    public closeView(destroyChild?:boolean):void{
        if(this._isLoading){
            this.cancelLoad()
            return
        }
        if(this._isAnimation){
            this.closeAnimation()
        }else{ 
            this.hideWindow(destroyChild)
        }
    }

    /**
     * 销毁
     */
    public destroy(destroyChild?:boolean):void{
        this._isAnimation = false
        this._isLoading = false
        this._isLoaded = false
        Laya.Tween.clearTween(this)
        this.cancelLoad()
        super.destroy(destroyChild)
    }

}