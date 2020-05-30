import { AbstractState } from "./AbstractState.js";

export class LoginState extends AbstractState {

    /**
     * @param {StateMachine} fsm 
     */
    constructor(fsm) {
        super("LoginState", fsm);

        this.onDisconnect = this.onDisconnect.bind(this);
        this.onPlayerLoggedin = this.onPlayerLoggedin.bind(this);
    }

    onEnterState() {
        this.fsm.game.createLoginPopup(this.onPlayerInput.bind(this));

        const cnManager = this.fsm.game.getComponent("connectionManager");
        cnManager.onDisconnected(this.onDisconnect);

        const rsManager = this.fsm.game.getComponent("resizeManager");
        rsManager.resizeView();
    }

    onDisconnect() {
        console.log("Disconnect in LoginState");
    }

    onPlayerInput(inputs) {
        const { playerId } = this.fsm.game.storage.getPlayerData();
        const payload = { id: playerId, ...inputs };

        const cnManager = this.fsm.game.getComponent("connectionManager");
        cnManager.loginPlayer(payload, this.onPlayerLoggedin);
    }

    onPlayerLoggedin(data) {
        this.fsm.game.storage.updatePlayerData(data);
        this.fsm.game.removeLoginPopup();
        
        this.goToNextState("ShowAdsState");
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        const cnManager = this.fsm.game.getComponent("connectionManager");
        cnManager.offDisconnected(this.onDisconnect);

        callback();
    }
}
