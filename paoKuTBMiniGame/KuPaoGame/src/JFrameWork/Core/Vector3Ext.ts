import JieTools from "../JTools/JTools";
import Mathf from "../../UnityEngine/Mathf";

export default class Vector3Ext {

    public static readonly Up = new Laya.Vector3(0, 1, 0);
    public static readonly up = new Laya.Vector3(0, 1, 0);
    public static readonly Zero = new Laya.Vector3(0, 0, 0);
    public static readonly zero = new Laya.Vector3(0, 0, 0);
    public static readonly forward = new Laya.Vector3(0, 0, -1);

    public static readonly forwardU3d = new Laya.Vector3(0, 0, 1);
    public static readonly down = new Laya.Vector3(0, -1, 0);

    public static readonly one = new Laya.Vector3(1, 1, 1);

    public static readonly left = new Laya.Vector3(-1, 0, 0);
    public static readonly right = new Laya.Vector3(1, 0, 0);

    public static normalize(vec: Laya.Vector3) {
        Laya.Vector3.normalize(vec, vec);
    }


    public static mul_Num(vec: Laya.Vector3, l: number): Laya.Vector3 {
        return new Laya.Vector3(vec.x * l, vec.y * l, vec.z * l);
    }

    public static mul_Num_Fast(vec: Laya.Vector3, l: number, out: Laya.Vector3) {
        out.x = vec.x * l
        out.y = vec.y * l
        out.z = vec.z * l



    }

    public static mul_Num_gc(vec: Laya.Vector3, l: number, outVec: Laya.Vector3) {



        outVec.x = vec.x * l;
        outVec.y = vec.y * l;
        outVec.z = vec.z * l;
    }

 



    public static mul(a: Laya.Vector3, b: Laya.Vector3): Laya.Vector3 {
        var c = new Laya.Vector3();
        Laya.Vector3.multiply(a, b, c);
        return c;
    }

    public static add(a, b): Laya.Vector3 {
        var c = new Laya.Vector3();

        Laya.Vector3.add(a, b, c)
        return c;
    }



    public static add_Fast(a, b, c) {

        Laya.Vector3.add(a, b, c)

    }



    public static sub(a, b): Laya.Vector3 {
        var c = new Laya.Vector3();

        Laya.Vector3.subtract(a, b, c)
        return c;
    }

    public static sub_Fast(a, b, c) {

        Laya.Vector3.subtract(a, b, c)

    }

    public static Lerp_u3d(a, b, t): Laya.Vector3 {
        t = Mathf.Clamp01(t);
        return new Laya.Vector3(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t,
            a.z + (b.z - a.z) * t
        );
    }

    public static Lerp(a: Laya.Vector3, b: Laya.Vector3, t: number): Laya.Vector3 {
        t = Mathf.Clamp01(t);
        return new Laya.Vector3(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t,
            a.z + (b.z - a.z) * t
        );
    }

    public static Lerp_Fast(a: Laya.Vector3, b: Laya.Vector3, c: Laya.Vector3, t: number) {
        t = Mathf.Clamp01(t);
        c.x = a.x + (b.x - a.x) * t;
        c.y = a.y + (b.y - a.y) * t;
        c.z = a.z + (b.z - a.z) * t;

    }




}