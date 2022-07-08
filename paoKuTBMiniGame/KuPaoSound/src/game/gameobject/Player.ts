import MonoBehaviour from "../../unityEngine/MonoBehaviour";
import AABBShape from "../../JFrameWork/3DPhysics/AABBShape";
import { CollisionMask } from "../../JFrameWork/3DPhysics/ShapeThreeD";
import PlayerPrefs from "../../unityEngine/PlayerPrefs";
import { EventType } from "../../core/event/EventType";
import SoundManager from "../../core/manager/SoundManager";
import { Platform } from "../platform/Platform";
import Input from "../../unityEngine/InPut";
import Time from "../../unityEngine/Time";
import GameObject from "../../unityEngine/GameObject";
import { EventManager } from "../../core/manager/EventManager";
import Mathf from "../../UnityEngine/Mathf";
import GameModule from "../module/game/GameModule";
import ModuleCenter from "../../ModuleCenter";
import GameScript from "../scripts/game/GameScript";
import MathUtli from "../../core/util/MathUtli";
import ModuleManager from "../../core/manager/ModuleManager";
import { Obstacle } from "./ObstacleSpawn";
import GlobalData from "../data/GlobalData";

//MonoBehaviour 是框架类，默认拥有gameObject和transform属性 
export default class Player extends MonoBehaviour {

    canJump = true;
    localx = 0;
    animator: Laya.Animator;
    aabbshape: AABBShape;
    isdeath = false;
    cat: Laya.Sprite3D;
    private _endEffect:Laya.Sprite3D = null
    private _goldEffect:Laya.Sprite3D = null
    private _addSpeedEffect:Laya.Sprite3D = null
    guiderIdx = -1;

    jumpy = 0;
    readBigJump = 0;
    fasRunTime = 0;
    // isJump = false;

    IsFastRun = false;
    // winEffect: Laya.Sprite3D;
    IsWudi = false;
    cameraAnimator: Laya.Animator;
    cameraAnimatorTrs: Laya.Transform3D;

    curstarPower = 0;
    initOk = false;
    actionLeft = 2;
    actionRight = 3;
    actionUp = 0;
    actionDown = 1;
    actionSamllJump = 4;
    UIhitEffect: Laya.Node;
    challengeEnd = false;
    fanzhuanyidong = false;

    public _gameModule:GameModule;

