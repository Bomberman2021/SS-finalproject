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
    onLoad() {
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabled = true;
         cc.director.getCollisionManager().enabledDrawBoundingBox = true;
        cc.director.getPhysicsManager().enabled = true;
         cc.director.getPhysicsManager().debugDrawFlags = 1;
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

        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {
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
                let tiled2 = layer2.getTiledTileAt(i, j, true);
                if (tiled.gid == 0 && tiled2.gid == 0) {
                    let Sprite = tiled2.node.addComponent(cc.Sprite);
                    // cc.log(Sprite);
                    let body = tiled2.node.addComponent(cc.RigidBody);
                    let collider = tiled2.node.addComponent(cc.PhysicsBoxCollider);
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

    }
    // update (dt) {}
}