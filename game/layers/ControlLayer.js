import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";

export class ControlLayer extends AbstractLayer {
    constructor(config) {
        super(config);

    }

    resize(sizes) {
        const { width, height } = sizes;
        this.hitArea = new Builder.Rectangle(-width / 2, -height / 2, width, height);
    }

    setControls(onMove, onActivate) {
        this.interactive = true;
        // this.on("pointerdown", onMove);
        this.on("mousedown", onMove);
    }
}