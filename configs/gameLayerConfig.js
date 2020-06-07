export const gameLayerConfig = {
    layerName: "GameLayer",
    layerIndex: 1,
    item: [{
        type: "Sprite",
        name: "star",
        pictureName: "star",
        modifiers: {
            anchor: { x: 0.5, y: 0.5 }
        }
    }],
    player: [{
        type: "Sprite",
        name: "gravityRing",
        pictureName: "item",
        modifiers: {
            alpha: 0.2,
            anchor: { x: 0.5, y: 0.5 },
            scale: { x: 1, y: 1 }
        }
    },
    {
        type: "Sprite",
        name: "coolDownBar",
        pictureName: "loginFormBackground",
        modifiers: {
            width: 0,
            height: 20
        }
    },
    {
        type: "Sprite",
        name: "player",
        pictureName: "item",
        modifiers: {
            anchor: { x: 0.5, y: 0.5 }
        }
    }]
};