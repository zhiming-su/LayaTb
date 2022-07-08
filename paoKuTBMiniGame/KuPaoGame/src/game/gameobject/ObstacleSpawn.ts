import { Rat } from "./Rat";
import { BaseSpawn, SpawnItem, SpwanItemData } from "./BaseSpawn";
import JTools from "../../JFrameWork/JTools/JTools";
import AABBShape from "../../JFrameWork/3DPhysics/AABBShape";
import { CollisionMask } from "../../JFrameWork/3DPhysics/ShapeThreeD";
import Dictionary from "../../core/util/Dictionary";
import GameScript from "../scripts/game/GameScript";
import MapData from "../data/MapData";
import { ISpawnConfig } from "../interface/ISpawnConfig";
import Rotation from "../scripts/game/Rotation";
import Mathf from "../../UnityEngine/Mathf";
import MathUtli from "../../core/util/MathUtli";
import GlobalData from "../data/GlobalData";



//障碍物模型
export class Obstacle {
    ani: Laya.Animator;
    //碰撞系统章节会用到
    collider: AABBShape;
}

//继承建筑物创建类
export class ObstacleSpawn extends BaseSpawn {


    /**所有物品名字 */
    private _obstacleSpawnArray:Array<string> = [
        "jiasu","jinbi","jinche","chonglangban","xiahualangan"
        ,"shangche","dabache","dabacheding","huapo",
        "guanggaopai","jiazi","ludeng","xiaofangshuan","lajitong","clbani_r","clbani_l"
    ]

    /**装饰障碍物名字 */
    private _decorateObjName:Array<string> = ["guanggaopai","jiazi","ludeng","xiaofangshuan","lajitong"]

    //提供外部访问，让外部可以对障碍物进行控制
    //后面碰撞器章节会根据撞到的对象ID播放倒下动画
    itemMap: Dictionary<number, Obstacle> = new Dictionary();
    public gap = 10;

    private _mapData:MapData = null
    onAwake():void{
        this._mapData = new MapData()
    }


    private _guideOffZArray:Array<number> = [8,4.5]
    Create2End() {
        var p_endZ = this.endZ();
        while (this.startCreateZ < p_endZ) {
            // console.log("this.startCreateZ:",this.startCreateZ,p_endZ)
            let spwanitem = null;
            let guiderOffser = 0;

            if (this.guideIdx <= 1 && GlobalData.isGuide) {
                spwanitem = this.DoSpawnItemGuider(this.startCreateZ + 14);
                guiderOffser = 20;
                GameScript.instance.guiderz[this.guideIdx - 1] = 20* this.guideIdx - this._guideOffZArray[this.guideIdx - 1]
                this.startCreateZ += 20
            } else if (GameScript.instance.useSpwanobstacle)
                spwanitem = this.DoSpawnItem(this.startCreateZ);
            if (GameScript.instance.useSpwanobstacle)
                this.startCreateZ += 2 //一个单元格 //spwanitem.spwanItemData.length + this.gap + guiderOffser;
            else {
                this.startCreateZ += 50 + this.gap + guiderOffser;
            }

        }
    }


    starBigSacle = new Laya.Vector3(2, 2, 2);
    starsamllSacle = new Laya.Vector3(1, 1, 1);

    protected DoSpawnItem(z: number): SpawnItem {
        let rowConf:ISpawnConfig = this._mapData.getRowConfig()
        // let spwanItemDataType:number = 0
        for (let key in rowConf) {
            if (Object.prototype.hasOwnProperty.call(rowConf, key)) {
                if(key == "row") continue
                let element:Array<any> = rowConf[key];
                if(element.length == 1 && element[0] == 0 ){
                    continue
                }
                let type = this.getConfigIndex(key)
                var spwanItemData = this.spwanConfigObj.spwanItemDatas[type];
                let hightArray:Array<string> = []
                for(let i:number = 0;i < element.length;i++){
                    //对象池创建
                    // console.log("加载...",spwanItemData.goName)
                    if(spwanItemData.goName == "jinbi"){
                        let str:string = element[i]
                        hightArray = str.split("|")
                    }
                    let item = Laya.Pool.getItemByCreateFun(spwanItemData.goName, () => { return this.CreateSpwanItem(spwanItemData); }, this) as SpawnItem;
                    if(spwanItemData.goName == "clbani_r" || spwanItemData.goName == "clbani_l"){
                        let ani = item.gob.getChildAt(0).getComponent(Laya.Animator) as Laya.Animator; 
                        ani.play("idle")
                        // console.log("创建：",spwanItemData.goName)
                        GameScript.instance.aniArray.push(item.gob)
                    }
                    this.scene.addChild(item.gob);
                    if(spwanItemData.goName == "jinbi" && hightArray.length > 1){
                        this.onSpawn(item.gob, spwanItemData, z,parseInt(hightArray[0]),parseInt(hightArray[1]));
                    }else{
                        this.onSpawn(item.gob, spwanItemData, z,element[i]);
                    }
                    item.gob.active = true
                }
            }
        }
        //随机数据
        return null;
    }

