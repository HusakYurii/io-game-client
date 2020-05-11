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
        const { scl, width, height } = sizes;
        this.position.set(width / 2, height / 2);
        this.scale.set(scl);

        Object.values(this.viewLayers)
            .forEach((layer) => {
                layer.resize(sizes);
            });
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

    turnOnControls(isMobile, onMove, onActivate) {
        this.getLayerByName("ControlLayer").setControls(isMobile, onMove, onActivate);
    }

    /**
     * 
     * @param {number} dt - delta time
     * @param {Model} gameModel - game model
     */
    updateLayers(dt, gameModel) {
        Object.values(this.viewLayers)
            .forEach((layer) => {
                layer.updateLayer(dt, gameModel)
            });
    }

    /**
     * let's pretend that this is a camera component. 
     * It will move world to a player's opposite side but set user's pos to be always at the center
     * @param {number} dt - delta time
     * @param {Model} gameModel 
     */
    updateCamera(dt, gameModel) {
        const { from, to } = gameModel.getPlayerPos();
        this.getLayerByName("BackgroundLayer").move(from, to);
        this.getLayerByName("GameLayer").move(from, to);
    }
}