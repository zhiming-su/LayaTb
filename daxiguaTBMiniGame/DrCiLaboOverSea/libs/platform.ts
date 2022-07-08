/**
 * 游戏数据接口
 */
declare interface Platform {

    /**
     * 初始化活动数据
     */
    doInitActivity(): Promise<any>;

    /**
     * 游戏结束分数记录
     * @param gold 
     */
    updateScore(score: number): Promise<any>;
    
    /**
     * 再玩一次
     */
    getRest(): Promise<any>;

    /**
     * 返回首页
     */
    goHome(): void;

    /**
     * 播放音效
     * @param url 
     */
    playSound(url: string): void;


    /**
     * 播放背景音乐
     * @param url 
     */
    playMusic(url: string): Object;

}

declare let platform: Platform;
declare interface Window {
    platform: Platform
}