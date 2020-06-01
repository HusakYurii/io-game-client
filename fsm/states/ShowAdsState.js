import { AbstractState } from "./AbstractState.js";

export class ShowAdsState extends AbstractState {

    /**
     * @param {StateMachine} fsm 
     */
    constructor(fsm) {
        super("ShowAdsState", fsm);
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