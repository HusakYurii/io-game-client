export class ResourcesParser {
    constructor({ sprites = [], spritesheets = [] }) {
        this.resourceTypes = { sprites, spritesheets }
    }

    /**
     * To parse PIXI loader resources to more convenient structure
     * @param {{[key: string]: Resource}} resources 
     * @returns {{[key: string]: Texture}}
     */
    parseResources(resources) {
        const { sprites, spritesheets } = this.resourceTypes;
        const textures = {};

        sprites.forEach(({ name }) => {
            textures[name] = resources[name].texture
        });

        spritesheets.forEach(({ name }) => {
            Object.entries(resources[name].textures)
                .forEach(([key, texture]) => {
                    const [name] = key.split(".");
                    textures[name] = texture;
                });
        });

        return textures;
    }
}