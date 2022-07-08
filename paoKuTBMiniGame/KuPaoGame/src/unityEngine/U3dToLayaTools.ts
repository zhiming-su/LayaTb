import Mathf from "../UnityEngine/Mathf";

export default class U3dToLayaTools {


    public static readonly Vector3_right = new Laya.Vector3(1, 0, 0)



    public static QuaternionMulVector3(rotation: Laya.Quaternion, point: Laya.Vector3): Laya.Vector3  {
        var x = rotation.x * 2;
        var y = rotation.y * 2;
        var z = rotation.z * 2;
        var xx = rotation.x * x;
        var yy = rotation.y * y;
        var zz = rotation.z * z;
        var xy = rotation.x * y;
        var xz = rotation.x * z;
        var yz = rotation.y * z;
        var wx = rotation.w * x;
        var wy = rotation.w * y;
        var wz = rotation.w * z;

        var res = new Laya.Vector3();
        res.x = (1 - (yy + zz)) * point.x + (xy - wz) * point.y + (xz + wy) * point.z;
        res.y = (xy + wz) * point.x + (1 - (xx + zz)) * point.y + (yz - wx) * point.z;
        res.z = (xz - wy) * point.x + (yz + wx) * point.y + (1 - (xx + yy)) * point.z;
        return res;
    }

    public static ToU3dEulerAnglez2(z): number  {
        if (z > 180.0)
            z -= 360.0;


        if (z < -180.0)
            z += 360.0;
        return z;
    }
}