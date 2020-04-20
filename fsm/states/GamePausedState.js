import { AbstractState } from "./AbstractState.js";

export class GamePausedState extends AbstractState {

    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super("GamePausedState", stateMachine);
    }

    onEnterState() { }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        callback();
    }
}