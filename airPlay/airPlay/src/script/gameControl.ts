export default class gameControl extends Laya.Script {
    /** @prop {name:dropBox,tips:"掉落容器预制体对象",type:Prefab}*/
    dropBox: Laya.Prefab;

    /** @prop {name:bullet,tips:"子弹预制体对象",type:Prefab}*/
    bullet: Laya.Prefab;

    /** @prop {name:fs,tips:"分数对象",type:Node}*/
    fs: Laya.Sprite;

    /** @prop {name:player,tips:"飞机对象",type:Node}*/
    public player: Laya.Sprite;

    /** @prop {name:startImg,tips:"开始游戏",type:Node}*/
    public startImg: Laya.Sprite;

    static instance: gameControl;
    //private zd:Laya.Sprite;

    /**子弹和盒子所在的容器对象 */
    private _gameBox: Laya.Sprite;
    /**开始时间*/
    private _time: number = 0;

    public startFlag = false;
    public zdFlage = false;
    public startGame = false;
    createBoxInterval: number = 1000;

    public fsNum = 0;

    constructor() {
        super();
        gameControl.instance = this;
        Laya.MouseManager.multiTouchEnabled = false;
    }

    onEnable(): void {
        this._time = Date.now();
        this._gameBox = this.owner.getChildByName("gameBox") as Laya.Sprite;


        //console.log(this.player)
        //console.log(Laya.stage)

    }

    onDisable(): void {
    }
    stopGame(): void {
        this.startGame = false;
        let sp = this.owner.getChildByName("end") as Laya.Sprite;
        //console.log(this.owner.parent)
        sp.visible = true;
    }

    createBox(): void {
        //使用对象池创建盒子
        let box: Laya.Sprite = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
        box.pos(Math.random() * (Laya.stage.width - 100), -100);
        this._gameBox.addChild(box);
    }

    onStart(): void {
        this.startImg.on(Laya.Event.CLICK, this, function () {
            window.platform.goHome();
            //console.log(window.platform)
            //console.log(window.platform.goHome)
            //window.platform.
            this.startGame = true;
            this.startImg.visible = false;
            this.player.visible = true;
            this.fs.visible = true;
            this.player.pos(Laya.stage.width / 2, Laya.stage.height - this.player.height)
            let now = Date.now();
            if (now - this._time > this.createBoxInterval && this._started) {
                this._time = now;
                this.createBox();
            }
        });
        this.player.on(Laya.Event.MOUSE_MOVE, this, this.onClickPlayer)

        Laya.timer.loop(300, this, function () {
            if (this.startGame) {
                let flyer: Laya.Sprite = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet);
                this.zd = flyer;
                if (this.startFlag && this.zdFlage) {
                    flyer.pos(Laya.stage.mouseX - flyer.width / 2, Laya.stage.mouseY);
                } else {
                    flyer.pos(this.player.x - flyer.width / 2, this.player.y - flyer.height);
                }
                //this.player.pos(Laya.stage.mouseX, Laya.stage.mouseY)

                //console.log(Laya.stage.mouseY)
                //console.log(this.player.mouseY)
                this._gameBox.addChild(flyer);
                this.player.on(Laya.Event.MOUSE_UP, this, function () {
                    this.zdFlage = false;
                    // console.log(this.zdFlage)
                })
            }

        })
    }
    onUpdate(): void {
        //Laya.Tween.to(this.player, { x: Laya.stage.mouseX + (this.player.width / 2), y: Laya.stage.mouseY-(this.player.height) }, 100)
        //console.log(this.zd)
        //let flyer: Laya.Sprite = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet);

        //this.player.pos(Laya.stage.mouseX, Laya.stage.mouseY)

        //console.log(Laya.stage.mouseY)
        //console.log(this.player.mouseY)

        let now = Date.now();
        if (now - this._time > this.createBoxInterval && this.startGame) {
            this._time = now;
            this.createBox();
        }



        //console.log(this.player.y)
        //flyer.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        //this._gameBox.addChild(flyer);
    }
    private onClickPlayer(): void {

        if (this.startFlag) {
            this.zdFlage = true;
            this.player.pos(Laya.stage.mouseX, Laya.stage.mouseY)

            //console.log(this.player.x,this.player.y)
        }

    }

    onStageMouseMove(): void {
        this.startFlag = true;
    }

    onStageClick(e: Laya.Event): void {

        //停止事件冒泡，提高性能，当然也可以不要
        //e.stopPropagation();
        //舞台被点击后，使用对象池创建子弹
        //let flyer: Laya.Sprite = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet);
        //flyer.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        //this._gameBox.addChild(flyer);
    }
}