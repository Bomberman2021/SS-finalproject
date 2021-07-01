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

  onLoad() {
    record = cc.find("record").getComponent("record");
    cc.log(record.winner)
    let e = this
    if (!record.hasPlayer2) {
      e.winloseanimation.getChildByName('losehead').active = false;
      cc.log('falsed')
    }
    if (record.winner == 'Player1') {
      cc.loader.loadRes('character sprites/' + skin_list[record.player1Skin] + '/' + record.player1Color + '/heads/head-2', cc.SpriteFrame, function (err, spriteFrame) {
        if (err) {
          cc.log(err);
          return;
        }
        e.winloseanimation.getChildByName('winhead').getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      cc.loader.loadRes('character sprites/' + skin_list[record.player2Skin] + '/' + record.player2Color + '/heads/head-2', cc.SpriteFrame, function (err, spriteFrame) {
        if (err) {
          cc.log(err);
          return;
        }
        e.winloseanimation.getChildByName('losehead').getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
    } else if (record.winner == 'player2') {
      cc.loader.loadRes('character sprites/' + skin_list[record.player1Skin] + '/' + record.player1Color + '/heads/head-2', cc.SpriteFrame, function (err, spriteFrame) {
        if (err) {
          cc.log(err);
          return;
        }

        e.winloseanimation.getChildByName('losehead').getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      cc.loader.loadRes('character sprites/' + skin_list[record.player2Skin] + '/' + record.player2Color + '/heads/head-2', cc.SpriteFrame, function (err, spriteFrame) {
        if (err) {
          cc.log(err);
          return;
        }

        e.winloseanimation.getChildByName('winhead').getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
    }

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

  start() {
    this.playWinAnimation();
    this.saveUserRecord();
  }

  playWinAnimation() {
    let wheel = this.winloseanimation.getChildByName('rotate')
    let o = cc.rotateBy(5, 360 * 1.5);
    wheel.runAction(o);
    let e = this
    this.getComponent(cc.Canvas).scheduleOnce(function () {
      let action = cc.hide();
      e.winloseanimation.runAction(action)
    }, 3)
  }

  playLoseAnimation() {

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
        0: record.userAchievement[0] + 1,
        1: record.userSkinCategory.length,
        2: Number(record.userAchievement[2]) + Number(record.getCoin),
        3: this.checkCoinRecord(),
        4: Number(record.userAchievement[4]),
        5: Number(record.userAchievement[5]),
        6: Number(record.userAchievement[6]),
        7: Number(record.userAchievement[7]),
        8: Number(record.userAchievement[8]),
        9: Number(record.userAchievement[9]),
        10: Number(record.userAchievement[10]),
        11: Number(record.userAchievement[11]),
        12: Number(record.userAchievement[12]),
        13: Number(record.userAchievement[13]),
        14: Number(record.userAchievement[14]),
        15: Number(record.userAchievement[15]),
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

  checklevelUp() {
    if (record.experience >= 1000) {
      record.level += 1;
      record.experience -= 1000;
    }
  }

  // update (dt) {}
}
