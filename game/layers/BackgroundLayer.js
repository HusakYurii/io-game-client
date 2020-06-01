import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";

const { GAME_CONSTANTS } = require("../../../shared/Constants.js");
const { WORLD_WIDTH, WORLD_HEIGTH } = GAME_CONSTANTS;

export class BackgroundLayer extends AbstractLayer {
    constructor(config) {
        super(config);
        
        this.gameWorldBg = null;
    }

    createBackground() {
        this.gameWorldBg = this.addChild(new Builder.TilingSprite(this.viewTextures["hexagon"], WORLD_WIDTH, WORLD_HEIGTH));
        this.gameWorldBg.anchor.set(0.5, 0.5);
    }
}