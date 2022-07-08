import AABBGameObject from "./AABBShape";
import Vector3Ext from "../Core/Vector3Ext";
import AABBShape from "./AABBShape";

export default class JRayCast {


    public static intersects(paabb: AABBShape, p_ray: Laya.Ray) {
        //Laya.Ray
        let ptOnPlane: Laya.Vector3; //射线与包围盒某面的交点  
        let min = paabb.minPoint; //aabb包围盒最小点坐标  
        let max = paabb.maxPoint; //aabb包围盒最大点坐标  

        let origin = p_ray.origin; //射线起始点  
        let dir = p_ray.direction; //方向矢量  

        //float t;
        let t = 999999999;
        //分别判断射线与各面的相交情况  

        //判断射线与包围盒x轴方向的面是否有交点  
        if (dir.x != 0) //射线x轴方向分量不为0 若射线方向矢量的x轴分量为0，射线不可能经过包围盒朝x轴方向的两个面  
        {
            /* 
              使用射线与平面相交的公式求交点 
             */
            if (dir.x > 0)//若射线沿x轴正方向偏移  
                t = (min.x - origin.x) / dir.x;
            else  //射线沿x轴负方向偏移  
                t = (max.x - origin.x) / dir.x;

            if (t > 0) //t>0时则射线与平面相交  
            {

                // ptOnPlane = origin + t * dir; //计算交点坐标 
                let mul = Vector3Ext.mul_Num(dir, t);
                let rs2 = Vector3Ext.add(origin, mul);
                ptOnPlane = rs2; //计算交点坐标  
                //判断交点是否在当前面内  
                if (min.y < ptOnPlane.y && ptOnPlane.y < max.y && min.z < ptOnPlane.z && ptOnPlane.z < max.z) {
                    return true; //射线与包围盒有交点  
                }
            }
        }

        //若射线沿y轴方向有分量 判断是否与包围盒y轴方向有交点  
        if (dir.y != 0) {
            if (dir.y > 0)
                t = (min.y - origin.y) / dir.y;
            else
                t = (max.y - origin.y) / dir.y;

            if (t > 0) {
                //   ptOnPlane = origin + t * dir;
                let mul = Vector3Ext.mul_Num(dir, t);
                let rs2 = Vector3Ext.add(origin, mul);
                ptOnPlane = rs2; //计算交点坐标  

                if (min.z < ptOnPlane.z && ptOnPlane.z < max.z && min.x < ptOnPlane.x && ptOnPlane.x < max.x) {
                    return true;
                }
            }
        }

        //若射线沿z轴方向有分量 判断是否与包围盒y轴方向有交点  
        if (dir.z != 0) {
            if (dir.z > 0)
                t = (min.z - origin.z) / dir.z;
            else
                t = (max.z - origin.z) / dir.z;

            if (t > 0) {
                //ptOnPlane = origin + t * dir;
                let mul = Vector3Ext.mul_Num(dir, t);
                let rs2 = Vector3Ext.add(origin, mul);
                ptOnPlane = rs2; //计算交点坐标  
                if (min.x < ptOnPlane.x && ptOnPlane.x < max.x && min.y < ptOnPlane.y && ptOnPlane.y < max.y) {
                    return true;
                }
            }
        }

        return false;
    }
}