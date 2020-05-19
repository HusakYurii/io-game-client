import { AbstractState } from "./AbstractState.js";

export class GameOverState extends AbstractState {

    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super("GameOverState", stateMachine);

        this.onRestartGame = this.onRestartGame.bind(this);
    }

    onEnterState() {
        this.stateMachine.target.createGameOverPopup(this.onRestartGame);
    }

    onRestartGame() {
        this.stateMachine.target.disconnectPlayer();
        this.stateMachine.target.removeGameOverPopup();
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