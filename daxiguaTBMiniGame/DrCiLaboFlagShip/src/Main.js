import GameConfig from "./GameConfig";
import GlobalGameData from "./scripts/GlobalGameData";
class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		Laya.stage.bgColor = "#FFFFFF"
		// Laya.stage.width = Laya.Browser.width;
		// Laya.stage.height = Laya.Browser.height;

		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		// Laya.URL.basePath = "https://draw-mb.oss-cn-zhangjiakou.aliyuncs.com/laya/compose/drcilabo/flagship/v0.0.2/"
		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError(true);

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded() {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded() {
		//加载IDE指定的场景
		// GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		Laya.loader.load("res/atlas/res.atlas", Laya.Handler.create(this, this.onStartGame), null, Laya.Loader.ATLAS);
		// this.onStartGame()
	}

	onStartGame() {
		window.platform.doInitActivity().then(
			(res) => {
				if (!res.success) {
					console.log("doInitActivity data return false");
				} else {
					new GlobalGameData(res);
					if (res.isNewPlayer) {
						Laya.Scene.open("NewGuide.scene");
					} else {
						Laya.Scene.open(GameConfig.startScene);
					}
				}
			},
			(error) => {
				console.log("doInitActivity data error");
			}
		);
	}

}
//激活启动类
new Main();
