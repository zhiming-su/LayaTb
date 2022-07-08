export default class ProgressBarMasK extends Laya.Box {





    constructor() { super(); }

    public _mask: Laya.Graphics;
    public font: Laya.Image;
    maskImg: Laya.Texture;
    _with = 300;
    onAwake() {
        super.onAwake();
        this.font = this.getChildByName('font') as Laya.Image;
        this.maskImg = Laya.Loader.getRes(this.font.skin);
    }
    onEnable(): void {
    }

    onDisable(): void {
    }
    /**范围0-1 */
    private _value: number = 0;

    public get value() {
        return this._value;
    }
    leftToRight = false;
    public set value(progress: number) {
        if (progress >= 1) progress = 1;
        this._value = progress;
        if (this.font == null)
            this.font = this.getChildByName('font') as Laya.Image;

        this.font.graphics.clear();
        var x = this.font.width * progress;

        if (this.leftToRight) {
            this.font.graphics.drawImage(this.maskImg, progress * this._with, 0, this.font.width, this.font.height);
        }
        else
            this.font.graphics.drawImage(this.maskImg, x - this._with, 0, this.font.width, this.font.height);
    }

    public set skin(v: string) {
        this.font.skin = v;
    }






}