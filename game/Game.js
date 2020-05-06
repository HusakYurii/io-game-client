import { Application } from "../libs/PixiCustomized.js";

export class Game extends Application {

    /**
     * @param {Controller} controller 
     */
    constructor(params, controller) {
        super(params);

        this.controller = controller;
    }

    init() {
        this.controller.initSocket(io);
        this.controller.defineDevice();
        this.stage.addChild(this.controller.view);
        document.body.appendChild(this.view);
    }

    setViewLayers(layers) {
        this.controller.setViewLayers(layers);
    }

    loadGameAssets(callback) {
        const { gameConfig } = this.controller.model;

        this.loader.add(gameConfig.assets);
        this.loader.add(gameConfig.spritesheets);

        this.loader.load(this.onAssetsLoaded.bind(this, callback));
    }

    onAssetsLoaded(callback, loader, resources) {
        this.controller.setViewResources(resources);
        callback();
    }

    onResize(data) {
        this.renderer.resize(data.width, data.height);
        this.controller.onResize(data);
    }

    // ============== connection ===============
    loginPlayer(data, callback) {
        this.controller.loginPlayer(data, callback);
    }

    connectPlayer(callback) {
        this.controller.connectPlayer(callback);
    }

    setUpdatesConnection() {
        this.controller.setUpdatesConnection();
    }

    // ============== connection ===============
    createLoginPopup(callback) {
        this.controller.createLoginPopup(callback);
    }

    removeLoginPopup() {
        this.controller.removeLoginPopup();
    }

    createGameBackground() {
        this.controller.createGameBackground();
    }

    turnOnControls() {
        this.controller.turnOnControls();
    }

    startGameLoop() {
        this.ticker.add(this.controller.update)
    }
}