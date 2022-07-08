/*
 * @Date: 2021-05-18 14:46:57
 * @Author: xulinchao
 * @LastEditors: xlc
 * @LastEditTime: 2021-07-01 19:26:52
 * @description: 
 */
export default class MathUtli{
    
    //弧度转角度
    public static radianToDegree(radian):number{
        return (180 * radian)/Math.PI
    }
    //角度转弧度
    public static degreeToRadian(angle):number{
        return (angle * Math.PI)/180
    }

    /**
     * 区间随机整数
     * @param min 
     * @param max 
     */
    public static randomInt(min: number, max: number): number {
        var d = max - min + 1;
        return Math.floor(min + Math.random() * d);
    }

    /**
     *  深拷贝
     * @param source 
     * @returns 
     */
    public static deepCopy(source: Object): any 
    {
        if(null == source || {} == source || [] == source)
        {
            return source;
        }
        let newObject : any;
        let isArray = false;
        if((source as any).length)
        {
            newObject = [];
            isArray = true;
        }
        else
        {
            newObject = {};
            isArray = false;
        }
        
	    for (let key of Object.keys(source))
	    {
	        if(null == source[key])
	        {
	            newObject[key] = source[key];
	        }
	        else
	        {
	            let sub = (typeof source[key] == 'object') ? this.deepCopy(source[key]) : source[key];
	            if(isArray)
	            {
	                newObject.push(sub);
	            }
	            else
	            {
	                newObject[key] = sub;
	            }
	        }
	    }
	    return newObject;
    }
}