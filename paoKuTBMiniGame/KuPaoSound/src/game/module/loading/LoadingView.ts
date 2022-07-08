import BaseView from "../../../core/base/BaseView";

/*
 * @Date: 2021-06-07 14:44:15
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-16 11:46:49
 * @description: 加载界面
 */
export default class LoadingView extends BaseView{

    public progressBox:Laya.Box
    public progressBg:Laya.Image
    public progressValue:Laya.Image
    public cat:Laya.Image
    // private loadingProgressLabel:Laya.Label
    /**遮罩 */
    private _rectMask: Laya.Sprite = null;
    /**遮罩宽度 */
    private readonly maskWidth: number = 408
    constructor(){
        super()
    }

    /**
     * 设置绑定资源json
     */
    protected setBindUrl():void{
        this._atlasUrl = "res/atlas/loading.atlas"
        this.url = 'views/loading.json'
    }
    
    protected initChildren():void{
        this.initMask()
    }

    /**
     *初始化遮罩
     */
    private initMask():void{
        this._rectMask = new Laya.Sprite()
        this._rectMask.graphics.drawRect(this.progressBg.x - this.maskWidth, this.progressBg.y, this.maskWidth, 26, "#ffffff")
        this.progressValue.mask = this._rectMask
        
        this.cat.x = 0
    }

    /**
     * 更新进度值
     * @param currentProgress 进度值
     */
    public updataProgress(currentProgress):void{
        if (this._rectMask.x >= this.maskWidth) {
            this._rectMask.x = this.maskWidth
        }
        this._rectMask.x = currentProgress * this.maskWidth;
        this.cat.x = currentProgress*(416 - 124)
        // this.loadingProgressLabel.text = Math.floor(currentProgress * 100) + '%';
    }
}