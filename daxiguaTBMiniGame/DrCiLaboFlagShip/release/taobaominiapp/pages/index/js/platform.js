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

  doInitActivity() {
    let initData = {
      success: true,
      isNewPlayer: true,
      scoreName: "曜白值",
      maxlevelPrizeName: "华为P50 Pro手机",
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


}

var window = $global.window;
window.platform = new WxgamePlatform();