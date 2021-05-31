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


    public _alive = true;

    private walk_up: boolean = false;
    private walk_down: boolean = false;
    private walk_left: boolean = false;
    private walk_right: boolean = false;

    private rigidbody: cc.RigidBody;

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.rigidbody = this.node.getComponent(cc.RigidBody)
    }

    start() {


    }

    up() {
        this.rigidbody.linearVelocity = cc.v2(0, 100)
    }

    down() {
        this.rigidbody.linearVelocity = cc.v2(0, -100)
    }

    left() {
        this.rigidbody.linearVelocity = cc.v2(-100, 0)
    }

    right() {
        this.rigidbody.linearVelocity = cc.v2(100, 0)
    }

    stop() {
        this.walk_down = false
        this.walk_left = false
        this.walk_right = false
        this.walk_up = false
        this.rigidbody.linearVelocity = cc.v2(0, 0)
    }

    onKeyDown(e) {
        let key_code = e.keyCode;
        if (key_code == cc.macro.KEY.w) {
            this.walk_up = true;
        } else if (key_code == cc.macro.KEY.a) {
            this.walk_left = true;
        } else if (key_code == cc.macro.KEY.s) {
            this.walk_down = true;
        } else if (key_code == cc.macro.KEY.d) {
            this.walk_right = true;
        }
    }

    onKeyUp(e) {
        this.stop()
    }

    update(dt) {
        if (this._alive) {
            if (this.walk_down) this.down()
            if (this.walk_up) this.up()
            if (this.walk_left) this.left()
            if (this.walk_right) this.right()
        }
    }
}
