import { AbstractLayer } from "./AbstractLayer.js";
import { Builder } from "../../libs/Builder.js";
import { Item } from "../entities/Item.js";
import { Player } from "../entities/Player.js";
import { Graphics } from "@pixi/graphics";

export class GameLayer extends AbstractLayer {
    constructor(config) {
        super(config);

        this.players = Object.create(null);
        this.items = Object.create(null);
        this.gameWorld = this.addChild(new Builder.Container());
        this.cameraBounds = this.gameWorld.addChild(
            new Graphics().lineStyle({ width: 4 })
                .drawRect(-1500, -1500, 3000, 3000)
                .endFill());
    }

    updateGame(gameModel) {
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

        this.updateCamera(gameModel);
    }

    createPlayer(data, selfId) {
        const player = Player.create(data, selfId);
        this.players[data.id] = player;

        /*
         * Add myself to the  game layer but the rest to game world. So, I can use camera effects
         */
        if (data.id === selfId) this.addChild(player);
        else this.gameWorld.addChild(player);
    }

    createElement(data, group) {
        const element = Item.create(data);
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
     * let's pretend that this is a camera component. 
     * It will move world to a player's opposite side but set user's pos to be always at the center
     * @param {Model} gameModel 
     */
    updateCamera(gameModel) {
        const player = gameModel.getPlayer();
        this.moveCamera(player.x * -1, player.y * -1)
        player.position.set(0, 0);
    }

    moveCamera(x, y) {
        this.gameWorld.x = x;
        this.gameWorld.y = y;
    }

    zoomCamera(n) {
        this.scale.set(n);
    }
}