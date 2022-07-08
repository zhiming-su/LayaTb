/*
 * @Date: 2021-06-08 10:41:02
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-08 10:59:32
 * @description: 
 */

import { Platform } from "../../../platform/Platform";
import Utils from "../../../util/Utils";

export default class VibrateBtn extends Laya.Image {

    onAwake() {

        this.skin = Platform.isPlayVibrate() ? 'Textrue/btn_vibrate_on.png' : 'Textrue/btn_vibrate_off.png';

        Utils.addClickEvent(this, this, this.OnClick);
    }

    OnClick() {

        let isplay = !Platform.isPlayVibrate();
        Platform.setPlayVibrate(isplay);
        this.skin = isplay ? 'Textrue/btn_vibrate_on.png' : 'Textrue/btn_vibrate_off.png';
        console.log('Vibrate', isplay)
    }
}