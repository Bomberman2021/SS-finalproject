const {ccclass, property} = cc._decorator;
let record = null;

@ccclass
export default class SettlementMgr extends cc.Component {

  @property(cc.Label)
  winner: cc.Label = null;

  @property(cc.Label)
  getCoin: cc.Label = null;

  @property(cc.Label)
  getExperience: cc.Label = null;
  
  @property(cc.Node)
  winType: cc.Node = null;

  @property(cc.Label)
  winTypeLabel: cc.Label = null;

  @property(cc.Node)
  survivingTime: cc.Node = null;

  @property(cc.Label)
  survivingTimeLabel: cc.Label = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    record = cc.find("record").getComponent("record");  

    this.winner.string = record.winner;
    this.getCoin.string = record.getCoin;
    this.getExperience.string = record.getExperience;
    
    if (record.gameMode === 'escapeMode') { // 逃亡
      this.survivingTime.active = true;
      this.survivingTimeLabel.string = record.survivingTime;
    }
    if (record.gameMode === 'chaseMode') { // 追逐
      this.winType.active = true;
      this.winTypeLabel.string = record.winType;
    }

    cc.find(`Canvas/Result/result`).getComponent(cc.Label).string = record.result;
  }

  start () {
    this.saveUserRecord();
  }

  saveUserRecord() {
    record.coin += record.getCoin;
    record.experience += record.getExperience;
    this.checklevelUp();

    console.log('coin:', record.coin);
    console.log('level:', record.level);
    console.log('experience:', record.experience);
    

    const playersInfo = `/players/playerInfo-${record.userId}`;
    firebase.database().ref(playersInfo).once("value", snapshot => {
      const info = {
        gameNum: record.gameNum + 1, // 三種game合在一起
        coin: record.coin,
        level: record.level,
        experience: record.experience,
      }
      firebase.database().ref(playersInfo).update(info);
    });

    const userAchievement = `/players/playerInfo-${record.userId}/userAchievement`;
    firebase.database().ref(userAchievement).once("value", snapshot => {
      const achievement = {
        0 : record.userAchievement[0] + 1,
        1 : record.userSkinCategory.length,
        2 : Number(record.userAchievement[2]) + Number(record.getCoin),
        3 : this.checkCoinRecord(),
        4 : Number(record.userAchievement[4]),
        5 : Number(record.userAchievement[5]),
        6 : Number(record.userAchievement[6]),
        7 : Number(record.userAchievement[7]),
        8 : Number(record.userAchievement[8]),
        9 : Number(record.userAchievement[9]),
        10 : Number(record.userAchievement[10]),
        11 : Number(record.userAchievement[11]),
        12 : Number(record.userAchievement[12]),
        13 : Number(record.userAchievement[13]),
        14 : Number(record.userAchievement[14]),
        15 : Number(record.userAchievement[15]),
      }
      firebase.database().ref(userAchievement).update(achievement);
    });
  }

  checkCoinRecord() { 
    if (record.userAchievement[3] > record.getCoin) {
      return record.userAchievement[3];
    } else {
      return record.getCoin
    }
  }

  checklevelUp(){
    if (record.experience >= 1000) {
      record.level += 1;
      record.experience -= 1000;
    }
  }

  // update (dt) {}
}
