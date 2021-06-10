
const {ccclass, property} = cc._decorator;

@ccclass
export default class Globals extends cc.Component {

  window.Global = {
    backNode: null,
    backLabel: null,
  };

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start () {

  }

  // update (dt) {}
}
