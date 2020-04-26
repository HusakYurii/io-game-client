export const gameConfig = {
    isDebuggerMode: true,
    application: {
        autoDensity: true,
        width: 900,
        height: 600
    },
    ioUrl: 'http://192.168.168.101:9090',
    assets: [
        { name: 'loginFormBackground', url: './assets/loginFormBackground.png' },
        { name: 'loginFormButton', url: './assets/loginFormButton.png' },
        { name: 'loginFormStrip', url: './assets/loginFormStrip.png' },
        { name: 'background', url: './assets/background.png' },
        { name: 'player', url: './assets/player.png' },
        { name: 'other', url: './assets/other.png' }
    ],
    spritesheets: [
        { name: 'world-tiles', url: './assets/spritesheets/world-tiles.json' }
    ]
};
