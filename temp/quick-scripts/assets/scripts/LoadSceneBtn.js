(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/LoadSceneBtn.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd8a1cott2xAIJ+lY80TFdlG', 'LoadSceneBtn', __filename);
// scripts/LoadSceneBtn.ts

Object.defineProperty(exports, "__esModule", { value: true });
var UserInfo_1 = require("./UserInfo");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LoadSceneBtn = /** @class */ (function (_super) {
    __extends(LoadSceneBtn, _super);
    function LoadSceneBtn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.button = null;
        _this.label = null;
        _this.modeBlock = null;
        _this.player2Block = null;
        _this.info = null;
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    LoadSceneBtn.prototype.start = function () {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "ShowTipsArea";
        if (this.label.string === '2P MODE') {
            clickEventHandler.handler = "twoPeoeleMode";
        }
        if (this.label.string === 'Player 1') {
            clickEventHandler.handler = "character";
        }
        if (this.label.string === 'Player 2') {
            clickEventHandler.handler = "character";
        }
        if (this.label.string === 'DONE') {
            clickEventHandler.handler = "done";
        }
        var button = this.node.getComponent(cc.Button);
        button.clickEvents.push(clickEventHandler);
    };
    LoadSceneBtn.prototype.twoPeoeleMode = function () {
        console.log('twoPeoeleMode');
        if (!this.info.player2Mode) {
            this.player2Block.active = true;
            this.modeBlock.active = false;
            this.info.player2Mode = true;
            this.info.saveData();
        }
    };
    LoadSceneBtn.prototype.character = function () {
        console.log('character');
        cc.director.loadScene("character");
    };
    LoadSceneBtn.prototype.done = function () {
        console.log('done');
        cc.director.loadScene("main");
    };
    __decorate([
        property(cc.Button)
    ], LoadSceneBtn.prototype, "button", void 0);
    __decorate([
        property(cc.Label)
    ], LoadSceneBtn.prototype, "label", void 0);
    __decorate([
        property(cc.Node)
    ], LoadSceneBtn.prototype, "modeBlock", void 0);
    __decorate([
        property(cc.Node)
    ], LoadSceneBtn.prototype, "player2Block", void 0);
    __decorate([
        property(UserInfo_1.UserInfo)
    ], LoadSceneBtn.prototype, "info", void 0);
    LoadSceneBtn = __decorate([
        ccclass
    ], LoadSceneBtn);
    return LoadSceneBtn;
}(cc.Component));
exports.LoadSceneBtn = LoadSceneBtn;

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
        //# sourceMappingURL=LoadSceneBtn.js.map
        