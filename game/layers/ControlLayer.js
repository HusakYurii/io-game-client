import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";
import { Vector2D } from "../../libs/Shared.js";
import { Joystick } from "../../libs/Joystick.js";

export class ControlLayer extends AbstractLayer {
    constructor(config) {
        super(config);

        this.activateBtn = null;
        this.currViewportSizes = {};
    }

    cleanupLayer() {
        this.joystick = null;
        this.activateBtn = null;
        this.isJoystickCaptured = false;
        this.pointerIds = [];
    }

    resizeLayer(sizes) {
        this.currViewportSizes = sizes;
        if (this.joystick && this.activateBtn) {
            this.updateControlsPos();
        }
    }

    turnOnControls(onDirChanged, onAtivated) {

        this.joystick = this.addChild(new Joystick(this.config.joystick));
        this.joystick.setOnChange(onDirChanged);
        this.joystick.activate();

        this.activateBtn = this.addChild(...Builder.fromConfig(this.config.activateButton));
        this.activateBtn.on("pointerdown", onAtivated);
        this.activateBtn.interactive = true;

        this.updateControlsPos();
    }

    turnOffControls() {
        this.joystick.destroy();
        this.joystick = null;

        this.activateBtn.removeAllListeners();
        this.activateBtn = null;

        this.removeChildren();
    }

    updateControlsPos() {
        const { width, height, scl } = this.currViewportSizes;

        this.joystick.position.set(-(width / scl - 300) / 2, (height / scl - 300) / 2);
        this.activateBtn.position.set((width / scl - 300) / 2, (height / scl - 300) / 2);
    }
}