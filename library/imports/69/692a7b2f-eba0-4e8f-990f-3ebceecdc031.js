"use strict";
cc._RF.push(module, '692a7sv66BOj5kPPrzuzcAx', 'UserInfo');
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
        if (!record.currentPlayer) {
            this.firstTimeStyle();
        }
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
        if (cc.find("Canvas/Player1/Character/normal")) {
            cc.find("Canvas/Player1/Character/normal").active = false; // 先把預設圖拿掉
            var player1Style = cc.find("Canvas/Player1/Character/" + record.player1Skin);
            player1Style.active = true;
            player1Style.getChildByName(record.player1Color).active = true;
            cc.find("Canvas/Player2/Character/normal").active = false; // 先把預設圖拿掉
            var player2Style = cc.find("Canvas/Player2/Character/" + record.player2Skin);
            player2Style.active = true;
            player2Style.getChildByName(record.player2Color).active = true;
        }
    };
    UserInfo.prototype.start = function () {
    };
    UserInfo.prototype.firstTimeStyle = function () {
        record.player1Skin = 'normal';
        record.player1Bomb = 'normal';
        record.player1Color = 'black';
        record.player2Skin = 'normal';
        record.player2Bomb = 'normal';
        record.player2Color = 'black';
        record.settingLife = '1';
        record.settingTime = '60';
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