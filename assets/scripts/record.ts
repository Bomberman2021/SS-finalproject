const {ccclass, property} = cc._decorator;

let hasPlayer2 = false;
let currentPlayer = 'Player1';

let player1Skin = 0;
let player1Bomb = 0;
let player1Color = 'black';

let player2Skin = 0;
let player2Bomb = 0;
let player2Color = 'black';

let userSkinCategory = [];
let userBombCategory = [];

let settingLife = '1';
let settingTime = '60';
let settingMap = 'map1';

let gameMode = '';

let winner = 'Player1';
let getCoin = '300';
let getExperience = '100';
let getAchievement = '總放置炸彈100顆';

@ccclass
export class record extends cc.Component {
  
  // LIFE-CYCLE CALLBACKS:
  
  onLoad () {
    cc.game.addPersistRootNode(this.node);
  }

  start () {

  }

  // update (dt) {}
}
