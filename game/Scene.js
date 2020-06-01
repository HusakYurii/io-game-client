import { Container } from "../libs/PixiCustomized.js";

export class Scene {
    constructor() {
        
        this.view = new Container();

        this.viewTextures = {};
        this.viewLayers = {};
        this.sortableChildren = true;
    }

    /**
     * @param {{[key: string]: Texture}[]} textures 
     */
    setTextures(textures) {
        Object.values(this.viewLayers)
            .forEach((layer) => layer.setTextures(textures));
    }

    /**
     * @param {PIXI.Container[]} layers 
     */
    setLaters(layers) {
        layers.forEach((layer) => {
            this.viewLayers[layer.name] = layer;
            this.view.addChild(layer);
        });
    }

    resizeScene(sizes) {
        const { scl, width, height } = sizes;
        
        this.view.position.set(width / 2, height / 2);
        this.view.scale.set(scl);

        Object.values(this.viewLayers)
            .forEach((layer) => layer.resizeLayer(sizes));
    }

    cleanUpLayers() {
        Object.values(this.viewLayers)
            .forEach((layer) => layer.cleanupLayer());
    }

    getLayer(layerName) {
        return this.viewLayers[layerName];
    }

    createGameBackground() {
        this.viewLayers["BackgroundLayer"].createBackground();
    }

    createGameWorld() {
        this.viewLayers["GameLayer"].createGameWorld();
    }

    createConnectionLostPopup(callback) {
        this.viewLayers["UILayer"].createConnectionLostPopup(callback);
    }

    createGameOverPopup(callback) {
        this.viewLayers["UILayer"].createGameOverPopup(callback);
    }

    createLoginPopup(callback) {
        this.viewLayers["UILayer"].createLoginPopup(callback);
    }

    removeLoginPopup() {
        this.viewLayers["UILayer"].removeLoginPopup();
    }

    turnOnControls(onMove, onActivate) {
        this.viewLayers["ControlLayer"].turnOnControls(onMove, onActivate);
    }

    turnOffControls() {
        this.viewLayers["ControlLayer"].turnOffControls();
    }

    /**
     * 
     * @param {number} dt - delta time
     * @param {Storage} storage - game model
     */
    updateLayers(dt, storage) {
        Object.values(this.viewLayers)
            .forEach((layer) => layer.updateLayer(dt, storage));
    }
}