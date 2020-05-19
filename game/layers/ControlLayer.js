import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";

const Vector2D = require("../../../physics/Vector2D.js");

export class ControlLayer extends AbstractLayer {
    constructor(config) {
        super(config);

        this.joystick = null;
        this.activateBtn = null;
        this.currViewportSizes = {};

        this.isJoystickCaptured = false;
        this.pointerIds = [];

        this.onDirChangedCb = () => { };
        this.onAtivatedCb = () => { };
    }

    cleanupLayer() {
        this.joystick = null;
        this.activateBtn = null;
        this.isJoystickCaptured = false;
        this.pointerIds = [];
    }

    resize(sizes) {
        this.currViewportSizes = sizes;
        if (this.joystick && this.activateBtn) {
            this.updateControlsPos();
        }
    }

    setControls(onDirChanged, onAtivated) {
        this.joystick = this.addChild(...Builder.fromConfig(this.config.joystick));
        this.joystick.interactive = true;

        this.activateBtn = this.addChild(...Builder.fromConfig(this.config.activateButton));
        this.activateBtn.interactive = true;

        this.updateControlsPos();

        this.onDirChangedCb = onDirChanged;
        this.onAtivatedCb = onAtivated;

        this.joystick.on("pointerdown", this.onPointerdown, this);
        this.joystick.on("pointermove", this.onPointermove, this);
        this.joystick.on("pointerup", this.onPointerup, this);
        this.joystick.on("pointerupoutside", this.onPointerup, this);

        this.activateBtn.on("pointerdown", this.onButtonClick, this);
    }

    removeControls() {
        this.joystick.removeAllListeners();
        this.joystick = null;

        this.activateBtn.removeAllListeners();
        this.activateBtn = null;

        this.removeChildren();

        this.onDirChangedCb = () => { };
        this.onAtivatedCb = () => { };
    }

    onButtonClick(event) {
        this.onAtivatedCb();
    }

    onPointerdown({ data }) {
        if (this.isJoystickCaptured) {
            return;
        }

        this.isJoystickCaptured = true;
        this.pointerIds.push(data.pointerId);

        this.updatePointerPos(data);
    }

    onPointermove({ data }) {
        if (!this.isJoystickCaptured || !this.pointerIds.includes(data.pointerId)) {
            return;
        }

        this.updatePointerPos(data);
    }

    onPointerup({ data }) {
        if (!this.pointerIds.includes(data.pointerId)) {
            return;
        }

        this.isJoystickCaptured = false;
        this.pointerIds = [];

        this.resetPointerPos();
    }

    updatePointerPos(data) {
        const pointer = this.joystick.getChildByName("pointer");
        const vector = data.getLocalPosition(this.joystick, new Vector2D());

        vector.setLimit(80);
        pointer.position.set(vector.x, vector.y);

        this.onDirChangedCb(vector);
    }

    resetPointerPos() {
        const pointer = this.joystick.getChildByName("pointer");
        pointer.position.set(0, 0);

        this.onDirChangedCb({ x: 0, y: 0 });
    }

    updateControlsPos() {
        const { width, height, scl } = this.currViewportSizes;

        this.joystick.position.set(-(width / scl - 300) / 2, (height / scl - 300) / 2);
        this.activateBtn.position.set((width / scl - 300) / 2, (height / scl - 300) / 2);
    }
}