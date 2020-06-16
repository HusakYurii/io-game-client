import { AbstractLayer } from "./AbstractLayer.js";
import { DOMBuilder } from "../../libs/DOMBuilder.js";

export class UILayer extends AbstractLayer {
    constructor(config) {
        super(config);

        this.domContainer = document.body.querySelector('#game') || document.body;
    }

    createLoginPopup(callback) {
        const loginPopup = DOMBuilder.render(this.config.loginPopup);
        this.domContainer.appendChild.apply(this.domContainer, loginPopup);

        const input = this.domContainer.querySelector("#inputName");

        input.oninput = (event) => {
            const button = this.domContainer.querySelector("#loginButton");

            const onSubmit = (event) => {
                callback({
                    name: input.value,
                    roomId: ""
                });
            };

            if (input.value.length > 10) {
                input.value = input.value.slice(0, 10);
            }

            if (input.value.length > 3 && (/[a-zA-z]/g).test(input.value)) {
                button.setAttribute("class", "");
                button.onclick = onSubmit;
            }
            else if (button.getAttribute("class") !== "disabled") {
                button.setAttribute("class", "disabled");
                button.onclick = null;
            }
        };
    }

    removeLoginPopup() {
        const loginPopup = this.domContainer.querySelector("#loginPopup")
        const input = this.domContainer.querySelector("#inputName");
        const button = this.domContainer.querySelector("#loginButton");
        button.onsubmit = input.oninput = null;

        this.domContainer.removeChild(loginPopup);
    }

    createConnectionLostPopup(callback) {
        const connectionLostPopup = DOMBuilder.render(this.config.connectionLostPopup);
        this.domContainer.appendChild.apply(this.domContainer, connectionLostPopup);

        const button = this.domContainer.querySelector("#reconnectButton");
        button.onclick = (event) => {
            button.setAttribute("class", "disabled");
            button.onclick = null;
            callback();
        }
    }

    createGameOverPopup(callback) {
        const gameOverPopup = DOMBuilder.render(this.config.gameOverPopup);
        this.domContainer.appendChild.apply(this.domContainer, gameOverPopup);

        const button = this.domContainer.querySelector("#restartButton");
        button.onclick = (event) => {
            button.setAttribute("class", "disabled");
            button.onclick = null;
            callback();
        };
    }

    cleanupLayer() {
        ["#loginPopup", "#gameOverPopup", "#connectionLostPopup"]
            .forEach((selector) => {
                const element = this.domContainer.querySelector(selector);
                if (element) {
                    this.domContainer.removeChild(element);
                }
            })
        this.removeChildren();
    }
}