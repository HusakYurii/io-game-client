import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";
import { Item } from "../entities/Item.js";
import { Player } from "../entities/Player.js";

import { GAME_CONSTANTS } from "../../libs/Shared.js";
const { WORLD_WIDTH, WORLD_HEIGTH } = GAME_CONSTANTS;

export class GameLayer extends AbstractLayer {
    constructor(config) {
        super(config);

        this.players = Object.create(null);
        this.items = Object.create(null);
        this.cameraBounds = null;
        this.gameWorld = null;
    }

    cleanupLayer() {
        Object.values(this.players).forEach((player) => player.stopAnimation());
        Object.values(this.items).forEach((item) => item.stopAnimation());

        this.players = Object.create(null);
        this.items = Object.create(null);

        this.gameWorld.removeChildren();
    }

    createGameWorld() {
        this.gameWorld = this.addChild(new Builder.Container());
        this.cameraBounds = this.addChild(Builder.strokeRect({
            rectWidth: WORLD_WIDTH, rectHeight: WORLD_HEIGTH, width: 6, color: "0xFFFFFF"
        }));
        this.calculateBounds.cacheAsBitmap = true;
    }

    /**
     * @param {number} dt - delta time
     * @param {Storage} storage 
     */
    updateLayer(dt, storage) {
        const { playerId } = storage.getPlayerData();
        const [serverUpdate] = storage.getServerUpdates();

        /**
         * In the case of if the ping was too long, we might not have the serverUpdate
         */
        if (!serverUpdate) {
            return;
        }

        this.deleteFromGroup(serverUpdate.items, "items");
        this.deleteFromGroup(serverUpdate.players, "players");

        serverUpdate.items.forEach((itemData) => {
            if (this.items[itemData.id]) this.updateElement(itemData, "items");
            else this.createElement(itemData, "items");
        });

        serverUpdate.players.forEach((playerData) => {
            if (this.players[playerData.id]) this.updateElement(playerData, "players");
            else this.createPlayer(playerData, playerId);
        });

        if(!storage.hasPlayer()) {
            storage.setPlayer(this.players[playerId]);
        }
    }

    getPlayer() {
        return this.player;
    }

    createPlayer(data, selfId) {
        data.pictureName = "item"; // FIXME it is not a good idea
        const player = Player.create(data, selfId);
        this.players[data.id] = player;

        /*
         * Add myself to the  game layer but the rest to game world. So, I can use camera effects
         */
        if (data.id === selfId) this.addChild(player);
        else this.gameWorld.addChild(player);
    }

    createElement(data, group) {
        data.pictureName = "star"; // FIXME it is not a good idea
        const element = Item.create(data);
        element.startAnimation();
        this[group][data.id] = element;
        this.gameWorld.addChild(element);
    }

    updateElement(data, group) {
        const element = this[group][data.id];
        element.updateData(data);
        element.update();
    }

    /**
     * As this function is more generic, delete an item in both layers if it is in any of them
     * @param {object} data 
     * @param {string} group  - name of a group to delete an element from
     */
    deleteElement(data, group) {
        const element = this[group][data.id];
        element.stopAnimation();
        delete this[group][data.id];
        this.gameWorld.removeChild(element);
        this.removeChild(element);
    }

    /**
     * Each new update from the server should be checked and if it does not have any items, 
     * but which are in view container we need to remove them from view 
     * @param {object[]} list - list of items/players from the server
     * @param {string} group - name of a group to clean
     */
    deleteFromGroup(list, group) {
        for (let id in this[group]) {
            const isExist = list.some((el) => el.id === id);
            if (!isExist) {
                this.deleteElement({ id }, group);
            }
        }
    }
}