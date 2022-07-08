import BaseModule from "../../../core/base/BaseModule";
import LayerManager from "../../../core/manager/LayerManager";
import Log from "../../../core/util/Log";
import TimeUtil from "../../../core/util/TimeUtil";
import ModuleCenter from "../../../ModuleCenter";
import GlobalData from "../../data/GlobalData";
import ICollectionShopData from "../../interface/ICollectionShopData";
import GameScript from "../../scripts/game/GameScript";
import GameModule from "../game/GameModule";
import OverMoedl from "./OverModel";
import OverView from "./OverView";

/*
 * @Date: 2021-06-30 17:19:38
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-20 16:43:02
 * @description: 
 */
export default class OverModule extends BaseModule {
    private _controllView: OverView = null;
    private _gameModule: GameModule = null;
    private _getCollectionShopData: ICollectionShopData = null
    private _isGet: boolean = false
    constructor() {
        super()
    }

    protected addView(): void {
        this._view = new OverView()
        this._controllView = this._view as OverView
    }

    protected addModel(): void {
        this._model = new OverMoedl()
    }

    /**
     * 资源加载完成后打开
     */
    protected open(): void {
        this._gameModule = ModuleCenter.instance.gameModule
        this.addEvent()
        this.initView()
    }

    /**
     * 初始化UI
     */
    private initView(): void {
        if (GlobalData.gameOver) {
            this.openResultCon(true)
        } else {
            if (this.checkTimesOver()) {
                this.openResultCon(false)
            } else {
                this.openRebornCon()
            }
        }
    }

    /**
     * 添加监听
     */
    private addEvent(): void {
        this._controllView.reborn.clickHandler = Laya.Handler.create(this, this.onClickReborn, null, false)
        this._controllView.no.on(Laya.Event.CLICK, this, this.exitGame)

        this._controllView.btn_close.on(Laya.Event.CLICK, this, this.gotoHome)
        this._controllView.again.clickHandler = Laya.Handler.create(this, this.onClickAgainGame, null, false)
    }

    /**
     * 移除监听事件
     */
    private removeEvent(): void {
        this._controllView.reborn.clickHandler.recover()
        this._controllView.no.off(Laya.Event.CLICK, this, this.exitGame)

        this._controllView.btn_close.off(Laya.Event.CLICK, this, this.gotoHome)
        this._controllView.again.clickHandler.recover()
    }

    /**
     * 复活
     */
    private onClickReborn(): void {
        if (null == this._getCollectionShopData) {
            return
        }
        // console.log("_get:", this._isGet);
        if (this._isGet) return
        this._isGet = true
        window.platform.goodsCollected(this._getCollectionShopData.commodityId).then(
            (res) => {
                if (res.success == true) {
                    // this._isGet = true
                    this.closeWindow()
                    this._gameModule.model.setUsedCollectionShopArray(this._getCollectionShopData.commodityId)
                    GameScript.instance.player.Reborn();
                    // Log.log("------------------------商品",this._getCollectionShopData.commodityId,"收藏成功")
                } else {
                    this.openResultCon()
                    this._isGet = false
                }
            },
            (error) => {
                Log.log("服务器返回错误", error)
                ModuleCenter.instance.showTips("游戏异常，请联系客服")
            }
        )
    }

    /**
     * 退出并打开结算
     */
    private exitGame(): void {
        this.openResultCon()
    }

    /**
     * 关闭界面
     */
    public closeWindow(): void {
        this.removeEvent()
        super.closeWindow()
    }

    private gotoHome(isGameOver, score): void {
        this.closeWindow()
        if (GlobalData.isBaoXiang) {
            window.platform.goBoxHome(isGameOver, score);
        } else {
            window.platform.goHome()
        }
        ModuleCenter.instance.destory()
        LayerManager.instance.destory()
        Laya.stage.destroy()
        Log.log("游戏已销毁")
    }

    /**
     * 重新开始游戏
     */
    private onClickAgainGame(): void {
        let timeStart = this._gameModule.model.startTime
        let endTime = this._gameModule.model.endTime

        let startDate = TimeUtil.instance.toTimeStamp(timeStart)
        let endDate = TimeUtil.instance.toTimeStamp(endTime)
        let curTime = new Date().getTime()
        if (curTime < startDate) {
            ModuleCenter.instance.showTips("活动未开始")
            return
        }
        if (curTime > endDate) {
            ModuleCenter.instance.showTips("活动已结束")
            return
        }
        window.platform.getRest().then(
            (res) => {
                if (res.success == true) {
                    console.log("重新开始游戏")
                    this.closeWindow()
                    GlobalData.gameOver = false
                    ModuleCenter.instance.restartGame()
                } else {
                    ModuleCenter.instance.showTips("挑战次数不足，明日再来")
                }
            },
            (err) => {
                Log.log(err)
                ModuleCenter.instance.showTips("游戏异常，请联系客服")
            }
        );
    }

    /**
     * 打开结果界面
     */
    private openResultCon(gameOver: boolean = false): void {
        let datas = this._gameModule.model.getUsedCollectionShops()
        let len = datas.length
        if (GlobalData.isBaoXiang) {
            window.platform.updateGold(this._gameModule.model.fishCount, len, datas).then(
                (res) => {
                    if (res.success == true) {
                        this.gotoHome(gameOver, this._gameModule.model.fishCount)
                    } else {
                        ModuleCenter.instance.showTips("游戏异常，请联系客服")
                    }
                },
                (err) => {
                    Log.log(err)
                    ModuleCenter.instance.showTips("游戏异常，请联系客服")
                }
            )
        } else {
            this.changeContainer(true)
            this.changeResultBg(gameOver)
            this._controllView.updataGold(this._gameModule.model.fishCount)
            this._controllView.updataLabelCardsNumber(len)
            window.platform.updateGold(this._gameModule.model.fishCount, len, datas)
        }

    }

    /**
     * 结算背景
     */
    private changeResultBg(gameOver): void {
        this._controllView.win.visible = gameOver
        this._controllView.fail.visible = !gameOver
    }

    /**
     * 打开复活卡
     */
    private openRebornCon(): void {
        this._isGet = false
        this.changeContainer(false)
        this._controllView.setItemIamge(this._getCollectionShopData.imgUrl)
    }

    /**
     * 检测是否有复活次数
     */
    private checkTimesOver(): boolean {
        let timesOver: boolean = false
        if (this._gameModule.model.isOver()) {
            timesOver = true
        } else {
            timesOver = false
            this._getCollectionShopData = this._gameModule.model.getCollectionShopData()
        }
        return timesOver
    }

    /**
     * 控件显示隐藏
     * @param b 显示
     */
    private changeContainer(b: boolean): void {
        this._controllView.resultCon.visible = b
        this._controllView.rebornCon.visible = !b
    }

}