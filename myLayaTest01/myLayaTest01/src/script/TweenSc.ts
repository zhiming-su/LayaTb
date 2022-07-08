export default class TweenSc extends Laya.Script {
    /** @prop {name:xxSprite, tips:"spriteNode", type:Node, default:null}*/
    public xxSprite: Laya.Sprite;

     /** @prop {name:myButton, tips:"myButton", type:Node, default:null}*/
     public myButton: Laya.Button;

      /** @prop {name:progressB, tips:"progressB", type:Node, default:null}*/
      public progressB: Laya.ProgressBar;
    
    
    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    
    constructor() { super(); }
    
    onEnable(): void {
    }

    onDisable(): void {
    }

    onAwake() : void{
        //Laya.Physics.I.gravity
    }

    onStart() : void{
        let progressBar= Laya.Handler.create(this,function(num){
            console.log(num)
            this.progressB.value=num;
        })
        //Laya.loader.load("res/ss-0.0.1-SNAPSHOT.jar",null,progressBar)
        //Laya.Tween.to(this.xxSprite,{y:600},3000)
        let myTl=Laya.TimeLine.to(this.xxSprite,{y:600},3000)
        this.myButton.alpha=0
        myTl.to(this.myButton,{y:300,alpha:1},3000,Laya.Ease.bounceInOut)
//        myTl.addLabel();

       
        myTl.play();
       // Laya.SoundManager.playMusic("res/bg2.mp3");
       // myTl.on()
    }
}