import { Container } from "../../libs/PixiCustomized.js";

export class BackgroundLayer extends Container {
    constructor(index) {
        super();
        this.layerName = "BackgroundLayer";
        this.zIndex = index;
    }
}