import Dictionary from "../util/Dictionary";

export default class TweenManager  {

    static _instance;
    public static get instance():TweenManager{
        if(this._instance == null){
         this._instance = new TweenManager();
     }
     return this._instance;
  }


    private targets: any[] = [];
    private dic: Dictionary<string,any> = new Dictionary<string,any>();


    /**
     * 渐变动画，渐变到目标值
     * @param {object} target 
     * @param {number} alpha 
     * @param {number} duration 
     * @param {boolean} isLoop 
     */
    toAlpha(target, alpha, duration, isLoop = false, startAlpha = 1) {
        this.saveTarget(target);

        target.alpha = startAlpha;
        alpha1();

        function alpha1() {
            let handler = isLoop ? new Laya.Handler(this, alpha2) : null;
            Laya.Tween.to(target, { alpha: alpha }, duration, null, handler);
        }

        function alpha2() {
            Laya.Tween.to(target, { alpha: 1 }, duration, null, Laya.Handler.create(this, alpha1));
        }
    }

    /**
     * 缩放动画,缩放到目标值
     * @param {object} target 
     * @param {number} scale 
     * @param {number} duration 
     * @param {boolean} isLoop 
     */
    toScale(target, scale, duration, isReset, isLoop = false, scaley = scale) {
        this.saveTarget(target);

        target.scaleX = 1;
        target.scaleY = 1;
        scale1();

        function scale1() {
            let handler = isLoop || isReset ? new Laya.Handler(this, scale2) : null;
            Laya.Tween.to(target, { scaleX: scaley, scaleY: scaley }, duration, null, handler);
        }

        function scale2() {
            let handler = isLoop ? new Laya.Handler(this, scale1) : null;
            Laya.Tween.to(target, { scaleX: 1, scaleY: 1 }, duration, null, handler);
        }
    }


    toScale_Jie(target, x, y,x2,y2, duration,duration2,ease) {
        this.saveTarget(target);

        //Laya.Ease.backInOut

        Laya.Tween.to(target, { scaleX: x, scaleY: y }, duration,ease);

        Laya.Tween.to(target, { scaleX: x2, scaleY: y2 }, duration2,ease,null,duration);
    }

    toTop(target:Laya.UIComponent,  y, duration,ease) {
        this.saveTarget(target);

        //Laya.Ease.backInOut
        //target.top
        Laya.Tween.to(target, { top: y }, duration,ease);
    }

    /**
     * 位移动画，移动到指定位置
     * @param target 
     * @param pos 
     * @param duration 
     * @param isLoop 
     */
    toPosition(target, pos: Laya.Vector2, duration, isLoop = false, type = 0) {
        this.saveTarget(target);

        let curPos = new Laya.Vector2(target.x, target.y);
        pos1();

        function pos1() {
            if (isLoop) {
                switch (type) {
                    case 0:
                        var handler = new Laya.Handler(this, pos2);
                        break;
                    case 1:
                        var handler = new Laya.Handler(this, pos3);
                        break;
                }
            }
            // let t=Laya.Ease.linearIn;
            // let handler = isLoop ? new Laya.Handler(this, pos2) : null;



            Laya.Tween.to(target, { x: pos.x, y: pos.y }, duration, null, handler);
        }



        function pos2() {
            Laya.Tween.to(target, { x: curPos.x, y: curPos.y }, duration, null, Laya.Handler.create(this, pos1));
        }

        function pos3() {
            target.x = curPos.x;
            target.y = curPos.y;
            pos1();
        }
    }


    toPositionEase(target, pos: Laya.Vector2, duration, isLoop = false, ease, type = 0) {
        this.saveTarget(target);

        let curPos = new Laya.Vector2(target.x, target.y);
        pos1();

        function pos1() {
            if (isLoop) {
                switch (type) {
                    case 0:
                        var handler = new Laya.Handler(this, pos2);
                        break;
                    case 1:
                        var handler = new Laya.Handler(this, pos3);
                        break;
                }
            }
            // let t=Laya.Ease.linearIn;
            // let handler = isLoop ? new Laya.Handler(this, pos2) : null;



            Laya.Tween.to(target, { x: pos.x, y: pos.y }, duration, ease, handler);
        }



        function pos2() {
            Laya.Tween.to(target, { x: curPos.x, y: curPos.y }, duration, null, Laya.Handler.create(this, pos1));
        }

        function pos3() {
            target.x = curPos.x;
            target.y = curPos.y;
            pos1();
        }
    }


