const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

  @property(cc.Node)
  skinPage: cc.Node = null;

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}
  public currentPage = 'left';

  goToLeftPage() {
    if (this.currentPage == 'left') {
      return;
    } else {
      let left = cc.moveBy(0.5, cc.v2(1280, 0));
      this.currentPage = 'left';
      this.skinPage.runAction(left);
    }


  }

  goToRightPage() {
    if (this.currentPage == 'right') {
      return;
    } else {
      let right = cc.moveBy(0.5, cc.v2(-1280, 0));
      this.currentPage = 'right';
      this.skinPage.runAction(right);
    }
  }

  start() {

  }

  // update (dt) {}
}
