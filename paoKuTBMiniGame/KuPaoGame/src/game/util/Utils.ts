export default class Utils {
    constructor() { }

   

    static addClickEvent(btn: Laya.UIComponent, self, p_cb: Function, soundId?) {
        if (btn==null) return;
        btn.offAllCaller(self);


        let callback = function (event) {

            //this.clikTime = Time.time;

            // event.stopPropagation();
            if (p_cb) {

                p_cb.call(self, event);

            }
            // (soundId === 0 || soundId) && LayaSample.soundMgr.play(soundId);
            //SoundMgr.instance.clcik.Play();
        }

        btn.on(Laya.Event.CLICK, self, callback);


        //模拟按钮
        {
            let scaleTime = 60;
            //设置组件的中心点
            let wRatio = 1;
            // let aX = btn.anchorX;
            //let aY = btn.anchorY;


            btn.pivotX = btn.width * 0.5;
            btn.pivotY = btn.height * 0.5;;


            btn.x += btn.width * 0.5;
            btn.y += btn.height * 0.5;;
            //  let posX = btn.x * wRatio;
            // let posY = btn.y * wRatio;
            // let sX = btn.scaleX * wRatio;
            // let sY = btn.scaleX * wRatio;


            // let sSize = 0.9 * wRatio;
            // let aPos = 0.5;
            //按下时缩小按钮
            let cbDown = function (event) {
                event.stopPropagation();
                // btn.anchorX = aPos;
                // btn.anchorY = aPos;
                // btn.x = btn.width/2 + posX;
                // btn.y = btn.height/2 + posY;

                Laya.Tween.to(btn, { scaleX: 0.95, scaleY: 0.95, }, scaleTime);
            }
            btn.on(Laya.Event.MOUSE_DOWN, self, cbDown);
            //抬起时还原按钮
            let cbUp = function (event) {
                event.stopPropagation();
                // btn.anchorX = aX;
                // btn.anchorY = aY;
                // btn.x = posX;
                // btn.y = posY;
                Laya.Tween.to(btn, { scaleX: 1, scaleY: 1 }, scaleTime);
                //  if (cb) cb.call(self, event);
                (soundId === 0 || soundId);
            }
            btn.on(Laya.Event.MOUSE_UP, self, cbUp);
            //离开时还原按钮
            let cbOut = function (event) {
                event.stopPropagation();
                // btn.anchorX = aX;
                // btn.anchorY = aY;
                // btn.x = posX;
                // btn.y = posY;
                Laya.Tween.to(btn, { scaleX: 1, scaleY: 1 }, scaleTime);
            }
            btn.on(Laya.Event.MOUSE_OUT, self, cbOut);
        }
    }


    static addClickEventScale(btn: Laya.UIComponent, self, p_cb: Function,sacle:number, soundId?) {
        if (btn==null) return;
        btn.offAllCaller(self);


        let callback = function (event) {

            //this.clikTime = Time.time;

            // event.stopPropagation();
            if (p_cb) {

                p_cb.call(self, event);

            }
            // (soundId === 0 || soundId) && LayaSample.soundMgr.play(soundId);
            //SoundMgr.instance.clcik.Play();
        }

        btn.on(Laya.Event.CLICK, self, callback);


        //模拟按钮
        {
            let scaleTime = 60;
            //设置组件的中心点
            let wRatio = 1;
            // let aX = btn.anchorX;
            //let aY = btn.anchorY;


            btn.pivotX = btn.width * 0.5;
            btn.pivotY = btn.height * 0.5;;


            btn.x += btn.width * 0.5;
            btn.y += btn.height * 0.5;;
            //  let posX = btn.x * wRatio;
            // let posY = btn.y * wRatio;
            // let sX = btn.scaleX * wRatio;
            // let sY = btn.scaleX * wRatio;


            // let sSize = 0.9 * wRatio;
            // let aPos = 0.5;
            //按下时缩小按钮
            let cbDown = function (event) {
                event.stopPropagation();
                // btn.anchorX = aPos;
                // btn.anchorY = aPos;
                // btn.x = btn.width/2 + posX;
                // btn.y = btn.height/2 + posY;

                Laya.Tween.to(btn, { scaleX: sacle-0.05, scaleY:sacle-0.05, }, scaleTime);
            }
            btn.on(Laya.Event.MOUSE_DOWN, self, cbDown);
            //抬起时还原按钮
            let cbUp = function (event) {
                event.stopPropagation();
                // btn.anchorX = aX;
                // btn.anchorY = aY;
                // btn.x = posX;
                // btn.y = posY;
                Laya.Tween.to(btn, { scaleX: sacle, scaleY: sacle }, scaleTime);
                //  if (cb) cb.call(self, event);
                (soundId === 0 || soundId);
            }
            btn.on(Laya.Event.MOUSE_UP, self, cbUp);
            //离开时还原按钮
            let cbOut = function (event) {
                event.stopPropagation();
                // btn.anchorX = aX;
                // btn.anchorY = aY;
                // btn.x = posX;
                // btn.y = posY;
                Laya.Tween.to(btn, { scaleX: sacle, scaleY: sacle }, scaleTime);
            }
            btn.on(Laya.Event.MOUSE_OUT, self, cbOut);
        }
    }

    


    tweenShake(target, tweenTimer) {
        let timeLine = new Laya.TimeLine();
        let pivotX = target.pivotX;
        target.pivotX = target.width / 2;
        timeLine.addLabel("shake1", 0).to(target, { rotation: target.rotation + 5 }, 50, null, 0)
            .addLabel("shake2", 0).to(target, { rotation: target.rotation - 6 }, 50, null, 0)
            .addLabel("shake3", 0).to(target, { rotation: target.rotation - 13 }, 50, null, 0)
            .addLabel("shake4", 0).to(target, { rotation: target.rotation + 3 }, 50, null, 0)
            .addLabel("shake5", 0).to(target, { rotation: target.rotation - 5 }, 50, null, 0)
            .addLabel("shake6", 0).to(target, { rotation: target.rotation + 2 }, 50, null, 0)
            .addLabel("shake7", 0).to(target, { rotation: target.rotation - 8 }, 50, null, 0)
            .addLabel("shake8", 0).to(target, { rotation: target.rotation + 3 }, 50, null, 0)
            .addLabel("shake9", 0).to(target, { rotation: 0 }, 50, null, 0);
        if (!tweenTimer) {
            timeLine.on(Laya.Event.COMPLETE, this, function () {
                timeLine.destroy();
                target.rotation = 0;
                target.pivotX = pivotX;
            });
        } else {
            Laya.timer.once(500, this, function () {
                timeLine.destroy();
                target.rotation = 0;
                target.pivotX = pivotX;
            });
        }
        timeLine.play(0, true);
    }

    compareVersion(v1, v2) {
        v1 = v1.split('.');
        v2 = v2.split('.');
        let len = Math.max(v1.length, v2.length);

        while (v1.length < len) { v1.push('0'); }
        while (v2.length < len) { v2.push('0'); }

        for (let i = 0; i < len; i++) {
            let num1 = parseInt(v1[i]);
            let num2 = parseInt(v2[i]);

            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }

        return 0
    }


  

   

}