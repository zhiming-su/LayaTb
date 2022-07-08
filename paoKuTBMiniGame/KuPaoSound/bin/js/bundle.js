(function () {
    'use strict';

    class GlobalData {
    }
    GlobalData.isGuide = false;
    GlobalData.isInit = true;
    GlobalData.gameOver = false;
    GlobalData.catRunSpeeds = [0.25, 0.3, 0.35, 0.45];
    GlobalData.isOpenSound = true;
    GlobalData.isBaoXiang = false;

    class PlayerPrefs {
        static GetInt(key, defaultnum) {
            return PlayerPrefs.GetValueNum(key, defaultnum);
        }
        static SetInt(key, defaultnum) {
            PlayerPrefs.SetValueNum(key, defaultnum);
        }
        static DeleteAll() {
            Laya.LocalStorage.clear();
        }
        static GetValueNum(value_name, defaul) {
            var jsonData = Laya.LocalStorage.getItem(value_name);
            if (jsonData == null || jsonData == '')
                return defaul;
            var d = Number(jsonData);
            return d;
        }
        static SetValueNum(value, num) {
            Laya.LocalStorage.setItem(value, num.toString());
        }
    }

    class Time extends Laya.Script {
    }
    Time.fixedDeltaTime = 0;
    Time.deltaTime = 0;
    Time.time = 0;
    Time.deltaTimeMin = 9999999999999999;
    Time.deltaTimeMax = 0;
    Time.deltaTimeEvr = 0;

    class EventType {
    }
    EventType.ShapeThreeDEnterWorld = 'ShapeThreeDEnterWorld';
    EventType.AD_VIDEO_CLOSE_EVENT = 'AD_VIDEO_CLOSE_EVENT';
    EventType.WxOnShow = 'WxOnShow';
    EventType.SHARE_Ok = 'SHARE_Ok';
    EventType.UpdateGoldItemUi = 'UpdateGoldItemUi';
    EventType.ShopSelectChrater = 'onSelectChrater';
    EventType.ShopSelectHat = 'ShopSelectHat';
    EventType.CharaterIniOk = 'CharaterIniOk';

    class EventManager extends Laya.EventDispatcher {
        static get instance() {
            if (EventManager._instance == null)
                EventManager._instance = new EventManager();
            return EventManager._instance;
        }
    }

    class SoundManager {
        constructor() {
            this.bgmurl = 'sound/main/bgm.mp3';
            this.bgmurl2 = 'sound/bgm.mp3';
            this.clcik = new AudioClip('res/sound/main/click.mp3', 0);
            this.FishCollection = new AudioClip('sound/FishCollection.mp3', 0.5);
            this.CatDeath = new AudioClip('sound/CatDeath.mp3', 1);
            this.CatJump = new AudioClip('sound/CatJump.mp3', 0);
            this.BuyOk = new AudioClip('res/sound/main/buyItem.mp3', 0);
            this.wineffect = new AudioClip('sound/jiasu.mp3', 0);
            this.powerUp = new AudioClip('res/sound/game/powerUp.mp3', 0);
            this.starAward = new AudioClip('res/sound/game/starAward.mp3', 0);
            this.startGame = new AudioClip("sound/starAward.mp3", 0);
            this.hit = new AudioClip('sound/hit.mp3', 0.3);
            this._tbSound = Laya.Browser.window.tbSound;
            this._playSound = null;
            this._isPlaySound = false;
            this._playOneShot = null;
            this._isPlayOneShot = false;
            this._playNumSound = null;
            this._isplayNumSound = false;
            this.prebgmurl = "";
            this._music = null;
            this._musicPlay = null;
            this._isPlayMusic = false;
            EventManager.instance.on(EventType.AD_VIDEO_CLOSE_EVENT, this, this.onAD_VIDEO_CLOSE_EVENT);
            EventManager.instance.on(EventType.WxOnShow, this, this.ReSumeBgm);
        }
        static get instance() {
            if (SoundManager.minstance == null)
                SoundManager.minstance = new SoundManager();
            return SoundManager.minstance;
        }
        static isPlaySound() {
            return GlobalData.isOpenSound;
        }
        static setPlaySound(isPlaySound) {
            PlayerPrefs.SetInt('PlaySound', isPlaySound ? 1 : 0);
        }
        onAD_VIDEO_CLOSE_EVENT() {
            this.ReSumeBgm();
        }
        play(url) {
            let isPlaySound = SoundManager.isPlaySound();
            if (!isPlaySound) {
                return;
            }
            if (Laya.Browser.onTBMiniGame) {
                if (this._playSound == null) {
                    this._playSound = new this._tbSound.Sound();
                    this._playSound.addEventListener(this._tbSound.Event.COMPLETE, function loadOver(event) {
                        this._isPlaySound = true;
                        this._playSound.play(0, 1);
                    }, this);
                    this._playSound.load(url);
                }
                else {
                    if (this._isPlaySound) {
                        this._playSound.play(0, 1);
                    }
                }
            }
            else {
                Laya.SoundManager.playSound(url, 1);
            }
        }
        PlayOneShot(url) {
            if (SoundManager.isPlaySound()) {
                if (Laya.Browser.onTBMiniGame) {
                    if (this._playOneShot == null) {
                        this._playOneShot = new this._tbSound.Sound();
                        this._playOneShot.addEventListener(this._tbSound.Event.COMPLETE, function loadOver(event) {
                            this._isPlayOneShot = true;
                            this._playOneShot.play(0, 1);
                        }, this);
                        this._playOneShot.load(url);
                    }
                    else {
                        if (this._isPlayOneShot) {
                            this._playOneShot.play(0, 1);
                        }
                    }
                }
                else {
                    Laya.SoundManager.playSound(url, 1);
                }
            }
        }
        PlayByNum(url, n) {
            if (SoundManager.isPlaySound()) {
                if (Laya.Browser.onTBMiniGame) {
                    if (this._playNumSound == null) {
                        this._playNumSound = new this._tbSound.Sound();
                        this._playNumSound.addEventListener(this._tbSound.Event.COMPLETE, function loadOver(event) {
                            this._isplayNumSound = true;
                            this._playNumSound.play(0, 1);
                        }, this);
                        this._playNumSound.load(url);
                    }
                    else {
                        if (this._isplayNumSound) {
                            this._playNumSound.play(0, 1);
                        }
                    }
                }
                else {
                    Laya.SoundManager.playSound(url, n);
                }
            }
        }
        BgmPlay() {
            this.PlayBgm(this.bgmurl, true);
        }
        PlayGameBgm() {
            this.PlayBgm(this.bgmurl2, true);
        }
        stopBgm() {
            if (Laya.Browser.onTBMiniGame) {
                console.log("===stopBgm===", this._music);
                this._musicPlay.volume = 0;
            }
        }
        BgmPlaySetting() {
            this.PlayBgm(this.bgmurl, true);
        }
        ReSumeBgm() {
            console.log('ReSumeBgm');
            let isPlaySound = SoundManager.isPlaySound();
            if (!isPlaySound && this.curbgm_SoundChannel != null)
                return;
            {
                this.curbgm_SoundChannel.resume();
            }
        }
        pauseBgm() {
            if (this.curbgm_SoundChannel != null)
                this.curbgm_SoundChannel.pause();
        }
        PlayBgm(url, loop) {
            let isPlaySound = SoundManager.isPlaySound();
            if (!isPlaySound) {
                return;
            }
            if (Laya.Browser.onTBMiniGame) {
                let isPlaySound = SoundManager.isPlaySound();
                if (!isPlaySound) {
                    return;
                }
                if (this._isPlayMusic == false) {
                    let tbSound = Laya.Browser.window.tbSound;
                    this._music = new tbSound.Sound();
                    this._music.addEventListener(tbSound.Event.COMPLETE, function loadOver(event) {
                        this._isPlayMusic = true;
                        this._musicPlay = this._music.play();
                    }, this);
                    this._music.load(url);
                }
                else {
                    this._musicPlay.volume = 1;
                }
            }
            else {
                if (this.prebgmurl != url)
                    this.curbgm_SoundChannel = null;
                let isPlaySound = SoundManager.isPlaySound();
                console.log('isPlaySound=' + isPlaySound);
                if (isPlaySound) {
                    console.log('PlayBgm');
                    let num = 1;
                    if (loop)
                        num = 0;
                    if (this.curbgm_SoundChannel == null) {
                        let channel = Laya.SoundManager.playMusic(url, num);
                        this.curbgm_SoundChannel = channel;
                    }
                    else
                        this.curbgm_SoundChannel.play();
                }
            }
        }
    }
    class AudioClip {
        constructor(p_url, pminRate) {
            this.preTime = 0;
            this.minRate = 0;
            this.url = p_url;
            this.minRate = pminRate;
        }
        Play() {
            if (Time.time - this.preTime < this.minRate)
                return;
            SoundManager.instance.PlayOneShot(this.url);
            this.preTime = Time.time;
        }
        PlayByNum(n) {
            if (Time.time - this.preTime < this.minRate)
                return;
            SoundManager.instance.PlayByNum(this.url, n);
            this.preTime = Time.time;
        }
    }

    class Utils {
        constructor() { }
        static addClickEvent(btn, self, p_cb, soundId) {
            if (btn == null)
                return;
            btn.offAllCaller(self);
            let callback = function (event) {
                if (p_cb) {
                    p_cb.call(self, event);
                }
            };
            btn.on(Laya.Event.CLICK, self, callback);
            {
                let scaleTime = 60;
                let wRatio = 1;
                btn.pivotX = btn.width * 0.5;
                btn.pivotY = btn.height * 0.5;
                ;
                btn.x += btn.width * 0.5;
                btn.y += btn.height * 0.5;
                ;
                let cbDown = function (event) {
                    event.stopPropagation();
                    Laya.Tween.to(btn, { scaleX: 0.95, scaleY: 0.95, }, scaleTime);
                };
                btn.on(Laya.Event.MOUSE_DOWN, self, cbDown);
                let cbUp = function (event) {
                    event.stopPropagation();
                    Laya.Tween.to(btn, { scaleX: 1, scaleY: 1 }, scaleTime);
                    (soundId === 0 || soundId);
                };
                btn.on(Laya.Event.MOUSE_UP, self, cbUp);
                let cbOut = function (event) {
                    event.stopPropagation();
                    Laya.Tween.to(btn, { scaleX: 1, scaleY: 1 }, scaleTime);
                };
                btn.on(Laya.Event.MOUSE_OUT, self, cbOut);
            }
        }
        static addClickEventScale(btn, self, p_cb, sacle, soundId) {
            if (btn == null)
                return;
            btn.offAllCaller(self);
            let callback = function (event) {
                if (p_cb) {
                    p_cb.call(self, event);
                }
            };
            btn.on(Laya.Event.CLICK, self, callback);
            {
                let scaleTime = 60;
                let wRatio = 1;
                btn.pivotX = btn.width * 0.5;
                btn.pivotY = btn.height * 0.5;
                ;
                btn.x += btn.width * 0.5;
                btn.y += btn.height * 0.5;
                ;
                let cbDown = function (event) {
                    event.stopPropagation();
                    Laya.Tween.to(btn, { scaleX: sacle - 0.05, scaleY: sacle - 0.05, }, scaleTime);
                };
                btn.on(Laya.Event.MOUSE_DOWN, self, cbDown);
                let cbUp = function (event) {
                    event.stopPropagation();
                    Laya.Tween.to(btn, { scaleX: sacle, scaleY: sacle }, scaleTime);
                    (soundId === 0 || soundId);
                };
                btn.on(Laya.Event.MOUSE_UP, self, cbUp);
                let cbOut = function (event) {
                    event.stopPropagation();
                    Laya.Tween.to(btn, { scaleX: sacle, scaleY: sacle }, scaleTime);
                };
                btn.on(Laya.Event.MOUSE_OUT, self, cbOut);
            }
        }
        tweenShake(target, tweenTimer) {
            let timeLine = new Laya.TimeLine();
            let pivotX = target.pivotX;
            target.pivotX = target.width / 2;
            timeLine.addLabel("shake1", 0).to(target, { rotation: target.rotation + 5 }, 50, null, 0)
                .addLabel("shake2", 0).to(target, { rotation: target.rotation - 6 }, 50, null, 0)
                .addLabel("shake3", 0).to(target, { rotation: target.rotation - 13 }, 50, null, 0)
                .addLabel("shake4", 0).to(target, { rotation: target.rotation + 3 }, 50, null, 0)
                .addLabel("shake5", 0).to(target, { rotation: target.rotation - 5 }, 50, null, 0)
                .addLabel("shake6", 0).to(target, { rotation: target.rotation + 2 }, 50, null, 0)
                .addLabel("shake7", 0).to(target, { rotation: target.rotation - 8 }, 50, null, 0)
                .addLabel("shake8", 0).to(target, { rotation: target.rotation + 3 }, 50, null, 0)
                .addLabel("shake9", 0).to(target, { rotation: 0 }, 50, null, 0);
            if (!tweenTimer) {
                timeLine.on(Laya.Event.COMPLETE, this, function () {
                    timeLine.destroy();
                    target.rotation = 0;
                    target.pivotX = pivotX;
                });
            }
            else {
                Laya.timer.once(500, this, function () {
                    timeLine.destroy();
                    target.rotation = 0;
                    target.pivotX = pivotX;
                });
            }
            timeLine.play(0, true);
        }
        compareVersion(v1, v2) {
            v1 = v1.split('.');
            v2 = v2.split('.');
            let len = Math.max(v1.length, v2.length);
            while (v1.length < len) {
                v1.push('0');
            }
            while (v2.length < len) {
                v2.push('0');
            }
            for (let i = 0; i < len; i++) {
                let num1 = parseInt(v1[i]);
                let num2 = parseInt(v2[i]);
                if (num1 > num2) {
                    return 1;
                }
                else if (num1 < num2) {
                    return -1;
                }
            }
            return 0;
        }
    }

    class SoundBtn extends Laya.Image {
        onAwake() {
            this.skin = SoundManager.isPlaySound() ? 'Textrue/btn_sound_on.png' : 'Textrue/btn_sound_off.png';
            Utils.addClickEvent(this, this, this.OnClick);
        }
        OnClick() {
            let isplay = !SoundManager.isPlaySound();
            SoundManager.setPlaySound(isplay);
            this.skin = isplay ? 'Textrue/btn_sound_on.png' : 'Textrue/btn_sound_off.png';
            if (isplay)
                SoundManager.instance.BgmPlaySetting();
            else
                SoundManager.instance.pauseBgm();
        }
    }

    class PlatformData {
        constructor() {
            this.devtools = false;
            this.onplatformTT = false;
            this.onplatformWX = false;
            this.OnIOS = false;
            this.OnPc = false;
            this.OnAndroid = false;
            this.launchOptions = {};
        }
    }

    class Platform {
        static supportSubPackage() {
            if (this.commonData.onplatformTT) {
                console.log("不支持分包");
                return false;
            }
            else if (this.commonData.onplatformWX) {
                console.log('onplatformWX');
                return true;
            }
            else if (Laya.Browser.onVVMiniGame) {
                return true;
            }
            else if (Laya.Browser.onQGMiniGame) {
                return false;
            }
            else if (Laya.Browser.onQQMiniGame) {
                return true;
            }
            else {
                return false;
            }
        }
        static loadSubpackage_Single(wxSubloadNameJson, callder, callbackFunc) {
            if (this.commonData.onplatformTT) {
                console.error('不支持分包');
            }
            else if (Laya.Browser.onMiniGame) {
                let LoadSubpackageTask = wx['loadSubpackage']({
                    name: wxSubloadNameJson,
                    success: function (res) {
                        console.log(wxSubloadNameJson + " 分包加载成功");
                        callbackFunc.apply(callder, [true]);
                    },
                    fail: function (res) {
                        console.error(wxSubloadNameJson + "分包加载失败");
                        callbackFunc.apply(callder, [false]);
                    }
                });
                return LoadSubpackageTask;
            }
        }
        static isPlayVibrate() {
            return PlayerPrefs.GetInt('Vibrate', 1) == 1;
        }
        static setPlayVibrate(isPlayVibrate) {
            PlayerPrefs.SetInt('Vibrate', isPlayVibrate ? 1 : 0);
        }
        static vibrateLong() {
            if (Platform.isPlayVibrate()) {
                if (this.commonData.onplatformWX) {
                    let obj = {
                        success: function () { },
                        fail: function () { },
                        complete: function () { }
                    };
                    window['wx'].vibrateLong(obj);
                }
                else if (this.commonData.onplatformTT) {
                    this.commonData.windowTT.vibrateLong({
                        success(res) {
                            console.log(`${res}`);
                        },
                        fail(res) {
                            console.log(`vibrateLong调用失败`);
                        },
                    });
                }
                else if (Laya.Browser.onQGMiniGame || Laya.Browser.onVVMiniGame) {
                    let obj = {
                        success: function () { },
                        fail: function () { },
                        complete: function () { }
                    };
                    qg.vibrateLong(obj);
                    console.log('qg.vibrateLong');
                }
                else if (Laya.Browser.onQQMiniGame) {
                    let obj = {
                        success: function () { },
                        fail: function () { },
                        complete: function () { }
                    };
                    window['qq'].vibrateLong(obj);
                }
                else {
                    if (Laya.Browser.window['qg'] == null)
                        return;
                    if (Laya.Browser.window['qg'].vibrateLong == null)
                        return;
                    let obj = {
                        success: function () { },
                        fail: function () { },
                        complete: function () { }
                    };
                    qg.vibrateLong(obj);
                }
            }
        }
        static showToast(msg) {
            if (this.commonData.OnPc) {
                return;
            }
            if (this.commonData.onplatformTT) {
                this.commonData.windowTT.showToast({
                    title: msg,
                    duration: 2000,
                    success(res) {
                    },
                    fail(res) {
                    }
                });
            }
            else if (this.commonData.onplatformWX) {
                let object = {
                    title: msg, icon: '', image: '', duration: 1500,
                    success: () => { }, fail: () => { }, complete: () => { }, mask: false
                };
                qg.showToast(object);
            }
            else if (Laya.Browser.onVVMiniGame) {
                let object = {
                    title: msg, icon: '', image: '', duration: 1500,
                    success: () => { }, fail: () => { }, complete: () => { }, mask: false
                };
                window["qg"].showToast(object);
            }
            else if (Laya.Browser.onQGMiniGame) {
                console.log('oppo showToast', msg);
                let object = {
                    title: msg, icon: '', image: '', duration: 1500,
                    success: () => { }, fail: () => { }, complete: () => { }, mask: false
                };
                window["qg"].showToast(object);
            }
        }
    }
    Platform.commonData = new PlatformData();

    class VibrateBtn extends Laya.Image {
        onAwake() {
            this.skin = Platform.isPlayVibrate() ? 'Textrue/btn_vibrate_on.png' : 'Textrue/btn_vibrate_off.png';
            Utils.addClickEvent(this, this, this.OnClick);
        }
        OnClick() {
            let isplay = !Platform.isPlayVibrate();
            Platform.setPlayVibrate(isplay);
            this.skin = isplay ? 'Textrue/btn_vibrate_on.png' : 'Textrue/btn_vibrate_off.png';
            console.log('Vibrate', isplay);
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("game/scripts/component/button/Soundbtn.ts", SoundBtn);
            reg("game/scripts/component/button/VibrateBtn.ts", VibrateBtn);
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1334;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "views/game.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Layer extends Laya.Sprite {
        constructor(type) {
            super();
            this._type = type;
            this.init();
        }
        init() {
        }
        destroy() {
            super.destroy();
        }
        get type() {
            return this._type;
        }
    }

    var LayerType;
    (function (LayerType) {
        LayerType[LayerType["Scene3D"] = 0] = "Scene3D";
        LayerType[LayerType["UI"] = 1] = "UI";
        LayerType[LayerType["Tip"] = 2] = "Tip";
    })(LayerType || (LayerType = {}));

    class Scene3DLayer extends Layer {
        constructor() {
            super(LayerType.Scene3D);
        }
    }

    class TipsLayer extends Layer {
        constructor() {
            super(LayerType.Tip);
            this.init();
        }
        init() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
        }
    }

    class UILayer extends Layer {
        constructor() {
            super(LayerType.UI);
            this.init();
        }
        init() {
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
        }
    }

    class Dictionary {
        constructor() {
            this._keys = null;
            this._values = null;
            this._keys = new Array();
            this._values = new Array();
        }
        destroy() {
        }
        setValue(key, value) {
            let index = this.indexOf(key);
            if (index >= 0) {
                this._values[index] = value;
                return;
            }
            this._keys.push(key);
            this._values.push(value);
        }
        indexOf(key) {
            return this._keys.indexOf(key);
        }
        containsKey(key) {
            return this._keys.indexOf(key) != -1;
        }
        getValue(key) {
            var index = this.indexOf(key);
            return index < 0 ? null : this._values[index];
        }
        remove(key) {
            var index = this.indexOf(key);
            if (index >= 0) {
                this._keys.splice(index, 1);
                this._values.splice(index, 1);
                return true;
            }
            return false;
        }
        clear() {
            this._values.splice(0, this._values.length);
            this._keys.splice(0, this._keys.length);
        }
        get values() {
            return this._values;
        }
        get keys() {
            return this._keys;
        }
        forEach(callback) {
            for (let index = 0; index < this._keys.length; index++) {
                const key = this._keys[index];
                const value = this._values[index];
                const ret = callback(key, value);
                if (ret === false) {
                    return;
                }
            }
        }
        get length() {
            return this._values.length;
        }
        isEmpty() {
            return this._values.length <= 0;
        }
    }

    class Log {
        static set Enable(value) {
            this.enable = value;
        }
        static log(...message) {
            if (this.enable == false)
                return;
            console.log(this.group, message);
        }
    }
    Log.enable = true;
    Log.group = "KuPaoGameDebug------>";

    class LayerManager {
        constructor() {
            this._layerDic = new Dictionary();
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new LayerManager();
            }
            return this._instance;
        }
        destory() {
            for (const layer of this._layerDic.values) {
                layer.removeSelf();
                layer.destroy();
            }
            this._layerDic = null;
        }
        addLayer(layerClass) {
            let layer = this.getExistLayer(layerClass);
            if (layer == null) {
                layer = new layerClass();
                layer.name = layerClass.prototype.constructor.name;
                this._layerDic.setValue(layerClass, layer);
                Laya.stage.addChild(layer);
            }
            else {
                Log.log("该图层已经添加，请检查:", layerClass.prototype.name);
            }
            return layer;
        }
        getExistLayer(layerClass) {
            let index = this._layerDic.indexOf(layerClass);
            if (index >= 0) {
                return this._layerDic.values[index];
            }
            return null;
        }
        getLayer(layerClass) {
            return this.getExistLayer(layerClass);
        }
        addScene(scene, layerClass) {
            let layer = this.getExistLayer(layerClass);
            if (layer) {
                layer.addChild(scene);
            }
            else {
                throw new Error("该层级未创建");
            }
            return scene;
        }
        removeScene(scene, layerClass) {
            let layer = this.getExistLayer(layerClass);
            if (layer) {
                scene.removeSelf();
            }
            else {
                throw new Error("该层级未创建");
            }
            return scene;
        }
    }
    LayerManager._instance = null;

    class ModuleManager {
        constructor() {
            this._modules = null;
            this._modules = new Dictionary();
        }
        initialize() {
            this._modules.values.forEach(element => {
                element.initialize();
            });
        }
        uninitialize() {
            this._modules.values.forEach(element => {
                element.uninitialize();
            });
        }
        addModule(moduleClass) {
            if (this._modules == null) {
                return;
            }
            if (this._modules.indexOf(moduleClass) > -1) {
                throw "重复添加模块：" + moduleClass.prototype.constructor.name;
            }
            this._modules.setValue(moduleClass, new moduleClass());
        }
        getModule(moduleClass) {
            if (this._modules == null) {
                return;
            }
            return this._modules.getValue(moduleClass);
        }
        removeModule(moduleClass) {
            if (this._modules == null) {
                return;
            }
            let removeModule = this.getModule(moduleClass);
            if (removeModule) {
                this._modules.remove(moduleClass);
            }
            else {
                Log.log("该模块不存在：" + moduleClass.prototype.constructor.name);
            }
        }
        removeAllModule() {
            if (this._modules.length > 0) {
                this._modules.forEach((k, v) => {
                    this.removeModule(k);
                });
            }
        }
        destroy() {
            this._modules.clear();
            this._modules = null;
        }
    }

    class BaseModule {
        constructor() {
            this._model = null;
            this._view = null;
            this._callBack = null;
        }
        initialize() {
            this.addModel();
            this.addView();
            if (this._model) {
                this._model.regist();
            }
        }
        uninitialize() {
            if (this._model) {
                this._model.destory();
                this._model = null;
            }
            if (this._view) {
                this._view.destroy();
                this._view = null;
            }
        }
        addModel() {
            Log.log("子类如果有数据需要重写");
        }
        addView() {
            Log.log("子类如果有UI需要重写");
        }
        get model() {
            return this._model;
        }
        openWindow(callback = null) {
            if (callback) {
                this._callBack = callback;
            }
            if (this._view) {
                this._view.openView(() => {
                    this.open();
                });
            }
            else {
                throw "该模块UI未初始化，请实现AddView函数";
            }
            if (this._callBack != null) {
                this._callBack();
            }
        }
        open() {
            Log.log("此函数是UI加载完成的回调,如果想调用控件，一定是从这个开始初始化");
        }
        closeWindow(destroyChild) {
            if (this._view) {
                this._view.closeView(destroyChild);
            }
        }
    }

    class TweenManager {
        constructor() {
            this.targets = [];
            this.dic = new Dictionary();
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new TweenManager();
            }
            return this._instance;
        }
        toAlpha(target, alpha, duration, isLoop = false, startAlpha = 1) {
            this.saveTarget(target);
            target.alpha = startAlpha;
            alpha1();
            function alpha1() {
                let handler = isLoop ? new Laya.Handler(this, alpha2) : null;
                Laya.Tween.to(target, { alpha: alpha }, duration, null, handler);
            }
            function alpha2() {
                Laya.Tween.to(target, { alpha: 1 }, duration, null, Laya.Handler.create(this, alpha1));
            }
        }
        toScale(target, scale, duration, isReset, isLoop = false, scaley = scale) {
            this.saveTarget(target);
            target.scaleX = 1;
            target.scaleY = 1;
            scale1();
            function scale1() {
                let handler = isLoop || isReset ? new Laya.Handler(this, scale2) : null;
                Laya.Tween.to(target, { scaleX: scaley, scaleY: scaley }, duration, null, handler);
            }
            function scale2() {
                let handler = isLoop ? new Laya.Handler(this, scale1) : null;
                Laya.Tween.to(target, { scaleX: 1, scaleY: 1 }, duration, null, handler);
            }
        }
        toScale_Jie(target, x, y, x2, y2, duration, duration2, ease) {
            this.saveTarget(target);
            Laya.Tween.to(target, { scaleX: x, scaleY: y }, duration, ease);
            Laya.Tween.to(target, { scaleX: x2, scaleY: y2 }, duration2, ease, null, duration);
        }
        toTop(target, y, duration, ease) {
            this.saveTarget(target);
            Laya.Tween.to(target, { top: y }, duration, ease);
        }
        toPosition(target, pos, duration, isLoop = false, type = 0) {
            this.saveTarget(target);
            let curPos = new Laya.Vector2(target.x, target.y);
            pos1();
            function pos1() {
                if (isLoop) {
                    switch (type) {
                        case 0:
                            var handler = new Laya.Handler(this, pos2);
                            break;
                        case 1:
                            var handler = new Laya.Handler(this, pos3);
                            break;
                    }
                }
                Laya.Tween.to(target, { x: pos.x, y: pos.y }, duration, null, handler);
            }
            function pos2() {
                Laya.Tween.to(target, { x: curPos.x, y: curPos.y }, duration, null, Laya.Handler.create(this, pos1));
            }
            function pos3() {
                target.x = curPos.x;
                target.y = curPos.y;
                pos1();
            }
        }
        toPositionEase(target, pos, duration, isLoop = false, ease, type = 0) {
            this.saveTarget(target);
            let curPos = new Laya.Vector2(target.x, target.y);
            pos1();
            function pos1() {
                if (isLoop) {
                    switch (type) {
                        case 0:
                            var handler = new Laya.Handler(this, pos2);
                            break;
                        case 1:
                            var handler = new Laya.Handler(this, pos3);
                            break;
                    }
                }
                Laya.Tween.to(target, { x: pos.x, y: pos.y }, duration, ease, handler);
            }
            function pos2() {
                Laya.Tween.to(target, { x: curPos.x, y: curPos.y }, duration, null, Laya.Handler.create(this, pos1));
            }
            function pos3() {
                target.x = curPos.x;
                target.y = curPos.y;
                pos1();
            }
        }
        toPositionRePlay(target, endpos, duration) {
            this.saveTarget(target);
            let satrtPos = new Laya.Vector2(target.x, target.y);
            pos1();
            function pos1() {
                target.x = satrtPos.x;
                target.y = satrtPos.y;
                var compeltehandler = new Laya.Handler(this, pos1);
                Laya.Tween.to(target, { x: endpos.x, y: endpos.y }, duration, null, compeltehandler);
            }
        }
        toPositionRePlayEase(target, endpos, duration, ease) {
            this.saveTarget(target);
            let satrtPos = new Laya.Vector2(target.x, target.y);
            pos1();
            function pos1() {
                target.x = satrtPos.x;
                target.y = satrtPos.y;
                var compeltehandler = new Laya.Handler(this, pos1);
                Laya.Tween.to(target, { x: endpos.x, y: endpos.y }, duration, ease, compeltehandler);
            }
        }
        fromAlpha(target, alpha, duration, isLoop = false) {
            this.saveTarget(target);
            target.alpha = 1;
            alpha1();
            function alpha1() {
                let handler = isLoop ? new Laya.Handler(this, alpha2) : null;
                Laya.Tween.from(target, { alpha: alpha }, duration, null, handler);
            }
            function alpha2() {
                Laya.Tween.from(target, { alpha: 1 }, duration, null, Laya.Handler.create(this, alpha1));
            }
        }
        fromScale(target, scale, duration, isLoop = false) {
            this.saveTarget(target);
            scale1();
            function scale1() {
                let handler = isLoop ? new Laya.Handler(this, scale2) : null;
                Laya.Tween.from(target, { scaleX: scale, scaleY: scale }, duration, null, handler);
            }
            function scale2() {
                Laya.Tween.from(target, { scaleX: 1, scaleY: 1 }, duration, null, Laya.Handler.create(this, scale1));
            }
        }
        numberAnim(start, end, duration, methon, caller) {
            let target = {};
            target.value = start;
            let ud = Laya.Tween.to(target, { value: end }, duration);
            ud.update = new Laya.Handler(this, function () {
                methon.call(target.value, caller);
            });
        }
        saveTarget(target) {
            let targets = this.dic.getValue(target.scene.url);
            if (targets) {
                targets.push(target);
            }
            else {
                targets = [];
                targets.push(target);
                this.dic.setValue(target.scene.url, targets);
            }
        }
        clearAll(target) {
            let targets = this.dic.getValue(target.scene.url);
            if (!targets)
                return;
            targets.forEach(t => {
                Laya.Tween.clearAll(t);
            });
            targets = [];
        }
        toScaleExt(target, p_startx, p_starty, p_scalex, p_scaley, duration, isLoop) {
            this.saveTarget(target);
            target.scaleX = p_startx;
            target.scaleY = p_starty;
            scale1();
            function scale1() {
                let handler = isLoop ? new Laya.Handler(this, scale2) : null;
                Laya.Tween.to(target, { scaleX: p_scalex, scaleY: p_scaley }, duration, Laya.Ease.linearOut, handler);
            }
            function scale2() {
                let handler = isLoop ? new Laya.Handler(this, scale1) : null;
                Laya.Tween.to(target, { scaleX: 1, scaleY: 1 }, duration, Laya.Ease.linearOut, handler);
            }
        }
        toPositionExt(target, pos, duration) {
            this.saveTarget(target);
            Laya.Tween.to(target, { x: pos.x, y: pos.y }, duration, Laya.Ease.linearOut);
        }
        toPositionPingPongOnece(target, pos, duration) {
            this.saveTarget(target);
            Laya.Tween.clearTween(target);
            let startPos = new Laya.Vector2(target.x, target.y);
            let handler = new Laya.Handler(this, backToStartPos);
            function backToStartPos() {
                Laya.Tween.to(target, { x: startPos.x, t: startPos.y }, duration, Laya.Ease.linearOut, null);
            }
            Laya.Tween.to(target, { x: pos.x, y: pos.y }, duration, Laya.Ease.linearOut, handler);
        }
        toPosition_PingPong_Onece_delay(target, pos, duration, delay) {
            this.saveTarget(target);
            Laya.Tween.clearTween(target);
            let startPos = new Laya.Vector2(target.x, target.y);
            let handler = new Laya.Handler(this, backToStartPos);
            function backToStartPos() {
                Laya.Tween.to(target, { x: startPos.x, t: startPos.y }, duration, Laya.Ease.quadInOut, null, delay);
            }
            Laya.Tween.to(target, { x: pos.x, y: pos.y }, duration, Laya.Ease.quartIn, handler);
        }
        toPosition__Box_PingPong_Onece_delay(target, p_right, duration, delay) {
            this.saveTarget(target);
            Laya.Tween.clearTween(target);
            let startright = target.right;
            let handler = new Laya.Handler(this, backToStartPos);
            function backToStartPos() {
                Laya.Tween.to(target, { right: startright }, duration, Laya.Ease.quadInOut, null, delay);
            }
            Laya.Tween.to(target, { right: p_right }, duration, Laya.Ease.quartIn, handler);
        }
        toScaleRePlay(target, endpos, duration) {
            this.saveTarget(target);
            let satrtScale = new Laya.Vector2(target.scaleX, target.scaleY);
            pos1();
            function pos1() {
                target.scaleX = satrtScale.x;
                target.scaleY = satrtScale.y;
                var compeltehandler = new Laya.Handler(this, pos1);
                Laya.Tween.to(target, { scaleX: endpos.x, scaleY: endpos.y }, duration, null, compeltehandler);
            }
        }
    }

    class DataChangeEvent {
    }
    DataChangeEvent.SCORE_CHANGE = "ScoreChange";
    DataChangeEvent.FISH_COUNT_CHANGE = "FishCountChange";

    class CallBackRegisiter {
        constructor() {
        }
    }

    class GameDesgin {
    }
    GameDesgin.showaabbBoxLine = !!0;
    GameDesgin.enableCollsion = !!1;
    GameDesgin.logFps = false;
    GameDesgin.spwanFish = true;
    GameDesgin.spwanObstacle = true;

    class CollsionManagerThreeD extends Laya.Script {
        constructor() {
            super();
            this.detectObjs = [];
            this.Itemlist = [];
            this.enterList = [];
            this.exitList = [];
            this.datacg = {};
            this.filerZList = [];
        }
        onAwake() {
            CollsionManagerThreeD.instantce = this;
            EventManager.instance.on(EventType.ShapeThreeDEnterWorld, this, this.OnShapeThreeDEnterWorld);
        }
        OnShapeThreeDEnterWorld(o) {
            this.Itemlist.push(o);
            this.UpdateDetectMap();
        }
        SetDetectObj(o) {
            this.detectObjs.push(o);
            this.UpdateDetectMap();
        }
        UpdateDetectMap() {
            for (let i = 0; i < this.detectObjs.length; i++) {
                for (let j = 0; j < this.Itemlist.length; j++) {
                    const item = this.Itemlist[j];
                    if (this.detectObjs[i].detectmap[item.id] == null)
                        this.detectObjs[i].detectmap[item.id] = false;
                }
            }
        }
        onLateUpdate() {
            if (GameDesgin.enableCollsion) {
                if (this.detectObjs.length >= 1) {
                    for (let i = 0; i < this.detectObjs.length; i++) {
                        let detectAABB = this.detectObjs[i];
                        this.GetFilterZItems(this.detectObjs[i].transform.position.z, detectAABB);
                        this.Detect(detectAABB, detectAABB.moveSpeed);
                    }
                }
            }
        }
        Detect(source, movedir) {
            let sourcraabb = source;
            let testCount = 0;
            for (let index = 0; index < this.filerZList.length; index++) {
                let element = this.filerZList[index];
                let isCollstionTest = (source.collisionMask & 1 << element.mask) > 0;
                if (source.id != element.id && isCollstionTest) {
                    let targetId = element.id;
                    let targetaabb = element;
                    let collsion = false;
                    if (source.detectmap[targetId])
                        testCount += 1;
                    let t = new Laya.Vector3();
                    collsion = sourcraabb.Intersects(targetaabb);
                    if (collsion) {
                        let collsioning = false;
                        if (source.detectmap[targetId] == false) {
                            source.TriggerEnterEvent(source, element);
                            source.detectmap[targetId] = true;
                        }
                    }
                    else {
                        if (source.detectmap[targetId]) {
                            source.TriggerExitEvent(source, element);
                            source.detectmap[targetId] = false;
                        }
                    }
                }
            }
        }
        GetFilterZItems(zStart, remove_aabb) {
            this.filerZList = [];
            for (let index = 0; index < this.Itemlist.length; index++) {
                let element = this.Itemlist[index];
                if (element.gameObject.displayedInStage == false)
                    continue;
                if (element.gameObject.activeInHierarchy == false)
                    continue;
                if (element.gameObject.id == remove_aabb.gameObject.id)
                    continue;
                if (Math.abs(zStart - element.transform.position.z) > 20)
                    continue;
                this.filerZList.push(this.Itemlist[index]);
            }
        }
        IsSweepTestCollision(from, other, movement) {
            let deltaX = movement.x;
            let deltaY = movement.y;
            let deltaZ = movement.z;
            if (from.maxPoint.y > other.minPoint.y && from.minPoint.y < other.maxPoint.y && from.maxPoint.z > other.minPoint.z && from.minPoint.z < other.maxPoint.z) {
                let d1 = 0;
                if (deltaX > 0.0 && from.maxPoint.x <= other.minPoint.x) {
                    d1 = other.minPoint.x - from.maxPoint.x;
                    if (d1 < deltaX) {
                        deltaX = d1;
                        return true;
                    }
                }
                else if (deltaX < 0.0 && from.minPoint.x >= other.maxPoint.x) {
                    d1 = other.maxPoint.x - from.minPoint.x;
                    if (d1 > deltaX) {
                        deltaX = d1;
                        return true;
                    }
                }
            }
            if (from.maxPoint.x > other.minPoint.x && from.minPoint.x < other.maxPoint.x && from.maxPoint.z > other.minPoint.z && from.minPoint.z < other.maxPoint.z) {
                let d1;
                if (deltaY > 0 && from.maxPoint.y <= other.minPoint.y) {
                    d1 = other.minPoint.y - from.maxPoint.y;
                    if (d1 < deltaY) {
                        deltaY = d1;
                        return true;
                    }
                }
                else if (deltaY < 0 && from.minPoint.y >= other.maxPoint.y) {
                    d1 = other.maxPoint.y - from.minPoint.y;
                    if (d1 > deltaY) {
                        deltaY = d1;
                        return true;
                    }
                }
            }
            if (from.maxPoint.x > other.minPoint.x && from.minPoint.x < other.maxPoint.x && from.maxPoint.y > other.minPoint.y && from.minPoint.y < other.maxPoint.y) {
                let d1;
                if (deltaZ > 0.0 && from.maxPoint.z <= other.minPoint.z) {
                    d1 = other.minPoint.z - from.maxPoint.z;
                    if (d1 < deltaZ) {
                        deltaZ = d1;
                        return true;
                    }
                }
                else if (deltaZ < 0.0 && from.minPoint.z >= other.maxPoint.z) {
                    d1 = other.maxPoint.z - from.minPoint.z;
                    if (d1 > deltaZ) {
                        deltaZ = d1;
                        return true;
                    }
                }
            }
            return false;
        }
        SweepTestCollision(from, other, movement) {
            let deltaX = movement.x;
            let deltaY = movement.y;
            let deltaZ = movement.z;
            if (from.maxPoint.y > other.minPoint.y && from.minPoint.y < other.maxPoint.y && from.maxPoint.z > other.minPoint.z && from.minPoint.z < other.maxPoint.z) {
                let d1 = 0;
                if (deltaX > 0.0 && from.maxPoint.x <= other.minPoint.x) {
                    d1 = other.minPoint.x - from.maxPoint.x;
                    if (d1 < deltaX) {
                        deltaX = d1;
                    }
                }
                else if (deltaX < 0.0 && from.minPoint.x >= other.maxPoint.x) {
                    d1 = other.maxPoint.x - from.minPoint.x;
                    if (d1 > deltaX) {
                        deltaX = d1;
                    }
                }
            }
            if (from.maxPoint.x > other.minPoint.x && from.minPoint.x < other.maxPoint.x && from.maxPoint.z > other.minPoint.z && from.minPoint.z < other.maxPoint.z) {
                let d1;
                if (deltaY > 0 && from.maxPoint.y <= other.minPoint.y) {
                    d1 = other.minPoint.y - from.maxPoint.y;
                    if (d1 < deltaY) {
                        deltaY = d1;
                    }
                }
                else if (deltaY < 0 && from.minPoint.y >= other.maxPoint.y) {
                    d1 = other.maxPoint.y - from.minPoint.y;
                    if (d1 > deltaY) {
                        deltaY = d1;
                    }
                }
            }
            if (from.maxPoint.x > other.minPoint.x && from.minPoint.x < other.maxPoint.x && from.maxPoint.y > other.minPoint.y && from.minPoint.y < other.maxPoint.y) {
                let d1;
                if (deltaZ > 0.0 && from.maxPoint.z <= other.minPoint.z) {
                    d1 = other.minPoint.z - from.maxPoint.z;
                    if (d1 < deltaZ) {
                        deltaZ = d1;
                    }
                }
                else if (deltaZ < 0.0 && from.minPoint.z >= other.maxPoint.z) {
                    d1 = other.maxPoint.z - from.minPoint.z;
                    if (d1 > deltaZ) {
                        deltaZ = d1;
                    }
                }
            }
            return new Laya.Vector3(deltaX, deltaY, deltaZ);
            ;
        }
    }

    class CollisionMask {
    }
    CollisionMask.Character = 1;
    CollisionMask.Obstacle = 2;
    CollisionMask.Fish = 3;
    CollisionMask.Award = 4;
    CollisionMask.Gold = 5;
    CollisionMask.PaoDao = 6;
    CollisionMask.HuaPo = 7;
    CollisionMask.JiaSu = 8;
    CollisionMask.End = 9;
    class ShapeThreeD extends Laya.Script3D {
        constructor() {
            super();
            this.collisionEnter = [];
            this.collisionExit = [];
            this.collisionRayHit = [];
            this.mask = 0;
            this.detectmap = {};
            this.collisionMask = ~0;
            this.moveSpeed = new Laya.Vector3(0, 0, 0);
        }
        SetMask(p) {
            this.mask = p;
        }
        onAwake() {
            this.gameObject = this.owner;
            this.transform = this.gameObject.transform;
        }
        onStart() {
            EventManager.instance.event(EventType.ShapeThreeDEnterWorld, this);
        }
        onDestroy() {
            EventManager.instance.event(EventType.ShapeThreeDEnterWorld, this);
        }
        RegisetCollsionEnter(callder, func) {
            let pCallBackRegisiter = new CallBackRegisiter();
            pCallBackRegisiter.regisiter = callder;
            pCallBackRegisiter.enterCallbackFunc = func;
            this.collisionEnter.push(pCallBackRegisiter);
        }
        RegisetCollsionExit(callder, func) {
            let pCallBackRegisiter = new CallBackRegisiter();
            pCallBackRegisiter.regisiter = callder;
            pCallBackRegisiter.enterCallbackFunc = func;
            this.collisionExit.push(pCallBackRegisiter);
        }
        TriggerEnterEvent(source, target) {
            for (var iterator of this.collisionEnter) {
                var registerObj = iterator.regisiter;
                var func = iterator.enterCallbackFunc;
                func.apply(registerObj, [source, target]);
            }
        }
        TriggerExitEvent(source, target) {
            for (var iterator of this.collisionExit) {
                var registerObj = iterator.regisiter;
                var func = iterator.enterCallbackFunc;
                func.apply(registerObj, [source, target]);
            }
        }
        RegisetRayHitEnter(callBackRegisiter) {
            this.collisionRayHit.push(callBackRegisiter);
        }
        OnShapeRayHit(obb) {
            for (var iterator of this.collisionRayHit) {
                var registerObj = iterator.regisiter;
                var func = iterator.enterCallbackFunc;
                func.apply(registerObj, [obb]);
            }
        }
        ActiveDetec() {
            CollsionManagerThreeD.instantce.SetDetectObj(this);
        }
    }

    class SceneManager {
        static OnLoadLevelok(url, callder, callback, scene) {
            console.log('OnLoadLevelok ', url);
            callback.call(callder, scene);
        }
        static LoadSceneByNameAtAsset(name, callder, callbackFunc) {
            let url = 'res3d/' + name + '.ls';
            Laya.Scene3D.load(url, Laya.Handler.create(SceneManager, SceneManager.OnLoadLevelok, [url, callder, callbackFunc]), null);
        }
    }
    SceneManager.example_animatorUrl = 'res3d/LayaScene_Example_Animator/Conventional/Example_Animator.ls';

    class GameObject {
        constructor(node) {
            this.node = node;
            this.sprite3d = node;
        }
        static getFullPath(obj) {
            if (obj == null) {
                console.error("You must select Obj first!");
                return;
            }
            let path = [];
            path.push(obj.name);
            let selectChild = obj;
            if (selectChild != null) {
                while (selectChild.parent != null) {
                    selectChild = selectChild.parent;
                    path.push(selectChild.name);
                }
            }
            let rs = '';
            for (let index = path.length - 1; index >= 0; index--) {
                rs += path[index] + '/';
            }
            console.log(rs);
        }
        static GetChilds(node, childName) {
            let list = [];
            for (let index = 0; index < node.numChildren; index++) {
                let child = node.getChildAt(index);
                if (child.name == childName)
                    list.push(child);
            }
            return list;
        }
        static GetChildsByDeth(node, childName) {
            let list = GameObject.getAllChilds(node);
            let filerList = [];
            for (let index = 0; index < list.length; index++) {
                let child = list[index];
                if (child.name == childName)
                    filerList.push(child);
            }
            return filerList;
        }
        static Find(node, name) {
            var depth = name.split('/');
            var gob = node.getChildByName(depth[0]);
            for (let index = 1; index < depth.length; index++) {
                gob = gob.getChildByName(depth[index]);
            }
            return gob;
        }
        static FindChilds(name, node) {
            let list = [];
            for (let index = 0; index < node.numChildren; index++) {
                let c = node.getChildAt(index);
                if (name == c.name)
                    list.push(c);
            }
            return list;
        }
        static Instantiate(go) {
            var newGo = Laya.Sprite3D.instantiate(go.sprite3d);
            return newGo;
        }
        Clone_sprite3d() {
            return Laya.Sprite3D.instantiate(this.sprite3d);
        }
        static Instantiate2Scene(go, node) {
            var newGo = Laya.Sprite3D.instantiate(go);
            node.addChild(newGo);
            return newGo;
        }
        static Instantiate2Scene_Particle3d(go, node) {
            var newGo = go.clone();
            node.addChild(newGo);
            return newGo;
        }
        static Instantiate2SceneUseScene(go, Scene) {
            var newGo = Laya.Sprite3D.instantiate(go);
            Scene.addChild(newGo);
            return newGo;
        }
        static InstantiateGob(go) {
            if (go == null)
                return null;
            var newGo = Laya.Sprite3D.instantiate(go);
            return newGo;
        }
        static Add2Scene(go, node) {
            node.addChild(go);
        }
        static InstantiateNoScene(go) {
            var newGo = Laya.Sprite3D.instantiate(go);
            return newGo;
        }
        static GetTypeInChildren(t, _class) {
            for (const iterator of t._children) {
                if ((iterator) instanceof _class)
                    return iterator;
            }
            return null;
        }
        static GetTypesInChildren(t, _class) {
            var list = [];
            for (const iterator of t._children) {
                if ((iterator) instanceof _class)
                    list.push(iterator);
            }
            return list;
        }
        static FindUseNode(name, node) {
            let depth = name.split('/');
            if (depth == null || depth.length == 0) {
                return node.getChildByName(name);
            }
            let gob = node.getChildByName(depth[0]);
            for (let index = 1; index < depth.length; index++) {
                gob = gob.getChildByName(depth[index]);
            }
            return gob;
        }
        static FindUseNodeNoDeth(name, node) {
            var gob = node.getChildByName(name);
            return gob;
        }
        static FindChildAtUseNode(idx, node) {
            let gob = node.getChildAt(idx);
            return gob;
        }
        static getChildAttUseNode(idx, node) {
            let gob = node.getChildAt(idx);
            return gob;
        }
        static GetComponentsInChildren(t, _class) {
            if (t == null)
                return null;
            var allchilds = GameObject.getChildsDeth(t);
            var list = [];
            for (const iterator of allchilds) {
                if ((iterator) instanceof _class)
                    list.push(iterator);
            }
            return list;
        }
        static GetComponentsInChildrenU3d(t, _class) {
            if (t == null)
                return null;
            var allchilds = GameObject.getChildsDeth(t);
            var list = [];
            for (const iterator of allchilds) {
                let com = iterator.getComponent(_class);
                if (com != null)
                    list.push(com);
            }
            return list;
        }
        static FindChilds_deth(node, name) {
            if (node == null)
                return null;
            var allchilds = GameObject.getChildsDeth(node);
            var list = [];
            for (const iterator of allchilds) {
                let isok = iterator.name == name;
                if (isok)
                    list.push(iterator);
            }
            return list;
        }
        static getAllChilds(owner) {
            var list = [];
            var _children = [];
            for (let index = 0; index < owner.numChildren; index++) {
                _children.push(owner.getChildAt(index));
            }
            for (const iterator of _children) {
                list.push(iterator);
            }
            for (let index = 0; index < _children.length; index++) {
                var t = this.getAllChilds(_children[index]);
                for (const iterator of t) {
                    list.push(iterator);
                }
            }
            return list;
        }
        static getChildsByNameDeth(owner, name) {
            var list = [];
            var arr = GameObject.getAllChilds(owner);
            for (const iterator of arr) {
                if (iterator.name == name)
                    list.push(iterator);
            }
            return list;
        }
        static getChildsDeth(owner) {
            var list = [];
            var arr = GameObject.getAllChilds(owner);
            for (const iterator of arr) {
                list.push(iterator);
            }
            return list;
        }
    }

    class PathLineDrawer extends Laya.Script {
        constructor() { super(); }
        onAwake() {
            this.phasorSpriter3D = new Laya.PixelLineSprite3D(10, "my");
        }
        onEnable() {
        }
        onStart() {
            GameObject.Add2Scene(this.phasorSpriter3D, SceneManager.game);
        }
        onUpdate() {
        }
        onDisable() {
        }
        OnDrawGizmos() {
            this.phasorSpriter3D.clear();
            this.phasorSpriter3D.addLine(this.start, this.end, Laya.Color.RED, Laya.Color.RED);
        }
        clear() {
            this.phasorSpriter3D.clear();
        }
        addLine(pstart, pend) {
            this.phasorSpriter3D.addLine(pstart, pend, Laya.Color.RED, Laya.Color.RED);
        }
    }

    class Mathf {
        static Sin(t) {
            return Math.sin(t);
        }
        static Abs(v) {
            return Math.abs(v);
        }
        static Cos(x) {
            return Math.cos(x);
        }
        static LerpAngle(a, b, t) {
            var num = Mathf.Repeat(b - a, 360.0);
            if (num > 180.0)
                num -= 360.0;
            return a + num * Mathf.Clamp01(t);
        }
        static Repeat(t, length) {
            return t - Mathf.Floor(t / length) * length;
        }
        static Floor(f) {
            return Math.floor(f);
        }
        static Clamp01(value) {
            if (value < 0.0)
                return 0.0;
            if (value > 1.0)
                return 1.0;
            return value;
        }
        static Acos(value) {
            return Math.acos(value);
        }
        static Atan2(x, y) {
            return Math.atan2(x, y);
        }
        static Lerp(a, b, t) {
            return a + (b - a) * Mathf.Clamp01(t);
        }
        static InverseLerp(a, b, value) {
            if (a != b)
                return Mathf.Clamp01((value - a) / (b - a));
            else
                return 0.0;
        }
        static Max(a, b) {
            return a > b ? a : b;
        }
        static Min(a, b) {
            return a < b ? a : b;
        }
        static Clamp(value, min, max) {
            if (value < min)
                value = min;
            else if (value > max)
                value = max;
            return value;
        }
        static PingPong(t, length) {
            t = this.Repeat(t, length * 2);
            return length - Mathf.Abs(t - length);
        }
    }
    Mathf.Deg2Rad = 0.0174532924;
    Mathf.Rad2Deg = 57.29578;
    Mathf.PI = 3.14159274;

    class Vector3Ext {
        static normalize(vec) {
            Laya.Vector3.normalize(vec, vec);
        }
        static mul_Num(vec, l) {
            return new Laya.Vector3(vec.x * l, vec.y * l, vec.z * l);
        }
        static mul_Num_Fast(vec, l, out) {
            out.x = vec.x * l;
            out.y = vec.y * l;
            out.z = vec.z * l;
        }
        static mul_Num_gc(vec, l, outVec) {
            outVec.x = vec.x * l;
            outVec.y = vec.y * l;
            outVec.z = vec.z * l;
        }
        static mul(a, b) {
            var c = new Laya.Vector3();
            Laya.Vector3.multiply(a, b, c);
            return c;
        }
        static add(a, b) {
            var c = new Laya.Vector3();
            Laya.Vector3.add(a, b, c);
            return c;
        }
        static add_Fast(a, b, c) {
            Laya.Vector3.add(a, b, c);
        }
        static sub(a, b) {
            var c = new Laya.Vector3();
            Laya.Vector3.subtract(a, b, c);
            return c;
        }
        static sub_Fast(a, b, c) {
            Laya.Vector3.subtract(a, b, c);
        }
        static Lerp_u3d(a, b, t) {
            t = Mathf.Clamp01(t);
            return new Laya.Vector3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
        }
        static Lerp(a, b, t) {
            t = Mathf.Clamp01(t);
            return new Laya.Vector3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
        }
        static Lerp_Fast(a, b, c, t) {
            t = Mathf.Clamp01(t);
            c.x = a.x + (b.x - a.x) * t;
            c.y = a.y + (b.y - a.y) * t;
            c.z = a.z + (b.z - a.z) * t;
        }
    }
    Vector3Ext.Up = new Laya.Vector3(0, 1, 0);
    Vector3Ext.up = new Laya.Vector3(0, 1, 0);
    Vector3Ext.Zero = new Laya.Vector3(0, 0, 0);
    Vector3Ext.zero = new Laya.Vector3(0, 0, 0);
    Vector3Ext.forward = new Laya.Vector3(0, 0, -1);
    Vector3Ext.forwardU3d = new Laya.Vector3(0, 0, 1);
    Vector3Ext.down = new Laya.Vector3(0, -1, 0);
    Vector3Ext.one = new Laya.Vector3(1, 1, 1);
    Vector3Ext.left = new Laya.Vector3(-1, 0, 0);
    Vector3Ext.right = new Laya.Vector3(1, 0, 0);

    class AABBShape extends ShapeThreeD {
        constructor() {
            super();
            this.drawAABBLine = false;
            this.minPoint = new Laya.Vector3();
            this.maxPoint = new Laya.Vector3();
            this.halfSize = new Laya.Vector3();
            this.center = new Laya.Vector3();
            this._center = new Laya.Vector3();
        }
        onStart() {
            super.onStart();
        }
        onUpdate() {
            this.UpdateShape(this.transform);
            if (this.line != null) {
                this.line.clear();
                var list = this.FacePonintsA();
                this.line.addLine(list[0], list[1]);
                this.line.addLine(list[2], list[3]);
                this.line.addLine(list[4], list[5]);
                this.line.addLine(list[6], list[7]);
                var list2 = this.FacePonintsTop();
                this.line.addLine(list2[0], list2[1]);
                this.line.addLine(list2[2], list2[3]);
                this.line.addLine(list2[4], list2[5]);
                this.line.addLine(list2[6], list2[7]);
            }
        }
        onAwake() {
            super.onAwake();
            this.onUpdate();
            if (GameDesgin.showaabbBoxLine)
                this.line = this.owner.addComponent(PathLineDrawer);
        }
        onEnable() {
        }
        onDisable() {
            if (this.line != null) {
                this.line.clear();
            }
        }
        rightBottomPonint() {
            return new Laya.Vector3(0, this.minPoint.y, this.maxPoint.z);
        }
        FacePonintsA() {
            var list = [];
            var minz = this.minPoint.z;
            list.push(new Laya.Vector3(this.minPoint.x, this.minPoint.y, minz));
            list.push(new Laya.Vector3(this.maxPoint.x, this.minPoint.y, minz));
            list.push(new Laya.Vector3(this.minPoint.x, this.maxPoint.y, minz));
            list.push(new Laya.Vector3(this.maxPoint.x, this.maxPoint.y, minz));
            list.push(new Laya.Vector3(this.minPoint.x, this.minPoint.y, minz));
            list.push(new Laya.Vector3(this.minPoint.x, this.maxPoint.y, minz));
            list.push(new Laya.Vector3(this.maxPoint.x, this.minPoint.y, minz));
            list.push(new Laya.Vector3(this.maxPoint.x, this.maxPoint.y, minz));
            return list;
        }
        FacePonintsTop() {
            var list = [];
            var maxz = this.maxPoint.z;
            var minz = this.minPoint.z;
            list.push(new Laya.Vector3(this.minPoint.x, this.maxPoint.y, minz));
            list.push(new Laya.Vector3(this.maxPoint.x, this.maxPoint.y, minz));
            list.push(new Laya.Vector3(this.minPoint.x, this.maxPoint.y, maxz));
            list.push(new Laya.Vector3(this.minPoint.x, this.maxPoint.y, minz));
            list.push(new Laya.Vector3(this.maxPoint.x, this.maxPoint.y, maxz));
            list.push(new Laya.Vector3(this.maxPoint.x, this.maxPoint.y, minz));
            list.push(new Laya.Vector3(this.minPoint.x, this.maxPoint.y, maxz));
            list.push(new Laya.Vector3(this.maxPoint.x, this.maxPoint.y, maxz));
            return list;
        }
        UpdateShape(transform) {
            Vector3Ext.add_Fast(this.center, transform.position, this._center);
            Vector3Ext.mul_Num_Fast(this.size, 0.5, this.halfSize);
            Vector3Ext.sub_Fast(this._center, this.halfSize, this.minPoint);
            Vector3Ext.add_Fast(this._center, this.halfSize, this.maxPoint);
        }
        Intersects(aabb) {
            return this.minPoint.x < aabb.maxPoint.x &&
                this.minPoint.y < aabb.maxPoint.y &&
                this.minPoint.z < aabb.maxPoint.z &&
                aabb.minPoint.x < this.maxPoint.x &&
                aabb.minPoint.y < this.maxPoint.y &&
                aabb.minPoint.z < this.maxPoint.z;
        }
    }

    class GameObject$1 {
        constructor(node) {
            this.node = node;
            this.sprite3d = node;
        }
        static getFullPath(obj) {
            if (obj == null) {
                console.error("You must select Obj first!");
                return;
            }
            let path = [];
            path.push(obj.name);
            let selectChild = obj;
            if (selectChild != null) {
                while (selectChild.parent != null) {
                    selectChild = selectChild.parent;
                    path.push(selectChild.name);
                }
            }
            let rs = '';
            for (let index = path.length - 1; index >= 0; index--) {
                rs += path[index] + '/';
            }
            console.log(rs);
        }
        static GetChilds(node, childName) {
            let list = [];
            for (let index = 0; index < node.numChildren; index++) {
                let child = node.getChildAt(index);
                if (child.name == childName)
                    list.push(child);
            }
            return list;
        }
        static GetChildsByDeth(node, childName) {
            let list = GameObject$1.getAllChilds(node);
            let filerList = [];
            for (let index = 0; index < list.length; index++) {
                let child = list[index];
                if (child.name == childName)
                    filerList.push(child);
            }
            return filerList;
        }
        static Find(node, name) {
            var depth = name.split('/');
            var gob = node.getChildByName(depth[0]);
            for (let index = 1; index < depth.length; index++) {
                gob = gob.getChildByName(depth[index]);
            }
            return gob;
        }
        static FindChilds(name, node) {
            let list = [];
            for (let index = 0; index < node.numChildren; index++) {
                let c = node.getChildAt(index);
                if (name == c.name)
                    list.push(c);
            }
            return list;
        }
        static Instantiate(go) {
            var newGo = Laya.Sprite3D.instantiate(go.sprite3d);
            return newGo;
        }
        Clone_sprite3d() {
            return Laya.Sprite3D.instantiate(this.sprite3d);
        }
        static Instantiate2Scene(go, node) {
            var newGo = Laya.Sprite3D.instantiate(go);
            node.addChild(newGo);
            return newGo;
        }
        static Instantiate2Scene_Particle3d(go, node) {
            var newGo = go.clone();
            node.addChild(newGo);
            return newGo;
        }
        static Instantiate2SceneUseScene(go, Scene) {
            var newGo = Laya.Sprite3D.instantiate(go);
            Scene.addChild(newGo);
            return newGo;
        }
        static InstantiateGob(go) {
            if (go == null)
                return null;
            var newGo = Laya.Sprite3D.instantiate(go);
            return newGo;
        }
        static Add2Scene(go, node) {
            node.addChild(go);
        }
        static InstantiateNoScene(go) {
            var newGo = Laya.Sprite3D.instantiate(go);
            return newGo;
        }
        static GetTypeInChildren(t, _class) {
            for (const iterator of t._children) {
                if ((iterator) instanceof _class)
                    return iterator;
            }
            return null;
        }
        static GetTypesInChildren(t, _class) {
            var list = [];
            for (const iterator of t._children) {
                if ((iterator) instanceof _class)
                    list.push(iterator);
            }
            return list;
        }
        static FindUseNode(name, node) {
            let depth = name.split('/');
            if (depth == null || depth.length == 0) {
                return node.getChildByName(name);
            }
            let gob = node.getChildByName(depth[0]);
            for (let index = 1; index < depth.length; index++) {
                gob = gob.getChildByName(depth[index]);
            }
            return gob;
        }
        static FindUseNodeNoDeth(name, node) {
            var gob = node.getChildByName(name);
            return gob;
        }
        static FindChildAtUseNode(idx, node) {
            let gob = node.getChildAt(idx);
            return gob;
        }
        static getChildAttUseNode(idx, node) {
            let gob = node.getChildAt(idx);
            return gob;
        }
        static GetComponentsInChildren(t, _class) {
            if (t == null)
                return null;
            var allchilds = GameObject$1.getChildsDeth(t);
            var list = [];
            for (const iterator of allchilds) {
                if ((iterator) instanceof _class)
                    list.push(iterator);
            }
            return list;
        }
        static GetComponentsInChildrenU3d(t, _class) {
            if (t == null)
                return null;
            var allchilds = GameObject$1.getChildsDeth(t);
            var list = [];
            for (const iterator of allchilds) {
                let com = iterator.getComponent(_class);
                if (com != null)
                    list.push(com);
            }
            return list;
        }
        static FindChilds_deth(node, name) {
            if (node == null)
                return null;
            var allchilds = GameObject$1.getChildsDeth(node);
            var list = [];
            for (const iterator of allchilds) {
                let isok = iterator.name == name;
                if (isok)
                    list.push(iterator);
            }
            return list;
        }
        static getAllChilds(owner) {
            var list = [];
            var _children = [];
            for (let index = 0; index < owner.numChildren; index++) {
                _children.push(owner.getChildAt(index));
            }
            for (const iterator of _children) {
                list.push(iterator);
            }
            for (let index = 0; index < _children.length; index++) {
                var t = this.getAllChilds(_children[index]);
                for (const iterator of t) {
                    list.push(iterator);
                }
            }
            return list;
        }
        static getChildsByNameDeth(owner, name) {
            var list = [];
            var arr = GameObject$1.getAllChilds(owner);
            for (const iterator of arr) {
                if (iterator.name == name)
                    list.push(iterator);
            }
            return list;
        }
        static getChildsDeth(owner) {
            var list = [];
            var arr = GameObject$1.getAllChilds(owner);
            for (const iterator of arr) {
                list.push(iterator);
            }
            return list;
        }
    }

    class SeedRnd {
        constructor(p_seed) {
            this.seed = 1;
            this.seed = p_seed;
        }
        rnd() {
            this.seed = (this.seed * 9301 + 49297) % 233280;
            return this.seed / 233280.0;
        }
        ;
        getRandomInt(min, max) {
            let range = max - min;
            return (min + Math.round(this.rnd() * range));
        }
        ;
        getRandomInt_NotIncludeMax(min, max) {
            return this.getRandomInt(min, max - 1);
        }
        ;
        getRandomIntArry(num) {
            let idx = this.getRandomInt(0, num.length - 1);
            return num[idx];
        }
        ;
    }

    class SpwanItemData {
        constructor() {
            this.goName = '';
            this.length = 0;
            this.active = false;
        }
    }
    class SpawnItem {
    }
    class SpwanConfigObj {
        constructor() {
            this.findRoot = '';
            this.startCreateZ = 0;
            this.CreateLength = 0;
            this.recoverOffset = 0;
        }
    }
    class BaseSpawn extends Laya.Script {
        constructor() {
            super(...arguments);
            this.runtimeItems = [];
            this.poolsignMap = new Dictionary();
            this.currentZ = 0;
            this.startCreateZ = 0;
            this.seed = new SeedRnd(0);
        }
        onStart() {
            this.startCreateZ = this.spwanConfigObj.startCreateZ;
            this.Create2End();
        }
        endZ() {
            return this.currentZ + this.spwanConfigObj.CreateLength;
        }
        Create2End() {
            var p_endZ = this.endZ();
            while (this.startCreateZ < p_endZ) {
                let spawnItem = this.DoSpawnItem(this.startCreateZ);
                this.startCreateZ += spawnItem.spwanItemData.length;
            }
        }
        DoSpawnItem(z) {
            let rndIdx = this.seed.getRandomInt_NotIncludeMax(0, this.spwanConfigObj.spwanItemDatas.length);
            var spwanItemData = this.spwanConfigObj.spwanItemDatas[rndIdx];
            var item = Laya.Pool.getItemByCreateFun(spwanItemData.goName, () => { return this.CreateSpwanItem(spwanItemData); }, this);
            this.scene.addChild(item.gob);
            this.onSpawn(item.gob, spwanItemData, z);
            item.gob.active = true;
            return item;
        }
        CreateSpwanItem(spwanItemData) {
            var gob = GameObject$1.Find(this.scene, this.spwanConfigObj.findRoot + '/' + spwanItemData.goName);
            var newGo = Laya.Sprite3D.instantiate(gob);
            this.scene.addChildren(newGo);
            newGo.active = true;
            let spawnItem = new SpawnItem();
            spawnItem.gob = newGo;
            spawnItem.spwanItemData = spwanItemData;
            this.runtimeItems.push(spawnItem);
            this.poolsignMap.setValue(spwanItemData.goName, 'poolsign');
            return spawnItem;
        }
        onSpawn(newGo, spwanItemData, z, index, y) {
        }
        onUpdate() {
            this.Create2End();
            this.recoverLessZ();
        }
        recoverLessZ() {
            for (const spwanitem of this.runtimeItems) {
                if (spwanitem.gob.displayedInStage) {
                    let length = spwanitem.spwanItemData.length;
                    if (spwanitem.gob.transform.position.z + length * 0.5 < this.currentZ + this.spwanConfigObj.recoverOffset) {
                        Laya.Pool.recover(spwanitem.spwanItemData.goName, spwanitem);
                        spwanitem.gob.removeSelf();
                    }
                }
            }
        }
        recoverAll() {
            for (const spwanitem of this.runtimeItems) {
                if (true) {
                    {
                        Laya.Pool.recover(spwanitem.spwanItemData.goName, spwanitem);
                        spwanitem.gob.removeSelf();
                    }
                }
            }
        }
        onDestroy() {
            for (const iterator of this.poolsignMap.keys) {
                Laya.Pool.clearBySign(iterator);
            }
        }
    }

    class BuildSpawn extends BaseSpawn {
        constructor() {
            super(...arguments);
            this.runtimeItems = [];
            this.poolsignMap = new Dictionary();
            this.currentZ = 0;
            this.startCreateZ = 0;
            this.seed = new SeedRnd(0);
        }
        onStart() {
            this.startCreateZ = this.spwanConfigObj.startCreateZ;
            this.Create2End();
        }
        endZ() {
            return this.currentZ + this.spwanConfigObj.CreateLength;
        }
        Create2End() {
            var p_endZ = this.endZ();
            while (this.startCreateZ < p_endZ) {
                let spawnItem = this.DoSpawnItem(this.startCreateZ);
                this.startCreateZ += spawnItem.spwanItemData.length;
            }
        }
        DoSpawnItem(z) {
            var spwanItemData = this.spwanConfigObj.spwanItemDatas[0];
            var item = Laya.Pool.getItemByCreateFun(spwanItemData.goName, () => { return this.CreateSpwanItem(spwanItemData); }, this);
            this.scene.addChild(item.gob);
            this.onSpawn(item.gob, spwanItemData, z);
            return item;
        }
        CreateSpwanItem(spwanItemData) {
            var gob = GameObject$1.Find(this.scene, this.spwanConfigObj.findRoot + '/' + spwanItemData.goName);
            var newGo = Laya.Sprite3D.instantiate(gob);
            this.scene.addChildren(newGo);
            newGo.active = true;
            let spawnItem = new SpawnItem();
            spawnItem.gob = newGo;
            spawnItem.spwanItemData = spwanItemData;
            this.runtimeItems.push(spawnItem);
            this.poolsignMap.setValue(spwanItemData.goName, 'poolsign');
            return spawnItem;
        }
        onSpawn(newGo, spwanItemData, z) {
            newGo.transform.position = new Laya.Vector3(0, 0, z);
            let scale = newGo.transform.localScale;
            let arryNum = [-1, 1];
            let x = this.seed.getRandomIntArry(arryNum);
            scale.x = x;
            newGo.transform.localScale = scale;
        }
        onUpdate() {
            this.Create2End();
            this.recoverLessZ_build();
        }
        recoverLessZ_build() {
            for (const spwanitem of this.runtimeItems) {
                if (spwanitem.gob.displayedInStage) {
                    let length = spwanitem.spwanItemData.length;
                    if (spwanitem.gob.transform.position.z + length * 0.5 < this.currentZ + this.spwanConfigObj.recoverOffset) {
                        spwanitem.gob.transform.localScaleX = 1;
                        Laya.Pool.recover(spwanitem.spwanItemData.goName, spwanitem);
                        spwanitem.gob.removeSelf();
                    }
                }
            }
        }
        onDestroy() {
            for (const iterator of this.poolsignMap.keys) {
                Laya.Pool.clearBySign(iterator);
            }
        }
    }

    class FishSpwan extends BaseSpawn {
        constructor() {
            super(...arguments);
            this.gap = 0;
            this.xpos = 0;
        }
        Create2End() {
            var p_endZ = this.endZ();
            while (this.startCreateZ < p_endZ) {
                let arryNum = [-1.25, 0, 1.25];
                this.xpos = this.seed.getRandomIntArry(arryNum);
                for (let index = 0; index < 5; index++) {
                    let spawnItem = this.DoSpawnItem(this.startCreateZ);
                    this.startCreateZ += spawnItem.spwanItemData.length;
                }
                this.gap = this.seed.getRandomInt(10, 30);
                this.startCreateZ += this.gap;
            }
        }
        onSpawn(newGo, spwanItemData, z) {
            newGo.transform.position = new Laya.Vector3(this.xpos, 0.41, z);
            newGo.active = true;
        }
        CreateSpwanItem(spwanItemData) {
            let item = super.CreateSpwanItem(spwanItemData);
            let newgo = item.gob;
            let boxCollider = new AABBShape();
            boxCollider.mask = CollisionMask.Fish;
            boxCollider.collisionMask = 0;
            boxCollider.size = new Laya.Vector3(1, 1, 0.34);
            boxCollider.center = new Laya.Vector3(0, 0, 0);
            newgo.addComponentIntance(boxCollider);
            return item;
        }
    }

    class MathUtli {
        static radianToDegree(radian) {
            return (180 * radian) / Math.PI;
        }
        static degreeToRadian(angle) {
            return (angle * Math.PI) / 180;
        }
        static randomInt(min, max) {
            var d = max - min + 1;
            return Math.floor(min + Math.random() * d);
        }
        static deepCopy(source) {
            if (null == source || {} == source || [] == source) {
                return source;
            }
            let newObject;
            let isArray = false;
            if (source.length) {
                newObject = [];
                isArray = true;
            }
            else {
                newObject = {};
                isArray = false;
            }
            for (let key of Object.keys(source)) {
                if (null == source[key]) {
                    newObject[key] = source[key];
                }
                else {
                    let sub = (typeof source[key] == 'object') ? this.deepCopy(source[key]) : source[key];
                    if (isArray) {
                        newObject.push(sub);
                    }
                    else {
                        newObject[key] = sub;
                    }
                }
            }
            return newObject;
        }
    }

    class HouseSpawn extends BuildSpawn {
        constructor(randomScaleX) {
            super();
            this._flip = 1;
            this._houseSpace = 5;
            this.randomScaleX = 1;
            this.randomScaleX = randomScaleX;
        }
        onStart() {
            this.Create2End();
        }
        Create2End() {
            var p_endZ = this.endZ();
            let startZ = this.startCreateZ;
            while (startZ < p_endZ) {
                let spawnItem1 = this.DoSpawnItem(this.startCreateZ);
                this.startCreateZ += spawnItem1.spwanItemData.length + this._houseSpace;
                startZ = this.startCreateZ;
            }
        }
        onSpawn(newGo, spwanItemData, z) {
            newGo.transform.position = new Laya.Vector3(0, 0, z);
            if (newGo.transform.localScaleX == -1) {
                newGo.transform.localScaleX = 1;
            }
            newGo.transform.localScale = new Laya.Vector3(1 * this.randomScaleX, 1, 1);
        }
        DoSpawnItem(z) {
            let rndIdx = MathUtli.randomInt(0, this.spwanConfigObj.spwanItemDatas.length - 1);
            var spwanItemData = this.spwanConfigObj.spwanItemDatas[rndIdx];
            var item = Laya.Pool.getItemByCreateFun(spwanItemData.goName, () => { return this.CreateSpwanItem(spwanItemData); }, this);
            this.scene.addChild(item.gob);
            this.onSpawn(item.gob, spwanItemData, z);
            return item;
        }
    }

    class RandomData {
        constructor() {
            this._configArray = null;
            this.initArray();
        }
        initArray() {
            let randomConfig = Laya.loader.getRes("config/random.json");
            let array = new Array();
            for (let key in randomConfig) {
                let element = randomConfig[key];
                array.push(element);
            }
            this._configArray = MathUtli.deepCopy(array);
        }
        createRandomNumber() {
            let array = [];
            let length = this._configArray.length;
            let time1 = new Date().getTime();
            for (let i = 0; i < length; i++) {
                console.log("================随机第", i, "数据=================");
                let tempArray = this.createRandowByIndex(i);
                tempArray.push(12);
                array = array.concat(tempArray);
            }
            let time2 = new Date().getTime();
            console.log("=======================运行时间：", time2 - time1, "===========================");
            return array;
        }
        createRandowByIndex(index) {
            let levelConfig = this._configArray[index];
            let outArray = [];
            let totalTimes = levelConfig.totalTimes;
            let randomTimesArray = levelConfig.randomTimes;
            let randomArray = levelConfig.randomArray;
            let randomArrayUse = this.getRandomArrayUse(randomArray);
            while (totalTimes) {
                let randowIndex = MathUtli.randomInt(0, randomArrayUse.length - 1);
                let outRandowValue = randomArrayUse[randowIndex];
                outArray.push(outRandowValue);
                for (let i = 0; i < randomArray.length; i++) {
                    let splitArray = randomArray[i];
                    if (splitArray.indexOf(outRandowValue) > -1) {
                        randomTimesArray[i] -= 1;
                        if (randomTimesArray[i] == 0) {
                            randomArray.splice(i, 1);
                            randomTimesArray.splice(i, 1);
                            randomArrayUse = this.getRandomArrayUse(randomArray);
                        }
                        break;
                    }
                }
                totalTimes -= 1;
            }
            return outArray;
        }
        getRandomArrayUse(randomArray) {
            let randomArrayUse = [];
            for (let i = 0; i < randomArray.length; i++) {
                let tempArray = randomArray[i];
                randomArrayUse = randomArrayUse.concat(tempArray);
            }
            return randomArrayUse;
        }
    }

    class MapData {
        constructor() {
            this._randomDataArray = null;
            this._len = 0;
            this._curUsingArray = null;
            this.initRandom();
        }
        initRandom() {
            let data = new RandomData();
            this._randomDataArray = data.createRandomNumber();
            this._len = this._randomDataArray.length;
        }
        create() {
            for (let i = 0; i < this._len; i++) {
                let type = this._randomDataArray[i];
            }
        }
        popUsedData() {
            let popdata = 0;
            if (null != this._randomDataArray && this._randomDataArray.length > 0) {
                popdata = this._randomDataArray.shift();
            }
            return popdata;
        }
        createRoadDataByType() {
            let type = this.popUsedData();
            let tempData = Laya.loader.getRes("config/model_" + type + ".json");
            let data = tempData["ed"]["model_" + type + "Table"];
            return this.organizeData(data);
        }
        getRowConfig() {
            if (this._curUsingArray == null) {
                this._curUsingArray = new Array();
            }
            if (this._curUsingArray.length == 0) {
                this._curUsingArray = this.createRoadDataByType();
            }
            return this._curUsingArray.shift();
        }
        organizeData(data) {
            let arr = [];
            for (const key in data) {
                let element = data[key];
                arr.push(element);
            }
            return arr;
        }
    }

    class Rotation extends Laya.Script {
        constructor() {
            super();
            this._transform = null;
            this._speed = 0.1;
        }
        onAwake() {
            this._transform = this.owner.transform;
        }
        onUpdate() {
            if (this._transform == null)
                return;
            let speed = Laya.timer.delta * this._speed;
            if (this.owner.active) {
                this._transform.rotate(new Laya.Vector3(0, speed, 0), true, false);
            }
            else {
            }
        }
        resetTransform(value) {
            this._transform = value;
        }
        recover() {
            this._transform = null;
        }
    }

    class Obstacle {
    }
    class ObstacleSpawn extends BaseSpawn {
        constructor() {
            super(...arguments);
            this._obstacleSpawnArray = [
                "jiasu", "jinbi", "jinche", "chonglangban", "xiahualangan",
                "shangche", "dabache", "dabacheding", "huapo",
                "guanggaopai", "jiazi", "ludeng", "xiaofangshuan", "lajitong", "clbani_r", "clbani_l"
            ];
            this._decorateObjName = ["guanggaopai", "jiazi", "ludeng", "xiaofangshuan", "lajitong"];
            this.itemMap = new Dictionary();
            this.gap = 10;
            this._mapData = null;
            this._guideOffZArray = [8, 4.5];
            this.starBigSacle = new Laya.Vector3(2, 2, 2);
            this.starsamllSacle = new Laya.Vector3(1, 1, 1);
            this.guideIdx = 0;
            this._initRotationEulerY = 0;
        }
        onAwake() {
            this._mapData = new MapData();
        }
        Create2End() {
            var p_endZ = this.endZ();
            while (this.startCreateZ < p_endZ) {
                let spwanitem = null;
                let guiderOffser = 0;
                if (this.guideIdx <= 1 && GlobalData.isGuide) {
                    spwanitem = this.DoSpawnItemGuider(this.startCreateZ + 14);
                    guiderOffser = 20;
                    GameScript.instance.guiderz[this.guideIdx - 1] = 20 * this.guideIdx - this._guideOffZArray[this.guideIdx - 1];
                    this.startCreateZ += 20;
                }
                else if (GameScript.instance.useSpwanobstacle)
                    spwanitem = this.DoSpawnItem(this.startCreateZ);
                if (GameScript.instance.useSpwanobstacle)
                    this.startCreateZ += 2;
                else {
                    this.startCreateZ += 50 + this.gap + guiderOffser;
                }
            }
        }
        DoSpawnItem(z) {
            let rowConf = this._mapData.getRowConfig();
            for (let key in rowConf) {
                if (Object.prototype.hasOwnProperty.call(rowConf, key)) {
                    if (key == "row")
                        continue;
                    let element = rowConf[key];
                    if (element.length == 1 && element[0] == 0) {
                        continue;
                    }
                    let type = this.getConfigIndex(key);
                    var spwanItemData = this.spwanConfigObj.spwanItemDatas[type];
                    let hightArray = [];
                    for (let i = 0; i < element.length; i++) {
                        if (spwanItemData.goName == "jinbi") {
                            let str = element[i];
                            hightArray = str.split("|");
                        }
                        let item = Laya.Pool.getItemByCreateFun(spwanItemData.goName, () => { return this.CreateSpwanItem(spwanItemData); }, this);
                        if (spwanItemData.goName == "clbani_r" || spwanItemData.goName == "clbani_l") {
                            let ani = item.gob.getChildAt(0).getComponent(Laya.Animator);
                            ani.play("idle");
                            GameScript.instance.aniArray.push(item.gob);
                        }
                        this.scene.addChild(item.gob);
                        if (spwanItemData.goName == "jinbi" && hightArray.length > 1) {
                            this.onSpawn(item.gob, spwanItemData, z, parseInt(hightArray[0]), parseInt(hightArray[1]));
                        }
                        else {
                            this.onSpawn(item.gob, spwanItemData, z, element[i]);
                        }
                        item.gob.active = true;
                    }
                }
            }
            return null;
        }
        getConfigIndex(key) {
            return this._obstacleSpawnArray.indexOf(key);
        }
        DoSpawnItemGuider(z) {
            let rndIdx = this.guideIdx;
            let x = 0;
            if (this.guideIdx == 0)
                rndIdx = 2;
            if (this.guideIdx == 1)
                rndIdx = 4;
            var spwanItemData = this.spwanConfigObj.spwanItemDatas[rndIdx];
            let item = Laya.Pool.getItemByCreateFun(spwanItemData.goName, () => { return this.CreateSpwanItem(spwanItemData); }, this);
            this.scene.addChild(item.gob);
            this.onSpawnGuide(item.gob, spwanItemData, z, x);
            this.guideIdx += 1;
            return item;
        }
        onSpawn(newGo, spwanItemData, z, index, y = 0) {
            if (spwanItemData.goName == 'jinche' || spwanItemData.goName == 'shangche' || spwanItemData.goName == "dabache" || spwanItemData.goName == "dabacheding") {
                let arrNum = [-3.2, 0, 3.2];
                let x = arrNum[index - 1];
                newGo.transform.position = new Laya.Vector3(x, 0, z + 2);
            }
            else if (spwanItemData.goName == "huapo") {
                let arrNum = [-3.2, 0, 3.2];
                let x = arrNum[index - 1];
                newGo.transform.position = new Laya.Vector3(x, 0, z + 2);
            }
            else if (spwanItemData.goName == 'jinbi' || spwanItemData.goName == 'jiasu') {
                let arrNum = [-3.1, 0, 3.1];
                let x = arrNum[index - 1];
                this._initRotationEulerY += 30;
                if (this._initRotationEulerY >= 360) {
                    this._initRotationEulerY = 0;
                }
                newGo.transform.localRotationY = MathUtli.degreeToRadian(this._initRotationEulerY);
                this.addRotationScript(newGo);
                newGo.active = true;
                newGo.transform.position = new Laya.Vector3(x, y, z + 1);
            }
            else if (spwanItemData.goName == 'chonglangban') {
                let arrNum = [-2.8, 0, 2.8];
                let x = arrNum[index - 1];
                newGo.transform.position = new Laya.Vector3(x, 0, z + 1);
            }
            else if (spwanItemData.goName == "clbani_r" || spwanItemData.goName == "clbani_l") {
                let arrNum = [-3, 0, 3];
                let x = arrNum[index - 1];
                newGo.transform.position = new Laya.Vector3(x, 0, z + 1);
            }
            else if (spwanItemData.goName == 'xiahualangan') {
                let arrNum = [-3.2, 0, 3.2];
                let x = arrNum[index - 1];
                newGo.transform.position = new Laya.Vector3(x, 0, z + 1);
            }
            if (this._decorateObjName.indexOf(spwanItemData.goName) >= 0) {
                if (index == 1) {
                    newGo.transform.localScaleX = -1;
                }
                else {
                    newGo.transform.localScaleX = 1;
                }
                newGo.transform.position = new Laya.Vector3(0, 0, z + 2);
            }
        }
        addRotationScript(newgo) {
            if (!newgo.getComponent(Rotation)) {
                newgo.addComponent(Rotation);
            }
        }
        onSpawnGuide(newGo, spwanItemData, z, x) {
            newGo.transform.position = new Laya.Vector3(x, 0, z);
            let obstacle = this.itemMap.getValue(newGo.id);
            obstacle.collider.enabled = true;
        }
        SpawnObstacle2(newGo, z, x) {
            let rnd = Math.random();
            if (x < 0) {
                if (rnd >= 1 - 0.5)
                    x = 1.27;
                else
                    x = 0;
            }
            if (x == 0) {
                if (rnd >= 1 - 0.5)
                    x = -1.27;
                else
                    x = 1.27;
            }
            if (x > 0) {
                if (rnd >= 1 - 0.5)
                    x = -1.27;
                else
                    x = 0;
            }
            newGo.transform.position = new Laya.Vector3(x, 0, z);
            let obstacle = this.itemMap.getValue(newGo.id);
            obstacle.ani.play('idle', 0, 0);
            obstacle.collider.enabled = true;
        }
        CreateSpwanItem(spwanItemData) {
            let spwanitem = super.CreateSpwanItem(spwanItemData);
            if (this._decorateObjName.indexOf(spwanItemData.goName) >= 0)
                return spwanitem;
            let newgo = spwanitem.gob;
            let obstacle = new Obstacle();
            let ani = newgo.getChildAt(0).getComponent(Laya.Animator);
            obstacle.ani = ani;
            this.itemMap.setValue(newgo.id, obstacle);
            let collidergob = newgo;
            let boxCollider = this.addBoxCollider(spwanItemData.goName);
            obstacle.collider = boxCollider;
            collidergob.addComponentIntance(boxCollider);
            return spwanitem;
        }
        addBoxCollider(goName) {
            let boxCollider = new AABBShape();
            boxCollider.mask = CollisionMask.Obstacle;
            boxCollider.collisionMask = 0;
            if (goName == 'jinche') {
                boxCollider.center = new Laya.Vector3(0, 0, 0);
                boxCollider.size = new Laya.Vector3(3, 1, 3.2);
            }
            else if (goName == 'chonglangban') {
                boxCollider.center = new Laya.Vector3(0, 0.2, 0.25);
                boxCollider.size = new Laya.Vector3(2, 5, 0.5);
            }
            else if (goName == "clbani_r") {
                boxCollider.size = new Laya.Vector3(5, 1, 0.3);
                boxCollider.center = new Laya.Vector3(-1.5, -0.2, 0);
                boxCollider.tag = "clb";
            }
            else if (goName == "clbani_l") {
                boxCollider.tag = "clb";
                boxCollider.size = new Laya.Vector3(5, 1, 0.3);
                boxCollider.center = new Laya.Vector3(1.5, -0.2, 0);
            }
            else if (goName == 'xiahualangan') {
                boxCollider.center = new Laya.Vector3(0, 2.6, 0);
                boxCollider.size = new Laya.Vector3(2.5, 1, 0.5);
            }
            else if (goName == 'dabache') {
                boxCollider.mask = CollisionMask.Obstacle;
                boxCollider.collisionMask = 0;
                boxCollider.center = new Laya.Vector3(0, 0.6, -1.8);
                boxCollider.size = new Laya.Vector3(1.6, 0.6, 19);
            }
            else if (goName == 'dabacheding') {
                boxCollider.mask = CollisionMask.PaoDao;
                boxCollider.collisionMask = 0;
                boxCollider.center = new Laya.Vector3(0, 4.5, 0);
                boxCollider.size = new Laya.Vector3(1, 3, 16);
            }
            else if (goName == 'huapo') {
                boxCollider.mask = CollisionMask.HuaPo;
                boxCollider.collisionMask = 0;
                boxCollider.center = new Laya.Vector3(0, 1.5, -10.8);
                boxCollider.size = new Laya.Vector3(0.8, 3, 5.5);
            }
            else if (goName == "jinbi") {
                boxCollider.mask = CollisionMask.Gold;
                boxCollider.collisionMask = 0;
                boxCollider.center = new Laya.Vector3(0, 0.2, 0);
                boxCollider.size = new Laya.Vector3(1, 1, 0.3);
            }
            else if (goName == "jiasu") {
                boxCollider.mask = CollisionMask.JiaSu;
                boxCollider.collisionMask = 0;
                boxCollider.center = new Laya.Vector3(0, 1, 0);
                boxCollider.size = new Laya.Vector3(1, 1, 0.2);
            }
            return boxCollider;
        }
        CreateSpwanStar(spwanItemData) {
            let spwanitem = super.CreateSpwanItem(spwanItemData);
            let newgo = spwanitem.gob;
            let obstacle = new Obstacle();
            this.itemMap.setValue(newgo.id, obstacle);
            let boxCollider = new AABBShape();
            let collidergob = newgo;
            boxCollider.mask = CollisionMask.Award;
            boxCollider.collisionMask = 0;
            boxCollider.center = new Laya.Vector3(0.0, 0, 0.0);
            boxCollider.size = new Laya.Vector3(0.5, 0.5, 0.5);
            collidergob.addComponentIntance(boxCollider);
            obstacle.collider = boxCollider;
            return spwanitem;
        }
        recoverLessZ() {
            for (const spwanitem of this.runtimeItems) {
                if (spwanitem.gob.displayedInStage) {
                    let length = spwanitem.spwanItemData.length;
                    if (spwanitem.gob.transform.position.z + length * 0.5 < this.currentZ + this.spwanConfigObj.recoverOffset) {
                        spwanitem.gob.transform.localRotation = new Laya.Quaternion(0, 0, 0, 1);
                        spwanitem.gob.transform.localScaleX = 1;
                        if (spwanitem.gob.getComponent(Rotation) != null) {
                            spwanitem.gob.getComponent(Rotation).destroy();
                        }
                        Laya.Pool.recover(spwanitem.spwanItemData.goName, spwanitem);
                        spwanitem.gob.removeSelf();
                    }
                }
            }
        }
        recoverAll() {
            for (const spwanitem of this.runtimeItems) {
                if (true) {
                    {
                        Laya.Pool.recover(spwanitem.spwanItemData.goName, spwanitem);
                        let aabb = spwanitem.gob.getComponent(AABBShape);
                        if (aabb) {
                            aabb.destroy();
                        }
                        spwanitem.gob.removeSelf();
                    }
                }
            }
        }
    }

    class MonoBehaviour extends Laya.Script {
        onAwake() {
            this.gameObject = this.owner;
            this.transform = this.gameObject.transform;
        }
        Find(path) {
            return GameObject$1.Find(this.gameObject, path);
        }
        GetComponentsInChildren(componentType) {
            return GameObject$1.GetComponentsInChildrenU3d(this.gameObject, componentType);
        }
    }

    class Input extends Laya.Script {
        constructor() {
            super();
            this.count = 0;
            this.counttime = 0;
            this.preMouseX = 0;
            this.firstX = -12345678;
            this.seconx = 0;
            this.mouseDown_y = 0;
            this.mouseDown_y_Time = 0;
            this.slide_mouseDown_x = 0;
            this.sensitivity = 0.2;
        }
        onAwake() {
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.p_onMouseDown);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.p_onMouseUp);
            Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDownEvent);
            Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUpEvent);
            this.preMouseX = Laya.MouseManager.instance.mouseX;
        }
        onKeyDownEvent(e) {
            Input.dicKeyDown[e.keyCode] = true;
            Input.dicKeyUpdate[e.keyCode] = true;
        }
        onKeyUpEvent(e) {
            Input.dicKeyDown[e.keyCode] = false;
            Input.dicKeyUpdate[e.keyCode] = false;
        }
        p_onMouseDown() {
            Input.mouseButton0down = true;
            Input.mouseButton0Up = false;
            Input.mouseButton0DwonHold = true;
        }
        p_onMouseUp() {
            Input.mouseButton0Up = true;
            Input.mouseButton0down = false;
            Input.mouseButton0DwonHold = false;
        }
        onLateUpdate() {
            Input.mouseButton0down = false;
            Input.mouseButton0Up = false;
            Input.GetAxisRaw_Mouse_X = 0;
            Input.slideUp = false;
            Input.slidedown = false;
            Input.slideLeft = false;
            Input.slideRight = false;
            if (Laya.Browser.onPC) {
                for (let k in Input.dicKeyDown) {
                    Input.dicKeyDown[k] = false;
                }
                for (let k in Input.dicKeyUpdate) {
                    Input.dicKeyUpdate[k] = false;
                }
            }
        }
        onUpdate() {
            this.onUpdate_mouse();
        }
        static GetKeyDown(e) {
            if (Laya.Browser.onPC == false)
                return false;
            return Input.dicKeyDown[e];
        }
        static GetKey(e) {
            if (Laya.Browser.onPC == false)
                return false;
            if (Input.dicKeyUpdate[e] == null)
                return false;
            return Input.dicKeyUpdate[e];
        }
        onUpdate_mouse() {
            if (Input.mouseButton0DwonHold) {
                if (this.firstX == -12345678) {
                    this.firstX = Laya.stage.mouseX;
                }
                else {
                    this.seconx = Laya.stage.mouseX;
                    var movementX = this.seconx - this.firstX;
                    this.firstX = this.seconx;
                    Input.GetAxisRaw_Mouse_X = movementX;
                }
            }
            if (Input.mouseButton0Up) {
                Input.GetAxisRaw_Mouse_X = 0;
                this.firstX = -12345678;
                ;
                this.seconx = 0;
            }
            if (Input.mouseButton0down) {
                this.mouseDown_y = Laya.MouseManager.instance.mouseY;
                this.mouseDown_y_Time = Time.time;
                this.slide_mouseDown_x = Laya.MouseManager.instance.mouseX;
            }
            if (Input.mouseButton0Up) {
                let mouse_up_y = Laya.MouseManager.instance.mouseY;
                let mouse_up_x = Laya.MouseManager.instance.mouseX;
                let mouse_up_y_time = Time.time;
                let OpTime = mouse_up_y_time - this.mouseDown_y_Time < 0.3;
                let ydis = this.mouseDown_y - mouse_up_y;
                if (OpTime) {
                    if (ydis > 100 * this.sensitivity) {
                        Input.slideUp = true;
                        Input.slideYdis = ydis;
                    }
                    else if (ydis < -100 * this.sensitivity) {
                        Input.slidedown = true;
                        Input.slideYdis = ydis;
                    }
                    if (this.slide_mouseDown_x - mouse_up_x > 100 * this.sensitivity) {
                        Input.slideLeft = true;
                        Input.slideXdis = this.slide_mouseDown_x - mouse_up_x;
                    }
                    else if (mouse_up_x - this.slide_mouseDown_x > 100 * this.sensitivity) {
                        Input.slideRight = true;
                        Input.slideXdis = mouse_up_x - this.slide_mouseDown_x;
                    }
                }
            }
        }
    }
    Input.mouseButton0down = false;
    Input.mouseButton0Up = false;
    Input.mouseButton0DwonHold = false;
    Input.dicKeyDown = {};
    Input.dicKeyUpdate = {};
    Input.GetAxisRaw_Mouse_X = 0;
    Input.slideUp = false;
    Input.slidedown = false;
    Input.slideLeft = false;
    Input.slideRight = false;
    Input.slideXdis = 0;
    Input.slideYdis = 0;

    class Player extends MonoBehaviour {
        constructor() {
            super(...arguments);
            this.canJump = true;
            this.localx = 0;
            this.isdeath = false;
            this._endEffect = null;
            this._goldEffect = null;
            this._addSpeedEffect = null;
            this.guiderIdx = -1;
            this.jumpy = 0;
            this.readBigJump = 0;
            this.fasRunTime = 0;
            this.IsFastRun = false;
            this.IsWudi = false;
            this.curstarPower = 0;
            this.initOk = false;
            this.actionLeft = 2;
            this.actionRight = 3;
            this.actionUp = 0;
            this.actionDown = 1;
            this.actionSamllJump = 4;
            this.challengeEnd = false;
            this.fanzhuanyidong = false;
            this._moveX = 3.1;
            this.baseHitScore = 0;
            this._playerYState = -1;
            this._curSlope = null;
            this._cueCollisionTarget = null;
            this._endTimes = 0;
            this._jumpForward = false;
            this._frontZ = 0;
            this.rebornRead = false;
            this._lastAction = -1;
            this._isTranslation = false;
            this._jumpY = 0;
            this._initCameraY = 0;
            this.addpowerTime = 0;
            this.isbigJump = false;
            this.jumpTime = 0;
            this.issliderDwon = false;
            this._trail = null;
            this.cameraOrz = -6.13;
        }
        onAwake() {
            super.onAwake();
            this._gameModule = ModuleCenter.instance.gameModule;
            let aabbshape = new AABBShape();
            aabbshape.mask = CollisionMask.Character;
            aabbshape.collisionMask = 1 << CollisionMask.Obstacle | 1 << CollisionMask.Gold | 1 << CollisionMask.JiaSu
                | 1 << CollisionMask.PaoDao | 1 << CollisionMask.HuaPo | 1 << CollisionMask.End;
            aabbshape.size = new Laya.Vector3(1.5, 2.2, 1);
            aabbshape.center = new Laya.Vector3(0.0, 1.2, 0);
            this.aabbshape = this.gameObject.addComponentIntance(aabbshape);
            aabbshape.ActiveDetec();
            aabbshape.RegisetCollsionEnter(this, this.OnCollisionEnter);
            aabbshape.RegisetCollsionExit(this, this.OnCollisionExit);
            this.initCat();
            this._addSpeedEffect = this.gameObject.getChildByName("jiasu");
            this._addSpeedEffect.active = false;
            let shadow = this.gameObject.getChildByName("BlobShadow");
            shadow.transform.localPositionX = -0.1;
            let cameraAnimationGob = this.gameObject.parent.getChildByName('cameraAnimation');
            if (cameraAnimationGob != null) {
                this.cameraAnimator = cameraAnimationGob.getComponent(Laya.Animator);
                this.cameraAnimatorTrs = cameraAnimationGob.transform;
            }
            this.UIhitEffect = this.gameObject.getChildByName('UIhit');
            this._initCameraY = GameScript.instance.camera.transform.localPositionY;
            this._playerYState = 0;
        }
        OnCollisionEnter(source, target) {
            if (target.mask == CollisionMask.Gold) {
                target.gameObject.active = false;
                this._goldEffect.active = true;
                GameScript.instance.playerEatFish();
                Laya.timer.once(400, this, this.hideGoldEffect);
            }
            else if (target.mask == CollisionMask.HuaPo) {
                this._playerYState = 1;
                this._curSlope = target;
            }
            else if (target.mask == CollisionMask.PaoDao) {
                this._playerYState = 2;
                this._curSlope = target;
                this._playerYState = 2;
                this._frontZ = 0;
            }
            else if (target.mask == CollisionMask.End) {
                this._endTimes += 1;
                if (this._endTimes == 4) {
                    GlobalData.gameOver = true;
                    this.gameOver();
                    return;
                }
                this.IsFastRun = false;
                GameScript.instance.setLevelAddSpeed(false, true);
            }
            else if (target.mask == CollisionMask.JiaSu) {
                target.gameObject.active = false;
                this.IsFastRun = false;
                this.FastRun();
            }
            else if (target.mask == CollisionMask.Award) {
                this.UIhitEffect.active = false;
                this.UIhitEffect.active = true;
                SoundManager.instance.starAward.Play();
                target.owner.active = false;
            }
            else if (GlobalData.isGuide == false && (target.mask == CollisionMask.Obstacle || target.mask == CollisionMask.PaoDao)) {
                if (this.IsFastRun == false) {
                    if (this._curSlope)
                        return;
                    this._cueCollisionTarget = target.gameObject;
                    this.Fail();
                }
                let obstalcle = GameScript.instance.obstacleSpawn.itemMap.getValue(target.gameObject.id);
                if (target.tag == 'Rat') {
                    target.objdata.ani.play('Dead');
                    target.objdata.collider.enabled = false;
                }
                else if (target.tag == "clb") {
                }
                else {
                    if (obstalcle && obstalcle.ani) {
                        obstalcle.ani.play('Dead');
                        obstalcle.collider.enabled = false;
                    }
                }
            }
        }
        hideGoldEffect() {
            this._goldEffect.active = false;
        }
        OnCollisionExit(source, target) {
            if (target.mask == CollisionMask.PaoDao) {
                this._curSlope = target;
                this._playerYState = this.checkNearBus(target);
            }
            else if (target.mask == CollisionMask.HuaPo) {
            }
        }
        checkNearBus(target) {
            let map = GameScript.instance.obstacleSpawn.itemMap;
            if (this._lastAction == this.actionRight || this._lastAction == this.actionLeft) {
                let min = target.transform.localPositionZ - 8;
                let max = target.transform.localPositionZ + 16;
                for (let index = 0; index < map.keys.length; index++) {
                    const value = map.values[index];
                    if (value.collider.mask == CollisionMask.PaoDao) {
                        let z = value.collider.transform.localPositionZ;
                        let x = value.collider.transform.localPositionX;
                        if (z == target.transform.localPositionZ)
                            continue;
                        if (z >= min && z <= max) {
                            if (GameScript.instance.cureentZ > z - 8 && GameScript.instance.cureentZ < z + 8) {
                                if (x > target.transform.localPositionX) {
                                    if (this._lastAction == this.actionLeft) {
                                        return 2;
                                    }
                                    else {
                                        return 0;
                                    }
                                }
                                else if (x < target.transform.localPositionX) {
                                    if (this._lastAction == this.actionRight) {
                                        return 2;
                                    }
                                    else {
                                        return 0;
                                    }
                                }
                                else {
                                    return 2;
                                }
                            }
                        }
                    }
                }
                return 0;
            }
            else if (this._lastAction == this.actionUp) {
                let state = this.checkJumpBus(target, map);
                if (state == 0) {
                    this.fallDown();
                }
                else {
                    this._jumpForward = true;
                }
                return state;
            }
            else {
                this.fallDown();
                return 0;
            }
        }
        fallDown() {
            this.playCatAni("TCatFallDown", 1, 0, 0.2);
            Laya.timer.once(300, this, this.crossFadeRunAfterBigJump);
            this.moveCameraY(0);
        }
        checkJumpBus(target, map) {
            for (let index = 0; index < map.keys.length; index++) {
                const value = map.values[index];
                let max = target.transform.localPositionZ + 25;
                let min = target.transform.localPositionZ;
                let targetX = target.transform.localPositionX;
                if (value.collider.mask == CollisionMask.PaoDao) {
                    let z = value.collider.transform.localPositionZ;
                    let x = value.collider.transform.localPositionX;
                    if (targetX != x)
                        continue;
                    if (z > min && z < max) {
                        this._frontZ = z;
                        return 2;
                    }
                }
            }
            return 0;
        }
        Fail() {
            if (GlobalData.isGuide)
                return;
            if (this.IsWudi)
                return;
            if (this.isdeath)
                return;
            Platform.vibrateLong();
            GameScript.instance.speed = 0;
            this.playCatAni("TCatDeath", 1);
            SoundManager.instance.CatDeath.Play();
            GameScript.instance.jumpaddspeed = 0;
            GameScript.instance.addspeed = 0;
            GameScript.instance.setLevelAddSpeed(true);
            Laya.timer.once(1000, this, () => {
                ModuleCenter.instance.openOverView(true);
                ModuleCenter.instance.gameModule.hideView();
            });
            this._gameModule.hideFishAndScore();
            this.isdeath = true;
        }
        gameOver() {
            if (GlobalData.isGuide)
                return;
            if (this.IsWudi)
                return;
            if (this.isdeath)
                return;
            Platform.vibrateLong();
            GameScript.instance.speed = 0;
            GameScript.instance.jumpaddspeed = 0;
            GameScript.instance.addspeed = 0;
            GameScript.instance.setLevelAddSpeed(true);
            Laya.timer.once(500, this, () => {
                ModuleCenter.instance.openOverView(true);
                ModuleCenter.instance.gameModule.hideView();
            });
            this._gameModule.hideFishAndScore();
        }
        Reborn() {
            this.rebornRead = true;
            this.isdeath = false;
            this.isbigJump = false;
            this._curSlope = null;
            this.animator.speed = this.getCatRunSpeed();
            this.animator.crossFade('TCatRun', 0.1);
            this.aabbshape.center.y = 1.2;
            this._jumpY = 0;
            let min = this._cueCollisionTarget.transform.localPositionZ - 10;
            let max = this._cueCollisionTarget.transform.localPositionZ + 10;
            this._gameModule.reborn();
            this.transform.localPositionY = 0;
            ModuleCenter.instance.gameModule.showView();
            this.clearNearObject(min, max);
        }
        clearNearObject(min, max) {
            let map = GameScript.instance.obstacleSpawn.itemMap;
            map.forEach((key, value) => {
                let z = value.collider.transform.localPositionZ;
                if (z >= min && z <= max) {
                    value.collider.gameObject.active = false;
                }
            });
        }
        onUpdate() {
            if (this.isdeath || GameScript.instance.isPlay == false || this.rebornRead ||
                this.challengeEnd)
                return;
            this.run();
            let action = this.getAction();
            this.runAction(action);
            this.getChangeLocalY(action);
            if (action != -1 && this._playerYState == 2) {
                this._lastAction = action;
                if (action == this.actionLeft || action == this.actionRight) {
                    if (this._frontZ) {
                        this._playerYState = 0;
                    }
                }
            }
            if (this._isTranslation) {
                this.transform.localPositionX = Mathf.Lerp(this.transform.localPositionX, this.localx, 0.2);
                this.isbigJump = false;
                this.transform.localPositionY = Mathf.Lerp(this.transform.localPositionY, 0, 0.2);
                if (Math.abs(this.localx) - Math.abs(this.transform.localPositionX) < 0.1) {
                    this._isTranslation = false;
                    this._jumpY = 0;
                }
            }
            else {
                this.transform.localPositionX = Mathf.Lerp(this.transform.localPositionX, this.localx, 0.2);
            }
            this.moveCameraX();
        }
        getChangeLocalY(action) {
            let slopeHight = 0;
            if (this._playerYState == 0) {
                slopeHight = 0;
                this._curSlope = null;
                this.transform.localPositionY = this._jumpY;
                this.moveCameraY(0);
            }
            else if (this._playerYState == 1) {
                if (!this._curSlope)
                    return 0;
                let offZ = Math.abs(GameScript.instance.cureentZ - 3.5 - (this._curSlope.transform.localPositionZ - 13.5));
                if (offZ <= 5) {
                    slopeHight = Math.abs((offZ * Math.tan(MathUtli.degreeToRadian(30))));
                }
                else {
                    slopeHight = 3.15;
                }
                this.transform.localPositionY = this._jumpY + slopeHight;
                this.moveCameraY(slopeHight);
            }
            else if (this._playerYState == 2) {
                slopeHight = 3.15;
                this.transform.localPositionY = this._jumpY + slopeHight;
            }
            return slopeHight;
        }
        run() {
            if (this.isbigJump) {
                let t = (Time.time - this.jumpTime) / 0.8;
                if (t >= 1) {
                    t = 1;
                    GameScript.instance.jumpaddspeed = 0;
                    this.isbigJump = false;
                    this._jumpY = 0;
                    this.transform.localPositionY = 0;
                    return;
                }
                let y = Math.sin(t * Math.PI) * 0.8;
                if (y <= 0)
                    y = 0;
                GameScript.instance.jumpaddspeed = y * 0.3;
                this._jumpY = y;
            }
            else {
                GameScript.instance.jumpaddspeed = 0;
            }
            if (this.IsFastRun) {
                let t = (Time.time - this.fasRunTime) / 4;
                if (t >= 1) {
                    t = 1;
                }
                let t1 = Math.sin(t * 3.14);
                GameScript.instance.addspeed = t1 * 0.5;
                let tca = t1;
                t1 = t1 * 3;
                if (t1 >= 1)
                    t1 = 1;
            }
        }
        runAction(action) {
            if (action == this.actionDown) {
                this.sliderDwon();
            }
            else if (action == this.actionUp) {
                this.BigJump();
            }
            else if (action == this.actionLeft) {
                this.turnLeftOrRight(action);
            }
            else if (action == this.actionRight) {
                this.turnLeftOrRight(action);
            }
        }
        getAction() {
            if ((Input.slideLeft || Input.slideRight) && (Input.slideUp || Input.slidedown)) {
                if (Math.abs(Input.slideXdis) >= Math.abs(Input.slideYdis)) {
                    Input.slideUp = false;
                    Input.slidedown = false;
                }
                else {
                    Input.slideLeft = false;
                    Input.slideRight = false;
                }
            }
            let action = -1;
            if (GlobalData.isGuide) {
                action = this.GuiDeUpdate();
                if (GameScript.instance.cureentZ >= 40)
                    GameScript.instance.GuideOk();
            }
            else {
                action = this.GetPlayerAciont();
                if (Input.GetKeyDown(Laya.Keyboard.LEFT))
                    action = this.actionLeft;
                if (Input.GetKeyDown(Laya.Keyboard.RIGHT))
                    action = this.actionRight;
                if (this.canJump == false && (action == this.actionSamllJump || action == this.actionUp)) {
                    action = -1;
                }
                if (this.fanzhuanyidong && action == this.actionRight) {
                    action = this.actionLeft;
                }
                else if (this.fanzhuanyidong && action == this.actionLeft) {
                    action = this.actionRight;
                }
            }
            return action;
        }
        turnLeftOrRight(action) {
            let aniName = "";
            if (action == this.actionLeft) {
                this.localx += this._moveX;
                aniName = "TCatLeft";
                if (this.localx > this._moveX) {
                    aniName = "";
                }
                if (this.localx >= this._moveX) {
                    this.localx = this._moveX;
                }
            }
            else if (action == this.actionRight) {
                this.localx -= this._moveX;
                aniName = "TCatRight";
                if (this.localx < -this._moveX) {
                    aniName = "";
                }
                if (this.localx <= -this._moveX) {
                    this.localx = -this._moveX;
                }
            }
            if (this._playerYState == 1) {
                Laya.timer.once(100, this, () => {
                    this._playerYState = 0;
                });
            }
            this._trail.active = true;
            Laya.timer.once(100, this, () => {
                this._trail.active = false;
            });
            if (this._jumpY > 0) {
                this._isTranslation = true;
            }
            this.moveRightOrLeft(aniName);
        }
        moveRightOrLeft(ani) {
            if (ani == "")
                return;
            this.playCatAni(ani, 1, 0, 0.1);
            Laya.timer.once(100, this, this.crossFadeRun);
        }
        moveCameraX() {
            let camera = GameScript.instance.camera;
            let initX = camera.transform.position.x;
            camera.transform.localPositionX = Mathf.Lerp(initX, this.localx, 0.2);
        }
        moveCameraY(offY) {
            let camera = GameScript.instance.camera;
            let curY = camera.transform.localPositionY;
            let toY = 0;
            if (offY != 0) {
                toY = this._initCameraY + offY;
                camera.transform.localPositionY = Mathf.Lerp(curY, toY, 0.2);
            }
            else {
                camera.transform.localPositionY = this._initCameraY;
            }
        }
        FastRunOver() {
        }
        GetPlayerAciont() {
            if (Input.mouseButton0Up &&
                !Input.slideLeft && !Input.slideRight && !Input.slidedown && !Input.slideUp) {
                return this.actionSamllJump;
            }
            else if (Input.slidedown && this.isbigJump == false) {
                return this.actionDown;
            }
            if (Input.slideLeft) {
                return this.actionLeft;
            }
            else if (Input.slideRight) {
                return this.actionRight;
            }
            if (Input.slideUp) {
                return this.actionUp;
            }
            return -1;
        }
        BigJump() {
            if (this.isbigJump)
                return;
            SoundManager.instance.CatJump.Play();
            this.playCatAni("TCatUp", 1, 0, 0);
            Laya.timer.once(800, this, this.crossFadeRunAfterBigJump);
            Laya.timer.once(800, this, this.RestAnimatiorSpeed);
            this.isbigJump = true;
            this.jumpTime = Time.time;
        }
        RestAnimatiorSpeed() {
            this.animator.speed = this.getCatRunSpeed();
        }
        sliderDwon() {
            if (this.issliderDwon)
                return;
            this.issliderDwon = true;
            this.aabbshape.center.y = 0;
            this.playCatAni("TCatSlide", 1, 0, 0.15);
            Laya.timer.once(1000, this, this.crossFadeRun);
            Laya.timer.once(1000, this, () => {
                this.issliderDwon = false;
                GameScript.instance.jumpaddspeed = 0;
            });
        }
        GuiDeUpdate() {
            let aciont = this.GetPlayerAciont();
            if (this.guiderIdx == 0 && aciont == this.actionUp) {
                this.animator.speed = 1;
                GameScript.instance.NextGuide();
                this.guiderIdx = -1;
                return aciont;
            }
            if (this.guiderIdx == 1 && aciont == this.actionDown) {
                this.animator.speed = 1;
                GameScript.instance.NextGuide();
                this.guiderIdx = -1;
                return aciont;
            }
            if (this.guiderIdx == 2 && aciont == this.actionRight) {
                this.animator.speed = 1;
                GameScript.instance.NextGuide();
                this.guiderIdx = -1;
                return aciont;
            }
            if (this.guiderIdx == 3 && aciont == this.actionLeft) {
                this.animator.speed = 1;
                this.guiderIdx = -1;
                GameScript.instance.NextGuide();
                return aciont;
            }
            return -1;
        }
        crossFadeRun() {
            if (this.isdeath)
                return;
            if (this.challengeEnd)
                return;
            this.isbigJump = false;
            this.aabbshape.center.y = 1.2;
            this.animator.speed = this.getCatRunSpeed();
            this.animator.crossFade('TCatRun', 0.2);
        }
        crossFadeRunAfterBigJump() {
            if (this.isdeath)
                return;
            if (this.challengeEnd)
                return;
            this.aabbshape.center.y = 1.2;
            this.animator.speed = this.getCatRunSpeed();
            this.animator.crossFade('TCatRun', 0.2);
        }
        initCat() {
            if (this.cat == null) {
                let TCat = GameObject$1.Find(GameScript.instance.scene, "Resources/TCat");
                this.cat = Laya.Sprite3D.instantiate(TCat);
                this._trail = this.cat.getChildByName("trail");
                this._goldEffect = this.cat.getChildByName("jinbi");
                this._goldEffect.active = false;
                this.gameObject.addChild(this.cat);
                this.cat.active = false;
                this.animator = this.cat.getChildByName("TCat").getComponent(Laya.Animator);
                this.playCatAni('TCatRun', 2);
                this.curAvater = this.cat;
                this.cat.transform.localPosition = new Laya.Vector3(0, 0, 0);
            }
        }
        playCatAni(action, speed = 1, layerIndex, normalizedTime) {
            this.animator.speed = speed;
            this.animator.play(action, layerIndex, normalizedTime);
        }
        StartRun() {
            this.cat.active = true;
            this.curAvater.transform.localRotationEulerY = 0;
            this.playCatAni('TCatStart', 1);
            Laya.timer.frameOnce(90 * 2, this, this.crossFadeRun);
        }
        FastRun() {
            this.IsFastRun = true;
            this._addSpeedEffect.active = true;
            this.fasRunTime = Time.time;
            this.curstarPower = 0;
            this.playCatAni("TCatFastRun", 1);
            Laya.timer.once(4000, this, () => {
                this._addSpeedEffect.active = false;
                this.IsFastRun = false;
                GameScript.instance.addspeed = 0;
                this.animator.speed = this.getCatRunSpeed();
                this.animator.crossFade('TCatRun', 0.1);
            });
            SoundManager.instance.wineffect.PlayByNum(1);
            Laya.timer.once(3000, this, () => {
                GameScript.instance.useSpwanobstacle = false;
            });
            Laya.timer.once(3000, this, () => {
                GameScript.instance.useSpwanobstacle = true;
            });
        }
        onDestroy() {
            if (this.cat) {
                this.gameObject.removeChild(this.cat);
            }
            if (this.aabbshape) {
                this.aabbshape.destroy();
                this.aabbshape = null;
            }
            EventManager.instance.offAllCaller(this);
        }
        FaceToCamera(b) {
        }
        StartGuider(idx) {
            this.animator.speed = 0;
            this.guiderIdx = idx;
        }
        getCatRunSpeed() {
            let level = GameScript.instance.getLevel();
            return GlobalData.catRunSpeeds[level] + 1;
        }
        onEnable() {
            Laya.timer.frameOnce(2, this, () => {
                EventManager.instance.event(EventType.CharaterIniOk);
                this.UIhitEffect.active = false;
            });
        }
    }

    class VertexColor extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("VertexColor");
            this._shaderValues.addDefine(VertexColor.SHADERDEFINE_ENABLEVERTEXCOLOR);
        }
        static initShader() {
            if (VertexColor.hasInt)
                return;
            VertexColor.hasInt = true;
            VertexColor.SHADERDEFINE_ENABLEVERTEXCOLOR = Laya.Shader3D.getDefineByName("ENABLEVERTEXCOLOR");
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Color': Laya.VertexMesh.MESH_COLOR0
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE
            };
            let VS = `
            attribute vec4 a_Position;
            uniform mat4 u_MvpMatrix;
            
            #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
                attribute vec4 a_Color;
                varying vec4 v_Color;
            #endif

            void main()
            {
                #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
                v_Color = a_Color;
                #endif
                gl_Position = u_MvpMatrix * a_Position;
            } `;
            let FS = `
        //不能少写这行
        #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
        
        #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
        varying vec4 v_Color;
        #endif
       
        void main()
        {
        
           #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
              gl_FragColor=v_Color;
            #else
              gl_FragColor=vec4(1.0);
            #endif
          
        }
        `;
            var LightSh = Laya.Shader3D.add("VertexColor");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            LightSh.addSubShader(subShader);
            subShader.addShaderPass(VS, FS);
        }
    }
    VertexColor.hasInt = false;

    class GameScript extends Laya.Script {
        constructor() {
            super(...arguments);
            this.cureentZ = 0;
            this.speed = 0.12;
            this.baseSpeed = 0.12;
            this.addspeed = 0;
            this.jumpaddspeed = 0;
            this._levelAddSpeed = 0;
            this.spwans = [];
            this.isPlay = false;
            this.guiderz = [];
            this.guiderzIdx = 0;
            this.waitGuide = true;
            this.useSpwanobstacle = true;
            this.initOk = false;
            this.fastRunScore = 0;
            this.challengIdx = -1;
            this.canJump = false;
            this._gameModule = null;
            this._aniArray = null;
            this._levelEndPos = [520, 1240, 2360, 4080];
            this._endLevelObjectArray = null;
            this._levelSpeed = [0.02, 0.05, 0.08, 0.15, 0.48];
            this._level = 0;
            this.isfadeToIdel = false;
            this.challengeOk = false;
            this.guideAcionOk = false;
        }
        onAwake() {
            GameScript.instance = this;
            this.scene = this.owner;
            this._gameModule = ModuleCenter.instance.gameModule;
            this.scene.addComponent(CollsionManagerThreeD);
            this._aniArray = [];
            this.initSound();
            this.initSkyBox();
            this.addLevelEnd();
            this.camera = GameObject$1.Find(this.scene, 'PlayerPivot/Main Camera');
            this.camera.transform.localPositionX = 0;
            this.addPlayer();
        }
        get aniArray() {
            return this._aniArray;
        }
        initOffsetEnd() {
            let tempData = Laya.loader.getRes("config/model_" + 12 + ".json");
            let data = tempData["ed"]["model_" + 12 + "Table"];
            let arr = this.organizeData(data);
            return arr.length * 2;
        }
        organizeData(data) {
            let arr = [];
            for (const key in data) {
                let element = data[key];
                arr.push(element);
            }
            return arr;
        }
        initSound() {
            if (Platform.supportSubPackage() && GameScript.subSoundIsOk == false)
                Platform.loadSubpackage_Single('SoundGame', this, this.onSubpackgeLoadOk);
            if (Platform.supportSubPackage() == false)
                GameScript.subSoundIsOk = true;
        }
        initSkyBox() {
            let sky = GameObject$1.Find(this.scene, 'PlayerPivot/Sky');
            VertexColor.initShader();
            sky.meshRenderer.material = new VertexColor();
        }
        addLevelEnd() {
            if (this._endLevelObjectArray == null) {
                this._endLevelObjectArray = [];
            }
            let endResource = GameObject$1.Find(this.scene, "Resources/end");
            for (let i = 0; i < this._levelEndPos.length; i++) {
                let end = Laya.Sprite3D.instantiate(endResource);
                let z = this._levelEndPos[i] - 120 * 0.2 + (GlobalData.isGuide ? 40 : 0);
                end.active = true;
                end = this.addLevelEndCollsion(end);
                end.transform.position = new Laya.Vector3(0, 0, z);
                this.scene.addChild(end);
                this._endLevelObjectArray.push(end);
            }
        }
        addLevelEndCollsion(gameObject) {
            let boxCollider = new AABBShape();
            boxCollider.mask = CollisionMask.End;
            boxCollider.collisionMask = 0;
            boxCollider.size = new Laya.Vector3(12, 5, 0.5);
            boxCollider.center = new Laya.Vector3(0, 3, 0);
            gameObject.addComponentIntance(boxCollider);
            return gameObject;
        }
        removeLevelEnd() {
            for (let i = 0; i < this._endLevelObjectArray.length; i++) {
                let element = this._endLevelObjectArray[i];
                element.removeSelf();
                element.destroy();
            }
            this._endLevelObjectArray = null;
        }
        onSubpackgeLoadOk(isok) {
            GameScript.subSoundIsOk = true;
            if (isok && this.isPlay)
                SoundManager.instance.PlayGameBgm();
        }
        onStart() {
            this.addBuild();
            this.addHouse();
            this.addObstacle();
            this.initOk = true;
        }
        addBuild() {
            let bulidjsonStr = '{"findRoot":"Resources/BuildItem","spwanItemDatas":[{"goName":"IndustrialWarehouse01","length":20},{"goName":"IndustrialWarehouse03","length":20}],"startCreateZ":0.0,"CreateLength":100.0,"recoverOffset":-15.0}';
            let buildSpwan = new BuildSpawn();
            buildSpwan.spwanConfigObj = JSON.parse(bulidjsonStr);
            buildSpwan.scene = this.scene;
            this.scene.addComponentIntance(buildSpwan);
            this.spwans.push(buildSpwan);
        }
        initFinishFlag() {
            this.qizi = GameObject$1.Find(GameScript.instance.scene, 'beibaiqi');
            this.qizi.active = false;
        }
        addSpwanFish() {
            if (GameDesgin.spwanFish) {
                let fishjsonStr = '{"findRoot":"Resources/items","spwanItemDatas":[{"goName":"Fish","length":1.0}],"startCreateZ":30.0,"CreateLength":100.0,"recoverOffset":-5.0}';
                let fishSpwan = new FishSpwan();
                fishSpwan.spwanConfigObj = JSON.parse(fishjsonStr);
                fishSpwan.scene = this.scene;
                this.scene.addComponentIntance(fishSpwan);
                this.spwans.push(fishSpwan);
            }
        }
        addObstacle() {
            if (GameDesgin.spwanObstacle) {
                let obstaclejsonStr = '{"findRoot":"Resources/items","spwanItemDatas":[' +
                    '{"goName":"jiasu","length":2},' +
                    '{"goName":"jinbi","length":2},' +
                    '{"goName":"jinche","length":4},' +
                    '{"goName":"chonglangban","length":2},' +
                    '{"goName":"xiahualangan","length":2},' +
                    '{"goName":"shangche","length":4},' +
                    '{"goName":"dabache","length":18},' +
                    '{"goName":"dabacheding","length":18},' +
                    '{"goName":"huapo","length":6},' +
                    '{"goName":"guanggaopai","length":4},' +
                    '{"goName":"jiazi","length":3},' +
                    '{"goName":"ludeng","length":4},' +
                    '{"goName":"xiaofangshuan","length":1},' +
                    '{"goName":"lajitong","length":1.5},' +
                    '{"goName":"clbani_r","length":2},' +
                    '{"goName":"clbani_l","length":2}' +
                    '],"startCreateZ":0.0,"CreateLength":100.0,"recoverOffset":-10.0}';
                let p_ObstacleSpawn = new ObstacleSpawn();
                p_ObstacleSpawn.spwanConfigObj = JSON.parse(obstaclejsonStr);
                p_ObstacleSpawn.scene = this.scene;
                this.scene.addComponentIntance(p_ObstacleSpawn);
                this.spwans.push(p_ObstacleSpawn);
                this.obstacleSpawn = p_ObstacleSpawn;
            }
        }
        addHouse() {
            let obstaclejsonStr = '{"findRoot":"Resources/house","spwanItemDatas":' +
                '[{"goName":"fangzi1","length":16},' +
                '{"goName":"fangzi2","length":17},' +
                '{"goName":"fangzi3","length":18},' +
                '{"goName":"fangzi4","length":10}, ' +
                '{"goName":"fangzi5","length":10},' +
                '{"goName":"fangzi6","length":12}],' +
                '"startCreateZ":0.0,"CreateLength":100.0,"recoverOffset":-5.0}';
            let p_ObstacleSpawn = new HouseSpawn(1);
            p_ObstacleSpawn.spwanConfigObj = JSON.parse(obstaclejsonStr);
            p_ObstacleSpawn.scene = this.scene;
            this.scene.addComponentIntance(p_ObstacleSpawn);
            this.spwans.push(p_ObstacleSpawn);
            let p_ObstacleSpawn_right = new HouseSpawn(-1);
            p_ObstacleSpawn_right.spwanConfigObj = JSON.parse(obstaclejsonStr);
            p_ObstacleSpawn_right.scene = this.scene;
            this.scene.addComponentIntance(p_ObstacleSpawn_right);
            this.spwans.push(p_ObstacleSpawn_right);
        }
        addPlayer() {
            this.playerPivot = this.scene.getChildByName('PlayerPivot');
            let charater = GameObject$1.Find(this.scene, 'PlayerPivot/charater');
            this.playerPivot.transform.position = new Laya.Vector3(0, 0, 0);
            charater.transform.position = new Laya.Vector3(0, 0, -3.5);
            this.player = charater.addComponent(Player);
            this._test = charater;
        }
        startGmae() {
            if (this.player.rebornRead) {
                this.player.StartRun();
                Laya.timer.frameOnce(90 * 2 + 20, this, () => {
                    this.isPlay = true;
                    this.speed = this.baseSpeed;
                    GameScript.instance.setLevelAddSpeed(false, false);
                    this.player.rebornRead = false;
                });
                if (GameScript.subSoundIsOk)
                    SoundManager.instance.PlayGameBgm();
                return;
            }
            this.player.StartRun();
            Laya.timer.frameOnce(90 * 2 + 20, this, () => {
                this.isPlay = true;
                GameScript.instance.setLevelAddSpeed(false, false);
            });
            if (GameScript.subSoundIsOk)
                SoundManager.instance.PlayGameBgm();
        }
        setLevelAddSpeed(reset, levelUp = false) {
            if (reset) {
                this._levelAddSpeed = 0;
            }
            else {
                if (levelUp) {
                    this._level += 1;
                }
                this._levelAddSpeed = this._levelSpeed[this._level];
            }
        }
        getLevel() {
            return this._level;
        }
        onUpdate() {
            if (this.isPlay) {
                if (this.speed <= 0)
                    this.speed = 0;
                let combineSpeed = (this.speed + this.addspeed + this.jumpaddspeed + this._levelAddSpeed) * Time.deltaTime * 50;
                this.cureentZ += combineSpeed;
                if (GlobalData.isGuide && this.challengIdx == -1 && this.guideAcionOk == false && this.cureentZ >= this.guiderz[this.guiderzIdx]) {
                    this.cureentZ = this.guiderz[this.guiderzIdx];
                    if (this.waitGuide) {
                        this.player.StartGuider(this.guiderzIdx);
                        if (this.guiderzIdx == 1) {
                            this._gameModule.DoShowGuideFinger(1);
                        }
                        else if (this.guiderzIdx == 0) {
                            this._gameModule.DoShowGuideFinger(0);
                        }
                    }
                    this.waitGuide = false;
                }
            }
            for (let index = 0; index < this.spwans.length; index++) {
                this.spwans[index].currentZ = this.cureentZ;
            }
            if (this.aniArray.length == 0)
                return;
            for (let i = 0; i < this.aniArray.length; i++) {
                let element = this.aniArray[i];
                let z1 = element.transform.localPositionZ;
                let z2 = this.cureentZ;
                let distence = z1 - z2;
                if (distence < 7.5) {
                    let ani = element.getChildAt(0).getComponent(Laya.Animator);
                    ani.play("ani");
                    this.aniArray.splice(i, 1);
                    return;
                }
            }
        }
        onLateUpdate() {
            let pos = this.playerPivot.transform.position;
            pos.z = this.cureentZ;
            this.playerPivot.transform.position = pos;
        }
        playerEatFish() {
            this._gameModule.model.fishCount += 1;
            SoundManager.instance.FishCollection.Play();
        }
        NextGuide() {
            this.guiderzIdx += 1;
            this.waitGuide = true;
            this._gameModule.ClearFinger();
        }
        WaitGuiEnd() {
            this.guideAcionOk = true;
            this._gameModule.ClearFinger();
        }
        GuideOk() {
            GlobalData.isGuide = false;
            this._gameModule.model.guideOK();
            this._gameModule.ClearFinger();
        }
        onDestroy() {
            GameScript.instance = null;
            this.removeLevelEnd();
            this.player.destroy();
            this.player = null;
            this.destoryAABB();
        }
        destoryAABB() {
            for (let i = 0; i < this.spwans.length; i++) {
                let element = this.spwans[i];
                element.recoverAll();
                element.destroy();
                element = null;
            }
        }
    }
    GameScript.subSoundIsOk = false;

    class BaseModel extends Laya.EventDispatcher {
        constructor() {
            super();
        }
        regist() {
        }
        destory() {
        }
    }

    class GameModel extends BaseModel {
        constructor() {
            super();
            this._score = 0;
            this._fishCount = 0;
            this._startTime = "";
            this._endTime = "";
            this._collectionShopDataArray = null;
            this._usedCollectionShopArray = null;
            this._tipMessage = "";
        }
        regist() {
            super.regist();
            this._collectionShopDataArray = [];
            this._usedCollectionShopArray = [];
            window.platform.doInitActivity().then((res) => {
                if (res.success == true) {
                    GlobalData.isGuide = res.isGuide;
                    this._tipMessage = res.message;
                    this._startTime = res.startTime;
                    this._endTime = res.endTime;
                    for (let index = 0; index < res.collectionCommoditys.length; index++) {
                        let obj = {};
                        let element = res.collectionCommoditys[index];
                        obj.imgUrl = element.imgUrl;
                        obj.price = element.price;
                        obj.commodityId = element.commodityId;
                        obj.title = element.title;
                        this._collectionShopDataArray.push(obj);
                    }
                    console.log("初始化成功");
                }
            }, (err) => {
                console.log(err);
                Log.log("初始化数据失败");
            });
        }
        get startTime() {
            return this._startTime;
        }
        get endTime() {
            return this._endTime;
        }
        get score() {
            return this._score;
        }
        set score(value) {
            if (value != this._score) {
                this._score = value;
                this.event(DataChangeEvent.SCORE_CHANGE, this._score);
            }
        }
        get fishCount() {
            return this._fishCount;
        }
        set fishCount(value) {
            if (value != this._fishCount) {
                this._fishCount = value;
                this.event(DataChangeEvent.FISH_COUNT_CHANGE, this._fishCount);
            }
        }
        get collectionShopDataArray() {
            return this._collectionShopDataArray;
        }
        getCollectionShopData() {
            if (this._collectionShopDataArray != null && this._collectionShopDataArray.length > 0) {
                let collection = this._collectionShopDataArray.pop();
                return collection;
            }
            else {
                return null;
            }
        }
        resetCollectionShopData(collectionCommoditys) {
            this._collectionShopDataArray = [];
            for (let index = 0; index < collectionCommoditys.length; index++) {
                let obj = {};
                let element = collectionCommoditys[index];
                obj.imgUrl = element.imgUrl;
                obj.price = element.price;
                obj.commodityId = element.commodityId;
                obj.title = element.title;
                this._collectionShopDataArray.push(obj);
            }
        }
        setUsedCollectionShopArray(commodityId) {
            this._usedCollectionShopArray.push(commodityId);
        }
        getCollectTimes() {
            return this._usedCollectionShopArray.length;
        }
        isOver() {
            let isOver = this._usedCollectionShopArray.length >= 3 ? true : false;
            console.log("isOver", isOver);
            return isOver;
        }
        getUsedCollectionShops() {
            return this._usedCollectionShopArray;
        }
        guideOK() {
            PlayerPrefs.SetInt('Guidev2', 1);
        }
    }

    class UIEvent {
    }
    UIEvent.OPEN = "Open";
    UIEvent.CLOSE = "Close";

    class UIManager {
        constructor() {
            this._uiDic = null;
            this.init();
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new UIManager();
            }
            return this._instance;
        }
        init() {
            this._uiDic = new Dictionary();
        }
        destory() {
            if (this._uiDic != null) {
                for (var index = 0; index < this._uiDic.values.length; index++) {
                    var element = this._uiDic.values[index];
                    if (element != null) {
                        element.destroy();
                    }
                }
            }
        }
        open(view) {
            let isExist = this._uiDic.indexOf(view.name) > -1 ? true : false;
            if (isExist) {
                Log.log("UI已打开：" + view.name);
            }
            else {
                this._uiDic.setValue(view.name, view);
            }
        }
        close(view) {
            let isExist = this._uiDic.indexOf(view.name) > -1 ? true : false;
            if (isExist) {
                this._uiDic.remove(view.name);
            }
            else {
                Log.log("UI不存在：" + view.name);
            }
        }
        closeAll() {
            for (var index = 0; index < this._uiDic.values.length; index++) {
                var element = this._uiDic.values[index];
                element.close();
                this._uiDic.remove(element.name);
            }
        }
    }
    UIManager._instance = null;

    class BaseView extends Laya.Scene {
        constructor() {
            super(false);
            this._urlArray = null;
            this._atlasUrl = "";
            this._isLoading = false;
            this._isLoaded = false;
            this._parentLayer = null;
            this._isAnimation = true;
            this._loadCompleteCallBack = null;
            this.init();
        }
        init() {
            this.setBindUrl();
            this._urlArray = [
                { url: this._atlasUrl, type: Laya.Loader.ATLAS },
                { url: this.url, type: Laya.Loader.JSON }
            ];
            this.setParentLayer();
        }
        setBindUrl() {
        }
        setParentLayer() {
            this._parentLayer = LayerManager.instance.getLayer(UILayer);
        }
        set isAnimation(val) {
            this._isAnimation = val;
        }
        openView(open) {
            if (this._isLoading) {
                return;
            }
            this._loadCompleteCallBack = open;
            if (this._isLoaded) {
                this.doOpen();
            }
            else {
                this.doLoad();
            }
        }
        doLoad() {
            Laya.loader.load(this._urlArray, Laya.Handler.create(this, this.onLoadComplete));
            this._isLoading = true;
        }
        onLoadComplete() {
            this._isLoading = false;
            this._isLoaded = true;
            this.doOpen();
        }
        doOpen() {
            this.createChildren();
            this.open();
        }
        createChildren() {
            super.createChildren();
            this.createView(Laya.loader.getRes(this.url));
            this.initChildren();
        }
        initChildren() {
        }
        open(closeOther, param) {
            if (closeOther)
                UIManager.instance.closeAll();
            if (this._parentLayer == null) {
                throw "this._parent未赋值，请使用openView函数";
            }
            this.initAnchor();
            this.initScaleAndAlpha();
            this._parentLayer.addChild(this);
            this.onOpened(param);
            if (this._isAnimation) {
                this.openAnimation();
            }
            else {
                UIManager.instance.open(this);
            }
            this._loadCompleteCallBack();
        }
        initAnchor() {
            if (this.width && this.height) {
                this.width = Laya.stage.width;
                this.height = Laya.stage.height;
                this.pivot(Laya.stage.width / 2, Laya.stage.height / 2);
                this.x = Laya.stage.width / 2;
                this.y = Laya.stage.height / 2;
            }
        }
        initScaleAndAlpha() {
            this.scale(0, 0);
            this.alpha = 0;
        }
        openAnimation() {
            Laya.Tween.to(this, {
                scaleX: 1, scaleY: 1, alpha: 1
            }, 400, Laya.Ease.backOut, Laya.Handler.create(this, this.onOpenAniComplete));
        }
        onOpenAniComplete() {
            UIManager.instance.open(this);
        }
        closeAnimation() {
            Laya.Tween.to(this, {
                scaleX: 0, scaleY: 0, alpha: 0
            }, 400, Laya.Ease.backIn, Laya.Handler.create(this, this.onCloseAniComplete));
        }
        hideWindow(destroy, destroyChild) {
            this.removeSelf();
            UIManager.instance.close(this);
            this.event(UIEvent.CLOSE);
            if (destroy) {
                this.destroy(destroyChild);
            }
        }
        onCloseAniComplete() {
            this.hideWindow();
        }
        cancelLoad() {
            if (this._urlArray != null) {
                Laya.loader.cancelLoadByUrls(this._urlArray);
            }
        }
        closeView(destroyChild) {
            if (this._isLoading) {
                this.cancelLoad();
                return;
            }
            if (this._isAnimation) {
                this.closeAnimation();
            }
            else {
                this.hideWindow(destroyChild);
            }
        }
        destroy(destroyChild) {
            this._isAnimation = false;
            this._isLoading = false;
            this._isLoaded = false;
            Laya.Tween.clearTween(this);
            this.cancelLoad();
            super.destroy(destroyChild);
        }
    }

    class GameView extends BaseView {
        constructor() {
            super();
        }
        setBindUrl() {
            this._atlasUrl = "res/atlas/game.atlas";
            this.url = 'views/game.json';
        }
        initChildren() {
            this.fishImage.visible = true;
        }
        showTimeImage(time) {
            this.timeImage.alpha = 0;
            this.timeImage.scale(0.1, 0.1);
            this.timeImage.skin = "game/" + time + ".png";
            Laya.Tween.to(this.timeImage, {
                alpha: 1,
                scaleX: 1,
                scaleY: 1,
            }, 100, Laya.Ease.backIn);
        }
    }

    class GameModule extends BaseModule {
        constructor() {
            super();
            this._controllView = null;
            this.hitfontIdx = 1;
            this._scene = null;
            this._countDownTime = 3;
        }
        addView() {
            this._view = new GameView();
            this._controllView = this._view;
        }
        addModel() {
            this._model = new GameModel();
        }
        get model() {
            return this._model;
        }
        open() {
            this.addEvent();
            this.loadScene3D();
            this.initScore();
        }
        setCallBack(callback) {
            this.progress = callback;
        }
        addEvent() {
            this._model.on(DataChangeEvent.SCORE_CHANGE, this, this.scoreChange);
            this._model.on(DataChangeEvent.FISH_COUNT_CHANGE, this, this.fishCountChange);
            this._controllView.voice.on(Laya.Event.CLICK, this, this.changeVoiceState);
        }
        removeEvent() {
            this._model.off(DataChangeEvent.SCORE_CHANGE, this, this.scoreChange);
            this._model.off(DataChangeEvent.FISH_COUNT_CHANGE, this, this.fishCountChange);
            this._controllView.voice.off(Laya.Event.CLICK, this, this.changeVoiceState);
        }
        changeVoiceState() {
            GlobalData.isOpenSound = !GlobalData.isOpenSound;
            if (GlobalData.isOpenSound) {
                this._controllView.voice.skin = "game/voice.png";
                SoundManager.instance.PlayGameBgm();
            }
            else {
                this._controllView.voice.skin = "game/voice_close.png";
                SoundManager.instance.stopBgm();
            }
        }
        fishCountChange(value) {
            if (this._controllView.fishfont) {
                this._controllView.fishfont.value = value;
            }
        }
        scoreChange(value) {
            if (this._controllView.score) {
                this._controllView.score.value = value;
            }
        }
        loadScene3D() {
            Laya.Scene3D.load("res3d/Game.ls", Laya.Handler.create(this, this.onGameSceneLoadOk), Laya.Handler.create(this, this.onProgress));
        }
        onProgress(value) {
            this.progress(value);
        }
        onGameSceneLoadOk(scene) {
            ModuleCenter.instance.openLoadingView(false);
            LayerManager.instance.getLayer(Scene3DLayer).addChild(scene);
            this._scene = scene;
            this.createGameScene();
            Laya.timer.once(600, this, this.startGame);
        }
        startGame() {
            this._countDownTime = 3;
            this._controllView.timeImage.alpha = 1;
            this._controllView.timeImage.scale(1, 1);
            this._controllView.timeImage.visible = true;
            this._controllView.showTimeImage(this._countDownTime);
            Laya.timer.loop(1000, this, this.countDown);
        }
        countDown() {
            this._countDownTime -= 1;
            if (this._countDownTime == 0) {
                Laya.timer.clear(this, this.countDown);
                this._controllView.timeImage.visible = false;
                this.startboxClick();
                return;
            }
            this._controllView.showTimeImage(this._countDownTime);
        }
        createGameScene() {
            this._scene.addComponent(GameScript);
        }
        initScore() {
            this.fishCountChange(0);
        }
        showView() {
            this._view.visible = true;
        }
        hideView() {
            this._view.visible = false;
        }
        startboxClick() {
            if (GameScript.instance == null || GameScript.instance.initOk == false)
                return;
            GameScript.instance.startGmae();
            console.log("开始游戏");
        }
        hideFishAndScore() {
            this._controllView.fishfont.visible = false;
        }
        reborn() {
            this._controllView.fishfont.visible = true;
            this.startGame();
        }
        ClearFinger() {
            TweenManager.instance.clearAll(this._controllView.finger);
            this._controllView.finger.visible = false;
            this._controllView.arrowFlashesAni.visible = false;
        }
        DoShowGuideFinger(type) {
            this._controllView.finger.visible = true;
            this._controllView.arrowFlashesAni.visible = true;
            let centerX = this._controllView.width * 0.5;
            let centerY = this._controllView.height * 0.5;
            if (type == 0) {
                this._controllView.finger.y = centerY + 300;
                this._controllView.finger.x = centerX;
                this._controllView.arrowFlashesAni.play();
                TweenManager.instance.toPositionRePlay(this._controllView.finger, new Laya.Vector2(centerX, centerY), 800);
            }
            if (type == 1) {
                this._controllView.finger.y = centerY - 150;
                this._controllView.finger.x = centerX;
                this._controllView.arrowFlashesAni.scaleY = -1;
                TweenManager.instance.toPositionRePlay(this._controllView.finger, new Laya.Vector2(centerX, centerY + 150), 800);
            }
            if (type == 2) {
                this._controllView.finger.y = centerY;
                this._controllView.finger.x = centerX - 250;
                TweenManager.instance.toPositionRePlay(this._controllView.finger, new Laya.Vector2(centerX + 250, centerY), 1000);
            }
            if (type == 3) {
                this._controllView.finger.y = centerY;
                this._controllView.finger.x = centerX + 250;
                TweenManager.instance.toPositionRePlay(this._controllView.finger, new Laya.Vector2(centerX - 250, centerY), 1000);
            }
            if (type == 4) {
                this._controllView.finger.y = centerY;
                this._controllView.finger.x = centerX;
                TweenManager.instance.toScaleRePlay(this._controllView.finger, new Laya.Vector2(1.2, 1.2), 1000);
            }
        }
        uninitialize() {
            this.removeEvent();
            let script = this._scene.getComponent(GameScript);
            script.destroy();
            if (this._controllView) {
                this._controllView.closeView(true);
                this._controllView = null;
            }
            super.uninitialize();
        }
    }

    class LoadingView extends BaseView {
        constructor() {
            super();
            this._rectMask = null;
            this.maskWidth = 408;
        }
        setBindUrl() {
            this._atlasUrl = "res/atlas/loading.atlas";
            this.url = 'views/loading.json';
        }
        initChildren() {
            this.initMask();
        }
        initMask() {
            this._rectMask = new Laya.Sprite();
            this._rectMask.graphics.drawRect(this.progressBg.x - this.maskWidth, this.progressBg.y, this.maskWidth, 26, "#ffffff");
            this.progressValue.mask = this._rectMask;
            this.cat.x = 0;
        }
        updataProgress(currentProgress) {
            if (this._rectMask.x >= this.maskWidth) {
                this._rectMask.x = this.maskWidth;
            }
            this._rectMask.x = currentProgress * this.maskWidth;
            this.cat.x = currentProgress * (416 - 124);
        }
    }

    class LoadingModule extends BaseModule {
        constructor() {
            super();
            this.fileLoadOk = false;
            this.currentProgress = 0;
            this._view = null;
        }
        open() {
            let self = this;
            ModuleCenter.instance.openGameScene(true, (value) => {
                this._view.updataProgress(value);
            });
        }
        addView() {
            this._view = new LoadingView();
        }
        closeWindow() {
            super.closeWindow();
        }
    }
    class LoadingViewArg {
        constructor() {
            this.subpackgeName = '';
        }
    }

    class TimeUtil {
        constructor() {
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new TimeUtil();
            }
            return this._instance;
        }
        toTimeStamp(date) {
            let tempDate = new Date(date);
            return tempDate.getTime();
        }
    }
    TimeUtil._instance = null;

    class OverMoedl extends BaseModel {
        constructor() {
            super();
        }
    }

    class OverView extends BaseView {
        constructor() {
            super();
        }
        setBindUrl() {
            this._atlasUrl = "res/atlas/over.atlas";
            this.url = 'views/over.json';
        }
        updataGold(value) {
            this.label_gold.text = value.toString();
        }
        updataLabelCardsNumber(value) {
            this.label_cards.text = value.toString() + "张";
        }
        initChildren() {
            this.star.alpha = 0;
            this.star.scale(0.6, 0.6);
            this.playStarAni();
        }
        playStarAni() {
            Laya.Tween.to(this.star, { alpha: 1 }, 30, null)
                .to(this.star, { scaleX: 3, scaleY: 3, alpha: 1 }, 3000, null, Laya.Handler.create(this, this.complete));
        }
        complete() {
            this.star.alpha = 0;
            this.star.scale(0.6, 0.6);
            this.playStarAni();
        }
        setItemIamge(url) {
            this.item.loadImage(url);
        }
        destroy() {
            Laya.Tween.clearTween(this.star);
        }
    }

    class OverModule extends BaseModule {
        constructor() {
            super();
            this._controllView = null;
            this._gameModule = null;
            this._getCollectionShopData = null;
            this._isGet = false;
        }
        addView() {
            this._view = new OverView();
            this._controllView = this._view;
        }
        addModel() {
            this._model = new OverMoedl();
        }
        open() {
            this._gameModule = ModuleCenter.instance.gameModule;
            this.addEvent();
            this.initView();
        }
        initView() {
            if (GlobalData.gameOver) {
                this.openResultCon(true);
            }
            else {
                if (this.checkTimesOver()) {
                    this.openResultCon(false);
                }
                else {
                    this.openRebornCon();
                }
            }
        }
        addEvent() {
            this._controllView.reborn.clickHandler = Laya.Handler.create(this, this.onClickReborn, null, false);
            this._controllView.no.on(Laya.Event.CLICK, this, this.exitGame);
            this._controllView.btn_close.on(Laya.Event.CLICK, this, this.gotoHome);
            this._controllView.again.clickHandler = Laya.Handler.create(this, this.onClickAgainGame, null, false);
        }
        removeEvent() {
            this._controllView.reborn.clickHandler.recover();
            this._controllView.no.off(Laya.Event.CLICK, this, this.exitGame);
            this._controllView.btn_close.off(Laya.Event.CLICK, this, this.gotoHome);
            this._controllView.again.clickHandler.recover();
        }
        onClickReborn() {
            if (null == this._getCollectionShopData) {
                return;
            }
            if (this._isGet)
                return;
            this._isGet = true;
            window.platform.goodsCollected(this._getCollectionShopData.commodityId).then((res) => {
                if (res.success == true) {
                    this.closeWindow();
                    this._gameModule.model.setUsedCollectionShopArray(this._getCollectionShopData.commodityId);
                    GameScript.instance.player.Reborn();
                }
                else {
                    this.openResultCon();
                    this._isGet = false;
                }
            }, (error) => {
                Log.log("服务器返回错误", error);
                ModuleCenter.instance.showTips("游戏异常，请联系客服");
            });
        }
        exitGame() {
            this.openResultCon();
        }
        closeWindow() {
            this.removeEvent();
            super.closeWindow();
        }
        gotoHome(isGameOver, score) {
            this.closeWindow();
            if (GlobalData.isBaoXiang) {
                window.platform.goBoxHome(isGameOver, score);
            }
            else {
                window.platform.goHome();
            }
            ModuleCenter.instance.destory();
            LayerManager.instance.destory();
            Laya.stage.destroy();
            Log.log("游戏已销毁");
        }
        onClickAgainGame() {
            let timeStart = this._gameModule.model.startTime;
            let endTime = this._gameModule.model.endTime;
            let startDate = TimeUtil.instance.toTimeStamp(timeStart);
            let endDate = TimeUtil.instance.toTimeStamp(endTime);
            let curTime = new Date().getTime();
            if (curTime < startDate) {
                ModuleCenter.instance.showTips("活动未开始");
                return;
            }
            if (curTime > endDate) {
                ModuleCenter.instance.showTips("活动已结束");
                return;
            }
            window.platform.getRest().then((res) => {
                if (res.success == true) {
                    console.log("重新开始游戏");
                    this.closeWindow();
                    GlobalData.gameOver = false;
                    ModuleCenter.instance.restartGame();
                }
                else {
                    ModuleCenter.instance.showTips("挑战次数不足，明日再来");
                }
            }, (err) => {
                Log.log(err);
                ModuleCenter.instance.showTips("游戏异常，请联系客服");
            });
        }
        openResultCon(gameOver = false) {
            let datas = this._gameModule.model.getUsedCollectionShops();
            let len = datas.length;
            if (GlobalData.isBaoXiang) {
                window.platform.updateGold(this._gameModule.model.fishCount, len, datas).then((res) => {
                    if (res.success == true) {
                        this.gotoHome(gameOver, this._gameModule.model.fishCount);
                    }
                    else {
                        ModuleCenter.instance.showTips("游戏异常，请联系客服");
                    }
                }, (err) => {
                    Log.log(err);
                    ModuleCenter.instance.showTips("游戏异常，请联系客服");
                });
            }
            else {
                this.changeContainer(true);
                this.changeResultBg(gameOver);
                this._controllView.updataGold(this._gameModule.model.fishCount);
                this._controllView.updataLabelCardsNumber(len);
                window.platform.updateGold(this._gameModule.model.fishCount, len, datas);
            }
        }
        changeResultBg(gameOver) {
            this._controllView.win.visible = gameOver;
            this._controllView.fail.visible = !gameOver;
        }
        openRebornCon() {
            this._isGet = false;
            this.changeContainer(false);
            this._controllView.setItemIamge(this._getCollectionShopData.imgUrl);
        }
        checkTimesOver() {
            let timesOver = false;
            if (this._gameModule.model.isOver()) {
                timesOver = true;
            }
            else {
                timesOver = false;
                this._getCollectionShopData = this._gameModule.model.getCollectionShopData();
            }
            return timesOver;
        }
        changeContainer(b) {
            this._controllView.resultCon.visible = b;
            this._controllView.rebornCon.visible = !b;
        }
    }

    class ToastView extends BaseView {
        constructor() {
            super();
            this.toasMgsarr = null;
            this.toasShowing = false;
            this.toasMgsarr = new Array();
        }
        setBindUrl() {
            this._atlasUrl = "res/atlas/common.atlas";
            this.url = 'views/tip.json';
        }
        setParentLayer() {
            this._parentLayer = LayerManager.instance.getLayer(TipsLayer);
        }
        initChildren() {
        }
        pushtoas(str) {
            this.toasMgsarr.push(str);
            this.showtoas();
        }
        showtoas() {
            let time = 1500;
            if (this.toasShowing)
                return;
            this.bg.visible = true;
            this.toasShowing = true;
            let item = this.toasMgsarr.shift();
            if (this.toasMgsarr.length >= 2)
                time = 600;
            if (item == null) {
                this.toasShowing = false;
                this.bg.visible = false;
                return;
            }
            this.tip.text = item;
            Laya.timer.once(time, this, this.distoasImg, null, true);
        }
        distoasImg() {
            this.toasShowing = false;
            this.bg.visible = false;
            this.showtoas();
        }
    }

    class ToastModule extends BaseModule {
        constructor() {
            super();
        }
        addView() {
            this._view = new ToastView();
        }
        open() {
            let view = this._view;
            view.pushtoas(this._tips);
        }
        showToas(str) {
            this._tips = str;
        }
    }

    class ModuleCenter {
        constructor() {
            this._moduleManager = null;
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new ModuleCenter();
            }
            return this._instance;
        }
        create() {
            this._moduleManager = new ModuleManager();
            this.createModule();
            this._moduleManager.initialize();
        }
        createModule() {
            this._moduleManager.addModule(LoadingModule);
            this._moduleManager.addModule(GameModule);
            this._moduleManager.addModule(OverModule);
            this._moduleManager.addModule(ToastModule);
        }
        destory() {
            this._moduleManager.uninitialize();
            this._moduleManager.removeAllModule();
            this._moduleManager = null;
        }
        openLoadingView(b) {
            let loadingModule = this._moduleManager.getModule(LoadingModule);
            if (b) {
                loadingModule.openWindow();
            }
            else {
                loadingModule.closeWindow();
            }
        }
        openGameScene(open, callBack) {
            let gameModule = this._moduleManager.getModule(GameModule);
            if (open) {
                gameModule.setCallBack(callBack);
                gameModule.openWindow();
            }
            else {
                gameModule.closeWindow();
            }
        }
        restartGame() {
            let gameModule = this._moduleManager.getModule(GameModule);
            gameModule.uninitialize();
            gameModule.initialize();
            gameModule.openWindow();
        }
        get gameModule() {
            return this._moduleManager.getModule(GameModule);
        }
        showTips(content) {
            let toastModule = this._moduleManager.getModule(ToastModule);
            toastModule.showToas(content);
            toastModule.openWindow();
        }
        openOverView(b) {
            let overModule = this._moduleManager.getModule(OverModule);
            if (b) {
                overModule.openWindow();
            }
            else {
                overModule.closeWindow();
            }
        }
    }
    ModuleCenter._instance = null;

    class UnityEnagine extends Laya.Script {
        constructor() {
            super(...arguments);
            this.logFps = false;
            this.openAppTimeSc = 0;
            this.fpsTime = 0;
            this.framCount = 0;
            this.fps = 0;
            this.fpsmin = 9999;
            this.fpsMax = 0;
        }
        onAwake() {
            this.owner.addComponent(Input);
            this.openAppTimeSc = Laya.timer.currTimer * 0.001;
        }
        onUpdate() {
            Time.fixedDeltaTime = Laya.timer.delta;
            Time.deltaTime = Laya.timer.delta * 0.001;
            if (this.logFps)
                this.calFps();
            Time.time = Laya.timer.currTimer * 0.001 - this.openAppTimeSc;
        }
        calFps() {
            this.framCount += 1;
            this.fpsTime += Time.deltaTime;
            if (this.fpsTime > 1) {
                this.fps = this.framCount;
                this.fpsTime = 0;
                this.framCount = 0;
                this.fpsMax += this.fps;
                if (this.fps < this.fpsmin)
                    this.fpsmin = this.fps;
                console.log('fps 当前=', this.fps, '最小=', this.fpsmin, '总帧数', this.fpsMax);
            }
        }
    }

    class GameEnter {
        constructor() {
            this._loadUrlArray = null;
            this._loadUrlArray = [
                "config/random.json",
                "config/model_0.json",
                "config/model_1.json",
                "config/model_2.json",
                "config/model_3.json",
                "config/model_4.json",
                "config/model_5.json",
                "config/model_6.json",
                "config/model_7.json",
                "config/model_8.json",
                "config/model_9.json",
                "config/model_10.json",
                "config/model_11.json",
                "config/model_12.json",
                "over/starsky.png"
            ];
            Laya.loader.load(this._loadUrlArray, Laya.Handler.create(this, this.init));
        }
        init() {
            this.initUnityEngine();
            this.initLayer();
            ModuleCenter.instance.create();
            this.startGame();
        }
        initUnityEngine() {
            let node = new Laya.Node();
            Laya.stage.addChild(node);
            node.addComponent(UnityEnagine);
        }
        initLayer() {
            LayerManager.instance.addLayer(Scene3DLayer);
            LayerManager.instance.addLayer(UILayer);
            LayerManager.instance.addLayer(TipsLayer);
        }
        startGame() {
            ModuleCenter.instance.openLoadingView(true);
        }
    }

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.bgColor = "#FFFFFF";
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            Laya.URL.basePath = "https://draw-mb.oss-cn-zhangjiakou.aliyuncs.com/laya/paoku/v1.0.1/";
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            new GameEnter();
        }
    }
    new Main();

}());
