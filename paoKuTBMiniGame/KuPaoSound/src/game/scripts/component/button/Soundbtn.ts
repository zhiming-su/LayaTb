/*
 * @Date: 2021-06-08 10:41:02
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-15 11:19:01
 * @description: 
 */

import SoundManager from "../../../../core/manager/SoundManager";
import Utils from "../../../util/Utils";

export default class SoundBtn extends Laya.Image {

    onAwake() {

        this.skin = SoundManager.isPlaySound() ? 'Textrue/btn_sound_on.png' : 'Textrue/btn_sound_off.png';

        Utils.addClickEvent(this, this, this.OnClick);
    }

    OnClick() {

        let isplay = !SoundManager.isPlaySound();
        SoundManager.setPlaySound(isplay);
        this.skin = isplay ? 'Textrue/btn_sound_on.png' : 'Textrue/btn_sound_off.png';

        if (isplay)
            SoundManager.instance.BgmPlaySetting();
        else
            SoundManager.instance.pauseBgm();

    }
}