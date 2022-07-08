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