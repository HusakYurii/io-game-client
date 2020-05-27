import { Application } from "./libs/PixiCustomized.js";

import { Game, Storage, Scene } from "./game";
import { gameConfig } from "./configs";

const game = new Game();

game.setPixiApplication(new Application(gameConfig.application));
game.setStorage(new Storage(gameConfig));
game.setScene(new Scene());

import { ResizeManager } from "./libs/ResizeManager.js";
const resizeManager = new ResizeManager(game, gameConfig.application);

import { controlLayerConfig, gameLayerConfig, uiLayerConfig, backgroundLayerConfig } from "./configs";
import { BackgroundLayer, ControlLayer, GameLayer, UILayer } from "./game/layers";

game.setViewLayers([
    new BackgroundLayer(backgroundLayerConfig),
    new GameLayer(gameLayerConfig),
    new ControlLayer(controlLayerConfig),
    new UILayer(uiLayerConfig)
]);

import { StateMachine, GamePausedState, GameOverState, PreloadState, LoginState, GameState, ShowAdsState } from "./fsm";

const fsm = new StateMachine(game);
fsm.registrStates([
    new PreloadState(fsm),
    new LoginState(fsm),
    new ShowAdsState(fsm),
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