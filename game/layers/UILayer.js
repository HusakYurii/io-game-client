import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";

export class UILayer extends AbstractLayer {
    constructor(config) {
        super(config);
        this.inputs = {};
        this.confirmBtn = null;
        this.onPlayerInput = this.onPlayerInput.bind(this);
    }

    createLoginPopup(callback) {
        const popup = Builder.fromConfig(this.config.loginPopupTree);
        this.addChild(...popup);

        this.inputs.nameInput = this.getChildByName("nameInput");
        this.inputs.nameInput.on("input", this.onPlayerInput);

        this.confirmBtn = this.getChildByName("button");
        this.confirmBtn.once("pointerdown", (event) => {
            this.disableInputs();
    
            callback({
                name: this.inputs.nameInput.htmlInput.value,
                roomId: ""
            });
        });
    }

    removeLoginPopup() {
        this.inputs.nameInput.off("input", this.onPlayerInput);
        this.inputs.nameInput.destroy();
        this.inputs = {};
        this.confirmBtn = null;
        this.removeChildren();
    }

    onPlayerInput(value) {
        const [alpha, enable] = (value.length >= 3) ? [1, true] : [0.7, false];
        this.confirmBtn.alpha = alpha;
        this.confirmBtn.interactive = enable;
    }

    disableInputs() {
        this.confirmBtn.interactive = false;
        this.inputs.nameInput.disabled = true;
    }

    createConnectionLostPopup(callback) {
        const popup = this.addChild(...Builder.fromConfig(this.config.connectionLostPopupTree));
        const reconnectButton = popup.getChildByName("reconnectButton");
        reconnectButton.interactive = true;
        reconnectButton.once("pointerdown", callback);
    }

    createGameOverPopup(callback) {
        const popup = this.addChild(...Builder.fromConfig(this.config.gameOverPopupTree));
        const restartButton = popup.getChildByName("restartButton");
        restartButton.interactive = true;
        restartButton.once("pointerdown", callback);
    }

    cleanupLayer() {
        this.removeChildren();
    }
}