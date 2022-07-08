import Layer from "./Layer";
import { LayerType } from "./LayerType";

/*
 * @Date: 2021-06-03 19:56:37
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-03 19:58:27
 * @description: 
 */
export default class Scene3DLayer extends Layer{
    constructor(){
        super(LayerType.Scene3D)
    }
}