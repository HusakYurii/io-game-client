export class Controller {

    /**
     * @param {Model} model 
     * @param {View} view 
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.socket = {};
    }

    addSocket(socket) {
        this.socket = socket(this.model.gameConfig.ioUrl);
    }

    connectUser(callback) {
        this.socket.emit("connect-user");
        this.socket.on("user-connected", this.onUserConnected.bind(this, callback));
    }

    onUserConnected(callback, payload) {
        const parsed = JSON.parse(payload);
        this.model.playerId = parsed.id;
        callback();
    }
}