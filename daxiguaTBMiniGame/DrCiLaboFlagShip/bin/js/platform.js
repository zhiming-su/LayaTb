/**
 * 游戏数据接口文件
 */
class WxgamePlatform {
    // name = 'wxgame'
    setKeepScreenOn() {
        return new Promise((resolve, reject) => {
            wx.setKeepScreenOn({
                keepScreenOn: true,
                success: function (res) {
                    resolve(res);
                }
            })
        })
    }


    doInitActivity() {
        let initData = {
            success: true,
            isNewPlayer: true,
            scoreName: "曜白值",
            maxlevelPrizeName: "华为P150 pro手机",
        }

        return new Promise(function (reslove, reject) {
            reslove(initData);
        });
    }
    /**
     * 分数
     * @param {*} score 
     */
    updateScore(score) {
        let updateGoldData = {
            success: true,
            message: ""
        }
        console.log("score:", score)
        return new Promise(function (reslove, reject) {
            reslove(updateGoldData)
        });
    }

    /**
     * 返回首页
     */
    goHome() {
        console.log("go Home")
    }
    /**
     * 再玩一次
     * @returns 
     */
    getRest() {
        let playAgainData = {
            success: true,
            message: ""
        }
        return new Promise(function (reslove, reject) {
            reslove(playAgainData)
        });
    }

    /**
     * 播放音效
     * @param {*} url 
     */
    playSound(url) {
        console.log(url);
    }

    /**
     * 播放背景音乐
     * @param {*} url 
     */
    playMusic(url, loop = true) {
        var music = new Object;
        console.log("Music:", url);

        music.loop = loop;
        music.startTime = 0;
        music.autoplay = true;

        music.onPlay = (() => {
            console.log('onPlay music')
        });
        music.play = (() => {
            console.log('play music')
        });
        music.onError = ((res) => {
            console.log("sound error:", res.errMsg)
        });
        music.onEnded = (() => {
            console.log('end music')
        });
        music.destroy = (() => {
            console.log('destroy music')
        });
        return music
    }

}

var window = window;
window.platform = new WxgamePlatform();