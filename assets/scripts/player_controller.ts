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
const skin_list = ["normal", "boxer", "brucelee", "bullman", "caveman", "ebifry", "egypt", "mexican", "ninja", "pirate", "russian"];
const bomb_list = ["normal", "watermelon", "soccer", "baseball", "UFO"];
const Input = {};
let record = null;
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    timeText: cc.Node = null;//only player1 need
    @property(cc.Node)
    lifeText: cc.Node = null;
    @property(cc.Node)
    map: cc.Node = null;

    public skin: String = "brucelee";
    public color: String = "red";
    public bomb: String = "";

    public is_invincible = false;
    public _alive = true;
    public _speed = 0;
    private _direction = 'static';
    public coin = 0;
    private frameCount = 0;
    public bomb_number = 1;
    public special_bomb_number = 0;
    public extra_special_bomb_number = 0;
    public bomb_exploded_range = 1;
    public bomb_exploded_time = 1;
    public bomb_frame: any = null;
    private walkRightSprites: any = [0, 1, 2, 3, 4, 5, 6, 7];
    private walkDownSprites: any = [0, 1, 2, 3];
    private walkUpSprites: any = [0, 1, 2, 3];

    private headSprites: any = [0, 1, 2];
    private faceSprites: any = [0, 1, 2];
    //should get by persist node
    public lifeNum: number = 3;
    public Timer: number = 60;
    public isDeadTest: boolean = false;
    public killTest: boolean = false;
    public rebornX: number = 0;
    public rebornY: number = 0;


    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        record = cc.find("record").getComponent("record")
        this.skin = skin_list[record.player1Skin];
        this.color = record.player1Color;
        this.bomb = bomb_list[record.player1Bomb];
        this._speed = 100;
        this.lifeNum = parseInt(record.settingLife);
        this.Timer = parseInt(record.settingTime);

        this._direction = 'static';

        this.rebornX = this.node.x;
        this.rebornY = this.node.y;
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
                //onload check
                if (i == 3) {
                    me.node.getChildByName('body').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
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
                //onload check
                if (i == 2) {
                    me.node.getChildByName('head').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    me.node.getChildByName('head').active = true;
                }
            });

        }

        ////face [both, cry, side]
        cc.loader.loadRes('character sprites/face/botheye', cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.log(err);
                return;
            }
            me.faceSprites[0] = spriteFrame;

            //onload check
            me.node.getChildByName('face').getComponent(cc.Sprite).spriteFrame = spriteFrame;

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

        cc.loader.loadRes('object sprites/' + this.bomb, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.log(err);
                return;
            }
            me.bomb_frame = spriteFrame;
        });
    }


    onKeyDown(e) {
        Input[e.keyCode] = 1;
        if (e.keyCode == cc.macro.KEY.k) {
            this.reborn();
            this.lifeNum -= 1;
        }
    }

    onKeyUp(e) {
        Input[e.keyCode] = 0;
        this._direction = 'static';
    }



    update(dt) {

        if (this._alive == false) {
            this.lifeNum -= 1;
            this.reborn();
        }
        this.updateTime(dt);// only player1 need
        this.updateLife();
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

    updateTime(dt) {
        this.Timer -= dt;
        if (this.Timer <= 0) {
            //this.playDeath();
            cc.log("end Game");
        } else {
            this.timeText.getComponent(cc.Label).string = this.Timer.toFixed(0).toString();
        }
    }

    updateLife() {
        this.lifeText.getComponent(cc.Label).string = this.lifeNum.toString();
        if (this.lifeNum <= 0) {
            cc.log("game end");
        }
    }

    reborn() {
        //this.lifeNum-=1;

        let blink = cc.blink(2, 6);
        this.node.runAction(blink);

        this.is_invincible = true;
        this.unscheduleAllCallbacks();
        this.scheduleOnce(function () {
            this.is_invincible = false;
        }, 2);
        this._alive = true;
        let tiledMap = this.map.getComponent(cc.TiledMap);
        let bomb_layer = tiledMap.getLayer("bomb layer");
        let bomb_tiled = bomb_layer.getTiledTileAt(1, 10, false);
        if (bomb_tiled.getComponent(cc.Sprite).spriteFrame != null) {
            bomb_tiled.node.attr({
                left: false,
            })
        }
        this.node.x = this.rebornX;
        this.node.y = this.rebornY;
        this._direction = "static";
        let head = this.node.getChildByName('head');
        let face = this.node.getChildByName('face');
        head.setPosition(0, head.position.y);
        head.getComponent(cc.Sprite).spriteFrame = this.headSprites[2];
        face.getComponent(cc.Sprite).spriteFrame = this.faceSprites[0];
        face.active = true;
        face.setPosition(0, face.position.y);
        this.node.getChildByName('body').getComponent(cc.Sprite).spriteFrame = this.walkDownSprites[Math.floor(this.frameCount / 10)];

    }

    onBeginContact(contact, self, other) {
        if (other.node.name == "player2") {
            contact.disabled = true;
        }
    }
}
