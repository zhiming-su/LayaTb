import Mathf from "./Mathf";

export default class Vector2Ext {
    public static magnitude(v:Laya.Vector2) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }


   
    public static Distance(a: Laya.Vector2, b: Laya.Vector2) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
    }

    public static readonly zero=new Laya.Vector2(0,0);


    public static  Lerp( a,  b,  t):Laya.Vector2
    {
        t = Mathf.Clamp01(t);
        return new Laya.Vector2(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t,
           
        );
    }
    
}