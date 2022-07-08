/**
*
* @ email:xxxxxx@gmail.com
* @ data: 2021-08-05 10:15
已合成 城野医生美肌所
游戏结束
*/
export default class GameOverView extends Laya.Scene {

    constructor() {
        super();
    }

    onOpened(gameOverData) {
        // console.log("gameOverData:", gameOverData);
        if (this.txt_Score) {
            this.txt_Score.text = gameOverData.score;
            this.scoreDecsLabel.text = "本次游戏获得的" + gameOverData.scoreName;
            this.remark.text = "*继续挑战有机会冲刺" + gameOverData.maxLevelPrizeName;
            this.remark2.text = "累积到一定" + gameOverData.scoreName + "可参与兑换活动";
            if (gameOverData.isMaxElement) {
                this.tipsLabel.text = "已合成 城野医生美肌所";
                this.gameOverLabel.text = "游戏结束";
            }
        }
    }
}