
export class Controller {

    /**
     * @param {Model} model 
     * @param {View} view 
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.socket = {};

        this.interactionManager = {};

        this.update = this.update.bind(this);

        this.onTap = this.onTap.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
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

    defineDevice() {
        const userAgent = Controller.getUserAgent();
        const regExpList = Controller.getRegExpList();
        this.model.isMobile = regExpList.some((regExp) => {
            return regExp.test(userAgent);
        });
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
        const { isMobile } = this.model;
        this.view.turnOnControls(
            isMobile,
            (isMobile ? this.onTap : this.onClick),
            this.onDoubleClick
        );
    }

    onTap(event) {
        this.model.tapCounter += 1;
        this.model.updatePlayerDir(this.processClickPos(event));
    }

    onClick(event) {
        this.model.updatePlayerDir(this.processClickPos(event));
    }

    processClickPos(event) {
        const { x, y } = event.data.getLocalPosition(this.view);
        return {
            x: Math.round(x),
            y: Math.round(y)
        }
    }

    onDoubleClick() {
        this.model.activatePlayer();
    }

    preparePayload() {
        const mousePos = this.model.getPlayerDir();
        const playerData = this.model.getPlayerData();
        const activate = this.model.activate;
        this.model.deactivatePlayer();

        return { ...playerData, ...mousePos, activate };
    }

    update(dt) {
        this.view.updateGameLayer(this.model);

        this.updateTapData(dt * (1000 / 60));

        /*
         * All Player last actions are being sent once at the tick
         * It also helps to avoid data overloading
         */
        this.sendPlayerUpdates(this.preparePayload());
    }

    /**
     * As a Player has tapped on the screen, start measuring the time.
     * If by the time the timer has reached doubleTapTime the Player has tapped twice or more -
     * we can consider it as a double tap
     * @param {number} delta ms
     */
    updateTapData(delta) {
        if (this.model.tapCounter !== 0) {
            this.model.timeCounter += delta;
            if (this.model.timeCounter >= this.model.doubleTapTime) {
                if (this.model.tapCounter >= 2) {
                    this.model.activatePlayer();
                }
                this.model.tapCounter = 0;
                this.model.timeCounter = 0;
            }
        }
    }

    // ============== connection ===============
    initSocket(socket) {
        this.socket = socket(this.model.getServerUrl());
    }

    setUpdatesConnection() {
        this.model.updateGameStartTime();
        this.socket.on('server-updates', this.onServerUpdates.bind(this));
    }

    sendPlayerUpdates(data) {
        this.socket.emit("player-updates", JSON.stringify(data));
    }

    onServerUpdates(payload) {
        const parsed = JSON.parse(payload);

        this.model.setServerUpdates(parsed);
    }


    loginPlayer(data, callback) {
        const { playerId } = this.model.getPlayerData();

        const playload = { id: playerId, ...data };

        this.socket.emit("login-player", JSON.stringify(playload));
        this.socket.on("player-loggedin", this.onPlayerLoggedin.bind(this, callback));
    }

    onPlayerLoggedin(callback, payload) {
        const parsed = JSON.parse(payload);
        this.model.updatePlayerData(parsed);
        callback();
    }

    connectPlayer(callback) {
        this.socket.emit("connect-player");
        this.socket.on("player-connected", this.onPlayerConnected.bind(this, callback));
    }

    onPlayerConnected(callback, payload) {
        const parsed = JSON.parse(payload);
        this.model.updatePlayerData(parsed);
        callback();
    }
}

Controller.getRegExpList = function () {
    return [
        new RegExp(/Android/i),
        new RegExp(/webOS/i),
        new RegExp(/iPhone/i),
        new RegExp(/iPad/i),
        new RegExp(/iPod/i),
        new RegExp(/BlackBerry/i),
        new RegExp(/Windows Phone/i)
    ]
};

Controller.getUserAgent = function () {
    return navigator.userAgent || navigator.vendor || window.opera || "";
};
