import PlayerPrefs from "../../unityEngine/PlayerPrefs";
import PlatformData from "./PlatformData";

/*
 * @Date: 2021-06-07 15:10:03
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-30 15:41:49
 * @description: 
 */
export class Platform {
    public static commonData: PlatformData = new PlatformData();

    /**
     *  是否支持分包
     * @returns true 支持分包  false 不支持分包
     */
    static supportSubPackage(): boolean {
        if (this.commonData.onplatformTT) {
            console.log("不支持分包")
            return false;
        }
        else if (this.commonData.onplatformWX) {
            console.log('onplatformWX');
            return true;
        }
        else if (Laya.Browser.onVVMiniGame) {
            //引擎版本1052开始支持
            //整个小游戏的所有分包及主包大小不超过8M
            //http://minigame.vivo.com.cn/documents/#/lesson/base/subpackage?id=%e5%88%86%e5%8c%85%e5%8a%a0%e8%bd%bd
            //因为低版本的VIVO不支持分包，所以为了
            return true;
        }
        else if (Laya.Browser.onQGMiniGame) {
            //Failed to invoke FileSystemManager_readFile
            //现在阶段有bug,所以不使用
            return false;
        } else if (Laya.Browser.onQQMiniGame) {
            return true;
        }
        else {
            return false;
        }
    }

     /**onProgressUpdateObj.progress 成员接受回调 */
     static loadSubpackage_Single(wxSubloadNameJson: string, callder, callbackFunc: Function): _LoadSubpackageTask {
        //头条不支持
        if (this.commonData.onplatformTT) {
            console.error('不支持分包')
        }
        //微信平台
        else if (Laya.Browser.onMiniGame) {  
            let LoadSubpackageTask: _LoadSubpackageTask = wx['loadSubpackage']({
                name: wxSubloadNameJson,
                success: function (res) {
                    console.log(wxSubloadNameJson + " 分包加载成功");
                    // callbackFunc.call(res, callder, true);
                    callbackFunc.apply(callder, [true]);
                },
                fail: function (res) {
                    console.error(wxSubloadNameJson + "分包加载失败");
                    callbackFunc.apply(callder, [false]);
                }
            })
            return LoadSubpackageTask;
        }  //qq
    }

    static isPlayVibrate(): boolean {
        return PlayerPrefs.GetInt('Vibrate', 1) == 1;
    }

    static setPlayVibrate(isPlayVibrate: boolean) {
        PlayerPrefs.SetInt('Vibrate', isPlayVibrate ? 1 : 0);
    }

     //长震动
     public static vibrateLong() {
        if (Platform.isPlayVibrate()) {

            if (this.commonData.onplatformWX) {
                let obj: _vibrateLongObject = {
                    success: function () { },
                    fail: function () { },
                    complete: function () { }
                };
                window['wx'].vibrateLong(obj);
            }
            else if (this.commonData.onplatformTT) {
                //GameSample.commonData.windowTT.vibrateLong(null);
                this.commonData.windowTT.vibrateLong({
                    success(res) {
                        console.log(`${res}`);
                    },
                    fail(res) {
                        console.log(`vibrateLong调用失败`);
                    },
                });
            }
            else if (Laya.Browser.onQGMiniGame || Laya.Browser.onVVMiniGame) {

                let obj: _vibrateLongObject = {
                    success: function () { },
                    fail: function () { },
                    complete: function () { }
                };
                qg.vibrateLong(obj);
                console.log('qg.vibrateLong')
            } else if (Laya.Browser.onQQMiniGame) {
                let obj: _vibrateLongObject = {
                    success: function () { },
                    fail: function () { },
                    complete: function () { }
                };
                window['qq'].vibrateLong(obj);
            } else {

                if (Laya.Browser.window['qg'] == null) return;
                if (Laya.Browser.window['qg'].vibrateLong == null) return;

                let obj: _vibrateLongObject = {
                    success: function () { },
                    fail: function () { },
                    complete: function () { }
                };
                qg.vibrateLong(obj);
            }
        }
    }

    public static showToast(msg) {
        if (this.commonData.OnPc) {
            // ViewMgr.instance.FolatTip(msg);
            return;
        }
        if (this.commonData.onplatformTT) {
            this.commonData.windowTT.showToast({
                title: msg,
                duration: 2000,
                success(res) {
                    //  console.log(`${res}`);
                },
                fail(res) {
                    //  console.log(`showToast调用失败`);
                }
            });
        } else if (this.commonData.onplatformWX) {
            let object: _showToastObject = {
                title: msg, icon: '', image: '', duration: 1500,
                success: () => { }, fail: () => { }, complete: () => { }, mask: false
            };
            qg.showToast(object);
        } else if (Laya.Browser.onVVMiniGame) {

            let object: _showToastObject = {
                title: msg, icon: '', image: '', duration: 1500,
                success: () => { }, fail: () => { }, complete: () => { }, mask: false
            };
            window["qg"].showToast(object);
        } else if (Laya.Browser.onQGMiniGame) {
            console.log('oppo showToast', msg);
            let object: _showToastObject = {
                title: msg, icon: '', image: '', duration: 1500,
                success: () => { }, fail: () => { }, complete: () => { }, mask: false
            };
            window["qg"].showToast(object);
        }

    }
}