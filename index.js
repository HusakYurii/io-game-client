import ClientIO from 'socket.io-client';

import { ConnectionManager } from "./libs/ConnectionManager.js";
import { ResourcesParser } from "./libs/ResourcesParser.js";
import { ResizeManager } from "./libs/ResizeManager.js";
import { Camera } from "./libs/Camera.js";

import { Game } from "./game";
import { gameConfig } from "./configs";

const game = new Game(gameConfig);

const { prodUrl, devUrl, application, assets, cameraSettings } = gameConfig;
const currUrl = gameConfig.isDevMode ? devUrl : prodUrl;

game.addComponents([
    { name: "connectionManager", component: new ConnectionManager(ClientIO, currUrl) },
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

import { StateMachine, GamePausedState, GameOverState, PreloadState, LoginState, GameState, ShowAdsState, DisconnectState } from "./fsm";

const fsm = new StateMachine(game);
fsm.registrStates([
    new PreloadState(fsm),
    new LoginState(fsm),
    new ShowAdsState(fsm),
    new GameState(fsm),
    new GamePausedState(fsm),
    new GameOverState(fsm),
    new DisconnectState(fsm)
]);

fsm.changeStateTo("PreloadState");

if (gameConfig.isDevMode) {
    window.GAME = game;
    window.FSM = fsm;

    const stats = function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); };
    stats();
}