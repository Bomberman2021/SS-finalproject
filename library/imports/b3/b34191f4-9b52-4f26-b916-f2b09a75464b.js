"use strict";
cc._RF.push(module, 'b3419H0m1JPJrkW8rCadUZL', 'SeletGameSetting');
// scripts/SeletGameSetting.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var record = null;
var SeletGameSetting = /** @class */ (function (_super) {
    __extends(SeletGameSetting, _super);
    function SeletGameSetting() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.parentslabel = null;
        _this.button = null;
        _this.label = null;
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    SeletGameSetting.prototype.onLoad = function () {
        record = cc.find("record").getComponent("record");
    };
    SeletGameSetting.prototype.start = function () {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "SeletGameSetting";
        if (this.parentslabel.string === 'Life') {
            clickEventHandler.handler = "setLife";
        }
        if (this.parentslabel.string === 'Time') {
            clickEventHandler.handler = "setTime";
        }
        if (this.label) {
            clickEventHandler.customEventData = this.label.string;
        }
        var button = this.node.getComponent(cc.Button);
        button.clickEvents.push(clickEventHandler);
    };
    SeletGameSetting.prototype.setLife = function (event, customEventData) {
        record.settingLife = customEventData;
        console.log(record.settingLife, record.settingTime);
    };
    SeletGameSetting.prototype.setTime = function (event, customEventData) {
        record.settingTime = customEventData;
        console.log(record.settingLife, record.settingTime);
    };
    __decorate([
        property(cc.Label)
    ], SeletGameSetting.prototype, "parentslabel", void 0);
    __decorate([
        property(cc.Button)
    ], SeletGameSetting.prototype, "button", void 0);
    __decorate([
        property(cc.Label)
    ], SeletGameSetting.prototype, "label", void 0);
    SeletGameSetting = __decorate([
        ccclass
    ], SeletGameSetting);
    return SeletGameSetting;
}(cc.Component));
exports.SeletGameSetting = SeletGameSetting;

cc._RF.pop();