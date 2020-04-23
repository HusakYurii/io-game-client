import { AbstractState } from "./AbstractState.js";

export class LoginState extends AbstractState {

    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super("LoginState", stateMachine);
    }

    onEnterState() {
        const { target } = this.stateMachine;

        target.createLoginPopup(this.onUserInput.bind(this));
    }

    onUserInput(data) {
        const { target } = this.stateMachine;
        target.loginUser(data, this.onUserLoggedin.bind(this));
    }

    onUserLoggedin() {
        
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        callback();
    }
}
