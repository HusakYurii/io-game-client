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

    resize(sizes) {
        const { scl, windowSize } = sizes;
        this.position.set(windowSize.width / 2, windowSize.height / 2);
        this.scale.set(scl);
        Object.values(this.viewLayers)
            .forEach((layer) => layer.resize(sizes));
    }

    getLayerByName(layerName) {
        return this.viewLayers[layerName];
    }

    createGameBackground() {
        this.getLayerByName("BackgroundLayer").createBackground();
    }

    createLoginPopup(callback) {
        this.getLayerByName("UILayer").createLoginPopup(callback);
    }

    removeLoginPopup() {
        this.getLayerByName("UILayer").removeLoginPopup();
    }

    updateGameLayer(gameModel) {
        this.getLayerByName("GameLayer").updateGame(gameModel);
    }

    turnOnControls(onMove, onActivate) {
        this.getLayerByName("ControlLayer").setControls(onMove, onActivate);
    }
}