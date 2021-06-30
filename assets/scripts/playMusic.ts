const {ccclass, property} = cc._decorator;

@ccclass
export default class playMusic extends cc.Component {

  @property({type:cc.AudioClip})
  bgm: cc.AudioClip = null;


  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start () {
    this.playBgm();
  }
  

  playBgm(){
    cc.audioEngine.playMusic(this.bgm, true);
  }


  // update (dt) {}
}
