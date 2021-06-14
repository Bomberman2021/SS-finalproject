import { CharacterMgr } from "./CharacterMgr";

const {ccclass, property} = cc._decorator;
let record = null;

@ccclass
export class LoadSceneBtn extends cc.Component {

  @property(cc.Button)
  button: cc.Button = null;

  @property(cc.Label)
  label: cc.Label = null;

  @property(cc.Node)
  modeBlock: cc.Node = null;

  @property(cc.Node)
  player2Block: cc.Node = null;

  @property(CharacterMgr)
  characterMgr: CharacterMgr = null;


  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    record = cc.find("record").getComponent("record");
    
    if (record.hasPlayer2) {
      if (this.player2Block && this.modeBlock) { 
        this.player2Block.active = true;
        this.modeBlock.active = false;
      }
    }
  }

  start () {
    let clickEventHandler = new cc.Component.EventHandler();
    clickEventHandler.target = this.node;
    clickEventHandler.component = "LoadSceneBtn";
    if (this.label.string === '2P MODE') {
      clickEventHandler.handler = "twoPeoeleMode";
    }
    if (this.label.string === 'Player 1') { 
      clickEventHandler.handler = "character";
    }
    if (this.label.string === 'Player 2') { 
      clickEventHandler.handler = "character";
    }
    if (this.label.string === 'DONE') {
      // if (3) { // 還沒選好衣服
      //   this.button.interactable = false;
      // }
      clickEventHandler.handler = "done";
    }
    
    clickEventHandler.customEventData = this.label.string;

    let button = this.node.getComponent(cc.Button);
    button.clickEvents.push(clickEventHandler);
  }

    
  twoPeoeleMode() {
    if (!record.hasPlayer2) {
      this.player2Block.active = true;
      this.modeBlock.active = false;
      record.hasPlayer2 = true;
    }
  }

  character() {
    if (this.label.string === 'Player 1') {
      record.currentPlayer = 'Player1';
    }
    if (this.label.string === 'Player 2') {
      record.currentPlayer = 'Player2';
    }
    console.log('character');
    cc.director.loadScene("character");
  }

  done() {
    // if (record.currentPlayer = 'Player1') {
    //   record.player1Skin = this.characterMgr.currentSkinCategory;
    //   record.player1Bomb = this.characterMgr.currentBombCategory;
    //   record.player1Color = this.characterMgr.currentSkinColor;
    // }
    // if (record.currentPlayer = 'Player2') {
    //   record.player2Skin = this.characterMgr.currentSkinCategory;
    //   record.player2Bomb = this.characterMgr.currentBombCategory;
    //   record.player2Color = this.characterMgr.currentSkinColor;
    // }
    console.log('done');
    cc.director.loadScene("main");
  }

    // update (dt) {}
}
