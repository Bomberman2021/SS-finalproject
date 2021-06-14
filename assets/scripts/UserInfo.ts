// declare const firebase: any;

const {ccclass, property} = cc._decorator;
let record = null;

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
    record = cc.find("record").getComponent("record");
    
    const user = firebase.auth().currentUser;
    if (user) {
      this.getUserRecord(user.uid);
      this.userId = user.uid;
    } else {
      console.log('沒登入');
    }
    
    if (this.currentPlayer) {
      this.currentPlayer.string = record.currentPlayer;
      console.log('currentPlayer:',record.currentPlayer);
    }
  }

  start () {
  }

  getUserRecord(userId) {
    // 取基本資料
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

    // 取userSkin List
    let userSkinCategory = [];
    const playersUserSkin =`/players/playerInfo-${userId}/userSkin`;
    firebase.database().ref(playersUserSkin).once('value')
    .then((snapshot) => {
      snapshot.forEach(item => {
        const chiledData = item.val();
        userSkinCategory.push(chiledData.index);
      });
      record.userSkinCategory = userSkinCategory;
    })
    .catch((e) => console.error(e.message));

    // 取bombSkin List
    let userBombCategory = [];
    const playersBombSkin =`/players/playerInfo-${userId}/bombSkin`;
    firebase.database().ref(playersBombSkin).once('value')
    .then((snapshot) => {
      const theData = snapshot.val();
      snapshot.forEach(item => {
        const chiledData = item.val();
        userBombCategory.push(chiledData.index);
      });
      record.userBombCategory = userBombCategory;
    })
    .catch((e) => console.error(e.message));
  }

  // update (dt) {}
}
