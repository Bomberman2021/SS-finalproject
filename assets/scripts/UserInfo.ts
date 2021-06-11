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

  public userSkinCategory: string[] = ['normal'];
  public userBombCategory: string[] = ['normal'];

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
    // const playersUserSkin =`/players/playerInfo-${userId}/userSkin`;
    // firebase.database().ref(playersUserSkin).once('value')
    // .then((snapshot) => {
    //   const theData = snapshot.val();
    //   for (let index = 0; index < theData.length; index+=1) {
    //     this.userSkinCategory.push(theData.index);
    //   }
    //   console.log('this.userSkinCategory:', this.userSkinCategory);
    //   console.log('theData:', theData);
    // })
    // .catch((e) => console.error(e.message));

    // 取bombSkin List
    const playersBombSkin =`/players/playerInfo-${userId}/bombSkin`;
    firebase.database().ref(playersBombSkin).once('value')
    .then((snapshot) => {
      const theData = snapshot.val();
      for (let index = 0; index < theData.length; index+=1) {
        const item = theData[index];
        console.log('theData:', item.index);
        // this.userBombCategory.push(theData.index);
      }
      console.log('theData:', theData);
      
      // console.log('this.userBombCategory:', this.userBombCategory);
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
