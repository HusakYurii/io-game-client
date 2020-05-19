export const gameConfig = {
    isDebuggerMode: true,
    application: {
        autoDensity: true,
        backgroundColor: "0x010D21",
        width: 900,
        height: 600
    },
    ioUrl: 'http://192.168.168.101:9090',
    assets: [
        { name: 'loginFormBackground', url: './assets/loginFormBackground.png' },
        { name: 'loginFormButton', url: './assets/loginFormButton.png' },
        { name: 'item', url: './assets/item.png' },
        { name: 'star', url: './assets/star.png' },
        { name: 'hexagon', url: './assets/hexagon.png' },
        { name: 'joystick', url: './assets/joystick.png' },
        { name: 'pointer', url: './assets/pointer.png' },
    ],
    spritesheets: [
        //{ name: 'world-tiles', url: './assets/spritesheets/world-tiles.json' }
    ]
};
