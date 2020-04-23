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
        Object.values(this.viewLayers)
            .forEach((layer) => {
                layer.setTextures(textures);
            });
    }

    /**
     * @param {PIXI.Container[]} layers 
     */
    setLaters(layers) {
        layers.forEach((layer) => {
            this.viewLayers[layer.name] = layer;
            this.addChild(layer);
        });
    }

    getLayerByName(layerName) {
        return this.viewLayers[layerName];
    }

    createLoginPopup(callback) {
        const uiLayer = this.getLayerByName("UILayer");
        uiLayer.createLoginPopup(callback);
    }
}