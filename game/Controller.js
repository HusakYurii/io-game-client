const { CONNECTION_CONSTANTS } = require("../../shared/Constants.js");
import { TWEEN } from "../libs/Tween.js";

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

    createGameOverPopup(callback) {
        this.view.createGameOverPopup(callback);
    }

    removeGameOverPopup() {
        this.view.removeGameOverPopup();
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

    createGameWorld() {
        this.view.createGameWorld();
    }

    turnOnControls() {
        this.view.turnOnControls(this.onClick, this.onDoubleClick);
    }

    turnOffControls() {
        this.view.turnOffControls();
    }

    setGameOverStatus() {
        this.model.isGameOver = true;
    }

    onClick({ x, y }) {
        this.model.setJoystickDir({
            x: Math.round(x),
            y: Math.round(y)
        });
    }

    onDoubleClick() {
        this.model.activatePlayer();
    }

    preparePayload() {
        const mousePos = this.model.getJoysticrDir();
        const playerData = this.model.getPlayerData();
        const activate = this.model.isPlayerActive();

        return { ...playerData, ...mousePos, activate };
    }

    cleanUpGame() {
        this.view.cleanUpCamera();
        this.view.cleanUpLayers();
        this.model.cleanUpData();
        TWEEN.removeAll();
    }

    update(ticker, dt) {
        TWEEN.update(ticker.lastTime);

        this.view.updateCamera(dt, this.model);
        this.view.updateLayers(dt, this.model);

        this.model.removeUsedServerUpdates();

        if (this.model.isGameOver) {
            return;
        }

        /*
         * All Player last actions are being sent once at the tick
         * It also helps to avoid data overloading
         */
        this.sendPlayerUpdates(this.preparePayload());
        /* 
         * after sending data, deactivate player gravity state
         */
        this.model.deactivatePlayer();
    }

    // ============== connection ===============
    initSocket(socket) {
        this.socket = socket(this.model.getServerUrl());
    }

    setUpdatesConnection(callback) {
        this.model.updateGameStartTime();
        this.socket.on(CONNECTION_CONSTANTS.SERVER_UPDATES, this.onServerUpdates.bind(this));
        this.socket.on(CONNECTION_CONSTANTS.GAME_OVER, callback);
    }

    sendPlayerUpdates(data) {
        this.socket.emit(CONNECTION_CONSTANTS.PLAYER_UPDATES, JSON.stringify(data));
    }

    onServerUpdates(payload) {
        const parsed = JSON.parse(payload);
        this.model.setServerUpdates(parsed);
    }


    loginPlayer(data, callback) {
        const { playerId } = this.model.getPlayerData();

        const playload = { id: playerId, ...data };

        this.socket.emit(CONNECTION_CONSTANTS.LOGIN_PLAYER, JSON.stringify(playload));
        this.socket.on(CONNECTION_CONSTANTS.PLAYER_LOGGEDIN, this.onPlayerLoggedin.bind(this, callback));
    }

    onPlayerLoggedin(callback, payload) {
        const parsed = JSON.parse(payload);
        this.model.updatePlayerData(parsed);
        callback();
    }

    connectPlayer(callback) {
        if (!this.socket.connected) {
            this.socket.connect();
        }
        this.socket.emit(CONNECTION_CONSTANTS.CONNECT_PLAYER);
        this.socket.on(CONNECTION_CONSTANTS.PLAYER_CONNECTED, this.onPlayerConnected.bind(this, callback));
    }

    disconnectPlayer() {
        this.socket.close();
        this.socket.removeAllListeners();
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
