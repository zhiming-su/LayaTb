import Layer from "./Layer";
import { LayerType } from "./LayerType";

/*
 * @Date: 2021-06-03 19:58:45
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-04 16:32:52
 * @description: 
 */
export default class UILayer extends Layer{
    constructor(){
        super(LayerType.UI)
        this.init()
    }

    protected init():void{
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }
}