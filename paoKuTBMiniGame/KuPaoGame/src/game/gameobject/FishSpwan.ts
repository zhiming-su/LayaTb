/*
 * @Date: 2021-06-09 10:44:28
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-09 14:45:31
 * @description: 
 */

import AABBShape from "../../JFrameWork/3DPhysics/AABBShape";
import { CollisionMask } from "../../JFrameWork/3DPhysics/ShapeThreeD";
import { BaseSpawn, SpawnItem, SpwanItemData } from "./BaseSpawn";


export class FishSpwan extends BaseSpawn {

    gap=0;
    xpos = 0;
    //重载生成方法，连续创建N条鱼
    Create2End() {
        var p_endZ = this.endZ();
        while (this.startCreateZ < p_endZ) {
            let arryNum = [-1.25, 0, 1.25];
            this.xpos = this.seed.getRandomIntArry(arryNum);
            for (let index = 0; index < 5; index++) {
                let spawnItem = this.DoSpawnItem(this.startCreateZ);
                this.startCreateZ += spawnItem.spwanItemData.length;
            }

            this.gap=this.seed.getRandomInt(10,30);
            this.startCreateZ+=this.gap;
        }
    }
    //重载创建方法
    //跑道有三条，障碍物被创建时随机放到左中右其中一个位置
    protected onSpawn(newGo: Laya.Sprite3D, spwanItemData: SpwanItemData, z) {
        newGo.transform.position = new Laya.Vector3(this.xpos, 0.41, z);
        //对象(鱼)被碰撞到了会隐藏
        //对象池重新使用激对象(鱼)
        newGo.active = true;
    }

    //碰撞器教程讲解
    protected CreateSpwanItem(spwanItemData: SpwanItemData): SpawnItem {
        let item = super.CreateSpwanItem(spwanItemData);
        let newgo = item.gob;
        let boxCollider = new AABBShape()
        boxCollider.mask = CollisionMask.Fish;
        boxCollider.collisionMask = 0;
        boxCollider.size = new Laya.Vector3(1, 1, 0.34);
        boxCollider.center = new Laya.Vector3(0, 0, 0);
        newgo.addComponentIntance(boxCollider);

        return item;
    }
}