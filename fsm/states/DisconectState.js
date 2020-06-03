import { AbstractState } from "./AbstractState.js";

export class DisconnectState extends AbstractState {

    /**
     * @param {StateMachine} fsm 
     */
    constructor(fsm) {
        super("DisconnectState", fsm);

        this.onReconnected = this.onReconnected.bind(this);
    }

    onEnterState() {
        const cnManager = this.fsm.game.getComponent("connectionManager");
        cnManager.removeAllListeners();
        cnManager.disconnect();

        this.fsm.game.createConnectionLostPopup(this.onReconnected);
    }

    onReconnected() {
        const cnManager = this.fsm.game.getComponent("connectionManager");
        cnManager.connectPlayer((data) => {
            this.fsm.game.cleanUpGame();
            this.fsm.game.storage.updatePlayerData(data);
            
            this.goToNextState("LoginState");
        });
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        callback();
    }
}