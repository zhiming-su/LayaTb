/*
 * @Date: 2021-06-08 10:46:11
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-10 20:08:08
 * @description: 
 */
import Input from "./InPut";
import Time from "./Time";


export class UnityEnagine extends Laya.Script {

    logFps = false;
    openAppTimeSc = 0;
    onAwake() {
        this.owner.addComponent(Input);
        this.openAppTimeSc = Laya.timer.currTimer * 0.001;
    }

    onUpdate() {
        Time.fixedDeltaTime = Laya.timer.delta;
        Time.deltaTime = Laya.timer.delta * 0.001;

        if (this.logFps)
            this.calFps();
        Time.time = Laya.timer.currTimer * 0.001 - this.openAppTimeSc;

        
    }


    fpsTime = 0;
    framCount = 0;
    fps = 0;
    fpsmin = 9999;
    fpsMax = 0;
    calFps() {

        this.framCount += 1;
        this.fpsTime += Time.deltaTime;
        if (this.fpsTime > 1) // 取固定时间间隔为1秒
        {
            this.fps = this.framCount;
            this.fpsTime = 0;
            this.framCount = 0;

            this.fpsMax += this.fps;
            if (this.fps < this.fpsmin)
                this.fpsmin = this.fps;
            console.log('fps 当前=', this.fps, '最小=', this.fpsmin, '总帧数', this.fpsMax);
        }

    }

}