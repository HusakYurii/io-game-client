
const { GAME_CONSTANTS } = require("../../shared/Constants.js");
const { WORLD_WIDTH, WORLD_HEIGTH } = GAME_CONSTANTS;

export const backgroundLayerConfig = {
    layerName: "BackgroundLayer",
    layerIndex: 0,
    background: [{
        type: "Sprite",
        name: "background",
        pictureName: "background",
        modifiers: {
            anchor: { x: 0.5, y: 0.5 },
            width: WORLD_WIDTH,
            height: WORLD_HEIGTH
        }
    }]
};