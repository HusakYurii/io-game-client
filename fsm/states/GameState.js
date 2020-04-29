import { AbstractState } from "./AbstractState.js";

export class GameState extends AbstractState {

    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super("GameState", stateMachine);
    }

    onEnterState() {
        this.stateMachine.target.setUpdatesConnection();
        this.stateMachine.target.startGameLoop();
        this.stateMachine.target.turnOnControls();
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        callback();
    }
}