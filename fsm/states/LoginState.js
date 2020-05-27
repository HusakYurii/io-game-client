import { AbstractState } from "./AbstractState.js";

export class LoginState extends AbstractState {

    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super("LoginState", stateMachine);
    }

    onEnterState() {
        this.stateMachine.target.createLoginPopup(this.onPlayerInput.bind(this));
        
        window.dispatchEvent(new Event("resize")); // FIXME
    }

    onPlayerInput(inputs) {
        this.stateMachine.target.loginPlayer(this.onPlayerLoggedin.bind(this), inputs);
    }

    onPlayerLoggedin() {
        this.goToNextState("ShowAdsState");
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        this.stateMachine.target.removeLoginPopup();
        callback();
    }
}
