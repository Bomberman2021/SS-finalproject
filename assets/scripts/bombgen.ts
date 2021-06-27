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

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    map:cc.Node = null;

    // @property(cc.Node)
    // player:cc.Node = null;
    // @property(cc.Node)
    // otherPlayer: cc.Node = null;

    // private real_position:cc.Vec2 = cc.v2(0,0);
    // private revised_position:cc.Vec2 = cc.v2(0,0);

    // private otherPlayer_real_position:cc.Vec2 = cc.v2(0,0);
    // private otherPlayer_revised_position:cc.Vec2 = cc.v2(0,0);
    bombGenTime: number = 10;
    Time: number = 0;
    preTime: number = 0;
    timeSpot: number[] = [3,8,13,19,25,31];//gen
    bombNum: number[] = [1,3,5,6,7,8];//density
    bombSitX: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    bombSitY: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    TimeIdx:number = 0;
    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        //cc.log(this);
        for(let i=0;i<18;i++){
            let random_number = Math.floor(Math.random() * 100) % 16 + 1;
            let random_number2 = Math.floor(Math.random() * 100) % 16 + 1;
            this.bombSitX[i] = random_number;
            this.bombSitY[i] = random_number2;
        }
    }

    start () {
        
    }

    update(dt){
        this.Time += dt;
        if(this.timeSpot[this.TimeIdx] < this.Time && this.timeSpot[this.TimeIdx]+1 > this.Time){
            if(this.Time - this.preTime > 1){
                this.preTime = this.Time;
                this.Create_bomb();
                this.TimeIdx+=1;
            }
        }

    }

    Create_bomb(){
        //for cnt time
        let successCreate = 0;
        for(let cnt = 0;cnt<18;cnt++){
            cc.log("cnt=",cnt,"success=",successCreate);
            if(successCreate >= this.bombNum[this.TimeIdx])
                break;
            let tiledMap = this.map.getComponent(cc.TiledMap);
            let layer = tiledMap.getLayer("playerstart");
            let bomb_layer = tiledMap.getLayer("bomb layer");
            let layerSize = layer.getLayerSize();
            if(this.bombSitX[cnt]>0 && this.bombSitX[cnt]<layerSize.width-1 && this.bombSitY[cnt]>0 && this.bombSitY[cnt]<layerSize.height-1){
                //if not around player

                successCreate+=1;
                let bomb_tiled = bomb_layer.getTiledTileAt(this.bombSitX[cnt], this.bombSitY[cnt], false);
                let body = bomb_tiled.node.getComponent(cc.RigidBody);
                if(!body.active){
                    let Sprite = bomb_tiled.node.getComponent(cc.Sprite);
                    body.active = true;
                    body.enabledContactListener = true;
                
                    body.onPreSolve = this.Contact;
                    body.onEndContact = this.endContact;
                    Sprite.spriteFrame = bomb_tiled.node.bomb_frame;
                    bomb_tiled.node.attr({
                        bomb_type: 0,
                        player1_left: true,
                        player2_left: true,
                        range: 20,
                        map: this.map
                    });
                    bomb_tiled.scheduleOnce(this.exploded_effect, 2);
                }
            }
        }
        for(let i=0;i<18;i++){
            let random_number = Math.floor(Math.random() * 100) % 16 + 1;
            let random_number2 = Math.floor(Math.random() * 100) % 16 + 1;
            this.bombSitX[i] = random_number;
            this.bombSitY[i] = random_number2;
        }
        //for generate 18 ramdom
    }

    exploded_effect(){
        
    }






    Contact(contact, selfCollider, otherCollider){
        if(otherCollider.node.name == "player" && selfCollider.node.player1_left == false){
            contact.disabled = true;
        }
        if(otherCollider.node.name == "player2" && selfCollider.node.player2_left == false){
            contact.disabled = true;
        }
    }
    endContact(contact, selfCollider, otherCollider){
        if(otherCollider.node.name == "player" && selfCollider.node.player1_left == false){
            selfCollider.node.player1_left = true;
        }
        if(otherCollider.node.name == "player2" && selfCollider.node.player2_left == false){
            selfCollider.node.player2_left = true;
        }
        //selfCollider.node.left = true;
    }
}
