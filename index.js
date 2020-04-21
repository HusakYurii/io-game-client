import { Game, Controller, Model, View } from "./game"
import { gameConfig } from "./configs";

const game = new Game({}, new Controller(new Model(gameConfig), new View()));

import { BackgroundLayer, ControlLayer, GameLayer, UILayer } from "./game/layers";

game.setViewLayers([
    new BackgroundLayer(0),
    new GameLayer(1),
    new ControlLayer(2),
    new UILayer(3)
]);

import { StateMachine, GamePausedState, GameOverState, PreloadState, LoginState, GameState } from "./fsm";

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

if (gameConfig.isDebuggerMode) {
    window.Game = game;
    window.StateMachine = fsm;
}