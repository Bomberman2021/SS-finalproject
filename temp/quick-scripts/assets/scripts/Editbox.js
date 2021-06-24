(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Editbox.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fb2bcepEUZEWKxXZezrfh93', 'Editbox', __filename);
// scripts/Editbox.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Editbox = /** @class */ (function (_super) {
    __extends(Editbox, _super);
    function Editbox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.editbox = null;
        _this.inputText = '';
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {
    // }
    Editbox.prototype.start = function () {
        var editboxEventHandler = new cc.Component.EventHandler();
        editboxEventHandler.component = "Editbox";
        editboxEventHandler.target = this.node;
        editboxEventHandler.handler = "onTextChanged";
        this.editbox.textChanged.push(editboxEventHandler);
    };
    Editbox.prototype.onTextChanged = function (text, editbox, customEventData) {
        // console.log('text:', text);
        this.inputText = text;
    };
    __decorate([
        property(cc.Label)
    ], Editbox.prototype, "label", void 0);
    __decorate([
        property(cc.EditBox)
    ], Editbox.prototype, "editbox", void 0);
    Editbox = __decorate([
        ccclass
    ], Editbox);
    return Editbox;
}(cc.Component));
exports.Editbox = Editbox;

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
        //# sourceMappingURL=Editbox.js.map
        