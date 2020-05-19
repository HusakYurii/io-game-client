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
        const onLoaded = callAfter(2, this.onAllLoaded, [], this);
        this.stateMachine.target.loadGameAssets(onLoaded);
        this.stateMachine.target.connectPlayer(onLoaded);
    }

    onAllLoaded() {
        this.goToNextState("LoginState");
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        this.stateMachine.target.createGameBackground();
        this.stateMachine.target.createGameWorld();
        callback();
    }
}