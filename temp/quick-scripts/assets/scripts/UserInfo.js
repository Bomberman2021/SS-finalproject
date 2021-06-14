(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UserInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '692a7sv66BOj5kPPrzuzcAx', 'UserInfo', __filename);
// scripts/UserInfo.ts

// declare const firebase: any;
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var record = null;
var UserInfo = /** @class */ (function (_super) {
    __extends(UserInfo, _super);
    function UserInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.userName = null;
        _this.userLevel = null;
        _this.userCoin = null;
        _this.currentPlayer = null;
        _this.userId = '';
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    UserInfo.prototype.onLoad = function () {
        record = cc.find("record").getComponent("record");
        var user = firebase.auth().currentUser;
        if (user) {
            this.getUserRecord(user.uid);
            this.userId = user.uid;
        }
        else {
            console.log('沒登入');
        }
        if (this.currentPlayer) {
            this.currentPlayer.string = record.currentPlayer;
            console.log('currentPlayer:', record.currentPlayer);
        }
    };
    UserInfo.prototype.start = function () {
    };
    UserInfo.prototype.getUserRecord = function (userId) {
        var _this = this;
        // 取基本資料
        var playersInfo = "/players/playerInfo-" + userId;
        firebase.database().ref(playersInfo).once('value')
            .then(function (snapshot) {
            // console.log('snapshot.val():', snapshot.val());
            var theData = snapshot.val();
            if (_this.userName && _this.userLevel && _this.userCoin) {
                _this.userName.string = theData.name.toUpperCase();
                _this.userLevel.string = theData.level;
                _this.userCoin.string = theData.coin;
            }
        })
            .catch(function (e) { return console.error(e.message); });
        // 取userSkin List
        var userSkinCategory = [];
        var playersUserSkin = "/players/playerInfo-" + userId + "/userSkin";
        firebase.database().ref(playersUserSkin).once('value')
            .then(function (snapshot) {
            snapshot.forEach(function (item) {
                var chiledData = item.val();
                userSkinCategory.push(chiledData.index);
            });
            record.userSkinCategory = userSkinCategory;
        })
            .catch(function (e) { return console.error(e.message); });
        // 取bombSkin List
        var userBombCategory = [];
        var playersBombSkin = "/players/playerInfo-" + userId + "/bombSkin";
        firebase.database().ref(playersBombSkin).once('value')
            .then(function (snapshot) {
            var theData = snapshot.val();
            snapshot.forEach(function (item) {
                var chiledData = item.val();
                userBombCategory.push(chiledData.index);
            });
            record.userBombCategory = userBombCategory;
        })
            .catch(function (e) { return console.error(e.message); });
    };
    __decorate([
        property(cc.Label)
    ], UserInfo.prototype, "userName", void 0);
    __decorate([
        property(cc.Label)
    ], UserInfo.prototype, "userLevel", void 0);
    __decorate([
        property(cc.Label)
    ], UserInfo.prototype, "userCoin", void 0);
    __decorate([
        property(cc.Label)
    ], UserInfo.prototype, "currentPlayer", void 0);
    UserInfo = __decorate([
        ccclass
    ], UserInfo);
    return UserInfo;
}(cc.Component));
exports.UserInfo = UserInfo;

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
        //# sourceMappingURL=UserInfo.js.map
        