export class Model {
    constructor(gameConfig) {
        /*
         * General data
         */
        this.gameConfig = gameConfig;
        this.viewportSizes = {};
        this.isMobile = false;

        this.tapCounter = 0;
        this.doubleTapTime = 400;
        this.timeCounter = 0;

        /*
         * Data related to player, it is being sent each tick
         */
        this.playerId = "";
        this.roomId = "";
        this.name = "";
        this.mouseLastPos = { x: 0, y: 0 };
        this.activate = false;

        /*
         * Data related to server/render updates
         */
        this.gameStartTime = -1;
        this.gameRenderDelay = (1000 * 4) / 60 | 0;

        this.serverUpdates = [];
        this.serverStartTime = -1;
    }
    
    updateViewportSizes(data) {
        this.viewportSizes = data;
    }

    updateGameStartTime() {
        this.gameStartTime = Date.now();
    }

    updateUserData({ id, roomId, name } = {}) {
        this.playerId = id;
        this.roomId = roomId;
        this.name = name;
    }

    updateMouseLastPos(data) {
        this.mouseLastPos = { x: data.x, y: data.y };
    }

    setServerUpdates(data) {
        if (this.serverStartTime < 0) {
            this.serverStartTime = data.time;
        }

        this.serverUpdates.push(data);

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
        return this.serverUpdates.shift();
    }

    activateUser() {
        this.activate = true;
    }

    deactivateUser() {
        this.activate = false;
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

    getUserData() {
        return {
            playerId: this.playerId,
            roomId: this.roomId,
            name: this.name
        }
    }

    getMouseLastPos() {
        return this.mouseLastPos;
    }
}