import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";

export class UILayer extends AbstractLayer {
    constructor(config) {
        super(config);
        this.inputs = {};
        this.confirmBtn = null;
        this.onUserInput = this.onUserInput.bind(this);
    }

    createLoginPopup(callback) {
        const popup = Builder.fromConfig(this.config.loginPopupTree);
        this.addChild(...popup);

        this.inputs.nameInput = this.getChildByName("nameInput");
        this.inputs.roomIdInput = this.getChildByName("roomIdInput");
        this.inputs.nameInput.on("input", this.onUserInput);

        this.confirmBtn = this.getChildByName("button");
        this.confirmBtn.once("pointerdown", this.unUserConfirm.bind(this, callback));
    }

    removeLoginPopup() {
        this.inputs.nameInput.off("input", this.onUserInput);
        this.inputs.nameInput.destroy();
        this.inputs.roomIdInput.destroy();
        this.inputs = {};
        this.confirmBtn = null;
        this.removeChildren();
    }

    onUserInput(value) {
        const [alpha, enable] = (value.length >= 3) ? [1, true] : [0.7, false];
        this.confirmBtn.alpha = alpha;
        this.confirmBtn.interactive = enable;
    }

    disableInputs() {
        this.confirmBtn.interactive = false;
        this.inputs.nameInput.disabled = true;
        this.inputs.roomIdInput.disabled = true;
    }

    unUserConfirm(callback, event) {
        event.stopPropagation();
        this.disableInputs();
        const { nameInput, roomIdInput } = this.inputs;

        callback({
            name: nameInput.htmlInput.value,
            roomId: roomIdInput.htmlInput.value
        });
    }
}