    private readonly _moveX:number = 3.1
    onAwake() {
        super.onAwake();
        this._gameModule = ModuleCenter.instance.gameModule

        //型的骨骼和部件一定要绑定一致。相同骨骼的部件才可以替换
        // let raccoonBase=GameObject.Find(GameScript.instance.scene,"RaccoonBase/Mesh/RacoonMesh")as Laya.SkinnedMeshSprite3D;
        //  this.mesh=GameObject.FindUseNode("CatBase/Mesh/CatMesh",this.gameObject) as Laya.SkinnedMeshSprite3D;
        //this.mesh.skinnedMeshRenderer.=raccoonBase;
        //   this.mesh.meshFilter.sharedMesh= raccoonBase.meshFilter.sharedMesh;
        //碰撞器章节讲解内容
        let aabbshape: AABBShape = new AABBShape();
        aabbshape.mask = CollisionMask.Character;
        //位运算，表示碰撞器和 障碍物和鱼产生碰撞
        //因为采用了位运算表示碰撞器之间的碰撞种类检测,
        //所以有新物体增加时CollisionMask会常常也需要同步增加
        aabbshape.collisionMask = 1 << CollisionMask.Obstacle | 1 << CollisionMask.Gold | 1 << CollisionMask.JiaSu
            | 1 << CollisionMask.PaoDao | 1 << CollisionMask.HuaPo | 1 << CollisionMask.End;
        //center (0.0, 0.6, 0.0)  size (0.6, 1.2, 0.3)
        aabbshape.size = new Laya.Vector3(1.5, 2.2, 1)
        aabbshape.center = new Laya.Vector3(0.0, 1.2, 0);


        this.aabbshape = this.gameObject.addComponentIntance(aabbshape);
        //因为考虑到性能原因，只有开启了自动检测的对象才会进行检测
        //表里有3个对象，1个对象开启主动检测，需要进行2此运算
        //2个对象开启主动检测，需要进行4此运算
        //{a,b,c,......} a.ActiveDetec()
        // detect(a ,b) 
        // detect(a ,c) 
        //........

        //{a,b,c,......} a.ActiveDetec(); b.ActiveDetec()
        // detect(a ,b) 
        // detect(a ,c) 
        //detect(b ,a) 
        //detect(b ,c) 

        aabbshape.ActiveDetec();
        //碰撞进入
        aabbshape.RegisetCollsionEnter(this, this.OnCollisionEnter)
        aabbshape.RegisetCollsionExit(this,this.OnCollisionExit)
        //碰撞离开
        // aabbshape.RegisetCollsionExit(this, this.OnCollisionExit)

        // let charaterIdx = PlayerPrefs.GetInt('onSelectChrater', 0)
        // this.changgeSkin(charaterIdx);
        this.initCat()
        // let hatIdx = PlayerPrefs.GetInt('shopSelectHat', 0);
        // this.ShopSelectHat(hatIdx);
        // EventManager.instance.on(EventType.ShopSelectChrater, this, this.ShopSelectChrater);

        // EventManager.instance.on(EventType.ShopSelectHat, this, this.ShopSelectHat);

        //effect
        // this.winEffect = this.gameObject.getChildByName('FX_Wind') as any;
        this._addSpeedEffect = this.gameObject.getChildByName("jiasu") as Laya.Sprite3D
        this._addSpeedEffect.active  = false

        let shadow = this.gameObject.getChildByName("BlobShadow") as Laya.Sprite3D
        shadow.transform.localPositionX = -0.1

        let cameraAnimationGob = this.gameObject.parent.getChildByName('cameraAnimation') as Laya.Sprite3D;
        if (cameraAnimationGob != null) {

            this.cameraAnimator = cameraAnimationGob.getComponent(Laya.Animator);
            this.cameraAnimatorTrs = cameraAnimationGob.transform;
        }

        this.UIhitEffect = this.gameObject.getChildByName('UIhit') as any;

        this._initCameraY = GameScript.instance.camera.transform.localPositionY

        this._playerYState = 0
    }

    baseHitScore = 0;

    // /**是否是斜坡 */
    // private _slopeState = false;
    // /**是否是车顶 */
    // private _onCarTop = false

    /**0路面 1 斜坡 2车顶  */
    private _playerYState:number = -1

    /**当前碰撞盒 */
    private _curSlope:AABBShape = null

