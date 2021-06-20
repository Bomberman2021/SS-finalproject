const {ccclass, property} = cc._decorator;
let record = null;

@ccclass
export default class NewClass extends cc.Component {

  @property(cc.Label)
  winner: cc.Label = null;

  @property(cc.Label)
  getCoin: cc.Label = null;

  @property(cc.Label)
  getExperience: cc.Label = null;
  
  @property(cc.Label)
  getAchievement: cc.Label = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    record = cc.find("record").getComponent("record");  

    this.winner.string = record.winner;
    this.getCoin.string = record.getCoin;
    this.getExperience.string = record.getExperience;
    this.getAchievement.string = record.getAchievement;
  }

  start () {
    setTimeout(() => {
      cc.director.loadScene("main");
    }, 5000);
  }

  // update (dt) {}
}
