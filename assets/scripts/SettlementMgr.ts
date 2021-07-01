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

  @property(cc.Node)
  drawanimation: cc.Node = null;

  @property(cc.Node)
  loseanimation: cc.Node = null;

  @property(cc.Node)
  ach: cc.Node = null;

  @property(cc.SpriteFrame)
  goldS: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  silverS: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  bronzeS: cc.SpriteFrame = null;
  // LIFE-CYCLE CALLBACKS:

  private updateList: any = null;

  onLoad() {
    record = cc.find("record").getComponent("record");

    let e = this
    this.winner.string = record.winner;
    this.getCoin.string = record.getCoin;
    this.getExperience.string = record.getExperience;

    if (!record.hasPlayer2) {
      e.winloseanimation.getChildByName('losehead').active = false;
    }
    if (record.winner == 'player1') {
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
      cc.find(`Canvas/Result/result`).getComponent(cc.Label).string = 'win';
      e.drawanimation.active = false;
      e.loseanimation.active = false;
      e.winloseanimation.active = true;
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
      cc.find(`Canvas/Result/result`).getComponent(cc.Label).string = 'win';
      e.drawanimation.active = false;
      e.loseanimation.active = false;
      e.winloseanimation.active = true;
    } else if (record.winner == 'player1 player2') {// draw
      this.winner.string = ''
      cc.find(`Canvas/Result/result`).getComponent(cc.Label).string = 'draw';
      cc.loader.loadRes('character sprites/' + skin_list[record.player1Skin] + '/' + record.player1Color + '/heads/head-2', cc.SpriteFrame, function (err, spriteFrame) {
        if (err) {
          cc.log(err);
          return;
        }
        e.drawanimation.getChildByName('winhead').getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      cc.loader.loadRes('character sprites/' + skin_list[record.player2Skin] + '/' + record.player2Color + '/heads/head-2', cc.SpriteFrame, function (err, spriteFrame) {
        if (err) {
          cc.log(err);
          return;
        }

        e.drawanimation.getChildByName('winhead2').getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      e.loseanimation.active = false;
      e.drawanimation.active = true;
      e.winloseanimation.active = false;
    } else if (record.winner == '') {
      cc.loader.loadRes('character sprites/' + skin_list[record.player1Skin] + '/' + record.player1Color + '/heads/head-2', cc.SpriteFrame, function (err, spriteFrame) {
        if (err) {
          cc.log(err);
          return;
        }
        e.loseanimation.getChildByName('winhead').getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      cc.find(`Canvas/Result/result`).getComponent(cc.Label).string = 'lose';
      this.winner.string = 'player1'
      e.loseanimation.active = true;
      e.drawanimation.active = false;
      e.winloseanimation.active = false;
    }


    if (record.gameMode === 'escapeMode') { // 逃亡
      this.survivingTime.active = true;
      this.survivingTimeLabel.string = record.survivingTime;
    }
    if (record.gameMode === 'chaseMode') { // 追逐
      this.winType.active = true;
      if (record.winType == 'catched') {
        this.winTypeLabel.string = '捉住';
      } else if (record.winType == 'suicide') {
        this.winTypeLabel.string = '自爆';
      } else if (record.winType == 'time') {
        this.winTypeLabel.string = '時間';
      } else if (record.winType == 'collect') {
        this.winTypeLabel.string = '收集';
      }
    }
    this.startUpdate = false;
    this.updateList = record.updateAchievementList;
    cc.log(this.updateList);
    //this.updateList = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];


  }

  private achs = ['遊戲次數', '造型數量', '累積金幣', '最高獲得金幣', '屍體數', '自殺次數', '放置炸彈總數', '撿取道具數', '逃亡模式次數', '堅持時間', '最快跑速', '最多炸彈數量', '最快死亡', '最快殺人', '最快搜集', '最多暈眩'];
  private startUpdate = false;
  private achFrameCount = 0;
  private currAch = 0;
  update(dt) {
    let lbl = this.ach.getChildByName('l').getComponent(cc.Label);
    if (this.startUpdate) {
      if (this.currAch === 16) {
        this.startUpdate = false;
        this.ach.active = false;
      }
      if (this.updateList[this.currAch] !== 0 && this.currAch < 16) {
        cc.log('check');
        let medal = this.ach.getChildByName('m').getComponent(cc.Sprite);
        if (this.updateList[this.currAch] == 1) {
          medal.spriteFrame = this.bronzeS;
        }
        if (this.updateList[this.currAch] == 2) {
          medal.spriteFrame = this.silverS;
        }
        if (this.updateList[this.currAch] == 3) {
          medal.spriteFrame = this.goldS;
        }
        lbl.string = this.achs[this.currAch];
        this.achFrameCount++
        this.ach.opacity = 300 - this.achFrameCount * 3.1;
        if (this.achFrameCount == 100) {
          this.achFrameCount = 0;
          this.currAch++;
        }
      } else {
        this.currAch++;
      }
    } else {
      this.ach.opacity = 0;
      this.achFrameCount++;
      if (this.achFrameCount == 3850) {
        this.startUpdate = true;
        this.achFrameCount = 0;
      }
    }
  }

  start() {
    if (record.gameMode === 'basicMode' || record.gameMode === 'escapeMode') {
      cc.log(record.winner);
      if (record.winner === 'player1 player2') {
        this.playDrawAnimation();
      } else {
        this.playWinAnimation();
      }
      if (record.winner === '') {
        this.playLoseAnimation()
      }
    }
    if (record.gameMode === 'chaseMode') {
      this.playWinAnimation();
    }

    this.saveUserRecord();
    this.startUpdate = true;
  }

  playWinAnimation() {
    let wheel = this.winloseanimation.getChildByName('rotate')
    let o = cc.rotateBy(5, 360 * 1.5);
    wheel.runAction(o);
    let e = this
    this.getComponent(cc.Canvas).scheduleOnce(function () {
      let action = cc.hide();
      e.winloseanimation.runAction(action)
    }, 1)
  }

  playLoseAnimation() {
    let e = this
    this.getComponent(cc.Canvas).scheduleOnce(function () {
      let action = cc.hide();
      e.loseanimation.runAction(action)
    }, 1)
  }

  playDrawAnimation() {
    let e = this
    this.getComponent(cc.Canvas).scheduleOnce(function () {
      let action = cc.hide();
      e.drawanimation.runAction(action)
    }, 1)
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

      this.clearRecord();
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

  clearRecord() {
    record.result = '';
    record.winner = '';
    record.getCoin = 0;
    record.getExperience = 0;
    record.survivingTime = '';
    record.winType = 0;
  }

  // update (dt) {}
}