    private getConfigIndex(key:string):number{
        return this._obstacleSpawnArray.indexOf(key)
    }

    //0是跨栏 1是下滑 ,3是 跳栏
    //上下右左
    guideIdx = 0;
    //上下左右
    protected DoSpawnItemGuider(z: number): SpawnItem {


        let rndIdx = this.guideIdx;
        let x = 0;

        if (this.guideIdx == 0) rndIdx = 2;

        if (this.guideIdx == 1) rndIdx = 4;

        // if (this.guideIdx == 2) {
        //     rndIdx = 4;
        //     x = 0;
        // }

        // if (this.guideIdx == 3) {
        //     rndIdx = 4;
        //     x = -1.27;
        // }

        // if (this.guideIdx == 4) {
        //     rndIdx = 0;
        //     x = 0;
        // }



        // rndIdx = 2;

        //随机数据
        var spwanItemData = this.spwanConfigObj.spwanItemDatas[rndIdx];
        // console.log("新手引导创建：",spwanItemData.goName)
        //对象池创建
        let item = Laya.Pool.getItemByCreateFun(spwanItemData.goName, () => { return this.CreateSpwanItem(spwanItemData); }, this) as SpawnItem;
        this.scene.addChild(item.gob);
        this.onSpawnGuide(item.gob, spwanItemData, z, x);

        // console.log('guide z',z);
        // if (this.guideIdx == 4) {
        //     var starData = this.spwanConfigObj.spwanItemDatas[5];
        //     let star = Laya.Pool.getItemByCreateFun(starData.goName, () => { return this.CreateSpwanStar(starData); }, this) as SpawnItem;
        //     this.scene.addChild(star.gob);
        //     star.gob.active = true;
        //     star.gob.transform.position = item.gob.transform.position.clone();

        //     star.gob.transform.localPositionY += 2;

        //     star.gob.transform.localScale = this.starBigSacle;
        // }

        this.guideIdx += 1;

        return item;
    }

    private _initRotationEulerY:number = 0
    //重载创建方法，原因
    //障碍物被创建时随机放到左中右其中一个位置
    //障碍物推倒后播放倒下动画，所以创建时播放默认动画把它树立起来
    protected onSpawn(newGo: Laya.Sprite3D, spwanItemData: SpwanItemData, z,index,y=0) {
        if (spwanItemData.goName == 'jinche' || spwanItemData.goName == 'shangche' || spwanItemData.goName=="dabache"|| spwanItemData.goName=="dabacheding"){
            let arrNum = [-3.2,0,3.2]
            let x = arrNum[index - 1]
            newGo.transform.position = new Laya.Vector3(x, 0, z + 2)
        }else if(spwanItemData.goName=="huapo"){
            let arrNum = [-3.2,0,3.2]
            let x = arrNum[index - 1]
            newGo.transform.position = new Laya.Vector3(x, 0, z + 2)
        }
        else if(spwanItemData.goName == 'jinbi' || spwanItemData.goName == 'jiasu'){
            let arrNum = [-3.1,0,3.1]
            let x = arrNum[index - 1]
            this._initRotationEulerY += 30
            if(this._initRotationEulerY >= 360){
                this._initRotationEulerY = 0
            }
            newGo.transform.localRotationY = MathUtli.degreeToRadian(this._initRotationEulerY) 
            this.addRotationScript(newGo)
            newGo.active = true;
            newGo.transform.position = new Laya.Vector3(x, y, z + 1);
        }else if(spwanItemData.goName == 'chonglangban'){
            let arrNum = [-2.8,0,2.8]
            let x = arrNum[index - 1]
            newGo.transform.position = new Laya.Vector3(x, 0, z + 1);
        }else if(spwanItemData.goName == "clbani_r" || spwanItemData.goName == "clbani_l" ){
            let arrNum = [-3,0,3]
            let x = arrNum[index - 1]
            newGo.transform.position = new Laya.Vector3(x, 0, z + 1);
        }
        else if(spwanItemData.goName == 'xiahualangan'){
            let arrNum = [-3.2,0,3.2]
            let x = arrNum[index - 1]
            newGo.transform.position = new Laya.Vector3(x, 0, z + 1);
        }
        // let obstacle = this.itemMap.getValue(newGo.id)
        if(this._decorateObjName.indexOf(spwanItemData.goName) >= 0){
            if(index ==1){
                newGo.transform.localScaleX = -1
            }else{
                newGo.transform.localScaleX = 1  
            }
            newGo.transform.position = new Laya.Vector3(0, 0, z + 2);
        }
        // else
        //  TODO:放开此处播放动作
            // obstacle.ani.play('idle', 0, 0); 
        //重新激活碰撞器
        // obstacle.collider.enabled = true;
    }

