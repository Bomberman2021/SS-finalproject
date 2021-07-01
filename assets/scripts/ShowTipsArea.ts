const { ccclass, property } = cc._decorator;

@ccclass
export default class ShowTipsArea extends cc.Component {

  @property(cc.Node)
  TipsArea: cc.Node = null;

  @property(cc.Button)
  button: cc.Button = null;

  // LIFE-CYCLE CALLBACKS:

  // onLoad() {}
  // start() {}

  toggle() {
    if (this.TipsArea.active) {
      this.TipsArea.active = false;
    } else {
      this.TipsArea.active = true;
    }
  }

  // update (dt) {}
}
