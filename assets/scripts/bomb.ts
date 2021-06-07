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
    private exploded_range = 1;
    private exploded_speed = 1000;
    private real_position:cc.Vec2 = cc.v2(0,0);
    private revised_position:cc.Vec2 = cc.v2(0,0);
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
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
            cc.log(1);
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
        cc.log(layerSize);
        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {
                let tiled = layer.getTiledTileAt(i, j, true);
                if(i > this.revised_position.x - 1 && i < this.revised_position.x && (layerSize.height - j) > this.revised_position.y && (layerSize.height - j) < this.revised_position.y + 1){
                    let Sprite = tiled.node.addComponent(cc.Sprite);
                    Sprite.spriteFrame = this.bomb_frame;
                    tiled.node.anchorX = 0;
                    tiled.node.anchorY = 0;
                }
            }
        }
    }
}
