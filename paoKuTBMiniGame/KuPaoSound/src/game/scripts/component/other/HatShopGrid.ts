/*
 * @Date: 2021-06-09 16:06:26
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-10 15:20:47
 * @description: 
 */
import { Theme } from "../../../../JFrameWork/Game/DataController";
import CustomGrildShopItem from "./CustomGrid";







export default class HatShopGrid extends CustomGrildShopItem {


     /** @prop {name:buyKey,tips:"buyKey",type:string}*/
   
    
 
     
     /** @prop {name:selectSkin,tips:"选中的背景skin",type:string,accept:res}*/
 
 
     /** @prop {name:unselecSkin,tips:"未选中的背景skin",type:string,accept:res}*/
   
    initData() {
        let t = new Theme();
        t.require_type = 1;
        t.icon = '';
        this.theme.push(t);

        t = new Theme();
        t.require_type = 3;
        t.require_num = 2;
        t.icon = 'ui/ShopRope/hat/WorkerHat.PNG';
        this.theme.push(t);
        

        t = new Theme();
        t.require_type = 2;
        t.require_num = 2000;
        t.icon = 'ui/ShopRope/hat/FancyHat.PNG';
        this.theme.push(t);

        t = new Theme();
        t.require_type = 2;
        t.require_num = 3000;
        t.icon = 'ui/ShopRope/hat/PartyHat.PNG';
        this.theme.push(t);

       
    }





}