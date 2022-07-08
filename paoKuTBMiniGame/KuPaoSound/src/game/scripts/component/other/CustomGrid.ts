import { EventType } from "../../../../core/event/EventType";
import { EventManager } from "../../../../core/manager/EventManager";
import SoundManager from "../../../../core/manager/SoundManager";
import SystemAcion from "../../../../JFrameWork/Core/SystemAcion";
import { Theme } from "../../../../JFrameWork/Game/DataController";
import ModuleCenter from "../../../../ModuleCenter";
import PlayerPrefs from "../../../../unityEngine/PlayerPrefs";
import Utils from "../../../util/Utils";

class ShopItem {
    public type = 0;

}

export default class CustomGrildShopItem extends Laya.Script {

    /** @prop {name:buyKey,tips:"buyKey",type:string}*/
    buyKey = 'charater';

    // require_type=1  表示登陆注册即赠送解锁  无需花费
    //require_type=2  require_num=1000  就表示金币解锁   需要花费1000金币
    //require_type=3  require_num=2        就表示看视频解锁，累计需要看2次

    theme:Theme[] = [];
    //itemLength = 0;
    root: Laya.Image;

    
    /** @prop {name:selectSkin,tips:"选中的背景skin",type:string,accept:res}*/
    public selectSkin = "";

    /** @prop {name:unselecSkin,tips:"未选中的背景skin",type:string,accept:res}*/
    public unselecSkin = "";

    childs: Laya.Image[] = [];

    childsCoin: Laya.Sprite[] = [];

    goldsLabel: Laya.FontClip[] = [];

    lastSelectIdx = -1;
    lastSelectStr = '';

    priecestr: string[] = [];
    priece: number[] = [];
    
    /**0金币 1 视频 */
    itemBuyType = [];
    
    ontabSelect: SystemAcion = new SystemAcion();
    videoGroundArry = [];
    cotinGroundArry = [];


    itemArry = [];
    //alreadtbuy = [];


    public Show(visble) {
        let b = this.owner as Laya.Box;
        b.visible = visble;
    }


    onEnable() {
        this._onStart();
    }


    initData() {
        let t = new Theme();
        t.require_type = 1;
        t.icon = 'shop/charater/CatIcone.PNG';
        this.theme.push(t);

        t = new Theme();
        t.require_type = 2;
        t.require_num = 2000;
        t.icon = 'shopcharater/RacoonIcone.PNG';
        this.theme.push(t);
    }

    _onStart() {

        this.initData();


        this.root = this.owner as Laya.Image;
        this.priecestr = [];

        this.priece = [];


        for (let index = 0; index < this.theme.length; index++) {
            this.priecestr.push(this.theme[index].require_num.toString());
            this.priece.push(this.theme[index].require_num);
        }

        // //图标个数
        // for (let index = 0; index < 5; index++) {
        //     (this.root.getChildAt(index) as Laya.Image).visible = false;

        // }


        for (let index = 0; index < this.theme.length; index++) {
            {


                let item = this.root.getChildAt(index) as Laya.Image;
                // item.visible = true;

                let icon = item.getChildAt(0) as Laya.Image;

                icon.skin = this.theme[index].icon;

                this.childs.push(item);
                this.itemArry.push(item);

                let status: any = item.getChildAt(3);
                status.visible = false;

                let isCoin = false;

                let videoGround = item.getChildByName('video') as Laya.Image;

                videoGround.visible = true;


                let coinGround = item.getChildByName('gold') as Laya.Image;

                coinGround.visible = false;


                if (this.theme[index].require_type == 1) {
                    PlayerPrefs.SetInt(this.buyKey + index, 1);
                }
                else if (this.theme[index].require_type == 3) {
                    videoGround.visible = true;
                    coinGround.visible = false;

                    this.itemBuyType[index] = 1;
                } else
                    this.itemBuyType[index] = 0;

                this.videoGroundArry.push(videoGround);
                this.cotinGroundArry.push(coinGround);

                // this.childsCoin.push(coinGround.getChildAt(0) as Laya.Sprite);
                this.childsCoin.push(coinGround.getChildAt(0) as Laya.Sprite);
                this.goldsLabel.push(coinGround.getChildAt(1) as Laya.FontClip);


                if (index >= this.priece.length) item.visible = false;




                Utils.addClickEvent(item, this, () => {
                    this.Select(index);
                });

            }

        }



        this.updateView();

        // let idx = PlayerPrefs.GetInt('shopSelectRope', 0);
        this.Select(this.defultIdx);
    }

