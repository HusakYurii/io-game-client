export const gameConfig = {
    isDebuggerMode: true,
    application: {
        width: 1000,
        height: 600
    },
    ioUrl: 'http://localhost:9090',
    assets: [
        { name: 'loginFormBackground', url: './assets/loginFormBackground.png' },
        { name: 'loginFormButton', url: './assets/loginFormButton.png' },
        { name: 'loginFormStrip', url: './assets/loginFormStrip.png' },
        { name: 'player', url: './assets/player.png' },
        { name: 'other', url: './assets/other.png' }
    ],
    spritesheets: [
        { name: 'world-tiles', url: './assets/spritesheets/world-tiles.json' }
    ]
};
