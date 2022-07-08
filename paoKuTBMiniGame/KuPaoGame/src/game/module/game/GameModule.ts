import BaseModule from "../../../core/base/BaseModule"
import Scene3DLayer from "../../../core/base/layer/Scene3DLayer"
import LayerManager from "../../../core/manager/LayerManager"
import SoundManager from "../../../core/manager/SoundManager"
import TweenManager from "../../../core/manager/TweenManager"
import JTools from "../../../JFrameWork/JTools/JTools"
import ModuleCenter from "../../../ModuleCenter"
import DataChangeEvent from "../../data/DataChangeEvent"
import GlobalData from "../../data/GlobalData"
import ProgressBarMasK from "../../scripts/component/progress/ProgressBarMasK"
import GameScript from "../../scripts/game/GameScript"
import GameModel from "./GameModel"
import GameView from "./GameView"

/*
 * @Date: 2021-06-08 19:41:39
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-17 18:31:05
 * @description: 
 */
export default class GameModule extends BaseModule{
    private _controllView:GameView = null
    private hitfontIdx = 1;
    private _scene:Laya.Scene3D = null

    /**资源加载进度 */
    private progress:(value)=>void
    constructor(){
        super()
    }

    protected addView():void{
        this._view = new GameView()
        this._controllView = this._view as GameView
    }

    protected addModel():void{
        this._model = new GameModel()
    }

    public get model():GameModel{
        return this._model as GameModel
    }

    protected open():void{
        this.addEvent()
        this.loadScene3D()
        this.initScore()
    }

    public setCallBack(callback):void{
        this.progress = callback
    }
    /**
     * 添加监听
     */
    private addEvent():void{
        this._model.on(DataChangeEvent.SCORE_CHANGE,this,this.scoreChange)
        this._model.on(DataChangeEvent.FISH_COUNT_CHANGE,this,this.fishCountChange)
        this._controllView.voice.on(Laya.Event.CLICK, this,this.changeVoiceState)
    }

    /**
     * 移除监听
     */
     private removeEvent():void{
        this._model.off(DataChangeEvent.SCORE_CHANGE,this,this.scoreChange)
        this._model.off(DataChangeEvent.FISH_COUNT_CHANGE,this,this.fishCountChange)
        this._controllView.voice.off(Laya.Event.CLICK, this,this.changeVoiceState)
    }

    /**
     * 切换声音状态
     */
    private changeVoiceState():void{
        GlobalData.isOpenSound = !GlobalData.isOpenSound
        if(GlobalData.isOpenSound){
            this._controllView.voice.skin = "game/voice.png"
            SoundManager.instance.PlayGameBgm()
        }else{
            this._controllView.voice.skin = "game/voice_close.png"
            SoundManager.instance.stopBgm()
        }    
    }

    /**
     *  鱼的数量发生变化
     * @param value 
     */
    private fishCountChange(value):void{
        if(this._controllView.fishfont){
            this._controllView.fishfont.value = value
        }
    }

    /**
     * 积分发生变化
     */
    private scoreChange(value):void{
        if(this._controllView.score){
            this._controllView.score.value = value
        }
    }

    private loadScene3D():void{
        Laya.Scene3D.load("res3d/Game.ls",Laya.Handler.create(this,this.onGameSceneLoadOk),Laya.Handler.create(this,this.onProgress))
    }

    private onProgress(value):void{
        this.progress(value)
    }
    
    private _countDownTime:number = 3
    /**
    * 游戏场景加载完毕
    */
    private onGameSceneLoadOk(scene:Laya.Scene3D):void{
        ModuleCenter.instance.openLoadingView(false)
        LayerManager.instance.getLayer(Scene3DLayer).addChild(scene)
        this._scene = scene
        this.createGameScene()
        Laya.timer.once(600,this,this.startGame)
    }
    
    private startGame():void{
        this._countDownTime = 3
        this._controllView.timeImage.alpha = 1
        this._controllView.timeImage.scale(1,1)
        this._controllView.timeImage.visible = true
        this._controllView.showTimeImage(this._countDownTime)
        Laya.timer.loop(1000,this,this.countDown)
    }

    private countDown():void{
        // console.log("倒计时：",this._countDownTime)
        this._countDownTime -= 1
        if(this._countDownTime == 0){
            Laya.timer.clear(this,this.countDown)
            this._controllView.timeImage.visible = false
            this.startboxClick()
            return
        }
        this._controllView.showTimeImage(this._countDownTime)
    }

    private createGameScene():void{
        this._scene.addComponent(GameScript)
    }
    
    /**
     * 读取缓存分数
     */
    private initScore():void{
        //分数系统,数据持久化读写，迎合U3D开发者
        this.fishCountChange(0)
    }
    
    public showView():void{
        this._view.visible = true
    }

    public hideView():void{
        this._view.visible = false
    }

    private startboxClick() {
        if (GameScript.instance == null || GameScript.instance.initOk == false) return;
        GameScript.instance.startGmae();
        // SoundManager.instance.startGame.PlayByNum(1);
        console.log("开始游戏")
    }

    public hideFishAndScore():void{
        this._controllView.fishfont.visible = false;
    }

    public reborn():void{
        this._controllView.fishfont.visible = true;
        this.startGame()
        // this._controllView.score.visible = true;
    }
    
    ClearFinger() {
        TweenManager.instance.clearAll(this._controllView.finger);
        this._controllView.finger.visible = false;
        this._controllView.arrowFlashesAni.visible = false
    }

    /**type 0=up 1 down 2= right 3=left 4 =click*/
    DoShowGuideFinger(type) {
        this._controllView.finger.visible = true;
        this._controllView.arrowFlashesAni.visible = true
        let centerX = this._controllView.width * 0.5;
        let centerY = this._controllView.height * 0.5;
        if (type == 0) {
            this._controllView.finger.y = centerY + 300;
            this._controllView.finger.x = centerX;
            this._controllView.arrowFlashesAni.play()
            TweenManager.instance.toPositionRePlay(this._controllView.finger, new Laya.Vector2(centerX, centerY), 800);
        }
        if (type == 1) {
            this._controllView.finger.y = centerY - 150;
            this._controllView.finger.x = centerX;
            this._controllView.arrowFlashesAni.scaleY = -1
            TweenManager.instance.toPositionRePlay(this._controllView.finger, new Laya.Vector2(centerX, centerY + 150), 800);
        }
        if (type == 2) {
            this._controllView.finger.y = centerY;
            this._controllView.finger.x = centerX - 250;
            TweenManager.instance.toPositionRePlay(this._controllView.finger, new Laya.Vector2(centerX + 250, centerY), 1000);
        }
        if (type == 3) {
            this._controllView.finger.y = centerY;
            this._controllView.finger.x = centerX + 250;
            TweenManager.instance.toPositionRePlay(this._controllView.finger, new Laya.Vector2(centerX - 250, centerY), 1000);
        }
        if (type == 4) {
            this._controllView.finger.y = centerY;
            this._controllView.finger.x = centerX;
            TweenManager.instance.toScaleRePlay(this._controllView.finger, new Laya.Vector2(1.2, 1.2), 1000);
        }
    }
    
    public uninitialize():void{
        this.removeEvent()
        let script = this._scene.getComponent(GameScript) as GameScript
        script.destroy()
        if(this._controllView){
            this._controllView.closeView(true)
            this._controllView = null
        }
        super.uninitialize()
    }
}