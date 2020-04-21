import { Container } from "../../libs/PixiCustomized.js";

export class ControlLayer extends Container {
    constructor(index) {
        super();
        this.layerName = "ControlLayer"; 
        this.zIndex = index;
    }
}