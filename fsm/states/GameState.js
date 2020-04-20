import { AbstractState } from "./AbstractState.js";

export class GameState extends AbstractState {

    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super("GameState", stateMachine);
    }

    onEnterState() { }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        callback();
    }
}