import SoundManager from "../../../core/manager/SoundManager";
import TweenManager from "../../../core/manager/TweenManager";
import AABBShape from "../../../JFrameWork/3DPhysics/AABBShape";
import CollsionManagerThreeD from "../../../JFrameWork/3DPhysics/CollsionManagerThreeD";
import { CollisionMask } from "../../../JFrameWork/3DPhysics/ShapeThreeD";
import GameDesgin from "../../../JFrameWork/Game/GameDesgin";
import JTools from "../../../JFrameWork/JTools/JTools";
import ModuleCenter from "../../../ModuleCenter";
import GameObject from "../../../unityEngine/GameObject";
import Input from "../../../unityEngine/InPut";
import Time from "../../../unityEngine/Time";
import GlobalData from "../../data/GlobalData";
import { BaseSpawn } from "../../gameobject/BaseSpawn";
import { BuildSpawn } from "../../gameobject/BuildSpawn";
import { FishSpwan } from "../../gameobject/FishSpwan";
import HouseSpawn from "../../gameobject/HouseSpawn";
import { ObstacleSpawn } from "../../gameobject/ObstacleSpawn";
import Player from "../../gameobject/Player";
import GameModule from "../../module/game/GameModule";
import { Platform } from "../../platform/Platform";
import { VertexColor } from "../../Shader/VertexColor";




export default class GameScript extends Laya.Script {

    static instance: GameScript;
    scene: Laya.Scene3D;
    cureentZ = 0;
    speed = 0.12;
    baseSpeed = 0.12;

    addspeed = 0;
    jumpaddspeed = 0;
    /**关卡增加速度 */
    private _levelAddSpeed:number = 0
    spwans: BaseSpawn[] = [];
    playerPivot: Laya.Sprite3D;
    player:Player;
    obstacleSpawn:  ObstacleSpawn
    isPlay = false;
    static subSoundIsOk = false;
    camera: Laya.Camera;

    guiderz: number[] = [];
    guiderzIdx: number = 0;
    waitGuide = true;

    useSpwanobstacle = true;
    //  guiderz = -1;
    initOk = false;

    fastRunScore = 0;

    challengIdx = -1;

    canJump = false;

    private _gameModule:GameModule = null
    /**终点旗帜 */
    private qizi: Laya.Sprite3D;

    private _aniArray:Array<Laya.Sprite3D> = null
    onAwake() {
        // console.log("GameScript激活")
        GameScript.instance = this;
        this.scene = this.owner as Laya.Scene3D
        this._gameModule = ModuleCenter.instance.gameModule
        this.scene.addComponent(CollsionManagerThreeD);

        this._aniArray = []
        this.initSound()
        this.initSkyBox()
        this.addLevelEnd()
        this.camera = GameObject.Find(this.scene, 'PlayerPivot/Main Camera') as Laya.Camera;
        this.camera.transform.localPositionX = 0
        this.addPlayer()
    }

    public get aniArray():Array<Laya.Sprite3D>{
        return this._aniArray
    }

    private initOffsetEnd():number{
        let tempData = Laya.loader.getRes("config/model_"+ 12 +".json")
        let data = tempData["ed"]["model_"+12+"Table"]
        let arr = this.organizeData(data)
        return arr.length * 2
    }

    /**
    * 转换数据
    */
    private organizeData(data):Array<any>{
        let arr = []
        for (const key in data) {
            let element = data[key];
            arr.push(element)
        }
        return arr
    }

    /**
     * 初始化声音
     */
    private initSound():void{
        // SoundManager.instance.PlayGameBgm();
        //分包后的声音模块
        if (Platform.supportSubPackage() && GameScript.subSoundIsOk == false)
            Platform.loadSubpackage_Single('SoundGame', this, this.onSubpackgeLoadOk)
        if (Platform.supportSubPackage() == false)
            GameScript.subSoundIsOk = true;
    }

    /**
     * 初始化天空盒
     */
    private initSkyBox():void{
        let sky = GameObject.Find<Laya.MeshSprite3D>(this.scene, 'PlayerPivot/Sky');
        VertexColor.initShader();
        sky.meshRenderer.material = new VertexColor();
    }

