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
        this.controller.setSocket(io);

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

    connectUser(callback) {
        this.controller.connectUser(callback);
    }

    createLoginPopup() {
        this.controller.createLoginPopup();
    }
}