const {ccclass, property} = cc._decorator;
let record = null;

@ccclass
export class SeletGameSetting extends cc.Component {
  
  @property(cc.Label)
  parentslabel: cc.Label = null;

  @property(cc.Button)
  button: cc.Button = null;

  @property(cc.Label)
  label: cc.Label = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    record = cc.find("record").getComponent("record");
  }

  start () {
    let clickEventHandler = new cc.Component.EventHandler();
    clickEventHandler.target = this.node;
    clickEventHandler.component = "SeletGameSetting";
    if (this.parentslabel.string === 'Life') {
      clickEventHandler.handler = "setLife";
    }
    if (this.parentslabel.string === 'Time') {
      clickEventHandler.handler = "setTime";
    }
    if (this.label) { 
      clickEventHandler.customEventData = this.label.string;
    }

    let button = this.node.getComponent(cc.Button);
    button.clickEvents.push(clickEventHandler);
  }

  setLife(event, customEventData) {
    record.settingLife = customEventData;
    console.log(record.settingLife, record.settingTime);
  }

  setTime(event, customEventData) {
    record.settingTime = customEventData;
    console.log(record.settingLife, record.settingTime);
  }

  // update (dt) {}
}
