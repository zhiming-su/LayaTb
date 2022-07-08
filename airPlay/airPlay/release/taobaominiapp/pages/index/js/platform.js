
class TBgamePlatform {
  /**
   * 初始化数据
   */

  goHome() {
    //console.log("aaaaaaaaaaaaaaaa")
    return new Promise((resolve) => {
      console.log("aaaaaaaaaaaaaaaa")
      // retInfo.userInfo.guideStep = 0;
      resolve("aaabbbbbbbbbbbbbbbb")
    })
  }
}



var window = $global.window;
window.platform = new TBgamePlatform();