    public defultIdx = 0;

    updateView() {
        let saveData = [];
        for (let index = 0; index < this.theme.length; index++) {


            let isHas = (PlayerPrefs.GetInt(this.buyKey + index, 0) == 1);

            this.childsCoin[index].visible = !isHas;

            //  if (this.c)

            this.videoGroundArry[index].visible = false;
            this.cotinGroundArry[index].visible = false;

            if (isHas) {
                // this.childsLabel[index].text = '使用';
                this.videoGroundArry[index].visible = false;
                this.cotinGroundArry[index].visible = false;

                this.videoGroundArry[index].visible = false;
                this.cotinGroundArry[index].visible = true;


                this.setStateText(index, '已拥有');
                if (this.lastSelectIdx == index)
                    this.setStateText(index, '使用中');
            }

            else if (this.itemBuyType[index] == 0) {
                this.cotinGroundArry[index].visible = true;
                this.goldsLabel[index].value = this.priecestr[index];
            } else {
                this.videoGroundArry[index].visible = true;
                let videocount = PlayerPrefs.GetInt('ropeVideo' + index, 0);
                this.videoGroundArry[index].getChildAt(0).value = videocount + '/' + this.theme[index].require_num;

            }
        }




    }



    onVideoEndRope(idx: number) {


        ModuleCenter.instance.showTips('视频奖励+1');
        let videocount = PlayerPrefs.GetInt('ropeVideo' + idx, 0);
        videocount += 1;
        PlayerPrefs.SetInt('ropeVideo' + idx, videocount);
        if (videocount >= this.theme[idx].require_num) {
            PlayerPrefs.SetInt(this.buyKey + idx, 1);

            this.videoGroundArry[idx].visible = false;

            SoundManager.instance.BuyOk.Play();
        }

        this.updateView();
    }


    Select(idx: number) {

        let isHas = (PlayerPrefs.GetInt(this.buyKey + idx, 0) == 1);
        let getUseVideo: boolean = this.itemBuyType[idx] == 1;

        //pc下直接获得
        if (getUseVideo && isHas == false) {

            let videocount = PlayerPrefs.GetInt('ropeVideo' + idx, 0);


            // BannerAndVideo1.ShowVideo(this, (isEnd) => {
            //     if (isEnd) {
            //         this.onVideoEndRope(idx);
            //     }

            // });
            return;
        }



        if (!isHas) {
            this.buyRope(idx);
            return;
        }


        if (this.lastSelectIdx != -1) {
            this.unSelect(this.lastSelectIdx);
        }

        this.childs[idx].skin = this.selectSkin;

        //   this.childsLabel[idx].text = '使用中';

        this.lastSelectIdx = idx;
        //  this.lastSelectStr=this

        //  this.childs[idx].y = this.orgy;
        this.updateView();
        this.ontabSelect.Invoke_par(idx);

    }

    unSelect(idx: number) {
        this.childs[idx].skin = this.unselecSkin;

    }

    buyRope(idx: number) {
        // let gold = DataManager.GetGold();
        // let priece = this.priece[idx];
        // if (gold >= this.priece[idx]) {
        //     PlayerPrefs.SetInt(this.buyKey + idx, 1);
        //     this.updateView();
        //     ModuleCenter.instance.showTips('购买成功');
        //     SoundManager.instance.BuyOk.Play();
        // } else {
        //     ModuleCenter.instance.showTips('金币不足');
        //     return;
        // }

        // gold -= priece;
        //  DataManager.SetGold(gold);
        // EventManager.instance.event(EventType.UpdateGoldItemUi);
        //  let gold = GameSample.storageMgr.GetGlod();
    }


    setStateText(index, str) {

        let item = this.itemArry[index];
        let statusFont = item.getChildAt(3);

        statusFont.visible = true;

        // coinlb.text = str;
        if (str == '使用中')
            statusFont.value = '1'
        else
            statusFont.value = '2';

        //coinlb.x = 45;
        let icon: any = item.getChildAt(2);
        icon.visible = false;

        let video: any = item.getChildAt(1);
        video.visible = false;
    }

}