    private _cueCollisionTarget:Laya.Sprite3D = null
    private _endTimes:number = 0
    /**
     * 碰撞检测
     */
    OnCollisionEnter(source: AABBShape, target: AABBShape) {

        // console.log('OnCollisionEnter', target.mask);
        if (target.mask == CollisionMask.Gold) {
            target.gameObject.active = false;
            this._goldEffect.active = true
            //GameSample.soundMgr.FishCollection.Play();
            //猫吃到鱼时+1且更新UI
            GameScript.instance.playerEatFish();
            Laya.timer.once(400,this,this.hideGoldEffect)
        }else if(target.mask == CollisionMask.HuaPo){
            this._playerYState = 1;
            this._curSlope = target
            // console.log("上斜坡",GameScript.instance.cureentZ,target.transform.localPositionZ)
        }else if(target.mask == CollisionMask.PaoDao){
            this._playerYState = 2;
            // this._exitCar = false
            this._curSlope = target
            this._playerYState = 2
            this._frontZ = 0
            // console.log("进入车顶:",target.transform.localPositionZ)
        }else if(target.mask == CollisionMask.End){
            this._endTimes += 1
            if(this._endTimes == 4){
                GlobalData.gameOver = true
                this.gameOver()
                return
            }
            this.IsFastRun = false
            // console.log("到站",this._endTimes)
            GameScript.instance.setLevelAddSpeed(false,true)

        }else if(target.mask == CollisionMask.JiaSu){
            // console.log("加速红包")
            target.gameObject.active = false;
            this.IsFastRun = false
            this.FastRun()
            // console.log("红包位置",GameScript.instance.cureentZ)
        }
        else if (target.mask == CollisionMask.Award) {
            // console.log('Award');

            this.UIhitEffect.active = false;
            this.UIhitEffect.active = true;
            SoundManager.instance.starAward.Play();

            target.owner.active = false;

        }//引导阶段不能碰障碍物
        else if (GlobalData.isGuide == false && (target.mask == CollisionMask.Obstacle || target.mask == CollisionMask.PaoDao))//障碍物
        {
            // if (this.IsFastRun) {
            //     SoundManager.instance.hit.Play();
            //     this.baseHitScore += 2;
            //     this._gameModule.showHit(this.baseHitScore);
            // }

            if (this.IsFastRun == false){
                if(this._curSlope) return
                // console.log("碰撞....")
                this._cueCollisionTarget = target.gameObject;
                this.Fail();
            }
                
            let obstalcle = GameScript.instance.obstacleSpawn.itemMap.getValue(target.gameObject.id);

            if (target.tag == 'Rat') {
                target.objdata.ani.play('Dead');
                target.objdata.collider.enabled = false;
            }else if(target.tag == "clb"){
                // console.log("冲浪板")
            }
            else {
                if(obstalcle && obstalcle.ani){
                    obstalcle.ani.play('Dead');
                    obstalcle.collider.enabled = false;
                }
            }
        }
    }

    hideGoldEffect():void{
        this._goldEffect.active = false
    }

    OnCollisionExit(source: AABBShape, target: AABBShape):void{
        if(target.mask == CollisionMask.PaoDao){
            this._curSlope = target
            this._playerYState = this.checkNearBus(target)
            // console.log("离开车顶",target.transform.localPositionZ,this._playerYState)
        }else if(target.mask == CollisionMask.HuaPo){
            // console.log("离开斜坡")
        }
    }

    private _jumpForward:boolean = false
    private checkNearBus(target:AABBShape):number{
        // console.log("离开对象坐标：",target.transform.localPositionZ)
        let map = GameScript.instance.obstacleSpawn.itemMap
        if(this._lastAction == this.actionRight || this._lastAction == this.actionLeft){
            let min = target.transform.localPositionZ - 8
            let max = target.transform.localPositionZ + 16
            for (let index = 0; index < map.keys.length; index++) {
                const value = map.values[index];
                if(value.collider.mask == CollisionMask.PaoDao){
                    let z = value.collider.transform.localPositionZ
                    let x = value.collider.transform.localPositionX
                    if(z == target.transform.localPositionZ) continue
                    // console.log("检测对象",target.transform.localPositionZ)
                    if(z >= min && z <= max){
                        if(GameScript.instance.cureentZ > z - 8 && GameScript.instance.cureentZ < z + 8){
                            if(x > target.transform.localPositionX){
                                if(this._lastAction == this.actionLeft){
                                    return 2
                                }else{
                                    return 0
                                }
                            }else if(x < target.transform.localPositionX){
                                if(this._lastAction == this.actionRight){
                                    return 2
                                }else{
                                    return 0
                                }
                            }else{
                                return 2
                            }
                        }
                    }
                }
            }  
            // console.log("检测结束")
            return 0
        }else if(this._lastAction == this.actionUp){
            // console.log("跳跃")
            let state = this.checkJumpBus(target,map)
            if(state == 0){
                this.fallDown()
            }else{
                this._jumpForward = true
            }
            return state
            // return 0
        }else{
            this.fallDown()
            return 0
        }
    }

