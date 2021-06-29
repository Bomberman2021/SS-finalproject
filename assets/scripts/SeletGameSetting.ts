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

    if (this.parentslabel.string === 'Map') {
      console.log('新的maprecord:', record.settingMap);
      this.label.string = record.settingMap;
    }

    if (this.parentslabel.string === 'Maps') {
      if (record.settingMap === this.label.string) {
        this.button.normalSprite = this.selectBg;
      }
    }

        
    if (record.gameMode === 'escapeMode' && cc.find(`Canvas/Setting/Life/ThreeLifes`)) {
      cc.find(`Canvas/Setting/Life/ThreeLifes`).active = false;
      cc.find(`Canvas/Setting/Life/FiveLifes`).active = false;
      cc.find(`Canvas/Setting/Time/ThreeMinutes/Background/Label`).getComponent(cc.Label).string = '無限';
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
    if (this.parentslabel.string === 'Maps') {
      clickEventHandler.handler = "setMap";
    }
    if (this.parentslabel.string === 'Map') {
      clickEventHandler.handler = "selectMap";
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
    this.changeSelectedColor();
  }

  setTime(event, customEventData) {
    record.settingTime = customEventData;
    console.log(record.settingLife, record.settingTime);
    this.changeSelectedColor();
  }

  setMap(event, customEventData) {
    console.log('map customEventData:', customEventData);
    record.settingMap = customEventData;
    console.log('setMap:', record.settingMap);
    this.changeSelectedColor();
  }

  selectMap() {
    cc.director.loadScene("maps");
  }

  changeSelectedColor() {
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
    if (this.parentslabel.string === 'Maps') {
      cc.find(`Canvas/Maps/map1`).getComponent(cc.Button).normalSprite = this.normalBg;
      cc.find(`Canvas/Maps/map2`).getComponent(cc.Button).normalSprite = this.normalBg;
      cc.find(`Canvas/Maps/map3`).getComponent(cc.Button).normalSprite = this.normalBg;
      if (record.settingMap === this.label.string) {
        this.button.normalSprite = this.selectBg;
      }
    }
  }

  // update (dt) {}
}
