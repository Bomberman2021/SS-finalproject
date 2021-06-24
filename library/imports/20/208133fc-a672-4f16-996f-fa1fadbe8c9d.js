"use strict";
cc._RF.push(module, '20813P8pnJPFplv+h+tvoyd', 'ColorSelete');
// scripts/ColorSelete.ts

Object.defineProperty(exports, "__esModule", { value: true });
var CharacterMgr_1 = require("./CharacterMgr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ColorSelete = /** @class */ (function (_super) {
    __extends(ColorSelete, _super);
    function ColorSelete() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.button = null;
        _this.label = null;
        _this.characterMgr = null;
        return _this;
        // update (dt) {}
    }
    // onLoad () {}
    ColorSelete.prototype.start = function () {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "ColorSelete";
        clickEventHandler.handler = "colorSelete";
        if (this.label) {
            clickEventHandler.customEventData = this.label.string;
            var button = this.node.getComponent(cc.Button);
            button.clickEvents.push(clickEventHandler);
        }
    };
    ColorSelete.prototype.colorSelete = function (event, customEventData) {
        var _this = this;
        this.characterMgr.currentSkinColor = customEventData;
        this.characterMgr.skinColor.forEach(function (color) {
            cc.find("Canvas/Character/" + _this.characterMgr.skinCategory[_this.characterMgr.selectSkinIndex]).getChildByName(color).active = false;
            if (color === customEventData) {
                cc.find("Canvas/Character/" + _this.characterMgr.skinCategory[_this.characterMgr.selectSkinIndex]).getChildByName(_this.characterMgr.currentSkinColor).active = true;
                console.log('currentSkinColor:', _this.characterMgr.currentSkinColor);
            }
        });
        this.characterMgr.result();
    };
    __decorate([
        property(cc.Button)
    ], ColorSelete.prototype, "button", void 0);
    __decorate([
        property(cc.Label)
    ], ColorSelete.prototype, "label", void 0);
    __decorate([
        property(CharacterMgr_1.CharacterMgr)
    ], ColorSelete.prototype, "characterMgr", void 0);
    ColorSelete = __decorate([
        ccclass
    ], ColorSelete);
    return ColorSelete;
}(cc.Component));
exports.default = ColorSelete;

cc._RF.pop();