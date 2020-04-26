import { AbstractState } from "./AbstractState.js";

export class ShowAdsState extends AbstractState {

    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super("ShowAdsState", stateMachine);
    }

    onEnterState() {
        window.setTimeout(this.onAdsWatched.bind(this), 500);
    }

    onAdsWatched() {
        this.goToNextState("GameState");
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        callback();
    }
}