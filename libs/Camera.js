/**
 * TODO find a better solution 
 * This class is not the best solution but it 
 * works for now. It can be removed with the less refactoring of the game
 */
export class Camera {
    constructor({ ratiosToOccupy, cameraScls }) {

        this.ratiosToOccupy = ratiosToOccupy;
        this.cameraScls = cameraScls;

        this.propIdx = 0;
        this.maxIdx = Math.min(ratiosToOccupy.length, cameraScls.length);

        this.target = null;
        this.layersToMve = [];
    }

    init() {
        this.zoomLayers(this.cameraScls[this.propIdx]);
    }

    onResize(sizes) {
        this.zoomLayers(this.cameraScls[this.propIdx]);
    }

    resetCamera() {
        this.propIdx = 0;
        this.target = null;
        this.layersToMve = [];
    }

    setLayersToMove(layers) {
        layers.forEach((layer) => {
            this.layersToMve.push(layer);
        });
    }

    setTarget(target) {
        this.target = target;
    }

    /**
     * let's pretend that this is a camera component. 
     * It will move world to a player's opposite side but set user's pos to be always at the center
     * @param {number} dt - delta time
     * @param {Storage} storage 
     */
    updateCamera(dt, storage) {
        if (!storage.isGameStarted || storage.isGameOver) {
            return;
        }

        const playerData = storage.getPlayerData();
        const [serverUpdate] = storage.getServerUpdates();
        if (!serverUpdate) {
            return;
        }

        /* To move layers relative to a player */
        const player = serverUpdate.players.find((player) => {
            return player.id === playerData.playerId;
        });
        const newPos = { x: player.x * -1, y: player.y * -1 };
        this.moveLayers(newPos);
        this.moveTarget(newPos);

        /* To zoom view relative to a player */
        const playerWidth = player.r * 2;
        this.checkBoundaries(storage.viewportSizes, playerWidth);
    }

    checkBoundaries(viewportSizes, playerWidth) {
        const { width, height, scl } = viewportSizes;

        const minViewportSize = Math.min(width, height);
        const currScale = this.cameraScls[this.propIdx] * scl;
        const occupiedView = minViewportSize - (playerWidth * currScale);
        const needToZoom = occupiedView < (minViewportSize * this.ratiosToOccupy[this.propIdx]);

        if (needToZoom) {
            if (this.propIdx < this.maxIdx) {
                this.propIdx++;
            }
            this.zoomLayers(this.cameraScls[this.propIdx]);
        }
    }

    moveLayers(pos) {
        this.layersToMve.forEach((layer) => {
            layer.position.set(pos.x, pos.y);
        });
    }

    moveTarget(pos) {
        if (Camera.MODE === Camera.MODE_CENTER) {
            this.target && this.target.position.set(0, 0);
        }
    }

    zoomLayers(scl = 1) {
        this.layersToMve.forEach((layer) => {
            // FIXME It is not a good idea to use parent - think about changing hierachy  of 
            // these layers
            layer.parent.scale.set(scl, scl);
        });
    }
}

Camera.MODE = 0;
Camera.MODE_CENTER = 0;