    private addRotationScript(newgo):void{
        if (!newgo.getComponent(Rotation)) {
            newgo.addComponent(Rotation) as Rotation;
        }
    }

    protected onSpawnGuide(newGo: Laya.Sprite3D, spwanItemData: SpwanItemData, z, x) {
        newGo.transform.position = new Laya.Vector3(x, 0, z);
        let obstacle = this.itemMap.getValue(newGo.id)

        // if (spwanItemData.goName == 'Rat') {
        //     let time = Math.random();
        //      obstacle.ani.play('Run', 0, time);
        //  }
        // else
        // obstacle.ani.play('idle', 0, 0);
        //重新激活碰撞器
        obstacle.collider.enabled = true;
    }

    SpawnObstacle2(newGo: Laya.Sprite3D, z: number, x: number) {

        //let arryNum = [-1, 0, 1];
        let rnd = Math.random();
        if (x < 0) {

            if (rnd >= 1 - 0.5)
                x = 1.27;
            else
                x = 0;
        }

        if (x == 0) {

            if (rnd >= 1 - 0.5)
                x = -1.27;
            else
                x = 1.27;
        }

        if (x > 0) {

            if (rnd >= 1 - 0.5)
                x = -1.27;
            else
                x = 0;
        }

        newGo.transform.position = new Laya.Vector3(x, 0, z);



        let obstacle = this.itemMap.getValue(newGo.id)

        obstacle.ani.play('idle', 0, 0);

        //重新激活碰撞器
        obstacle.collider.enabled = true;


    }

    //重载CreateSpwanItem原因
    //添加障碍物实体类型表
    protected CreateSpwanItem(spwanItemData: SpwanItemData): SpawnItem {

        let spwanitem = super.CreateSpwanItem(spwanItemData)
        if(this._decorateObjName.indexOf(spwanItemData.goName) >= 0) return spwanitem
        let newgo = spwanitem.gob;
        let obstacle = new Obstacle();
        // if (spwanItemData.goName=='ObstacleRoadworksBarrier')
        // obstacle.ani = newgo.getChildAt(0).getChildAt(0).getComponent(Laya.Animator) as Laya.Animator;
        // else

        //TODO:暂时没有动画
        let ani = newgo.getChildAt(0).getComponent(Laya.Animator) as Laya.Animator; 
        obstacle.ani = ani
        this.itemMap.setValue(newgo.id, obstacle)

        let collidergob = newgo as Laya.Sprite3D;
        let boxCollider = this.addBoxCollider(spwanItemData.goName);
        // console.log("spwanItemData.goName:",spwanItemData.goName)
        obstacle.collider = boxCollider
        // collidergob.active = true
        collidergob.addComponentIntance(boxCollider);
        return spwanitem;
    }

