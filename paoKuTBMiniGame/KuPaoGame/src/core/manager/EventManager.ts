/*
 * @Date: 2021-06-08 10:55:02
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-09 14:41:59
 * @description: 
 */
export class EventManager extends Laya.EventDispatcher {

    private static _instance:EventManager;

    private _fullName: string;

    //get 的用法
    public static get instance(): EventManager {   
        
        if (EventManager._instance==null)EventManager._instance=new EventManager();

        return EventManager._instance;
    }

}