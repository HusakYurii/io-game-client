
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
        this.model.updateMouseLastPos(this.processClickPos(event));
    }

    onClick(event) {
        this.model.updateMouseLastPos(this.processClickPos(event));
    }

    processClickPos(event) {
        const { x, y } = event.data.getLocalPosition(this.view);
        return {
            x: Math.round(x),
            y: Math.round(y)
        }
    }

    onDoubleClick() {
        this.model.activateUser();
    }

    preparePayload() {
        const mousePos = this.model.getMouseLastPos();
        const playerData = this.model.getUserData();
        const activate = this.model.activate;
        this.model.deactivateUser();

        return { ...playerData, ...mousePos, activate };
    }

    update(dt) {
        this.view.updateGameLayer(this.model);

        this.updateTapData(dt * (1000 / 60));

        /*
         * All user last actions are being sent once at the tick
         * It also helps to avoid data overloading
         */
        this.sendUserUpdates(this.preparePayload());
    }

    /**
     * As a user has tapped on the screen, start measuring the time.
     * If by the time the timer has reached doubleTapTime the user has tapped twice or more -
     * we can consider it as a double tap
     * @param {number} delta ms
     */
    updateTapData(delta) {
        if (this.model.tapCounter !== 0) {
            this.model.timeCounter += delta;
            if (this.model.timeCounter >= this.model.doubleTapTime) {
                if (this.model.tapCounter >= 2) {
                    this.model.activateUser();
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

    sendUserUpdates(data) {
        this.socket.emit("user-updates", JSON.stringify(data));
    }

    onServerUpdates(payload) {
        const parsed = JSON.parse(payload);

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
