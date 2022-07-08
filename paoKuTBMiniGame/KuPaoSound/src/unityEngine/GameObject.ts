
export default class GameObject {

    node: Laya.Node;
    sprite3d: Laya.Sprite3D;
    public constructor(node: Laya.Node) {
        this.node = node;
        this.sprite3d = node as Laya.Sprite3D;
    }


  

    public static getFullPath(obj: Laya.Node): string {
        if (obj == null) {
            console.error("You must select Obj first!");
            return;
        }


        let path = [];
        path.push(obj.name);
        let selectChild = obj;
        if (selectChild != null) {
            //let result = selectChild.name;
            while (selectChild.parent != null) {
                selectChild = selectChild.parent;
                path.push(selectChild.name);
            }
        }


        let rs = '';



        for (let index = path.length - 1; index >= 0; index--) {
            rs += path[index] + '/';

        }
        console.log(rs);


    }




    public static GetChilds(node: Laya.Node, childName: string): Laya.Sprite3D[] {

        //  scene.getChildByName("Camera") as Laya.Camera
        let list: Laya.Sprite3D[] = [];
        for (let index = 0; index < node.numChildren; index++) {

            // var element:Laya.Sprite3D = array[index];
            let child = node.getChildAt(index) as Laya.Sprite3D;
            if (child.name == childName) list.push(child)
        }

        return list;

    }


    public static GetChildsByDeth(node: Laya.Node, childName: string): Laya.Sprite3D[] {

        //  scene.getChildByName("Camera") as Laya.Camera
        let list: Laya.Sprite3D[] = GameObject.getAllChilds(node);
        let filerList = [];
        for (let index = 0; index < list.length; index++) {

            // var element:Laya.Sprite3D = array[index];
            let child = list[index];
            if (child.name == childName) filerList.push(child)
        }

        return filerList;

    }


 


    public static Find<T extends Laya.Node>(node: Laya.Node, name: string): T {

        var depth = name.split('/')
        // var Scene = ResourcesMgr.Instance.Scene;
        var gob = node.getChildByName(depth[0])
        // for (const iterator of depth) {
        //    gob=gob.getChildByName(iterator)
        // }

        for (let index = 1; index < depth.length; index++) {
            // const element = array[index];
            gob = gob.getChildByName(depth[index]);

            //  if (logGob==null) 
            // console.error('Not Child '+depth[index]);

            //  gob=logGob;
        }
        return gob as T;
    }


    public static FindChilds(name: string, node: Laya.Sprite3D): Laya.Sprite3D[] {

        let list = [];
        for (let index = 0; index < node.numChildren; index++) {
            let c = node.getChildAt(index);
            if (name == c.name)
                list.push(c);
        }

        return list;

        //  return gob as Laya.Sprite3D;
    }




    public static Instantiate(go: GameObject): Laya.Sprite3D {

        var newGo = Laya.Sprite3D.instantiate(go.sprite3d);



        return newGo;
    }

    public Clone_sprite3d() {
        return Laya.Sprite3D.instantiate(this.sprite3d);
    }


    public static Instantiate2Scene(go: Laya.Sprite3D, node): Laya.Sprite3D {

        var newGo = Laya.Sprite3D.instantiate(go);

        node.addChild(newGo);

        return newGo;
    }

    public static Instantiate2Scene_Particle3d(go: Laya.ShuriKenParticle3D, node): Laya.ShuriKenParticle3D {

        var newGo = go.clone();

        node.addChild(newGo);

        return newGo as Laya.ShuriKenParticle3D;
    }

    public static Instantiate2SceneUseScene(go: Laya.Sprite3D, Scene): Laya.Sprite3D {

        var newGo = Laya.Sprite3D.instantiate(go);

        Scene.addChild(newGo);

        return newGo;
    }

    public static InstantiateGob(go: Laya.Sprite3D): Laya.Sprite3D {

        if (go == null) return null;
        var newGo = Laya.Sprite3D.instantiate(go);

        // ResourcesMgr.Instance.Scene.addChild(newGo);

        return newGo;
    }

    public static Add2Scene(go: any, node) {
        node.addChild(go);
    }

