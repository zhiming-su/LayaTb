import Dictionary from "../../core/util/Dictionary";
import SeedRnd from "../../JFrameWork/JTools/SeedRnd";
import GameObject from "../../unityEngine/GameObject";
import { BaseSpawn, SpawnItem, SpwanConfigObj, SpwanItemData } from "./BaseSpawn";


//建筑物创建组件
export class BuildSpawn extends BaseSpawn {

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

        // let rndIdx = this.seed.getRandomInt_NotIncludeMax(0, this.spwanConfigObj.spwanItemDatas.length);



        //随机数据
        var spwanItemData = this.spwanConfigObj.spwanItemDatas[0];
        //对象池创建
        var item = Laya.Pool.getItemByCreateFun(spwanItemData.goName, () => { return this.CreateSpwanItem(spwanItemData); }, this) as SpawnItem;
        this.scene.addChild(item.gob);
        this.onSpawn(item.gob, spwanItemData, z);
       // item.gob.active = true;
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
    protected onSpawn(newGo: Laya.Sprite3D, spwanItemData: SpwanItemData, z) {
        newGo.transform.position = new Laya.Vector3(0, 0, z);
        let scale = newGo.transform.localScale;
        let arryNum = [-1, 1];
        let x=this.seed.getRandomIntArry(arryNum);
        scale.x=x;
        //物体镜像 x=1 x=-1,构成建筑物朝向，文章中见图1
        newGo.transform.localScale = scale;

        // spwanItemData.active = true;
    }

    onUpdate() {
        this.Create2End();
        this.recoverLessZ_build();
    }
    //回收超出镜头的物体,X镜像对象消息
    recoverLessZ_build() {

        for (const spwanitem of this.runtimeItems) {
            if (spwanitem.gob.displayedInStage) {
                let length = spwanitem.spwanItemData.length;
                if (spwanitem.gob.transform.position.z + length * 0.5 < this.currentZ + this.spwanConfigObj.recoverOffset) {
                    spwanitem.gob.transform.localScaleX = 1
                    Laya.Pool.recover(spwanitem.spwanItemData.goName, spwanitem);
                    spwanitem.gob.removeSelf();
                    //spwanitem.gob.active=false;
                    // spwanitem.spwanItemData.active = false;
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