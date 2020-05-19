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
                    anchor: { x: 0.5, y: 0.5 },
                    width: 600
                }
            },
            {
                type: "TextInput",
                name: "nameInput",
                modifiers: {
                    position: { x: -200, y: -140 },
                    placeholder: "Your Name...",
                    restrict: "a-zA-z_-",
                    maxLength: 10
                },
                input: {
                    fontSize: '36px',
                    padding: '12px',
                    width: '400px',
                    color: '#26272E'
                },
                box: {
                    default: { fill: 0xE8E9F3, rounded: 12, stroke: { color: 0xCBCEE0, width: 3 } },
                    focused: { fill: 0xE1E3EE, rounded: 12, stroke: { color: 0xABAFC6, width: 3 } },
                    disabled: { fill: 0xDBDBDB, rounded: 12 }
                }
            },
            {
                type: "TextInput",
                name: "roomIdInput",
                modifiers: {
                    position: { x: -200, y: -40 },
                    placeholder: "Room id to join to...",
                    restrict: "0-9a-zA-z_-",
                    maxLength: 10
                },
                input: {
                    fontSize: '36px',
                    padding: '12px',
                    width: '400px',
                    color: '#26272E'
                },
                box: {
                    default: { fill: 0xE8E9F3, rounded: 12, stroke: { color: 0xCBCEE0, width: 3 } },
                    focused: { fill: 0xE1E3EE, rounded: 12, stroke: { color: 0xABAFC6, width: 3 } },
                    disabled: { fill: 0xDBDBDB, rounded: 12 }
                }
            },
            {
                type: "Container",
                name: "button",
                modifiers: {
                    position: { x: 0, y: 120 },
                    alpha: 0.7
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
    }],
    gameOverPopupTree: [{
        type: "Container",
        name: "gameOverPopup",
        children: [
            {
                type: "Sprite",
                name: "background",
                pictureName: "loginFormBackground",
                modifiers: {
                    anchor: { x: 0.5, y: 0.5 },
                    width: 600
                }
            },
            {
                type: "Container",
                name: "restartButton",
                modifiers: {
                    position: { x: 0, y: 120 }
                },
                children: [
                    {
                        type: "Sprite",
                        name: "buttonBg",
                        pictureName: "loginFormButton",
                        modifiers: {
                            scale: { x: 2, y: 1.5 },
                            anchor: { x: 0.5, y: 0.5 }
                        }
                    },
                    {
                        type: "Text",
                        name: "buttonText",
                        text: "Continue Game!",
                        style: {
                            fill: "#fff2f2",
                            fontSize: 80
                        },
                        modifiers: {
                            scale: { x: 0.5, y: 0.5 },
                            anchor: { x: 0.5, y: 0.5 }
                        }
                    }]
            }]
    }]
};