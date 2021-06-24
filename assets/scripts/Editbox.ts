const {ccclass, property} = cc._decorator;

@ccclass
export class Editbox extends cc.Component {

  @property(cc.Label)
  label: cc.Label = null;

  @property(cc.EditBox)
  editbox: cc.EditBox = null;

  public inputText: string = '';

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {
  // }

  start () {
    let editboxEventHandler = new cc.Component.EventHandler();
    editboxEventHandler.component = "Editbox";
    editboxEventHandler.target = this.node;
    editboxEventHandler.handler = "onTextChanged";

    this.editbox.textChanged.push(editboxEventHandler);
  }

  onTextChanged(text, editbox, customEventData) {
    // console.log('text:', text);
    this.inputText = text;
  }

  // update (dt) {}
}
