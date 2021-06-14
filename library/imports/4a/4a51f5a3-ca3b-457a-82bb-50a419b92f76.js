"use strict";
cc._RF.push(module, '4a51fWjyjtFeoK7UKQZuS92', 'record');
// scripts/record.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var hasPlayer2 = false;
var currentPlayer = 'Player1';
var player1Skin = 'normal';
var player1Bomb = 'normal';
var player1Color = 'black';
var player2Skin = 'normal';
var player2Bomb = 'normal';
var player2Color = 'black';
var userSkinCategory = [];
var userBombCategory = [];
var settingLife = '1';
var settingTime = '60s';
var record = /** @class */ (function (_super) {
    __extends(record, _super);
    function record() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // LIFE-CYCLE CALLBACKS:
    record.prototype.onLoad = function () {
        cc.game.addPersistRootNode(this.node);
    };
    record.prototype.start = function () {
    };
    record = __decorate([
        ccclass
    ], record);
    return record;
}(cc.Component));
exports.record = record;

cc._RF.pop();