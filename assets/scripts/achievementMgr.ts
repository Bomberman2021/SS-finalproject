const { ccclass, property } = cc._decorator;
let record = null;

@ccclass
export default class achievementMgr extends cc.Component {

  @property(cc.Node)
  achievements: cc.Node[] = [];

  @property(cc.SpriteFrame)
  firstPic: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  secondPic: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  thirdPic: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  gold: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  silver: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  bronze: cc.SpriteFrame = null;

  public userAchievement: string[] = []; // 全16個項目

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    record = cc.find("record").getComponent("record");
  }
  
  start () {
    this.display();
  }

  display() {
    // General：20以上 金牌 (如遊戲次數) 0-5-10-20
    // speed：260以上 金牌 (跑速) 0-150-200-250
    // longTime：60以上 金牌 (堅持時間) 0-10-60-100
    // getDouble：60以上 金牌 0-20-40-60
    // shortTime：7以下 金牌 無限-60-20-7
    // mostLevel：12以上 金牌 0-3-7-12
    // dizzyLevel：10以上 金牌 0-3-5-10

    this.userAchievement[0] = this.setGeneralLevel(record.userAchievement[0]); // "基本"遊戲次數
    
    this.userAchievement[1] = `${record.userSkinCategory.length}個`; // 造型數量
    this.userAchievement[2] = `${record.userAchievement[2]}元`; // 生涯累積金幣數量
    this.userAchievement[3] = `${record.userAchievement[3]}元`; // 最高一場遊戲中獲得金幣數
    
    this.userAchievement[4] = this.getDoubleLevel(record.userAchievement[4]); // 屍體數
    this.userAchievement[5] = this.getDoubleLevel(record.userAchievement[5]); // 自殺數量
    this.userAchievement[6] = this.getDoubleLevel(record.userAchievement[6]);  // 放置炸彈數量（總數）
    this.userAchievement[7] = this.getDoubleLevel(record.userAchievement[7]); // 撿取道具數量

    this.userAchievement[8] = this.setGeneralLevel(record.userAchievement[8]); // "逃亡"遊戲次數
    this.userAchievement[9] = this.longTimeLevel(record.userAchievement[9]); // 堅持時間
    this.userAchievement[10] = this.speedLevel(record.userAchievement[10]); // 最快跑速
    this.userAchievement[11] = this.mostLevel(record.userAchievement[11]); // 同時最多炸彈數量
    this.userAchievement[12] = this.shortTimeLevel(record.userAchievement[12]); // 最快死亡
    
    this.userAchievement[13] = this.shortTimeLevel(record.userAchievement[13]); // 最快殺人
    this.userAchievement[14] = this.shortTimeLevel(record.userAchievement[14]); // 最快搜集
    this.userAchievement[15] = this.dizzyLevel(record.userAchievement[15]); // 最多暈眩

    this.linkLabelString();
  }



  linkLabelString() {
    for (let key = 0; key < this.userAchievement.length; key += 1) {
      if (Number(this.achievements[key].name) === key) {
        cc.find(`Canvas/Achievements/${this.achievements[key].name}/medal`).active = false;

        if (this.userAchievement[key] === '銅') {
          cc.find(`Canvas/Achievements/${this.achievements[key].name}/Picture`).getComponent(cc.Sprite).spriteFrame = this.thirdPic;
          cc.find(`Canvas/Achievements/${this.achievements[key].name}/medal`).getComponent(cc.Sprite).spriteFrame = this.bronze;
          cc.find(`Canvas/Achievements/${this.achievements[key].name}/medal`).active = true;
        }
        if (this.userAchievement[key] === '銀') {
          cc.find(`Canvas/Achievements/${this.achievements[key].name}/Picture`).getComponent(cc.Sprite).spriteFrame = this.secondPic;
          cc.find(`Canvas/Achievements/${this.achievements[key].name}/medal`).getComponent(cc.Sprite).spriteFrame = this.silver;
          cc.find(`Canvas/Achievements/${this.achievements[key].name}/medal`).active = true;

        }
        if (this.userAchievement[key] === '金') {
          cc.find(`Canvas/Achievements/${this.achievements[key].name}/Picture`).getComponent(cc.Sprite).spriteFrame = this.firstPic;
          cc.find(`Canvas/Achievements/${this.achievements[key].name}/medal`).getComponent(cc.Sprite).spriteFrame = this.gold;
          cc.find(`Canvas/Achievements/${this.achievements[key].name}/medal`).active = true;

        }
        this.achievements[key].getComponent(cc.Label).string = this.userAchievement[key];
        this.achievements[key].getComponent(cc.Label).string = this.userAchievement[key];
        console.log(`${key}: ${this.userAchievement[key]}(${record.userAchievement[key]})`);
      }
    }
  }

  setGeneralLevel(number) {
    if (number<5) {
      return '尚未達標';
    }
    if (number>=5 && number<10) {
      return '銅';
    }
    if (number>=10 && number< 20) {
      return '銀';
    }
    if (number>=20) {
      return '金';
    }
  }

  speedLevel(number) {
    if (number<150) {
      return '尚未達標';
    }
    if (number>=150 && number<200) {
      return '銅';
    }
    if (number>=200 && number< 250) {
      return '銀';
    }
    if (number>=250) {
      return '金';
    }
  }

  mostLevel(number) {
    if (number<3) {
      return '尚未達標';
    }
    if (number>=3 && number<7) {
      return '銅';
    }
    if (number>=7 && number< 12) {
      return '銀';
    }
    if (number>=12) {
      return '金';
    }
  }

  longTimeLevel(number) {
    if (number<10) {
      return '尚未達標';
    }
    if (number>=10 && number<60) {
      return '銅';
    }
    if (number>=60 && number< 100) {
      return '銀';
    }
    if (number >= 100) {
      return '金';
    }
  }

  shortTimeLevel(number) {
    if (number === 0) {
      return '尚未達標';
    }
    if (number>60) {
      return '尚未達標';
    }
    if (number>=60 && number<20) {
      return '銅';
    }
    if (number>=20 && number< 7) {
      return '銀';
    }
    if (number >= 7) {
      return '金';
    }
  }

  getDoubleLevel(number) {
    if (number<20) {
      return '尚未達標';
    }
    if (number>=20 && number<40) {
      return '銅';
    }
    if (number>=40 && number< 60) {
      return '銀';
    }
    if (number >= 60) {
      return '金';
    }
  }

  dizzyLevel(number) {
    if (number<3) {
      return '尚未達標';
    }
    if (number>=3 && number<5) {
      return '銅';
    }
    if (number>=5 && number< 10) {
      return '銀';
    }
    if (number >= 10) {
      return '金';
    }
  }


  // update (dt) {}
}
