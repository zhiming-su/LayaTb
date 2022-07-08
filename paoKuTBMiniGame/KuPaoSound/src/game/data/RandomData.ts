import MathUtli from "../../core/util/MathUtli";
import { IRandomConfig } from "../interface/IRandomConfig";
import Utils from "../util/Utils";

/*
 * @Date: 2021-06-18 14:26:10
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-16 10:44:39
 * @description: 
 */
export default class RandomData{
    private _configArray:Array<IRandomConfig> = null
    constructor(){
        this.initArray()
    }

    private initArray():void{
        let randomConfig = Laya.loader.getRes("config/random.json")
        let array = new Array<IRandomConfig>()
        for (let key in randomConfig) {
            let element = randomConfig[key]
            array.push(element as IRandomConfig)
        }
        this._configArray = MathUtli.deepCopy(array)
    }

    /**
     * 
     * @returns 随机关卡数据
     */
    public createRandomNumber():Array<number>{  
        let array = []
        let length = this._configArray.length
        let time1 = new Date().getTime()
        for(let i:number = 0;i < length;i++){
            console.log("================随机第",i,"数据=================")
            let tempArray = this.createRandowByIndex(i)
            tempArray.push(12)
            // console.log("冲刺：12")
            array = array.concat(tempArray)
        }
        let time2 = new Date().getTime()
        console.log("=======================运行时间：",time2-time1,"===========================")
        return array
    }

    /**
     *  随机每一关卡数据
     * @param index 关卡
     */
    private createRandowByIndex(index:number):Array<number>{
        let levelConfig:IRandomConfig = this._configArray[index]
        let outArray:Array<number> = []
        //接受配置数据
        let totalTimes:number = levelConfig.totalTimes
        let randomTimesArray:Array<number> = levelConfig.randomTimes
        let randomArray:Array<Array<number>> = levelConfig.randomArray
        //用来随机的随机数组
        let randomArrayUse = this.getRandomArrayUse(randomArray)
        while(totalTimes){
            let randowIndex:number = MathUtli.randomInt(0,randomArrayUse.length -1)
            let outRandowValue:number = randomArrayUse[randowIndex] //随机出来的具体值
            // console.log("随机出数值：",outRandowValue)
            outArray.push(outRandowValue)
            for(let i:number = 0;i < randomArray.length;i++){
                let splitArray = randomArray[i]
                if(splitArray.indexOf(outRandowValue) > -1){//如果随机出来的数值在配置中的数组中，配置中的次数-1
                    randomTimesArray[i] -= 1
                    if(randomTimesArray[i] == 0){
                        randomArray.splice(i, 1)
                        randomTimesArray.splice(i,1)
                        randomArrayUse = this.getRandomArrayUse(randomArray) //splice返回的是删除的元素数组
                    }
                    break
                }
            }
            totalTimes -=1
        }
        return outArray
    }

    /**
     *  获取参与随机的数据
     * @param randomArray 
     * @returns 
     */
    private getRandomArrayUse(randomArray):Array<number>{
        let randomArrayUse:Array<number> = []
        for(let i:number = 0;i < randomArray.length;i++){
            let tempArray = randomArray[i]
            randomArrayUse = randomArrayUse.concat(tempArray)
        }
        return randomArrayUse
    }
}