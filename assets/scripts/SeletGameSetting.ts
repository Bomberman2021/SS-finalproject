const { ccclass, property } = cc._decorator;
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

  @property({ type: cc.AudioClip })
  buttonClickSound: cc.AudioClip = null;


  @property(cc.SpriteFrame)
  map1: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  map2: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  map3: cc.SpriteFrame = null;

  // LIFE-CYCLE CALLBACKS:

  private gMode: string = '';

  onLoad() {
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
      console.log('新的mapRecord:', record.settingMap);
      this.label.string = record.settingMap;

    }

    if (this.parentslabel.string === 'Maps') {
      if (record.settingMap === this.label.string) {
        this.button.normalSprite = this.selectBg;
      }
      this.gMode = record.gameMode;
      let myIMG = this.node.getChildByName('Background').getComponent(cc.Sprite);
      if (this.gMode === 'basicMode') {
        myIMG.spriteFrame = this.map1;
      }
      if (this.gMode === 'escapeMode') {
        myIMG.spriteFrame = this.map2;
      }
      if (this.gMode === 'chaseMode') {
        myIMG.spriteFrame = this.map3;
      }
      this.node.getChildByName('indicator').active = false;
      if (record.settingMap === this.label.string) {
        this.node.getChildByName('indicator').active = true;
      }
    }


    if (record.gameMode === 'escapeMode' && cc.find(`Canvas/Setting/Life/ThreeLifes`)) {
      cc.find(`Canvas/Setting/Life/ThreeLifes`).active = false;
      cc.find(`Canvas/Setting/Life/FiveLifes`).active = false;
      cc.find(`Canvas/Setting/Time/ThreeMinutes/Background/Label`).getComponent(cc.Label).string = '無限';
    }
    if (record.gameMode === 'chaseMode' && cc.find(`Canvas/Setting/Life/ThreeLifes`)) {
      cc.find(`Canvas/Setting/Life/ThreeLifes`).active = false;
      cc.find(`Canvas/Setting/Life/FiveLifes`).active = false;
      cc.find(`Canvas/Setting/Time/TwoMinutes`).active = false;
      cc.find(`Canvas/Setting/Time/ThreeMinutes`).active = false;
    }

  }

  start() {
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
    cc.audioEngine.playEffect(this.buttonClickSound, false);
    record.settingLife = customEventData;
    console.log(record.settingLife, record.settingTime);
    this.changeSelectedColor();
  }

  setTime(event, customEventData) {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
    record.settingTime = customEventData;
    console.log(record.settingLife, record.settingTime);
    this.changeSelectedColor();
  }

  setMap(event, customEventData) {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
    console.log('map customEventData:', customEventData);
    record.settingMap = customEventData;
    console.log('setMap:', record.settingMap);
    this.changeSelectedColor();
  }

  selectMap() {
    cc.audioEngine.playEffect(this.buttonClickSound, false);
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

      cc.find(`Canvas/Maps/map1`).getChildByName('indicator').active = false;
      cc.find(`Canvas/Maps/map2`).getChildByName('indicator').active = false;
      cc.find(`Canvas/Maps/map3`).getChildByName('indicator').active = false;
      if (record.settingMap === this.label.string) {
        this.node.getChildByName('indicator').active = true;
      }
    }
  }

  // update (dt) {}
}
