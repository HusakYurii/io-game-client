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
        this.controller.addSocket(io);

        this.stage.addChild(this.controller.view);
        document.body.appendChild(this.view);
    }

    loadGameAssets(callback) {
        const { gameConfig: { assets } } = this.controller.model;
        this.loader.add(assets);
        this.loader.load(callback);
    }

    connectUser(callback) {
        this.controller.connectUser(callback);
    }
}