    /**
     * 
     * @param goName 添加破恩转
     */
    private addBoxCollider(goName:string):AABBShape{
           //碰撞器的添加
           let boxCollider = new AABBShape()
           boxCollider.mask = CollisionMask.Obstacle;
           boxCollider.collisionMask = 0;
           //TODO:碰撞器大小修改
           if ( goName == 'jinche') {
               boxCollider.center = new Laya.Vector3(0, 0, 0)
               boxCollider.size = new Laya.Vector3(3,1 , 3.2);    
           } else if (goName == 'chonglangban' ) {
               boxCollider.center = new Laya.Vector3(0, 0.2, 0.25)
               boxCollider.size = new Laya.Vector3(2, 5, 0.5)
           }else if(goName == "clbani_r"){
                boxCollider.size = new Laya.Vector3(5, 1, 0.3)
                boxCollider.center = new Laya.Vector3(-1.5, -0.2, 0)
                boxCollider.tag = "clb"
           } else if(goName == "clbani_l"){
                boxCollider.tag = "clb"
                boxCollider.size = new Laya.Vector3(5, 1, 0.3)
                boxCollider.center = new Laya.Vector3(1.5, -0.2, 0)
           }
           else if (goName == 'xiahualangan') {
               boxCollider.center = new Laya.Vector3(0, 2.6, 0);
               boxCollider.size = new Laya.Vector3(2.5, 1, 0.5);
           }else if (goName == 'dabache') {  
               boxCollider.mask = CollisionMask.Obstacle;
               boxCollider.collisionMask = 0;
               boxCollider.center = new Laya.Vector3(0,0.6,-1.8);
               boxCollider.size = new Laya.Vector3(1.6, 0.6, 19);
           }else if (goName == 'dabacheding') {  
               boxCollider.mask = CollisionMask.PaoDao;
               boxCollider.collisionMask = 0;
               boxCollider.center = new Laya.Vector3(0,4.5,0);
               boxCollider.size = new Laya.Vector3(1, 3, 16);
           }else if (goName == 'huapo') {  
               boxCollider.mask = CollisionMask.HuaPo;
               boxCollider.collisionMask = 0;
               boxCollider.center = new Laya.Vector3(0,1.5, -10.8);
               boxCollider.size = new Laya.Vector3(0.8, 3,5.5);
           }else if(goName=="jinbi"){
               boxCollider.mask = CollisionMask.Gold;
               boxCollider.collisionMask = 0;
               boxCollider.center = new Laya.Vector3(0, 0.2, 0)
               boxCollider.size = new Laya.Vector3(1, 1, 0.3);
           }else if(goName=="jiasu"){
                boxCollider.mask = CollisionMask.JiaSu;
                boxCollider.collisionMask = 0;
                boxCollider.center = new Laya.Vector3(0, 1, 0)
                boxCollider.size = new Laya.Vector3(1, 1, 0.2);
           }
           return boxCollider
    }

    protected CreateSpwanStar(spwanItemData: SpwanItemData): SpawnItem {

        let spwanitem = super.CreateSpwanItem(spwanItemData)
        let newgo = spwanitem.gob;

        let obstacle = new Obstacle();


        this.itemMap.setValue(newgo.id, obstacle)

        //碰撞器的添加
        let boxCollider = new AABBShape()

        let collidergob = newgo as Laya.Sprite3D;

        //分数体

        boxCollider.mask = CollisionMask.Award;
        boxCollider.collisionMask = 0;
        boxCollider.center = new Laya.Vector3(0.0, 0, 0.0);
        boxCollider.size = new Laya.Vector3(0.5, 0.5, 0.5);

        collidergob.addComponentIntance(boxCollider);

        obstacle.collider = boxCollider;
        return spwanitem;
    }

    recoverLessZ() {
        for (const spwanitem of this.runtimeItems) {
            if (spwanitem.gob.displayedInStage) {
                let length = spwanitem.spwanItemData.length;
                if (spwanitem.gob.transform.position.z + length * 0.5 < this.currentZ + this.spwanConfigObj.recoverOffset) {
                    // spwanitem.gob.transform.localRotationEuler = new Laya.Vector3(0,0,0)
                    spwanitem.gob.transform.localRotation = new Laya.Quaternion(0,0,0,1)
                    spwanitem.gob.transform.localScaleX = 1
                    if(spwanitem.gob.getComponent(Rotation) != null){
                        (spwanitem.gob.getComponent(Rotation) as Rotation).destroy()
                    }
                    Laya.Pool.recover(spwanitem.spwanItemData.goName, spwanitem);
                    spwanitem.gob.removeSelf();
                }
            }
        }
    }

    recoverAll(){
        for (const spwanitem of this.runtimeItems) {
            if (true) {
                {
                    Laya.Pool.recover(spwanitem.spwanItemData.goName, spwanitem);
                    let aabb = spwanitem.gob.getComponent(AABBShape) as AABBShape
                    if(aabb){
                        aabb.destroy()
                    } 
                    spwanitem.gob.removeSelf();
                }
            }
        }
    }
}