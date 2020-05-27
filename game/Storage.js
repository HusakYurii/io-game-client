const { GAME_CONSTANTS } = require("../../shared/Constants.js");

export class Storage {
    constructor(gameConfig) {
        /*
         * General data
         */
        this.gameConfig = gameConfig;
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
        this.playerPos = {
            from: { x: 0, y: 0 },
            to: { x: 0, y: 0 }
        };
        this.joysticDir = { x: 0, y: 0 };
        this.activate = false;

        /*
         * Data related to server/render updates
         */
        this.gameStartTime = -1;
        this.gameRenderDelay = GAME_CONSTANTS.GAME_RENDER_DELAY;

        this.serverUpdates = [];
        this.serverStartTime = -1;
    }

    cleanUpData() {
        this.isGameStarted = false;
        this.isGameOver = false;

        this.player = null;
        this.playerId = "";
        this.roomId = "";
        this.name = "";
        this.playerPos = {
            from: { x: 0, y: 0 },
            to: { x: 0, y: 0 }
        };
        this.joysticDir = { x: 0, y: 0 };
        this.activate = false;

        this.gameStartTime = -1;
        this.gameRenderDelay = GAME_CONSTANTS.GAME_RENDER_DELAY;;

        this.serverUpdates = [];
        this.serverStartTime = -1;
    }

    updateViewportSizes(data) {
        this.viewportSizes = data;
    }

    updateGameStartTime() {
        this.gameStartTime = Date.now();
    }

    updatePlayerData({ id, roomId, name } = {}) {
        this.playerId = id;
        this.roomId = roomId;
        this.name = name;
    }

    setJoystickDir(data) {
        this.joysticDir = { x: data.x, y: data.y };
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

    getServerUpdates() {
        return this.serverUpdates;
    }

    removeUsedServerUpdates() {
        this.serverUpdates.shift();
    }

    activatePlayer() {
        this.activate = true;
    }

    deactivatePlayer() {
        this.activate = false;
    }

    isPlayerActive() {
        return this.activate;
    }

    /**
     * To calculate how long the server is being running.
     * Literally, it is the time of how long the game is running (starting from GameState)
     * @returns {number} ms
     */
    getServerCurrentTime() {
        return this.serverStartTime + (Date.now() - this.gameStartTime) - this.gameRenderDelay;
    }

    getServerUrl() {
        return this.gameConfig.ioUrl;
    }

    getViewportSizes() {
        return this.viewportSizes;
    }

    getPlayerData() {
        return {
            playerId: this.playerId,
            roomId: this.roomId,
            name: this.name
        }
    }

    getJoysticrDir() {
        return this.joysticDir;
    }
}