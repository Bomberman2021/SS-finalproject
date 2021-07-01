const { ccclass, property } = cc._decorator;
let record = null;

@ccclass
export default class ShowTipsArea extends cc.Component {

  @property(cc.Node)
  TipsArea: cc.Node = null;

  @property(cc.Button)
  button: cc.Button = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    record = cc.find("record").getComponent("record");
  }
  // start() {}

  toggle() {
    if (this.TipsArea.active) {
      this.TipsArea.active = false;
    } else {
      this.TipsArea.active = true;
    }
  }

  questionToggle() {
    if (this.TipsArea.active) {
      this.TipsArea.active = false;

    } else {
      this.TipsArea.active = true;

      let QuestionArea = cc.find(`Canvas/Question/QuestionArea/Background`);
      QuestionArea.getChildByName(record.gameMode).active = true;

    }
  }

  // update (dt) {}
}
