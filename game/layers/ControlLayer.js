import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";

export class ControlLayer extends AbstractLayer {
    constructor(config) {
        super(config);

        this.hitArea = new Builder.Rectangle(-10000 / 2, -10000 / 2, 10000, 10000);
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
}