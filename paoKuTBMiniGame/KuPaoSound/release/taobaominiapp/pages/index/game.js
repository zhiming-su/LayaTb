
var touchstartCB;
var touchcancelCB;
var touchendCB;
var touchmoveCB;
var shareInfoList = [];
Page({
  onReady() {
  },
  onLoad(query) {
  },
  onTouchStart(e) {
    touchstartCB && touchstartCB(e)
  },
  onTouchCancel(e) {
    touchcancelCB && touchcancelCB(e)
  },
  onTouchEnd(e) {
    touchendCB && touchendCB(e)
  },
  onTouchMove(e) {
    touchmoveCB && touchmoveCB(e)
  },
  canvasOnReady() {
    my.onTouchStart = function (cb) {
      touchstartCB = cb;
    }
    my.onTouchCancel = function (cb) {
      touchcancelCB = cb;
    }
    my.onTouchEnd = function (cb) {
      touchendCB = cb;
    }
    my.onTouchMove = function (cb) {
      touchmoveCB = cb;
    }
    delete require.cache[require.resolve("layaengine/adapter.js")];
    require("layaengine/adapter.js");
    delete require.cache[require.resolve("layaengine/libs/laya.tbmini.js")];
    require("layaengine/libs/laya.tbmini.js");

    delete require.cache[require.resolve("../../tbSound.js")];
    require("../../tbSound.js");
    // console.log($global.window);

$global.window.tbSound.runourgame({
    //以下为自动修改，请勿修改
    //The following is automatically modified, please do not modify
    //----auto option start----
    // entryClassName: "Main",
    orientation: "auto",
    frameRate: 30,
    scaleMode: "showAll",
    contentWidth: 640,
    contentHeight: 1136,
    showFPS: false,
    fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
    showLog: false,
    maxTouches: 2,
    //----auto option end----
    renderMode: 'tbsss',
    audioType: 0,
    // calculateCanvasScaleFactor: function (context) {
    //   var backingStore = context.backingStorePixelRatio ||
    //     context.webkitBackingStorePixelRatio ||
    //     context.mozBackingStorePixelRatio ||
    //     context.msBackingStorePixelRatio ||
    //     context.oBackingStorePixelRatio ||
    //     context.backingStorePixelRatio || 1;
    //   // console.log('main.1', window.devicePixelRatio, backingStore)
    //   return (window.devicePixelRatio || 1) / backingStore;
    // }
  });

      delete require.cache[require.resolve("./index.js")];
    require("./index.js");

  },
  onUnload() {
    $global.window.cancelAnimationFrame();
    $global.$isAdapterInjected = false;
    $global.window = null;
  }
});
