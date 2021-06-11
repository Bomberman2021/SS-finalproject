const {ccclass, property} = cc._decorator;

@ccclass
export class CharacterMgr extends cc.Component {
  
  public skinCategory: string[] = 
    ['normal', 'pirate', 'russian', 'boxer', 'brucelee', 'bullman', 
    'caveman', 'cowboy', 'ebifry', 'egypt', 'mexican', 'ninja']; // 全12種
  public skinColor: string[] = ['black', 'blue', 'red', 'white']; // 全4種
  public bombCategory: string[] = ['normal']; // 全?種
  
  public currentSkinCategory: string = 'normal';
  public currentSkinColor: string = 'black';

  public skinColorTable: object = {};

  public selectNum:number = 0;

  // public userSkinCategory: string[] = ['normal'];
  // public userBombCategory: string[] = ['normal'];

  onLoad () {
    cc.find(`Canvas/Character/normal`).active = false; // 先把預設圖拿掉
    let skinCategoryNode = cc.find(`Canvas/Character/${this.currentSkinCategory}`);
    skinCategoryNode.active = true;
    skinCategoryNode.getChildByName(this.currentSkinColor).active = true;
  
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
    console.log(this.currentSkinColor, ':', this.currentSkinCategory);
    console.log('---------------');
  }
}
