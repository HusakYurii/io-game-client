export const uiLayerConfig = {
    layerName: "UILayer",
    layerIndex: 3,
    loginPopupTree: [{
        type: "Container",
        name: "popup",
        children: [
            {
                type: "Sprite",
                name: "background",
                pictureName: "loginFormBackground",
                modifiers: {
                    anchor: { x: 0.5, y: 0.5 }
                }
            },
            {
                type: "Sprite",
                name: "nickNameInputStripe",
                pictureName: "loginFormStrip",
                modifiers: {
                    position: { x: 0, y: -80 },
                    anchor: { x: 0.5, y: 0.5 }
                }
            },
            {
                type: "Sprite",
                name: "roomInputStripe",
                pictureName: "loginFormStrip",
                modifiers: {
                    position: { x: 0, y: -10 },
                    anchor: { x: 0.5, y: 0.5 }
                }
            },
            {
                type: "Text",
                name: "nickNameInputText",
                text: "Your nickname:",
                style: {
                    fill: "#1b46de",
                    fontSize: 40,
                    fontWeight: "bold"
                },
                modifiers: {
                    position: { x: -150, y: -110 },
                    anchor: { x: 0.5, y: 0.5 }
                }
            },
            {
                type: "Text",
                name: "roomInputText",
                text: "Room id:",
                style: {
                    fill: "#1b46de",
                    fontSize: 40,
                    fontWeight: "bold"
                },
                modifiers: {
                    position: { x: -90, y: -40 },
                    anchor: { x: 0.5, y: 0.5 }
                }
            },
            {
                type: "Container",
                name: "button",
                modifiers: {
                    position: { x: 0, y: 80 }
                },
                children: [
                    {
                        type: "Sprite",
                        name: "buttonBg",
                        pictureName: "loginFormButton",
                        modifiers: {
                            scale: { x: 1.8, y: 1.5 },
                            anchor: { x: 0.5, y: 0.5 }
                        }
                    },
                    {
                        type: "Text",
                        name: "buttonText",
                        text: "Join game!",
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
            }
        ]
    }]
};