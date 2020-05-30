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
        console.log("Disconnect in GameOverState");
    }

    restartGame() {
        this.fsm.game.cleanUpGame();
        /**
         * TODO  
         * At this point I do not have any user's data because game storage was cleaned up.
         * But a user is still in the game room and physics world on the server...
         */ 
        this.goToNextState("LoginState");
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