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


    public skin: String = "brucelee";
    public color: String = "red";


    public _alive = true;
    public _speed = 0;
    private _direction = 'static';

    private frameCount = 0;
    public bomb_number = 2;
    public special_bomb_number = 3;
    public extra_special_bomb_number = 3;
    public bomb_exploded_range = 3;
    public bomb_exploded_time = 1;
    private walkRightSprites: any = [0, 1, 2, 3, 4, 5, 6, 7];
    private walkDownSprites: any = [0, 1, 2, 3];
    private walkUpSprites: any = [0, 1, 2, 3];

    private headSprites: any = [0, 1, 2];
    private faceSprites: any = [0, 1, 2];


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

        ////walkup
        for (let i = 0; i < 4; i++) {
            cc.loader.loadRes('character sprites/' + this.skin + '/' + this.color + '/walkup/walkup-' + i, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.log(err);
                    return;
                }
                me.walkUpSprites[i] = spriteFrame;
            });
        }

        ////head [back, right, front]
        for (let i = 0; i < 3; i++) {
            cc.loader.loadRes('character sprites/' + this.skin + '/' + this.color + '/heads/head-' + i, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.log(err);
                    return;
                }
                me.headSprites[i] = spriteFrame;
            });
        }

        ////face [both, cry, side]
        cc.loader.loadRes('character sprites/face/botheye', cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.log(err);
                return;
            }
            me.faceSprites[0] = spriteFrame;
        });
        cc.loader.loadRes('character sprites/face/cryface', cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.log(err);
                return;
            }
            me.faceSprites[1] = spriteFrame;
        });
        cc.loader.loadRes('character sprites/face/sideeye', cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.log(err);
                return;
            }
            me.faceSprites[2] = spriteFrame;
        });




    }

    onKeyDown(e) {
        Input[e.keyCode] = 1;
    }

    onKeyUp(e) {
        Input[e.keyCode] = 0;
        this._direction = 'static';
    }


    update(dt) {
        //cc.log("x:",this.node.x);
        let head = this.node.getChildByName('head');
        let body = this.node.getChildByName('body');
        let face = this.node.getChildByName('face');

        if (this._direction === 'left') {
            head.setPosition(6, head.position.y);
            body.getComponent(cc.Sprite).node.scaleX = -1;
            head.getComponent(cc.Sprite).node.scaleX = -1;

            face.setPosition(-15, face.position.y);
            face.getComponent(cc.Sprite).spriteFrame = this.faceSprites[2];
            face.active = true;

        } else if (this._direction === 'right') {
            head.setPosition(-6, head.position.y);
            body.getComponent(cc.Sprite).node.scaleX = 1;
            head.getComponent(cc.Sprite).node.scaleX = 1;

            face.getComponent(cc.Sprite).spriteFrame = this.faceSprites[2];
            face.setPosition(15, face.position.y);
            face.active = true;
        } else if (this._direction === 'up') {
            head.setPosition(0, head.position.y);

            face.active = false;
        } else if (this._direction === 'down') {
            head.setPosition(0, head.position.y);

            face.getComponent(cc.Sprite).spriteFrame = this.faceSprites[0];
            face.active = true;
            face.setPosition(0, face.position.y);
        }

        if (Input[cc.macro.KEY.a]) {
            this.node.x -= this._speed * dt;
            this._direction = 'left'
            head.getComponent(cc.Sprite).spriteFrame = this.headSprites[1];
        }
        else if (Input[cc.macro.KEY.d]) {
            this.node.x += this._speed * dt;
            //this.node.runAction(cc.moveTo(0.5,448,this.node.y));
            this._direction = 'right'
            head.getComponent(cc.Sprite).spriteFrame = this.headSprites[1];

        }
        else if (Input[cc.macro.KEY.w]) {
            this.node.y += this._speed * dt;
            this._direction = 'up'
            head.getComponent(cc.Sprite).spriteFrame = this.headSprites[0];

        }
        else if (Input[cc.macro.KEY.s]) {
            this.node.y -= this._speed * dt;
            this._direction = 'down'
            head.getComponent(cc.Sprite).spriteFrame = this.headSprites[2];

        }


        switch (this._direction) {
            case 'right':
            case 'left':
                this.walkRight();
                break;
            case 'down':
                this.walkDown();
                break;
            case 'up':
                this.walkUp();
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

    walkUp() {
        this.frameCount %= 40;
        this.node.getChildByName('body').getComponent(cc.Sprite).spriteFrame = this.walkUpSprites[Math.floor(this.frameCount / 10)];
        this.frameCount++;
    }






}
