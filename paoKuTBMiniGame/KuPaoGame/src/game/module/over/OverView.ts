import BaseView from "../../../core/base/BaseView";

/*
 * @Date: 2021-06-30 17:14:48
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-17 11:45:16
 * @description: 
 */
export default class OverView extends BaseView{

    public reborn:Laya.Button
    public no:Laya.Image
    public item:Laya.Image

    public label_gold:Laya.Label
    public btn_close:Laya.Image
    public again:Laya.Button

    public rebornCon:Laya.Sprite
    public resultCon:Laya.Sprite

    public fail:Laya.Sprite
    public win:Laya.Sprite
    public label_cards:Laya.Label

    public star:Laya.Image
    constructor(){
        super()
    }

    /**
     * 设置绑定资源json
     */
    protected setBindUrl():void{
        this._atlasUrl = "res/atlas/over.atlas"
        this.url = 'views/over.json'
    }
    
    /**
     *  更新金币
     * @param value 金币数量
     */
    public updataGold(value:number):void{
        this.label_gold.text = value.toString()
    }

    /**
     * 更新复活卡数
     */
    public updataLabelCardsNumber(value:number):void{
        this.label_cards.text = value.toString() + "张"
    }

    public initChildren():void{
        this.star.alpha = 0
        this.star.scale(0.6,0.6)
        this.playStarAni()
    }

    private playStarAni():void{
        Laya.Tween.to(this.star,{alpha:1},30,null)
        .to(this.star,{scaleX:3,scaleY:3,alpha:1},3000,null,Laya.Handler.create(this,this.complete))
    }

    private complete():void{
        this.star.alpha = 0
        this.star.scale(0.6,0.6)
        this.playStarAni()
    }

    /**
     * 设置商品
     */
    public setItemIamge(url:string):void{
        this.item.loadImage(url)
    }

    public destroy():void{
        Laya.Tween.clearTween(this.star)
    }
}