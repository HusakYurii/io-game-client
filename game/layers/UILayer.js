import { Container } from "../../libs/PixiCustomized.js";

export class UILayer extends Container {
    constructor(config) {
        super();
        this.name = config.layerName;
        this.zIndex = config.layerIndex;
        this.config = config;

        this.viewTextures = {};
        this.nickNameInput = {};
        this.roomInput = {};
    }

    setTextures(textures) {
        this.viewTextures = textures;
    }
}