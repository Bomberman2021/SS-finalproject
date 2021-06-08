// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

const Input = {}
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.SpriteFrame)
    bomb_frame:cc.SpriteFrame = null;
    @property(cc.Node)
    map:cc.Node = null;
    @property(cc.Node)
    player:cc.Node = null;

    private time_count = 0;
    private is_exploded = false;
    private exploded_range = 2;
    private exploded_time = 1;
    private real_position:cc.Vec2 = cc.v2(0,0);
    private revised_position:cc.Vec2 = cc.v2(0,0);
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.director.getPhysicsManager().enabled = true;
    }
    start () {
    }
    onKeyDown(e) {
        Input[e.keyCode] = 1;
    }

    onKeyUp(e) {
        Input[e.keyCode] = 0;
    }


    update (dt) {
        this.Change_position();
        if(Input[cc.macro.KEY.space]){
            this.Create_bomb();
        }
    }

    Change_position(){
        this.real_position.x = this.player.position.x - this.map.position.x;
        this.real_position.y = this.player.position.y - this.map.position.y;
        let tiledMap = this.map.getComponent(cc.TiledMap);
        let tiledSize = tiledMap.getTileSize();
        let height = tiledSize.height * this.node.scaleY;
        let width = tiledSize.width * this.node.scaleX;
        this.revised_position.x = this.real_position.x / width;
        this.revised_position.y = this.real_position.y / height;
    }
    Create_bomb(){
        let tiledMap = this.map.getComponent(cc.TiledMap);
        let layer = tiledMap.getLayer("playerstart");
        let layerSize = layer.getLayerSize();
        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {
                let tiled = layer.getTiledTileAt(i, j, true);
                if(i > this.revised_position.x - 1 && i < this.revised_position.x && (layerSize.height - j) > this.revised_position.y && (layerSize.height - j) < this.revised_position.y + 1){
                    let Sprite = tiled.node.addComponent(cc.Sprite);
                    Sprite.spriteFrame = this.bomb_frame;
                    tiled.node.anchorX = 0;
                    tiled.node.anchorY = 0;
                    let body = tiled.node.addComponent(cc.RigidBody);
                    body.type = cc.RigidBodyType.Static;
                    body.enabledContactListener = true;
                    tiled.node.attr({
                        left:false,
                        range: this.exploded_range,
                        map: this.map
                    });
                    let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
                    let tiledSize = tiledMap.getTileSize();
                    collider.offset = cc.v2(tiledSize.height / 2, tiledSize.width / 2);
                    collider.size = tiledSize;
                    collider.apply();
                    body.onBeginContact = this.Contact;
                    body.onEndContact = this.endContact;
                    tiled.scheduleOnce(this.exploded_effect, this.exploded_time);
                }
            }
        }
    }
    exploded_effect(){
        this.getComponent(cc.Sprite).spriteFrame = null;
        this.getComponent(cc.Sprite).destroy();
        this.getComponent(cc.RigidBody).destroy();
        this.getComponent(cc.PhysicsBoxCollider).destroy();
        let x = this._x;
        let y = this._y;
        let map = this.node.map;
        cc.log(x)
        cc.log(this.node.range);
        let tiledMap = map.getComponent(cc.TiledMap);
        let layer = tiledMap.getLayer("playerstart");
        let layer2 = tiledMap.getLayer("Tile Layer 1");
        let layerSize = layer.getLayerSize();
        for(let i = 1; i<= this.node.range; i++){
            if(x + i > layerSize.width){
                break;
            }
            cc.log(i);
            let tiled = layer.getTiledTileAt(x + i, y, true);
            let tiled2 = layer2.getTiledTileAt(x + i, y, true);
            cc.log(tiled);
            if(tiled2.getComponent(cc.RigidBody) != null){
                break;
            }
            if(tiled.getComponent(cc.RigidBody) != null){
                tiled.getComponent(cc.RigidBody).destroy();
                tiled.getComponent(cc.PhysicsBoxCollider).destroy();
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                tiled.getComponent(cc.Sprite).destroy();
                break;
            }
        }
        for(let i = 1; i<= this.node.range; i++){
            if(x - i < 0){
                break;
            }
            cc.log(i);
            let tiled = layer.getTiledTileAt(x - i, y, true);
            let tiled2 = layer2.getTiledTileAt(x - i, y, true);
            cc.log(tiled);
            if(tiled2.getComponent(cc.RigidBody) != null){
                break;
            }
            if(tiled.getComponent(cc.RigidBody) != null){
                tiled.getComponent(cc.RigidBody).destroy();
                tiled.getComponent(cc.PhysicsBoxCollider).destroy();
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                tiled.getComponent(cc.Sprite).destroy();
                break;
            }
        }
        for(let i = 1; i<= this.node.range; i++){
            if(y - i < 0){
                break;
            }
            cc.log(i);
            let tiled = layer.getTiledTileAt(x , y - i, true);
            let tiled2 = layer2.getTiledTileAt(x, y - i, true);
            cc.log(tiled);
            if(tiled2.getComponent(cc.RigidBody) != null){
                break;
            }
            if(tiled.getComponent(cc.RigidBody) != null){
                tiled.getComponent(cc.RigidBody).destroy();
                tiled.getComponent(cc.PhysicsBoxCollider).destroy();
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                tiled.getComponent(cc.Sprite).destroy();
                break;
            }
        }
        for(let i = 1; i<= this.node.range; i++){
            if(y+i > layerSize.height){
                break;
            }
            cc.log(i);
            let tiled = layer.getTiledTileAt(x, y + i, true);
            let tiled2 = layer2.getTiledTileAt(x, y + i, true);
            cc.log(tiled);
            if(tiled2.getComponent(cc.RigidBody) != null){
                break;
            }
            if(tiled.getComponent(cc.RigidBody) != null){
                tiled.getComponent(cc.RigidBody).destroy();
                tiled.getComponent(cc.PhysicsBoxCollider).destroy();
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                tiled.getComponent(cc.Sprite).destroy();
                break;
            }
        }

    }
    Contact(contact, selfCollider, otherCollider){
        if(otherCollider.node.name == "player" && selfCollider.node.left == false){
            contact.disabled = true;
        }
    }
    endContact(contact, selfCollider, otherCollider){
        selfCollider.node.left = true;
    }
}
