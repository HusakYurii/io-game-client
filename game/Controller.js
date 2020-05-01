export class Controller {

    /**
     * @param {Model} model 
     * @param {View} view 
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.socket = {};

        this.update = this.update.bind(this);
        this.onPlayerMove = this.onPlayerMove.bind(this);
        this.onPlayerClick = this.onPlayerClick.bind(this);
    }

    /**
     * @param {{[key: string]: Resource}} resources 
     */
    setViewResources(resources) {
        const { assets, spritesheets } = this.model.gameConfig;
        const textures = {};

        assets.forEach(({ name }) => {
            textures[name] = resources[name].texture
        });

        spritesheets.forEach(({ name }) => {
            Object.entries(resources[name].textures)
                .forEach(([key, texture]) => {
                    const [name] = key.split(".");
                    textures[name] = texture;
                });
        });

        this.view.setTextures(textures);
    }

    onResize(data) {
        this.model.updateViewportSizes(data);
        this.view.resize(data);
    }

    setViewLayers(layers) {
        this.view.setLaters(layers);
    }

    createLoginPopup(callback) {
        this.view.createLoginPopup(callback);
    }

    removeLoginPopup() {
        this.view.removeLoginPopup();
    }

    createGameBackground() {
        this.view.createGameBackground();
    }

    turnOnControls() {
        this.view.turnOnControls(this.onPlayerMove, this.onPlayerClick);
    }

    onPlayerMove(data) {
        const { playerId, roomId } = this.model.getUserData();
        const { x, y } = data.data.getLocalPosition(this.view);
        this.sendUserUpdates({playerId, roomId, x, y});
    }

    onPlayerClick(data) {
        console.log("click");
    }

    update(dt) {
        this.view.updateGameLayer(this.model);
    }

    // ============== connection ===============
    initSocket(socket) {
        this.socket = socket(this.model.getServerUrl());
    }

    setUpdatesConnection() {
        this.model.updateGameStartTime();
        this.socket.on('server-updates', this.onServerUpdates.bind(this));
    }

    sendUserUpdates(data) {
        this.socket.emit("user-updates", JSON.stringify(data));
    }

    onServerUpdates(payload) {
        const parsed = JSON.parse(payload);

        const { playerId } = this.model.getUserData();

        const playerUpdates = parsed.players.toUpdate
            .find((data) => data.id === playerId);

        this.model.updateUserPos(playerUpdates);
        this.model.setServerUpdates(parsed);
    }


    loginUser(data, callback) {
        const { playerId } = this.model.getUserData();

        const playload = { id: playerId, ...data };

        this.socket.emit("login-user", JSON.stringify(playload));
        this.socket.on("user-loggedin", this.onUserLoggedin.bind(this, callback));
    }

    onUserLoggedin(callback, payload) {
        const parsed = JSON.parse(payload);
        this.model.updateUserData(parsed);
        callback();
    }

    connectUser(callback) {
        this.socket.emit("connect-user");
        this.socket.on("user-connected", this.onUserConnected.bind(this, callback));
    }

    onUserConnected(callback, payload) {
        const parsed = JSON.parse(payload);
        this.model.updateUserData(parsed);
        callback();
    }
}