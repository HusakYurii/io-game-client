export const controlLayerConfig = {
    layerName: "ControlLayer",
    layerIndex: 2,
    joystick: [{
        type: "Sprite",
        name: "joystick",
        pictureName: "joystick",
        modifiers: {
            anchor: { x: 0.5, y: 0.5 }
        },
        children: [
            {
                type: "Sprite",
                name: "pointer",
                pictureName: "pointer",
                modifiers: {
                    anchor: { x: 0.5, y: 0.5 },
                    scale: { x: 1.5, y: 1.5}
                }
            }
        ]
    }],
    activateButton: [{
            type: "Container",
            name: "buttonContaier",    
            children: [
                {
                    type: "Sprite",
                    name: "item",
                    pictureName: "loginFormButton",
                    modifiers: {
                        anchor: { x: 0.5, y: 0.5 },
                        width: 220,
                        height: 100
                    }
                },
                {
                    type: "Text",
                    name: "text",
                    text: "Gravitate",
                    style: {
                        fill: "#fff2f2",
                        fontSize: 80
                    },
                    modifiers: {
                        scale: { x: 0.5, y: 0.5 },
                        anchor: { x: 0.5, y: 0.5 }
                    }
                }
            ]
        }]
};