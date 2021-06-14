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

  @property(cc.SpriteFrame)
  selectBg: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  normalBg: cc.SpriteFrame = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    record = cc.find("record").getComponent("record");

    console.log('record.settingLife:', record.settingLife);
    console.log('record.settingTime:', record.settingTime);
    console.log('this.label.string:', this.label.string);
    
    
    if (this.parentslabel.string === 'Life') {
      if (record.settingLife === this.label.string) {
        this.button.normalSprite = this.selectBg;
      }
    }

    if (this.parentslabel.string === 'Time(s)') {
      if (record.settingTime === this.label.string) {
        this.button.normalSprite = this.selectBg;
      }
    }

  }

  start () {
    let clickEventHandler = new cc.Component.EventHandler();
    clickEventHandler.target = this.node;
    clickEventHandler.component = "SeletGameSetting";
    if (this.parentslabel.string === 'Life') {
      clickEventHandler.handler = "setLife";
      
    }
    if (this.parentslabel.string === 'Time(s)') {
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
    this.selectedColor();
  }

  setTime(event, customEventData) {
    record.settingTime = customEventData;
    console.log(record.settingLife, record.settingTime);
    this.selectedColor();
  }

  selectedColor() {
    if (this.parentslabel.string === 'Life') {
      cc.find(`Canvas/Setting/Life/OneLife`).getComponent(cc.Button).normalSprite = this.normalBg;
      cc.find(`Canvas/Setting/Life/ThreeLifes`).getComponent(cc.Button).normalSprite = this.normalBg;
      cc.find(`Canvas/Setting/Life/FiveLifes`).getComponent(cc.Button).normalSprite = this.normalBg;
      if (record.settingLife === this.label.string) {
        this.button.normalSprite = this.selectBg;
      }
    }
    if (this.parentslabel.string === 'Time(s)') {
      cc.find(`Canvas/Setting/Time/OneMinute`).getComponent(cc.Button).normalSprite = this.normalBg;
      cc.find(`Canvas/Setting/Time/TwoMinutes`).getComponent(cc.Button).normalSprite = this.normalBg;
      cc.find(`Canvas/Setting/Time/ThreeMinutes`).getComponent(cc.Button).normalSprite = this.normalBg;
      if (record.settingTime === this.label.string) {
        this.button.normalSprite = this.selectBg;
      }
    }
  }

  // update (dt) {}
}
