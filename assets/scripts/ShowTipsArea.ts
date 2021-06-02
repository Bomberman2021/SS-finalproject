const {ccclass, property} = cc._decorator;

@ccclass
export default class ShowTipsArea extends cc.Component {

  @property(cc.Label)
  label: cc.Label = null;

  @property(cc.Node)
  Player1TipsBlock: cc.Node = null;

  @property(cc.Node)
  Player2TipsBlock: cc.Node = null;

  @property(cc.Button)
  button: cc.Button = null;

  private inTipArea1: boolean = false;
  private inTipArea2: boolean = false;

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    let clickEventHandler = new cc.Component.EventHandler();
    clickEventHandler.target = this.node;
    clickEventHandler.component = "ShowTipsArea";
    clickEventHandler.handler = "toggleTipsArea";
    if (this.label) {
      clickEventHandler.customEventData = this.label.string;
    }

    var button = this.node.getComponent(cc.Button);
    button.clickEvents.push(clickEventHandler);
  }

  start () {

  }

  toggleTipsArea(event, customEventData) {
    console.log('toggleTipsArea', customEventData);
    if (customEventData === 'Player 1') {
      this.inTipArea1 = !this.inTipArea1;
      if (this.inTipArea1) {
        this.Player1TipsBlock.active = true;
      } else {
        this.Player1TipsBlock.active = false;
      }
    }
    if (customEventData === 'Player 2') {
      this.inTipArea2 = !this.inTipArea2;
      if (this.inTipArea2) {
        this.Player2TipsBlock.active = true;
      } else {
        this.Player2TipsBlock.active = false;
      }
    }
  }

  // update (dt) {}
}
