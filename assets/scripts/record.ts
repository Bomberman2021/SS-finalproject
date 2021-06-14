const {ccclass, property} = cc._decorator;

let hasPlayer2 = false;
let currentPlayer = 'Player1';

let player1Skin = 'normal';
let player1Bomb = 'normal';
let player1Color = 'black';

let player2Skin = 'normal';
let player2Bomb = 'normal';
let player2Color = 'black';

let userSkinCategory = [];
let userBombCategory = [];

let settingLife = '1';
let settingTime = '60';

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