    private fallDown():void{
        this.playCatAni("TCatFallDown",1,0,0.2)
        Laya.timer.once(300, this, this.crossFadeRunAfterBigJump)
        this.moveCameraY(0)
    }

    private _frontZ:number = 0
    private checkJumpBus(target,map):number{
        for (let index = 0; index < map.keys.length; index++) {
            const value = map.values[index];
            let max:number = target.transform.localPositionZ + 25
            let min:number = target.transform.localPositionZ
            let targetX = target.transform.localPositionX
            if(value.collider.mask == CollisionMask.PaoDao){
                let z = value.collider.transform.localPositionZ
                let x = value.collider.transform.localPositionX
                if(targetX != x) continue
                if(z > min && z < max){
                    // console.log("下一节车厢坐标：",z )
                    this._frontZ = z
                    return 2
                }
            }
        }
        return 0
    }


    Fail() {

        if (GlobalData.isGuide) return;
        if (this.IsWudi) return;
        if (this.isdeath) return;

        Platform.vibrateLong()
        GameScript.instance.speed = 0;
        this.playCatAni("TCatDeath",1)
        SoundManager.instance.CatDeath.Play();
        //上报淘宝数据
        // window.platform.updateGold(this._gameModule.model.fishCount)
        GameScript.instance.jumpaddspeed = 0;
        GameScript.instance.addspeed = 0;
        GameScript.instance.setLevelAddSpeed(true)

        Laya.timer.once(1000, this, () => {
            ModuleCenter.instance.openOverView(true)
            ModuleCenter.instance.gameModule.hideView()
        })  
        this._gameModule.hideFishAndScore()
        this.isdeath = true;
    }

    gameOver():void{
        if (GlobalData.isGuide) return;
        if (this.IsWudi) return;
        if (this.isdeath) return;
        Platform.vibrateLong()

        GameScript.instance.speed = 0;
        GameScript.instance.jumpaddspeed = 0;
        GameScript.instance.addspeed = 0;
        GameScript.instance.setLevelAddSpeed(true)

        Laya.timer.once(500, this, () => {
            ModuleCenter.instance.openOverView(true)
            ModuleCenter.instance.gameModule.hideView()
        })  
        this._gameModule.hideFishAndScore()
    }

    rebornRead = false;
    Reborn() {
        this.rebornRead = true;
        this.isdeath = false;
        this.isbigJump = false;
        this._curSlope = null
        this.animator.speed = this.getCatRunSpeed()
        // console.log("猫的跑步速度4：",this.animator.speed)
        this.animator.crossFade('TCatRun', 0.1);
        this.aabbshape.center.y = 1.2;
        this._jumpY = 0
        // GameScript.instance.levelAddSpeed
        // this._cueCollisionTarget.active = false
        let min = this._cueCollisionTarget.transform.localPositionZ - 10
        let max = this._cueCollisionTarget.transform.localPositionZ + 10
        // console.log("碰撞物体：",this._cueCollisionTarget.transform.localPositionZ,min,max)
        // this._cueCollisionTarget = null
        this._gameModule.reborn()
        this.transform.localPositionY = 0;
        ModuleCenter.instance.gameModule.showView()
        this.clearNearObject(min,max)
    }
    
    /**
     * 复活清除周边物体
     */
    private clearNearObject(min,max):void{
        let map = GameScript.instance.obstacleSpawn.itemMap
        map.forEach((key,value)=>{
            let z = value.collider.transform.localPositionZ
            if(z >= min && z <= max){
                value.collider.gameObject.active = false
            }
        })        
    }

