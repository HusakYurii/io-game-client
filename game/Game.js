import { TWEEN } from "../libs/Tween.js";

export class Game {
    constructor() {

        this.app = null;
        this.storage = null;
        this.scene = null;

        this.components = {};

        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onGameLoop = () => { };
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

    setViewLayers(layers) {
        this.scene.setLaters(layers);
    }

    loadGameAssets(callback) {
        this.app.loader.add(this.storage.gameConfig.sprites);

        this.app.loader.load((loader, resources) => {
            const parser = this.getComponent("resourcesParser");
            const parsedData = parser.parseResources(resources);
            this.scene.setTextures(parsedData);
            callback();
        });
    }

    onResize(sizes) {
        this.app.renderer.resize(sizes.width, sizes.height);
        this.storage.updateViewportSizes(sizes);
        this.scene.resizeScene(sizes);
    }

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