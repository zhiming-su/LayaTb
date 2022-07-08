/*
 * @Date: 2021-07-12 11:18:39
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-12 13:46:30
 * @description: 
 */
export default class TimeUtil{
    private static _instance:TimeUtil = null
    private constructor(){

    }

    public static get instance():TimeUtil{
        if(this._instance == null){
            this._instance = new TimeUtil()
        }
        return this._instance
    }

    public toTimeStamp(date:string):number{
        let tempDate = new Date(date)
        return tempDate.getTime()
    }
    
}