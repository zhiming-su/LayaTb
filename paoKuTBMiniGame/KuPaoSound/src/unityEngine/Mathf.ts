export default class Mathf {

    //declare module  UnityEngine  {

    public static Sin(t):number
    {
        return Math.sin(t);
    }

    public static Deg2Rad = 0.0174532924;

    public static Rad2Deg = 57.29578;

    public static PI = 3.14159274;

    public static Abs(v): number {
        return Math.abs(v);
    }

    public static Cos(x:number):number
    {
        return Math.cos(x);
    }

    public static LerpAngle(a, b, t): number {

        var num = Mathf.Repeat(b - a, 360.0);

        if (num > 180.0)

            num -= 360.0;

        return a + num * Mathf.Clamp01(t);

    }

    public static Repeat(t, length): number {

        return t - Mathf.Floor(t / length) * length;

    }

    public static Floor(f): number {

        return Math.floor(f);

    }


    public static Clamp01(value): number {

        if (value < 0.0)

            return 0.0;

        if (value > 1.0)

            return 1.0;

        return value;

    }


    public static Acos(value): number {
        return Math.acos(value);
    }

    public static Atan2(x, y): number {
        return Math.atan2(x, y);
    }


    public static Lerp(a: number, b: number, t: number): number {
        return a + (b - a) * Mathf.Clamp01(t);
    }

    public static InverseLerp(a, b, value): number {
        if (a != b)
            return Mathf.Clamp01((value - a) / (b - a));
        else
            return 0.0;
    }

    public static Max(a, b): number {
        return a > b ? a : b;
    }

    public static Min(a, b): number {
        return a < b ? a : b;
    }

    public static Clamp(value, min, max): number {
        if (value < min)
            value = min;
        else if (value > max)
            value = max;
        return value;
    }

     // PingPongs the value t, so that it is never larger than length and never smaller than 0.
     public static  PingPong(t, length):number
     {
         t = this.Repeat(t, length * 2);
         return length - Mathf.Abs(t - length);
     }


}

    //}

