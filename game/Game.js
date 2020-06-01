import { Application } from "../libs/PixiCustomized.js";
import { TWEEN } from "../libs/Tween.js";

import { Storage } from "./Storage.js";
import { Scene } from "./Scene.js";

export class Game {
    constructor(config) {

        this.app = new Application(config.application);
        this.storage = new Storage();
        this.scene = new Scene();

        this.config = config;

        this.components = {};

        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onGameLoop = () => { };
    }

    addComponents(components) {
        components.forEach(({ name, component }) => {
            this.components[name] = component;
        });
    }

    getComponent(name) {
        return this.components[name];
    }

    init() {
        this.storage.isMobile = this.defineDevice();

        this.app.stage.addChild(this.scene.view);
        document.body.appendChild(this.app.view);
    }

    initCamera() {
        const bgLayer = this.scene.getLayer("BackgroundLayer");
        const gameLayer = this.scene.getLayer("GameLayer");

        this.components.camera.setLayersToMove([
            bgLayer.gameWorldBg,
            gameLayer.gameWorld,
            gameLayer.cameraBounds
        ]);
        this.components.camera.init();
    }

    setViewLayers(layers) {
        this.scene.setLaters(layers);
    }

    loadGameAssets(callback) {
        this.app.loader.add(this.config.assets.sprites);

        this.app.loader.load((loader, resources) => {
            const parser = this.getComponent("resourcesParser");
            const parsedData = parser.parseResources(resources);
            this.scene.setTextures(parsedData);
            callback();
        });
    }

    onResize(sizes) {
        this.app.renderer.resize(sizes.width, sizes.height);
        this.components.camera.onResize(sizes);
        this.storage.setViewportSizes(sizes);
        this.scene.resizeScene(sizes);
    }

    setGameOverStatus() {
        this.storage.isGameOver = true;
    }

    /**
     * In case if game was NOT disconnected reset storage softly,
     * because socket is still connected
     * @param {boolean} isDisconnected 
     */
    cleanUpGame(isDisconnected = false) {
        this.app.ticker.remove(this.gameLoop, this);
        this.components.camera.resetCamera();
        this.scene.cleanUpLayers();
        TWEEN.removeAll();

        /**
         * FIXME  This is not the best solution!
         */
        let playerId = "";
        if (!isDisconnected) {
            playerId = this.storage.playerId;
        }
        this.storage = new Storage();
        this.storage.updatePlayerData({ id: playerId });
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
        const joysticrDir = this.storage.getJoysticrDir();
        const playerData = this.storage.getPlayerData();
        const activate = this.storage.isPlayerActived();

        return { ...playerData, ...joysticrDir, activate };
    }

    startGameLoop() {
        this.app.ticker.add(this.gameLoop, this);
    }

    gameLoop(dt) {
        TWEEN.update(this.app.ticker.lastTime);

        this.scene.updateLayers(dt, this.storage);

        this.components.camera.setTarget(this.storage.getPlayer());
        this.components.camera.updateCamera(dt, this.storage);

        this.storage.removeUsedServerUpdates();

        if (this.storage.isGameOver) {
            return;
        }

        /**
         * Call callback which is set by FSM to process game data
         */
        this.onGameLoop();

        /* 
         * After sending data, deactivate player gravity state
         * to avoid sending it one more time
         */
        this.storage.deactivatePlayer();
    }

    defineDevice() {
        const userAgent = Game.getUserAgent();
        const regExpList = Game.getRegExpList();
        return regExpList.some((regExp) => {
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