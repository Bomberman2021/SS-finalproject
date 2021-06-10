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

    @property(cc.Node)
    skinPage: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    public currentPage = 'left';

    goToLeftPage() {
        if (this.currentPage == 'left') {
            return;
        } else {
            let left = cc.moveBy(0.5, cc.v2(1280, 0));
            this.currentPage = 'left';
            this.skinPage.runAction(left);
        }


    }

    goToRightPage() {
        if (this.currentPage == 'right') {
            return;
        } else {
            let right = cc.moveBy(0.5, cc.v2(-1280, 0));
            this.currentPage = 'right';
            this.skinPage.runAction(right);
        }
    }

    start() {

    }

    // update (dt) {}
}
