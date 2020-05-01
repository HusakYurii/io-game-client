import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";

export class GameLayer extends AbstractLayer {
    constructor(config) {
        super(config);

        this.players = {};
        this.items = {};
        this.gameWorld = this.addChild(new Builder.Container());
    }

    updateGame(gameModel) {
        const playerId = gameModel.playerId;
        const data = gameModel.getServerUpdates();

        if (!data) return;

        data.items.toDelete.forEach((itemData) => {
            this.deleteElement(itemData, "items");
        });

        data.players.toDelete.forEach((itemData) => {
            this.deleteElement(itemData, "players");
        });

        data.items.toUpdate.forEach((itemData) => {
            if (this.items[itemData.id]) this.updateElement(itemData, "items");
            else this.createElement(itemData, "items");
        });

        data.players.toUpdate.forEach((playerData) => {
            if (this.players[playerData.id]) this.updateElement(playerData, "players");
            else this.createPlayer(playerData, playerId);
        });
    }

    createPlayer(data, selfId) {
        const config = {
            pictureName: data.id === selfId ? "player" : "other",
            name: data.id
        };
        const player = GameLayer.createSprite(config, data);
        this.players[data.id] = player;
        this.gameWorld.addChild(player);
    }

    createElement(data, group) {
        const config = {
            pictureName: "item",
            name: data.id
        };
        const element = GameLayer.createSprite(config, data);
        this[group][data.id] = element;
        this.gameWorld.addChild(element);
    }

    updateElement(data, group) {
        const element = this[group][data.id];
        element.position.set(data.x, data.y);
    }

    deleteElement(data, group) {
        const element = this[group][data.id];
        delete this[group][data.id];
        this.gameWorld.removeChild(element);
    }

    static createSprite(config, data) {
        const sprite = Builder.createSprite(config);
        sprite.position.set(data.x, data.y);
        sprite.scale.set(0.5,0.5);
        sprite.width = sprite.height = (data.r * 2);
        return sprite;
    }
}