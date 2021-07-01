const {ccclass, property} = cc._decorator;
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

  public userAchievement: string[] = []; // 全16個項目

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    record = cc.find("record").getComponent("record");
  }
  
  start () {
    this.display();
  }

  display() {
    // General：20以上 金牌 (如遊戲次數)
    // speed：260以上 金牌 (跑速)
    // longTime：60以上 金牌 (堅持時間)
    this.userAchievement[0] = this.setGeneralLevel(record.userAchievement[0]); // "基本"遊戲次數
    
    this.userAchievement[1] = record.userSkinCategory.length; // 造型數量
    this.userAchievement[2] = record.userAchievement[2]; // 生涯累積金幣數量
    this.userAchievement[3] = record.userAchievement[3]; // 最高一場遊戲中獲得金幣數
    
    this.userAchievement[4] = this.setGeneralLevel(record.userAchievement[4]); // 屍體數
    this.userAchievement[5] = this.setGeneralLevel(record.userAchievement[5]); // 自殺數量
    this.userAchievement[6] = this.setGeneralLevel(record.userAchievement[6]);  // 放置炸彈數量（總數）
    this.userAchievement[7] = this.setGeneralLevel(record.userAchievement[7]); // 撿取道具數量

    this.userAchievement[8] = this.setGeneralLevel(record.userAchievement[8]); // 逃亡遊戲次數
    this.userAchievement[9] = this.longTimeLevel(record.userAchievement[9]); // 堅持時間
    this.userAchievement[10] = this.speedLevel(record.userAchievement[10]); // 最快跑速
    this.userAchievement[11] = this.setGeneralLevel(record.userAchievement[11]); // 最多炸彈數量
    this.userAchievement[12] = this.setGeneralLevel(record.userAchievement[12]); // 最快死亡
    
    this.userAchievement[13] = this.setGeneralLevel(record.userAchievement[13]); // 最快殺人
    this.userAchievement[14] = this.setGeneralLevel(record.userAchievement[14]); // 最快搜集
    this.userAchievement[15] = this.setGeneralLevel(record.userAchievement[15]); // 最多暈眩

    this.linkLabelString();
  }

  

  linkLabelString() {
    for (let key = 0; key < this.userAchievement.length; key+=1) {
      if(Number(this.achievements[key].name) === key) {
        if (this.userAchievement[key] === '銅牌') {
          cc.find(`Canvas/Achievements/${this.achievements[key].name}/Picture`).getComponent(cc.Sprite).spriteFrame = this.thirdPic;
        }
        if (this.userAchievement[key] === '銀牌') {
          cc.find(`Canvas/Achievements/${this.achievements[key].name}/Picture`).getComponent(cc.Sprite).spriteFrame = this.secondPic;
        }
        if (this.userAchievement[key] === '金牌') {
          cc.find(`Canvas/Achievements/${this.achievements[key].name}/Picture`).getComponent(cc.Sprite).spriteFrame = this.firstPic;
        }
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
      return '銅牌';
    }
    if (number>=10 && number< 20) {
      return '銀牌';
    }
    if (number>=20) {
      return '金牌';
    }
  }

  speedLevel(number) {
    if (number<150) {
      return '尚未達標';
    }
    if (number>=150 && number<200) {
      return '銅牌';
    }
    if (number>=200 && number< 250) {
      return '銀牌';
    }
    if (number>=260) {
      return '金牌';
    }
  }

  longTimeLevel(number) {
    if (number<10) {
      return '尚未達標';
    }
    if (number>=10 && number<45) {
      return '銅牌';
    }
    if (number>=45 && number< 60) {
      return '銀牌';
    }
    if (number>=60) {
      return '金牌';
    }
  }

  // setLowLevel(number) {
  //   if (number<150) {
  //     return '尚未達標';
  //   }
  //   if (number>=150 && number<200) {
  //     return '銅牌';
  //   }
  //   if (number>=200 && number< 250) {
  //     return '銀牌';
  //   }
  //   if (number>=260) {
  //     return '金牌';
  //   }
  // }


  // update (dt) {}
}
