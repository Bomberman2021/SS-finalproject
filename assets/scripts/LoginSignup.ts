// import firebase from "../firebase";
import { Editbox } from "./Editbox";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginSignup extends cc.Component {

  @property(cc.Label)
  label: cc.Label = null;

  @property(cc.Button)
  button: cc.Button = null;

  @property(Editbox)
  emailEditBox: Editbox = null;

  @property(Editbox)
  passwordEditBox: Editbox = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    this.setupAuth();
  }
    
  start () {
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

    let button = this.node.getComponent(cc.Button);
    button.clickEvents.push(clickEventHandler);
  }

  setupAuth(){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('登入成功');
      } else {
        console.log('已登出');
      }
    });
  }

  login() {
    console.log('login');

    let userEmail = this.emailEditBox.inputText;
    let userPassword = this.passwordEditBox.inputText;
    console.log(userEmail);
    console.log(userPassword);
    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).then((result) => {
      console.log('login result:', result);
      userEmail = '';
      userPassword = '';

      cc.director.loadScene("main");
    }).catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
      userEmail = '';
      userPassword = '';
    });
  }

  signup() {
    console.log('signup');

    let userEmail = this.emailEditBox.inputText;
    let userPassword = this.passwordEditBox.inputText;
    let cutIndex = userEmail.search('@');
    let userNickname = userEmail.substring(0, cutIndex);
    console.log(userNickname);
    console.log(userEmail);
    console.log(userPassword);
    
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then(async(newUser) => {  
      await newUser.user.updateProfile({displayName: userNickname});
      this.makeNewRecord(userEmail, newUser.user.uid, userNickname, 0);
      console.log('註冊成功');
    }).catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
  }

  googleLogin() {
    console.log('googleLogin');
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(async(result) => {
      const userEmail = result.user.email;
      const userUid = result.user.uid;
      let cutIndex = userEmail.search('@');
      let userNickname = userEmail.substring(0, cutIndex);
      await result.user.updateProfile({displayName: userNickname});
      this.makeNewRecord(userEmail, userUid, userNickname, 0)
    }).catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
  }

  makeNewRecord(userEmail, userId, userName, coin) {
    const playersInfo = `/players/playerInfo-${userId}`;
    firebase.database().ref(playersInfo).once("value", snapshot => {
      if (snapshot.exists()){
        console.log("exists!");
      } else {
        console.log("create new data");
        const data = {
          email: userEmail,
          name: userName,
          coin: coin,
          level: 1,
          gameNum: 0,
          winNum: 0,
          userAchievement: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
          },
        };
        firebase.database().ref(playersInfo).set(data);
        
        const playersUserSkin =`/players/playerInfo-${userId}/userSkin`;
        const userSkin = {index: 0,};
        firebase.database().ref(playersUserSkin).push(userSkin);
        
        const playersBombSkin =`/players/playerInfo-${userId}/bombSkin`;
        const bombSkin = {index: 0,};
        firebase.database().ref(playersBombSkin).push(bombSkin);

      }
      cc.director.loadScene("main");
    });
  }

  signOut() {
    firebase.auth().signOut().then(()=> {
      const user = firebase.auth().currentUser;
      if (user) {
        console.log('正在登入狀態');
      } else {
        console.log('登出成功');
      }
    }).catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);      
    });
  }

  // update (dt) {}
}