    private _lastAction:number = -1
    onUpdate():void{
        if (this.isdeath || GameScript.instance.isPlay == false || this.rebornRead ||
            this.challengeEnd) return;
        
        this.run()
        let action = this.getAction()
        this.runAction(action)

        this.getChangeLocalY(action)
        // console.log("this._slopeHight:",this._slopeHight)
        if(action != -1 && this._playerYState == 2){
            this._lastAction = action
            if(action == this.actionLeft || action == this.actionRight){
                if(this._frontZ){
                    // console.log("已经跳跃，左滑右滑")
                    this._playerYState = 0
                }
            }
        }
        // console.log("高度：",this.transform.localPositionY)
        //jumpY > 0 跳跃时  左右滑动
        if(this._isTranslation){
            this.transform.localPositionX = Mathf.Lerp(this.transform.localPositionX, this.localx, 0.2);
            this.isbigJump = false
            this.transform.localPositionY = Mathf.Lerp(this.transform.localPositionY, 0, 0.2);
            if( Math.abs(this.localx) - Math.abs(this.transform.localPositionX)< 0.1){
                this._isTranslation = false
                this._jumpY = 0
            }
            // console.log("zuohua")
        }else{
            this.transform.localPositionX = Mathf.Lerp(this.transform.localPositionX, this.localx, 0.2);
        }

        this.moveCameraX()
        
    }

    private _isTranslation:boolean = false
    /**
     * 
     * @returns 获取变化的Y值
     */
    private getChangeLocalY(action):number{
        // console.log("action值",action,this._playerYState)
        let slopeHight = 0
        if(this._playerYState == 0){//平路
            slopeHight = 0
            this._curSlope = null
            this.transform.localPositionY = this._jumpY
            // console.log("jump:",this.transform.localPositionY)
            // this.transform.localPositionY = Mathf.Lerp(this.transform.localPositionY, this._jumpY, 0.2);
            this.moveCameraY(0)
        }else if(this._playerYState == 1){//斜坡
            if(!this._curSlope) return 0
            let offZ = Math.abs(GameScript.instance.cureentZ - 3.5 - (this._curSlope.transform.localPositionZ - 13.5))
            if(offZ <= 5){//斜坡
                slopeHight = Math.abs((offZ*Math.tan(MathUtli.degreeToRadian(30))))   
                // console.log("slopeHight",slopeHight)
            }else{
                slopeHight = 3.15
            }
            this.transform.localPositionY = this._jumpY + slopeHight
            this.moveCameraY(slopeHight)
        }else if(this._playerYState == 2){//车顶
                slopeHight = 3.15
                this.transform.localPositionY = this._jumpY + slopeHight
            // console.log(3.15,this._jumpY)
        }
        return slopeHight
    }

    private _jumpY:number = 0
    private run():void{
        if (this.isbigJump) {
            let t = (Time.time - this.jumpTime) / 0.8;
            // console.log("间隔时间:",t)
            if (t >= 1) {
                t = 1;
                GameScript.instance.jumpaddspeed = 0
                this.isbigJump = false;
                this._jumpY = 0
                this.transform.localPositionY = 0
                return 
            }
            // console.log("sin:",Math.sin(t * Math.PI))
            let y = Math.sin(t * Math.PI) * 0.8; //t 取值范围（0~1~0）
            if (y <= 0) y = 0;
            GameScript.instance.jumpaddspeed = y * 0.3;
            this._jumpY = y
        }
        else{
            GameScript.instance.jumpaddspeed = 0
        }

        if (this.IsFastRun) {
            let t = (Time.time - this.fasRunTime) / 4;
            if (t >= 1) {
                t = 1;
            }
            //0-1-0
            let t1 = Math.sin(t * 3.14);
            GameScript.instance.addspeed = t1 * 0.5;
            let tca = t1;
            t1 = t1 * 3;
            if (t1 >= 1) t1 = 1;
            // this.transform.localPositionZ = t1 * 3.2;
            // GameScript.instance.camera.fieldOfView = 60 + this.cameraAnimatorTrs.localPositionZ
        }
    }

