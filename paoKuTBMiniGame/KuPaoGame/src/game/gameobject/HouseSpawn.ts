import MathUtli from "../../core/util/MathUtli";
import { BaseSpawn, SpawnItem, SpwanItemData } from "./BaseSpawn";
import { BuildSpawn } from "./BuildSpawn";

/*
 * @Date: 2021-06-21 14:33:01
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-07 14:00:31
 * @description: 
 */
export default class HouseSpawn extends BuildSpawn{
    // private startCreateZ_2:number = 0
    private _flip:number = 1
    /**房子间距 */
    private _houseSpace:number = 5
    constructor(randomScaleX){
        super()
        this.randomScaleX = randomScaleX
    }

    onStart() {
        this.Create2End();
    }
    
    Create2End() {
        var p_endZ = this.endZ();
        let startZ = this.startCreateZ
        while (startZ < p_endZ) {
            let spawnItem1 = this.DoSpawnItem(this.startCreateZ);     
            this.startCreateZ += spawnItem1.spwanItemData.length + this._houseSpace;
            startZ = this.startCreateZ
        }
    }
    
    private randomScaleX:number = 1
    //置创建物体创建的属性,
    protected onSpawn(newGo: Laya.Sprite3D, spwanItemData: SpwanItemData, z) {
        newGo.transform.position = new Laya.Vector3(0, 0, z);
        if(newGo.transform.localScaleX == -1){
            newGo.transform.localScaleX = 1
        }
        newGo.transform.localScale = new Laya.Vector3(1 * this.randomScaleX,1,1)
    }

    protected DoSpawnItem(z: number): SpawnItem {

        //种子随机
        // let rndIdx = this.seed.getRandomInt_NotIncludeMax(0, this.spwanConfigObj.spwanItemDatas.length);
        let rndIdx = MathUtli.randomInt(0, this.spwanConfigObj.spwanItemDatas.length -1)
        //随机数据
        var spwanItemData = this.spwanConfigObj.spwanItemDatas[rndIdx];
        //对象池创建
        var item = Laya.Pool.getItemByCreateFun(spwanItemData.goName, () => { return this.CreateSpwanItem(spwanItemData); }, this) as SpawnItem;
        this.scene.addChild(item.gob);
        // item.spwanItemData.length = spwanItemData.length
        this.onSpawn(item.gob, spwanItemData, z);
       // item.gob.active = true;
        return item;
    }
}