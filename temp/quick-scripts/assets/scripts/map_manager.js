(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/map_manager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b559eFaISlKzpmrcu+1qkwG', 'map_manager', __filename);
// scripts/map_manager.ts

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
        _this.box = null;
        return _this;
        // update (dt) {}
    }
    NewClass.prototype.onLoad = function () {
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = 1;
        cc.director.getPhysicsManager().gravity = cc.v2();
        this.initMap(this.node);
    };
    NewClass.prototype.start = function () {
    };
    NewClass.prototype.initMap = function (mapNode) {
        var tiledMap = mapNode.getComponent(cc.TiledMap);
        var tiledSize = tiledMap.getTileSize();
        var layer = tiledMap.getLayer("Tile Layer 1");
        var layerSize = layer.getLayerSize();
        tiledSize.width += 1;
        var layer2 = tiledMap.getLayer("playerstart");
        for (var i = 0; i < layerSize.width; i++) {
            for (var j = 0; j < layerSize.height; j++) {
                var tiled = layer.getTiledTileAt(i, j, true);
                if (tiled.gid != 0) {
                    tiled.node.group = "walls";
                    var body = tiled.node.addComponent(cc.RigidBody);
                    body.type = cc.RigidBodyType.Static;
                    var collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
                    collider.offset = cc.v2(tiledSize.height / 2, tiledSize.width / 2);
                    collider.size = tiledSize;
                    collider.apply();
                }
                var tiled2 = layer2.getTiledTileAt(i, j, true);
                if (tiled.gid == 0 && tiled2.gid == 0) {
                    var Sprite = tiled2.node.addComponent(cc.Sprite);
                    // cc.log(Sprite);
                    var body = tiled2.node.addComponent(cc.RigidBody);
                    var collider = tiled2.node.addComponent(cc.PhysicsBoxCollider);
                    collider.offset = cc.v2(tiledSize.height / 2, tiledSize.width / 2);
                    body.type = cc.RigidBodyType.Static;
                    collider.size = tiledSize;
                    collider.apply();
                    Sprite.spriteFrame = this.box;
                    tiled2.node.anchorX = 0;
                    tiled2.node.anchorY = 0;
                }
            }
        }
    };
    __decorate([
        property(cc.SpriteFrame)
    ], NewClass.prototype, "box", void 0);
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
        //# sourceMappingURL=map_manager.js.map
        