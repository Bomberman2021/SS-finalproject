"use strict";
cc._RF.push(module, '692a7sv66BOj5kPPrzuzcAx', 'UserInfo');
// scripts/UserInfo.ts

// import LoadSceneBtn from "./LoadSceneBtn";
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var UserInfo = /** @class */ (function (_super) {
    __extends(UserInfo, _super);
    function UserInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.userName = null;
        _this.userLevel = null;
        _this.userCoin = null;
        _this.currentPlayer = null;
        _this.userId = '';
        _this.userSkinCategory = ['normal'];
        _this.userBombCategory = ['normal'];
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    UserInfo.prototype.onLoad = function () {
        var user = firebase.auth().currentUser;
        if (user) {
            this.getUserRecord(user.uid);
            this.userId = user.uid;
        }
        else {
            console.log('不對不對喔沒登入');
        }
        if (this.currentPlayer) {
            this.currentPlayer.string = window.currentPlayer;
            console.log('player:', this.currentPlayer.string);
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
        // const playersUserSkin =`/players/playerInfo-${userId}/userSkin`;
        // firebase.database().ref(playersUserSkin).once('value')
        // .then((snapshot) => {
        //   const theData = snapshot.val();
        //   for (let index = 0; index < theData.length; index+=1) {
        //     this.userSkinCategory.push(theData.index);
        //   }
        //   console.log('this.userSkinCategory:', this.userSkinCategory);
        //   console.log('theData:', theData);
        // })
        // .catch((e) => console.error(e.message));
        // 取bombSkin List
        var playersBombSkin = "/players/playerInfo-" + userId + "/bombSkin";
        firebase.database().ref(playersBombSkin).once('value')
            .then(function (snapshot) {
            var theData = snapshot.val();
            for (var index = 0; index < theData.length; index += 1) {
                var item = theData[index];
                console.log('theData:', item.index);
                // this.userBombCategory.push(theData.index);
            }
            console.log('theData:', theData);
            // console.log('this.userBombCategory:', this.userBombCategory);
        })
            .catch(function (e) { return console.error(e.message); });
    };
    UserInfo.prototype.saveData = function () {
        console.log('saveData');
        var playersInfo = "/players/playerInfo-" + this.userId;
        var data = {
        // userCoin:  Number(this.userCoin.string),
        };
        firebase.database().ref(playersInfo).update(data);
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