import { Container } from "../libs/PixiCustomized.js";

export class View extends Container {
    constructor() {
        super();
        this.viewTextures = {};
        this.viewLayers = {};
        this.sortableChildren = true;
        this.ratiosAllowedToOccupy = [0.8, 0.75, 0.7, 0.65, 0.6, 0.5, 0.45, 0.4];
        this.cameraAdjustmentScls = [1.55, 1.4, 1.3, 1.15, 1, 0.8, 0.7, 0.6, 0.5, 0.45];
    }

    /**
     * @param {{[key: string]: Texture}[]} textures 
     */
    setTextures(textures) {
        Object.values(this.viewLayers)
            .forEach((layer) => layer.setTextures(textures));
    }

    /**
     * @param {PIXI.Container[]} layers 
     */
    setLaters(layers) {
        layers.forEach((layer) => {
            this.viewLayers[layer.name] = layer;
            this.addChild(layer);
        });
    }

    resize(sizes) {
        const { scl, width, height } = sizes;
        this.position.set(width / 2, height / 2);
        this.scale.set(scl);

        this.zoomLayers(this.cameraAdjustmentScls[0]);

        Object.values(this.viewLayers)
            .forEach((layer) => layer.resize(sizes));
    }

    cleanUpLayers() {
        Object.values(this.viewLayers)
            .forEach((layer) => layer.cleanupLayer());
    }

    cleanUpCamera() {
        this.moveLayers({ from: { x: 0, y: 0 }, to: { x: 0, y: 0 } });
        this.ratiosAllowedToOccupy = [0.8, 0.75, 0.7, 0.65, 0.6, 0.5, 0.45, 0.4];
        this.cameraAdjustmentScls = [1.55, 1.4, 1.3, 1.15, 1, 0.8, 0.7, 0.6, 0.5, 0.45];
    }

    getLayerByName(layerName) {
        return this.viewLayers[layerName];
    }

    createGameBackground() {
        this.getLayerByName("BackgroundLayer").createBackground();
    }

    createGameWorld() {
        this.getLayerByName("GameLayer").createGameWorld();
    }

    createConnectionLostPopup(callback) {
        this.getLayerByName("UILayer").createConnectionLostPopup(callback);
    }

    createGameOverPopup(callback) {
        this.getLayerByName("UILayer").createGameOverPopup(callback);
    }

    createLoginPopup(callback) {
        this.getLayerByName("UILayer").createLoginPopup(callback);
    }

    removeLoginPopup() {
        this.getLayerByName("UILayer").removeLoginPopup();
    }

    turnOnControls(onMove, onActivate) {
        this.getLayerByName("ControlLayer").setControls(onMove, onActivate);
    }

    turnOffControls() {
        this.getLayerByName("ControlLayer").removeControls();
    }

    /**
     * 
     * @param {number} dt - delta time
     * @param {Model} gameModel - game model
     */
    updateLayers(dt, gameModel) {
        Object.values(this.viewLayers)
            .forEach((layer) => layer.updateLayer(dt, gameModel));
    }

    /**
     * let's pretend that this is a camera component. 
     * It will move world to a player's opposite side but set user's pos to be always at the center
     * @param {number} dt - delta time
     * @param {Model} gameModel 
     */
    updateCamera(dt, gameModel) {
        if (!gameModel.isGameStarted || gameModel.isGameOver) {
            return;
        }

        const playerData = gameModel.getPlayerData();
        const [serverUpdate] = gameModel.getServerUpdates();
        if (!serverUpdate) {
            return;
        }

        const { x, y, r } = serverUpdate.players.find((player) => {
            return player.id === playerData.playerId;
        });
        const newPos = { x: x * -1, y: y * -1 };
        const playerWidth = r * 2;

        /* To zoom view relative to a player */
        const minViewportSize = Math.min(gameModel.viewportSizes.width, gameModel.viewportSizes.height);
        this.checkBoundaries(minViewportSize, playerWidth);

        /* To move layers relative to a player */
        this.moveLayers(newPos);
    }

    moveLayers(newPos) {
        this.getLayerByName("BackgroundLayer").move(newPos);
        this.getLayerByName("GameLayer").move(newPos);
    }

    checkBoundaries(minViewportSize, playerWidth) {
        /* the same as player.worldTransform.a you can use any of this ways */
        const currScale = this.cameraAdjustmentScls[0] * this.scale.x;
        const occupiedView = minViewportSize - (playerWidth * currScale);
        const needToZoom = occupiedView < minViewportSize * this.ratiosAllowedToOccupy[0];

        if (needToZoom) {
            if (this.ratiosAllowedToOccupy.length > 1) {
                this.ratiosAllowedToOccupy.shift();
            }

            if (this.cameraAdjustmentScls.length > 1) {
                this.cameraAdjustmentScls.shift();
            }

            this.zoomLayers(this.cameraAdjustmentScls[0]);
        }
    }

    zoomLayers(scl = 1) {
        this.getLayerByName("BackgroundLayer").scale.set(scl);
        this.getLayerByName("GameLayer").scale.set(scl);
    }
}