    toPositionRePlay(target, endpos: Laya.Vector2, duration) {
        this.saveTarget(target);

        let satrtPos = new Laya.Vector2(target.x, target.y);
        pos1();

        function pos1() {

            target.x = satrtPos.x;
            target.y = satrtPos.y;

            var compeltehandler = new Laya.Handler(this, pos1);

            // let t=Laya.Ease.linearIn;
            // let handler = isLoop ? new Laya.Handler(this, pos2) : null;



            Laya.Tween.to(target, { x: endpos.x, y: endpos.y }, duration, null, compeltehandler);
        }






    }

    toPositionRePlayEase(target, endpos: Laya.Vector2, duration, ease) {
        this.saveTarget(target);

        let satrtPos = new Laya.Vector2(target.x, target.y);
        pos1();

        function pos1() {

            target.x = satrtPos.x;
            target.y = satrtPos.y;

            var compeltehandler = new Laya.Handler(this, pos1);

            // let t=Laya.Ease.linearIn;
            // let handler = isLoop ? new Laya.Handler(this, pos2) : null;



            Laya.Tween.to(target, { x: endpos.x, y: endpos.y }, duration, ease, compeltehandler);
        }






    }

    fromAlpha(target, alpha, duration, isLoop = false) {
        this.saveTarget(target);

        target.alpha = 1;
        alpha1();

        function alpha1() {
            let handler = isLoop ? new Laya.Handler(this, alpha2) : null;
            Laya.Tween.from(target, { alpha: alpha }, duration, null, handler);
        }

        function alpha2() {
            Laya.Tween.from(target, { alpha: 1 }, duration, null, Laya.Handler.create(this, alpha1));
        }
    }

    fromScale(target, scale, duration, isLoop = false) {
        this.saveTarget(target);
        scale1();

        function scale1() {
            let handler = isLoop ? new Laya.Handler(this, scale2) : null;
            Laya.Tween.from(target, { scaleX: scale, scaleY: scale }, duration, null, handler);
        }

        function scale2() {
            Laya.Tween.from(target, { scaleX: 1, scaleY: 1 }, duration, null, Laya.Handler.create(this, scale1));
        }
    }

    // coinCollectAnim(startPos, endPos, parent, amount = 15, callBack = null) {
    //     this.amount = amount;
    //     for (var i = 0; i < amount; i++) {
    //         let coin = Laya.Pool.getItemByClass("coin", Laya.Image);
    //         coin.skin = "ui/icon_coin.png";
    //         coin.x = startPos.x;
    //         coin.y = startPos.y;
    //         parent.addChild(coin);

    //         let time = 300 + Math.random() * 100 - 50;
    //         Laya.Tween.to(coin, { x: coin.x + Math.random() * 250 - 125, y: coin.y + Math.random() * 250 - 125 }, time);
    //         Laya.timer.once(time + 50, this, function () {
    //             Laya.Tween.to(coin, { x: endPos.x, y: endPos.y }, 400, null, new Laya.Handler(this, function () {
    //                 parent.removeChild(coin);
    //                 Laya.Pool.recover("coin", coin);
    //                 this.amount--;

    //                 if(this.amount == 0 && callBack) callBack(parent);
    //             }));
    //         })
    //     }
    // }

    /**
     * 数字跳变动画
     * @param start 起始值
     * @param end 目标值
     * @param duration 时间
     */
    numberAnim(start: number, end: number, duration: number, methon: Function, caller) {
        let target: any = {};
        target.value = start;
        let ud = Laya.Tween.to(target, { value: end }, duration);
        ud.update = new Laya.Handler(this, function () {
            methon.call(target.value, caller);
        });
    }

