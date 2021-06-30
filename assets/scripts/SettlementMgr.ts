const { ccclass, property } = cc._decorator;
let record = null;
const skin_list = ["normal", "boxer", "brucelee", "bullman", "caveman", "ebifry", "egypt", "mexican", "ninja", "pirate", "russian"];

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

  @property(cc.Node)
  winloseanimation: cc.Node = null;
  // LIFE-CYCLE CALLBACKS:

  public winHead: any = null;
  public loseHead: any = null;

  onLoad() {
    record = cc.find("record").getComponent("record");

    if (record.winner == 'Player1') {
      cc.loader.loadRes('character sprites/' + skin_list[record.player1Skin] + '/' + record.player1Color + '/head/head-2', cc.SpriteFrame, function (err, spriteFrame) {
        if (err) {
          cc.log(err);
          return;
        }
        this.winloseanimation.getChildByName('winHead').getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      cc.loader.loadRes('character sprites/' + skin_list[record.player2Skin] + '/' + record.player2Color + '/head/head-2', cc.SpriteFrame, function (err, spriteFrame) {
        if (err) {
          cc.log(err);
          return;
        }
        this.winloseanimation.getChildByName('loseHead').getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
    } else if (record.winner == 'Player2') {
      cc.loader.loadRes('character sprites/' + skin_list[record.player1Skin] + '/' + record.player1Color + '/head/head-2', cc.SpriteFrame, function (err, spriteFrame) {
        if (err) {
          cc.log(err);
          return;
        }
        this.winloseanimation.getChildByName('loseHead').getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      cc.loader.loadRes('character sprites/' + skin_list[record.player2Skin] + '/' + record.player2Color + '/head/head-2', cc.SpriteFrame, function (err, spriteFrame) {
        if (err) {
          cc.log(err);
          return;
        }
        this.winloseanimation.getChildByName('winHead').getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
    }

    this.winner.string = record.winner;
    this.getCoin.string = record.getCoin;
    this.getExperience.string = record.getExperience;
    if (record.gameMode === 'chaseMode') { // 追逐
      this.winType.active = true;
      this.winTypeLabel.string = record.winType;
    }
    if (record.gameMode === 'escapeMode') { // 逃亡
      this.survivingTime.active = true;
      this.survivingTimeLabel.string = record.survivingTime;
    }
  }

  start() {
    this.saveUserRecord();
  }

  playAnimation() {
    let wheel = this.winloseanimation.getChildByName('rotate')
    let o = cc.rotateBy(10, 360 * 5);
    wheel.runAction(o);
    let e = this
    this.getComponent(cc.Canvas).scheduleOnce(function () {
      e.winloseanimation.active = false;
    }, 5)
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
        0: record.userAchievement[0] + 1,
        1: record.userSkinCategory.length,
        2: Number(record.userAchievement[2]) + Number(record.getCoin),
        3: this.checkCoinRecord(),
        4: record.userAchievement[4],
        5: record.userAchievement[5],
        6: record.userAchievement[6],
        7: record.userAchievement[7],
        8: record.userAchievement[8],
        9: record.userAchievement[9],
        10: record.userAchievement[10],
        11: record.userAchievement[11],
        12: record.userAchievement[12],
        13: record.userAchievement[13],
        14: record.userAchievement[14],
        15: record.userAchievement[15],
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
