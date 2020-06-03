import { AbstractState } from "./AbstractState.js";

export class GameOverState extends AbstractState {

    /**
     * @param {StateMachine} fsm 
     */
    constructor(fsm) {
        super("GameOverState", fsm);

        this.onDisconnect = this.onDisconnect.bind(this);
    }

    onEnterState() {
        this.fsm.game.createGameOverPopup(this.restartGame.bind(this));

        const cnManager = this.fsm.game.getComponent("connectionManager");
        cnManager.onDisconnected(this.onDisconnect);
    }

    onDisconnect() {
        this.goToNextState("DisconnectState");
    }

    restartGame() {
        const cnManager = this.fsm.game.getComponent("connectionManager");
        const { playerId } = this.fsm.game.storage.getPlayerData();

        cnManager.restartGame({ id: playerId }, (data) => {
            this.fsm.game.cleanUpGame();
            this.fsm.game.storage.updatePlayerData(data);
            
            this.goToNextState("LoginState");
        });
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        const cnManager = this.fsm.game.getComponent("connectionManager");
        cnManager.removeAllListeners();

        callback();
    }
}