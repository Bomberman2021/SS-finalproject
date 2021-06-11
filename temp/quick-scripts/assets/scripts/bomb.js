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
        _this.real_position = cc.v2(0, 0);
        _this.revised_position = cc.v2(0, 0);
        _this.bombCD = false; // if true, can't put bomb
        // LIFE-CYCLE CALLBACKS:
        _this.bombTest = null;
        _this.player_data = null;
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
            this.player_data = this.player.getComponent("player_controller");
            if (this.bombCD == false && this.player_data.bomb_number != 0) {
                this.Create_bomb();
                setTimeout(function () {
                    mybomb.bombCD = false;
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
        var bomb_layer = tiledMap.getLayer("bomb layer");
        var layerSize = layer.getLayerSize();
        for (var i = 0; i < layerSize.width; i++) {
            for (var j = 0; j < layerSize.height; j++) {
                var bomb_tiled = bomb_layer.getTiledTileAt(i, j, false);
                if (i > this.revised_position.x - 1 && i < this.revised_position.x && (layerSize.height - j) > this.revised_position.y && (layerSize.height - j) < this.revised_position.y + 1) {
                    var body = bomb_tiled.node.getComponent(cc.RigidBody);
                    if (body.active) {
                        break;
                    }
                    this.player_data.bomb_number -= 1;
                    var Sprite = bomb_tiled.node.getComponent(cc.Sprite);
                    Sprite.spriteFrame = bomb_tiled.node.bomb_frame;
                    body.active = true;
                    body.enabledContactListener = true;
                    body.onBeginContact = this.Contact;
                    body.onEndContact = this.endContact;
                    if (this.player_data.special_bomb_number != 0) {
                        this.player_data.special_bomb_number -= 1;
                        bomb_tiled.node.attr({
                            bomb_type: 1,
                            owner: this.player,
                            left: false,
                            range: this.player_data.bomb_exploded_range,
                            map: this.map
                        });
                    }
                    else {
                        bomb_tiled.node.attr({
                            bomb_type: 0,
                            owner: this.player,
                            left: false,
                            range: this.player_data.bomb_exploded_range,
                            map: this.map
                        });
                    }
                    switch (bomb_tiled.node.bomb_type) {
                        case 0:
                            bomb_tiled.scheduleOnce(this.exploded_effect, this.player_data.bomb_exploded_time);
                            break;
                        case 1:
                            bomb_tiled.scheduleOnce(this.special_exploded_effect, this.player_data.bomb_exploded_time);
                            break;
                    }
                }
            }
        }
    };
    NewClass.prototype.exploded_effect = function () {
        cc.log(this);
        this.node.owner.getComponent("player_controller").bomb_number += 1;
        this.getComponent(cc.Sprite).spriteFrame = null;
        this.getComponent(cc.RigidBody).active = false;
        var x = this._x;
        var y = this._y;
        var map = this.node.map;
        var tiledMap = map.getComponent(cc.TiledMap);
        cc.log(tiledMap);
        this.node.map = null;
        var layer = tiledMap.getLayer("playerstart");
        var layer2 = tiledMap.getLayer("Tile Layer 1");
        var bomb_layer = tiledMap.getLayer("bomb layer");
        var exploded_effect_layer = tiledMap.getLayer("exploded effect layer");
        var layerSize = layer.getLayerSize();
        var exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y, true);
        exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_center;
        exploded_effect_tiled.unscheduleAllCallbacks();
        exploded_effect_tiled.scheduleOnce(function () {
            this.getComponent(cc.Sprite).spriteFrame = null;
        }, 0.5);
        for (var i = 1; i <= this.node.range; i++) {
            if (x + i > layerSize.width) {
                break;
            }
            var tiled = layer.getTiledTileAt(x + i, y, true);
            var tiled2 = layer2.getTiledTileAt(x + i, y, true);
            var exploded_effect_tiled_1 = exploded_effect_layer.getTiledTileAt(x + i, y, true);
            if (tiled2.getComponent(cc.RigidBody) != null) { //wall
                if (i != 1) {
                    exploded_effect_tiled_1 = exploded_effect_layer.getTiledTileAt(x + (i - 1), y, true);
                    exploded_effect_tiled_1.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_1.node.exploded_effect_right_end;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled_1.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_1.node.exploded_effect_right_end;
                exploded_effect_tiled_1.unscheduleAllCallbacks();
                exploded_effect_tiled_1.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
                break;
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled_1.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_1.node.exploded_effect_right_end;
                else
                    exploded_effect_tiled_1.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_1.node.exploded_effect_horizontal;
                exploded_effect_tiled_1.unscheduleAllCallbacks();
                exploded_effect_tiled_1.scheduleOnce(function () {
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
            var exploded_effect_tiled_2 = exploded_effect_layer.getTiledTileAt(x - i, y, true);
            if (tiled2.getComponent(cc.RigidBody) != null) { //wall
                if (i != 1) {
                    exploded_effect_tiled_2 = exploded_effect_layer.getTiledTileAt(x - (i - 1), y, true);
                    exploded_effect_tiled_2.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_2.node.exploded_effect_left_end;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled_2.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_2.node.exploded_effect_left_end;
                exploded_effect_tiled_2.unscheduleAllCallbacks();
                exploded_effect_tiled_2.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
                break;
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled_2.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_2.node.exploded_effect_left_end;
                else
                    exploded_effect_tiled_2.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_2.node.exploded_effect_horizontal;
                exploded_effect_tiled_2.unscheduleAllCallbacks();
                exploded_effect_tiled_2.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }
        for (var i = 1; i <= this.node.range; i++) {
            if (y + i > layerSize.width) {
                break;
            }
            var tiled = layer.getTiledTileAt(x, y + i, true);
            var tiled2 = layer2.getTiledTileAt(x, y + i, true);
            var exploded_effect_tiled_3 = exploded_effect_layer.getTiledTileAt(x, y + i, true);
            if (tiled2.getComponent(cc.RigidBody) != null) { //wall
                if (i != 1) {
                    exploded_effect_tiled_3 = exploded_effect_layer.getTiledTileAt(x, y + (i - 1), true);
                    exploded_effect_tiled_3.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_3.node.exploded_effect_down_end;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled_3.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_3.node.exploded_effect_down_end;
                exploded_effect_tiled_3.unscheduleAllCallbacks();
                exploded_effect_tiled_3.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
                break;
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled_3.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_3.node.exploded_effect_down_end;
                else
                    exploded_effect_tiled_3.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_3.node.exploded_effect_vertical;
                exploded_effect_tiled_3.unscheduleAllCallbacks();
                exploded_effect_tiled_3.scheduleOnce(function () {
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
            var exploded_effect_tiled_4 = exploded_effect_layer.getTiledTileAt(x, y - i, true);
            if (tiled2.getComponent(cc.RigidBody) != null) { //wall
                if (i != 1) {
                    exploded_effect_tiled_4 = exploded_effect_layer.getTiledTileAt(x, y - (i - 1), true);
                    exploded_effect_tiled_4.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_4.node.exploded_effect_up_end;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled_4.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_4.node.exploded_effect_up_end;
                exploded_effect_tiled_4.unscheduleAllCallbacks();
                exploded_effect_tiled_4.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
                break;
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled_4.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_4.node.exploded_effect_up_end;
                else
                    exploded_effect_tiled_4.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_4.node.exploded_effect_vertical;
                exploded_effect_tiled_4.unscheduleAllCallbacks();
                exploded_effect_tiled_4.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }
    };
    NewClass.prototype.special_exploded_effect = function () {
        //cc.log(this);
        this.getComponent(cc.Sprite).spriteFrame = null;
        this.getComponent(cc.RigidBody).active = false;
        this.node.owner.getComponent("player_controller").bomb_number += 1;
        var x = this._x;
        var y = this._y;
        var map = this.node.map;
        var tiledMap = map.getComponent(cc.TiledMap);
        //cc.log(tiledMap);
        this.node.map = null;
        var layer = tiledMap.getLayer("playerstart");
        var layer2 = tiledMap.getLayer("Tile Layer 1");
        var bomb_layer = tiledMap.getLayer("bomb layer");
        var exploded_effect_layer = tiledMap.getLayer("exploded effect layer");
        var layerSize = layer.getLayerSize();
        var exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y, true);
        exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_center;
        exploded_effect_tiled.unscheduleAllCallbacks();
        exploded_effect_tiled.scheduleOnce(function () {
            this.getComponent(cc.Sprite).spriteFrame = null;
        }, 0.5);
        for (var i = 1; i <= this.node.range; i++) {
            if (x + i > layerSize.width) {
                break;
            }
            var tiled = layer.getTiledTileAt(x + i, y, true);
            var tiled2 = layer2.getTiledTileAt(x + i, y, true);
            var exploded_effect_tiled_5 = exploded_effect_layer.getTiledTileAt(x + i, y, true);
            if (tiled2.getComponent(cc.RigidBody) != null) { //wall
                if (i != 1) {
                    exploded_effect_tiled_5 = exploded_effect_layer.getTiledTileAt(x + (i - 1), y, true);
                    exploded_effect_tiled_5.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_5.node.exploded_effect_right_end;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if (i != this.node.range)
                    exploded_effect_tiled_5.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_5.node.exploded_effect_horizontal;
                else
                    exploded_effect_tiled_5.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_5.node.exploded_effect_right_end;
                exploded_effect_tiled_5.unscheduleAllCallbacks();
                exploded_effect_tiled_5.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled_5.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_5.node.exploded_effect_right_end;
                else
                    exploded_effect_tiled_5.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_5.node.exploded_effect_horizontal;
                exploded_effect_tiled_5.unscheduleAllCallbacks();
                exploded_effect_tiled_5.scheduleOnce(function () {
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
            var exploded_effect_tiled_6 = exploded_effect_layer.getTiledTileAt(x - i, y, true);
            if (tiled2.getComponent(cc.RigidBody) != null) { //wall
                if (i != 1) {
                    exploded_effect_tiled_6 = exploded_effect_layer.getTiledTileAt(x - (i - 1), y, true);
                    exploded_effect_tiled_6.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_6.node.exploded_effect_left_end;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if (i != this.node.range)
                    exploded_effect_tiled_6.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_6.node.exploded_effect_horizontal;
                else
                    exploded_effect_tiled_6.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_6.node.exploded_effect_left_end;
                exploded_effect_tiled_6.unscheduleAllCallbacks();
                exploded_effect_tiled_6.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled_6.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_6.node.exploded_effect_left_end;
                else
                    exploded_effect_tiled_6.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_6.node.exploded_effect_horizontal;
                exploded_effect_tiled_6.unscheduleAllCallbacks();
                exploded_effect_tiled_6.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }
        for (var i = 1; i <= this.node.range; i++) {
            if (y + i > layerSize.width) {
                break;
            }
            var tiled = layer.getTiledTileAt(x, y + i, true);
            var tiled2 = layer2.getTiledTileAt(x, y + i, true);
            var exploded_effect_tiled_7 = exploded_effect_layer.getTiledTileAt(x, y + i, true);
            if (tiled2.getComponent(cc.RigidBody) != null) { //wall
                if (i != 1) {
                    exploded_effect_tiled_7 = exploded_effect_layer.getTiledTileAt(x, y + (i - 1), true);
                    exploded_effect_tiled_7.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_7.node.exploded_effect_down_end;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if (i != this.node.range)
                    exploded_effect_tiled_7.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_7.node.exploded_effect_vertical;
                else
                    exploded_effect_tiled_7.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_7.node.exploded_effect_down_end;
                exploded_effect_tiled_7.unscheduleAllCallbacks();
                exploded_effect_tiled_7.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled_7.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_7.node.exploded_effect_down_end;
                else
                    exploded_effect_tiled_7.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_7.node.exploded_effect_vertical;
                exploded_effect_tiled_7.unscheduleAllCallbacks();
                exploded_effect_tiled_7.scheduleOnce(function () {
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
            var exploded_effect_tiled_8 = exploded_effect_layer.getTiledTileAt(x, y - i, true);
            if (tiled2.getComponent(cc.RigidBody) != null) { //wall
                if (i != 1) {
                    exploded_effect_tiled_8 = exploded_effect_layer.getTiledTileAt(x, y - (i - 1), true);
                    exploded_effect_tiled_8.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_8.node.exploded_effect_vertical;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if (i != this.node.range)
                    exploded_effect_tiled_8.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_8.node.exploded_effect_vertical;
                else
                    exploded_effect_tiled_8.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_8.node.exploded_effect_up_end;
                exploded_effect_tiled_8.unscheduleAllCallbacks();
                exploded_effect_tiled_8.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled_8.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_8.node.exploded_effect_up_end;
                else
                    exploded_effect_tiled_8.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled_8.node.exploded_effect_vertical;
                exploded_effect_tiled_8.unscheduleAllCallbacks();
                exploded_effect_tiled_8.scheduleOnce(function () {
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
        