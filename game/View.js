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
            .forEach((layer) => {
                layer.setTextures(textures);
            });
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
            .forEach((layer) => {
                layer.resize(sizes);
            });
    }

    getLayerByName(layerName) {
        return this.viewLayers[layerName];
    }

    createGameBackground() {
        this.getLayerByName("BackgroundLayer").createBackground();
    }

    createLoginPopup(callback) {
        this.getLayerByName("UILayer").createLoginPopup(callback);
    }

    removeLoginPopup() {
        this.getLayerByName("UILayer").removeLoginPopup();
    }

    turnOnControls(isMobile, onMove, onActivate) {
        this.getLayerByName("ControlLayer").setControls(isMobile, onMove, onActivate);
    }

    /**
     * 
     * @param {number} dt - delta time
     * @param {Model} gameModel - game model
     */
    updateLayers(dt, gameModel) {
        Object.values(this.viewLayers)
            .forEach((layer) => {
                layer.updateLayer(dt, gameModel)
            });
    }

    /**
     * let's pretend that this is a camera component. 
     * It will move world to a player's opposite side but set user's pos to be always at the center
     * @param {number} dt - delta time
     * @param {Model} gameModel 
     */
    updateCamera(dt, gameModel) {
        if (!gameModel.isGameStarted) {
            return;
        }

        /* To zoom view relative to a player */
        const minViewportSize = Math.min(gameModel.viewportSizes.width, gameModel.viewportSizes.height);
        const player = gameModel.getPlayer();

        this.checkBoundaries(minViewportSize, player.view.width);

        /* To move layers relative to a player */
        this.moveLayers(gameModel.getPlayerPos());
    }

    moveLayers({ from, to }) {
        this.getLayerByName("BackgroundLayer").move(from, to);
        this.getLayerByName("GameLayer").move(from, to);
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