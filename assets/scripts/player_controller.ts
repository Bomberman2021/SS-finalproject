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


    public skin: String = "normal";
    public color: String = "white";


    public _alive = true;
    private _speed = 0;
    private _direction = 'static';

    private frameCount = 0;

    private walkRightSprites: any = [0, 1, 2, 3, 4, 5, 6, 7];
    private walkDownSprites: any = [0, 1, 2, 3];

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this._speed = 100;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        //Load Sprites
        let me = this;

        ////walkright
        for (let i = 0; i < 8; i++) {
            cc.loader.loadRes('character sprites/' + this.skin + '/' + this.color + '/walkright/walkright-' + i, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.log(err);
                    return;
                }
                me.walkRightSprites[i] = spriteFrame;
            });
        }

        ////walkdown
        for (let i = 0; i < 4; i++) {
            cc.loader.loadRes('character sprites/' + this.skin + '/' + this.color + '/walkdown/walkdown-' + i, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.log(err);
                    return;
                }
                me.walkDownSprites[i] = spriteFrame;
            });
        }


    }

    onKeyDown(e) {
        Input[e.keyCode] = 1;
    }

    onKeyUp(e) {
        Input[e.keyCode] = 0;
        this._direction = 'static';
    }

    update(dt) {
        if (Input[cc.macro.KEY.a]) {
            this.node.x -= this._speed * dt;
            this._direction = 'left'
        }
        else if (Input[cc.macro.KEY.d]) {
            this.node.x += this._speed * dt;
            this._direction = 'right'
        }
        else if (Input[cc.macro.KEY.w]) {
            this.node.y += this._speed * dt;
            this._direction = 'up'
        }
        else if (Input[cc.macro.KEY.s]) {
            this.node.y -= this._speed * dt;
            this._direction = 'down'
        }

        switch (this._direction) {
            case 'right':
                this.walkRight();
                break;
            case 'down':
                this.walkDown();
                break;
        }
    }

    walkRight() {
        this.frameCount %= 40;
        this.node.getChildByName('body').getComponent(cc.Sprite).spriteFrame = this.walkRightSprites[Math.floor(this.frameCount / 5)];
        this.frameCount++;
    }

    walkDown() {
        this.frameCount %= 40;
        this.node.getChildByName('body').getComponent(cc.Sprite).spriteFrame = this.walkDownSprites[Math.floor(this.frameCount / 10)];
        this.frameCount++;
    }


}