    /**
     * 执行action
     */
    private runAction(action):void{
        if(action == this.actionDown){
            this.sliderDwon();
        }else if(action == this.actionUp){
            this.BigJump();
        }else if(action == this.actionLeft){
            this.turnLeftOrRight(action)
        }else if(action == this.actionRight){
            this.turnLeftOrRight(action)
        }
    }



    private getAction():number{
    //指定一个操作,,禁止同事左滑和上滑，因为灵敏度太低
        if ((Input.slideLeft || Input.slideRight) && (Input.slideUp || Input.slidedown)) {
            if (Math.abs(Input.slideXdis) >= Math.abs(Input.slideYdis)) {
                Input.slideUp = false;
                Input.slidedown = false;
            } else {
                Input.slideLeft = false;
                Input.slideRight = false;
            }
        }
        let action = -1;
        if (GlobalData.isGuide) {
            action = this.GuiDeUpdate();
            if (GameScript.instance.cureentZ >= 40)
                GameScript.instance.GuideOk();
        } else {
            action = this.GetPlayerAciont();
            if (Input.GetKeyDown(Laya.Keyboard.LEFT)) action = this.actionLeft;
            if (Input.GetKeyDown(Laya.Keyboard.RIGHT)) action = this.actionRight;
            if (this.canJump == false && (action == this.actionSamllJump || action == this.actionUp)) {
                action = -1;
            }
            if (this.fanzhuanyidong && action == this.actionRight){
                action = this.actionLeft
            }else if (this.fanzhuanyidong && action == this.actionLeft){
                action = this.actionRight;
            }     
        }
        return action
    }

    /**
     * 获取localX
     */
    private turnLeftOrRight(action):void{
        let aniName:string = ""
        if (action == this.actionLeft) {
            this.localx += this._moveX;
            aniName = "TCatLeft"
            if(this.localx > this._moveX){
                aniName = ""
            }
            if (this.localx >= this._moveX){
                this.localx = this._moveX;
            }
        } else if (action == this.actionRight) {  
            this.localx -= this._moveX;
            aniName = "TCatRight"
            if(this.localx < -this._moveX){
                aniName = ""
            }
            if (this.localx <= -this._moveX){
                this.localx = -this._moveX;
            }  
        }
        if(this._playerYState == 1){
            Laya.timer.once(100,this,()=>{
                this._playerYState = 0
            }) 
        }
        this._trail.active = true
        Laya.timer.once(100,this,()=>{
            this._trail.active = false
        })
        // console.log("this._jumpY",this._jumpY,aniName)
        if(this._jumpY > 0){
            this._isTranslation = true
        }
        this.moveRightOrLeft(aniName)
    }

    /**
     * 向左移动
     */
    private moveRightOrLeft(ani:string):void{
        if(ani == "") return
        this.playCatAni(ani,1,0,0.1)
        Laya.timer.once(100, this, this.crossFadeRun)
    }

    private moveCameraX():void{
        let camera = GameScript.instance.camera
        let initX:number = camera.transform.position.x
        camera.transform.localPositionX = Mathf.Lerp(initX, this.localx, 0.2);
    }

    private _initCameraY:number = 0
    private moveCameraY(offY:number):void{
        let camera = GameScript.instance.camera
        let curY = camera.transform.localPositionY
        let toY = 0
        if(offY != 0){
            toY = this._initCameraY + offY
            camera.transform.localPositionY = Mathf.Lerp(curY,toY,0.2)
            // console.log("相机位置：",camera.transform.localPositionY)
        }else{
            camera.transform.localPositionY = this._initCameraY //Mathf.Lerp(curY,this._initCameraY,0.2)
            // console.log("相机-------------------------------------归位",this._initCameraY,camera.transform.localPositionY)
        }
    }

