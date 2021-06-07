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
    BUY_ALREADY : string = "已擁有"
    @property(cc.Node)
    BombPage: cc.Node = null;

    @property(cc.Node)
    SkinPage: cc.Node = null;

    @property(cc.Node)
    LoadPage: cc.Node = null;

    CoinNum: number = 0;

    bombPrize: number[] = [0,150,120,100,140];
    bombOwn: boolean[] = [false,false,false,false,false];
    bombNum: number = 4//num of bombskin in store
    userBombSkinPath: string = "";
    testEmail: string  = "a@g.com";
    testPassword: string = "12345678";

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //play loading page
        let count = 0;
        let Lab1 = cc.find("loading/load1").getComponent(cc.Label);
        let Lab2 = cc.find("loading/load2").getComponent(cc.Label);
        let Lab3 = cc.find("loading/load3").getComponent(cc.Label);
        let Lab4 = cc.find("loading/load4").getComponent(cc.Label);
        var playLoad = setInterval(function(){
            if(count == 0){
                Lab1.node.active = true;
                Lab2.node.active = false;
                Lab3.node.active = false;
                Lab4.node.active = false;
                count = (count+1)%4;
            } else if(count == 1){
                Lab1.node.active = false;
                Lab2.node.active = true;
                Lab3.node.active = false;
                Lab4.node.active = false;
                count = (count+1)%4;
            } else if(count == 2){
                Lab1.node.active = false;
                Lab2.node.active = false;
                Lab3.node.active = true;
                Lab4.node.active = false;
                count = (count+1)%4;
            } else if(count == 3){
                Lab1.node.active = false;
                Lab2.node.active = false;
                Lab3.node.active = false;
                Lab4.node.active = true;
                count = (count+1)%4;
            }
            cc.log("in interval");
        }, 300);


        this.CoinNum = 200;
        let myStore = this;
        cc.log("on load");
        firebase.auth().signInWithEmailAndPassword(this.testEmail, this.testPassword).then(function(){
            cc.log("login success");
            firebase.auth().onAuthStateChanged(function(user){
                if(user){
                    cc.log("email:",user.email);
                    cc.log("uid:",user.uid);
                    myStore.userBombSkinPath = "players/playerInfo-" + user.uid + "/bombSkin";
                    cc.log("path:",myStore.userBombSkinPath);
                    var roomsRef = firebase.database().ref(myStore.userBombSkinPath);
                    roomsRef.once("value").then(function(snapshot){
                        var data = snapshot.val();
                        for(let i in data){
                            console.log("normal ",i," = ",data[i].normal);
                            myStore.bombOwn[data[i].normal] = true;
                            myStore.setHaveBomb(myStore.BUY_ALREADY,data[i].normal);
                        }
                        for(let i in myStore.bombOwn)
                            cc.log(myStore.bombOwn[i]);
                    }).then(function(){
                        console.log("loading finish");
                        myStore.LoadPage.active = false;
                        clearInterval(playLoad);
                    })
                }
            })
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });

        for(let i=1;i<=this.bombNum;i++){
            console.log("push:",i);
            let button_Act3 = new cc.Component.EventHandler();
            button_Act3.target = this.node;
            button_Act3.component = "store_manager";
            button_Act3.handler = "Buy";
            button_Act3.customEventData = i.toString();
            let findPath = "StoreMgr/BombPage/bomb" + i.toString();
            cc.find(findPath).getComponent(cc.Button).clickEvents.push(button_Act3);
        }
    }

    start () {
        //console.log("start");
        //this.LoadPage.active = false;
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
        /*let myStore = this;
        firebase.auth().onAuthStateChanged(function(user){
            if(user){
                cc.log("email:",user.email);
                cc.log("uid:",user.uid);
                this.userBombSkinPath = "players/playerInfo-" + user.uid + "/bombSkin";
                cc.log("path:",this.userBombSkinPath);
                var roomsRef = firebase.database().ref(this.userBombSkinPath);
                roomsRef.once("value").then(function(snapshot){
                    var data = snapshot.val();
                    for(let i in data){
                        console.log("normal ",i," = ",data[i].normal);
                        myStore.bombOwn[data[i].normal] = true;
                    }
                    for(let i in myStore.bombOwn)
                        cc.log(myStore.bombOwn[i]);
                })
                /*roomsRef.push({
                    "normal": 3,
                }).then(function(){
                    console.log("set success");
                });
            }
        })*/

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
        let idx = parseInt(customEventData);
        if(this.bombOwn[idx]) {
            //this.create_alert_bomb(this.BUY_ALREADY,customEventData);
            return;
        }
        if(this.CoinNum < this.bombPrize[idx]) {
            this.create_alert_bomb(this.NOT_ENOUGH_MONEY,customEventData);
            return;
        } 

        let myStore = this;
        firebase.auth().onAuthStateChanged(function(user){
            if(user){
                cc.log("email:",user.email);
                cc.log("uid:",user.uid);
                myStore.userBombSkinPath = "players/playerInfo-" + user.uid + "/bombSkin";
                cc.log("path:",myStore.userBombSkinPath);
                var roomsRef = firebase.database().ref(myStore.userBombSkinPath);
                roomsRef.push({
                    "normal": idx,
                }).then(function(){
                    myStore.CoinNum -= myStore.bombPrize[idx];
                    myStore.bombOwn[idx] = true;
                    myStore.setHaveBomb(myStore.BUY_ALREADY,idx);
                    console.log("buy success");
                });
            }
        })
    }

    update (dt) {
        let CoinStr = this.CoinNum.toString();
        cc.find("StoreMgr/CoinText").getComponent(cc.Label).string = CoinStr;
    }

    create_alert_bomb(alertStr,buttonStr){
        
        console.log("here");
        let findPath = "StoreMgr/BombPage/bomb" + buttonStr + "/Background/Label";
        let findButton = "StoreMgr/BombPage/bomb" + buttonStr;
        let nowButton = cc.find(findButton).getComponent(cc.Button);
        nowButton.interactable = false;
        let nowLabel = cc.find(findPath).getComponent(cc.Label);
        nowLabel.string = alertStr;
        nowLabel.fontSize = 40;
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

    setHaveBomb(alertStr,buttonStr){
        let findPath = "StoreMgr/BombPage/bomb" + buttonStr + "/Background/Label";
        let findButton = "StoreMgr/BombPage/bomb" + buttonStr;
        let nowButton = cc.find(findButton).getComponent(cc.Button);
        nowButton.interactable = false;
        let nowLabel = cc.find(findPath).getComponent(cc.Label);
        nowLabel.string = alertStr;
        nowLabel.fontSize = 40;
        nowLabel.node.opacity = 255;
        nowLabel.node.color = new cc.Color(255, 0, 0);
    }
}
