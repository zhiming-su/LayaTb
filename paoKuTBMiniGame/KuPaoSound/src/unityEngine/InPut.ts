import Time from "./Time";


export default class Input extends Laya.Script {


    public static mouseButton0down: boolean = false;
    public static mouseButton0Up: boolean = false;

    public static mouseButton0DwonHold: boolean = false;
    static dicKeyDown: { [key: number]: boolean; } = {}

    static dicKeyUpdate: { [key: number]: boolean; } = {}

    constructor() {
        super();

    }

    onAwake() {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.p_onMouseDown)
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.p_onMouseUp)
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDownEvent);
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUpEvent);

        this.preMouseX = Laya.MouseManager.instance.mouseX;
    }

    onKeyDownEvent(e: Laya.Event) {


        Input.dicKeyDown[e.keyCode] = true;

        Input.dicKeyUpdate[e.keyCode] = true;

        //console.log(e.keyCode+" true");
    }

    onKeyUpEvent(e: Laya.Event) {


        Input.dicKeyDown[e.keyCode] = false;

        Input.dicKeyUpdate[e.keyCode] = false;
        // console.log(e.keyCode+" false");
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

                //  egret.log(this.dicKey[k]);
                Input.dicKeyDown[k] = false;
            }

            for (let k in Input.dicKeyUpdate) {

                //  egret.log(this.dicKey[k]);
                Input.dicKeyUpdate[k] = false;
            }
        }
    }
    count = 0;
    counttime = 0;
    public static GetAxisRaw_Mouse_X = 0;
    preMouseX = 0;
    onUpdate() {
        this.onUpdate_mouse();
        // this.GetAxisRaw_Mouse=this.preMouseX-Laya.MouseManager.instance.mouseX;
        // this.preMouseX=Laya.MouseManager.instance.mouseX;
        // if (Time.deltaTime < Time.deltaTimeMin) Time.deltaTimeMin = Time.deltaTime;
        // if (Time.deltaTime > Time.deltaTimeMax) Time.deltaTimeMax = Time.deltaTime;
        // this.count += 1;
        // this.counttime += Time.deltaTime;
        // Time.deltaTimeEvr = this.counttime / this.count;





        //   Time.time = Laya.timer.currTimer * 0.001 -Time.time;

    }

    public static GetKeyDown(e: number) {
        if (Laya.Browser.onPC == false) return false;
        //  Laya.Keyboard.E
        //  return Laya.KeyBoardManager.hasKeyDown(e)
        // return  true;
        return Input.dicKeyDown[e];
    }

    public static GetKey(e: number) {
        if (Laya.Browser.onPC == false) return false;
        //  Laya.Keyboard.E
        //  return Laya.KeyBoardManager.hasKeyDown(e)
        // return  true;

        if (Input.dicKeyUpdate[e] == null) return false;
        return Input.dicKeyUpdate[e];
    }

    firstX = -12345678;
    seconx = 0;
    mouseDown_y = 0;
    mouseDown_y_Time = 0;

    slide_mouseDown_x = 0;

    /**上滑 */
    static slideUp = false;
    /**下滑 */
    static slidedown = false;
       /**左滑 */
    static slideLeft = false;
      /**右滑 */
    static slideRight = false;

    /**灵敏度 */
    sensitivity = 0.2;
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
                //  console.log(movementX);
                // if (movementX > 0) {
                //     Input.GetAxisRaw_Mouse_X = movementX;

                // } else if (movementX < 0) {

                //     Input.GetAxisRaw_Mouse_X = movementX;

                // } else {
                //     Input.GetAxisRaw_Mouse_X = 0;
                // }

                // console.log(movementX);
            }


        }

        if (Input.mouseButton0Up) {

            Input.GetAxisRaw_Mouse_X = 0;
            this.firstX = -12345678;;
            this.seconx = 0;
        }


        //判断上滑手势

        if (Input.mouseButton0down) {
            this.mouseDown_y = Laya.MouseManager.instance.mouseY;
            this.mouseDown_y_Time = Time.time;

            this.slide_mouseDown_x = Laya.MouseManager.instance.mouseX;
        }


        // 上滑
        if (Input.mouseButton0Up) {
            let mouse_up_y = Laya.MouseManager.instance.mouseY;
            let mouse_up_x = Laya.MouseManager.instance.mouseX;
            let mouse_up_y_time = Time.time;

            let OpTime = mouse_up_y_time - this.mouseDown_y_Time < 0.3;
            //
            let ydis = this.mouseDown_y - mouse_up_y;
            if (OpTime) {
                if (ydis > 100 * this.sensitivity) {
                    Input.slideUp = true;
                    // console.log('slideUp', ydis);
                    Input.slideYdis=ydis;
                } else if (ydis < -100 * this.sensitivity) {
                    // console.log('slideDown', ydis);
                    Input.slidedown = true;

                    Input.slideYdis=ydis;
                }

                //判断左滑动
                 
                if (this.slide_mouseDown_x - mouse_up_x > 100 * this.sensitivity) {
                    Input.slideLeft = true;
                    // console.log('slide left',);
                    Input.slideXdis=this.slide_mouseDown_x - mouse_up_x;
                } else if (mouse_up_x - this.slide_mouseDown_x > 100 * this.sensitivity) {
                    // console.log('slide right');

                    Input.slideRight = true;

                    Input.slideXdis=mouse_up_x - this.slide_mouseDown_x;
                }
            }
        }




    }

    static slideXdis=0;
    static slideYdis=0;
}