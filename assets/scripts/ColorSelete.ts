import { CharacterMgr } from "./CharacterMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ColorSelete extends cc.Component {

  @property(cc.Button)
  button: cc.Button = null;

  @property(cc.Label)
  label: cc.Label = null;

  @property(CharacterMgr)
  characterMgr: CharacterMgr = null;

  // onLoad () {}

  start () {
    let clickEventHandler = new cc.Component.EventHandler();
    clickEventHandler.target = this.node;
    clickEventHandler.component = "ColorSelete";
    clickEventHandler.handler = "colorSelete";
    if (this.label) { 
      clickEventHandler.customEventData = this.label.string;
      
      let button = this.node.getComponent(cc.Button);
      button.clickEvents.push(clickEventHandler);
    }
  }
  
  colorSelete(event, customEventData) {
    this.characterMgr.currentSkinColor = customEventData;
    this.characterMgr.skinColor.forEach(color => {
      cc.find(`Canvas/Character/${this.characterMgr.skinCategory[this.characterMgr.selectSkinIndex]}`).getChildByName(color).active = false;
      if (color === customEventData) {
        cc.find(`Canvas/Character/${this.characterMgr.skinCategory[this.characterMgr.selectSkinIndex]}`).getChildByName(this.characterMgr.currentSkinColor).active = true;
        console.log('currentSkinColor:', this.characterMgr.currentSkinColor);
      }
    });
    this.characterMgr.result();
  }
  // update (dt) {}
}
