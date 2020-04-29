import { AbstractLayer } from "./AbstractLayer.js";

export class ControlLayer extends AbstractLayer {
    constructor(config) {
        super(config);

    }

    setControls(onMove, onActivate) {
        this.interactive = true;
        this.on("mousemove", onMove);
        this.on("click", onActivate);
    }
}