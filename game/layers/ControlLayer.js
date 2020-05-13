import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";

const { GAME_CONSTANTS } = require("../../../shared/Constants.js");
const { WORLD_WIDTH, WORLD_HEIGTH } = GAME_CONSTANTS;

export class ControlLayer extends AbstractLayer {
    constructor(config) {
        super(config);

        this.hitArea = new Builder.Rectangle(-WORLD_WIDTH, -WORLD_HEIGTH, WORLD_WIDTH * 2, WORLD_HEIGTH * 2);
    }

    setControls(isMobile, onClick, onDoubleClick) {

        this.interactive = true;

        if (isMobile) {
            this.on("pointerdown", onClick);
        }
        else {
            this.on("mousedown", onClick);
            this.on("dblclick", onDoubleClick);
        }
    }

    removeControls() {
        this.removeAllListeners();
    }
}