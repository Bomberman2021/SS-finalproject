(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/LoginSignup.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '219ffD1z69P9ohJ0KVbIA79', 'LoginSignup', __filename);
// scripts/LoginSignup.ts

Object.defineProperty(exports, "__esModule", { value: true });
// import firebase from "../firebase";
var Editbox_1 = require("./Editbox");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LoginSignup = /** @class */ (function (_super) {
    __extends(LoginSignup, _super);
    function LoginSignup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.button = null;
        _this.emailEditBox = null;
        _this.passwordEditBox = null;
        _this.modeBlock = null;
        _this.player2Block = null;
        _this.player2Mode = false;
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    LoginSignup.prototype.onLoad = function () {
        this.setupAuth();
        if (this.player2Mode) {
            this.player2Block.active = true;
            this.modeBlock.active = false;
        }
    };
    LoginSignup.prototype.start = function () {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "ShowTipsArea";
        if (this.label.string === 'SIGNUP') {
            clickEventHandler.handler = "signup";
        }
        if (this.label.string === 'LOGIN') {
            clickEventHandler.handler = "login";
        }
        if (this.label.string === 'GOOGLE') {
            clickEventHandler.handler = "googleLogin";
        }
        if (this.label.string === '2P MODE') {
            clickEventHandler.handler = "twoPeoeleMode";
        }
        if (this.label.string === 'Player 1') { // -------------- test-----------------
            clickEventHandler.handler = "character";
        }
        if (this.label.string === 'Player 2') { // -------------- test-----------------
            clickEventHandler.handler = "character";
        }
        if (this.label.string === 'DONE') { // -------------- test-----------------
            clickEventHandler.handler = "done";
        }
        var button = this.node.getComponent(cc.Button);
        button.clickEvents.push(clickEventHandler);
    };
    LoginSignup.prototype.setupAuth = function () {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('登入成功');
            }
            else {
                console.log('已登出');
            }
        });
    };
    LoginSignup.prototype.login = function () {
        console.log('login');
        var userEmail = this.emailEditBox.inputText;
        var userPassword = this.passwordEditBox.inputText;
        console.log(userEmail);
        console.log(userPassword);
        firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).then(function (result) {
            console.log('login result:', result);
            userEmail = '';
            userPassword = '';
            cc.director.loadScene("main");
        }).catch(function (error) {
            var errorMessage = error.message;
            console.log(errorMessage);
            userEmail = '';
            userPassword = '';
        });
    };
    LoginSignup.prototype.signup = function () {
        var _this = this;
        console.log('signup');
        var userEmail = this.emailEditBox.inputText;
        var userPassword = this.passwordEditBox.inputText;
        var cutIndex = userEmail.search('@');
        var userNickname = userEmail.substring(0, cutIndex);
        console.log(userNickname);
        console.log(userEmail);
        console.log(userPassword);
        firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then(function (newUser) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, newUser.user.updateProfile({ displayName: userNickname })];
                    case 1:
                        _a.sent();
                        this.makeNewRecord(userEmail, newUser.user.uid, userNickname, 0);
                        cc.director.loadScene("main");
                        console.log('註冊成功');
                        return [2 /*return*/];
                }
            });
        }); }).catch(function (error) {
            var errorMessage = error.message;
            console.log(errorMessage);
        });
    };
    LoginSignup.prototype.makeNewRecord = function (userEmail, userId, userName, coin) {
        var playersInfo = "/players/playerInfo-" + userId;
        firebase.database().ref(playersInfo).once("value", function (snapshot) {
            if (snapshot.exists()) {
                console.log("exists!");
            }
            else {
                console.log("not exists!");
                var data = {
                    email: userEmail,
                    name: userName,
                    coin: coin,
                    level: 1,
                    gameNum: 0,
                    winNum: 0,
                };
                firebase.database().ref(playersInfo).set(data);
                var playersUserSkin = "/players/playerInfo-" + userId + "/userSkin";
                var userSkin = { index: 0, };
                firebase.database().ref(playersUserSkin).push(userSkin);
                var playersBombSkin = "/players/playerInfo-" + userId + "/bombSkin";
                var bombSkin = { index: 0, };
                firebase.database().ref(playersBombSkin).push(bombSkin);
            }
        });
    };
    LoginSignup.prototype.googleLogin = function () {
        var _this = this;
        console.log('googleLogin');
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
            var userEmail, userUid, cutIndex, userNickname;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userEmail = result.user.email;
                        userUid = result.user.uid;
                        cutIndex = userEmail.search('@');
                        userNickname = userEmail.substring(0, cutIndex);
                        return [4 /*yield*/, result.user.updateProfile({ displayName: userNickname })];
                    case 1:
                        _a.sent();
                        this.makeNewRecord(userEmail, userUid, userNickname, 0);
                        cc.director.loadScene("main");
                        return [2 /*return*/];
                }
            });
        }); }).catch(function (error) {
            var errorMessage = error.message;
            console.log(errorMessage);
        });
    };
    LoginSignup.prototype.signOut = function () {
        firebase.auth().signOut().then(function () {
            var user = firebase.auth().currentUser;
            if (user) {
                console.log('正在登入狀態');
            }
            else {
                console.log('登出成功');
            }
        }).catch(function (error) {
            var errorMessage = error.message;
            console.log(errorMessage);
        });
    };
    LoginSignup.prototype.twoPeoeleMode = function () {
        console.log('twoPeoeleMode');
        if (!this.player2Mode) {
            this.player2Block.active = true;
            this.modeBlock.active = false;
            this.player2Mode = true;
        }
    };
    LoginSignup.prototype.character = function () {
        console.log('character');
        cc.director.loadScene("character");
    };
    LoginSignup.prototype.done = function () {
        console.log('done');
        cc.director.loadScene("main");
    };
    __decorate([
        property(cc.Label)
    ], LoginSignup.prototype, "label", void 0);
    __decorate([
        property(cc.Button)
    ], LoginSignup.prototype, "button", void 0);
    __decorate([
        property(Editbox_1.Editbox)
    ], LoginSignup.prototype, "emailEditBox", void 0);
    __decorate([
        property(Editbox_1.Editbox)
    ], LoginSignup.prototype, "passwordEditBox", void 0);
    __decorate([
        property(cc.Node)
    ], LoginSignup.prototype, "modeBlock", void 0);
    __decorate([
        property(cc.Node)
    ], LoginSignup.prototype, "player2Block", void 0);
    LoginSignup = __decorate([
        ccclass
    ], LoginSignup);
    return LoginSignup;
}(cc.Component));
exports.default = LoginSignup;

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
        //# sourceMappingURL=LoginSignup.js.map
        