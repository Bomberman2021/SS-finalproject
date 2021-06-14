(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/LoadSceneBtn.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd8a1cott2xAIJ+lY80TFdlG', 'LoadSceneBtn', __filename);
// scripts/LoadSceneBtn.ts

Object.defineProperty(exports, "__esModule", { value: true });
var CharacterMgr_1 = require("./CharacterMgr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var record = null;
var LoadSceneBtn = /** @class */ (function (_super) {
    __extends(LoadSceneBtn, _super);
    function LoadSceneBtn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.button = null;
        _this.label = null;
        _this.modeBlock = null;
        _this.player2Block = null;
        _this.characterMgr = null;
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    LoadSceneBtn.prototype.onLoad = function () {
        record = cc.find("record").getComponent("record");
        if (record.hasPlayer2) {
            if (this.player2Block && this.modeBlock) {
                this.player2Block.active = true;
                this.modeBlock.active = false;
            }
        }
    };
    LoadSceneBtn.prototype.start = function () {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "LoadSceneBtn";
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
            // if (3) { // 還沒選好衣服
            //   this.button.interactable = false;
            // }
            clickEventHandler.handler = "done";
        }
        clickEventHandler.customEventData = this.label.string;
        var button = this.node.getComponent(cc.Button);
        button.clickEvents.push(clickEventHandler);
    };
    LoadSceneBtn.prototype.twoPeoeleMode = function () {
        if (!record.hasPlayer2) {
            this.player2Block.active = true;
            this.modeBlock.active = false;
            record.hasPlayer2 = true;
        }
    };
    LoadSceneBtn.prototype.character = function () {
        if (this.label.string === 'Player 1') {
            record.currentPlayer = 'Player1';
        }
        if (this.label.string === 'Player 2') {
            record.currentPlayer = 'Player2';
        }
        console.log('character');
        cc.director.loadScene("character");
    };
    LoadSceneBtn.prototype.done = function () {
        // if (record.currentPlayer = 'Player1') {
        //   record.player1Skin = this.characterMgr.currentSkinCategory;
        //   record.player1Bomb = this.characterMgr.currentBombCategory;
        //   record.player1Color = this.characterMgr.currentSkinColor;
        // }
        // if (record.currentPlayer = 'Player2') {
        //   record.player2Skin = this.characterMgr.currentSkinCategory;
        //   record.player2Bomb = this.characterMgr.currentBombCategory;
        //   record.player2Color = this.characterMgr.currentSkinColor;
        // }
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
        property(CharacterMgr_1.CharacterMgr)
    ], LoadSceneBtn.prototype, "characterMgr", void 0);
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
        