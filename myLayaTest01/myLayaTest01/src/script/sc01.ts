import sc02 from "./sc02"

export default class sc01 extends Laya.Script {
   
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
        
    }
    
    onEnable(): void {
    }

    onDisable(): void {
    }
    onStart(): void{
        console.log(this.intType)
        console.log(this.owner)
        //console.log(this.owner.x)
        //var sprite1: Laya.Sprite = this.owner as Laya.Sprite;
        var owner: Laya.Sprite = this.owner as Laya.Sprite;
        
        console.log(owner.visible)
       // owner.visible=false;
        
        console.log(owner.x)
        //console.log(owner.visible)

        //var sc02 = this.owner.getComponent(Laya.Script).getComponent;
        //this.gameManager = this.owner.parent.getComponent(GameManager);
        //console.log(this.owner.parent.getComponent(sc02))
        //console.log(sc02)
        sc02.instance.hello();
        console.log(this.owner.parent.numChildren)
        var btn:Laya.Button =this.owner.parent.getChildByName("button01") as Laya.Button;
        console.log(btn.label)
        console.log(btn.scene)

        //sc02.hello();
        
    }
}