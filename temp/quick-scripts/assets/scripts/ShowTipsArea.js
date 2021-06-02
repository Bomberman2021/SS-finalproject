(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/ShowTipsArea.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3ec89xTo81HLbCUb03WHJw7', 'ShowTipsArea', __filename);
// scripts/ShowTipsArea.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ShowTipsArea = /** @class */ (function (_super) {
    __extends(ShowTipsArea, _super);
    function ShowTipsArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.Player1TipsBlock = null;
        _this.Player2TipsBlock = null;
        _this.button = null;
        _this.inTipArea1 = false;
        _this.inTipArea2 = false;
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    ShowTipsArea.prototype.onLoad = function () {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "ShowTipsArea";
        clickEventHandler.handler = "toggleTipsArea";
        if (this.label) {
            clickEventHandler.customEventData = this.label.string;
        }
        var button = this.node.getComponent(cc.Button);
        button.clickEvents.push(clickEventHandler);
    };
    ShowTipsArea.prototype.start = function () {
    };
    ShowTipsArea.prototype.toggleTipsArea = function (event, customEventData) {
        console.log('toggleTipsArea', customEventData);
        if (customEventData === 'Player 1') {
            this.inTipArea1 = !this.inTipArea1;
            if (this.inTipArea1) {
                this.Player1TipsBlock.active = true;
            }
            else {
                this.Player1TipsBlock.active = false;
            }
        }
        if (customEventData === 'Player 2') {
            this.inTipArea2 = !this.inTipArea2;
            if (this.inTipArea2) {
                this.Player2TipsBlock.active = true;
            }
            else {
                this.Player2TipsBlock.active = false;
            }
        }
    };
    __decorate([
        property(cc.Label)
    ], ShowTipsArea.prototype, "label", void 0);
    __decorate([
        property(cc.Node)
    ], ShowTipsArea.prototype, "Player1TipsBlock", void 0);
    __decorate([
        property(cc.Node)
    ], ShowTipsArea.prototype, "Player2TipsBlock", void 0);
    __decorate([
        property(cc.Button)
    ], ShowTipsArea.prototype, "button", void 0);
    ShowTipsArea = __decorate([
        ccclass
    ], ShowTipsArea);
    return ShowTipsArea;
}(cc.Component));
exports.default = ShowTipsArea;

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
        //# sourceMappingURL=ShowTipsArea.js.map
        