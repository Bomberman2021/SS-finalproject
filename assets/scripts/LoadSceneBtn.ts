import { UserInfo } from "./UserInfo";

const {ccclass, property} = cc._decorator;

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

  @property(UserInfo)
  info: UserInfo = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    if ((window as any).hasPlayer2) {
      if (this.player2Block && this.modeBlock) { 
        this.player2Block.active = true;
        this.modeBlock.active = false;
      }
    }
  }

  start () {
    let clickEventHandler = new cc.Component.EventHandler();
    clickEventHandler.target = this.node;
    clickEventHandler.component = "ShowTipsArea";
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
      clickEventHandler.handler = "done";
    }

    let button = this.node.getComponent(cc.Button);
    button.clickEvents.push(clickEventHandler);

  }

    
  twoPeoeleMode() {
    console.log('twoPeoeleMode');
    if (!(window as any).hasPlayer2) {
      this.player2Block.active = true;
      this.modeBlock.active = false;
      (window as any).hasPlayer2 = true;
      this.info.saveData();
    }
  }

  character() {
    console.log('character');
    cc.director.loadScene("character");
  }

  done() {
    console.log('done');
    cc.director.loadScene("main");
  }

    // update (dt) {}
}
