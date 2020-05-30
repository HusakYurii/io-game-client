import { AbstractState } from "./AbstractState.js";
import { callAfter } from "../../../shared/Tools.js";

export class PreloadState extends AbstractState {

    /**
     * @param {StateMachine} fsm 
     */
    constructor(fsm) {
        super("PreloadState", fsm);
    }

    onEnterState() {
        const onLoaded = callAfter(2, this.onAllLoaded, [], this);

        this.fsm.game.init();
        this.fsm.game.loadGameAssets(onLoaded);

        const cnManager = this.fsm.game.getComponent("connectionManager");
        cnManager.init(this.fsm.game.storage.getServerUrl());
        cnManager.connectPlayer((data) => {
            this.fsm.game.storage.updatePlayerData(data);
            onLoaded();
        });
    }

    onAllLoaded() {
        /*
         * Create this sprites here because when game is restarted
         * it will go to LoginState. So we do not need to create beackgrounds once more
         */
        this.fsm.game.createGameBackground();
        this.fsm.game.createGameWorld();

        this.goToNextState("LoginState");
    }

    /**
     * @param {function} callback 
     */
    onExitState(callback) {
        callback();
    }
}