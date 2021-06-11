import { CharacterMgr } from "./CharacterMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SwitchBtn extends cc.Component {

  @property(cc.Button)
  rightButton: cc.Button = null;

  @property(cc.Label)
  rightLabel: cc.Label = null;

  @property(cc.Button)
  leftButton: cc.Button = null;

  @property(cc.Label)
  leftLabel: cc.Label = null;

  @property(CharacterMgr)
  characterMgr: CharacterMgr = null;

  
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start () {
    let turnRightHandler = new cc.Component.EventHandler();
    turnRightHandler.target = this.node;
    turnRightHandler.component = "SwitchBtn";
    turnRightHandler.handler = "turnRight";
    turnRightHandler.customEventData = this.rightLabel.string;
    this.rightButton.clickEvents.push(turnRightHandler);


    let turnLeftHandler = new cc.Component.EventHandler();
    turnLeftHandler.target = this.node;
    turnLeftHandler.component = "SwitchBtn";
    turnLeftHandler.handler = "turnLeft";
    turnLeftHandler.customEventData = this.leftLabel.string;
    this.leftButton.clickEvents.push(turnLeftHandler);

  }

  turnRight(event, customEventData) {
    console.log(customEventData);
    if (customEventData === 'turnRight') {
      this.characterMgr.selectNum += 1;
      if (this.characterMgr.selectNum > this.characterMgr.skinCategory.length - 1) {
        this.characterMgr.selectNum = 0;
      }
    }
    this.seleteCategory();
  }

  turnLeft(event, customEventData) {
    console.log(customEventData);
    if (customEventData === 'turnLeft') {
      this.characterMgr.selectNum -= 1;
      if (this.characterMgr.selectNum < 0) {
        this.characterMgr.selectNum = this.characterMgr.skinCategory.length - 1;
      }
    }
    this.seleteCategory();
  }

  seleteCategory() {
    const categoryName = this.characterMgr.skinCategory[this.characterMgr.selectNum];
    console.log(this.characterMgr.selectNum, ':' , categoryName);

    this.characterMgr.skinCategory.forEach(category => {
      cc.find(`Canvas/Character/${category}`).active = false;
      if (category === categoryName) {
        this.characterMgr.currentSkinCategory = categoryName; // 確定現在的樣式
        const skinCategory = cc.find(`Canvas/Character/${this.characterMgr.currentSkinCategory}`);
        skinCategory.active = true; // 把現在樣式打開
        this.characterMgr.skinColor.forEach(color => {
          skinCategory.getChildByName(color).active = false; // 把所有color都關掉
        });
        skinCategory.getChildByName(this.characterMgr.currentSkinColor).active = true; // 把現在的顏色打開
      }
    });
    this.characterMgr.result();
  }

  // update (dt) {}
}
