import { AbstractEntity } from "./AbstractEntity.js";
import { Builder } from "../../libs/Builder.js";

export class Player extends AbstractEntity {
    constructor() {
        super();

        this.isActivated = false;
        this.isCooledDown = true;
        this.gravityTimer = 0;
        this.gravityTime = 0;
        this.coolDownTimer = 0;
        this.coolDownTime = 0;
        this.gravityR = 0;
    }

    /**
     * @override
     */
    update() {
        this.updateGravityAimation();
        this.updateCoolDownAnimation();
    }

    updateGravityAimation() {
        const gravityRing = this.getChildByName("gravityRing");
        gravityRing.visible = this.isActivated;
        gravityRing.width = this.gravityR * 2;
        gravityRing.height = this.gravityR * 2;
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
        const coolDownBar = this.getChildByName("coolDownBar");
        const player = this.getChildByName("player");

        coolDownBar.visible = !this.isCooledDown;
        coolDownBar.width = 150 - ((this.coolDownTimer / this.coolDownTime) * 150);

        const { width, height } = player;
        coolDownBar.position.set(-150 / 2, -(height + 50) / 2);
    }

    /**
     * @extends
     * @param {{[key: string]: any}} data 
     */
    updateData(data) {
        const player = this.getChildByName("player");
        player.width = data.r * 2;
        player.height = data.r * 2;

        this.position.set(data.x, data.y);

        this.isActivated = data.isActivated;
        this.isCooledDown = data.isCooledDown;
        this.gravityTimer = data.gravityTimer;
        this.gravityTime = data.gravityTime;
        this.coolDownTimer = data.coolDownTimer;
        this.coolDownTime = data.coolDownTime;
        this.gravityR = data.gravityR;
    }

    /**
     * @extends
     * @param {object[]} config
     * @param {{[key: string]: any}} config
     */
    static create(config, data) {
        const el = config.find(({ name }) => name === "player");
        el.pictureName = Player.getRandomPicName();

        const player = new Player();
        player.addChild(...Builder.fromConfig(config));

        player.getChildByName("coolDownBar").tint = "0xFF0000";
        player.getChildByName("coolDownBar").visible = false;
        player.getChildByName("gravityRing").visible = false;
        player.updateData(data);
        return player;
    }

    static getRandomPicName() {
        const indx = Math.floor(Math.random() * Player.planetsMap.length);
        return Player.planetsMap[indx];
    }
}

Player.planetsMap = [
    "1", "2", "3", "5", "8", "9", "10", "11", "12", "13", "15", "16", "19", "21", "29", "30",
];