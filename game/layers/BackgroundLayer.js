import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";



export class BackgroundLayer extends AbstractLayer {
    constructor(config) {
        super(config);
        this.gameWorldBg = null;
    }

    createBackground() {
        this.addChild(...Builder.fromConfig(this.config.background));
        this.gameWorldBg = this.addChild(new Builder.TilingSprite(this.viewTextures["sky"], 3000, 3000));
        this.gameWorldBg.anchor.set(0.5, 0.5);
    }

    /**
     * @param {{x: number; y: number}} from - player curr pos
     * @param {{x: number; y: number}}  to - player next pos
     */
    move(from, to) {
        this.gameWorldBg.x = from.x * -1;
        this.gameWorldBg.y = from.y * -1;
    }
}