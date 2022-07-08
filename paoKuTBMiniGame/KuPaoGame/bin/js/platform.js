/**
 * 游戏测试数据接口文件
 */
var isGuide = false;
var startTime = "2021-06-21 14:10:41";
var endTime = "2021-07-21 14:06:00";
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
        var music = {};
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
        music.stop = (() => {
            console.log('stop music')
        });
        return music
    }


}

var window = window;
window.platform = new WxgamePlatform();