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
    @property(cc.Node)
    map:cc.Node = null;
    @property(cc.Node)
    player:cc.Node = null;
    private real_position:cc.Vec2 = cc.v2(0,0);
    private revised_position:cc.Vec2 = cc.v2(0,0);
    bombCD : boolean = false;// if true, can't put bomb
    // LIFE-CYCLE CALLBACKS:
    bombTest: cc.Node = null;
    player_data = null;

    
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
        var mybomb = this;
        if(Input[cc.macro.KEY.space]){
            this.player_data = this.player.getComponent("player_controller");
            if(this.bombCD == false && this.player_data.bomb_number != 0){
                this.Create_bomb();
                setTimeout(function(){
                    mybomb.bombCD = false;
                },200)
            }
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
        this.bombCD = true;
        let tiledMap = this.map.getComponent(cc.TiledMap);
        let layer = tiledMap.getLayer("playerstart");
        let bomb_layer = tiledMap.getLayer("bomb layer");
        let layerSize = layer.getLayerSize();
        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {
                let bomb_tiled = bomb_layer.getTiledTileAt(i, j, false);
                if(i > this.revised_position.x - 1 && i < this.revised_position.x && (layerSize.height - j) > this.revised_position.y && (layerSize.height - j) < this.revised_position.y + 1){
                    let body = bomb_tiled.node.getComponent(cc.RigidBody);
                    if(body.active){
                        break;
                    }
                    this.player_data.bomb_number -= 1;
                    let Sprite = bomb_tiled.node.getComponent(cc.Sprite);
                    body.active = true;
                    body.enabledContactListener = true;
                    body.onBeginContact = this.Contact;
                    body.onEndContact = this.endContact;
                    if(this.player_data.extra_special_bomb_number!=0){
                        Sprite.spriteFrame = bomb_tiled.node.extra_special_bomb_frame;
                        this.player_data.extra_special_bomb_number -= 1;
                        bomb_tiled.node.attr({
                            bomb_type: 2,
                            owner: this.player,
                            left:false,
                            range: this.player_data.bomb_exploded_range,
                            map: this.map
                        });
                    }
                    else if(this.player_data.special_bomb_number!=0)
                    {
                        Sprite.spriteFrame = bomb_tiled.node.special_bomb_frame;
                        this.player_data.special_bomb_number -= 1;
                        bomb_tiled.node.attr({
                            bomb_type: 1,
                            owner: this.player,
                            left:false,
                            range: this.player_data.bomb_exploded_range,
                            map: this.map
                        });
                    }
                    else{
                        Sprite.spriteFrame = bomb_tiled.node.bomb_frame;
                        bomb_tiled.node.attr({
                            bomb_type: 0,
                            owner: this.player,
                            left:false,
                            range: this.player_data.bomb_exploded_range,
                            map: this.map
                        });
                        
                    }
 
                    switch(bomb_tiled.node.bomb_type){
                        case 0:
                            bomb_tiled.scheduleOnce(this.exploded_effect, this.player_data.bomb_exploded_time);
                            break;
                        case 1:
                            bomb_tiled.scheduleOnce(this.special_exploded_effect, this.player_data.bomb_exploded_time);
                            break;
                        case 2:
                            bomb_tiled.scheduleOnce(this.special_exploded_effect, this.player_data.bomb_exploded_time);
                            break;
                    }
                }
            }
        }
    }


    exploded_effect(){
        cc.log(this);
        this.node.owner.getComponent("player_controller").bomb_number += 1;
        this.getComponent(cc.Sprite).spriteFrame = null;
        this.getComponent(cc.RigidBody).active = false;
        let x = this._x;
        let y = this._y;
        let map = this.node.map;
        let tiledMap = map.getComponent(cc.TiledMap);
        cc.log(tiledMap);
        this.node.map = null;
        let layer = tiledMap.getLayer("playerstart");
        let layer2 = tiledMap.getLayer("Tile Layer 1");
        let bomb_layer = tiledMap.getLayer("bomb layer");
        let exploded_effect_layer = tiledMap.getLayer("exploded effect layer");
        let layerSize = layer.getLayerSize();
        let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y, true);
        exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_center;
        exploded_effect_tiled.unscheduleAllCallbacks();
        exploded_effect_tiled.scheduleOnce(function(){
            this.getComponent(cc.Sprite).spriteFrame = null;
        },0.5);

        for(let i = 1; i<= this.node.range; i++){
            if(x + i > layerSize.width){
                break;
            }
            let tiled = layer.getTiledTileAt(x + i, y, true);
            let tiled2 = layer2.getTiledTileAt(x + i, y, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x + i, y, true);
            if(tiled2.getComponent(cc.RigidBody) != null){ //wall
                if(i != 1){
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x + (i - 1), y, true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                }
                break;
            }
            if(tiled.getComponent(cc.RigidBody).active){ // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                exploded_effect_tiled.unscheduleAllCallbacks();  
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
                break;
            }
            else{ // empty tiled or other bombs
                if(i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                exploded_effect_tiled.unscheduleAllCallbacks();   
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
            }
        }


        for(let i = 1; i<= this.node.range; i++){
            if(x - i < 0){
                break;
            }
            let tiled = layer.getTiledTileAt(x - i, y, true);
            let tiled2 = layer2.getTiledTileAt(x - i, y, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x - i, y, true);
            if(tiled2.getComponent(cc.RigidBody) != null){ //wall
                if(i != 1){
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x - (i-1), y, true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end;
                }
                break;
            }
            if(tiled.getComponent(cc.RigidBody).active){ // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end;
                exploded_effect_tiled.unscheduleAllCallbacks();  
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
                break;
            }
            else{ // empty tiled or other bombs
                if(i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                exploded_effect_tiled.unscheduleAllCallbacks();   
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
            }
        }


        for(let i = 1; i<= this.node.range; i++){
            if(y + i > layerSize.width){
                break;
            }
            let tiled = layer.getTiledTileAt(x, y + i, true);
            let tiled2 = layer2.getTiledTileAt(x, y + i, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y + i, true);
            if(tiled2.getComponent(cc.RigidBody) != null){ //wall
                if(i != 1){
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y + (i - 1), true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;
                }
                break;
            }
            if(tiled.getComponent(cc.RigidBody).active){ // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;
                exploded_effect_tiled.unscheduleAllCallbacks();  
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
                break;
            }
            else{ // empty tiled or other bombs
                if(i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                exploded_effect_tiled.unscheduleAllCallbacks();   
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
            }
        }


        for(let i = 1; i<= this.node.range; i++){
            if(y - i < 0){
                break;
            }
            let tiled = layer.getTiledTileAt(x, y - i, true);
            let tiled2 = layer2.getTiledTileAt(x, y - i, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y - i, true);
            if(tiled2.getComponent(cc.RigidBody) != null){ //wall
                if(i != 1){
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y - (i - 1), true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_up_end;
                }
                break;
            }
            if(tiled.getComponent(cc.RigidBody).active){ // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_up_end;
                exploded_effect_tiled.unscheduleAllCallbacks();  
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
                break;
            }
            else{ // empty tiled or other bombs
                if(i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_up_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                exploded_effect_tiled.unscheduleAllCallbacks();   
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
            }
        }
    }

    special_exploded_effect(){
        //cc.log(this);
        this.getComponent(cc.Sprite).spriteFrame = null;
        this.getComponent(cc.RigidBody).active = false;
        this.node.owner.getComponent("player_controller").bomb_number += 1;
        let x = this._x;
        let y = this._y;
        let map = this.node.map;
        let tiledMap = map.getComponent(cc.TiledMap);
        //cc.log(tiledMap);
        this.node.map = null;
        let layer = tiledMap.getLayer("playerstart");
        let layer2 = tiledMap.getLayer("Tile Layer 1");
        let bomb_layer = tiledMap.getLayer("bomb layer");
        let exploded_effect_layer = tiledMap.getLayer("exploded effect layer");
        let layerSize = layer.getLayerSize();
        let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y, true);
        exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_center;
        exploded_effect_tiled.unscheduleAllCallbacks();
        exploded_effect_tiled.scheduleOnce(function(){
            this.getComponent(cc.Sprite).spriteFrame = null;
        },0.5);

        for(let i = 1; i<= this.node.range; i++){
            if(x + i > layerSize.width){
                break;
            }
            let tiled = layer.getTiledTileAt(x + i, y, true);
            let tiled2 = layer2.getTiledTileAt(x + i, y, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x + i, y, true);
            if(tiled2.getComponent(cc.RigidBody) != null){ //wall
                if(i != 1){
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x + (i - 1), y, true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                }
                break;
            }
            if(tiled.getComponent(cc.RigidBody).active){ // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if(i != this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                exploded_effect_tiled.unscheduleAllCallbacks();  
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
            }
            else{ // empty tiled or other bombs
                if(i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_right_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                exploded_effect_tiled.unscheduleAllCallbacks();   
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
            }
        }


        for(let i = 1; i<= this.node.range; i++){
            if(x - i < 0){
                break;
            }
            let tiled = layer.getTiledTileAt(x - i, y, true);
            let tiled2 = layer2.getTiledTileAt(x - i, y, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x - i, y, true);
            if(tiled2.getComponent(cc.RigidBody) != null){ //wall
                if(i != 1){
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x - (i-1), y, true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end;
                }
                break;
            }
            if(tiled.getComponent(cc.RigidBody).active){ // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if(i != this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end;
                exploded_effect_tiled.unscheduleAllCallbacks();  
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
            }
            else{ // empty tiled or other bombs
                if(i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_left_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_horizontal;
                exploded_effect_tiled.unscheduleAllCallbacks();   
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
            }
        }


        for(let i = 1; i<= this.node.range; i++){
            if(y + i > layerSize.width){
                break;
            }
            let tiled = layer.getTiledTileAt(x, y + i, true);
            let tiled2 = layer2.getTiledTileAt(x, y + i, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y + i, true);
            if(tiled2.getComponent(cc.RigidBody) != null){ //wall
                if(i != 1){
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y + (i - 1), true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;
                }
                break;
            }
            if(tiled.getComponent(cc.RigidBody).active){ // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if(i != this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;
                exploded_effect_tiled.unscheduleAllCallbacks();  
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
            }
            else{ // empty tiled or other bombs
                if(i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_down_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                exploded_effect_tiled.unscheduleAllCallbacks();   
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
            }
        }


        for(let i = 1; i<= this.node.range; i++){
            if(y - i < 0){
                break;
            }
            let tiled = layer.getTiledTileAt(x, y - i, true);
            let tiled2 = layer2.getTiledTileAt(x, y - i, true);
            let exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y - i, true);
            if(tiled2.getComponent(cc.RigidBody) != null){ //wall
                if(i != 1){
                    exploded_effect_tiled = exploded_effect_layer.getTiledTileAt(x, y - (i - 1), true);
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                }
                break;
            }
            if(tiled.getComponent(cc.RigidBody).active){ // box
                tiled.getComponent(cc.RigidBody).active = false;
                tiled.getComponent(cc.Sprite).spriteFrame = null;
                if(i!=this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                else 
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_up_end;
                exploded_effect_tiled.unscheduleAllCallbacks();  
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
            }
            else{ // empty tiled or other bombs
                if(i == this.node.range)
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_up_end;
                else
                    exploded_effect_tiled.getComponent(cc.Sprite).spriteFrame = exploded_effect_tiled.node.exploded_effect_vertical;
                exploded_effect_tiled.unscheduleAllCallbacks();   
                exploded_effect_tiled.scheduleOnce(function(){
                    this.getComponent(cc.Sprite).spriteFrame = null;
                },0.5);
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
