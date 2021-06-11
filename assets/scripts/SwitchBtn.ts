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
    const parentName = this.node.parent.name;

    if (parentName === 'Character') {
      if (customEventData === 'turnRight') {
        this.characterMgr.selectSkinIndex += 1;
        if (this.characterMgr.selectSkinIndex > this.characterMgr.userSkinCategory.length - 1) {
          this.characterMgr.selectSkinIndex = 0;
        }
      }
      this.seleteSkinCategory();
    }
    if (parentName === 'Bomb') {
      if (customEventData === 'turnRight') {
        this.characterMgr.selectBombIndex += 1;
        if (this.characterMgr.selectBombIndex > this.characterMgr.userBombCategory.length - 1) {
          this.characterMgr.selectBombIndex = 0;
        }
      }
      this.seleteBombCategory();
    }
  }

  turnLeft(event, customEventData) {
    const parentName = this.node.parent.name;

    if (parentName === 'Character') {
      if (customEventData === 'turnLeft') {
        this.characterMgr.selectSkinIndex -= 1;
        if (this.characterMgr.selectSkinIndex < 0) {
          this.characterMgr.selectSkinIndex = this.characterMgr.userSkinCategory.length - 1;
        }
      }
      this.seleteSkinCategory();
    }
    if (parentName === 'Bomb') {
      if (customEventData === 'turnLeft') {
        this.characterMgr.selectBombIndex -= 1;
        if (this.characterMgr.selectBombIndex < 0) {
          this.characterMgr.selectBombIndex = this.characterMgr.userBombCategory.length - 1;
        }
      }
      this.seleteBombCategory();
    }
  }

  seleteSkinCategory() {
    const categoryName = this.characterMgr.userSkinCategory[this.characterMgr.selectSkinIndex];
    // console.log(this.characterMgr.selectSkinIndex, ':' , categoryName);

    this.characterMgr.userSkinCategory.forEach(category => {
      cc.find(`Canvas/Character/${category}`).active = false;
      if (category === categoryName) {
        this.characterMgr.currentSkinCategory = categoryName; // 確定現在的樣式
        const userSkinCategory = cc.find(`Canvas/Character/${this.characterMgr.currentSkinCategory}`);
        userSkinCategory.active = true; // 把現在樣式打開
        this.characterMgr.skinColor.forEach(color => {
          userSkinCategory.getChildByName(color).active = false; // 把所有color都關掉
        });
        userSkinCategory.getChildByName(this.characterMgr.currentSkinColor).active = true; // 把現在的顏色打開
      }
    });
    this.characterMgr.result();
  }

  seleteBombCategory() {
    const categoryName = this.characterMgr.userBombCategory[this.characterMgr.selectBombIndex];
    // console.log(this.characterMgr.selectBombIndex, ':' , categoryName);

    this.characterMgr.userBombCategory.forEach(category => {
      cc.find(`Canvas/Bomb/${category}`).active = false;
      if (category === categoryName) {
        this.characterMgr.currentBombCategory = categoryName; // 確定現在的樣式
        const userBombCategory = cc.find(`Canvas/Bomb/${this.characterMgr.currentBombCategory}`);
        userBombCategory.active = true; // 把現在樣式打開
      }
    });
    this.characterMgr.result();
  }

  // update (dt) {}
}
