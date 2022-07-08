import SystemAcion from "../../../../JFrameWork/Core/SystemAcion";
import Utils from "../../../util/Utils";

export default class CustomTab extends Laya.Script {




    /** @prop {name:btnBack, tips:"返回按钮", type:Node}*/
    btnBack: any;


    /** @prop {name:selectres,tips:"选中的图片背景",type:string,,accept:res}*/
    public selectres = "";

    /** @prop {name:unselectres,tips:"不选中的图片背景",type:string,,accept:res}*/
    public unselectres = "";


    /** @prop {name:selectFont,tips:"选中的图片地址，逗号分隔",type:string}*/
    public selectFont = "";


    /** @prop {name:unselectFont,tips:"不选中的图片地址，逗号分隔",type:string}*/
    public unselectFont = "";


    childs: Laya.Image[] = [];

    childsFont: Laya.Image[] = [];

    lastSelect: Laya.Image;

    selectFontarr = [];
    unselectFontarr = [];

    /** @prop {name:unselectYoffset, tips:"unselectY", type:number}*/
    unselectYoffset: number;


    orgy = 0;
    hasClick = false;

    ontabSelect: SystemAcion = new SystemAcion();
    onEnable() {
        this._onStart();
    }

    _onStart() {
        let root = this.owner as Laya.Image;

        this.selectFontarr = this.selectFont.split(',');
        this.unselectFontarr = this.unselectFont.split(',');

        for (let index = 0; index < root.numChildren; index++) {


            if (root.getChildAt(index).name == 'tab') {
                let c = root.getChildAt(index) as Laya.Image;
                this.childs.push(c);
                this.childsFont.push(c.getChildAt(0) as Laya.Image);
                Utils.addClickEvent(c, this, () => {
                    this.Select(index);
                });

            }

        }
    }
   

    Select(idx: number) {


        if (this.hasClick == false) {
            this.orgy = this.childs[0].y;
            this.hasClick = true;
        }


        for (let index = 0; index < this.childs.length; index++) {
            this.unSelect(index);

        }


        this.childs[idx].skin = this.selectres;

        this.childsFont[idx].skin = this.selectFontarr[idx];

        this.lastSelect = this.childs[idx];

        this.childs[idx].y = this.orgy;

        this.ontabSelect.Invoke_par(idx);

    }

    unSelect(idx: number) {
        this.childs[idx].skin = this.unselectres;
        this.childsFont[idx].skin = this.unselectFontarr[idx];
        this.childs[idx].y = this.orgy + this.unselectYoffset;
    }
}