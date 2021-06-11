"use strict";
cc._RF.push(module, '58831Oi+ARNBLU8YHN7nGxN', 'CharacterMgr');
// scripts/CharacterMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var UserInfo_1 = require("./UserInfo");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var CharacterMgr = /** @class */ (function (_super) {
    __extends(CharacterMgr, _super);
    function CharacterMgr() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.skinColor = ['black', 'blue', 'red', 'white']; // 全4種
        _this.skinCategory = ['normal', 'pirate', 'russian', 'boxer', 'brucelee', 'bullman',
            'caveman', 'cowboy', 'ebifry', 'egypt', 'mexican', 'ninja']; // 全12種
        _this.bombCategory = ['normal', 'bomb_icon_01', 'bomb_icon_02', 'bomb_icon_03',
            'bomb_icon_04', 'bomb1', 'bomb2', 'bomb3', 'bomb4']; // 全9種
        _this.currentSkinColor = 'black';
        _this.currentSkinCategory = 'normal';
        _this.currentBombCategory = 'normal';
        _this.skinColorTable = {};
        _this.selectSkinIndex = 0;
        _this.selectBombIndex = 0;
        _this.userInfo = null;
        _this.userSkinCategory = _this.skinCategory;
        _this.userBombCategory = _this.bombCategory;
        return _this;
    }
    CharacterMgr.prototype.onLoad = function () {
        this.init();
        cc.find("Canvas/Character/normal").active = false; // 先把預設圖拿掉
        var skinCategoryNode = cc.find("Canvas/Character/" + this.currentSkinCategory);
        skinCategoryNode.active = true;
        skinCategoryNode.getChildByName(this.currentSkinColor).active = true;
        cc.find("Canvas/Bomb/normal").active = false; // 先把預設圖拿掉
        var bombCategoryNode = cc.find("Canvas/Bomb/" + this.currentBombCategory);
        bombCategoryNode.active = true;
    };
    CharacterMgr.prototype.start = function () {
    };
    CharacterMgr.prototype.init = function () {
        var _this = this;
        var skinIndexArray = window.userSkinCategory;
        var bombIndexArray = window.userBombCategory;
        // console.log('skinIndexArray:', skinIndexArray);
        // console.log('bombIndexArray:', bombIndexArray);
        if (this.userInfo.userId !== '') { // 有登入時(這個不代表有登入)
            this.userSkinCategory = []; // 把它清空
            this.userBombCategory = []; // 把它清空
            this.skinCategory.forEach(function (category) {
                skinIndexArray.forEach(function (theIndex) {
                    var has = _this.skinCategory[theIndex];
                    if (category === has) {
                        console.log(has);
                        _this.userSkinCategory.push(has);
                    }
                });
            });
            this.bombCategory.forEach(function (category) {
                bombIndexArray.forEach(function (theIndex) {
                    var has = _this.bombCategory[theIndex];
                    if (category === has) {
                        console.log(has);
                        _this.userBombCategory.push(has);
                    }
                });
            });
        }
        console.log('userSkinCategory', this.userSkinCategory);
        console.log('userBombCategory', this.userBombCategory);
    };
    // update (dt) {}
    CharacterMgr.prototype.result = function () {
        console.log('---------------');
        console.log('color:', this.currentSkinColor);
        console.log('skin:', this.currentSkinCategory, 'index:', this.selectSkinIndex);
        console.log('bomb：', this.currentBombCategory, 'index:', this.selectBombIndex);
        console.log('---------------');
    };
    __decorate([
        property(UserInfo_1.UserInfo)
    ], CharacterMgr.prototype, "userInfo", void 0);
    CharacterMgr = __decorate([
        ccclass
    ], CharacterMgr);
    return CharacterMgr;
}(cc.Component));
exports.CharacterMgr = CharacterMgr;

cc._RF.pop();