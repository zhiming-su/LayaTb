/*
 * @Date: 2021-07-12 14:34:19
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-19 20:50:57
 * @description: 
 */
export default class GlobalData{
    /**是否需要新手引导 */
    public static isGuide:boolean = false
    /**是都需要初始化 */
    public static isInit:boolean = true
    /**游戏结束 */
    public static gameOver:boolean = false
    /**猫跑步速度 */
    public static catRunSpeeds:Array<number> = [0.25,0.3,0.35,0.45]
    /**是否打开声音 */
    public static isOpenSound:boolean = true

    public static isBaoXiang:boolean = false
}