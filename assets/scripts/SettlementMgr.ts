const {ccclass, property} = cc._decorator;
let record = null;

@ccclass
export default class NewClass extends cc.Component {

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
    if (record.gameMode === 'chaseMode') { // 追逐
      this.survivingTime.active = true;
      this.survivingTimeLabel.string = record.survivingTime;
    }
    if (record.gameMode === 'escapeMode') { // 逃亡
      this.winType.active = true;
      this.winTypeLabel.string = record.winType;
    }
  }

  start () {
    this.saveUserRecord();
    setTimeout(() => {
      cc.director.loadScene("main");
    }, 5000);
  }

  saveUserRecord() {
    const playersInfo = `/players/playerInfo-${record.userId}`;
    firebase.database().ref(playersInfo).once("value", snapshot => {
      const info = {
        level: record.level,
        gameNum: record.gameNum + 1,
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
        4 : record.userAchievement[4],
        5 : record.userAchievement[5],
        6 : record.userAchievement[6],
        7 : record.userAchievement[7],
        8 : record.userAchievement[8],
        9 : record.userAchievement[9],
        10 : record.userAchievement[10],
        11 : record.userAchievement[11],
        12 : record.userAchievement[12],
        13 : record.userAchievement[13],
        14 : record.userAchievement[14],
        15 : record.userAchievement[15],
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

  // update (dt) {}
}