    private _levelEndPos = [520,1240,2360,4080]
    private _endLevelObjectArray:Array<Laya.Sprite3D> = null
    /**
     * 添加阶段性终点
     */
    private addLevelEnd():void{
        if(this._endLevelObjectArray == null){
            this._endLevelObjectArray = []
        }
        let endResource = GameObject.Find<Laya.Sprite3D>(this.scene,"Resources/end")
        for(let i:number = 0; i < this._levelEndPos.length;i++){
            let end = Laya.Sprite3D.instantiate(endResource)
            let z = this._levelEndPos[i] - 120*0.2 + (GlobalData.isGuide?40:0);
            // console.log("终点坐标：",z)
            end.active = true
            end = this.addLevelEndCollsion(end)
            end.transform.position = new Laya.Vector3(0,0,z)
            this.scene.addChild(end)
            this._endLevelObjectArray.push(end)
        }
    }

    /**
     * 阶段性终点 添加碰撞
     */
    private addLevelEndCollsion(gameObject:Laya.Sprite3D):Laya.Sprite3D{
        let boxCollider = new AABBShape()
        boxCollider.mask = CollisionMask.End;
        boxCollider.collisionMask = 0;
        boxCollider.size = new Laya.Vector3(12, 5, 0.5);
        boxCollider.center = new Laya.Vector3(0, 3, 0);
        gameObject.addComponentIntance(boxCollider);
        return gameObject
    }

    /**移除终点站台 */
    private removeLevelEnd():void{
        for(let i:number = 0; i < this._endLevelObjectArray.length;i++){
            let element = this._endLevelObjectArray[i]
            element.removeSelf()
            element.destroy()
        }
        this._endLevelObjectArray = null
    }

    /**
     * 分包加载成功
     * @param isok 加载成功
     */
    private onSubpackgeLoadOk(isok) {
        GameScript.subSoundIsOk = true;
        if (isok && this.isPlay)
            SoundManager.instance.PlayGameBgm();
    }

    onStart() {
        this.addBuild()
        this.addHouse()
        this.addObstacle()
        this.initOk = true;
    }

    private addBuild():void{
        let bulidjsonStr = '{"findRoot":"Resources/BuildItem","spwanItemDatas":[{"goName":"IndustrialWarehouse01","length":20},{"goName":"IndustrialWarehouse03","length":20}],"startCreateZ":0.0,"CreateLength":100.0,"recoverOffset":-15.0}';
        let buildSpwan = new BuildSpawn();
        buildSpwan.spwanConfigObj = JSON.parse(bulidjsonStr);
        buildSpwan.scene = this.scene;
        this.scene.addComponentIntance(buildSpwan);
        this.spwans.push(buildSpwan);
    }

    /**
     * 初始化旗帜位
     */
    private initFinishFlag():void{
        this.qizi = GameObject.Find(GameScript.instance.scene, 'beibaiqi') as Laya.Sprite3D;
        this.qizi.active = false;
    }

    /**
     * 添加鱼
     */
    private addSpwanFish():void{
        if (GameDesgin.spwanFish) {
            let fishjsonStr = '{"findRoot":"Resources/items","spwanItemDatas":[{"goName":"Fish","length":1.0}],"startCreateZ":30.0,"CreateLength":100.0,"recoverOffset":-5.0}';
            let fishSpwan = new FishSpwan();
            fishSpwan.spwanConfigObj = JSON.parse(fishjsonStr);
            fishSpwan.scene = this.scene;
            this.scene.addComponentIntance(fishSpwan);
            this.spwans.push(fishSpwan);
        }
    }

