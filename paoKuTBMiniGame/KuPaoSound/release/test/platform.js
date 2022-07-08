const app = getApp();
const { cloud } = getApp();
const { function: fc } = cloud;

/**
 * 游戏测试数据接口文件
 */
var isGuide = false;
var startTime = "2021-06-21 14:10:41";
var endTime = "2021-08-21 14:06:00";
var collectionCommoditys = [
  {
    imgUrl: "https://img.alicdn.com/bao/uploaded/i2/678229678/O1CN01GKyium2LMZo4MsCDy_!!678229678.jpg",
    price: "100.00",
    commodityId: 645466337019,
    title: "赠品宝贝 测试宝贝勿拍 不发货"
  },
  {
    imgUrl: "https://img.alicdn.com/bao/uploaded/i4/678229678/TB2POe1XuYyQeBjSszcXXbIRpXa_!!678229678.jpg",
    price: "1.00",
    commodityId: 635907352852,
    title: "测试拼团宝贝不发货"
  },
  {
    imgUrl: "https://img.alicdn.com/bao/uploaded/i2/678229678/TB2pZm2XqzyQeBjy0FgXXbnsVXa_!!678229678.jpg",
    price: "100.10",
    commodityId: 640626360965,
    title: "测试拼团宝贝不发货毛&ldquo;衣毛&quot;衣"
  }
];

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

  /**
   * 游戏初始化数据
   */
  doInitActivity() {
    let initData = {
      success: true,
      message: "",
      isGuide: isGuide,//是否新手引导
      startTime: startTime,//活动开始时间
      endTime: endTime,//活动结束时间
      collectionCommoditys: collectionCommoditys,
    };
    return new Promise((resolve, reject) => {
      resolve(initData)
      // reject('失败')
    })
  }

  /**
   * 分数,复活卡,收藏商品ID
   * @param {*} gold 
   */
  updateGold(gold, resurrectionCards, commodityIds) {
    let updateGoldData = {
      success: true
    }
    console.log("score:", { gold, resurrectionCards, commodityIds })
    return new Promise(function (reslove, reject) {
      reslove(updateGoldData)
    });
  }

  /**
   * 再玩一次
   */
  getRest() {
    isGuide = false;
    collectionCommoditys = [
      {
        "imgUrl": "https://img.alicdn.com/bao/uploaded/i1/678229678/O1CN01ZOCbWK2LMZmBbKfci_!!678229678.jpg",
        "price": "138.00",
        "commodityId": 643826187389,
        "title": "测试不发货！"
      },
      {
        "imgUrl": "https://img.alicdn.com/bao/uploaded/i3/678229678/O1CN01b6MiS22LMZmQUsNOM_!!678229678.jpg",
        "price": "169.00",
        "commodityId": 636210893430,
        "title": "婴儿男童短袖空调动漫薄款休闲宝宝儿童童装卡通套头女童裤子夏装"
      },
      {
        "imgUrl": "https://img.alicdn.com/bao/uploaded/i1/678229678/O1CN01vyvVHY2LMZmHXedfr_!!678229678.jpg",
        "price": "120.00",
        "commodityId": 641859502014,
        "title": "婴儿测试商品1"
      }
    ];
    let restData = {
      success: true,
      message: ""
    };
    return new Promise((resolve, reject) => {
      resolve(restData)
    })
  }
  /**
   * 返回宝箱首页
   * @param {*} isNormalGameOver 
   * @param {*} score 
   */
  goBoxHome(isNormalGameOver, score) {
    console.log("go Box Home:", { isNormalGameOver, score });
  }

  /**
   * 返回首页
   */
  goHome() {
    console.log("go Home")
  }
  /**
   * 收藏商品
   */
  goodsCollected(commodityId) {
    console.log("commodityId:", commodityId);
    return new Promise((resolve, reject) => {
      resolve({ success: true })
    })
  }

  /**
   * 构造函数
   */
  constructor() {
    // this.music = my.createInnerAudioContext();
    this.sound = my.createInnerAudioContext();
  }


  /**
  * 播放音效
  * @param {*} url 
  */
  playSound(url, loadCompleteFun) {
    // console.log("initSound", this.sound);
    let baseUrl = "/pages/index/";
    let sound = my.createInnerAudioContext();

    sound.autoplay = true
    sound.src = baseUrl + url;
    sound.volume = 0;

    var idx = setInterval(function () {
      if (sound.duration && sound.duration > 0.1) {
        clearInterval(idx);
        sound.pause();
        sound.seek(0);
        sound.volume = 1;
        if (null != loadCompleteFun) {
          loadCompleteFun(sound);
        }
      }
    }, 200);

    sound.onPlay(() => {
      console.log("onPlay:", url);
    })
    sound.onError((res) => {
      console.log("sound error:", res.errMsg)
    })
    sound.onEnded(() => {
      console.log("onEnded:", url)
    });
    sound.onPause(() => {
      this.trace(10);
      console.log("onPause:", url)
    });
    sound.onStop(() => {
      console.log("onStop:", url)
    })    
    // console.log("sound:", sound);
    // return sound;
  }


    /**
     * trace
     * @param [int] [count=10]
     */
    trace (count) {
        var caller = arguments.callee.caller;
        var i = 0;
        count = count || 10;
        console.log("***----------------------------------------  ** " + (i + 1));
        while (caller && i < count) {
            console.log(caller.toString());
            caller = caller.caller;
            i++;
            console.log("***---------------------------------------- ** " + (i + 1));
        }
    }



  /**
   * 播放背景音乐
   * @param {*} url 
   */
  playMusic(url, loadCompleteFun) {
    let baseUrl = "/pages/index/";
    let music = my.createInnerAudioContext();
    music.autoplay = true;
    music.src = baseUrl + url;
    // music.loop = loop;
    music.startTime = 0
    // this.music.onPlay(() => {
    //   console.log('play bgm')
    // })
    var idx = setInterval(function () {
      if (music.duration && music.duration > 0.1) {
        clearInterval(idx);
        music.pause();
        music.seek(0);
        music.volume = 1;
        if (null != loadCompleteFun) {
          loadCompleteFun(music);
        }
      }
    }, 200);
    music.onError((res) => {
      console.log("sound error:", res.errMsg)
    })
    music.onEnded(() => {
      console.log('end bgm')
    })
    console.log("initMusic:", music);
    return music;
  }


}

var window = $global.window;
window.platform = new WxgamePlatform();