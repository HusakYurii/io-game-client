import { AbstractState } from "./AbstractState.js";

export class LoginState extends AbstractState {

    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super("LoginState", stateMachine);
    }

    onEnterState() {
        this.stateMachine.target.createGameBackground();
        this.stateMachine.target.createLoginPopup(this.onUserInput.bind(this));
    }

    onUserInput(data) {
        this.stateMachine.target.loginUser(data, this.onUserLoggedin.bind(this));
    }

    onUserLoggedin() {
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
