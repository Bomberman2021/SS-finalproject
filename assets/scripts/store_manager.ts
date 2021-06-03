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
export default class store_manager extends cc.Component {

    NOT_ENOUGH_MONEY : string = "餘額不足"

    @property(cc.Node)
    BombPage: cc.Node = null;

    @property(cc.Node)
    SkinPage: cc.Node = null;

    CoinNum: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.CoinNum = 200;
    }

    start () {
        let button_Act1 = new cc.Component.EventHandler();
        button_Act1.target = this.node;
        button_Act1.component = "store_manager";
        button_Act1.handler = "Bomb";
        cc.find("StoreMgr/BombButton").getComponent(cc.Button).clickEvents.push(button_Act1);

        let button_Act2 = new cc.Component.EventHandler();
        button_Act2.target = this.node;
        button_Act2.component = "store_manager";
        button_Act2.handler = "Skin";
        cc.find("StoreMgr/SkinButton").getComponent(cc.Button).clickEvents.push(button_Act2);

        let button_Act3 = new cc.Component.EventHandler();
        button_Act3.target = this.node;
        button_Act3.component = "store_manager";
        button_Act3.handler = "Buy";
        button_Act3.customEventData = "bomb1";
        cc.find("StoreMgr/BombPage/bomb1").getComponent(cc.Button).clickEvents.push(button_Act3);
    }

    Bomb(){
        cc.log("bomb!");
        this.BombPage.active = true;
        this.SkinPage.active = false;
    }

    Skin(){
        cc.log("Skin!");
        this.SkinPage.active = true;
        this.BombPage.active = false;
    }

    Buy(event, customEventData){
        cc.log(customEventData);
        if(customEventData == "bomb1"){
            if(this.CoinNum < 150) {
                this.create_alert_bomb(this.NOT_ENOUGH_MONEY,customEventData);
                //cc.log("no money!");
                return;
            } 
            this.CoinNum -= 150;
        } 
    }

    update (dt) {
        let CoinStr = this.CoinNum.toString();
        cc.find("StoreMgr/CoinText").getComponent(cc.Label).string = CoinStr;
    }

    create_alert_bomb(alertStr,buttonStr){
        
        console.log("here");
        let findPath = "StoreMgr/BombPage/" + buttonStr + "/Background/Label";
        let findButton = "StoreMgr/BombPage/" + buttonStr;
        let nowButton = cc.find(findButton).getComponent(cc.Button);
        nowButton.interactable = false;
        let nowLabel = cc.find(findPath).getComponent(cc.Label);
        nowLabel.string = alertStr;
        nowLabel.fontSize = 45;
        nowLabel.node.opacity = 255;
        nowLabel.node.color = new cc.Color(255, 0, 0);
        let fadeout = cc.fadeTo(1.0,0);
        let finished = cc.callFunc(function(target) {
            console.log("hahaha");
            nowButton.interactable = true;;
        }, nowButton);
        
        let act = cc.sequence(fadeout,finished);
        //cc.find(findPath).getComponent(cc.Label).col

        this.scheduleOnce(function() { 
            nowLabel.node.runAction(act); 
            cc.log("success");
        }, 1);

        
    }
}
