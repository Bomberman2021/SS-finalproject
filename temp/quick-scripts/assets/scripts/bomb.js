(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/bomb.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f2cbbItlspDXKes83DQVTk/', 'bomb', __filename);
// scripts/bomb.ts

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
        _this.map = null;
        _this.player = null;
        _this.exploded_frame = null;
        _this.real_position = cc.v2(0, 0);
        _this.revised_position = cc.v2(0, 0);
        _this.bombCD = false; // if true, can't put bomb
        // LIFE-CYCLE CALLBACKS:
        _this.bombTest = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.director.getPhysicsManager().enabled = true;
    };
    NewClass.prototype.start = function () {
    };
    NewClass.prototype.onKeyDown = function (e) {
        Input[e.keyCode] = 1;
    };
    NewClass.prototype.onKeyUp = function (e) {
        Input[e.keyCode] = 0;
    };
    NewClass.prototype.update = function (dt) {
        this.Change_position();
        var mybomb = this;
        if (Input[cc.macro.KEY.space]) {
            if (this.bombCD == false) {
                this.Create_bomb();
                setTimeout(function () {
                    mybomb.bombCD = false;
                    cc.log("after count down", mybomb.bombCD);
                }, 200);
            }
        }
    };
    NewClass.prototype.Change_position = function () {
        this.real_position.x = this.player.position.x - this.map.position.x;
        this.real_position.y = this.player.position.y - this.map.position.y;
        var tiledMap = this.map.getComponent(cc.TiledMap);
        var tiledSize = tiledMap.getTileSize();
        var height = tiledSize.height * this.node.scaleY;
        var width = tiledSize.width * this.node.scaleX;
        this.revised_position.x = this.real_position.x / width;
        this.revised_position.y = this.real_position.y / height;
    };
    NewClass.prototype.Create_bomb = function () {
        this.bombCD = true;
        var tiledMap = this.map.getComponent(cc.TiledMap);
        var layer = tiledMap.getLayer("playerstart");
        var layerSize = layer.getLayerSize();
        for (var i = 0; i < layerSize.width; i++) {
            for (var j = 0; j < layerSize.height; j++) {
                var tiled = layer.getTiledTileAt(i, j, false);
                if (i > this.revised_position.x - 1 && i < this.revised_position.x && (layerSize.height - j) > this.revised_position.y && (layerSize.height - j) < this.revised_position.y + 1) {
                    var body = tiled.node.getComponent(cc.RigidBody);
                    if (body.active) {
                        break;
                    }
                    var Sprite = tiled.node.getComponent(cc.Sprite);
                    Sprite.spriteFrame = tiled.node.bomb_frame;
                    tiled.node.anchorX = 0;
                    tiled.node.anchorY = 0;
                    cc.log(body);
                    body.active = true;
                    body.enabledContactListener = true;
                    body.onBeginContact = this.Contact;
                    body.onEndContact = this.endContact;
                    tiled.node.attr({
                        left: false,
                        range: this.player.getComponent("player_controller").bomb_exploded_range,
                        map: this.map
                    });
                    // let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
                    // let tiledSize = tiledMap.getTileSize();
                    // collider.offset = cc.v2(tiledSize.height / 2, tiledSize.width / 2);
                    // collider.size = tiledSize;
                    // collider.apply();
                    tiled.scheduleOnce(this.exploded_effect, this.player.getComponent("player_controller").bomb_exploded_time);
                }
            }
        }
    };
    NewClass.prototype.exploded_effect = function () {
        this.getComponent(cc.Sprite).spriteFrame = null;
        this.getComponent(cc.RigidBody).active = false;
        var x = this._x;
        var y = this._y;
        var map = this.node.map;
        cc.log(map);
        var tiledMap = map.getComponent(cc.TiledMap);
        this.node.map = null;
        var layer = tiledMap.getLayer("playerstart");
        var layer2 = tiledMap.getLayer("Tile Layer 1");
        var layerSize = layer.getLayerSize();
        for (var i = 1; i <= this.node.range; i++) {
            if (x + i > layerSize.width) {
                break;
            }
            var tiled = layer.getTiledTileAt(x + i, y, true);
            var tiled2 = layer2.getTiledTileAt(x + i, y, true);
            if (tiled2.getComponent(cc.RigidBody) != null) {
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active && tiled.node.map == null) { // box
                tiled.getComponent(cc.RigidBody).active = null;
                tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_right_end;
                tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // other bomb(need fix)
                if (i == this.node.range)
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_right_end;
                else
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_horizontal;
                tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled
                if (i == this.node.range)
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_right_end;
                else
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_horizontal;
                tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }
        for (var i = 1; i <= this.node.range; i++) {
            if (x - i < 0) {
                break;
            }
            var tiled = layer.getTiledTileAt(x - i, y, true);
            var tiled2 = layer2.getTiledTileAt(x - i, y, true);
            if (tiled2.getComponent(cc.RigidBody) != null) {
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active && tiled.node.map == null) { // box
                tiled.getComponent(cc.RigidBody).active = null;
                tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_left_end;
                tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // other bomb(need fix)
                if (i == this.node.range)
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_left_end;
                else
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_horizontal;
                tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled
                if (i == this.node.range)
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_left_end;
                else
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_horizontal;
                tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }
        for (var i = 1; i <= this.node.range; i++) {
            if (y + i > layerSize.height) {
                break;
            }
            var tiled = layer.getTiledTileAt(x, y + i, true);
            var tiled2 = layer2.getTiledTileAt(x, y + i, true);
            if (tiled2.getComponent(cc.RigidBody) != null) {
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active && tiled.node.map == null) { // box
                tiled.getComponent(cc.RigidBody).active = null;
                tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_up_end;
                tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // other bomb(need fix)
                if (i == this.node.range)
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_up_end;
                else
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_vertical;
                tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled
                if (i == this.node.range)
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_up_end;
                else
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_vertical;
                tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }
        for (var i = 1; i <= this.node.range; i++) {
            if (y - i < 0) {
                break;
            }
            var tiled = layer.getTiledTileAt(x, y - i, true);
            var tiled2 = layer2.getTiledTileAt(x, y - i, true);
            if (tiled2.getComponent(cc.RigidBody) != null) {
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active && tiled.node.map == null) { // box
                tiled.getComponent(cc.RigidBody).active = null;
                tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_down_end;
                tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // other bomb(need fix)
                if (i == this.node.range)
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_down_end;
                else
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_vertical;
                tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled
                if (i == this.node.range)
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_down_end;
                else
                    tiled.getComponent(cc.Sprite).spriteFrame = tiled.node.exploded_effect_vertical;
                tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }
    };
    NewClass.prototype.Contact = function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == "player" && selfCollider.node.left == false) {
            contact.disabled = true;
        }
    };
    NewClass.prototype.endContact = function (contact, selfCollider, otherCollider) {
        selfCollider.node.left = true;
    };
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "map", void 0);
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "player", void 0);
    __decorate([
        property(cc.SpriteFrame)
    ], NewClass.prototype, "exploded_frame", void 0);
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
        //# sourceMappingURL=bomb.js.map
        