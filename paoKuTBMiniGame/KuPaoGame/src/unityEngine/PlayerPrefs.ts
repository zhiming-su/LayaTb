export default class PlayerPrefs {

    public static GetInt(key: string, defaultnum: number): number {

        return PlayerPrefs.GetValueNum(key, defaultnum);
    }

    public static SetInt(key: string, defaultnum: number) {

        PlayerPrefs.SetValueNum(key, defaultnum);
    }

    public static DeleteAll() {
        Laya.LocalStorage.clear();
    }

    private static GetValueNum(value_name: string, defaul: number): number {
        //原型方法
        var jsonData = Laya.LocalStorage.getItem(value_name);
        //oppo null key == null
        //vivo null key ==''
        if (jsonData == null || jsonData == '')
            return defaul;
        var d = Number(jsonData);
        return d;
    }


    private static SetValueNum(value: string, num: number): void {

        Laya.LocalStorage.setItem(value, num.toString());
    }



    


}