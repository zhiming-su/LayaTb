
// import { GlobalVariable } from "../game_module/GlobalVariable";


/**签到奖励 */
class SignModel {

    id = 0
    rewards = 0;

    /**皮肤和金币 */
    public type = '';

}

class Level {
    id = 0
    level_data = '';
    gold = 0;
}

//require_num = 需要的数量 
//require_type = 1默认拥有  2金币购买  3视频
export class Theme {
    /**类型 1默认拥有  2金币购买  3视频 */
    require_type = 0;
    /**需要的数量  */
    require_num = 0;

    name = '';

    icon = '';

}


class DataControllerExtData {
    signModel: SignModel[] = [];
    level: Level[] = [];
    theme: Theme[] = [];
}


export class DataController {


   

  

  



}