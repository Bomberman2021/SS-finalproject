// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.SpriteFrame)
    box: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    bomb_frame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    exploded_effect_up_end: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    exploded_effect_down_end:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    exploded_effect_left_end:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    exploded_effect_right_end:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    exploded_effect_horizontal:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    exploded_effect_vertical:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    exploded_effect_center:cc.SpriteFrame = null;
    onLoad() {
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true;
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = 1;
        cc.director.getPhysicsManager().gravity = cc.v2();
        this.initMap(this.node);
    }

    start() {

    }

    initMap(mapNode) {
        let tiledMap = mapNode.getComponent(cc.TiledMap);
        let tiledSize = tiledMap.getTileSize();
        let layer = tiledMap.getLayer("Tile Layer 1");
        let layerSize = layer.getLayerSize();
        tiledSize.width += 1;
        let layer2 = tiledMap.getLayer("playerstart");
        let bomb_layer = tiledMap.getLayer("bomb layer");
        let exploded_effect_layer = tiledMap.getLayer("exploded effect layer");
        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {
                //map initialize
                let tiled = layer.getTiledTileAt(i, j, true);
                if (tiled.gid != 0) {
                    tiled.node.group = "walls";
                    let body = tiled.node.addComponent(cc.RigidBody);
                    body.type = cc.RigidBodyType.Static;
                    let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
                    collider.offset = cc.v2(tiledSize.height / 2, tiledSize.width / 2);
                    collider.size = tiledSize;
                    collider.apply();
                }
                // add box
                let tiled2 = layer2.getTiledTileAt(i, j, true);
                let Sprite = tiled2.node.addComponent(cc.Sprite);
                let body = tiled2.node.addComponent(cc.RigidBody);
                let collider = tiled2.node.addComponent(cc.PhysicsBoxCollider);
                collider.offset = cc.v2(tiledSize.height / 2, tiledSize.width / 2);
                body.type = cc.RigidBodyType.Static;
                collider.size = tiledSize;
                collider.apply();
                if(tiled.gid == 0 && tiled2.gid == 0)
                    Sprite.spriteFrame = this.box;
                else
                    body.active = false;
                tiled2.node.anchorX = 0;
                tiled2.node.anchorY = 0;
                //bomb tiled initialize
                let bomb_tiled = bomb_layer.getTiledTileAt(i, j, true);
                bomb_tiled.node.attr({
                    bomb_type: 0,
                        owner: null,
                        map:null,
                        left: true,
                        range: 0,
                        bomb_frame: this.bomb_frame,
                })
                bomb_tiled.addComponent(cc.Sprite);
                bomb_tiled.node.anchorX = 0;
                bomb_tiled.node.anchorY = 0;
                body = bomb_tiled.node.addComponent(cc.RigidBody);
                collider = bomb_tiled.node.addComponent(cc.PhysicsBoxCollider);
                collider.offset = cc.v2(tiledSize.height / 2, tiledSize.width / 2);
                body.type = cc.RigidBodyType.Static;
                collider.size = tiledSize;
                collider.apply();
                body.active = false;
                //exploded effect tiled initialize
                let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(i, j, true);
                exploded_effect_tiled.node.attr({
                    exploded_effect_up_end:this.exploded_effect_up_end,
                    exploded_effect_down_end:this.exploded_effect_down_end,
                    exploded_effect_left_end:this.exploded_effect_left_end,
                    exploded_effect_right_end:this.exploded_effect_right_end,
                    exploded_effect_horizontal:this.exploded_effect_horizontal,
                    exploded_effect_vertical:this.exploded_effect_vertical,
                    exploded_effect_center:this.exploded_effect_center,
                })
                exploded_effect_tiled.addComponent(cc.Sprite);
                exploded_effect_tiled.node.anchorX = 0;
                exploded_effect_tiled.node.anchorY = 0;
            }
        }

    }
    // update (dt) {}
}