import { Item } from "./Item";
const Tools = require("../../../shared/Tools.js");

export class Player extends Item {
    constructor(data) {
        super(data);

        this.isActivated = false;
        this.isCooledDown = true;
        this.gravityTimer = 0;
        this.gravityTime = 0;
        this.coolDownTimer = 0;
        this.coolDownTime = 0;
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
    }

    /**
     * @extends
     * @param {{[key: string]: any}} data
     * @param {string} selfId 
     */
    static create(data, selfId) {
        const player = new Player(data);
        player.view.tint = data.id === selfId ? "0xFFFF00" : Tools.randomColor("0x");
        return player;
    }
}