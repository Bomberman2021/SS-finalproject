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

const Input = {}
@ccclass
export default class NewClass extends cc.Component {


    public _alive = true;
    private _speed = 0;

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this._speed = 100;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(e) {
        Input[e.keyCode] = 1;
    }

    onKeyUp(e) {
        Input[e.keyCode] = 0;
    }

    update(dt) {
        if(Input[cc.macro.KEY.a]){
            console.log("向左")
            this.node.x -= this._speed * dt;
        }
        else if(Input[cc.macro.KEY.d]){
            console.log("向右")
            this.node.x += this._speed * dt;
        }
        else if(Input[cc.macro.KEY.w]){
            console.log("向上")
            this.node.y += this._speed * dt;
        }
        else if(Input[cc.macro.KEY.s]){
            console.log("向下")
            this.node.y -= this._speed * dt;
        }
    }

    
}
