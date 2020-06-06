import { CONNECTION_CONSTANTS } from "./Shared.js";

export class ConnectionManager {
    constructor(ClientIO, ioUrl) {
        this.ClientIO = ClientIO;
        this.ioUrl = ioUrl;

        this.connection = null;
    }

    connectPlayer(callback) {
        this.connection = this.ClientIO(this.ioUrl);
        this.once(CONNECTION_CONSTANTS.PLAYER_CONNECTED, (payload) => {
            callback(JSON.parse(payload));
        });
    }

    loginPlayer(data, callback) {
        this.emit(CONNECTION_CONSTANTS.LOGIN_PLAYER, data);
        this.once(CONNECTION_CONSTANTS.PLAYER_LOGGEDIN, (payload) => {
            callback(JSON.parse(payload));
        });
    }

    onServerUpdates(callback) {
        this.on(CONNECTION_CONSTANTS.SERVER_UPDATES, (payload) => {
            callback(JSON.parse(payload));
        });
    }

    sendPlayerUpdates(data) {
        this.emit(CONNECTION_CONSTANTS.PLAYER_UPDATES, data);
    }

    restartGame(data, callback) {
        this.emit(CONNECTION_CONSTANTS.RESTART_GAME, data);
        this.once(CONNECTION_CONSTANTS.GAME_RESTARTED, (payload) => {
            callback(JSON.parse(payload));
        });
    }

    /**
     * Functions below are used as helpers for different scenarios
     */
    onGameOver(callback) {
        this.once(CONNECTION_CONSTANTS.GAME_OVER, callback);
    }

    offGameOver(callback) {
        this.off(CONNECTION_CONSTANTS.GAME_OVER, callback);
    }

    onDisconnected(callback) {
        this.once(CONNECTION_CONSTANTS.DISCONNECT, callback);
    }

    offDisconnected(callback) {
        this.off(CONNECTION_CONSTANTS.DISCONNECT, callback);
    }

    disconnect() {
        this.connection.disconnect();
    }

    emit(eventName, data = {}) {
        this.connection.emit(eventName, JSON.stringify(data));
    }

    once(eventName, callback) {
        this.connection.once(eventName, callback);
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