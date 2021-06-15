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
  // skinCategory[selectSkinIndex]
  // bombCategory[selectBombIndex]

  public skinColorTable: object = {};

  public selectSkinIndex:number = 0;
  public selectBombIndex:number = 0;


  public userSkinCategory: string[] = this.skinCategory;
  public userBombCategory: string[] = this.bombCategory;

  onLoad () {
    record = cc.find("record").getComponent("record");
    this.init();

    if (record.currentPlayer === 'Player1') {
      this.currentSkinColor = record.player1Color;
      this.selectSkinIndex = record.player1Skin;
      this.selectBombIndex = record.player1Bomb;
    }

    if (record.currentPlayer === 'Player2') {
      this.currentSkinColor = record.player2Color;
      this.selectSkinIndex = record.player2Skin;
      this.selectBombIndex = record.player2Bomb;
    }

    cc.find(`Canvas/Character/normal`).active = false; // 先把預設圖拿掉
    let skinCategoryNode = cc.find(`Canvas/Character/${this.skinCategory[this.selectSkinIndex]}`);
    skinCategoryNode.active = true;
    skinCategoryNode.getChildByName(this.currentSkinColor).active = true;

    cc.find(`Canvas/Bomb/normal`).active = false; // 先把預設圖拿掉
    let bombCategoryNode = cc.find(`Canvas/Bomb/${this.bombCategory[this.selectBombIndex]}`);
    bombCategoryNode.active = true;
  }

  start () {
  }

  init() {
    this.userSkinCategory = record.userSkinCategory;
    this.userBombCategory = record.userBombCategory;

    console.log('userSkinCategory',this.userSkinCategory);
    console.log('userBombCategory',this.userBombCategory); // Index
    
    // index轉成name的過程 -------------------------------------
    // const skinIndexArray = record.userSkinCategory;
    // const bombIndexArray = record.userBombCategory;
    // this.userSkinCategory = []; // 把它清空
    // this.userBombCategory = []; // 把它清空

    // this.skinCategory.forEach(category => {
    //   skinIndexArray.forEach(theIndex => {
    //     const has = this.skinCategory[theIndex];
    //     if (category === has) {
    //       this.userSkinCategory.push(has);
    //     }
    //   });
    // });

    // this.bombCategory.forEach(category => {
    //   bombIndexArray.forEach(theIndex => {
    //     const has = this.bombCategory[theIndex];
    //     if (category === has) {
    //       this.userBombCategory.push(has);
    //     }
    //   });
    // });

    // console.log('userSkinCategory',this.userSkinCategory);
    // console.log('userBombCategory',this.userBombCategory); // name
    // index轉成name的過程 -------------------------------------
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
