import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";
import { DOMBuilder } from "../../libs/DOMBuilder.js";

export class UILayer extends AbstractLayer {
    constructor(config) {
        super(config);

        this.domContainer = null;
    }

    createLoginPopup(callback) {
        const loginPopup = DOMBuilder.render(this.config.loginPopup);
        this.domContainer = document.body.querySelector('#game') || document.body;
        this.domContainer.appendChild.apply(this.domContainer, loginPopup);

        const form = this.domContainer.querySelector("#loginPopup > form");
        const input = this.domContainer.querySelector("#inputName");

        input.oninput = (event) => {
            const button = this.domContainer.querySelector("#loginButton");

            const onSubmit = (event) => {
                event.preventDefault();
                callback({
                    name: input.value,
                    roomId: ""
                });
            };

            if (input.value.length > 3 && (/[a-zA-z]/g).test(input.value)) {
                button.setAttribute("class", "");
                form.onsubmit = onSubmit;
            }
            else {
                if (button.getAttribute("class") !== "disabled") {
                    button.setAttribute("class", "disabled");
                }
                form.onsubmit = null
            }
        };
    }

    removeLoginPopup() {
        const loginPopup = this.domContainer.querySelector("#loginPopup")
        const form = this.domContainer.querySelector("#loginPopup > form");
        const input = this.domContainer.querySelector("#inputName");
        form.onsubmit = null;
        input.oninput = null;
        this.domContainer.removeChild(loginPopup);
    }

    createConnectionLostPopup(callback) {
        const popup = this.addChild(...Builder.fromConfig(this.config.connectionLostPopupTree));
        const reconnectButton = popup.getChildByName("reconnectButton");
        reconnectButton.interactive = true;
        reconnectButton.once("pointerdown", () => {
            reconnectButton.alpha = 0.7;
            callback();
        });
    }

    createGameOverPopup(callback) {
        const popup = this.addChild(...Builder.fromConfig(this.config.gameOverPopupTree));
        const restartButton = popup.getChildByName("restartButton");
        restartButton.interactive = true;
        restartButton.once("pointerdown", callback);
    }

    cleanupLayer() {
        this.removeChildren();
    }
}