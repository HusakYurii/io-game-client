export const uiLayerConfig = {
    layerName: "UILayer",
    layerIndex: 3,
    gameOverPopupTree: [{
        type: "Container",
        name: "gameOverPopup",
        children: [{
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
            children: [{
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
    }],
    connectionLostPopupTree: [{
        type: "Container",
        name: "connectionLostPopup",
        children: [{
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
            name: "reconnectButton",
            modifiers: {
                position: { x: 0, y: 120 }
            },
            children: [{
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
                text: "Restart Game!",
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
    }],
    loginPopup: [{
        type: "div",
        attrebutes: [{ name: "id", value: "loginPopup" }],
        children: [{
            type: "form",
            children: [{
                type: "h3",
                text: "Gravity io"
            },
            {
                type: "input",
                attrebutes: [
                    { name: "type", value: "text" },
                    { name: "name", value: "name" },
                    { name: "placeholder", value: "James Doe" },
                    { name: "required", value: "required" },
                    { name: "id", value: "inputName" },
                ]
            },
            {
                type: "input",
                attrebutes: [
                    { name: "id", value: "loginButton" },
                    { name: "class", value: "disabled" },
                    { name: "type", value: "submit" },
                    { name: "value", value: "Send" }
                ]
            }
            ]
        }]
    }]
};