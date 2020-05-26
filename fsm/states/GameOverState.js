import { AbstractState } from "./AbstractState.js";

export class GameOverState extends AbstractState {

    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super("GameOverState", stateMachine);
    }

    onEnterState() {
        this.stateMachine.target.createGameOverPopup(this.restartGame.bind(this));
    }

    restartGame() {
        this.stateMachine.target.disconnectPlayer();
        this.stateMachine.target.cleanUpGame();

        this.stateMachine.target.connectPlayer(() => {
            this.goToNextState("LoginState");
        });
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        callback();
    }
}