(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/CharacterMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '58831Oi+ARNBLU8YHN7nGxN', 'CharacterMgr', __filename);
// scripts/CharacterMgr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var UserInfo_1 = require("./UserInfo");
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
        _this.skinColorTable = {};
        _this.selectSkinIndex = 0;
        _this.selectBombIndex = 0;
        _this.userInfo = null;
        _this.userSkinCategory = _this.skinCategory;
        _this.userBombCategory = _this.bombCategory;
        return _this;
    }
    CharacterMgr.prototype.onLoad = function () {
        // this.init();
        record = cc.find("record").getComponent("record");
        if (record.currentPlayer === 'Player1') {
            this.currentSkinColor = record.player1Color;
            this.currentSkinCategory = record.player1Skin;
            this.currentBombCategory = record.player1Bomb;
        }
        if (record.currentPlayer === 'Player2') {
            this.currentSkinColor = record.player2Color;
            this.currentSkinCategory = record.player2Skin;
            this.currentBombCategory = record.player2Bomb;
        }
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
        var skinIndexArray = record.userSkinCategory;
        var bombIndexArray = record.userBombCategory;
        // console.log('skinIndexArray:', skinIndexArray);
        // console.log('bombIndexArray:', bombIndexArray);
        // if (record.currentPlayer) { // 有登入時(這個不代表有登入)
        //   this.userSkinCategory = []; // 把它清空
        //   this.userBombCategory = []; // 把它清空
        //   this.skinCategory.forEach(category => {
        //     skinIndexArray.forEach(theIndex => {
        //       const has = this.skinCategory[theIndex];
        //       if (category === has) {
        //         console.log(has);
        //         this.userSkinCategory.push(has);
        //       }
        //     });
        //   });
        //   this.bombCategory.forEach(category => {
        //     bombIndexArray.forEach(theIndex => {
        //       const has = this.bombCategory[theIndex];
        //       if (category === has) {
        //         console.log(has);
        //         this.userBombCategory.push(has);
        //       }
        //     });
        //   });
        // }
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=CharacterMgr.js.map
        