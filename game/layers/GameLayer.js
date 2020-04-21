import { Container } from "../../libs/PixiCustomized.js";

export class GameLayer extends Container {
    constructor(index) {
        super();
        this.layerName = "GameLayer";
        this.zIndex = index;
    }
}