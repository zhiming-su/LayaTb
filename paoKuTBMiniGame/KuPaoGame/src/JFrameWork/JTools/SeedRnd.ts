/*
 * @Date: 2021-06-15 10:27:15
 * @Author: xlc
 * @LastEditors: xlc
 * @LastEditTime: 2021-06-22 10:35:57
 * @description: 
 */
import JieTools from "./JTools";

export default class SeedRnd {


    constructor(p_seed:number) {

        this.seed=p_seed;
     }

    seed=1;

    private rnd():number {
        this.seed = ( this.seed * 9301 + 49297) % 233280; //为何使用这三个数?
        return this.seed/233280.0;
       // return  this.seed;
    };
     // getRandomInt(min: number, max: number,Rand): number { 
     //   var Range = max - min; 
       
     //   return (min + Math.round(Rand * Range)); 
  //  }

    public getRandomInt(min,max):number {
        let range = max - min
        return (min + Math.round(this.rnd() * range))
       // return Math.floor(this.rnd() * number);
    };
    //include
    public getRandomInt_NotIncludeMax(min,max):number {
        return this.getRandomInt(min,max-1);
       // return Math.floor(this.rnd() * number);
    };

   


    public getRandomIntArry(num:number[]):number {
        let idx=this.getRandomInt(0,num.length-1);

        return num[idx];
       // return Math.floor(this.rnd() * number);
    };
}