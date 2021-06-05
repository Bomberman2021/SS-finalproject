"use strict";
cc._RF.push(module, 'c8f1bmn5QhFqq1hGyaQ2ki6', 'player_controller');
// scripts/player_controller.ts

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Input = {};
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.skin = "normal";
        _this.color = "white";
        _this._alive = true;
        _this._speed = 0;
        _this._direction = 'down';
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    NewClass.prototype.onLoad = function () {
        this._speed = 100;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    };
    NewClass.prototype.onKeyDown = function (e) {
        Input[e.keyCode] = 1;
    };
    NewClass.prototype.onKeyUp = function (e) {
        Input[e.keyCode] = 0;
    };
    NewClass.prototype.update = function (dt) {
        if (Input[cc.macro.KEY.a]) {
            console.log("向左");
            this.node.x -= this._speed * dt;
            this._direction = 'left';
        }
        else if (Input[cc.macro.KEY.d]) {
            console.log("向右");
            this.node.x += this._speed * dt;
            this._direction = 'right';
        }
        else if (Input[cc.macro.KEY.w]) {
            console.log("向上");
            this.node.y += this._speed * dt;
            this._direction = 'up';
        }
        else if (Input[cc.macro.KEY.s]) {
            console.log("向下");
            this.node.y -= this._speed * dt;
            this._direction = 'down';
        }
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();