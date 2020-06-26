import { Builder } from "./Builder.js";
import { Vector2D } from "./Shared.js";

export class Joystick extends Builder.Container {
    constructor(config) {
        super();

        this.addChild(...Builder.fromConfig(config));

        this.joystickBg = this.getChildByName("joystickBg");
        this.joystickPointer = this.getChildByName("joystickPointer");
        this.isJoystickCaptured = false;
        this.pointerIds = [];

        this.on("pointerdown", this.onPointerdown, this);
        this.on("pointermove", this.onPointermove, this);
        this.on("pointerup", this.onPointerup, this);
        this.on("pointerupoutside", this.onPointerup, this);

        this.onDirChanged = () => { };
    }

    /**
     * @param {Function} callback 
     */
    setOnChange(callback = () => { }) {
        this.onDirChanged = callback;
    }

    destroy() {
        this.removeAllListeners();
        this.removeChildren();
        this.onDirChanged = () => { };

        this.joystickBg = null;
        this.joystickPointer = null;
        this.isJoystickCaptured = false;
        this.pointerIds = [];
    }

    activate() {
        this.interactive = true;
    }

    deactivate() {
        this.interactive = false;
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
        const vector = data.getLocalPosition(this.joystickPointer, new Vector2D());
        vector.setLimit(80);

        this.joystickPointer.position.set(vector.x, vector.y);

        this.onDirChanged(vector);
    }

    resetPointerPos() {
        this.joystickPointer.position.set(0, 0);

        this.onDirChanged({ x: 0, y: 0 });
    }
}