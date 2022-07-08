
class ChallengLevel {

    public star3_time = 0;
    public star2_time = 0;
    public star1_time = 30;
    startCreateZ = 0;
    finshEndZ = 0;
    createEndZ = -1;
    maxPoweFull = 0;

    
    tip = '';

    canJump = true;

    //左右互换
    fanzhuanyidong=false;
}

export class ChallengeMgr {

    star = 0;
    static m_instance: ChallengeMgr;
    public static get instance(): ChallengeMgr {
        if (ChallengeMgr.m_instance == null) {
            ChallengeMgr.m_instance = new ChallengeMgr();
            ChallengeMgr.m_instance.init();
        }

        return ChallengeMgr.m_instance;
    }


    public levels: ChallengLevel[] = [];

    curChallengLevel: ChallengLevel;
    //curIdx=0;
    public init() {
        let level1 = new ChallengLevel();

        level1.star3_time = 15;
        level1.star2_time = 17;
        level1.startCreateZ = 30;
        level1.finshEndZ = 200;
        level1.createEndZ = 200;
        level1.maxPoweFull = 1;
        let str = '200米能量赛\n3星: ' + level1.star3_time + '秒内通关 \n2星: ' + level1.star2_time + '秒内通关\n诀窍：多走位积累能量';
        level1.tip = str;
        this.levels.push(level1);



        level1 = new ChallengLevel();
        level1.star3_time = 13;
        level1.star2_time = 15;
        level1.startCreateZ = 30;
        level1.finshEndZ = 150;
        level1.createEndZ = 150;
        level1.maxPoweFull = 3;

        str = '150米小跳赛\n3星: ' + level1.star3_time + '秒内通关 \n2星: ' + level1.star2_time + '秒内通关';
        level1.tip = str;
        this.levels.push(level1);


        level1 = new ChallengLevel();
        level1.star3_time = 90;
        level1.star2_time = 100;
        level1.startCreateZ = 30;
        level1.finshEndZ = 150;
        level1.createEndZ = 150;
        level1.maxPoweFull = 3;
        level1.star1_time = 200;

        str = '150米滑铲赛\n3星: ' + level1.star3_time + '秒内通关 \n2星: ' + level1.star2_time + '秒内通关';
        level1.tip = str;
        this.levels.push(level1);


        level1 = new ChallengLevel();
        level1.star3_time = 13;
        level1.star2_time = 17;
        level1.startCreateZ = 30;
        level1.finshEndZ = 200;
        level1.createEndZ = 200;
        level1.maxPoweFull = 3;

        str = '200米滑铲赛\n3星: ' + level1.star3_time + '秒内通关 \n2星: ' + level1.star2_time + '秒内通关';
        level1.tip = str;
        this.levels.push(level1);


        level1 = new ChallengLevel();
        level1.star3_time = 18+1;
        level1.star2_time = 20+1;
        level1.startCreateZ = 30;
        level1.finshEndZ = 250;
        level1.createEndZ=200
        level1.maxPoweFull = 2.5;

        str = '200米跨栏赛\n3星: ' + level1.star3_time + '秒内通关 \n2星: ' + level1.star2_time + '秒内通关';
        level1.tip = str;
        this.levels.push(level1);


        level1 = new ChallengLevel();
        level1.star3_time = 18;
        level1.star2_time = 20;
        level1.startCreateZ = 30;
        level1.finshEndZ = 250;
        level1.createEndZ=200
        level1.maxPoweFull = 4;

        str = '200米蛇形跨栏赛\n3星: ' + level1.star3_time + '秒内通关 \n2星: ' + level1.star2_time + '秒内通关';
        level1.tip = str;
        this.levels.push(level1);

        level1 = new ChallengLevel();
        level1.star3_time = 18;
        level1.star2_time = 20;
        level1.startCreateZ = 30;
        level1.finshEndZ = 250;
        level1.createEndZ=200
        level1.maxPoweFull = 3.8;

        str = '究极200米蛇形跨栏赛\n3星: ' + level1.star3_time + '秒内通关 \n2星: ' + level1.star2_time + '秒内通关';
        level1.tip = str;
        this.levels.push(level1);


        level1 = new ChallengLevel();
        level1.star3_time = 19;
        level1.star2_time = 22;
        level1.startCreateZ = 30;
        level1.finshEndZ = 250;
        level1.createEndZ=200
        level1.maxPoweFull = 6.5;
        level1.canJump=false;

        str = '200米蛇形走位赛\n3星: ' + level1.star3_time + '秒内通关 \n2星: ' + level1.star2_time + '秒内通关 \n规则:禁止跳跃';
        level1.tip = str;
        this.levels.push(level1);


        level1 = new ChallengLevel();
        level1.star3_time = 19;
        level1.star2_time = 22;
        level1.startCreateZ = 30;
        level1.finshEndZ = 250;
        level1.createEndZ=200
        level1.maxPoweFull = 5;
        level1.canJump=false;
        level1.fanzhuanyidong=true;
        str = '究极200米蛇形走位赛\n3星: ' + level1.star3_time + '秒内通关 \n2星: ' + level1.star2_time + '秒内通关 \n规则:禁止跳跃&反向操作';
        level1.tip = str;
        this.levels.push(level1);

    }


}