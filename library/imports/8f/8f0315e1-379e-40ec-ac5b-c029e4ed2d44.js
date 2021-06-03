"use strict";
cc._RF.push(module, '8f031XhN55A7KxbwCnk7S1E', 'store_manager');
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
        _this.CoinNum = 0;
        _this.bombPrize = [0, 150, 120, 100, 140];
        _this.bombOwn = [false, false, false, false, false];
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    store_manager.prototype.onLoad = function () {
        this.CoinNum = 200;
        //let button_Act3 = new cc.Component.EventHandler();
        //button_Act3.target = this.node;
        //button_Act3.component = "store_manager";
        //button_Act3.handler = "Buy";
        for (var i = 1; i <= 4; i++) {
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
        /*let button_Act3 = new cc.Component.EventHandler();
        button_Act3.target = this.node;
        button_Act3.component = "store_manager";
        button_Act3.handler = "Buy";
        button_Act3.customEventData = "1";
        cc.find("StoreMgr/BombPage/bomb1").getComponent(cc.Button).clickEvents.push(button_Act3);*/
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
            this.create_alert_bomb(this.BUY_ALREADY, customEventData);
            return;
        }
        if (this.CoinNum < this.bombPrize[idx]) {
            this.create_alert_bomb(this.NOT_ENOUGH_MONEY, customEventData);
            return;
        }
        this.CoinNum -= this.bombPrize[idx];
        this.bombOwn[idx] = true;
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
    __decorate([
        property(cc.Node)
    ], store_manager.prototype, "BombPage", void 0);
    __decorate([
        property(cc.Node)
    ], store_manager.prototype, "SkinPage", void 0);
    store_manager = __decorate([
        ccclass
    ], store_manager);
    return store_manager;
}(cc.Component));
exports.default = store_manager;

cc._RF.pop();