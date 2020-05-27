import { TWEEN } from "../libs/Tween.js";

const { CONNECTION_CONSTANTS } = require("../../shared/Constants.js");

export class Game {
    constructor() {

        this.app = null;
        this.storage = null;
        this.scene = null;
        this.socket = null;

        this.components = {};

        this._onConnectionLost = () => { };

        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
    }

    /**
     * @param {PIXI.Application} app 
     */
    setPixiApplication(app) {
        this.app = app
    }

    /**
     * @param {Storage} storage 
     */
    setStorage(storage) {
        this.storage = storage;
    }

    /**
     * @param {Scene} scene 
     */
    setScene(scene) {
        this.scene = scene;
    }

    /**
     * @param {{[key: string]: Resource}} resources 
     */
    parseResources(resources) {
        const { assets = [], spritesheets = [] } = this.storage.gameConfig;
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

        return textures;
    }

    init() {
        this.initSocket(io);
        this.defineDevice();

        this.app.stage.addChild(this.scene.view);
        document.body.appendChild(this.app.view);
    }

    setViewLayers(layers) {
        this.scene.setLaters(layers);
    }

    loadGameAssets(callback) {
        this.app.loader.add(this.storage.gameConfig.assets);
        // this.loader.add(this.storage.gameConfig.spritesheets);

        this.app.loader.load(this.onAssetsLoaded.bind(this, callback));
    }

    onAssetsLoaded(callback, loader, resources) {
        const parsedData = this.parseResources(resources);
        this.scene.setTextures(parsedData);
        callback();
    }

    onResize(data) {
        this.app.renderer.resize(data.width, data.height);
        this.storage.updateViewportSizes(data);
        this.scene.resizeScene(data);
    }

    // ============== connection ===============
    initSocket(socket) {
        this.socket = socket(this.storage.getServerUrl());
    }

    setUpdatesConnection(callback) {
        this.storage.updateGameStartTime();
        this.socket.on(CONNECTION_CONSTANTS.SERVER_UPDATES, this.onServerUpdates.bind(this));
        this.socket.on(CONNECTION_CONSTANTS.GAME_OVER, callback);
    }

    sendPlayerUpdates(data) {
        this.socket.emit(CONNECTION_CONSTANTS.PLAYER_UPDATES, JSON.stringify(data));
    }

    onServerUpdates(payload) {
        const parsed = JSON.parse(payload);
        this.storage.setServerUpdates(parsed);
    }


    loginPlayer(callback, inputs) {
        const { playerId } = this.storage.getPlayerData();

        const playload = { id: playerId, ...inputs };

        this.socket.emit(CONNECTION_CONSTANTS.LOGIN_PLAYER, JSON.stringify(playload));
        this.socket.on(CONNECTION_CONSTANTS.PLAYER_LOGGEDIN, this.onPlayerLoggedin.bind(this, callback));
    }

    onPlayerLoggedin(callback, payload) {
        const parsed = JSON.parse(payload);
        this.storage.updatePlayerData(parsed);
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
        this.storage.updatePlayerData(parsed);
        callback();
    }

    set onConnectionLost(callback) {
        this._onConnectionLost = callback;
    }

    get onConnectionLost() {
        return this._onConnectionLost;
    }

    // ============== connection ===============

    setGameOverStatus() {
        this.storage.isGameOver = true;
    }

    cleanUpGame() {
        this.app.ticker.remove(this.gameLoop, this);
        this.scene.cleanUpCamera();
        this.scene.cleanUpLayers();
        this.storage.cleanUpData();
        TWEEN.removeAll();
    }

    createConnectionLostPopup(callback) {
        this.scene.createConnectionLostPopup(callback);
    }

    createGameOverPopup(callback) {
        this.scene.createGameOverPopup(callback);
    }

    createLoginPopup(callback) {
        this.scene.createLoginPopup(callback);
    }

    removeLoginPopup() {
        this.scene.removeLoginPopup();
    }

    createGameBackground() {
        this.scene.createGameBackground();
    }

    createGameWorld() {
        this.scene.createGameWorld();
    }

    turnOnControls() {
        this.scene.turnOnControls(this.onClick, this.onDoubleClick);
    }

    turnOffControls() {
        this.scene.turnOffControls();
    }

    onClick({ x, y }) {
        this.storage.setJoystickDir({
            x: Math.round(x),
            y: Math.round(y)
        });
    }

    onDoubleClick() {
        this.storage.activatePlayer();
    }

    preparePayload() {
        const mousePos = this.storage.getJoysticrDir();
        const playerData = this.storage.getPlayerData();
        const activate = this.storage.isPlayerActive();

        return { ...playerData, ...mousePos, activate };
    }

    startGameLoop() {
        this.app.ticker.add(this.gameLoop, this);
    }

    gameLoop(dt) {
        TWEEN.update(this.app.ticker.lastTime);

        this.scene.updateCamera(dt, this.storage);
        this.scene.updateLayers(dt, this.storage);

        this.storage.removeUsedServerUpdates();

        if (this.storage.isGameOver) {
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
        this.storage.deactivatePlayer();
    }

    defineDevice() {
        const userAgent = Game.getUserAgent();
        const regExpList = Game.getRegExpList();
        this.storage.isMobile = regExpList.some((regExp) => {
            return regExp.test(userAgent);
        });
    }
}

Game.getRegExpList = function () {
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

Game.getUserAgent = function () {
    return navigator.userAgent || navigator.vendor || window.opera || "";
};