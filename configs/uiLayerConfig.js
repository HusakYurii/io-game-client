export const uiLayerConfig = {
    layerName: "UILayer",
    layerIndex: 3,
    gameOverPopup: [{
        type: "div",
        attrebutes: [{ name: "id", value: "gameOverPopup" }],
        children: [{
            type: "div",
            children: [{
                type: "h3",
                text: "Game Over!"
            },
            {
                type: "p",
                text: "Get back and kill all!"
            },
            {
                type: "input",
                attrebutes: [
                    { name: "id", value: "restartButton" },
                    { name: "type", value: "button" },
                    { name: "value", value: "Restart Game" }
                ]
            }]
        }]
    }],
    connectionLostPopup: [{
        type: "div",
        attrebutes: [{ name: "id", value: "connectionLostPopup" }],
        children: [{
            type: "div",
            children: [{
                type: "h3",
                text: "Connection Lost!"
            },
            {
                type: "p",
                text: "Seems that connection lost! Get back and kill all!"
            },
            {
                type: "input",
                attrebutes: [
                    { name: "id", value: "reconnectButton" },
                    { name: "type", value: "button" },
                    { name: "value", value: "Reconnect" }
                ]
            }]
        }]
    }],
    loginPopup: [{
        type: "div",
        attrebutes: [{ name: "id", value: "loginPopup" }],
        children: [{
            type: "div",
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
                    { name: "type", value: "button" },
                    { name: "value", value: "Send" }
                ]
            }]
        }]
    }]
};