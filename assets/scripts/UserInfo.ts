// import LoadSceneBtn from "./LoadSceneBtn";

const {ccclass, property} = cc._decorator;

@ccclass
export class UserInfo extends cc.Component {

  @property(cc.Label)
  userName: cc.Label = null;

  @property(cc.Label)
  userLevel: cc.Label = null;

  @property(cc.Label)
  userCoin: cc.Label = null;

  @property(cc.Label)
  currentPlayer: cc.Label = null;

  public userId: String = '';

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    const user = firebase.auth().currentUser;
    if (user) {
      this.getUserRecord(user.uid);
      this.userId = user.uid;
    } else {
      console.log('不對不對喔沒登入');
    }
    
    if (this.currentPlayer) { 
      this.currentPlayer.string = (window as any).currentPlayer;
      console.log('player:',this.currentPlayer.string);
    }
  }

  start () {
  }

  getUserRecord(userId) {
    const playersInfo = `/players/playerInfo-${userId}`;
    firebase.database().ref(playersInfo).once('value')
    .then((snapshot) => {
      // console.log('snapshot.val():', snapshot.val());
      
      const theData = snapshot.val();

      if(this.userName&&this.userLevel&&this.userCoin){
        this.userName.string = theData.name.toUpperCase();
        this.userLevel.string = theData.level;
        this.userCoin.string = theData.coin;
      }
      
    })
    .catch((e) => console.error(e.message));
  }

  saveData() {
    console.log('saveData');
    const playersInfo = `/players/playerInfo-${this.userId}`;
    
    const data = {
      // userCoin:  Number(this.userCoin.string),
    };
    firebase.database().ref(playersInfo).update(data);
  }





  // update (dt) {}
}
