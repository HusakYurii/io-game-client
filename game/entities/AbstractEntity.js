import { Builder } from "../../libs/Builder.js";

export class AbstractEntity extends Builder.Container {
    constructor() {
        super();
    }

    /**
     * @abstract
     */
    startAnimation() { }

    /**
     * 
     * @abstract
     */
    stopAnimation() { }

    /**
     * @abstract
     * @param {number} dt - delta time
     */
    update(dt) { }

    /**
     * @abstract
     * @param {{[key: string]: any}} data 
     */
    updateData(data) { }

    /**
     * @abstract
     * @static
     * @param {{[key: string]: any}} data 
     * @returns {Item}
     */
    static create(data) { }
}