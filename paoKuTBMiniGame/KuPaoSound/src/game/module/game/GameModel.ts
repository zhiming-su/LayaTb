import BaseModel from "../../../core/base/BaseModel";
import Log from "../../../core/util/Log";
import PlayerPrefs from "../../../unityEngine/PlayerPrefs";
import DataChangeEvent from "../../data/DataChangeEvent";
import GlobalData from "../../data/GlobalData";
import ICollectionShopData from "../../interface/ICollectionShopData";

/*
 * @Date: 2021-06-10 11:55:54
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-16 10:45:12
 * @description: 
 */
export default class GameModel extends BaseModel{
    /**总分数 */
    private _score:number = 0
    /**鱼的数量 */
    private _fishCount:number = 0
    /**开始时间 */
    private _startTime:string = ""
    /**结束时间 */
    private _endTime:string = ""
    /**收藏商品数据 */
    private _collectionShopDataArray:Array<ICollectionShopData> = null
    /**点击收藏过的数据 */
    private _usedCollectionShopArray:Array<number> = null
    /**返回提示信息 */
    private _tipMessage:string = ""
    constructor(){
        super()
    }

    public regist():void{
        super.regist()
        this._collectionShopDataArray = []
        this._usedCollectionShopArray = []
        // console.log("注册数据")
        window.platform.doInitActivity().then(
            (res)=>{
                if(res.success == true){
                    GlobalData.isGuide = res.isGuide
                    this._tipMessage = res.message
                    this._startTime = res.startTime
                    this._endTime = res.endTime
                    for (let index = 0; index < res.collectionCommoditys.length; index++) {
                        let obj = <ICollectionShopData>{}
                        let element = res.collectionCommoditys[index];
                        obj.imgUrl = element.imgUrl
                        obj.price = element.price
                        obj.commodityId = element.commodityId
                        obj.title = element.title
                        this._collectionShopDataArray.push(obj)
                    }
                    console.log("初始化成功")
                }
            },
            (err)=>{
                console.log(err)
                Log.log("初始化数据失败")
            }
        )
    }
    
    public get startTime():string{
        return this._startTime
    }
    public get endTime():string{
        return this._endTime
    }

    public get score():number{
        return this._score
    }
 
     public set score(value){
         if(value != this._score){
             this._score = value
             this.event(DataChangeEvent.SCORE_CHANGE,this._score)
         }
     }
 
     public get fishCount():number{
         return this._fishCount
     }
 
     public set fishCount(value){
         if(value != this._fishCount){
             this._fishCount = value
             this.event(DataChangeEvent.FISH_COUNT_CHANGE,this._fishCount)
         }
     }

     /**
      * 收藏商品数组
      */
     public get collectionShopDataArray():Array<ICollectionShopData>{
         return this._collectionShopDataArray
     }

     /**
      * 
      * @returns 收藏商品信息
      */
     public getCollectionShopData():any{
         if(this._collectionShopDataArray != null && this._collectionShopDataArray.length > 0){
            let collection:ICollectionShopData = this._collectionShopDataArray.pop()
            return collection
         }else{
             return null
         }
     }

     /**
      * 重置收藏商品信息
      */
     public resetCollectionShopData(collectionCommoditys:Array<ICollectionShopData>):void{
        this._collectionShopDataArray = []
        for (let index = 0; index < collectionCommoditys.length; index++) {
            let obj = <ICollectionShopData>{}
            let element = collectionCommoditys[index];
            obj.imgUrl = element.imgUrl
            obj.price = element.price
            obj.commodityId = element.commodityId
            obj.title = element.title
            this._collectionShopDataArray.push(obj)
        }
     }

     /**
      * 已收藏
      * @param commodityId 
      */
     public setUsedCollectionShopArray(commodityId):void{
        this._usedCollectionShopArray.push(commodityId)
     }
    
     /**
      * 已收藏次数
      * @returns 次数
      */
     public getCollectTimes():number{
         return this._usedCollectionShopArray.length
     }

     /**
      * 是否超出最大收藏次数 true 超出
      * */
     public isOver():boolean{
         let isOver = this._usedCollectionShopArray.length >= 3?true:false
         console.log("isOver",isOver)
         return isOver
     }

     /**
      * 获取收藏过的数据
      */
     public getUsedCollectionShops():Array<number>{
        return this._usedCollectionShopArray
     }

     public guideOK() {
         PlayerPrefs.SetInt('Guidev2', 1);
     }
}