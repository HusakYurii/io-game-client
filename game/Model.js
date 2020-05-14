export class Model {
    constructor(gameConfig) {
        /*
         * General data
         */
        this.gameConfig = gameConfig;
        this.viewportSizes = {};
        this.isMobile = false;
        this.isGameStarted = false;

        this.tapCounter = 0;
        this.doubleTapTime = 400;
        this.timeCounter = 0;

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
        this.playerDir = { x: 0, y: 0 };
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

    updatePlayerData({ id, roomId, name } = {}) {
        this.playerId = id;
        this.roomId = roomId;
        this.name = name;
    }

    updatePlayerDir(data) {
        this.playerDir = { x: data.x, y: data.y };
    }

    updatePlayerPos() {
        const find = (list, id) => list.find((item) => item.id === id);

        const [curr, next] = this.serverUpdates;
        let currPos, nextPos;

        if (curr && next) {
            currPos = find(curr.players, this.playerId);
            nextPos = find(next.players, this.playerId);
        }
        else if (curr && !next) {
            currPos = find(curr.players, this.playerId);
            nextPos = { ...currPos };
        }
        else {
            return;
        }
        this.playerPos.from = { x: currPos.x, y: currPos.y };
        this.playerPos.to = { x: nextPos.x, y: nextPos.y };
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
     * Reset player pos back to 0, to make camera effect while game and bg are moving
     */
    resetPlayerPos() {
        if (!this.player) {
            return;
        }

        this.player.position.set(0, 0);
    }

    hasPlayer() {
        return !!this.player
    }

    setPlayer(player) {
        this.player = player;
    }

    getPlayer() {
        return this.player;
    }

    getServerUpdates() {
        return this.serverUpdates.shift();
    }

    activatePlayer() {
        this.activate = true;
    }

    deactivatePlayer() {
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

    getPlayerData() {
        return {
            playerId: this.playerId,
            roomId: this.roomId,
            name: this.name
        }
    }

    getPlayerPos() {
        return this.playerPos;
    }

    getPlayerDir() {
        return this.playerDir;
    }
}