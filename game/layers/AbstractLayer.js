import { Container } from "../../libs/PixiCustomized.js";

export class AbstractLayer extends Container {
    constructor(config) {
        super();
        
        this.name = config.layerName;
        this.zIndex = config.layerIndex;
        this.config = config;

        this.viewTextures = {};
    }

    setTextures(textures) {
        this.viewTextures = textures;
    }
}