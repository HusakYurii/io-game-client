import { Container } from "../libs/PixiCustomized.js";

export class View extends Container {
    constructor() {
        super();
        this.viewTextures = {};
        this.viewLayers = {};
        this.sortableChildren = true;
    }

    /**
     * @param {{[key: string]: Texture}[]} textures 
     */
    setTextures(textures) {
        this.viewTextures = textures;
    }

    /**
     * @param {PIXI.Container[]} layers 
     */
    setLaters(layers) {
        layers.forEach((layer) => {
            this.viewLayers[layer.layerName] = layer;
            this.addChild(layer);
        });
    }

    getLayerByName(layerName) {
        return this.viewLayers[layerName];
    }

    createLoginPopup() { }
}