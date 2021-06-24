"use strict";
cc._RF.push(module, '51884PtEHVM6o9tUciXy8n2', 'SwitchBtn');
// scripts/SwitchBtn.ts

Object.defineProperty(exports, "__esModule", { value: true });
var CharacterMgr_1 = require("./CharacterMgr");
// let record = null;
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
    SwitchBtn.prototype.onLoad = function () {
        // record = cc.find("record").getComponent("record");
    };
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
                if (this.characterMgr.selectSkinIndex > this.characterMgr.skinCategory.length - 1) {
                    this.characterMgr.selectSkinIndex = 0;
                }
            }
            this.seleteSkinCategory();
        }
        if (parentName === 'Bomb') {
            if (customEventData === 'turnRight') {
                this.characterMgr.selectBombIndex += 1;
                if (this.characterMgr.selectBombIndex > this.characterMgr.bombCategory.length - 1) {
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
                    this.characterMgr.selectSkinIndex = this.characterMgr.skinCategory.length - 1;
                }
            }
            this.seleteSkinCategory();
        }
        if (parentName === 'Bomb') {
            if (customEventData === 'turnLeft') {
                this.characterMgr.selectBombIndex -= 1;
                if (this.characterMgr.selectBombIndex < 0) {
                    this.characterMgr.selectBombIndex = this.characterMgr.bombCategory.length - 1;
                }
            }
            this.seleteBombCategory();
        }
    };
    SwitchBtn.prototype.seleteSkinCategory = function () {
        var _this = this;
        var categoryName = this.characterMgr.skinCategory[this.characterMgr.selectSkinIndex];
        this.characterMgr.skinCategory.forEach(function (allCategoryName) {
            cc.find("Canvas/Character/" + allCategoryName).active = false;
            cc.find("Canvas/Character/" + allCategoryName + "/disable").active = false;
            _this.characterMgr.skinColor.forEach(function (color) {
                cc.find("Canvas/Character/" + allCategoryName + "/" + color).active = false; // 把所有color都關掉
            });
            if (allCategoryName === categoryName) {
                cc.find("Canvas/Character/" + categoryName).active = true; // 把現在樣式打開
                cc.find("Canvas/Character/" + categoryName).getChildByName(_this.characterMgr.currentSkinColor).active = true; // 把現在的顏色打開
            }
        });
        this.characterMgr.skinAvailable = false;
        this.characterMgr.userSkinCategory.forEach(function (userCategoryIndex) {
            if (_this.characterMgr.selectSkinIndex === userCategoryIndex) {
                _this.characterMgr.skinAvailable = true;
            }
        });
        // console.log(this.characterMgr.skinAvailable);
        if (this.characterMgr.skinAvailable === false) {
            // this.characterMgr.skinColor.forEach(color => {
            //   cc.find(`Canvas/Character/${categoryName}/${color}`).active = false;// 把所有color都關掉 如果是以灰色代替的話 要打開
            // });
            cc.find("Canvas/Character/" + categoryName + "/disable").active = true; // 把灰色樣式打開
        }
        this.characterMgr.result();
    };
    SwitchBtn.prototype.seleteBombCategory = function () {
        var _this = this;
        var categoryName = this.characterMgr.bombCategory[this.characterMgr.selectBombIndex];
        this.characterMgr.bombCategory.forEach(function (category) {
            cc.find("Canvas/Bomb/" + category + "/" + category).active = false; // 把全部彩色樣式關閉
            cc.find("Canvas/Bomb/" + category + "/dis" + category).active = false; // 把全部灰色樣式關閉
            if (category === categoryName) {
                cc.find("Canvas/Bomb/" + categoryName + "/" + categoryName).active = true; // 把現在樣式打開
            }
        });
        this.characterMgr.bombAvailable = false;
        this.characterMgr.userBombCategory.forEach(function (userCategoryIndex) {
            if (_this.characterMgr.selectBombIndex === userCategoryIndex) {
                _this.characterMgr.bombAvailable = true;
            }
        });
        // console.log(this.characterMgr.bombAvailable);
        if (this.characterMgr.bombAvailable === false) {
            cc.find("Canvas/Bomb/" + categoryName + "/" + categoryName).active = false; // 把彩色樣式關閉
            cc.find("Canvas/Bomb/" + categoryName + "/dis" + categoryName).active = true; // 把灰色樣式打開
        }
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