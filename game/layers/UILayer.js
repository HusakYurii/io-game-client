import { Container } from "../../libs/PixiCustomized.js";

export class UILayer extends Container {
    constructor(index) {
        super();
        this.layerName = "UILayer";
        this.zIndex = index;
    }
}