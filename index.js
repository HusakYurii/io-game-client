import { Game, Controller, Model, View } from "./game"
import { gameConfig } from "./configs";

const { application } = gameConfig;
const game = new Game(application, new Controller(new Model(gameConfig), new View()));

import { ResizeManager } from "./libs/ResizeManager.js";
const resizeManager = new ResizeManager(game, application);

import { controlLayerConfig, gameLayerConfig, uiLayerConfig, backgroundLayerConfig } from "./configs";
import { BackgroundLayer, ControlLayer, GameLayer, UILayer } from "./game/layers";

game.setViewLayers([
    new BackgroundLayer(backgroundLayerConfig),
    new GameLayer(gameLayerConfig),
    new ControlLayer(controlLayerConfig),
    new UILayer(uiLayerConfig)
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
resizeManager.resizeView();
fsm.changeStateTo("PreloadState");

if (gameConfig.isDebuggerMode) {
    window.Game = game;
    window.StateMachine = fsm;
}