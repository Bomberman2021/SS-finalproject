"use strict";
cc._RF.push(module, 'efdd9AA4aBGRr6PMUTLKmmk', 'SkinPageSwitches_manager');
// scripts/SkinPageSwitches_manager.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.skinPage = null;
        // LIFE-CYCLE CALLBACKS:
        // onLoad () {}
        _this.currentPage = 'left';
        return _this;
        // update (dt) {}
    }
    NewClass.prototype.goToLeftPage = function () {
        if (this.currentPage == 'left') {
            return;
        }
        else {
            var left = cc.moveBy(0.5, cc.v2(1280, 0));
            this.currentPage = 'left';
            this.skinPage.runAction(left);
        }
    };
    NewClass.prototype.goToRightPage = function () {
        if (this.currentPage == 'right') {
            return;
        }
        else {
            var right = cc.moveBy(0.5, cc.v2(-1280, 0));
            this.currentPage = 'right';
            this.skinPage.runAction(right);
        }
    };
    NewClass.prototype.start = function () {
    };
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "skinPage", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();