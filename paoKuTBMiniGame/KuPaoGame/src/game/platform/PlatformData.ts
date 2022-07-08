/*
 * @Date: 2021-06-07 15:11:57
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-07 15:12:08
 * @description: 
 */
export default class PlatformData {
    //开发者工具模式
    public devtools = false;
    /**头条 */
    public onplatformTT = false;
    /**微信 */
    public onplatformWX = false;
      /**头条平台对象 */
    public windowTT: any;
       /**微信平台对象 */
    public windowWX: any;
    public OnIOS = false;
    public OnPc = false;
    public OnAndroid = false;
    launchOptions: any = {};
}