const app = getApp();
const { cloud } = getApp();
const { function: fc } = cloud;
/**
 * 游戏数据接口文件
 */
class WxgamePlatform {
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

  /**
   * 分数
   * @param {*} score 
   */
  updateScore(score) {
    let updateGoldData = {
      success: true
    }
    console.log("score:", score)
    return new Promise((reslove, reject) => {
      reslove(updateGoldData)
    });
  }

  /**
   * 返回首页
   */
  goHome() {
    console.log("go Home")
    my.redirectTo({
      url: '/pages/home/home',
    });
  }


  /**
   * 再玩一次
   */
  getRest() {
    let playAgainData = {
      success: true,
      message: ""
    }
    return new Promise((reslove, reject) => {
      reslove(playAgainData)
    });
  }
  /**
   * 播放音效
   * @param {*} url 
   */
  playSound(url) {
    console.log(url);
    let baseUrl = "/pages/index/";
    const sound = my.createInnerAudioContext();
    sound.autoplay = true;
    sound.src = baseUrl + url;
    sound.onError((res) => {
      console.log(res.errMsg)
    });
    sound.onEnded(() => {
      // console.log('播放结束');
      sound.destroy()
    })
    // console.log(sound);
  }


}

var window = $global.window;
window.platform = new WxgamePlatform();