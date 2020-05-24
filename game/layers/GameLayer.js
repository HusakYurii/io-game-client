import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";
import { Item } from "../entities/Item.js";
import { Player } from "../entities/Player.js";

const { GAME_CONSTANTS } = require("../../../shared/Constants.js");
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

    updateLayer(dt, gameModel) {
        const { playerId } = gameModel.getPlayerData();
        const [serverUpdate] = gameModel.getServerUpdates();

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

        /**
         * TODO FIX it. it should be done by camera
         * As camera moves layer, rest player to be at the center for camera effect
         */
        const player = this.players[playerId];
        player && player.position.set(0, 0);
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

    /**
     * @param {{x: number; y: number}} newPos - player next pos
     */
    move(newPos) {
        this.gameWorld.position.set(newPos.x, newPos.y);
        this.cameraBounds.position.set(newPos.x, newPos.y);
    }
}