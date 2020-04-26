import { AbstractState } from "./AbstractState.js";

export class PreloadState extends AbstractState {

    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super("ShowAdsState", stateMachine);
    }

    onEnterState() {
        this.goToNextState("GameState");
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        callback();
    }
}