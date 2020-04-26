import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";

export class UILayer extends AbstractLayer {
    constructor(config) {
        super(config);
        this.inputs = {};
    }

    createLoginPopup(callback) {

        this.inputs.nickNameInput = document.createElement("input");
        document.body.appendChild(this.inputs.nickNameInput);

        // this.inputs.roomInput = document.createElement("input");
        // document.body.appendChild(this.inputs.roomInput);

        const popup = Builder.fromConfig(this.config.loginPopupTree);
        this.addChild(...popup);

        const button = this.getChildByName("button");
        button.interactive = true;
        button.once("pointerdown", (event) => {
            event.stopPropagation();
            callback({
                name: this.inputs.nickNameInput.value,
                roomId: ""
                // roomId: this.inputs.roomInput.value
            });
        });
    }
}