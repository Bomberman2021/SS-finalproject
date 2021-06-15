import { CharacterMgr } from "./CharacterMgr";
let record = null;
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

  onLoad () {
    record = cc.find("record").getComponent("record");
  }

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
        if (this.characterMgr.selectSkinIndex > this.characterMgr.skinCategory.length - 1) {
          this.characterMgr.selectSkinIndex = 0;
        }
      }
      this.seleteSkinCategory();
    }
    if (parentName === 'Bomb') {
      if (customEventData === 'turnRight') {
        this.characterMgr.selectBombIndex += 1;
        if (this.characterMgr.selectBombIndex > this.characterMgr.bombCategory.length - 1) {
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
          this.characterMgr.selectSkinIndex = this.characterMgr.skinCategory.length - 1;
        }
      }
      this.seleteSkinCategory();
    }
    if (parentName === 'Bomb') {
      if (customEventData === 'turnLeft') {
        this.characterMgr.selectBombIndex -= 1;
        if (this.characterMgr.selectBombIndex < 0) {
          this.characterMgr.selectBombIndex = this.characterMgr.bombCategory.length - 1;
        }
      }
      this.seleteBombCategory();
    }
  }

  seleteSkinCategory() {
    const categoryName = this.characterMgr.skinCategory[this.characterMgr.selectSkinIndex];
    this.characterMgr.skinCategory.forEach(allCategoryName => {
      cc.find(`Canvas/Character/${allCategoryName}`).active = false;
      if (allCategoryName === categoryName) {
        const userSkinCategory = cc.find(`Canvas/Character/${categoryName}`);
        userSkinCategory.active = true; // 把現在樣式打開
        this.characterMgr.skinColor.forEach(color => {
          userSkinCategory.getChildByName(color).active = false; // 把所有color都關掉
        });
        userSkinCategory.getChildByName(this.characterMgr.currentSkinColor).active = true; // 把現在的顏色打開
      }
    });    
    record.userSkinCategory.forEach(userCategoryIndex => {
      if (this.characterMgr.selectSkinIndex === userCategoryIndex) {
        console.log('有'+ categoryName + '喔！ Index:' +  userCategoryIndex);
      }
    });
    this.characterMgr.result();
  }

  seleteBombCategory() {
    const categoryName = this.characterMgr.bombCategory[this.characterMgr.selectBombIndex];
    this.characterMgr.bombCategory.forEach(category => {
      cc.find(`Canvas/Bomb/${category}`).active = false;
      if (category === categoryName) {
        const userBombCategory = cc.find(`Canvas/Bomb/${categoryName}`);
        userBombCategory.active = true; // 把現在樣式打開
      }
    });
    record.userBombCategory.forEach(userCategoryIndex => {
      if (this.characterMgr.selectBombIndex === userCategoryIndex) {
        console.log('有'+ categoryName + '喔！ Index:' +  userCategoryIndex);
      }
    });
    this.characterMgr.result();
  }

  // update (dt) {}
}
