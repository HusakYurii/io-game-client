export class AbstractState {

    /**
     * @param {string} name - name of the state controller
     * @param {StateMachine} fsm 
     */
    constructor(name, fsm) {
        this.name = name;
        this.fsm = fsm;
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
        this.fsm.changeStateTo(stateName);
    }
}