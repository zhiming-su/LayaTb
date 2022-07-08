/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import sc01 from "./script/sc01"
import sc02 from "./script/sc02"
import sc03 from "./script/sc03"
import TweenSc from "./script/TweenSc"
import xx from "./script/xx"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=750;
    static height:number=1136;
    static scaleMode:string="fixedwidth";
    static screenMode:string="none";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="gameScene.scene";
    static sceneRoot:string="";
    static debug:boolean=true;
    static stat:boolean=true;
    static physicsDebug:boolean=true;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("script/sc01.ts",sc01);
        reg("script/sc02.ts",sc02);
        reg("script/sc03.ts",sc03);
        reg("script/TweenSc.ts",TweenSc);
        reg("script/xx.ts",xx);
    }
}
GameConfig.init();