import { Builder } from "../../libs/Builder.js";

export class Item {
    constructor(data) {
        this.view = Builder.createSprite({
            pictureName: "item",
            name: data.id,
            modifiers: {
                width: data.r * 2,
                height: data.r * 2,
                anchor: { x: 0.5, y: 0.5 },
                position: { x: data.x, y: data.y }
            }
        });;
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
        this.view.position.set(data.x, data.y);
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