    public static InstantiateNoScene(go: Laya.Sprite3D): Laya.Sprite3D {

        var newGo = Laya.Sprite3D.instantiate(go);

        // ResourcesMgr.Instance.Scene.addChild(newGo);

        return newGo
    }


    public static GetTypeInChildren(t, _class) {

        for (const iterator of t._children) {
            // var type=instanceof(t)
            // (t) instanceof Laya.Box
            if ((iterator) instanceof _class) return iterator
        }

        return null;
    }

    public static GetTypesInChildren(t, _class): any[] {
        var list: any[] = []
        for (const iterator of t._children) {
            // var type=instanceof(t)
            // (t) instanceof Laya.Box
            if ((iterator) instanceof _class)
                list.push(iterator)
        }

        return list;
    }


    public static FindUseNode(name: string, node: Laya.Node): Laya.Node {


        let depth = name.split('/')
        //  console.log(name);
        if (depth == null || depth.length == 0) {
            return node.getChildByName(name);
        }
        let gob = node.getChildByName(depth[0])
        // for (const iterator of depth) {
        //    gob=gob.getChildByName(iterator)
        // }

        for (let index = 1; index < depth.length; index++) {
            // const element = array[index];
            gob = gob.getChildByName(depth[index]);

            //  if (logGob==null) 
            // console.error('Not Child '+depth[index]);

            //  gob=logGob;
        }
        return gob;
    }

    public static FindUseNodeNoDeth(name: string, node: Laya.Node): Laya.Node {



        var gob = node.getChildByName(name)


        return gob;
    }

    public static FindChildAtUseNode(idx: number, node: Laya.Node): Laya.Sprite3D {


        let gob = node.getChildAt(idx);
        return gob as Laya.Sprite3D;
    }


    public static getChildAttUseNode(idx: number, node: Laya.Node) {
        let gob = node.getChildAt(idx);
        return gob as Laya.Sprite3D;
    }


    /**和U3D一样 */
    public static GetComponentsInChildren(t: Laya.Node, _class): any[] {

        if (t == null) return null;
        var allchilds = GameObject.getChildsDeth(t);

        var list: any[] = []
        for (const iterator of allchilds) {
            // var type=instanceof(t)
            // (t) instanceof Laya.Box
            if ((iterator) instanceof _class)
                list.push(iterator)
        }

        return list;
    }

    public static GetComponentsInChildrenU3d(t: Laya.Node, _class: typeof Laya.Component): any[] {


        if (t == null) return null;
        var allchilds = GameObject.getChildsDeth(t);

        var list: any[] = []
        for (const iterator of allchilds) {
            // var type=instanceof(t)
            // (t) instanceof Laya.Box
            let com = iterator.getComponent(_class);
            if (com != null)
                list.push(com)
        }

        return list;
    }


    public static FindChilds_deth(node: Laya.Node, name: string): Laya.Node[] {

        if (node == null) return null;
        var allchilds = GameObject.getChildsDeth(node);

        var list: any[] = []
        for (const iterator of allchilds) {

            let isok = iterator.name == name;
            if (isok)
                list.push(iterator)
        }
        return list;
    }

    public static getAllChilds(owner: Laya.Node) {

        var list = []
        //  list=owner._children
        // owner.numChildren
        var _children = []
        for (let index = 0; index < owner.numChildren; index++) {
            _children.push(owner.getChildAt(index))
        }


        for (const iterator of _children) {
            list.push(iterator)
        }


        for (let index = 0; index < _children.length; index++) {
            var t = this.getAllChilds(_children[index])

            for (const iterator of t) {
                list.push(iterator)
            }
            //   t.forEach(element => {
            //     list.push(element)
            //   });
        }

        return list;
    }

    /**深度递归获取所有子节点 */
    public static getChildsByNameDeth(owner: Laya.Node, name: string) {

        var list = [];

        var arr = GameObject.getAllChilds(owner);

        for (const iterator of arr) {
            if (iterator.name == name)
                list.push(iterator);
        }
        return list;
    }


    /**深度递归获取所有子节点 */
    public static getChildsDeth(owner: Laya.Node) {

        var list = [];

        var arr = GameObject.getAllChilds(owner);

        for (const iterator of arr) {

            list.push(iterator);
        }
        return list;
    }

}



