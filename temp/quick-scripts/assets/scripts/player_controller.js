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
var Input = {};
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timeText = null; //only player1 need
        _this.lifeText = null;
        _this.skin = "brucelee";
        _this.color = "red";
        _this._alive = true;
        _this._speed = 0;
        _this._direction = 'static';
        _this.coin = 0;
        _this.frameCount = 0;
        _this.bomb_number = 1;
        _this.special_bomb_number = 0;
        _this.extra_special_bomb_number = 0;
        _this.bomb_exploded_range = 3;
        _this.bomb_exploded_time = 1;
        _this.walkRightSprites = [0, 1, 2, 3, 4, 5, 6, 7];
        _this.walkDownSprites = [0, 1, 2, 3];
        _this.walkUpSprites = [0, 1, 2, 3];
        _this.headSprites = [0, 1, 2];
        _this.faceSprites = [0, 1, 2];
        //should get by persist node
        _this.lifeNum = 3;
        _this.Timer = 60;
        _this.isDeadTest = false;
        _this.killTest = false;
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    NewClass.prototype.onLoad = function () {
        this._speed = 100;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        //Load Sprites
        var me = this;
        var _loop_1 = function (i) {
            cc.loader.loadRes('character sprites/' + this_1.skin + '/' + this_1.color + '/walkright/walkright-' + i, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.log(err);
                    return;
                }
                me.walkRightSprites[i] = spriteFrame;
            });
        };
        var this_1 = this;
        ////walkright
        for (var i = 0; i < 8; i++) {
            _loop_1(i);
        }
        var _loop_2 = function (i) {
            cc.loader.loadRes('character sprites/' + this_2.skin + '/' + this_2.color + '/walkdown/walkdown-' + i, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.log(err);
                    return;
                }
                me.walkDownSprites[i] = spriteFrame;
            });
        };
        var this_2 = this;
        ////walkdown
        for (var i = 0; i < 4; i++) {
            _loop_2(i);
        }
        var _loop_3 = function (i) {
            cc.loader.loadRes('character sprites/' + this_3.skin + '/' + this_3.color + '/walkup/walkup-' + i, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.log(err);
                    return;
                }
                me.walkUpSprites[i] = spriteFrame;
            });
        };
        var this_3 = this;
        ////walkup
        for (var i = 0; i < 4; i++) {
            _loop_3(i);
        }
        var _loop_4 = function (i) {
            cc.loader.loadRes('character sprites/' + this_4.skin + '/' + this_4.color + '/heads/head-' + i, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.log(err);
                    return;
                }
                me.headSprites[i] = spriteFrame;
            });
        };
        var this_4 = this;
        ////head [back, right, front]
        for (var i = 0; i < 3; i++) {
            _loop_4(i);
        }
        ////face [both, cry, side]
        cc.loader.loadRes('character sprites/face/botheye', cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.log(err);
                return;
            }
            me.faceSprites[0] = spriteFrame;
        });
        cc.loader.loadRes('character sprites/face/cryface', cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.log(err);
                return;
            }
            me.faceSprites[1] = spriteFrame;
        });
        cc.loader.loadRes('character sprites/face/sideeye', cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.log(err);
                return;
            }
            me.faceSprites[2] = spriteFrame;
        });
    };
    NewClass.prototype.onKeyDown = function (e) {
        Input[e.keyCode] = 1;
        if (e.keyCode == cc.macro.KEY.k) {
            this.lifeNum -= 1;
        }
    };
    NewClass.prototype.onKeyUp = function (e) {
        Input[e.keyCode] = 0;
        this._direction = 'static';
    };
    NewClass.prototype.update = function (dt) {
        this.updateTime(dt); // only player1 need
        this.updateLife();
        //cc.log("x:",this.node.x);
        var head = this.node.getChildByName('head');
        var body = this.node.getChildByName('body');
        var face = this.node.getChildByName('face');
        if (this._direction === 'left') {
            head.setPosition(6, head.position.y);
            body.getComponent(cc.Sprite).node.scaleX = -1;
            head.getComponent(cc.Sprite).node.scaleX = -1;
            face.setPosition(-15, face.position.y);
            face.getComponent(cc.Sprite).spriteFrame = this.faceSprites[2];
            face.active = true;
        }
        else if (this._direction === 'right') {
            head.setPosition(-6, head.position.y);
            body.getComponent(cc.Sprite).node.scaleX = 1;
            head.getComponent(cc.Sprite).node.scaleX = 1;
            face.getComponent(cc.Sprite).spriteFrame = this.faceSprites[2];
            face.setPosition(15, face.position.y);
            face.active = true;
        }
        else if (this._direction === 'up') {
            head.setPosition(0, head.position.y);
            face.active = false;
        }
        else if (this._direction === 'down') {
            head.setPosition(0, head.position.y);
            face.getComponent(cc.Sprite).spriteFrame = this.faceSprites[0];
            face.active = true;
            face.setPosition(0, face.position.y);
        }
        if (Input[cc.macro.KEY.a]) {
            this.node.x -= this._speed * dt;
            this._direction = 'left';
            head.getComponent(cc.Sprite).spriteFrame = this.headSprites[1];
        }
        else if (Input[cc.macro.KEY.d]) {
            this.node.x += this._speed * dt;
            //this.node.runAction(cc.moveTo(0.5,448,this.node.y));
            this._direction = 'right';
            head.getComponent(cc.Sprite).spriteFrame = this.headSprites[1];
        }
        else if (Input[cc.macro.KEY.w]) {
            this.node.y += this._speed * dt;
            this._direction = 'up';
            head.getComponent(cc.Sprite).spriteFrame = this.headSprites[0];
        }
        else if (Input[cc.macro.KEY.s]) {
            this.node.y -= this._speed * dt;
            this._direction = 'down';
            head.getComponent(cc.Sprite).spriteFrame = this.headSprites[2];
        }
        switch (this._direction) {
            case 'right':
            case 'left':
                this.walkRight();
                break;
            case 'down':
                this.walkDown();
                break;
            case 'up':
                this.walkUp();
                break;
        }
    };
    NewClass.prototype.walkRight = function () {
        this.frameCount %= 40;
        this.node.getChildByName('body').getComponent(cc.Sprite).spriteFrame = this.walkRightSprites[Math.floor(this.frameCount / 5)];
        this.frameCount++;
    };
    NewClass.prototype.walkDown = function () {
        this.frameCount %= 40;
        this.node.getChildByName('body').getComponent(cc.Sprite).spriteFrame = this.walkDownSprites[Math.floor(this.frameCount / 10)];
        this.frameCount++;
    };
    NewClass.prototype.walkUp = function () {
        this.frameCount %= 40;
        this.node.getChildByName('body').getComponent(cc.Sprite).spriteFrame = this.walkUpSprites[Math.floor(this.frameCount / 10)];
        this.frameCount++;
    };
    NewClass.prototype.updateTime = function (dt) {
        this.Timer -= dt;
        if (this.Timer <= 0) {
            //this.playDeath();
            cc.log("end Game");
        }
        else {
            this.timeText.getComponent(cc.Label).string = this.Timer.toFixed(0).toString();
        }
    };
    NewClass.prototype.updateLife = function () {
        this.lifeText.getComponent(cc.Label).string = this.lifeNum.toString();
        if (this.lifeNum <= 0) {
            cc.log("game end");
        }
    };
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "timeText", void 0);
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "lifeText", void 0);
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
        