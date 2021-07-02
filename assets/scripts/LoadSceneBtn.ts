import { CharacterMgr } from "./CharacterMgr";

const { ccclass, property } = cc._decorator;
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

  @property({ type: cc.AudioClip })
  buttonClickSound: cc.AudioClip = null;

  @property(cc.Node)
  loadanim: cc.Node = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    record = cc.find("record").getComponent("record");
    if (this.loadanim !== null) {
      this.loadanim.active = false;
    }

    if (record.gameMode === 'escapeMode' && cc.find(`Canvas/Player2/Delete2p`)) {
      cc.find(`Canvas/Player2/Delete2p`).active = true;
    }
    if (record.hasPlayer2) {
      if (this.player2Block && this.modeBlock) {
        this.player2Block.active = true;
        this.modeBlock.active = false;
      }
    }
  }

  playLoad() {
    if (this.loadanim != null) {
      this.loadanim.active = true;
      let count = 0;
      let Lab1 = this.loadanim.getChildByName('load1').getComponent(cc.Label);
      let Lab2 = this.loadanim.getChildByName('load2').getComponent(cc.Label);
      let Lab3 = this.loadanim.getChildByName('load3').getComponent(cc.Label);
      let Lab4 = this.loadanim.getChildByName('load4').getComponent(cc.Label);
      var playLoad = setInterval(function () {
        if (count == 0) {
          Lab1.node.active = true;
          Lab2.node.active = false;
          Lab3.node.active = false;
          Lab4.node.active = false;
          count = (count + 1) % 4;
        } else if (count == 1) {
          Lab1.node.active = false;
          Lab2.node.active = true;
          Lab3.node.active = false;
          Lab4.node.active = false;
          count = (count + 1) % 4;
        } else if (count == 2) {
          Lab1.node.active = false;
          Lab2.node.active = false;
          Lab3.node.active = true;
          Lab4.node.active = false;
          count = (count + 1) % 4;
        } else if (count == 3) {
          Lab1.node.active = false;
          Lab2.node.active = false;
          Lab3.node.active = false;
          Lab4.node.active = true;
          count = (count + 1) % 4;
        }
        cc.log("in interval");
      }, 300);
    }

  }

  start() {
    let clickEventHandler = new cc.Component.EventHandler();
    clickEventHandler.target = this.node;
    clickEventHandler.component = "LoadSceneBtn";
    if (this.label.string === '2P MODE') {
      clickEventHandler.handler = "twoPeoeleMode";
    }
    if (this.label.string === '基本模式') {
      clickEventHandler.handler = "gameMode";
    }
    if (this.label.string === '逃亡模式') {
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
    if (this.label.name === 'CharacterDone') {
      clickEventHandler.handler = "done";
    }
    if (this.label.name === 'MapDone') {
      clickEventHandler.handler = "done";
    }
    if (this.label.string === 'START') {
      clickEventHandler.handler = "startGame";
    }
    if (this.label.name === 'BackButton') {
      clickEventHandler.handler = "backToMain";
    }
    if (this.label.string === 'Store') {
      clickEventHandler.handler = "goToStore";
    }
    if (this.label.string === 'achievements') {
      clickEventHandler.handler = "checkAchievements";
    }
    if (this.label.string === 'delete2p') {
      clickEventHandler.handler = "deleteTwoPeoeleMode";
    }

    clickEventHandler.customEventData = this.label.string;

    let button = this.node.getComponent(cc.Button);
    button.clickEvents.push(clickEventHandler);
  }

  gameMode() {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
    let mode = '';
    if (this.label.string === '基本模式') {
      mode = 'basicMode';
      record.hasPlayer2 = true;
    }
    if (this.label.string === '逃亡模式') {
      mode = 'escapeMode';
      record.hasPlayer2 = false;
    }
    if (this.label.string === '追逐模式') {
      mode = 'chaseMode';
      record.hasPlayer2 = true;
    }
    record.gameMode = mode;
    record.settingLife = '1';
    record.settingTime = '60';
    record.settingMap = 'map1';
    // 換模式 === 設回初始值
    this.playLoad();
    console.log('record.gameMode:', record.gameMode);
    cc.director.loadScene("ready");
  }

  backToMain() {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
    cc.director.loadScene("main");
  }

  backToReady() {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
    this.playLoad();
    cc.director.loadScene("ready");
  }

  goToStore() {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
    this.playLoad();
    cc.director.loadScene("store");
  }

  checkAchievements() {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
    this.playLoad();
    cc.director.loadScene("achievements");
  }

  deleteTwoPeoeleMode() {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
    if (record.hasPlayer2) {
      this.player2Block.active = false;
      this.modeBlock.active = true;
      record.hasPlayer2 = false;
    }
  }


  twoPeoeleMode() {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
    if (!record.hasPlayer2) {
      this.player2Block.active = true;
      this.modeBlock.active = false;
      record.hasPlayer2 = true;
    }
  }

  character() {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
    if (this.label.string === 'Player 1') {
      record.currentPlayer = 'Player1';
    }
    if (this.label.string === 'Player 2') {
      record.currentPlayer = 'Player2';
    }
    cc.director.loadScene("character");
  }

  doneOpen() {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
    if (this.label.string === 'DONE') {
      this.button.interactable = true;
    }
  }

  doneClose() {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
    if (this.label.string === 'DONE') {
      this.button.interactable = false;
    }
  }

  done() {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
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
    this.playLoad();
    cc.director.loadScene("ready");
  }



  startGame() {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
    cc.log(record.gameMode);
    this.playLoad();
    if (record.gameMode == "basicMode")
      cc.director.loadScene("arena");
    else if (record.gameMode == "escapeMode")
      cc.director.loadScene("survive");
    else if (record.gameMode == "chaseMode")
      cc.director.loadScene("escape");
  }

  // update (dt) {
  // }
}
