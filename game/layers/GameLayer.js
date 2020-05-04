import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";
const Tools = require("../../../shared/Tools.js");

export class GameLayer extends AbstractLayer {
    constructor(config) {
        super(config);

        this.players = Object.create(null);
        this.items = Object.create(null);
        this.gameWorld = this.addChild(new Builder.Container());
    }

    updateGame(gameModel) {
        const { playerId } = gameModel.getUserData();
        const data = gameModel.getServerUpdates();

        /**
         * In the case of if the ping was too long, we might not have the data
         */
        if (!data) {
            return;
        }

        this.deleteFromGroup(data.items, "items");
        this.deleteFromGroup(data.players, "players");
        // data.items.toDelete.forEach((itemData) => {
        //     this.deleteElement(itemData, "items");
        // });

        // data.players.toDelete.forEach((itemData) => {
        //     this.deleteElement(itemData, "players");
        // });

        data.items.forEach((itemData) => {
            if (this.items[itemData.id]) this.updateElement(itemData, "items");
            else this.createElement(itemData, "items");
        });

        data.players.forEach((playerData) => {
            if (this.players[playerData.id]) this.updateElement(playerData, "players");
            else this.createPlayer(playerData, playerId);
        });
    }

    createPlayer(data, selfId) {
        const config = {
            pictureName: "player",
            name: data.id,
            modifiers: {
                width: data.r * 2,
                height: data.r * 2,
                anchor: { x: 0.5, y: 0.5 },
                position: { x: data.x, y: data.y }
            }
        };
        const player = Builder.createSprite(config);
        player.tint = data.id === selfId ? "0xFFFF00" : Tools.randomColor("0x");
        this.players[data.id] = player;
        this.gameWorld.addChild(player);
    }

    createElement(data, group) {
        const config = {
            pictureName: "item",
            name: data.id,
            modifiers: {
                width: data.r * 2,
                height: data.r * 2,
                anchor: { x: 0.5, y: 0.5 },
                position: { x: data.x, y: data.y }
            }
        };
        const element = Builder.createSprite(config);
        this[group][data.id] = element;
        this.gameWorld.addChild(element);
    }

    updateElement(data, group) {
        const element = this[group][data.id];
        element.width = data.r * 2;
        element.height = data.r * 2;
        element.position.set(data.x, data.y);
    }

    deleteElement(data, group) {
        const element = this[group][data.id];
        delete this[group][data.id];
        this.gameWorld.removeChild(element);
    }

    deleteFromGroup(list, group) {
        for (let id in this[group]) {
            const isExist = list.some((el) => el.id === id);
            if (!isExist) {
                this.deleteElement({ id }, group);
            }
        }
    }
}