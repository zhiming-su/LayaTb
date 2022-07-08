# LayaTb
laya to tb app
laya开发版本用2.8的，创建的空白项目debug.js有问题，需要替换官方模板项目里的js
laya接口开发给淘宝
1.需要再代码模式下，把libs/文件夹下添加paltformd.ts
/*
 * @Date: 2021-06-30 14:32:12
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-19 21:07:08
 * @description: 
 */
/**
 * 游戏数据接口
 */
declare interface Platform {
    /**
     * 初始化活动数据
     */
    doInitActivity(): Promise<any>;

    /**
     * 游戏结束 数据上传
     * @param gold 分数
     * @param resurrectionCards 复活卡数
     * @param commodityIds 收藏的商品ID
     */
    updateGold(gold: number, resurrectionCards: number, commodityIds: Array<number>): Promise<any>;

    /**
     * 再玩一次
     */
    getRest(): Promise<any>;

    /**
     * 正常返回首页
     */
    goHome(): void;

    /**
     * 宝箱版本返回首页
     * @param overType 
     * @param score 
     */
    goBoxHome(overType: boolean, score: number): void;
    
    /**
     * 收藏商品
     * @param commodityId 商品ID
     */
    goodsCollected(commodityId: number): Promise<any>;

    /**
     * 播放音效
     * @param url 文件地址
     */
    playSound(url: string): void;

    /**
     * 播放背景音乐
     * @param url 地址
     * @param loop 是否循环
     */
    playMusic(url: string, loop: boolean): any;

}

declare let platform: Platform;
declare interface Window {
    platform: Platform
}


2.编辑bin/index.js文件，添加需要的js文件
loadLib("js/platform.js")
3.在bin/js下，创建platform.js文件，这个是暴漏给淘宝的接口文件
/**
 * 游戏测试数据接口文件
 */


class TbgamePlatform {
  
    /**
     * 返回首页
     */
     goHome() {
        console.log("go Home")
    }
   


}

var window = window;
window.platform = new TbgamePlatform();

4.以上完成后就可以直接在layaIDE下运行了，
5.项目发布，发布排除!$basePath/js/platform.js文件，等项目打包完成后，在手动复制到目录文件夹下
6.编辑打包好的下程序文件index.js
require("./js/bundle.js"),delete require.cache[require.resolve("./js/platform.js")];
require("./js/platform.js");
这样就可以直接运行了