    saveTarget(target: Laya.Sprite) {
        let targets = this.dic.getValue(target.scene.url);
        if (targets) {
            targets.push(target);
        }
        else {
            targets = [];
            targets.push(target);
            this.dic.setValue(target.scene.url, targets);
        }
    }

    clearAll(target) {
        let targets = this.dic.getValue(target.scene.url);
        if (!targets) return;
        targets.forEach(t => {
            Laya.Tween.clearAll(t);
        });
        targets = [];
    }




    toScaleExt(target: Laya.Sprite, p_startx, p_starty, p_scalex, p_scaley, duration, isLoop) {
        this.saveTarget(target);

        target.scaleX = p_startx;
        target.scaleY = p_starty;
        scale1();

        function scale1() {
            let handler = isLoop ? new Laya.Handler(this, scale2) : null;
            Laya.Tween.to(target, { scaleX: p_scalex, scaleY: p_scaley }, duration, Laya.Ease.linearOut, handler);
        }

        function scale2() {
            let handler = isLoop ? new Laya.Handler(this, scale1) : null;
            Laya.Tween.to(target, { scaleX: 1, scaleY: 1 }, duration, Laya.Ease.linearOut, handler);
        }
    }


    toPositionExt(target, pos: Laya.Vector2, duration) {
        this.saveTarget(target);
        // let handler = isLoop ? new Laya.Handler(this, pos2) : null;
        Laya.Tween.to(target, { x: pos.x, y: pos.y }, duration, Laya.Ease.linearOut);
    }

    toPositionPingPongOnece(target: Laya.Sprite, pos: Laya.Vector2, duration) {
        this.saveTarget(target);
        // let handler = isLoop ? new Laya.Handler(this, pos2) : null;

        Laya.Tween.clearTween(target);

        let startPos = new Laya.Vector2(target.x, target.y);
        let handler = new Laya.Handler(this, backToStartPos);
        function backToStartPos() {

            Laya.Tween.to(target, { x: startPos.x, t: startPos.y }, duration, Laya.Ease.linearOut, null);
        }

        Laya.Tween.to(target, { x: pos.x, y: pos.y }, duration, Laya.Ease.linearOut, handler);
    }


    toPosition_PingPong_Onece_delay(target: Laya.Sprite, pos: Laya.Vector2, duration: number, delay: number) {
        this.saveTarget(target);
        // let handler = isLoop ? new Laya.Handler(this, pos2) : null;
        Laya.Tween.clearTween(target);
        let startPos = new Laya.Vector2(target.x, target.y);
        let handler = new Laya.Handler(this, backToStartPos);
        function backToStartPos() {

            Laya.Tween.to(target, { x: startPos.x, t: startPos.y }, duration, Laya.Ease.quadInOut, null, delay);
        }

        Laya.Tween.to(target, { x: pos.x, y: pos.y }, duration, Laya.Ease.quartIn, handler);
    }


    toPosition__Box_PingPong_Onece_delay(target: Laya.Box, p_right: number, duration: number, delay: number) {
        this.saveTarget(target);
        // let handler = isLoop ? new Laya.Handler(this, pos2) : null;
        Laya.Tween.clearTween(target);
        let startright = target.right;
        let handler = new Laya.Handler(this, backToStartPos);
        function backToStartPos() {

            Laya.Tween.to(target, { right: startright }, duration, Laya.Ease.quadInOut, null, delay);
        }
        //   target.right
        Laya.Tween.to(target, { right: p_right }, duration, Laya.Ease.quartIn, handler);
    }

    toScaleRePlay(target:Laya.UIComponent, endpos: Laya.Vector2, duration) {
        this.saveTarget(target);

        let satrtScale= new Laya.Vector2(target.scaleX, target.scaleY);
        pos1();

        function pos1() {

            target.scaleX= satrtScale.x;
            target.scaleY = satrtScale.y;

            var compeltehandler = new Laya.Handler(this, pos1);

            // let t=Laya.Ease.linearIn;
            // let handler = isLoop ? new Laya.Handler(this, pos2) : null;



            Laya.Tween.to(target, { scaleX: endpos.x, scaleY: endpos.y }, duration, null, compeltehandler);
        }






    }



}