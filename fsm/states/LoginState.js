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

    onPlayerInput(data) {
        this.stateMachine.target.loginPlayer(data, this.onPlayerLoggedin.bind(this));
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
