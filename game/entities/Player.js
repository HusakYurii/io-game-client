import { Item } from "./Item";
import { Builder } from "../../libs/Builder.js";
const { randomColor } = require("../../../shared/Tools.js");

export class Player extends Item {
    constructor(data) {
        super(data);

        this.isActivated = false;
        this.isCooledDown = true;
        this.gravityTimer = 0;
        this.gravityTime = 0;
        this.coolDownTimer = 0;
        this.coolDownTime = 0;
        this.gravityRadius = 0;

        this.gravityRing = this.addChild(
            Builder.createSprite({
                pictureName: "item",
                name: "ring",
                modifiers: { alpha: 0.2, anchor: { x: 0.5, y: 0.5 }, scale: { x: 1, y: 1 } }
            })
        );
        this.coolDownBar = this.addChild(
            Builder.createSprite({
                pictureName: "loginFormBackground",
                name: "coolDownTimer",
                modifiers: { width: 0, height: 20 }
            })
        );
        this.coolDownBar.tint = "0xFF0000";
        this.coolDownBar.visible = false;
        this.gravityRing.visible = false;
    }

    /**
     * @override
     */
    update() {
        this.updateGravityAimation();
        this.updateCoolDownAnimation();
    }

    updateGravityAimation() {
        this.gravityRing.visible = this.isActivated;
        this.gravityRing.width = this.gravityRadius * 2;
        this.gravityRing.height = this.gravityRadius * 2;
    }

    updateCoolDownAnimation() {
        /*
         * coolDownTime = 1  -- is a full bar
         * coolDownTimer = ?  -- a fraction of that;
         * 
         * ? = (coolDownTimer * 1) / coolDownTime;
         * and then reverse it
         * 1 - ((coolDownTimer * 1) / coolDownTime)
         */
        this.coolDownBar.visible = !this.isCooledDown;
        this.coolDownBar.width = 150 - ((this.coolDownTimer / this.coolDownTime) * 150);

        const { width, height } = this.view;
        this.coolDownBar.position.set(-150 / 2, -(height + 50) / 2);
    }

    /**
     * @extends
     * @param {{[key: string]: any}} data 
     */
    updateData(data) {
        super.updateData(data);

        this.isActivated = data.isActivated;
        this.isCooledDown = data.isCooledDown;
        this.gravityTimer = data.gravityTimer;
        this.gravityTime = data.gravityTime;
        this.coolDownTimer = data.coolDownTimer;
        this.coolDownTime = data.coolDownTime;
        this.gravityRadius = data.gravityRadius;
    }

    /**
     * @extends
     * @param {{[key: string]: any}} data
     * @param {string} selfId 
     */
    static create(data, selfId) {
        const player = new Player(data);
        player.view.tint = data.id === selfId ? "0xFFFF00" : randomColor("0x");
        return player;
    }
}