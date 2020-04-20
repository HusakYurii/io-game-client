import { Game, Controller, Model, View } from "./game/index.js"
import { gameConfig } from "./configs/gameConfig.js";

const game = new Game({}, new Controller(new Model(gameConfig), new View()));

import { StateMachine, GamePausedState, GameOverState, PreloadState, LoginState, GameState } from "./fsm/index.js";

const fsm = new StateMachine(game);
fsm.registrStates([
    new PreloadState(fsm),
    new LoginState(fsm),
    new GameState(fsm),
    new GamePausedState(fsm),
    new GameOverState(fsm)
]);

game.init();

fsm.changeStateTo("PreloadState");

if(gameConfig.isDebuggerMode) {
    window.Game = game;
    window.StateMachine = fsm;
}

