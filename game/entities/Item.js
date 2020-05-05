import { Builder } from "../../libs/Builder.js";

export class Item extends Builder.Container {
    constructor(data) {
        super();

        this.view = this.addChild(Builder.createSprite({
            pictureName: "item",
            name: data.id,
            modifiers: {
                anchor: { x: 0.5, y: 0.5 }
            }
        }));

        this.updateData(data);
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
}