import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";

export class GameLayer extends AbstractLayer {
    constructor(config) {
        super(config);

        this.players = {};
        this.items = {};
    }

    updateGame(gameModel) {
        const playerId = gameModel.playerId;
        const data = gameModel.getServerUpdates();
    }
}