
export class FunCallBackItem {
    public callder: any;
    public func: Function;
}

export default class SystemAcion {

    funcs: FunCallBackItem[] = [];
    hastregiser = false;
    public regiser(callder, func: Function) {

        this.hastregiser = true;
        let t = new FunCallBackItem();
        t.callder = callder;
        t.func = func;
        this.funcs.push(t);
    }

    public Invoke() {

        for (const iterator of this.funcs) {
            iterator.func.apply(iterator.callder);
        }
    }

    public Invoke_par(argarry: any) {

        for (const iterator of this.funcs) {
            // iterator.func.apply(iterator.callder,iterator.func,argarry);
          //  iterator.func.apply(iterator.callder, argarry);
          //SystemAcion.callMethod(argarry,iterator.callder,iterator.func);
            //iterator.func.call(argarry);
            iterator.func.call(iterator.callder,argarry);
        }
    }

    public static callMethod(arg,caller:any,method:Function):void
    {
        //返回 2 x arg
       // let result:number=arg*2;
        //推荐的做法 .call(caller,result);
        method.call(caller,arg);
       
    }


}


