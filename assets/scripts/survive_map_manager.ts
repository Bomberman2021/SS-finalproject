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
let record = null;
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.SpriteFrame)
    box: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    bomb_frame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    exploded_effect_up_end: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    exploded_effect_down_end: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    exploded_effect_left_end: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    exploded_effect_right_end: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    exploded_effect_horizontal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    exploded_effect_vertical: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    exploded_effect_center: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    special_bomb_frame: cc.SpriteFrame = null;
    // @property(cc.SpriteFrame)
    // extra_special_bomb_frame:cc.SpriteFrame = null;
    // @property(cc.SpriteFrame)
    // type1_item_frame:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    type2_item_frame: cc.SpriteFrame = null;
    // @property(cc.SpriteFrame)
    // type3_item_frame:cc.SpriteFrame = null;
    // @property(cc.SpriteFrame)
    // type4_item_frame:cc.SpriteFrame = null;
    // @property(cc.SpriteFrame)
    // type5_item_frame:cc.SpriteFrame = null;
    // @property(cc.SpriteFrame)
    // type6_item_frame:cc.SpriteFrame = null;
    // @property(cc.SpriteFrame)
    // type7_item_frame:cc.SpriteFrame = null;
    // @property(cc.SpriteFrame)
    // type8_item_frame:cc.SpriteFrame = null;
    // @property(cc.SpriteFrame)
    // type9_item_frame:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    type10_item_frame: cc.SpriteFrame = null;
    @property(cc.Node)
    player: cc.Node = null;
    @property(cc.Node)
    player2: cc.Node = null;
    onLoad() {
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabled = true;
        //  cc.director.getCollisionManager().enabledDrawBoundingBox = true;
        cc.director.getPhysicsManager().enabled = true;
        //  cc.director.getPhysicsManager().debugDrawFlags = 1;
        cc.director.getPhysicsManager().gravity = cc.v2();
        this.initMap(this.node);
        record = cc.find("record").getComponent("record");
        if (!record.hasPlayer2) {
            this.player2.active = false;
        }

    }

    start() {

    }

    initMap(mapNode) {
        let tiledMap = mapNode.getComponent(cc.TiledMap);
        let tiledSize = tiledMap.getTileSize();
        let layer = tiledMap.getLayer("Tile Layer 1");
        let layerSize = layer.getLayerSize();
        // cc.log("layersize:",layerSize);
        tiledSize.width += 1;
        let layer2 = tiledMap.getLayer("playerstart");
        let bomb_layer = tiledMap.getLayer("bomb layer");
        let exploded_effect_layer = tiledMap.getLayer("exploded effect layer");
        let item_layer = tiledMap.getLayer("item layer");
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
                else {
                    let body = tiled.node.addComponent(cc.RigidBody);
                    body.type = cc.RigidBodyType.Static;
                    let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
                    collider.offset = cc.v2(tiledSize.height / 2, tiledSize.width / 2);
                    collider.size = tiledSize;
                    collider.apply();
                    body.active = false;
                }
                // add box
                let tiled2 = layer2.getTiledTileAt(i, j, true);
                let body = tiled2.node.addComponent(cc.RigidBody);
                let collider = tiled2.node.addComponent(cc.PhysicsBoxCollider);
                collider.offset = cc.v2(tiledSize.height / 2, tiledSize.width / 2);
                body.type = cc.RigidBodyType.Static;
                collider.size = tiledSize;
                collider.apply();
                body.active = false;
                tiled2.node.anchorX = 0;
                tiled2.node.anchorY = 0;

                //bomb tiled initialize
                let bomb_tiled = bomb_layer.getTiledTileAt(i, j, true);
                bomb_tiled.node.attr({
                    bomb_type: 0,
                    map: null,
                    //left: true,
                    player1_left: true,
                    player2_left: true,
                    range: 0,
                    bomb_frame: this.bomb_frame,
                    special_bomb_frame: this.special_bomb_frame,
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
                    exploded_effect_up_end: this.exploded_effect_up_end,
                    exploded_effect_down_end: this.exploded_effect_down_end,
                    exploded_effect_left_end: this.exploded_effect_left_end,
                    exploded_effect_right_end: this.exploded_effect_right_end,
                    exploded_effect_horizontal: this.exploded_effect_horizontal,
                    exploded_effect_vertical: this.exploded_effect_vertical,
                    exploded_effect_center: this.exploded_effect_center,
                })
                exploded_effect_tiled.addComponent(cc.Sprite);
                exploded_effect_tiled.node.anchorX = 0;
                exploded_effect_tiled.node.anchorY = 0;
                //item effect tiled initialize
                let item_tiled = item_layer.getTiledTileAt(i, j, true);
                item_tiled.node.attr({
                    type: 0,
                    //type1_item_frame: this.type1_item_frame,
                    type2_item_frame: this.type2_item_frame,
                    // type3_item_frame: this.type3_item_frame,
                    // type4_item_frame: this.type4_item_frame,
                    // type5_item_frame: this.type5_item_frame,
                    // type6_item_frame: this.type6_item_frame,
                    // type7_item_frame: this.type7_item_frame,
                    // type8_item_frame: this.type8_item_frame,
                    // type9_item_frame: this.type9_item_frame,
                    type10_item_frame: this.type10_item_frame,
                    default_contact: this.default_Contact,
                    contact_type1: this.Contact1,
                    contact_type2: this.Contact2,
                    contact_type3: this.Contact3,
                    contact_type4: this.Contact4,
                    contact_type5: this.Contact5,
                    contact_type6: this.Contact6,
                    contact_type7: this.Contact7,
                    contact_type8: this.Contact8,
                    contact_type9: this.Contact9,
                    contact_type10: this.Contact10
                })
                body = item_tiled.node.addComponent(cc.RigidBody);
                body.type = cc.RigidBodyType.Static;
                collider = item_tiled.node.addComponent(cc.PhysicsBoxCollider);
                collider.offset = cc.v2(tiledSize.height / 2, tiledSize.width / 2);
                collider.size = tiledSize;
                collider.apply();
                body.enabledContactListener = true;
                body.onBeginContact = item_tiled.node.default_contact;
                item_tiled.addComponent(cc.Sprite);
                item_tiled.node.anchorX = 0;
                item_tiled.node.anchorY = 0;
            }
        }

    }
    default_Contact(contact, selfCollider, otherCollider) {
        contact.disabled = true;
    }
    Contact1(contact, selfCollider, otherCollider) {
        contact.disabled = true;
        if (otherCollider.node.name == "player" || otherCollider.node.name == "player2") {
            if (selfCollider.getComponent(cc.Sprite).spriteFrame != null) {
                selfCollider.getComponent(cc.Sprite).spriteFrame = null;
                if (otherCollider.node.name == "player")
                    otherCollider.getComponent("player_controller").bomb_exploded_range += 1;
                else
                    otherCollider.getComponent("player2_controller").bomb_exploded_range += 1;
                selfCollider.getComponent(cc.RigidBody).onBeginContact = selfCollider.node.default_contact;
            }
        }
    }
    Contact2(contact, selfCollider, otherCollider) {
        contact.disabled = true;
        if (otherCollider.node.name == "player" || otherCollider.node.name == "player2") {
            if (selfCollider.getComponent(cc.Sprite).spriteFrame != null) {
                selfCollider.getComponent(cc.Sprite).spriteFrame = null;
                if (otherCollider.node.name == "player")
                    otherCollider.getComponent("survive_player_controller")._speed += 10;
                else
                    otherCollider.getComponent("survive_player2_controller")._speed += 10;
                selfCollider.getComponent(cc.RigidBody).onBeginContact = selfCollider.node.default_contact;
            }
        }
    }
    Contact3(contact, selfCollider, otherCollider) {
        contact.disabled = true;
        if (otherCollider.node.name == "player" || otherCollider.node.name == "player2") {
            if (selfCollider.getComponent(cc.Sprite).spriteFrame != null) {
                selfCollider.getComponent(cc.Sprite).spriteFrame = null;
                if (otherCollider.node.name == "player")
                    otherCollider.getComponent("player_controller").bomb_number += 1;
                else
                    otherCollider.getComponent("player2_controller").bomb_number += 1;
                selfCollider.getComponent(cc.RigidBody).onBeginContact = selfCollider.node.default_contact;
            }
        }
    }
    Contact4(contact, selfCollider, otherCollider) {
        contact.disabled = true;
        if (otherCollider.node.name == "player" || otherCollider.node.name == "player2") {
            if (selfCollider.getComponent(cc.Sprite).spriteFrame != null) {
                selfCollider.getComponent(cc.Sprite).spriteFrame = null;
                if (otherCollider.node.name == "player")
                    otherCollider.getComponent("player_controller").bomb_exploded_time *= 0.9;
                else
                    otherCollider.getComponent("player2_controller").bomb_exploded_time *= 0.9;
                selfCollider.getComponent(cc.RigidBody).onBeginContact = selfCollider.node.default_contact;
            }
        }
    }
    Contact5(contact, selfCollider, otherCollider) {
        contact.disabled = true;
        if (otherCollider.node.name == "player" || otherCollider.node.name == "player2") {
            if (selfCollider.getComponent(cc.Sprite).spriteFrame != null) {
                selfCollider.getComponent(cc.Sprite).spriteFrame = null;
                if (otherCollider.node.name == "player")
                    otherCollider.getComponent("player_controller").coin += 100;
                else
                    otherCollider.getComponent("player2_controller").coin += 100;
                selfCollider.getComponent(cc.RigidBody).onBeginContact = selfCollider.node.default_contact;
            }
        }
    }
    Contact6(contact, selfCollider, otherCollider) {
        contact.disabled = true;
        if (otherCollider.node.name == "player" || otherCollider.node.name == "player2") {
            if (selfCollider.getComponent(cc.Sprite).spriteFrame != null) {
                selfCollider.getComponent(cc.Sprite).spriteFrame = null;
                if (otherCollider.node.name == "player") {
                    otherCollider.getComponent("player_controller").extra_special_bomb_number = 0;
                    otherCollider.getComponent("player_controller").special_bomb_number += 3;
                }
                else {
                    otherCollider.getComponent("player2_controller").special_bomb_number += 3;
                    otherCollider.getComponent("player2_controller").extra_special_bomb_number = 0;
                }
                selfCollider.getComponent(cc.RigidBody).onBeginContact = selfCollider.node.default_contact;
            }
        }
    }

    Contact7(contact, selfCollider, otherCollider) {
        contact.disabled = true;
        if (otherCollider.node.name == "player" || otherCollider.node.name == "player2") {
            if (selfCollider.getComponent(cc.Sprite).spriteFrame != null) {
                selfCollider.getComponent(cc.Sprite).spriteFrame = null;
                if (otherCollider.node.name == "player") {
                    otherCollider.getComponent("player_controller").extra_special_bomb_number += 1;
                    otherCollider.getComponent("player_controller").special_bomb_number = 0;
                }
                else {
                    otherCollider.getComponent("player2_controller").special_bomb_number = 0;
                    otherCollider.getComponent("player2_controller").extra_special_bomb_number += 1;
                }
                selfCollider.getComponent(cc.RigidBody).onBeginContact = selfCollider.node.default_contact;
            }
        }
    }

    Contact8(contact, selfCollider, otherCollider) {
        contact.disabled = true;
        // if(otherCollider.node.name == "player" || otherCollider.node.name == "player2"){
        //     if(selfCollider.getComponent(cc.Sprite).spriteFrame != null){
        //         selfCollider.getComponent(cc.Sprite).spriteFrame = null;
        //         if(otherCollider.node.name == "player")
        //             otherCollider.getComponent("player_controller").special_bomb_number += 3;
        //         else
        //             otherCollider.getComponent("player2_controller").special_bomb_number += 3;
        //         selfCollider.getComponent(cc.RigidBody).onBeginContact = selfCollider.node.default_contact;
        //     }
        // }
    }

    Contact9(contact, selfCollider, otherCollider) {
        contact.disabled = true;
        // if(otherCollider.node.name == "player" || otherCollider.node.name == "player2"){
        //     if(selfCollider.getComponent(cc.Sprite).spriteFrame != null){
        //         selfCollider.getComponent(cc.Sprite).spriteFrame = null;
        //         if(otherCollider.node.name == "player")
        //             otherCollider.getComponent("player_controller").special_bomb_number += 3;
        //         else
        //             otherCollider.getComponent("player2_controller").special_bomb_number += 3;
        //         selfCollider.getComponent(cc.RigidBody).onBeginContact = selfCollider.node.default_contact;
        //     }
        // }
    }

    Contact10(contact, selfCollider, otherCollider) {
        contact.disabled = true;
        if (otherCollider.node.name == "player" || otherCollider.node.name == "player2") {
            if (selfCollider.getComponent(cc.Sprite).spriteFrame != null) {
                selfCollider.getComponent(cc.Sprite).spriteFrame = null;
                otherCollider.node.getChildByName("shield").active = true;
                if (otherCollider.node.name == "player") {
                    otherCollider.node.getComponent('survive_player_controller').startShieldCountdown();

                }
                else {
                    otherCollider.node.getComponent('survive_player2_controller').startShieldCountdown();

                }
                selfCollider.getComponent(cc.RigidBody).onBeginContact = selfCollider.node.default_contact;
            }
        }
    }
    // update (dt) {}
}