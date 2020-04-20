import { AbstractState } from "./AbstractState.js";

export class PreloadState extends AbstractState {

    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super("PreloadState", stateMachine);
    }

    onEnterState() { }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        callback();
    }
}