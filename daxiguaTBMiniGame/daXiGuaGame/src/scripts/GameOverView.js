/**
*
* @ author:wcysky
* @ email:xxxxxx@gmail.com
* @ data: 2021-08-05 10:15
*/
export default class GameOverView extends Laya.Scene {

    constructor() {
        super();
    }

    onOpened(score) {
        if (this.txt_Score) {
            this.txt_Score.text = score;
        }
    }
}