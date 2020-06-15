export const gameConfig = {
    isDevMode: true,
    containerId: '#game',
    container: {},
    application: {
        autoDensity: true,
        backgroundColor: "0x010D21",
        width: 900,
        height: 600
    },
    cameraSettings: {
        ratiosToOccupy: [0.8, 0.75, 0.7, 0.65, 0.6, 0.5, 0.45, 0.4, 0.4, 0.4],
        cameraScls: [1.55, 1.4, 1.3, 1.15, 1, 0.8, 0.7, 0.6, 0.5, 0.45]
    },
    prodUrl: 'https://trash-io-test.herokuapp.com',
    devUrl: 'http://192.168.168.101:9090',
    assets: {
        sprites: [
            // { name: 'hexagon', url: './assets/hexagon.png' },
        ],
        spritesheets: [
            { name: 'pictures', url: './assets/pictures.json' }
        ]
    }
};
