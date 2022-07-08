import Layer from "./Layer";
import { LayerType } from "./LayerType";

/*
 * @Date: 2021-06-08 21:00:29
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-08 21:01:22
 * @description: 
 */
export default class TipsLayer extends Layer{
    constructor(){
        super(LayerType.Tip)
        this.init()
    }

    protected init():void{
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }
}