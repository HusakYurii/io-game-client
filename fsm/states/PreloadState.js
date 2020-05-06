import { AbstractState } from "./AbstractState.js";
import { callAfter } from "../../../shared/Tools.js";

export class PreloadState extends AbstractState {

    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super("PreloadState", stateMachine);
    }

    onEnterState() {
        const { target } = this.stateMachine;
        const onLoaded = callAfter(2, this.onAllLoaded, [], this);
        target.loadGameAssets(onLoaded);
        target.connectPlayer(onLoaded);
    }

    onAllLoaded() {
        console.log("Aseets loaded and Player connected");
        this.goToNextState("LoginState");
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        callback();
    }
}