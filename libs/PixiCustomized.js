/**
 * PixiJS Customize https://pixijs.io/customize/
 * All dependencies were added using a customized pixi bundle, because of that we need
 * to set up some 'flow for registration of plugins' by ourselves
 */

// Import Application class that is the main part of our PIXI project
import { Application } from '@pixi/app';

export * from '@pixi/sprite'; // Import Sprite to be used on stage
export * from '@pixi/display'; // Import Container to be used on stage
export * from '@pixi/sprite-animated';
export * from '@pixi/text';

// In order that PIXI could render things we need to register appropriate plugins in Renderer
import { Renderer } from '@pixi/core';
// BatchRenderer is the "plugin" for drawing sprites
import { BatchRenderer } from '@pixi/core';
// To enable sprites be interactive and use interaction API
import * as interaction from '@pixi/interaction';

Renderer.registerPlugin('batch', BatchRenderer);
Renderer.registerPlugin('interaction', interaction.InteractionManager);

// TickerPlugin is the plugin for running an update loop (it's for the application class)
import { TickerPlugin } from '@pixi/ticker';
Application.registerPlugin(TickerPlugin);

// Register Loader plugin in order to use it right from Application instance like app.loader.add(..) etc.
import { AppLoaderPlugin } from '@pixi/loaders';
Application.registerPlugin(AppLoaderPlugin);

// Register SpritesheetLoader on Loader plugins
import { Loader } from '@pixi/loaders';
import { SpritesheetLoader } from '@pixi/spritesheet';
Loader.registerPlugin(SpritesheetLoader);

// Import my features
import '../features/DisplayObject.js';

export {
    Application
}