const { CONNECTION_CONSTANTS } = require("../../shared/Constants.js");

export class ConnectionManager {
    constructor(ClientIO, ioUrl) {
        this.ClientIO = ClientIO;
        this.connection = null;
        this.ioUrl = ioUrl;
    }

    init() {
        this.connection = this.ClientIO(this.ioUrl);
    }

    connectPlayer(callback) {
        if (!this.connection.connected) {
            this.connection.connect();
        }
        this.connection.emit(CONNECTION_CONSTANTS.CONNECT_PLAYER);
        this.connection.on(CONNECTION_CONSTANTS.PLAYER_CONNECTED, (payload) => {
            callback(JSON.parse(payload));
        });
    }

    loginPlayer(data, callback) {
        this.connection.emit(CONNECTION_CONSTANTS.LOGIN_PLAYER, JSON.stringify(data));
        this.connection.on(CONNECTION_CONSTANTS.PLAYER_LOGGEDIN, (payload) => {
            callback(JSON.parse(payload));
        });
    }

    onServerUpdates(callback) {
        this.connection.on(CONNECTION_CONSTANTS.SERVER_UPDATES, (payload) => {
            callback(JSON.parse(payload));
        });
    }

    onGameOver(callback) {
        this.connection.on(CONNECTION_CONSTANTS.GAME_OVER, callback);
    }

    offGameOver(callback) {
        this.connection.off(CONNECTION_CONSTANTS.GAME_OVER, callback);
    }

    onDisconnected(callback) {
        this.connection.on(CONNECTION_CONSTANTS.DISCONNECT, callback);
    }

    offDisconnected(callback) {
        this.connection.off(CONNECTION_CONSTANTS.DISCONNECT, callback);
    }

    sendPlayerUpdates(data) {
        this.connection.emit(CONNECTION_CONSTANTS.PLAYER_UPDATES, JSON.stringify(data));
    }

    disconnect() {
        this.connection.disconnect();
    }

    on(eventName, callback) {
        this.connection.on(eventName, callback);
    }

    off(eventName, callback) {
        this.connection.off(eventName, callback);
    }

    removeAllListeners() {
        this.connection.removeAllListeners();
    }
}