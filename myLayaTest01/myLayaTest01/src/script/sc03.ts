export default class sc03 extends Laya.Script {
    /** @prop {name:intType, tips:"整数类型示例", type:Int, default:1000}*/
    public intType: number = 1000;
    /** @prop {name:numType, tips:"数字类型示例", type:Number, default:1000}*/
    public numType: number = 1000;
    /** @prop {name:strType, tips:"字符串类型示例", type:String, default:"hello laya"}*/
    public strType: string = "hello laya";
    /** @prop {name:boolType, tips:"布尔类型示例", type:Bool, default:true}*/
    public boolType: boolean = true;
    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    constructor() {
        super();
        /* var btn = this.owner as Laya.Button;
        btn.on(Laya.Event.CLICK,this,this.clickEvent) */
    }

    onEnable(): void {
    }

    onDisable(): void {
    }

    onMouseDown(e: Laya.Event): void {
        console.log(e)
        //e.stopPropagation();
        e.stopPropagation();

    }

    onClick(): void {
       // console.log("onClick")
       let xxSprite=this.owner.parent.getChildByName("xxSprite") as Laya.Sprite
       Laya.Tween.to(xxSprite,{y:200},3000)
    }

    onAwake(): void {
        var btn: Laya.Button = this.owner as Laya.Button;
        //btn.on(Laya.Event.CLICK,this,this.clickEvent)
        //btn.clickHandler()
        this.owner.numChildren;
        //Laya.Handler.create()
        var had = Laya.Handler.create("hello world!1111", function (x, y, a) {
            console.log(this)
            console.log(x, y, a)
        }, null, false)
        //had.run();
        //had.runWith("java");
        //had.recover();
    }

    clickEvent(): void {
        console.log("ok click!")
        var tex = new Laya.Text;
        tex.text = "hello world!";
        tex.color = "#d9110e"
        tex.fontSize = 26;
        this.owner.parent.addChild(tex)
    }
}