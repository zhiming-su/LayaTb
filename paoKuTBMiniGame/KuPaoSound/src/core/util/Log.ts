/*
 * @Date: 2021-05-18 10:40:10
 * @Author: xulinchao
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-03 20:07:07
 * @description: 
 */
export default class Log {
    private static enable:boolean=true;
    private static group:string = "KuPaoGameDebug------>"
    public static set Enable(value:boolean){
        this.enable = value;
    }
    public static log(...message:any[]):void
    {   
        if(this.enable==false)return;
        console.log(this.group,message)
    }
}