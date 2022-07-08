/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";

//-----libs-begin-----
loadLib("libs/laya.core.js")
loadLib("libs/laya.ui.js")
loadLib("libs/laya.d3.js")
//-----libs-end-------
loadLib("../../platform.js");
// window.tbSound.runourgame({
    //以下为自动修改，请勿修改
    //The following is automatically modified, please do not modify
    //----auto option start----
    // entryClassName: "Main",
    // orientation: "auto",
    // frameRate: 30,
    // scaleMode: "showAll",
    // contentWidth: 640,
    // contentHeight: 1136,
    // showFPS: false,
    // fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
    // showLog: false,
    // maxTouches: 2,
    // //----auto option end----
    // renderMode: 'tbsss',
    // audioType: 0,
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
  // });
loadLib("js/bundle.js");
