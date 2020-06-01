import ClientIO from 'socket.io-client';

import { ConnectionManager } from "./libs/ConnectionManager.js";
import { ResourcesParser } from "./libs/ResourcesParser.js";
import { ResizeManager } from "./libs/ResizeManager.js";
import { Camera } from "./libs/Camera.js";

import { Game } from "./game";
import { gameConfig } from "./configs";

const game = new Game(gameConfig);

const { ioUrl, application, assets, cameraSettings } = gameConfig;

game.addComponents([
    { name: "connectionManager", component: new ConnectionManager(ClientIO, ioUrl) },
    { name: "resizeManager", component: new ResizeManager(game, application) },
    { name: "resourcesParser", component: new ResourcesParser(assets) },
    { name: "camera", component: new Camera(cameraSettings) },
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
    window.GAME = game;
    window.FSM = fsm;
}