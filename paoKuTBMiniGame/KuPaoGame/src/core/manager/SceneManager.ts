/*
 * @Date: 2021-06-08 13:34:05
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-17 16:30:57
 * @description: 
 */
export default class SceneManager {



  public static example_animatorUrl = 'res3d/LayaScene_Example_Animator/Conventional/Example_Animator.ls';


  public static mainScene: Laya.Scene3D;

  public static spwan: Laya.Scene3D;
  public static game: Laya.Scene3D;

  static mApplication: SceneManager;
  static mainScene_Lh: Laya.Sprite3D;

  static OnLoadLevelok(url, callder, callback: Function, scene: Laya.Scene3D) {
    //let rs = Laya.loader.getRes(url) as Laya.Scene3D;
    console.log('OnLoadLevelok ',url);
    callback.call(callder, scene);
  }

  public static LoadSceneByNameAtAsset(name: string, callder, callbackFunc: Function) {
    let url = 'res3d/' + name + '.ls';
    Laya.Scene3D.load(url, Laya.Handler.create(SceneManager, SceneManager.OnLoadLevelok, [url, callder, callbackFunc]),null);
  }
}