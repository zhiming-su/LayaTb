/*
 * @Date: 2021-06-18 14:56:29
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-18 14:58:01
 * @description: 
 */
export interface IRandomConfig{
    /**总随机次数 */
    totalTimes:number
    /**随机数 */
    randomArray:Array<Array<number>>
    /**随机次数 */
    randomTimes:Array<number>
}