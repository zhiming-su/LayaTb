import BaseView from "../../../core/base/BaseView"
import ProgressBarMasK from "../../scripts/component/progress/ProgressBarMasK";

/*
 * @Date: 2021-06-08 19:41:26
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-17 18:19:43
 * @description: 
 */
export default class GameView extends BaseView{
    public fishfont: Laya.FontClip;
    public score: Laya.FontClip;
    public fishImage: Laya.Image;
    // public startbox: Laya.Box;
    public finger: Laya.Image;
    public endHitFont: Laya.FontClip;
    public arrowFlashesAni:Laya.Animation;

    public voice:Laya.Image
    public timeImage:Laya.Image
    constructor(){
        super()
    }

    protected setBindUrl():void{
        this._atlasUrl = "res/atlas/game.atlas"
        this.url = 'views/game.json'
    }

    /**
    * 初始化子节点（文件模式取值）
    */
    protected initChildren():void{
        this.fishImage.visible = true
    }

    public showTimeImage(time):void{
        this.timeImage.alpha = 0
        this.timeImage.scale(0.1,0.1)
        this.timeImage.skin = "game/"+ time + ".png"
        Laya.Tween.to(this.timeImage,{
            alpha:1,
            scaleX:1,
            scaleY:1,
        },100,Laya.Ease.backIn)
    }
}
