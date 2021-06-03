const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginSignup extends cc.Component {

  @property(cc.Label)
  label: cc.Label = null;

  @property(cc.Button)
  button: cc.Button = null;


  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    let clickEventHandler = new cc.Component.EventHandler();
    clickEventHandler.target = this.node;
    clickEventHandler.component = "ShowTipsArea";
    if (this.label.string === 'SIGNUP') {
      clickEventHandler.handler = "signup";
    }
    if (this.label.string === 'LOGIN') {
      clickEventHandler.handler = "login";
    }
    if (this.label.string === 'GOOGLE') {
      clickEventHandler.handler = "googleLogin";
    }
    if (this.label.string === 'Player 1') { // -------------- test-----------------
      clickEventHandler.handler = "character";
    }
    if (this.label.string === 'Player 2') { // -------------- test-----------------
      clickEventHandler.handler = "character";
    }
    if (this.label.string === 'DONE') { // -------------- test-----------------
      clickEventHandler.handler = "done";
    }

    let button = this.node.getComponent(cc.Button);
    button.clickEvents.push(clickEventHandler);
  }

  start () {

  }

  login() {
    console.log('login');
    cc.director.loadScene("main");
  }

  signup() {
    console.log('signup');
    cc.director.loadScene("main");
  }

  googleLogin() {
    console.log('googleLogin');
    cc.director.loadScene("main");
  }

  character() {// -------------- test-----------------
    console.log('character');
    cc.director.loadScene("character");
  }

  done() { // -------------- test-----------------
    console.log('done');
    cc.director.loadScene("main");
  }

  // update (dt) {}
}
