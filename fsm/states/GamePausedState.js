import { AbstractState } from "./AbstractState.js";

export class GamePausedState extends AbstractState {

    /**
     * @param {StateMachine} fsm 
     */
    constructor(fsm) {
        super("GamePausedState", fsm);
    }

    onEnterState() { }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        callback();
    }
}