import { AbstractState } from "./AbstractState.js";

export class GameState extends AbstractState {

    /**
     * @param {StateMachine} fsm 
     */
    constructor(fsm) {
        super("GameState", fsm);

        this.onDisconnect = this.onDisconnect.bind(this);
        this.onGameOver = this.onGameOver.bind(this);
        this.onUpdates = this.onUpdates.bind(this);
        this.sendData = this.sendData.bind(this);
    }

    onEnterState() {
        const cnManager = this.fsm.game.getComponent("connectionManager");
        cnManager.onServerUpdates(this.onUpdates);
        cnManager.onDisconnected(this.onDisconnect);
        cnManager.onGameOver(this.onGameOver);
        
        
        this.fsm.game.storage.updateGameStartTime();
        this.fsm.game.onGameLoop = this.sendData;
        this.fsm.game.turnOnControls();
        this.fsm.game.startGameLoop();
        this.fsm.game.initCamera();
    }

    /*
     * All Player's last actions are being sent once at the tick
     * It also helps to avoid data overloading
     */
    sendData() {
        const payload = this.fsm.game.preparePayload();

        const cnManager = this.fsm.game.getComponent("connectionManager");
        cnManager.sendPlayerUpdates(payload);
    }

    onUpdates(data) {
        this.fsm.game.storage.setServerUpdates(data);
    }

    onDisconnect() {
        console.log("Disconnect in GameState");
    }

    onGameOver() {
        this.fsm.game.turnOffControls();
        this.fsm.game.setGameOverStatus();
        this.goToNextState("GameOverState");
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        const cnManager = this.fsm.game.getComponent("connectionManager");
        cnManager.offDisconnected(this.onDisconnect);
        cnManager.offGameOver(this.onGameOver);
        callback();
    }
}