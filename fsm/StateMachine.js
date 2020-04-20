
export class StateMachine {

    /**
     * @param {object} target - target object to have control over 
     */
    constructor(target) {
        this.target = target;
        this.states = [];
        this.currentState = undefined;
        this.previousState = undefined;
    }

    /**
     * @param {string} name - state name
     */
    changeStateTo(name) {
        const onExitFinished = () => {
            const newState = this.getStateByName(name);
            newState.onEnterState();
            this.swapStates(newState);
        };

        if (this.currentState) {
            this.currentState.onExitState(onExitFinished);
        }
        else {
            onExitFinished();
        }
    }

    registrStates(states) {
        if (!Array.isArray(states)) {
            states = [states];
        }
        states.forEach((state) => this.states.push(state));
    }

    /**
     * @param {string} name - state name
     */
    getStateByName(name) {
        return this.states.find((state) => state.name === name);
    }

    swapStates(newState) {
        this.previousState = this.currentState;
        this.currentState = newState;
        StateMachine.log(this.currentState, this.previousState);
    }

    static log(currState, previousState) {
        console.log(`%c State was change!
            current state: ${currState && currState.name}
            previous state: ${previousState && previousState.name}`, 'color: white; background: black; font-size: 15px');
    }
}