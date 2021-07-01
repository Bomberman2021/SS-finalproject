const {ccclass, property} = cc._decorator;

let userId = '';
let level = 1;
let gameNum = 0;
let experience = 0;

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

let gameMode = ''; // basicMode escapeMode chaseMode

// 結算資料：
let winner = 'Player1';
let getCoin = 300;
let getExperience = 100;
let	winType = '';
let	survivingTime = 0;

// 成就：
let	userAchievement = []; // index：0-15 共16個項目
// 0: 0, // 基本遊戲次數
// 1: 0, // 造型數量
// 2: 0, // 生涯累積金幣數量
// 3: 0, // 最高一場遊戲中獲得金幣數
// 4: 0, // 屍體數
// 5: 0, // 自殺數量
// 6: 0, // 放置炸彈數量（總數）
// 7: 0, // 撿取道具數量
// 8: 0, // 逃亡遊戲次數
// 9: 0, // 堅持時間
// 10: 0, // 最快跑速
// 11: 0, // 最多炸彈數量
// 12: 0, // 最快死亡
// 13: 0, // 最快殺人
// 14: 0, // 最快搜集
// 15: 0, // 最多暈眩


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
