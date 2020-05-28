import { AbstractState } from "./AbstractState.js";

export class GameOverState extends AbstractState {

    /**
     * @param {StateMachine} fsm 
     */
    constructor(fsm) {
        super("GameOverState", fsm);

        this.onDisconnect = this.onDisconnect.bind(this);
    }

    onEnterState() {
        this.fsm.game.createGameOverPopup(this.restartGame.bind(this));
        this.fsm.game.getComponent("connectionManager")
            .onDisconnected(this.onDisconnect);
    }

    onDisconnect() {
        console.log("Disconnect in GameOverState");
    }

    restartGame() {
        this.fsm.game.cleanUpGame();

        const cnManager = this.fsm.game.getComponent("connectionManager");
        cnManager.offDisconnected(this.onDisconnect);
        cnManager.disconnect();
        
        // TODO it is better to just send an event and say taht we want to remove a player from 
        // physics world and game room instead killing the connection

        // or show an add while connecting to the game - it is beetter
        //cnManager.connectPlayer(() => {
            //this.goToNextState("LoginState");
        //});
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        callback();
    }
}