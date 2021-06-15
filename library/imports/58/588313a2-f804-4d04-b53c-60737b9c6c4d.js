"use strict";
cc._RF.push(module, '58831Oi+ARNBLU8YHN7nGxN', 'CharacterMgr');
// scripts/CharacterMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var record = null;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var CharacterMgr = /** @class */ (function (_super) {
    __extends(CharacterMgr, _super);
    function CharacterMgr() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.skinColor = ['black', 'blue', 'red', 'white']; // 全4種
        _this.skinCategory = ['normal', 'boxer', 'brucelee', 'bullman', 'caveman',
            'ebifry', 'egypt', 'mexican', 'ninja', 'pirate', 'russian']; // 全11種
        _this.bombCategory = ['normal', 'bomb_icon_01', 'bomb_icon_02', 'bomb_icon_03', 'bomb_icon_04']; // 全5種
        _this.currentSkinColor = 'black';
        _this.currentSkinCategory = 'normal';
        _this.currentBombCategory = 'normal';
        // skinCategory[selectSkinIndex]
        // bombCategory[selectBombIndex]
        _this.skinColorTable = {};
        _this.selectSkinIndex = 0;
        _this.selectBombIndex = 0;
        _this.userSkinCategory = _this.skinCategory;
        _this.userBombCategory = _this.bombCategory;
        return _this;
    }
    CharacterMgr.prototype.onLoad = function () {
        record = cc.find("record").getComponent("record");
        this.init();
        if (record.currentPlayer === 'Player1') {
            this.currentSkinColor = record.player1Color;
            this.selectSkinIndex = record.player1Skin;
            this.selectBombIndex = record.player1Bomb;
        }
        if (record.currentPlayer === 'Player2') {
            this.currentSkinColor = record.player2Color;
            this.selectSkinIndex = record.player2Skin;
            this.selectBombIndex = record.player2Bomb;
        }
        cc.find("Canvas/Character/normal").active = false; // 先把預設圖拿掉
        var skinCategoryNode = cc.find("Canvas/Character/" + this.skinCategory[this.selectSkinIndex]);
        skinCategoryNode.active = true;
        skinCategoryNode.getChildByName(this.currentSkinColor).active = true;
        cc.find("Canvas/Bomb/normal").active = false; // 先把預設圖拿掉
        var bombCategoryNode = cc.find("Canvas/Bomb/" + this.bombCategory[this.selectBombIndex]);
        bombCategoryNode.active = true;
    };
    CharacterMgr.prototype.start = function () {
    };
    CharacterMgr.prototype.init = function () {
        this.userSkinCategory = record.userSkinCategory;
        this.userBombCategory = record.userBombCategory;
        console.log('userSkinCategory', this.userSkinCategory);
        console.log('userBombCategory', this.userBombCategory); // Index
        // index轉成name的過程 -------------------------------------
        // const skinIndexArray = record.userSkinCategory;
        // const bombIndexArray = record.userBombCategory;
        // this.userSkinCategory = []; // 把它清空
        // this.userBombCategory = []; // 把它清空
        // this.skinCategory.forEach(category => {
        //   skinIndexArray.forEach(theIndex => {
        //     const has = this.skinCategory[theIndex];
        //     if (category === has) {
        //       this.userSkinCategory.push(has);
        //     }
        //   });
        // });
        // this.bombCategory.forEach(category => {
        //   bombIndexArray.forEach(theIndex => {
        //     const has = this.bombCategory[theIndex];
        //     if (category === has) {
        //       this.userBombCategory.push(has);
        //     }
        //   });
        // });
        // console.log('userSkinCategory',this.userSkinCategory);
        // console.log('userBombCategory',this.userBombCategory); // name
        // index轉成name的過程 -------------------------------------
    };
    // update (dt) {}
    CharacterMgr.prototype.result = function () {
        console.log('---------------');
        console.log('color:', this.currentSkinColor);
        console.log('skin:', this.currentSkinCategory, 'index:', this.selectSkinIndex);
        console.log('bomb：', this.currentBombCategory, 'index:', this.selectBombIndex);
        console.log('---------------');
    };
    CharacterMgr = __decorate([
        ccclass
    ], CharacterMgr);
    return CharacterMgr;
}(cc.Component));
exports.CharacterMgr = CharacterMgr;

cc._RF.pop();