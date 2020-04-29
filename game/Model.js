export class Model {
    constructor(gameConfig) {
        this.gameConfig = gameConfig;
        this.playerId = "";
        this.roomId = "";
        this.name = "";

        this.gameStartTime = 0;

        this.serverUpdates = [];
    }

    updateGameStartTime() {
        this.gameStartTime = Date.now();
    }

    updateUserData({ id, roomId, name } = {}) {
        this.playerId = id;
        this.roomId = roomId;
        this.name = name;
    }

    setServerUpdates(data) {
        this.serverUpdates.push(data);
    }

    getServerUpdates() {
        return this.serverUpdates.shift();
    }
}