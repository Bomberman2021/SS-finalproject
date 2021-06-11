"use strict";
cc._RF.push(module, '58831Oi+ARNBLU8YHN7nGxN', 'CharacterMgr');
// scripts/CharacterMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var CharacterMgr = /** @class */ (function (_super) {
    __extends(CharacterMgr, _super);
    function CharacterMgr() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.skinCategory = ['normal', 'pirate', 'russian', 'boxer', 'brucelee', 'bullman',
            'caveman', 'cowboy', 'ebifry', 'egypt', 'mexican', 'ninja']; // 全12種
        _this.skinColor = ['black', 'blue', 'red', 'white']; // 全4種
        _this.bombCategory = ['normal']; // 全?種
        _this.currentSkinCategory = 'normal';
        _this.currentSkinColor = 'black';
        _this.skinColorTable = {};
        _this.selectNum = 0;
        return _this;
    }
    // public userSkinCategory: string[] = ['normal'];
    // public userBombCategory: string[] = ['normal'];
    CharacterMgr.prototype.onLoad = function () {
        cc.find("Canvas/Character/normal").active = false; // 先把預設圖拿掉
        var skinCategoryNode = cc.find("Canvas/Character/" + this.currentSkinCategory);
        skinCategoryNode.active = true;
        skinCategoryNode.getChildByName(this.currentSkinColor).active = true;
        // this.makeColorTable();
    };
    CharacterMgr.prototype.start = function () {
    };
    // makeColorTable() {
    //   this.skinColor.forEach(item => {
    //     this.skinColorTable[item] = true
    //   });
    //   console.log(this.skinColorTable);
    // }
    // update (dt) {}
    CharacterMgr.prototype.result = function () {
        console.log('---------------');
        console.log(this.currentSkinColor, ':', this.currentSkinCategory);
        console.log('---------------');
    };
    CharacterMgr = __decorate([
        ccclass
    ], CharacterMgr);
    return CharacterMgr;
}(cc.Component));
exports.CharacterMgr = CharacterMgr;

cc._RF.pop();