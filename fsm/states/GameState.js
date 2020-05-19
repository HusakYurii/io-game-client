import { AbstractState } from "./AbstractState.js";

export class GameState extends AbstractState {

    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super("GameState", stateMachine);

        this.onGameOver = this.onGameOver.bind(this);
    }

    onEnterState() {
        this.stateMachine.target.setUpdatesConnection(this.onGameOver);
        this.stateMachine.target.turnOnControls();
        this.stateMachine.target.startGameLoop();
    }

    onGameOver() {
        this.stateMachine.target.turnOffControls();
        this.stateMachine.target.setGameOverStatus();
        this.goToNextState("GameOverState");
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        callback();
    }
}