    FastRunOver() {
        // this._gameModule.ShowHitEnd(this.baseHitScore)
        // GameScript.instance.fastRunScore += this.baseHitScore;
        // this.baseHitScore = 0;
    }
    
    addpowerTime = 0;
    GetPlayerAciont() {
        if (Input.mouseButton0Up &&
            !Input.slideLeft && !Input.slideRight && !Input.slidedown && !Input.slideUp) {
            return this.actionSamllJump;
        } else if (Input.slidedown && this.isbigJump == false) {
            //this.sliderDwon();
            return this.actionDown;
        }
        //左滑手势
        //up 0 down 1 l 2  r 3
        if (Input.slideLeft) {
            return this.actionLeft;
            // this.localx += 1.25;
            //this.leftRightjump();
        }
        //右滑手势
        else if (Input.slideRight) {
            return this.actionRight;
            //this.localx -= 1.25;
            //this.leftRightjump();
        }
        if (Input.slideUp) {
            return this.actionUp;
        }
        return -1;
    }
    
    isbigJump = false;
    jumpTime = 0;
    BigJump() {

        if (this.isbigJump) return;
        SoundManager.instance.CatJump.Play();
        this.playCatAni("TCatUp",1,0,0)
        // this.aabbshape.center.y = 1.41 + 1;
        Laya.timer.once(800, this, this.crossFadeRunAfterBigJump);
        Laya.timer.once(800, this, this.RestAnimatiorSpeed);
        //jumpy
        //跳跃时间200ms
        //
        // this.jumpy = Math.sin(ratio * Mathf.PI) * jumpHeight;
        this.isbigJump = true;
        this.jumpTime = Time.time;
    }

    RestAnimatiorSpeed() {
        this.animator.speed = this.getCatRunSpeed();
    }

    issliderDwon = false;
    sliderDwon() {
        if (this.issliderDwon) return;
        this.issliderDwon = true;
        // console.log("slider Down")
        this.aabbshape.center.y = 0;
        this.playCatAni("TCatSlide",1,0,0.15)
        Laya.timer.once(1000, this, this.crossFadeRun);
        Laya.timer.once(1000, this, () => {
            this.issliderDwon = false;
            GameScript.instance.jumpaddspeed = 0;
        });
        // this.powerAdd(this.actionDown);
    }
    
    GuiDeUpdate(): number {
        //小跳
        let aciont = this.GetPlayerAciont();
        if (this.guiderIdx == 0 && aciont == this.actionUp) {
            this.animator.speed = 1;
            GameScript.instance.NextGuide();
            this.guiderIdx = - 1;
            return aciont;
        }
        if (this.guiderIdx == 1 && aciont == this.actionDown) {
            this.animator.speed = 1;
            GameScript.instance.NextGuide();
            this.guiderIdx = - 1;
            return aciont;
        }
        if (this.guiderIdx == 2 && aciont == this.actionRight) {
            this.animator.speed = 1;
            GameScript.instance.NextGuide();
            this.guiderIdx = -1;
            return aciont;
        }
        if (this.guiderIdx == 3 && aciont == this.actionLeft) {
            this.animator.speed = 1;
            this.guiderIdx = - 1;
            GameScript.instance.NextGuide();
            return aciont;
        }
        // if (this.guiderIdx == 4 && aciont == this.actionUp) {
        //     this.animator.speed = 1;
        //     this.guiderIdx = - 1;
        //     GameScript.instance.WaitGuiEnd();
        //     return aciont;
        // }
        return -1;
    }

    crossFadeRun() {
        if (this.isdeath) return;
        if (this.challengeEnd) return;
        this.isbigJump = false;
        // this.isJump = false;
        this.aabbshape.center.y = 1.2;
        this.animator.speed = this.getCatRunSpeed()
        // console.log("猫的跑步速度1：",this.animator.speed)
        this.animator.crossFade('TCatRun', 0.2);
    }

