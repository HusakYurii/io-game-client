import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";

export class BackgroundLayer extends AbstractLayer {
    constructor(config) {
        super(config);

    }

    createBackground() {
        const bg = Builder.fromConfig(this.config.background);
        this.addChild(...bg);
    }
}