export class Model {
    constructor(gameConfig) {
        this.gameConfig = gameConfig;
        this.playerId = "";
        this.roomId = "";
        this.name = "";

        this.serverUpdates = {};
    }

    updateUserData({ id, roomId, name } = {}) {
        this.playerId = id;
        this.roomId = roomId;
        this.name = name;
    }

    setServerUpdates(data) {
        this.serverUpdates = data;
    }

    getServerUpdates() {
        return this.serverUpdates;
    }
}