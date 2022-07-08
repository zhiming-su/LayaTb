import BaseView from "../../../core/base/BaseView"
import TipsLayer from "../../../core/base/layer/TipsLayer";
import LayerManager from "../../../core/manager/LayerManager";

/*
 * @Date: 2021-06-09 15:07:47
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-01 15:25:09
 * @description: 
 */
export default class ToastView extends BaseView{
    public bg: Laya.Image;
    public tip: Laya.Text;
    private toasMgsarr:Array<string> = null
    private toasShowing:boolean = false
    constructor(){
        super()
        this.toasMgsarr = new Array()
    }

    protected setBindUrl():void{
        this._atlasUrl = "res/atlas/common.atlas"
        this.url = 'views/tip.json'
    }

    protected setParentLayer():void{
        this._parentLayer = LayerManager.instance.getLayer(TipsLayer)
    }

    /**
    * 初始化子节点（文件模式取值）
    */
    protected initChildren():void{
        
    }

    public pushtoas(str) {
        this.toasMgsarr.push(str);
        this.showtoas();
    }
     
    private showtoas():void{
        let time = 1500;
        if (this.toasShowing) return;
        this.bg.visible = true;
        this.toasShowing = true;

        let item = this.toasMgsarr.shift();
        if (this.toasMgsarr.length >= 2) time = 600;

        if (item == null) {
            this.toasShowing = false;
            this.bg.visible = false;
            return;
        }


        this.tip.text = item;
        Laya.timer.once(time, this, this.distoasImg, null, true);
    }

    private distoasImg():void{
        this.toasShowing = false;
        this.bg.visible = false;
        this.showtoas();
    }
}