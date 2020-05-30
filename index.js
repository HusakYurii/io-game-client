import io from 'socket.io-client';

import { ConnectionManager } from "./libs/ConnectionManager.js";
import { ResourcesParser } from "./libs/ResourcesParser.js";
import { ResizeManager } from "./libs/ResizeManager.js";
import { Application } from "./libs/PixiCustomized.js";

import { Game, Storage, Scene } from "./game";
import { gameConfig } from "./configs";

const game = new Game();

game.setPixiApplication(new Application(gameConfig.application));
game.setStorage(new Storage(gameConfig));
game.setScene(new Scene());

game.addComponents([
    { name: "connectionManager", component: new ConnectionManager(io) },
    { name: "resourcesParser", component: new ResourcesParser(gameConfig) },
    { name: "resizeManager", component: new ResizeManager(game, gameConfig.application) },
]);

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

fsm.changeStateTo("PreloadState");

if (gameConfig.isDebuggerMode) {
    window.Game = game;
    window.FSM = fsm;
}