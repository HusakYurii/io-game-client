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
                
        this.fsm.game.getComponent("connectionManager")
            .onDisconnected(this.onDisconnect);

        this.fsm.game.getComponent("resizeManager")
            .resizeView();
    }

    onDisconnect() {
        console.log("Disconnect in LoginState");
    }

    onPlayerInput(inputs) {
        const { playerId } = this.fsm.game.storage.getPlayerData();
        const payload = { id: playerId, ...inputs };

        this.fsm.game.getComponent("connectionManager")
            .loginPlayer(payload, this.onPlayerLoggedin);
    }

    onPlayerLoggedin(data) {
        this.fsm.game.storage.updatePlayerData(data);
        this.goToNextState("ShowAdsState");
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        this.fsm.game.getComponent("connectionManager")
            .offDisconnected(this.onDisconnect);

        this.fsm.game.removeLoginPopup();
        callback();
    }
}
