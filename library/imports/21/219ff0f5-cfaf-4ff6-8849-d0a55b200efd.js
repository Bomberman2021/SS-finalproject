"use strict";
cc._RF.push(module, '219ffD1z69P9ohJ0KVbIA79', 'LoginSignup');
// scripts/LoginSignup.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LoginSignup = /** @class */ (function (_super) {
    __extends(LoginSignup, _super);
    function LoginSignup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.button = null;
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    LoginSignup.prototype.onLoad = function () {
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
    LoginSignup.prototype.start = function () {
    };
    LoginSignup.prototype.login = function () {
        console.log('login');
        cc.director.loadScene("main");
    };
    LoginSignup.prototype.signup = function () {
        console.log('signup');
        cc.director.loadScene("main");
    };
    LoginSignup.prototype.googleLogin = function () {
        console.log('googleLogin');
        cc.director.loadScene("main");
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
    LoginSignup = __decorate([
        ccclass
    ], LoginSignup);
    return LoginSignup;
}(cc.Component));
exports.default = LoginSignup;

cc._RF.pop();