    crossFadeRunAfterBigJump(){
        if (this.isdeath) return;
        if (this.challengeEnd) return;
        // this.isbigJump = false;
        // this.isJump = false;
        this.aabbshape.center.y = 1.2;
        this.animator.speed = this.getCatRunSpeed()
        // console.log("猫的跑步速度2：",this.animator.speed)
        this.animator.crossFade('TCatRun', 0.2);
    }

    raccoon;
    curAvater: Laya.Sprite3D;

    private _trail:Laya.Sprite3D = null
    private initCat():void{
        if (this.cat == null){
            let TCat = GameObject.Find<Laya.Sprite3D>(GameScript.instance.scene, "Resources/TCat");
            this.cat = Laya.Sprite3D.instantiate(TCat);

            this._trail = this.cat.getChildByName("trail") as Laya.TrailSprite3D
            this._goldEffect = this.cat.getChildByName("jinbi") as Laya.Sprite3D
            this._goldEffect.active = false


            // console.log("cat1:",this.cat.transform.localPositionZ)
            this.gameObject.addChild(this.cat)
            // console.log("cat2:",this.cat.transform.localPositionZ)
            this.cat.active = false;
            this.animator = this.cat.getChildByName("TCat").getComponent(Laya.Animator)
            this.playCatAni('TCatRun',2)
            // this.raccoon.removeSelf();
            this.curAvater = this.cat;
            this.cat.transform.localPosition = new Laya.Vector3(0,0,0)
            // console.log("Cat:",this.cat.transform.position)
        } 
    }
    private playCatAni(action,speed = 1,layerIndex?:number,normalizedTime?:number){
        this.animator.speed = speed
        // console.log("猫的动作速度：",speed)
        this.animator.play(action,layerIndex,normalizedTime)
    }

    StartRun() {
        this.cat.active = true
        this.curAvater.transform.localRotationEulerY = 0;
        this.playCatAni('TCatStart',1)
        Laya.timer.frameOnce(90 * 2, this, this.crossFadeRun);
        // console.log("开始猫的表演")
    }

    cameraOrz = -6.13;
    FastRun() {

        this.IsFastRun = true;
        this._addSpeedEffect.active = true
        this.fasRunTime = Time.time;
        // this.winEffect.active = true;

        this.curstarPower = 0;
        this.playCatAni("TCatFastRun",1)
        Laya.timer.once(4000, this, () => { //快速跑时间
            // this.winEffect.active = false;
            this._addSpeedEffect.active = false
            this.IsFastRun = false;
            GameScript.instance.addspeed = 0;
            // console.log("......................................加速结束")
            this.animator.speed = this.getCatRunSpeed()
            // console.log("猫的跑步速度3：",this.animator.speed)
            this.animator.crossFade('TCatRun', 0.1);
        });
        SoundManager.instance.wineffect.PlayByNum(1);
        Laya.timer.once(3000, this, () => {
            GameScript.instance.useSpwanobstacle = false;
        });
        Laya.timer.once(3000, this, () => {
            GameScript.instance.useSpwanobstacle = true;
        });
    }

    onDestroy() {
        if(this.cat){
            this.gameObject.removeChild(this.cat);
        }
        if(this.aabbshape){
            this.aabbshape.destroy()
            this.aabbshape = null
        }
        EventManager.instance.offAllCaller(this);
    }

    FaceToCamera(b) {

    }

    StartGuider(idx) {
        this.animator.speed = 0;
        this.guiderIdx = idx;
    }

    /**
     * 获取猫跑步动作
     */
    private getCatRunSpeed():number{
        let level = GameScript.instance.getLevel()
        return GlobalData.catRunSpeeds[level] + 1
    }

    onEnable() {
        //this.initOk=true;
        Laya.timer.frameOnce(2, this, () => {
            EventManager.instance.event(EventType.CharaterIniOk);
            // this.winEffect.active = false;
            this.UIhitEffect.active = false;
        })
    }
}