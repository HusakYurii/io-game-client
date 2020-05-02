export class Model {
    constructor(gameConfig) {
        this.gameConfig = gameConfig;
        this.playerId = "";
        this.roomId = "";
        this.name = "";
        this.mouseLastPos = { x: 0, y: 0 };

        this.viewportSizes = {};
        this.gameStartTime = 0;
        this.serverUpdates = [];
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
        this.serverUpdates.push(data);
    }

    getServerUpdates() {
        return this.serverUpdates.shift();
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