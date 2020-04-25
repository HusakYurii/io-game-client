import { Container } from "../../libs/PixiCustomized.js";
import { Builder } from "../../libs/Builder.js";

export class UILayer extends Container {
    constructor(config) {
        super();
        this.name = config.layerName;
        this.zIndex = config.layerIndex;
        this.config = config;

        this.viewTextures = {};
        this.nickNameInput = {};
        this.roomInput = {};
    }

    setTextures(textures) {
        this.viewTextures = textures;
    }

    createLoginPopup(callback) {

        this.nickNameInput = document.createElement("input");
        document.body.appendChild(this.nickNameInput);

        this.roomInput = document.createElement("input");
        document.body.appendChild(this.roomInput);

        const popup = Builder.fromConfig(this.config.loginPopupTree);
        this.addChild(...popup);

        const button = this.getChildByName("button");
        button.interactive = true;
        button.once("pointerdown", (event) => {
            event.stopPropagation();
            callback({
                name: this.nickNameInput.value,
                roomId: this.roomInput.value
            });
        });
    }
}