export class Controller {

    /**
     * @param {Model} model 
     * @param {View} view 
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.socket = {};
    }

    /**
     * @param {{[key: string]: Resource}} resources 
     */
    setViewResources(resources) {
        const { assets, spritesheets } = this.model.gameConfig;
        const textures = {};

        assets.forEach(({ name }) => {
            textures[name] = resources[name].texture
        });

        spritesheets.forEach(({ name }) => {
            Object.entries(resources[name].textures)
                .forEach(([key, texture]) => {
                    const [name] = key.split(".");
                    textures[name] = texture;
                });
        });

        this.view.setTextures(textures);
    }

    setViewLayers(layers) {
        this.view.setLaters(layers);
    }

    setSocket(socket) {
        this.socket = socket(this.model.gameConfig.ioUrl);
    }

    connectUser(callback) {
        this.socket.emit("connect-user");
        this.socket.on("user-connected", this.onUserConnected.bind(this, callback));
    }

    onUserConnected(callback, payload) {
        const parsed = JSON.parse(payload);
        this.model.playerId = parsed.id;
        callback();
    }

    createLoginPopup() {
        this.view.createLoginPopup();
    }
}