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

  @property(Editbox)
  nicknameEditBox: Editbox = null;


  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    // this.setupAuth();
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
    if (this.label.string === '2P MODE') {
      clickEventHandler.handler = "twoPeoeleMode";
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

  // setupAuth(){
  //   firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       const db = firebase.firestore();
  //       const docRef = db.collection('users').doc(user.uid);
  //       docRef.get().then((doc) => {
  //         if (doc.exists) {
  //           console.log('Document data:', doc.data());
  //           console.log('非第一次登入');
  //         } else {
  //           console.log('第一次登入，就在firestore留下資料');
  //           const usersRef = db.collection('users');
  //           usersRef.doc(user.uid).set({
  //             userInfo: JSON.parse(JSON.stringify(user)),
  //           });
  //         }
  //       }).catch((error) => {
  //         console.error('Error getting document:', error);
  //       });
  //       console.log('登入成功');
  //     } else {
  //       console.log('已登出');
  //     }
  //   });
  
  // }

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
      cc.director.loadScene("main");
      console.log('註冊成功');
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
        console.log("not exists!");
        const data = {
          email: userEmail,
          name: userName,
          coin: coin,
          userSkin: {
            normal: 1,
          },
          bombSkin: {
            normal: 1,
          },
          level: 1,
          gameNum: 0,
          winNum: 0,
        };
        firebase.database().ref(playersInfo).set(data);
      }
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
      cc.director.loadScene("main");
    }).catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
  }

  twoPeoeleMode() {
    console.log('twoPeoeleMode');
    cc.director.loadScene("loginP2");
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
