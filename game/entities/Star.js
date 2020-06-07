import { AbstractEntity } from "./AbstractEntity.js";
import { Builder } from "../../libs/Builder.js";
import { TWEEN } from "../../libs/Tween.js";
import { randomInt, randomFloat } from "../../libs/Shared.js";

export class Star extends AbstractEntity {
    constructor() {
        super();

        this.tween = null;
    }

    startAnimation() {
        this.tween = new TWEEN.Tween(this)
            .to({ alpha: randomFloat(0.2, 0.6) }, randomInt(1000, 2000))
            .repeat(Infinity)
            .yoyo(true)
            .start();
    }

    stopAnimation() {
        if (this.tween) {
            this.tween.stop();
        }
    }

    /**
     * @param {{[key: string]: any}} data 
     */
    updateData(data) {
        this.width = data.r * 2;
        this.height = data.r * 2;
        this.position.set(data.x, data.y);
    }

    /**
     * @static
     * @param {object[]} config 
     * @param {{[key: string]: any}} data 
     * @returns {Star}
     */
    static create(config, data) {
        const star = new Star();
        star.addChild(...Builder.fromConfig(config));
        star.getChildByName("star").tint = Star.getRandomTint();
        star.updateData(data);
        return star;
    }

    static getRandomTint() {
        const indx = Math.floor(Math.random() * Star.tintsMap.length);
        return Star.tintsMap[indx];
    }
}

Star.tintsMap = [
    "0x03cefc",
    "0xfc5203",
    "0xfcf403",
    "0xfc8403",
    "0xca03fc",
    "0x0388fc",
    "0xfc03f8",
    "0x4efc03",
    "0xfcb103",
    "0xfcf403",
    "0x03fceb"
];