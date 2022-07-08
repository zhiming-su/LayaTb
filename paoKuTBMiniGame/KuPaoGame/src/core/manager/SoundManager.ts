/*
 * @Date: 2021-06-08 10:53:08
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-17 18:56:56
 * @description: 
 */
//封装功能
//小程序后台切换前台播放音乐，苹果拉起菜单返回后播放声音

import GlobalData from "../../game/data/GlobalData";
import PlatformData from "../../game/platform/PlatformData";
import PlayerPrefs from "../../unityEngine/PlayerPrefs";
import Time from "../../unityEngine/Time";
import { EventType } from "../event/EventType";
import { EventManager } from "./EventManager";

//假如vivo没有实现播放广告视频后停止背景音乐，提审将会被驳回
export default class SoundManager {

    private static minstance: SoundManager

    public static get instance() {
        if (SoundManager.minstance == null) SoundManager.minstance = new SoundManager();
        return SoundManager.minstance;
    }


    readonly bgmurl = 'sound/main/bgm.mp3';

    readonly bgmurl2 = 'sound/bgm.mp3';

    readonly clcik = new AudioClip('res/sound/main/click.mp3', 0);
    //最小播放间隔0.5秒，播放频率太高会对性能有影响
    readonly FishCollection = new AudioClip('sound/FishCollection.mp3', 0.5);

    readonly CatDeath = new AudioClip('sound/CatDeath.mp3', 1);

    readonly CatJump = new AudioClip('sound/CatJump.mp3', 0);


    readonly BuyOk = new AudioClip('res/sound/main/buyItem.mp3', 0);
    //Laya.SoundManager.playSound(this._pathRoot + name + ".mp3");
    readonly wineffect = new AudioClip('sound/jiasu.mp3', 0);

    readonly powerUp = new AudioClip('res/sound/game/powerUp.mp3', 0);

    readonly starAward = new AudioClip('res/sound/game/starAward.mp3', 0);

    readonly startGame = new AudioClip("sound/starAward.mp3", 0)

    hit = new AudioClip('sound/hit.mp3', 0.3);
    
    constructor() {
        //广告视频关闭后重新播放声音 只有vivo需要
        EventManager.instance.on(EventType.AD_VIDEO_CLOSE_EVENT, this, this.onAD_VIDEO_CLOSE_EVENT);
        //微信onshow时恢复声音
        EventManager.instance.on(EventType.WxOnShow, this, this.ReSumeBgm);
    }


    static isPlaySound(): boolean {
        return GlobalData.isOpenSound
    }

    static setPlaySound(isPlaySound: boolean) {
        PlayerPrefs.SetInt('PlaySound', isPlaySound ? 1 : 0);
    }

    curbgm_SoundChannel: Laya.SoundChannel;



    onAD_VIDEO_CLOSE_EVENT() {
        //if (Laya.Browser.onVVMiniGame)
        this.ReSumeBgm();
    }

    play(url: string) {
        // console.log("sssssssssssssssssssssssssss");
        let isPlaySound = SoundManager.isPlaySound();
        if(!isPlaySound) return 
        if(Laya.Browser.onTBMiniGame){
            // window.platform.playSound(url)
        }else{
            Laya.SoundManager.playSound(url, 1);
        }
    }

    PlayOneShot(url: string) {

        if (SoundManager.isPlaySound()) {
            if(Laya.Browser.onTBMiniGame){
                // window.platform.playSound(url)
            }else{
                Laya.SoundManager.playSound(url, 1);
            }            
        }
    }

    PlayByNum(url: string,n) {

        if (SoundManager.isPlaySound()) {
            if(Laya.Browser.onTBMiniGame){
                // window.platform.playSound(url)
            }else{
                Laya.SoundManager.playSound(url, n);
            }
        }
    }

    BgmPlay() {
        this.PlayBgm(this.bgmurl, true);
    }

    PlayGameBgm() {

        // this.BgmPlaySwitch();
        this.PlayBgm(this.bgmurl2, true);
    }

    /**停止BGM */
    stopBgm():void{
        if(Laya.Browser.onTBMiniGame){
            this._music.stop()
        }
    }
    
    BgmPlaySetting() {
        this.PlayBgm(this.bgmurl, true);

    }

    /**后台从前台恢复声音 */
    public ReSumeBgm() {
        console.log('ReSumeBgm');
        //if (LayaSample.commonData.subpackage_sound_LoadOk == false) return;
        // if (LayaSample.commonData.wxUpWake == false) return;
        let isPlaySound = SoundManager.isPlaySound();
        if (!isPlaySound && this.curbgm_SoundChannel != null) return;
        {
            // Laya.SoundManager.playMusic(this._pathRoot + "bgm.mp3", 0);
            this.curbgm_SoundChannel.resume();
        }

    }

    public pauseBgm() {
        if (this.curbgm_SoundChannel != null)
            this.curbgm_SoundChannel.pause();
    }

    prebgmurl = "";
    private _music = null
    PlayBgm(url: string, loop: boolean) {
        if(Laya.Browser.onTBMiniGame){
            let isPlaySound = SoundManager.isPlaySound();
            if(!isPlaySound) return 
            if(this._music == null){
                this._music = window.platform.playMusic(url,loop)
            }else{
                this._music.play()
            }
        }else{
            
            if (this.prebgmurl != url)
                this.curbgm_SoundChannel = null;

            let isPlaySound = SoundManager.isPlaySound();
            console.log('isPlaySound=' + isPlaySound);
            if (isPlaySound) {
                console.log('PlayBgm');
                let num = 1;
                if (loop) num = 0;
                //使用缓存变量，防止ios上第二次播放音乐不了的问题
                if (this.curbgm_SoundChannel == null) {
                    let channel = Laya.SoundManager.playMusic(url, num);
                    this.curbgm_SoundChannel = channel;
                }
                else
                    this.curbgm_SoundChannel.play();
            }
        }
    }
}

//方便调用的数据结构
export class AudioClip {
    url: string;
    preTime = 0;
    minRate = 0;
    public constructor(p_url: string, pminRate) {
        this.url = p_url;
        this.minRate = pminRate;

    }

    public Play() {

        if (Time.time - this.preTime < this.minRate)
            return;

        SoundManager.instance.PlayOneShot(this.url);
        this.preTime = Time.time;
    }

    public PlayByNum(n:number) {

        if (Time.time - this.preTime < this.minRate)
            return;

        SoundManager.instance.PlayByNum(this.url,n);
        this.preTime = Time.time;
    }

}