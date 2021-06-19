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

  start () {  // 成就與商店還沒有寫
    let clickEventHandler = new cc.Component.EventHandler();
    clickEventHandler.target = this.node;
    clickEventHandler.component = "LoadSceneBtn";
    if (this.label.string === '2P MODE') {
      clickEventHandler.handler = "twoPeoeleMode";
    }
    if (this.label.string === '基本模式') {
      clickEventHandler.handler = "gameMode";
    }
    if (this.label.string === 'asd') {
      clickEventHandler.handler = "gameMode";
    }
    if (this.label.string === '追逐模式') {
      clickEventHandler.handler = "gameMode";
    }
    if (this.label.string === 'Player 1') { 
      clickEventHandler.handler = "character";
    }
    if (this.label.string === 'Player 2') { 
      clickEventHandler.handler = "character";
    }
    if (this.label.string === 'CharacterDone') {
      clickEventHandler.handler = "done";
    }
    if (this.label.name === 'MapDone') {
      clickEventHandler.handler = "done";
    }
    if (this.label.string === 'START') { 
      clickEventHandler.handler = "startGame";
    }
    
    clickEventHandler.customEventData = this.label.string;

    let button = this.node.getComponent(cc.Button);
    button.clickEvents.push(clickEventHandler);
  }

  gameMode() {
    let mode = '';
    if (this.label.string === '基本模式') {
      mode = 'basicMode';
    }
    if (this.label.string === '逃亡模式') {
      mode = 'escapeMode';
    }
    if (this.label.string === '追逐模式') {
      mode = 'chaseMode';
    }
    record.gameMode = mode;
    console.log('record.gameMode:', record.gameMode);
    cc.director.loadScene("ready");
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
    cc.director.loadScene("character");
  }

  doneOpen() {
    if (this.label.string === 'DONE') {
      this.button.interactable = true;
    }
  }

  doneClose() {
    if (this.label.string === 'DONE') {
      this.button.interactable = false;
    }
  }

  done() {
    if (record.currentPlayer === 'Player1') {
      record.player1Skin = this.characterMgr.selectSkinIndex;
      record.player1Bomb = this.characterMgr.selectBombIndex;
      record.player1Color = this.characterMgr.currentSkinColor;
    }
    if (record.currentPlayer === 'Player2') {
      record.player2Skin = this.characterMgr.selectSkinIndex;
      record.player2Bomb = this.characterMgr.selectBombIndex;
      record.player2Color = this.characterMgr.currentSkinColor;
    }
    console.log('done');
    cc.director.loadScene("ready");
  }

  backToReady(){
    cc.director.loadScene("ready");
  }

  startGame() {
    console.log('!! startGame-------------');
    console.log('----player1----');
    console.log('skin:', record.player1Skin );
    console.log('bomb:', record.player1Bomb);
    console.log('color:', record.player1Color);
    console.log('----player2----');
    console.log('skin:', record.player2Skin );
    console.log('bomb:', record.player2Bomb);
    console.log('color:', record.player2Color);
    console.log('----setting----');
    console.log('life:', record.settingLife );
    console.log('time:', record.settingTime );
  }

  // update (dt) {
  // }
}
