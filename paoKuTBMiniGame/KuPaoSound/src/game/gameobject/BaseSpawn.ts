import Dictionary from "../../core/util/Dictionary";
import SeedRnd from "../../JFrameWork/JTools/SeedRnd";
import GameObject from "../../unityEngine/GameObject";

//物体属性模型
export class SpwanItemData {
    public constructor() { }
    public goName = '';
    public length = 0;

    public active = false;
}

//生产对象模型
export class SpawnItem {
    public spwanItemData: SpwanItemData;
    public gob: Laya.Sprite3D;
}

//创建器配置模型
export class SpwanConfigObj {

    public constructor() {
    }
    //资源查找的路径
    public findRoot = '';
    public spwanItemDatas: SpwanItemData[];
    //起始创建值
    public startCreateZ = 0;
    //创建的长度
    public CreateLength = 0;
    //回收偏移值，考虑到相机的位置，避免物体在镜头内被回收
    public recoverOffset = 0;
}



export class BaseSpawn extends Laya.Script {

    spwanConfigObj: SpwanConfigObj;
    runtimeItems: SpawnItem[] = [];
    //返回首页时清理对象池用到
    poolsignMap: Dictionary<string, string> = new Dictionary();
    currentZ = 0;
    startCreateZ = 0;
    scene: Laya.Scene3D;
    seed: SeedRnd = new SeedRnd(0);
    onStart() {
        this.startCreateZ = this.spwanConfigObj.startCreateZ;
        this.Create2End();
    }

    protected endZ(): number {
        return this.currentZ + this.spwanConfigObj.CreateLength;
    }

    Create2End() {
        var p_endZ = this.endZ();
        while (this.startCreateZ < p_endZ) {
            let spawnItem = this.DoSpawnItem(this.startCreateZ);
            this.startCreateZ += spawnItem.spwanItemData.length;
        }
    }

    protected DoSpawnItem(z: number): SpawnItem {

        let rndIdx = this.seed.getRandomInt_NotIncludeMax(0, this.spwanConfigObj.spwanItemDatas.length);



        //随机数据
        var spwanItemData = this.spwanConfigObj.spwanItemDatas[rndIdx];
        //对象池创建
        var item = Laya.Pool.getItemByCreateFun(spwanItemData.goName, () => { return this.CreateSpwanItem(spwanItemData); }, this) as SpawnItem;
        this.scene.addChild(item.gob);
        this.onSpawn(item.gob, spwanItemData, z);
        item.gob.active = true;
        return item;
    }

    //对应上一章的CreateItem，返回固定长度改为返回SpwanItemData，该数据模型就包含了物体的长度信息
    protected CreateSpwanItem(spwanItemData: SpwanItemData): SpawnItem {
        var gob = GameObject.Find<Laya.Sprite3D>(this.scene, this.spwanConfigObj.findRoot + '/' + spwanItemData.goName);
        var newGo = Laya.Sprite3D.instantiate(gob);
        this.scene.addChildren(newGo);
        newGo.active = true;

        let spawnItem = new SpawnItem();
        spawnItem.gob = newGo;
        spawnItem.spwanItemData = spwanItemData;
        //给回收用的
        this.runtimeItems.push(spawnItem);
        //返回首页时清理对象池用到
        this.poolsignMap.setValue(spwanItemData.goName, 'poolsign');
        return spawnItem;
    }

    //置创建物体创建的属性,
    protected onSpawn(newGo: Laya.Sprite3D, spwanItemData: SpwanItemData, z,index?,y?) {

    }

    onUpdate() {
        //this.currentZ+=1;
        this.Create2End();
        this.recoverLessZ();

    }

    recoverLessZ() {
        for (const spwanitem of this.runtimeItems) {
            if (spwanitem.gob.displayedInStage) {
                let length = spwanitem.spwanItemData.length;
                if (spwanitem.gob.transform.position.z + length * 0.5 < this.currentZ + this.spwanConfigObj.recoverOffset) {
                    Laya.Pool.recover(spwanitem.spwanItemData.goName, spwanitem);
                    spwanitem.gob.removeSelf();

                }
            }
        }
    }

    recoverAll() {
        for (const spwanitem of this.runtimeItems) {
            if (true) {
                //  let length = spwanitem.spwanItemData.length;
                // if (spwanitem.gob.transform.position.z + length * 0.5 < this.currentZ + this.spwanConfigObj.recoverOffset) 
                {
                    Laya.Pool.recover(spwanitem.spwanItemData.goName, spwanitem);
                    spwanitem.gob.removeSelf();

                }
            }
        }
    }





    //返回首页会删除对象池实例化的资源，所以要清空对象池，避免游戏开始时取到空对象
    onDestroy() {
        for (const iterator of this.poolsignMap.keys) {
            Laya.Pool.clearBySign(iterator)
        }
    }

}