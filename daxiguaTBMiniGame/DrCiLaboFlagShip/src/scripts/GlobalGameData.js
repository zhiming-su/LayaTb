

export default class GlobalGameData {
    constructor(data) {
        if (typeof GlobalGameData.instance === 'object') {
            return GlobalGameData.instance;
        }
        GlobalGameData.instance = this;
        this.isNewPlayer = data.isNewPlayer;
        this.scoreName = data.scoreName;
        this.maxLevelPrizeName = data.maxlevelPrizeName;
    }
}