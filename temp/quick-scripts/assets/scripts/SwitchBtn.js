(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/SwitchBtn.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '51884PtEHVM6o9tUciXy8n2', 'SwitchBtn', __filename);
// scripts/SwitchBtn.ts

Object.defineProperty(exports, "__esModule", { value: true });
var CharacterMgr_1 = require("./CharacterMgr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var SwitchBtn = /** @class */ (function (_super) {
    __extends(SwitchBtn, _super);
    function SwitchBtn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rightButton = null;
        _this.rightLabel = null;
        _this.leftButton = null;
        _this.leftLabel = null;
        _this.characterMgr = null;
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    SwitchBtn.prototype.start = function () {
        var turnRightHandler = new cc.Component.EventHandler();
        turnRightHandler.target = this.node;
        turnRightHandler.component = "SwitchBtn";
        turnRightHandler.handler = "turnRight";
        turnRightHandler.customEventData = this.rightLabel.string;
        this.rightButton.clickEvents.push(turnRightHandler);
        var turnLeftHandler = new cc.Component.EventHandler();
        turnLeftHandler.target = this.node;
        turnLeftHandler.component = "SwitchBtn";
        turnLeftHandler.handler = "turnLeft";
        turnLeftHandler.customEventData = this.leftLabel.string;
        this.leftButton.clickEvents.push(turnLeftHandler);
    };
    SwitchBtn.prototype.turnRight = function (event, customEventData) {
        console.log(customEventData);
        if (customEventData === 'turnRight') {
            this.characterMgr.selectNum += 1;
            if (this.characterMgr.selectNum > this.characterMgr.skinCategory.length - 1) {
                this.characterMgr.selectNum = 0;
            }
        }
        this.seleteCategory();
    };
    SwitchBtn.prototype.turnLeft = function (event, customEventData) {
        console.log(customEventData);
        if (customEventData === 'turnLeft') {
            this.characterMgr.selectNum -= 1;
            if (this.characterMgr.selectNum < 0) {
                this.characterMgr.selectNum = this.characterMgr.skinCategory.length - 1;
            }
        }
        this.seleteCategory();
    };
    SwitchBtn.prototype.seleteCategory = function () {
        var _this = this;
        var categoryName = this.characterMgr.skinCategory[this.characterMgr.selectNum];
        console.log(this.characterMgr.selectNum, ':', categoryName);
        this.characterMgr.skinCategory.forEach(function (category) {
            cc.find("Canvas/Character/" + category).active = false;
            if (category === categoryName) {
                _this.characterMgr.currentSkinCategory = categoryName; // 確定現在的樣式
                var skinCategory_1 = cc.find("Canvas/Character/" + _this.characterMgr.currentSkinCategory);
                skinCategory_1.active = true; // 把現在樣式打開
                _this.characterMgr.skinColor.forEach(function (color) {
                    skinCategory_1.getChildByName(color).active = false; // 把所有color都關掉
                });
                skinCategory_1.getChildByName(_this.characterMgr.currentSkinColor).active = true; // 把現在的顏色打開
            }
        });
        this.characterMgr.result();
    };
    __decorate([
        property(cc.Button)
    ], SwitchBtn.prototype, "rightButton", void 0);
    __decorate([
        property(cc.Label)
    ], SwitchBtn.prototype, "rightLabel", void 0);
    __decorate([
        property(cc.Button)
    ], SwitchBtn.prototype, "leftButton", void 0);
    __decorate([
        property(cc.Label)
    ], SwitchBtn.prototype, "leftLabel", void 0);
    __decorate([
        property(CharacterMgr_1.CharacterMgr)
    ], SwitchBtn.prototype, "characterMgr", void 0);
    SwitchBtn = __decorate([
        ccclass
    ], SwitchBtn);
    return SwitchBtn;
}(cc.Component));
exports.default = SwitchBtn;

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
        //# sourceMappingURL=SwitchBtn.js.map
        