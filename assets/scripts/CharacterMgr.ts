import { UserInfo } from "./UserInfo";
let record = null;

const {ccclass, property} = cc._decorator;

@ccclass
export class CharacterMgr extends cc.Component {
  
  public skinColor: string[] = 
    ['black', 'blue', 'red', 'white']; // 全4種
  public skinCategory: string[] = 
    ['normal', 'boxer', 'brucelee', 'bullman', 'caveman',
     'ebifry', 'egypt', 'mexican', 'ninja', 'pirate', 'russian']; // 全11種
  public bombCategory: string[] = 
    ['normal', 'bomb_icon_01', 'bomb_icon_02', 'bomb_icon_03', 'bomb_icon_04']; // 全5種
  
  public currentSkinColor: string = 'black';
  public currentSkinCategory: string = 'normal';
  public currentBombCategory: string = 'normal';

  public skinColorTable: object = {};

  public selectSkinIndex:number = 0;
  public selectBombIndex:number = 0;

  @property(UserInfo)
  userInfo: UserInfo = null;

  public userSkinCategory: string[] = this.skinCategory;
  public userBombCategory: string[] = this.bombCategory;

  onLoad () {
    // this.init();
    record = cc.find("record").getComponent("record");

    if (record.currentPlayer === 'Player1') {
      this.currentSkinColor = record.player1Color;
      this.currentSkinCategory = record.player1Skin;
      this.currentBombCategory = record.player1Bomb;
    }

    if (record.currentPlayer === 'Player2') {
      this.currentSkinColor = record.player2Color;
      this.currentSkinCategory = record.player2Skin;
      this.currentBombCategory = record.player2Bomb;
    }

    cc.find(`Canvas/Character/normal`).active = false; // 先把預設圖拿掉
    let skinCategoryNode = cc.find(`Canvas/Character/${this.currentSkinCategory}`);
    skinCategoryNode.active = true;
    skinCategoryNode.getChildByName(this.currentSkinColor).active = true;

    cc.find(`Canvas/Bomb/normal`).active = false; // 先把預設圖拿掉
    let bombCategoryNode = cc.find(`Canvas/Bomb/${this.currentBombCategory}`);
    bombCategoryNode.active = true;
  }

  start () {
  }

  init() {
    const skinIndexArray = record.userSkinCategory;
    const bombIndexArray = record.userBombCategory;

    // console.log('skinIndexArray:', skinIndexArray);
    // console.log('bombIndexArray:', bombIndexArray);
    
    // if (record.currentPlayer) { // 有登入時(這個不代表有登入)
    //   this.userSkinCategory = []; // 把它清空
    //   this.userBombCategory = []; // 把它清空

    //   this.skinCategory.forEach(category => {
    //     skinIndexArray.forEach(theIndex => {
    //       const has = this.skinCategory[theIndex];
    //       if (category === has) {
    //         console.log(has);
    //         this.userSkinCategory.push(has);
    //       }
    //     });
    //   });

    //   this.bombCategory.forEach(category => {
    //     bombIndexArray.forEach(theIndex => {
    //       const has = this.bombCategory[theIndex];
    //       if (category === has) {
    //         console.log(has);
    //         this.userBombCategory.push(has);
    //       }
    //     });
    //   });
    // }
    console.log('userSkinCategory',this.userSkinCategory);
    console.log('userBombCategory',this.userBombCategory);
  }

  // update (dt) {}

  result() {
    console.log('---------------');
    console.log('color:', this.currentSkinColor );
    console.log('skin:', this.currentSkinCategory , 'index:' , this.selectSkinIndex);
    console.log('bomb：', this.currentBombCategory , 'index:' , this.selectBombIndex);
    console.log('---------------');
  }
}
