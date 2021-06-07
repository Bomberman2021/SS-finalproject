(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/store_manager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8f031XhN55A7KxbwCnk7S1E', 'store_manager', __filename);
// scripts/store_manager.ts

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var store_manager = /** @class */ (function (_super) {
    __extends(store_manager, _super);
    function store_manager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.NOT_ENOUGH_MONEY = "餘額不足";
        _this.BUY_ALREADY = "已擁有";
        _this.BombPage = null;
        _this.SkinPage = null;
        _this.LoadPage = null;
        _this.CoinNum = 0;
        _this.bombPrize = [0, 150, 120, 100, 140];
        _this.bombOwn = [false, false, false, false, false];
        _this.bombNum = 4; //num of bombskin in store
        _this.userBombSkinPath = "";
        _this.testEmail = "a@g.com";
        _this.testPassword = "12345678";
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    store_manager.prototype.onLoad = function () {
        this.CoinNum = 200;
        var myStore = this;
        cc.log("on load");
        firebase.auth().signInWithEmailAndPassword(this.testEmail, this.testPassword).then(function () {
            cc.log("login success");
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    cc.log("email:", user.email);
                    cc.log("uid:", user.uid);
                    myStore.userBombSkinPath = "players/playerInfo-" + user.uid + "/bombSkin";
                    cc.log("path:", myStore.userBombSkinPath);
                    var roomsRef = firebase.database().ref(myStore.userBombSkinPath);
                    roomsRef.once("value").then(function (snapshot) {
                        var data = snapshot.val();
                        for (var i in data) {
                            console.log("normal ", i, " = ", data[i].normal);
                            myStore.bombOwn[data[i].normal] = true;
                            myStore.setHaveBomb(myStore.BUY_ALREADY, data[i].normal);
                        }
                        for (var i in myStore.bombOwn)
                            cc.log(myStore.bombOwn[i]);
                    });
                }
            });
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });
        for (var i = 1; i <= this.bombNum; i++) {
            console.log("push:", i);
            var button_Act3 = new cc.Component.EventHandler();
            button_Act3.target = this.node;
            button_Act3.component = "store_manager";
            button_Act3.handler = "Buy";
            button_Act3.customEventData = i.toString();
            var findPath = "StoreMgr/BombPage/bomb" + i.toString();
            cc.find(findPath).getComponent(cc.Button).clickEvents.push(button_Act3);
        }
    };
    store_manager.prototype.start = function () {
        console.log("start");
        this.LoadPage.active = false;
        var button_Act1 = new cc.Component.EventHandler();
        button_Act1.target = this.node;
        button_Act1.component = "store_manager";
        button_Act1.handler = "Bomb";
        cc.find("StoreMgr/BombButton").getComponent(cc.Button).clickEvents.push(button_Act1);
        var button_Act2 = new cc.Component.EventHandler();
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
    };
    store_manager.prototype.Bomb = function () {
        cc.log("bomb!");
        this.BombPage.active = true;
        this.SkinPage.active = false;
    };
    store_manager.prototype.Skin = function () {
        cc.log("Skin!");
        this.SkinPage.active = true;
        this.BombPage.active = false;
    };
    store_manager.prototype.Buy = function (event, customEventData) {
        cc.log(customEventData);
        var idx = parseInt(customEventData);
        if (this.bombOwn[idx]) {
            //this.create_alert_bomb(this.BUY_ALREADY,customEventData);
            return;
        }
        if (this.CoinNum < this.bombPrize[idx]) {
            this.create_alert_bomb(this.NOT_ENOUGH_MONEY, customEventData);
            return;
        }
        var myStore = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                cc.log("email:", user.email);
                cc.log("uid:", user.uid);
                myStore.userBombSkinPath = "players/playerInfo-" + user.uid + "/bombSkin";
                cc.log("path:", myStore.userBombSkinPath);
                var roomsRef = firebase.database().ref(myStore.userBombSkinPath);
                roomsRef.push({
                    "normal": idx,
                }).then(function () {
                    myStore.CoinNum -= myStore.bombPrize[idx];
                    myStore.bombOwn[idx] = true;
                    myStore.setHaveBomb(myStore.BUY_ALREADY, idx);
                    console.log("buy success");
                });
            }
        });
    };
    store_manager.prototype.update = function (dt) {
        var CoinStr = this.CoinNum.toString();
        cc.find("StoreMgr/CoinText").getComponent(cc.Label).string = CoinStr;
    };
    store_manager.prototype.create_alert_bomb = function (alertStr, buttonStr) {
        console.log("here");
        var findPath = "StoreMgr/BombPage/bomb" + buttonStr + "/Background/Label";
        var findButton = "StoreMgr/BombPage/bomb" + buttonStr;
        var nowButton = cc.find(findButton).getComponent(cc.Button);
        nowButton.interactable = false;
        var nowLabel = cc.find(findPath).getComponent(cc.Label);
        nowLabel.string = alertStr;
        nowLabel.fontSize = 40;
        nowLabel.node.opacity = 255;
        nowLabel.node.color = new cc.Color(255, 0, 0);
        var fadeout = cc.fadeTo(1.0, 0);
        var finished = cc.callFunc(function (target) {
            console.log("hahaha");
            nowButton.interactable = true;
            ;
        }, nowButton);
        var act = cc.sequence(fadeout, finished);
        //cc.find(findPath).getComponent(cc.Label).col
        this.scheduleOnce(function () {
            nowLabel.node.runAction(act);
            cc.log("success");
        }, 1);
    };
    store_manager.prototype.setHaveBomb = function (alertStr, buttonStr) {
        var findPath = "StoreMgr/BombPage/bomb" + buttonStr + "/Background/Label";
        var findButton = "StoreMgr/BombPage/bomb" + buttonStr;
        var nowButton = cc.find(findButton).getComponent(cc.Button);
        nowButton.interactable = false;
        var nowLabel = cc.find(findPath).getComponent(cc.Label);
        nowLabel.string = alertStr;
        nowLabel.fontSize = 40;
        nowLabel.node.opacity = 255;
        nowLabel.node.color = new cc.Color(255, 0, 0);
    };
    __decorate([
        property(cc.Node)
    ], store_manager.prototype, "BombPage", void 0);
    __decorate([
        property(cc.Node)
    ], store_manager.prototype, "SkinPage", void 0);
    __decorate([
        property(cc.Node)
    ], store_manager.prototype, "LoadPage", void 0);
    store_manager = __decorate([
        ccclass
    ], store_manager);
    return store_manager;
}(cc.Component));
exports.default = store_manager;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=store_manager.js.map
        