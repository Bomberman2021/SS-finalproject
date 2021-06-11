"use strict";
cc._RF.push(module, '51884PtEHVM6o9tUciXy8n2', 'SwitchBtn');
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
        var parentName = this.node.parent.name;
        if (parentName === 'Character') {
            if (customEventData === 'turnRight') {
                this.characterMgr.selectSkinIndex += 1;
                if (this.characterMgr.selectSkinIndex > this.characterMgr.userSkinCategory.length - 1) {
                    this.characterMgr.selectSkinIndex = 0;
                }
            }
            this.seleteSkinCategory();
        }
        if (parentName === 'Bomb') {
            if (customEventData === 'turnRight') {
                this.characterMgr.selectBombIndex += 1;
                if (this.characterMgr.selectBombIndex > this.characterMgr.userBombCategory.length - 1) {
                    this.characterMgr.selectBombIndex = 0;
                }
            }
            this.seleteBombCategory();
        }
    };
    SwitchBtn.prototype.turnLeft = function (event, customEventData) {
        var parentName = this.node.parent.name;
        if (parentName === 'Character') {
            if (customEventData === 'turnLeft') {
                this.characterMgr.selectSkinIndex -= 1;
                if (this.characterMgr.selectSkinIndex < 0) {
                    this.characterMgr.selectSkinIndex = this.characterMgr.userSkinCategory.length - 1;
                }
            }
            this.seleteSkinCategory();
        }
        if (parentName === 'Bomb') {
            if (customEventData === 'turnLeft') {
                this.characterMgr.selectBombIndex -= 1;
                if (this.characterMgr.selectBombIndex < 0) {
                    this.characterMgr.selectBombIndex = this.characterMgr.userBombCategory.length - 1;
                }
            }
            this.seleteBombCategory();
        }
    };
    SwitchBtn.prototype.seleteSkinCategory = function () {
        var _this = this;
        var categoryName = this.characterMgr.userSkinCategory[this.characterMgr.selectSkinIndex];
        // console.log(this.characterMgr.selectSkinIndex, ':' , categoryName);
        this.characterMgr.userSkinCategory.forEach(function (category) {
            cc.find("Canvas/Character/" + category).active = false;
            if (category === categoryName) {
                _this.characterMgr.currentSkinCategory = categoryName; // 確定現在的樣式
                var userSkinCategory_1 = cc.find("Canvas/Character/" + _this.characterMgr.currentSkinCategory);
                userSkinCategory_1.active = true; // 把現在樣式打開
                _this.characterMgr.skinColor.forEach(function (color) {
                    userSkinCategory_1.getChildByName(color).active = false; // 把所有color都關掉
                });
                userSkinCategory_1.getChildByName(_this.characterMgr.currentSkinColor).active = true; // 把現在的顏色打開
            }
        });
        this.characterMgr.result();
    };
    SwitchBtn.prototype.seleteBombCategory = function () {
        var _this = this;
        var categoryName = this.characterMgr.userBombCategory[this.characterMgr.selectBombIndex];
        // console.log(this.characterMgr.selectBombIndex, ':' , categoryName);
        this.characterMgr.userBombCategory.forEach(function (category) {
            cc.find("Canvas/Bomb/" + category).active = false;
            if (category === categoryName) {
                _this.characterMgr.currentBombCategory = categoryName; // 確定現在的樣式
                var userBombCategory = cc.find("Canvas/Bomb/" + _this.characterMgr.currentBombCategory);
                userBombCategory.active = true; // 把現在樣式打開
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