    /**
     * 添加路障
     */
    private addObstacle():void{
        if (GameDesgin.spwanObstacle) {
            let obstaclejsonStr = '{"findRoot":"Resources/items","spwanItemDatas":[' +
                '{"goName":"jiasu","length":2},' +
                '{"goName":"jinbi","length":2},' +
                '{"goName":"jinche","length":4},' +
                '{"goName":"chonglangban","length":2},'+
                '{"goName":"xiahualangan","length":2},'+
                '{"goName":"shangche","length":4},'+
                '{"goName":"dabache","length":18},'+
                '{"goName":"dabacheding","length":18},'+
                '{"goName":"huapo","length":6},'+
                '{"goName":"guanggaopai","length":4},'+
                '{"goName":"jiazi","length":3},'+
                '{"goName":"ludeng","length":4},'+
                '{"goName":"xiaofangshuan","length":1},'+
                '{"goName":"lajitong","length":1.5},'+
                '{"goName":"clbani_r","length":2},'+
                '{"goName":"clbani_l","length":2}'+
            '],"startCreateZ":0.0,"CreateLength":100.0,"recoverOffset":-10.0}'
            let p_ObstacleSpawn = new ObstacleSpawn();
            p_ObstacleSpawn.spwanConfigObj = JSON.parse(obstaclejsonStr);
            p_ObstacleSpawn.scene = this.scene;
            this.scene.addComponentIntance(p_ObstacleSpawn);
            this.spwans.push(p_ObstacleSpawn);

            this.obstacleSpawn = p_ObstacleSpawn;
        }
    }

    /**
     * 添加房子
     */
    private addHouse():void{
        let obstaclejsonStr = '{"findRoot":"Resources/house","spwanItemDatas":' +
        '[{"goName":"fangzi1","length":16},' + 
        '{"goName":"fangzi2","length":17},' + 
        '{"goName":"fangzi3","length":18},' + 
        '{"goName":"fangzi4","length":10}, '+
        '{"goName":"fangzi5","length":10},'+
        '{"goName":"fangzi6","length":12}],'+
        '"startCreateZ":0.0,"CreateLength":100.0,"recoverOffset":-5.0}'
        let p_ObstacleSpawn = new HouseSpawn(1);
        p_ObstacleSpawn.spwanConfigObj = JSON.parse(obstaclejsonStr);
        p_ObstacleSpawn.scene = this.scene;
        this.scene.addComponentIntance(p_ObstacleSpawn);
        this.spwans.push(p_ObstacleSpawn);

        let p_ObstacleSpawn_right = new HouseSpawn(-1);
        p_ObstacleSpawn_right.spwanConfigObj = JSON.parse(obstaclejsonStr);
        p_ObstacleSpawn_right.scene = this.scene;
        this.scene.addComponentIntance(p_ObstacleSpawn_right);
        this.spwans.push(p_ObstacleSpawn_right);
    }

    private _test:Laya.Sprite3D
    /**
     * 添加主角
     */
    private addPlayer():void{
        this.playerPivot = this.scene.getChildByName('PlayerPivot') as Laya.Sprite3D;
        let charater = GameObject.Find<Laya.Sprite3D>(this.scene, 'PlayerPivot/charater')
        this.playerPivot.transform.position = new Laya.Vector3(0,0,0)
        charater.transform.position = new Laya.Vector3(0,0,-3.5)
        this.player = charater.addComponent(Player);
        // console.log("this.z",this.cureentZ)
        this._test = charater
    }

    startGmae() {

        //复活
        if (this.player.rebornRead) {
            this.player.StartRun();
            //配合起跑动作,30fps,90 key game 60=90*2
            Laya.timer.frameOnce(90 * 2 + 20, this, () => {
                this.isPlay = true;
                this.speed = this.baseSpeed;
                GameScript.instance.setLevelAddSpeed(false,false)
                this.player.rebornRead = false;
            });
            if (GameScript.subSoundIsOk)
                SoundManager.instance.PlayGameBgm();
            return;
        }
        this.player.StartRun();

        //配合起跑动作,30fps,90 key game 60=90*2
        Laya.timer.frameOnce(90 * 2 + 20, this, () => { //延迟执行开跑
            this.isPlay = true;
            GameScript.instance.setLevelAddSpeed(false,false)
        });

        if (GameScript.subSoundIsOk)
            SoundManager.instance.PlayGameBgm();
        //Laya.timer.once(2200,this,()=>{this.isPlay=true});
    }

    private _levelSpeed:Array<number> =[0.02,0.05,0.08,0.15,0.48] // [0.02,0.05,0.08,0.15,0.48]// [1,1.2,1.8,1.8,0.48] //
    /**关卡级数 */
    private _level:number = 0;

