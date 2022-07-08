import GameObject from "./GameObject";

export default class MonoBehaviour extends Laya.Script {

    

    public transform: Laya.Transform3D;
    public gameObject: Laya.Sprite3D;

    onAwake() {
        this.gameObject = this.owner as Laya.Sprite3D;
        this.transform = this.gameObject.transform;
    }


    public Find(path){
       return GameObject.Find(this.gameObject,path)
    }


    public GetComponentsInChildren(componentType: typeof Laya.Component): Laya.Component[] {
        return GameObject.GetComponentsInChildrenU3d(this.gameObject, componentType);
    }



} 