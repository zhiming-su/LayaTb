import PlayerPrefs from "../../UnityEngine/PlayerPrefs";



export default class JTools {

    public static normalizeNum(num) {
        if (num >= 0.0000000000001) return 1;

        else if (num <= -0.00000000001) return -1;

        return 0;
    }

    public static getRandomIntArry(num: number[]): number {
        let idx = JTools.getRandomInt(0, num.length - 1);

        return num[idx];
        // return Math.floor(this.rnd() * number);
    };

    public static removeArrySetSize(arr, j) {

        for (let i = j; i < arr.length - 1; i++)
            arr[i] = arr[i + 1]
        arr.pop();
    }

    public static isNull(obj: any): boolean {
        if (obj == 0 || obj == null || obj == "" || obj == undefined) {
            return true;
        }
        return false;
    }

  


 

    /**包含 max */
    public static getRandomInt(min: number, max: number): number { var Range = max - min; var Rand = Math.random(); return (min + Math.round(Rand * Range)); }

    public static getRandomIntNotInClueMax(min: number, max: number): number {
        var s = this.getRandomInt(min, max);

        if (s >= max) s -= 1;
        return s;
    }

    public static GetRanDom(min: number, max: number): number {

        return JTools.getRandomInt(min, max);
    }




    public static getRandomFloat0_1(min: number, max: number): number {
        return Math.random();
    }
    // public static RED=new Laya.Vector3(1,0,0)
    // public static White=new Laya.Vector3(1,1,1)
    // public static zero=new Laya.Vector3()




    public static GetChilds(scene: Laya.Scene3D, childName: string): Laya.Sprite3D[] {

        //  scene.getChildByName("Camera") as Laya.Camera
        var list = []
        for (let index = 0; index < scene.numChildren; index++) {
            // var element:Laya.Sprite3D = array[index];
            var child = scene.getChildAt(index);
            if (child.name == childName) list.push(child)
        }

        return list

    }



    public static GetChildsByLayerReTrunTransform(scene: Laya.Scene3D, layer: number): Laya.Transform3D[] {

        //  scene.getChildByName("Camera") as Laya.Camera
        var list = []
        for (let index = 0; index < scene.numChildren; index++) {
            // var element:Laya.Sprite3D = array[index];
            var child = scene.getChildAt(index) as Laya.Sprite3D;
            if (child.layer == layer) list.push(child.transform)
        }

        return list

    }



    public static getComponentsInChilds(owner: Laya.Node, type: any) {
        var list = []
        list = owner.getComponents(type)

        for (let index = 0; index < owner.numChildren; index++) {
            var t = this.getComponentsInChilds(owner.getChildAt(index), type)
            t.forEach(element => {
                list.push(element)
            });
        }

        return list;
    }















    public static setBitComputing(value: number, mask: number, t: boolean): number {
        if (t) {
            value |= (1 << mask);
        } else {
            value &= ~(1 << mask);
        }
        return value;
    }

    public static getBitComputing(value, mask): boolean {
        return 0 != (value & (1 << mask));
    }






}
