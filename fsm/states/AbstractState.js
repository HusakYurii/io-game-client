export class AbstractState {

    /**
     * @param {string} name - name of the state controller
     * @param {StateMachine} stateMachine 
     */
    constructor(name, stateMachine) {
        this.name = name;
        this.stateMachine = stateMachine;
    }

    /**
     * @abstract
     */
    onEnterState() { }

    /**
     * @abstract
     */
    onExitState() { }

    /**
     * @param {string} stateName 
     */
    goToNextState(stateName) {
        this.stateMachine.changeStateTo(stateName);
    }
}