    /**
     * 设置加速
     */
    public setLevelAddSpeed(reset:boolean,levelUp:boolean = false):void{
        if(reset){
            this._levelAddSpeed = 0
        }else{
            if(levelUp){
                this._level += 1
            }
            this._levelAddSpeed = this._levelSpeed[this._level]
            // console.log("关卡速度：",this._levelAddSpeed)
        }
    }

    /**
     * 
     * @returns 当前关卡
     */
    public getLevel():number{
        return this._level
    }

    isfadeToIdel = false
    onUpdate() {
        // if(GlobalData.gameOver){
        //     return
        // }
        if (this.isPlay) {
            if (this.speed <= 0) this.speed = 0;
            let combineSpeed = (this.speed + this.addspeed + this.jumpaddspeed + this._levelAddSpeed) * Time.deltaTime * 50;
            // console.log(combineSpeed);
            // if (combineSpeed <= 0.01 && this.isfadeToIdel == false && this.challengeOk) {
            //     this.isfadeToIdel = true;
            //     this.player.ChallenggeCrossFadeIdel();
                // ViewMgr.instance.OpenChallengeEnd();
                //TODO:挑战模式
                // let challengeModule = ModuleManager.instance.getModule(ChallengeEndModule)
                // challengeModule.openWindow()
            // }
            // console.log("combineSpeed:",combineSpeed)
            this.cureentZ += combineSpeed;
            //引导
            // console.log("引导坐标：",this.cureentZ,this.guiderz[this.guiderzIdx])
            if (GlobalData.isGuide && this.challengIdx == -1 && this.guideAcionOk == false && this.cureentZ >= this.guiderz[this.guiderzIdx]) {
                this.cureentZ = this.guiderz[this.guiderzIdx];
                if (this.waitGuide) {
                    this.player.StartGuider(this.guiderzIdx);
                    if (this.guiderzIdx == 1) {
                        this._gameModule.DoShowGuideFinger(1);
                    } else if (this.guiderzIdx == 0) {
                        this._gameModule.DoShowGuideFinger(0);
                    }
                }
                this.waitGuide = false;
            }
            // if(this.cureentZ > 4120){
            //     GlobalData.gameOver = true
            //     this.player.gameOver()
            //     return
            // }
        }

        for (let index = 0; index < this.spwans.length; index++) {
            this.spwans[index].currentZ = this.cureentZ; //创建Z的坐标
        }
        if(this.aniArray.length == 0) return
        for(let i:number = 0;i < this.aniArray.length;i++){
            let element = this.aniArray[i]
            let z1 = element.transform.localPositionZ
            let z2 = this.cureentZ
            let distence = z1 - z2
            if(distence < 7.5){
                // console.log(z1,z2)
                let ani = element.getChildAt(0).getComponent(Laya.Animator) as Laya.Animator;
                ani.play("ani")
                this.aniArray.splice(i,1)
                return
            }
        }
    }

    challengeOk = false;
    onLateUpdate() {
        let pos = this.playerPivot.transform.position;
        pos.z = this.cureentZ;
        this.playerPivot.transform.position = pos;

    }

    //猫吃到鱼时+1且更新UI
    playerEatFish() {
        this._gameModule.model.fishCount += 1
        SoundManager.instance.FishCollection.Play();
    }

    NextGuide() {
        this.guiderzIdx += 1;
        this.waitGuide = true;
        this._gameModule.ClearFinger();
    }

    guideAcionOk = false;
    WaitGuiEnd() {
        this.guideAcionOk = true;
        this._gameModule.ClearFinger();
    }

    GuideOk() {
        GlobalData.isGuide = false;
        this._gameModule.model.guideOK();
        // console.log('GuideOk');
        this._gameModule.ClearFinger();
    }

    onDestroy(){
        GameScript.instance = null;
        this.removeLevelEnd()
        this.player.destroy()
        this.player = null
        this.destoryAABB()
    }

    /**
     * 移除碰撞盒组件
     */
    private destoryAABB():void{
        for(let i:number = 0;i < this.spwans.length;i++){
            let element = this.spwans[i]
            element.recoverAll()
            element.destroy()
            element = null
        }
    }
}