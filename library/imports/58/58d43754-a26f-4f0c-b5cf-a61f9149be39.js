"use strict";
cc._RF.push(module, '58d43dUom9PDLXPph+RSb45', 'Globals');
// scripts/Globals.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Globals = /** @class */ (function (_super) {
    __extends(Globals, _super);
    function Globals() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Global = {
            backNode: null,
            backLabel: null,
        };
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    Globals.prototype.start = function () {
    };
    Globals = __decorate([
        ccclass
    ], Globals);
    return Globals;
}(cc.Component));
exports.default = Globals;

cc._RF.pop();