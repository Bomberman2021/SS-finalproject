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

  public skinCategory: string[] = 
    ['normal', 'boxer', 'brucelee', 'bullman', 'caveman',
     'ebifry', 'egypt', 'mexican', 'ninja', 'pirate', 'russian']; // 全11種

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    record = cc.find("record").getComponent("record");
    
    if (!record.currentPlayer) {
      this.defaultStyle();
      this.testData();
    }
    
    const user = firebase.auth().currentUser;
    if (user) {
      this.getUserRecord(user.uid);
      record.userId = user.uid;
    } else {
      console.log('沒登入');
      if (!record.currentPlayer) { 
        this.testData();
      }
    }
    
    if (this.currentPlayer) {
      this.currentPlayer.string = record.currentPlayer;
      console.log('currentPlayer:',record.currentPlayer);
    }
    

    if (cc.find(`Canvas/Player1/Character`)) {
      cc.find(`Canvas/Player1/Character/normal`).active = false; // 先把預設圖拿掉
      let player1Style = cc.find(`Canvas/Player1/Character/${this.skinCategory[record.player1Skin]}`);
      player1Style.active = true;
      player1Style.getChildByName(record.player1Color).active = true;
      
      
      cc.find(`Canvas/Player2/Character/normal`).active = false; // 先把預設圖拿掉
      let player2Style = cc.find(`Canvas/Player2/Character/${this.skinCategory[record.player2Skin]}`);
      player2Style.active = true;
      player2Style.getChildByName(record.player2Color).active = true;
    }
  }

  // start () {}

  testData() {
    record.userSkinCategory = [0, 2, 8];
    record.userBombCategory = [0, 2];
    record.userAchievement = [0, 3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0];
    record.updateAchievementList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
  }

  defaultStyle() {
    record.currentPlayer = 'Player1';
    
    record.player1Skin = 0;
    record.player1Bomb = 0;
    record.player1Color = 'black';

    record.player2Skin = 0;
    record.player2Bomb = 0;
    record.player2Color = 'black';

    record.settingLife = '1';
    record.settingTime = '60';
    record.settingMap = 'map1';

    // ------- 還沒串好的話會用到這個假資料
    record.result = 'result'
    record.winner = 'UserInfo';
    record.getCoin = 150;
    record.getExperience = 300;
    record.survivingTime = 0;
    record.winType = 'winType';

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

        record.level = theData.level;
        record.gameNum = theData.gameNum;
        record.experience = theData.experience; 
        record.coin = theData.coin;
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
      snapshot.forEach(item => {
        const chiledData = item.val();
        userBombCategory.push(chiledData.index);
      });
      record.userBombCategory = userBombCategory;
    })
    .catch((e) => console.error(e.message));

    // 取achievement List
    let userAchievement = [];
    const playersAchievement =`/players/playerInfo-${userId}/userAchievement`;
    firebase.database().ref(playersAchievement).once('value')
    .then((snapshot) => {
      const theData = snapshot.val();
      console.log('theData:', theData);
      record.userAchievement = theData;
    })
    .catch((e) => console.error(e.message));
  }

  // update (dt) {}
}
