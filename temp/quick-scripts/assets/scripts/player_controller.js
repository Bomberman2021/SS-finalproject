(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/player_controller.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c8f1bmn5QhFqq1hGyaQ2ki6', 'player_controller', __filename);
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
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._alive = true;
        _this.walk_up = false;
        _this.walk_down = false;
        _this.walk_left = false;
        _this.walk_right = false;
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    NewClass.prototype.onLoad = function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.rigidbody = this.node.getComponent(cc.RigidBody);
    };
    NewClass.prototype.start = function () {
    };
    NewClass.prototype.up = function () {
        this.rigidbody.linearVelocity = cc.v2(0, 100);
    };
    NewClass.prototype.down = function () {
        this.rigidbody.linearVelocity = cc.v2(0, -100);
    };
    NewClass.prototype.left = function () {
        this.rigidbody.linearVelocity = cc.v2(-100, 0);
    };
    NewClass.prototype.right = function () {
        this.rigidbody.linearVelocity = cc.v2(100, 0);
    };
    NewClass.prototype.stop = function () {
        this.walk_down = false;
        this.walk_left = false;
        this.walk_right = false;
        this.walk_up = false;
        this.rigidbody.linearVelocity = cc.v2(0, 0);
    };
    NewClass.prototype.onKeyDown = function (e) {
        var key_code = e.keyCode;
        if (key_code == cc.macro.KEY.w) {
            this.walk_up = true;
        }
        else if (key_code == cc.macro.KEY.a) {
            this.walk_left = true;
        }
        else if (key_code == cc.macro.KEY.s) {
            this.walk_down = true;
        }
        else if (key_code == cc.macro.KEY.d) {
            this.walk_right = true;
        }
    };
    NewClass.prototype.onKeyUp = function (e) {
        this.stop();
    };
    NewClass.prototype.update = function (dt) {
        if (this._alive) {
            if (this.walk_down)
                this.down();
            if (this.walk_up)
                this.up();
            if (this.walk_left)
                this.left();
            if (this.walk_right)
                this.right();
        }
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

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
        //# sourceMappingURL=player_controller.js.map
        