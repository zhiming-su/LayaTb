import Vector3Ext from "../Core/Vector3Ext";
import U3dToLayaTools from "../../UnityEngine/U3dToLayaTools";

export default class QuaternionExt {

    public static Lerp(a: Laya.Quaternion, b: Laya.Quaternion, t: number) {
        var out = new Laya.Quaternion();
        Laya.Quaternion.lerp(a, b, t, out);

        return out;
    }

    public static readonly identity = new Laya.Quaternion();

    public static LookRotation(vec3: Laya.Vector3) {
        var out = new Laya.Quaternion();
        Laya.Quaternion.rotationLookAt(vec3, Vector3Ext.Up, out);

        return out;
    }
    public static Mul(a: Laya.Quaternion, b: Laya.Quaternion) {
        var out = new Laya.Quaternion();
        Laya.Quaternion.multiply(a, b, out);

        return out;
    }
    public static Euler(vec3: Laya.Vector3) {

      
        let ex, ey, ez;
        ex = vec3.x;
        ey = vec3.y;
        ez = vec3.z;
        var qx, qy, qz, qw;
        var PIover180 = 0.0174532925;
        ex = ex * PIover180 / 2.0;
        ey = ey * PIover180 / 2.0;
        ez = ez * PIover180 / 2.0;

        qx = Math.sin(ex) * Math.cos(ey) * Math.cos(ez) + Math.cos(ex) * Math.sin(ey) * Math.sin(ez);
        qy = Math.cos(ex) * Math.sin(ey) * Math.cos(ez) - Math.sin(ex) * Math.cos(ey) * Math.sin(ez);
        qz = Math.cos(ex) * Math.cos(ey) * Math.sin(ez) - Math.sin(ex) * Math.sin(ey) * Math.cos(ez);
        qw = Math.cos(ex) * Math.cos(ey) * Math.cos(ez) + Math.sin(ex) * Math.sin(ey) * Math.sin(ez);

        return new Laya.Quaternion(qx, qy, qz, qw);
    }

    public static EulerXYZ(x, y, z) {
        return QuaternionExt.Euler(new Laya.Vector3(x, y, z));
    }




}