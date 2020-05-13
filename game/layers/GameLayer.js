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
        this.gameWorld = this.addChild(new Builder.Container());
        this.cameraBounds = this.gameWorld.addChild(Builder.strokeRect({
            rectWidth: WORLD_WIDTH, rectHeight: WORLD_HEIGTH, width: 6, color: "0xFFFFFF"
        }));
        this.calculateBounds.cacheAsBitmap = true;
    }

    updateLayer(dt, gameModel) {
        const { playerId } = gameModel.getPlayerData();
        const data = gameModel.getServerUpdates();

        /**
         * In the case of if the ping was too long, we might not have the data
         */
        if (!data) {
            return;
        }

        this.deleteFromGroup(data.items, "items");
        this.deleteFromGroup(data.players, "players");

        data.items.forEach((itemData) => {
            if (this.items[itemData.id]) this.updateElement(itemData, "items");
            else this.createElement(itemData, "items");
        });

        data.players.forEach((playerData) => {
            if (this.players[playerData.id]) this.updateElement(playerData, "players");
            else this.createPlayer(playerData, playerId);
        });

        if (!gameModel.hasPlayer()) {
            gameModel.setPlayer(this.players[playerId]);
        }
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

    deleteFromGroup(list, group) {
        for (let id in this[group]) {
            const isExist = list.some((el) => el.id === id);
            if (!isExist) {
                this.deleteElement({ id }, group);
            }
        }
    }

    /**
     * @param {{x: number; y: number}} from - player curr pos
     * @param {{x: number; y: number}}  to - player next pos
     */
    move(from, to) {
        this.gameWorld.x = from.x * -1;
        this.gameWorld.y = from.y * -1;
    }
}