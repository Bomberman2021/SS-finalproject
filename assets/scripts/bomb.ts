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
let create_bomb_num = 0;
let record = null;
const Input = {}
@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    map: cc.Node = null;
    @property(cc.Node)
    player: cc.Node = null;
    @property(cc.Node)
    otherPlayer: cc.Node = null;

    private real_position: cc.Vec2 = cc.v2(0, 0);
    private revised_position: cc.Vec2 = cc.v2(0, 0);

    private otherPlayer_real_position: cc.Vec2 = cc.v2(0, 0);
    private otherPlayer_revised_position: cc.Vec2 = cc.v2(0, 0);
    bombCD: boolean = false;// if true, can't put bomb
    // LIFE-CYCLE CALLBACKS:
    bombTest: cc.Node = null;
    player_data = null;
    //player_data2 = null;



    onLoad() {
        record = cc.find("record").getComponent("record");
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.director.getPhysicsManager().enabled = true;
    }
    start() {
    }
    onKeyDown(e) {
        Input[e.keyCode] = 1;
    }

    onKeyUp(e) {
        Input[e.keyCode] = 0;
    }


    update(dt) {
        this.Change_position();
        this.detect_landmine();
        this.detect_dead();
        var mybomb = this;
        if (Input[cc.macro.KEY.space]) {
            this.player_data = this.player.getComponent("player_controller");
            if (this.bombCD == false && this.player_data.bomb_number != 0) {
                this.Create_bomb();
                setTimeout(function () {
                    mybomb.bombCD = false;
                }, 200)
            }
        }
    }


    detect_landmine() {
        let tiledMap = this.map.getComponent(cc.TiledMap);
        let layer = tiledMap.getLayer("playerstart");
        let layerSize = layer.getLayerSize();
        let mine_layer = tiledMap.getLayer("mine layer");
        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {
                let mine_tiled = mine_layer.getTiledTileAt(i, j, true); \
                if (mine_tiled.getComponent(cc.Sprite).spriteFrame != null && mine_tiled.node.is_touched == true && mine_tiled.node.is_trigger == false) {
                    mine_tiled.node.is_trigger = true;
                    mine_tiled.getComponent(cc.Sprite).spriteFrame = mine_tiled.node.landmine_frame_after_contact;
                    //animationDone
                    mine_tiled.schedule(function () {
                        mine_tiled.getComponent(cc.Sprite).spriteFrame = mine_tiled.node.landmine_frame_before_contact;
                    }, 0.2, 23, 0);
                    mine_tiled.schedule(function () {
                        mine_tiled.getComponent(cc.Sprite).spriteFrame = mine_tiled.node.landmine_frame_after_contact;
                    }, 0.2, 23, 0.1);

                    mine_tiled.scheduleOnce(this.landmine_exploded_effect, 2);
                }
            }
        }
    }

    landmine_exploded_effect() {
        this.unscheduleAllCallbacks();
        this.getComponent(cc.Sprite).spriteFrame = null;
        let x = this._x;
        let y = this._y;
        let map = this.node.map;
        let tiledMap = map.getComponent(cc.TiledMap);
        cc.log(tiledMap);
        let layer = tiledMap.getLayer("playerstart");
        let layer2 = tiledMap.getLayer("Tile Layer 1");
        let item_layer = tiledMap.getLayer("item layer");
        let exploded_effect_layer = tiledMap.getLayer("exploded effect layer");
        let layerSize = layer.getLayerSize();
        let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y, true);
        exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_center;
        exploded_effect_tiled.unscheduleAllCallbacks();
        exploded_effect_tiled.scheduleOnce(function () {
            this.getComponent(cc.Sprite).spriteFrame = null;
        }, 0.5);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let now_x = x - 1 + i;
                let now_y = y - 1 + j;
                if (now_x <= 0 || now_x >= layerSize.width - 1 || now_y <= 0 || now_y >= layerSize.height - 1) {
                    continue;
                }
                cc.log(now_x);
                cc.log(now_y);
                let tiled = layer.getTiledTileAt(now_x, now_y, true);
                let tiled2 = layer2.getTiledTileAt(now_x, now_y, true);
                let item_tiled = item_layer.getTiledTileAt(now_x, now_y, true);
                let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(now_x, now_y, true);
                if (tiled2.getComponent(cc.RigidBody).active) { //wall
                    tiled2.getComponent(cc.RigidBody).active = false;
                    tiled2.gid = 0;
                    exploded_effect_tiled.node.owner = this.node.owner;
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_center;
                    exploded_effect_tiled.unscheduleAllCallbacks();
                    exploded_effect_tiled.scheduleOnce(function () {
                        this.getComponent(cc.Sprite).spriteFrame = null;
                    }, 0.5);
                }
                else if (tiled.getComponent(cc.RigidBody).active) { //box
                    let random_number = Math.floor(Math.random() * 100);
                    let item_sprite = item_tiled.getComponent(cc.Sprite);
                    let body = item_tiled.getComponent(cc.RigidBody);

                    if (random_number < 50) {
                        if (random_number >= 40) { //type 1
                            item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                            body.onPreSolve = item_tiled.node.contact_type1;
                        }
                        else if (random_number >= 30) { // type 2
                            item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                            body.onPreSolve = item_tiled.node.contact_type2;
                        }
                        else if (random_number >= 20) { //type 3
                            item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                            body.onPreSolve = item_tiled.node.contact_type3;
                        }
                        else if (random_number >= 10) { //type 4
                            item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                            body.onPreSolve = item_tiled.node.contact_type4;
                        }
                        else { //type 5
                            item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                            body.onPreSolve = item_tiled.node.contact_type5;
                        }
                    }
                    else {
                        if (random_number <= 60) {
                            item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                            body.onPreSolve = item_tiled.node.contact_type6;
                        }
                        else if (random_number <= 70) {
                            item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                            body.onPreSolve = item_tiled.node.contact_type7;
                        }
                        else if (random_number <= 80) {
                            item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                            body.onPreSolve = item_tiled.node.contact_type8;
                        }
                        else if (random_number <= 90) {
                            item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                            body.onPreSolve = item_tiled.node.contact_type9;
                        }
                        else {
                            item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                            body.onPreSolve = item_tiled.node.contact_type10;
                        }
                    }
                    tiled.getComponent(cc.RigidBody).active = false;
                    tiled.getComponent(cc.Sprite).spriteFrame = null;
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_center;
                    exploded_effect_tiled.node.owner = this.node.owner;
                    exploded_effect_tiled.unscheduleAllCallbacks();
                    exploded_effect_tiled.scheduleOnce(function () {
                        this.getComponent(cc.Sprite).spriteFrame = null;
                    }, 0.5);
                }
                else { // empty tiled or other bombs
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_center;
                    exploded_effect_tiled.unscheduleAllCallbacks();
                    exploded_effect_tiled.scheduleOnce(function () {
                        this.getComponent(cc.Sprite).spriteFrame = null;
                    }, 0.5);
                }
            }
        }
    }
    Change_position() {
        this.real_position.x = this.player.position.x - this.map.position.x;
        this.real_position.y = this.player.position.y - this.map.position.y;
        let tiledMap = this.map.getComponent(cc.TiledMap);
        let tiledSize = tiledMap.getTileSize();
        let height = tiledSize.height * this.node.scaleY;
        let width = tiledSize.width * this.node.scaleX;
        this.revised_position.x = this.real_position.x / width;
        this.revised_position.y = this.real_position.y / height;

        this.otherPlayer_real_position.x = this.otherPlayer.position.x - this.map.position.x;
        this.otherPlayer_real_position.y = this.otherPlayer.position.y - this.map.position.y;
        this.otherPlayer_revised_position.x = this.otherPlayer_real_position.x / width;
        this.otherPlayer_revised_position.y = this.otherPlayer_real_position.y / height;
    }

    Create_bomb() {
        this.bombCD = true;
        let tiledMap = this.map.getComponent(cc.TiledMap);
        let layer = tiledMap.getLayer("playerstart");
        let bomb_layer = tiledMap.getLayer("bomb layer");
        let layerSize = layer.getLayerSize();
        let mine_layer = tiledMap.getLayer("mine layer");
        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {
                let bomb_tiled = bomb_layer.getTiledTileAt(i, j, false);
                let mine_tiled = mine_layer.getTiledTileAt(i, j, false);
                if (i > this.revised_position.x - 1 && i < this.revised_position.x && (layerSize.height - j) > this.revised_position.y && (layerSize.height - j) < this.revised_position.y + 1) {
                    let body = bomb_tiled.node.getComponent(cc.RigidBody);
                    if (body.active || mine_tiled.getComponent(cc.Sprite).spriteFrame != null) {
                        break;
                    }
                    create_bomb_num++;
                    if(create_bomb_num > record.userAchievement[6]){
                        record.userAchievement[6] = create_bomb_num;
                    }
                    let Sprite = bomb_tiled.node.getComponent(cc.Sprite);
                    body.active = true;
                    body.enabledContactListener = true;
                    body.onPreSolve = this.Contact;
                    body.onEndContact = this.endContact;
                    let now_otherPlayer = true;
                    if (i > this.otherPlayer_revised_position.x - 1 && i < this.otherPlayer_revised_position.x && (layerSize.height - j) > this.otherPlayer_revised_position.y && (layerSize.height - j) < this.otherPlayer_revised_position.y + 1) {
                        now_otherPlayer = false;
                    }

                    if (this.player_data.special_bomb_number != 0) {
                        this.player_data.bomb_number -= 1;
                        Sprite.spriteFrame = bomb_tiled.node.special_bomb_frame;
                        this.player_data.special_bomb_number -= 1;
                        bomb_tiled.node.attr({
                            bomb_type: 1,
                            owner: this.player,
                            player1_left: false,
                            player2_left: now_otherPlayer,
                            range: this.player_data.bomb_exploded_range,
                            map: this.map
                        });
                    }
                    else if (this.player_data.extra_special_bomb_number != 0) {
                        this.player_data.bomb_number -= 1;
                        Sprite.spriteFrame = bomb_tiled.node.extra_special_bomb_frame;
                        this.player_data.extra_special_bomb_number -= 1;
                        bomb_tiled.node.attr({
                            bomb_type: 2,
                            owner: this.player,
                            player1_left: false,
                            player2_left: now_otherPlayer,
                            range: 1000,
                            map: this.map
                        });
                    }
                    else if (this.player_data.burning_bomb_number != 0) {
                        this.player_data.bomb_number -= 1;
                        Sprite.spriteFrame = bomb_tiled.node.burning_bomb_frame;
                        this.player_data.burning_bomb_number -= 1;
                        bomb_tiled.node.attr({
                            bomb_type: 3,
                            owner: this.player,
                            player1_left: false,
                            player2_left: now_otherPlayer,
                            range: 3,
                            map: this.map
                        });
                    }
                    else if (this.player_data.landmine_number != 0) {
                        body.active = false;
                        Sprite = mine_tiled.getComponent(cc.Sprite);
                        Sprite.spriteFrame = mine_tiled.node.landmine_frame_before_contact;
                        this.player_data.landmine_number -= 1;
                        bomb_tiled.node.attr({
                            bomb_type: 4,
                            owner: this.player,
                            player1_left: false,
                            player2_left: now_otherPlayer,
                            range: this.player_data.bomb_exploded_range,
                            map: this.map
                        });
                        mine_tiled.node.attr({
                            player1_left: false,
                            owner: this.player,
                            player2_left: now_otherPlayer,
                            map: this.map,
                            is_trigger: false,
                            is_touched: false
                        })
                    }
                    else {
                        this.player_data.bomb_number -= 1;
                        Sprite.spriteFrame = this.player_data.bomb_frame;
                        bomb_tiled.node.attr({
                            bomb_type: 0,
                            owner: this.player,
                            player1_left: false,
                            player2_left: now_otherPlayer,
                            range: this.player_data.bomb_exploded_range,
                            map: this.map
                        });

                    }
                    let e = this;
                    switch (bomb_tiled.node.bomb_type) {
                        case 0:
                            //Animation

                            bomb_tiled.schedule(function () {
                                bomb_tiled.getComponent(cc.Sprite).spriteFrame = null;
                            }, 0.4, (e.player_data.bomb_exploded_time / 0.4) - 2, 0);

                            bomb_tiled.schedule(function () {
                                bomb_tiled.getComponent(cc.Sprite).spriteFrame = e.player_data.bomb_frame;
                            }, 0.4, (e.player_data.bomb_exploded_time / 0.4) - 1, 0.1);
                            bomb_tiled.scheduleOnce(this.exploded_effect, this.player_data.bomb_exploded_time);
                            break;
                        case 1:
                            //Animation

                            bomb_tiled.schedule(function () {
                                bomb_tiled.getComponent(cc.Sprite).spriteFrame = null;
                            }, 0.4, e.player_data.bomb_exploded_time / 0.4 - 2, 0);

                            bomb_tiled.schedule(function () {
                                bomb_tiled.getComponent(cc.Sprite).spriteFrame = this.node.special_bomb_frame;
                            }, 0.4, e.player_data.bomb_exploded_time / 0.4 - 1, 0.1);
                            bomb_tiled.scheduleOnce(this.special_exploded_effect, this.player_data.bomb_exploded_time);
                            break;
                        case 2:
                            //Animation
                            bomb_tiled.schedule(function () {
                                bomb_tiled.getComponent(cc.Sprite).spriteFrame = null;
                            }, 0.4, (e.player_data.bomb_exploded_time / 0.4) - 2, 0);

                            bomb_tiled.schedule(function () {
                                bomb_tiled.getComponent(cc.Sprite).spriteFrame = this.node.extra_special_bomb_frame;
                            }, 0.4, (e.player_data.bomb_exploded_time / 0.4) - 1, 0.1);
                            bomb_tiled.scheduleOnce(this.extra_special_exploded_effect, this.player_data.bomb_exploded_time);
                            break;
                        case 3:
                            bomb_tiled.schedule(function () {
                                bomb_tiled.getComponent(cc.Sprite).spriteFrame = null;
                            }, 0.4, e.player_data.bomb_exploded_time / 0.4 - 2, 0);

                            bomb_tiled.schedule(function () {
                                bomb_tiled.getComponent(cc.Sprite).spriteFrame = this.node.burning_bomb_frame;
                            }, 0.4, e.player_data.bomb_exploded_time / 0.4 - 1, 0.1);
                            bomb_tiled.scheduleOnce(this.burning_bomb_exploded_effect, this.player_data.bomb_exploded_time);
                            break;
                    }
                }
            }
        }
    }


    exploded_effect() {
        this.node.owner.getComponent("player_controller").bomb_number += 1;
        this.getComponent(cc.Sprite).spriteFrame = null;
        this.getComponent(cc.RigidBody).active = false;
        let x = this._x;
        let y = this._y;
        let map = this.node.map;
        let tiledMap = map.getComponent(cc.TiledMap);
        cc.log(tiledMap);
        let layer = tiledMap.getLayer("playerstart");
        let layer2 = tiledMap.getLayer("Tile Layer 1");
        let bomb_layer = tiledMap.getLayer("bomb layer");
        let exploded_effect_layer = tiledMap.getLayer("exploded effect layer");
        let item_layer = tiledMap.getLayer("item layer");
        let layerSize = layer.getLayerSize();
        let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y, true);
        exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_center;
        exploded_effect_tiled.unscheduleAllCallbacks();
        exploded_effect_tiled.scheduleOnce(function () {
            this.getComponent(cc.Sprite).spriteFrame = null;
        }, 0.5);

        for (let i = 1; i <= this.node.range; i++) {
            if (x + i > layerSize.width - 1) {
                break;
            }
            let tiled = layer.getTiledTileAt(x + i, y, true);
            let tiled2 = layer2.getTiledTileAt(x + i, y, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x + i, y, true);
            let item_tiled = item_layer.getTiledTileAt(x + i, y, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                if (i != 1) {
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x + (i - 1), y, true);
                    exploded_effect_tiled.node.owner = this.node.owner;
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                cc.log(random_number);
                if (random_number < 24) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 16) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 12) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 8) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 35) {
                    if (random_number <= 26) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 30) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 32) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
                break;
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }


        for (let i = 1; i <= this.node.range; i++) {
            if (x - i < 0) {
                break;
            }
            let tiled = layer.getTiledTileAt(x - i, y, true);
            let tiled2 = layer2.getTiledTileAt(x - i, y, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x - i, y, true);
            let item_tiled = item_layer.getTiledTileAt(x - i, y, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                if (i != 1) {
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x - (i - 1), y, true);
                    exploded_effect_tiled.node.owner = this.node.owner;
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                cc.log(random_number);
                if (random_number < 24) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 16) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 12) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 8) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 35) {
                    if (random_number <= 26) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 30) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 32) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
                break;
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }


        for (let i = 1; i <= this.node.range; i++) {
            if (y + i > layerSize.height - 1) {
                break;
            }
            let tiled = layer.getTiledTileAt(x, y + i, true);
            let tiled2 = layer2.getTiledTileAt(x, y + i, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y + i, true);
            let item_tiled = item_layer.getTiledTileAt(x, y + i, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                if (i != 1) {
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y + (i - 1), true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                cc.log(random_number);
                if (random_number < 24) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 16) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 12) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 8) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 35) {
                    if (random_number <= 26) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 30) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 32) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
                break;
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }


        for (let i = 1; i <= this.node.range; i++) {
            if (y - i < 0) {
                break;
            }
            let tiled = layer.getTiledTileAt(x, y - i, true);
            let tiled2 = layer2.getTiledTileAt(x, y - i, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y - i, true);
            let item_tiled = item_layer.getTiledTileAt(x, y - i, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                if (i != 1) {
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y - (i - 1), true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_up_end;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                cc.log(random_number);
                if (random_number < 24) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 16) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 12) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 8) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 35) {
                    if (random_number <= 26) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 30) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 32) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_up_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
                break;
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_up_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }
    }
    
    special_exploded_effect() {
        //cc.log(this);
        this.getComponent(cc.Sprite).spriteFrame = null;
        this.getComponent(cc.RigidBody).active = false;
        this.node.owner.getComponent("player_controller").bomb_number += 1;
        let x = this._x;
        let y = this._y;
        let map = this.node.map;
        let tiledMap = map.getComponent(cc.TiledMap);
        //cc.log(tiledMap);
        let layer = tiledMap.getLayer("playerstart");
        let layer2 = tiledMap.getLayer("Tile Layer 1");
        let item_layer = tiledMap.getLayer("item layer");
        let bomb_layer = tiledMap.getLayer("bomb layer");
        let exploded_effect_layer = tiledMap.getLayer("exploded effect layer");
        let layerSize = layer.getLayerSize();
        let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y, true);
        exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_center;
        exploded_effect_tiled.unscheduleAllCallbacks();
        exploded_effect_tiled.scheduleOnce(function () {
            this.getComponent(cc.Sprite).spriteFrame = null;
        }, 0.5);

        for (let i = 1; i <= this.node.range; i++) {
            if (x + i > layerSize.width - 1) {
                break;
            }
            let tiled = layer.getTiledTileAt(x + i, y, true);
            let tiled2 = layer2.getTiledTileAt(x + i, y, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x + i, y, true);
            let item_tiled = item_layer.getTiledTileAt(x + i, y, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                if (i != 1) {
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x + (i - 1), y, true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                cc.log(random_number);
                if (random_number < 24) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 16) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 12) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 8) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 35) {
                    if (random_number <= 26) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 30) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 32) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if (i != this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }


        for (let i = 1; i <= this.node.range; i++) {
            if (x - i < 0) {
                break;
            }
            let tiled = layer.getTiledTileAt(x - i, y, true);
            let tiled2 = layer2.getTiledTileAt(x - i, y, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x - i, y, true);
            let item_tiled = item_layer.getTiledTileAt(x - i, y, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                if (i != 1) {
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x - (i - 1), y, true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                cc.log(random_number);
                if (random_number < 24) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 16) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 12) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 8) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 35) {
                    if (random_number <= 26) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 30) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 32) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if (i != this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }


        for (let i = 1; i <= this.node.range; i++) {
            if (y + i > layerSize.height - 1) {
                break;
            }
            let tiled = layer.getTiledTileAt(x, y + i, true);
            let tiled2 = layer2.getTiledTileAt(x, y + i, true);
            let item_tiled = item_layer.getTiledTileAt(x, y + i, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y + i, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                if (i != 1) {
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y + (i - 1), true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                cc.log(random_number);
                if (random_number < 24) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 16) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 12) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 8) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 35) {
                    if (random_number <= 26) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 30) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 32) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if (i != this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }


        for (let i = 1; i <= this.node.range; i++) {
            if (y - i < 0) {
                break;
            }
            let tiled = layer.getTiledTileAt(x, y - i, true);
            let tiled2 = layer2.getTiledTileAt(x, y - i, true);
            let item_tiled = item_layer.getTiledTileAt(x, y - i, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y - i, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                if (i != 1) {
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y - (i - 1), true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                if (random_number < 24) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 16) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 12) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 8) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 35) {
                    if (random_number <= 26) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 30) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 32) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if (i != this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_up_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_up_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }
    }

    extra_special_exploded_effect() {
        //cc.log(this);
        this.getComponent(cc.Sprite).spriteFrame = null;
        this.getComponent(cc.RigidBody).active = false;
        this.node.owner.getComponent("player_controller").bomb_number += 1;
        let x = this._x;
        let y = this._y;
        let map = this.node.map;
        let tiledMap = map.getComponent(cc.TiledMap);
        //cc.log(tiledMap);
        let layer = tiledMap.getLayer("playerstart");
        let layer2 = tiledMap.getLayer("Tile Layer 1");
        let item_layer = tiledMap.getLayer("item layer");
        let bomb_layer = tiledMap.getLayer("bomb layer");
        let exploded_effect_layer = tiledMap.getLayer("exploded effect layer");
        let layerSize = layer.getLayerSize();
        let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y, true);
        exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_center;
        exploded_effect_tiled.unscheduleAllCallbacks();
        exploded_effect_tiled.scheduleOnce(function () {
            this.getComponent(cc.Sprite).spriteFrame = null;
        }, 0.5);

        for (let i = 1; i <= this.node.range; i++) {
            if (x + i >= layerSize.width - 1) {
                break;
            }
            let tiled = layer.getTiledTileAt(x + i, y, true);
            let tiled2 = layer2.getTiledTileAt(x + i, y, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x + i, y, true);
            let item_tiled = item_layer.getTiledTileAt(x + i, y, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                tiled2.getComponent(cc.RigidBody).active = false;
                tiled2.gid = 0;
                if (x + i < layerSize.width - 2)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                cc.log(random_number);
                if (random_number < 24) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 16) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 12) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 8) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 35) {
                    if (random_number <= 26) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 30) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 32) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if (x + i < layerSize.width - 2)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled or other bombs
                if (x + i < layerSize.width - 2)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }


        for (let i = 1; i <= this.node.range; i++) {
            if (x - i <= 0) {
                break;
            }
            let tiled = layer.getTiledTileAt(x - i, y, true);
            let tiled2 = layer2.getTiledTileAt(x - i, y, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x - i, y, true);
            let item_tiled = item_layer.getTiledTileAt(x - i, y, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                tiled2.getComponent(cc.RigidBody).active = false;
                tiled2.gid = 0;
                if (x - i > 1)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end; 
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                cc.log(random_number);
                if (random_number < 24) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 16) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 12) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 8) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 35) {
                    if (random_number <= 26) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 30) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 32) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if (x - i > 1)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled or other bombs
                if (x - i > 1)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }


        for (let i = 1; i <= this.node.range; i++) {
            if (y + i >= layerSize.height - 1) {
                break;
            }
            let tiled = layer.getTiledTileAt(x, y + i, true);
            let tiled2 = layer2.getTiledTileAt(x, y + i, true);
            let item_tiled = item_layer.getTiledTileAt(x, y + i, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y + i, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                tiled2.getComponent(cc.RigidBody).active = false;
                tiled2.gid = 0;
                if (y + i < layerSize.height - 2)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;                
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                cc.log(random_number);
                if (random_number < 24) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 16) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 12) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 8) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 35) {
                    if (random_number <= 26) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 30) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 32) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if (y + i < layerSize.height - 2)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled or other bombs
                if (y + i < layerSize.height - 2)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }


        for (let i = 1; i <= this.node.range; i++) {
            if (y - i < 0) {
                break;
            }
            let tiled = layer.getTiledTileAt(x, y - i, true);
            let tiled2 = layer2.getTiledTileAt(x, y - i, true);
            let item_tiled = item_layer.getTiledTileAt(x, y - i, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y - i, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                tiled2.getComponent(cc.RigidBody).active = false;
                tiled2.gid = 0;
                if (y - i > 1)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_up_end;                
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                if (random_number < 24) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 16) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 12) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 8) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 35) {
                    if (random_number <= 26) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 30) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 32) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if (y - i > 1)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_up_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
            else { // empty tiled or other bombs
                if (y - i > 1)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_up_end;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                exploded_effect_tiled.scheduleOnce(function () {
                    this.getComponent(cc.Sprite).spriteFrame = null;
                }, 0.5);
            }
        }
    }

    burning_bomb_exploded_effect() {
        this.node.owner.getComponent("player_controller").bomb_number += 1;
        this.getComponent(cc.Sprite).spriteFrame = null;
        this.getComponent(cc.RigidBody).active = false;
        let x = this._x;
        let y = this._y;
        let map = this.node.map;
        let tiledMap = map.getComponent(cc.TiledMap);
        //cc.log(tiledMap);
        let layer = tiledMap.getLayer("playerstart");
        let layer2 = tiledMap.getLayer("Tile Layer 1");
        let bomb_layer = tiledMap.getLayer("bomb layer");
        let exploded_effect_layer = tiledMap.getLayer("exploded effect layer");
        let item_layer = tiledMap.getLayer("item layer");
        let layerSize = layer.getLayerSize();
        let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y, true);
        exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
        exploded_effect_tiled.unscheduleAllCallbacks();

        let e = this;
        let count = 0;
        exploded_effect_tiled.schedule(function () {

            this.getComponent(cc.Sprite).spriteFrame = map.getComponent('map_manager').fireList[count % 13];
            count++;
            if (count === 49) {
                this.getComponent(cc.Sprite).spriteFrame = null;
            }
        }, 0.1, 48, 0);

        for (let i = 1; i <= this.node.range; i++) {
            if (x + i >= layerSize.width - 1) {
                break;
            }
            let tiled = layer.getTiledTileAt(x + i, y, true);
            let tiled2 = layer2.getTiledTileAt(x + i, y, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x + i, y, true);
            let item_tiled = item_layer.getTiledTileAt(x + i, y, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                if (i != 1) {
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x + (i - 1), y, true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                cc.log(random_number);
                if (random_number < 25) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 15) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 10) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 5) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 40) {
                    if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 31) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 33) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 35) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                exploded_effect_tiled.unscheduleAllCallbacks();
                let e = this;
                let count = 0;
                exploded_effect_tiled.schedule(function () {

                    this.getComponent(cc.Sprite).spriteFrame = map.getComponent('map_manager').fireList[count % 13];
                    count++;
                    if (count === 49) {
                        this.getComponent(cc.Sprite).spriteFrame = null;
                    }
                }, 0.1, 48, 0);

                break;
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                let e = this;
                let count = 0;
                exploded_effect_tiled.schedule(function () {

                    this.getComponent(cc.Sprite).spriteFrame = map.getComponent('map_manager').fireList[count % 13];
                    count++;
                    if (count === 49) {
                        this.getComponent(cc.Sprite).spriteFrame = null;
                    }
                }, 0.1, 48, 0);
            }
        }


        for (let i = 1; i <= this.node.range; i++) {
            if (x - i < 0) {
                break;
            }
            let tiled = layer.getTiledTileAt(x - i, y, true);
            let tiled2 = layer2.getTiledTileAt(x - i, y, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x - i, y, true);
            let item_tiled = item_layer.getTiledTileAt(x - i, y, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                if (i != 1) {
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x - (i - 1), y, true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                cc.log(random_number);
                if (random_number < 25) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 15) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 10) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 5) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 40) {
                    if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 31) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 33) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 35) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                exploded_effect_tiled.unscheduleAllCallbacks();
                let e = this;
                let count = 0;
                exploded_effect_tiled.schedule(function () {

                    this.getComponent(cc.Sprite).spriteFrame = map.getComponent('map_manager').fireList[count % 13];
                    count++;
                    if (count === 49) {
                        this.getComponent(cc.Sprite).spriteFrame = null;
                    }
                }, 0.1, 48, 0);
                break;
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                exploded_effect_tiled.node.owner = this.node.owner;    
                exploded_effect_tiled.unscheduleAllCallbacks();
                let e = this;
                let count = 0;
                exploded_effect_tiled.schedule(function () {

                    this.getComponent(cc.Sprite).spriteFrame = map.getComponent('map_manager').fireList[count % 13];
                    count++;
                    if (count === 49) {
                        this.getComponent(cc.Sprite).spriteFrame = null;
                    }
                }, 0.1, 48, 0);
            }
        }


        for (let i = 1; i <= this.node.range; i++) {
            if (y + i >= layerSize.height - 1) {
                break;
            }
            let tiled = layer.getTiledTileAt(x, y + i, true);
            let tiled2 = layer2.getTiledTileAt(x, y + i, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y + i, true);
            let item_tiled = item_layer.getTiledTileAt(x, y + i, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                if (i != 1) {
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y + (i - 1), true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                cc.log(random_number);
                if (random_number < 25) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 15) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 10) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 5) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 40) {
                    if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 31) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 33) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 35) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                exploded_effect_tiled.unscheduleAllCallbacks();
                let e = this;
                let count = 0;
                exploded_effect_tiled.schedule(function () {

                    this.getComponent(cc.Sprite).spriteFrame = map.getComponent('map_manager').fireList[count % 13];
                    count++;
                    if (count === 49) {
                        this.getComponent(cc.Sprite).spriteFrame = null;
                    }
                }, 0.1, 48, 0);
                break;
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                let e = this;
                let count = 0;
                exploded_effect_tiled.schedule(function () {

                    this.getComponent(cc.Sprite).spriteFrame = map.getComponent('map_manager').fireList[count % 13];
                    count++;
                    if (count === 49) {
                        this.getComponent(cc.Sprite).spriteFrame = null;
                    }
                }, 0.1, 48, 0);
            }
        }


        for (let i = 1; i <= this.node.range; i++) {
            if (y - i < 0) {
                break;
            }
            let tiled = layer.getTiledTileAt(x, y - i, true);
            let tiled2 = layer2.getTiledTileAt(x, y - i, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y - i, true);
            let item_tiled = item_layer.getTiledTileAt(x, y - i, true);
            if (tiled2.getComponent(cc.RigidBody).active) { //wall
                if (i != 1) {
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y - (i - 1), true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                }
                break;
            }
            if (tiled.getComponent(cc.RigidBody).active) { // box
                let random_number = Math.floor(Math.random() * 100);
                let item_sprite = item_tiled.getComponent(cc.Sprite);
                let body = item_tiled.getComponent(cc.RigidBody);
                cc.log(random_number);
                if (random_number < 25) {
                    if (random_number >= 20) { //type 1
                        item_sprite.spriteFrame = item_tiled.node.type1_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type1;
                    }
                    else if (random_number >= 15) { // type 2
                        item_sprite.spriteFrame = item_tiled.node.type2_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type2;
                    }
                    else if (random_number >= 10) { //type 3
                        item_sprite.spriteFrame = item_tiled.node.type3_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type3;
                    }
                    else if (random_number >= 5) { //type 4
                        item_sprite.spriteFrame = item_tiled.node.type4_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type4;
                    }
                    else { //type 5
                        item_sprite.spriteFrame = item_tiled.node.type5_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type5;
                    }
                }
                else if (random_number <= 40) {
                    if (random_number <= 28) {
                        item_sprite.spriteFrame = item_tiled.node.type6_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type6;
                    }
                    else if (random_number <= 31) {
                        item_sprite.spriteFrame = item_tiled.node.type7_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type7;
                    }
                    else if (random_number <= 33) {
                        item_sprite.spriteFrame = item_tiled.node.type8_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type8;
                    }
                    else if (random_number <= 35) {
                        item_sprite.spriteFrame = item_tiled.node.type9_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type9;
                    }
                    else {
                        item_sprite.spriteFrame = item_tiled.node.type10_item_frame;
                        body.onPreSolve = item_tiled.node.contact_type10;
                    }
                }
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                exploded_effect_tiled.unscheduleAllCallbacks();
                let e = this;
                let count = 0;
                exploded_effect_tiled.schedule(function () {

                    this.getComponent(cc.Sprite).spriteFrame = map.getComponent('map_manager').fireList[count % 13];
                    count++;
                    if (count === 49) {
                        this.getComponent(cc.Sprite).spriteFrame = null;
                    }
                }, 0.1, 48, 0);
                break;
            }
            else { // empty tiled or other bombs
                if (i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.burning_effect;
                exploded_effect_tiled.node.owner = this.node.owner;
                exploded_effect_tiled.unscheduleAllCallbacks();
                let e = this;
                let count = 0;
                exploded_effect_tiled.schedule(function () {

                    this.getComponent(cc.Sprite).spriteFrame = map.getComponent('map_manager').fireList[count % 13];
                    count++;
                    if (count === 49) {
                        this.getComponent(cc.Sprite).spriteFrame = null;
                    }
                }, 0.1, 48, 0);
            }
        }
    }


    Contact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == "player" && selfCollider.node.player1_left == false) {
            contact.disabled = true;
        }
        if (otherCollider.node.name == "player2" && selfCollider.node.player2_left == false) {
            contact.disabled = true;
        }
    }
    endContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == "player" && selfCollider.node.player1_left == false) {
            selfCollider.node.player1_left = true;
        }
        if (otherCollider.node.name == "player2" && selfCollider.node.player2_left == false) {
            selfCollider.node.player2_left = true;
        }
        //selfCollider.node.left = true;
    }

    detect_dead() {
        let tiledMap = this.map.getComponent(cc.TiledMap);
        let layer = tiledMap.getLayer("exploded effect layer");
        let layerSize = layer.getLayerSize();
        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {
                if (i > this.revised_position.x - 1 && i < this.revised_position.x && (layerSize.height - j) > this.revised_position.y && (layerSize.height - j) < this.revised_position.y + 1) {
                    let exploded_effect_tiled = layer.getTiledTileAt(i, j, true);
                    if (exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame != null && this.player_data.is_invincible == false) {
                        if (this.player.getChildByName("shield").active) {
                            this.player.getComponent(cc.PhysicsCircleCollider).unscheduleAllCallbacks();
                            this.player.getChildByName("shield").active = false;
                            this.player_data.is_invincible = true;
                            this.player_data.blick();
                            this.player_data.unscheduleAllCallbacks();
                            this.player_data.scheduleOnce(function () {
                                this.is_invincible = false;
                            }, 2);
                        }
                        else {
                            this.player_data._alive = false;
                            record.userAchievement[4] += 1;
                            if(exploded_effect_tiled.node.owner == this.player){
                                record.userAchievement[5] += 1;
                                cc.log(record.userAchievement[5]);
                            }
                            cc.log("this.player_data._alive", this.player_data._alive);
                        }
                    }
                }
            }
        }
    }
}
