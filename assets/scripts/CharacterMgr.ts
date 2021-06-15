let record = null;

const {ccclass, property} = cc._decorator;

@ccclass
export class CharacterMgr extends cc.Component {

  @property(cc.Node)
  done: cc.Node = null;
  
  public skinColor: string[] = 
    ['black', 'blue', 'red', 'white']; // 全4種
  public skinCategory: string[] = 
    ['normal', 'boxer', 'brucelee', 'bullman', 'caveman',
     'ebifry', 'egypt', 'mexican', 'ninja', 'pirate', 'russian']; // 全11種
  public bombCategory: string[] = 
    ['normal', 'bomb1', 'bomb2', 'bomb3', 'bomb4']; // 全5種
  
  public currentSkinColor: string = 'black';
  // skinCategory[selectSkinIndex] = 0;
  // bombCategory[selectBombIndex] = 0;

  public skinColorTable: object = {};

  public selectSkinIndex:number = 0;
  public selectBombIndex:number = 0;

  public skinAvailable = false;
  public bombAvailable = false;

  public userSkinCategory: number[] = [];
  public userBombCategory: number[] = [];

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

    cc.find(`Canvas/Bomb/normal/normal`).active = false; // 先把預設圖拿掉
    let bombCategoryNode = cc.find(`Canvas/Bomb/${this.bombCategory[this.selectBombIndex]}/${this.bombCategory[this.selectBombIndex]}`);
    bombCategoryNode.active = true;
  }

  start () {
  }

  init() {
    this.skinAvailable = true;
    this.bombAvailable = true;

    this.userSkinCategory = record.userSkinCategory;
    this.userBombCategory = record.userBombCategory;

    console.log('userSkinCategory',this.userSkinCategory);
    console.log('userBombCategory',this.userBombCategory); // Index
  }

  // update (dt) {}

  result() {
    if (this.skinAvailable && this.bombAvailable) {
      this.done.getComponent("LoadSceneBtn").doneOpen();
    } else {
      this.done.getComponent("LoadSceneBtn").doneClose();
    }
    // console.log('---------------');
    // console.log('color:', this.currentSkinColor);
    // console.log('skin:', this.selectSkinIndex);
    // console.log('bomb：', this.selectBombIndex);
    // console.log('---------------');
  }
}
