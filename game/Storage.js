const { GAME_CONSTANTS } = require("../../shared/Constants.js");

export class Storage {
    constructor() {
        /*
         * General data
         */
        this.viewportSizes = {};
        this.isMobile = false;
        this.isGameStarted = false;
        this.isGameOver = false;

        /*
         * Data related to player, it is being sent each tick
         * player will be set as game starts, so it can be availablein the model for every component
         */
        this.player = null;
        this.playerId = "";
        this.roomId = "";
        this.name = "";

        this.joysticDir = { x: 0, y: 0 };
        this.isPLayerActivated = false;

        /*
         * Data related to server/render updates
         */
        this.gameStartTime = -1;
        this.gameRenderDelay = GAME_CONSTANTS.GAME_RENDER_DELAY;

        this.serverUpdates = [];
        this.serverStartTime = -1;
    }

    /**
     * Current sizes provided by Resize Manager
     * @param {{width: number;, height: number; scl: number;}} data 
     */
    setViewportSizes(data) {
        this.viewportSizes = data;
    }

    /**
     * @returns {{width: number;, height: number; scl: number;}}
     */
    getViewportSizes() {
        return this.viewportSizes;
    }

    /**
     * To set time when GameState was started
     */
    setGameStartTime() {
        this.gameStartTime = Date.now();
    }

    /**
     * 
     * @param {{playerId: string; roomId: string; name: string;}} param0 
     */
    updatePlayerData({ id, roomId, name } = {}) {
        this.playerId = id;
        this.roomId = roomId;
        this.name = name;
    }

    /**
     * @returns {{playerId: string; roomId: string; name: string;}}
     */
    getPlayerData() {
        return {
            playerId: this.playerId,
            roomId: this.roomId,
            name: this.name
        }
    }

    /**
     * @param {{x: number; y: number;}} data
     */
    setJoystickDir(data) {
        this.joysticDir = { x: data.x, y: data.y };
    }

    /**
     * @returns {{x: number; y: number;}}
     */
    getJoysticrDir() {
        return this.joysticDir;
    }

    setServerUpdates(data) {
        if (this.serverStartTime < 0) {
            this.serverStartTime = data.time;
        }

        this.serverUpdates.push(data);
        this.isGameStarted = true;

        /**
         * To slice very old data out
         */
        const serverTime = this.getServerCurrentTime();
        for (let i = this.serverUpdates.length - 1; i >= 0; i -= 1) {
            if (this.serverUpdates[i].time <= serverTime) {
                this.serverUpdates.splice(0, i);
                break;
            }
        }
    }

    /**
     * @returns {any[]}
     */
    getServerUpdates() {
        return this.serverUpdates;
    }

    removeUsedServerUpdates() {
        this.serverUpdates.shift();
    }

    activatePlayer() {
        this.isPLayerActivated = true;
    }

    deactivatePlayer() {
        this.isPLayerActivated = false;
    }

    /**
     * @returns {boolean}
     */
    isPlayerActived() {
        return this.isPLayerActivated;
    }

    /**
     * To calculate how long the server is being running.
     * Literally, it is the time of how long the game is running (starting from GameState)
     * @returns {number} ms
     */
    getServerCurrentTime() {
        return this.serverStartTime + (Date.now() - this.gameStartTime) - this.gameRenderDelay;
    }

    /**
     * @returns {boolean}
     */
    hasPlayer() {
        return Boolean(this.player);
    }

    /**
     * @param {PIXI.DisplayObject} player 
     */
    setPlayer(player) {
        this.player = player;
    }

    /**
     * @returns {PIXI.DisplayObject} 
     */
    getPlayer() {
        return this.player;
    }
}