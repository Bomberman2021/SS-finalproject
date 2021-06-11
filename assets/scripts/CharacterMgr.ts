import { UserInfo } from "./UserInfo";

const {ccclass, property} = cc._decorator;

@ccclass
export class CharacterMgr extends cc.Component {
  
  public skinColor: string[] = 
    ['black', 'blue', 'red', 'white']; // 全4種
  public skinCategory: string[] = 
    ['normal', 'pirate', 'russian', 'boxer', 'brucelee', 'bullman', 
    'caveman', 'cowboy', 'ebifry', 'egypt', 'mexican', 'ninja']; // 全12種
  public bombCategory: string[] = 
    ['normal', 'bomb_icon_01', 'bomb_icon_02', 'bomb_icon_03',
     'bomb_icon_04', 'bomb1', 'bomb2', 'bomb3', 'bomb4']; // 全9種
  
  public currentSkinColor: string = 'black';
  public currentSkinCategory: string = 'normal';
  public currentBombCategory: string = 'normal';

  public skinColorTable: object = {};

  public selectSkinIndex:number = 0;
  public selectBombIndex:number = 0;

  @property(UserInfo)
  userInfo: UserInfo = null;

  // public userSkinCategory: string[] = ['normal'];
  // public userBombCategory: string[] = ['normal'];

  onLoad () {
    cc.find(`Canvas/Character/normal`).active = false; // 先把預設圖拿掉
    let skinCategoryNode = cc.find(`Canvas/Character/${this.currentSkinCategory}`);
    skinCategoryNode.active = true;
    skinCategoryNode.getChildByName(this.currentSkinColor).active = true;

    cc.find(`Canvas/Bomb/normal`).active = false; // 先把預設圖拿掉
    let bombCategoryNode = cc.find(`Canvas/Bomb/${this.currentBombCategory}`);
    bombCategoryNode.active = true;

    // this.makeColorTable();
  }

  start () {

  }

  // makeColorTable() {
  //   this.skinColor.forEach(item => {
  //     this.skinColorTable[item] = true
  //   });
  //   console.log(this.skinColorTable);
  // }

  // update (dt) {}

  result() {
    console.log('---------------');
    console.log('color:', this.currentSkinColor );
    console.log('skin:', this.currentSkinCategory , 'index:' , this.selectSkinIndex);
    console.log('bomb：', this.currentBombCategory , 'index:' , this.selectBombIndex);
    console.log('---------------');
  }
}
