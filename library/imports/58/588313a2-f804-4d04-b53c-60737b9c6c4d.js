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
        _this.done = null;
        _this.skinColor = ['black', 'blue', 'red', 'white']; // 全4種
        _this.skinCategory = ['normal', 'boxer', 'brucelee', 'bullman', 'caveman',
            'ebifry', 'egypt', 'mexican', 'ninja', 'pirate', 'russian']; // 全11種
        _this.bombCategory = ['normal', 'bomb1', 'bomb2', 'bomb3', 'bomb4']; // 全5種
        _this.currentSkinColor = 'black';
        // skinCategory[selectSkinIndex] = 0;
        // bombCategory[selectBombIndex] = 0;
        _this.skinColorTable = {};
        _this.selectSkinIndex = 0;
        _this.selectBombIndex = 0;
        _this.skinAvailable = false;
        _this.bombAvailable = false;
        _this.userSkinCategory = [];
        _this.userBombCategory = [];
        return _this;
    }
    CharacterMgr.prototype.onLoad = function () {
        record = cc.find("record").getComponent("record");
        this.init();
        console.log('record.currentPlayer:', record.currentPlayer);
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
        cc.find("Canvas/Bomb/normal/normal").active = false; // 先把預設圖拿掉
        var bombCategoryNode = cc.find("Canvas/Bomb/" + this.bombCategory[this.selectBombIndex] + "/" + this.bombCategory[this.selectBombIndex]);
        bombCategoryNode.active = true;
    };
    CharacterMgr.prototype.start = function () {
    };
    CharacterMgr.prototype.init = function () {
        this.skinAvailable = true;
        this.bombAvailable = true;
        this.userSkinCategory = record.userSkinCategory;
        this.userBombCategory = record.userBombCategory;
        console.log('userSkinCategory', this.userSkinCategory);
        console.log('userBombCategory', this.userBombCategory); // Index
    };
    // update (dt) {}
    CharacterMgr.prototype.result = function () {
        if (this.skinAvailable && this.bombAvailable) {
            this.done.getComponent("LoadSceneBtn").doneOpen();
        }
        else {
            this.done.getComponent("LoadSceneBtn").doneClose();
        }
        console.log('---------------');
        console.log('color:', this.currentSkinColor);
        console.log('skin:', this.selectSkinIndex);
        console.log('bomb：', this.selectBombIndex);
        console.log('---------------');
    };
    __decorate([
        property(cc.Node)
    ], CharacterMgr.prototype, "done", void 0);
    CharacterMgr = __decorate([
        ccclass
    ], CharacterMgr);
    return CharacterMgr;
}(cc.Component));
exports.CharacterMgr = CharacterMgr;

cc._RF.pop();