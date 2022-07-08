import { ISpawnConfig } from "../interface/ISpawnConfig"
import RandomData from "./RandomData"

/*
 * @Date: 2021-06-18 14:19:27
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-17 11:48:58
 * @description: 
 */
export default class MapData{
    private _randomDataArray:Array<number> = null
    private _len:number = 0
    constructor(){
        this.initRandom()
    }

    private initRandom():void{
        let data = new RandomData()
        this._randomDataArray = data.createRandomNumber()
        this._len = this._randomDataArray.length
    }

    public create():void{
        for(let i:number = 0;i < this._len;i++){
            let type:number = this._randomDataArray[i]
            // console.log("该路段类型：",type)
        }
    }
    
    /**
     * 移除加载过的类型数据  先入先出
     */
    public popUsedData():number{
        let popdata:number = 0
        if(null != this._randomDataArray && this._randomDataArray.length > 0){
            popdata = this._randomDataArray.shift()
        }  
        return popdata
    }

    /**
     * 根据类型创建路上物品信息
     */
    public createRoadDataByType():Array<ISpawnConfig>{
        let type = this.popUsedData()
        let tempData = Laya.loader.getRes("config/model_"+ type+".json")
        let data = tempData["ed"]["model_"+type+"Table"]
        return this.organizeData(data)
    }

    private _curUsingArray:Array<ISpawnConfig> = null
    
    /**
     *  获取每一行的配置
     * @returns 
     */
    public getRowConfig():ISpawnConfig{
        if(this._curUsingArray == null){
            this._curUsingArray = new Array<ISpawnConfig>()
        }
        if(this._curUsingArray.length == 0){//等于0 说明 当前地板对应的配置全部pop完毕
            this._curUsingArray = this.createRoadDataByType()
        }
        return this._curUsingArray.shift()
    }

    /**
     * 转换数据
     */
    private organizeData(data):Array<any>{
        let arr = []
        for (const key in data) {
            let element = data[key];
            arr.push(element)
        }
        return arr
    }
}