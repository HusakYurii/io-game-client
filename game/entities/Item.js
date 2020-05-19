import { Builder } from "../../libs/Builder.js";
import { TWEEN } from "../../libs/Tween.js";
const { randomInt, randomFloat } = require("../../../shared/Tools.js");

export class Item extends Builder.Container {
    constructor(data) {
        super();

        this.view = this.addChild(Builder.createSprite({
            pictureName: data.pictureName,
            name: data.id,
            modifiers: {
                anchor: { x: 0.5, y: 0.5 }
            }
        }));
        this.view.tint = Item.getRandomTint();

        this.tween = null;
        this.updateData(data);
    }

    startAnimation() {
        this.tween = new TWEEN.Tween(this.view)
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
     * @param {number} dt - delta time
     */
    update(dt) { }

    /**
     * @param {{[key: string]: any}} data 
     */
    updateData(data) {
        this.view.width = data.r * 2;
        this.view.height = data.r * 2;
        this.position.set(data.x, data.y);
    }

    /**
     * @static
     * @param {{[key: string]: any}} data 
     * @returns {Item}
     */
    static create(data) {
        return new Item(data);
    }

    static getRandomTint() {
        const indx = Math.floor(Math.random() * Item.tintsMap.length)
        return Item.tintsMap[indx];
    }
}

Item.tintsMap = [
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