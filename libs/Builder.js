import { Container, Sprite, Text, TextStyle } from "./PixiCustomized.js";

export class Builder {

    /**
     * @param {object[]} treeConfig 
     * @returns {DisplayObject[]} - nested pixi DisplayObject
     */
    static fromConfig(treeConfig) {
        return treeConfig.map((config) => {
            const methodName = Builder.methodsMap[config.type];
            const el = Builder[methodName](config);
            if (config.children) {
                el.addChild(...Builder.fromConfig(config.children));
            }
            return el;
        });
    }

    /**
     * @param {{modifiers:object; name: string;}} param0
     * @returns {Container}
     */
    static createContainer({ modifiers, name } = {}) {
        const container = new Builder.Container();
        this._useModifiers(container, modifiers);
        container.name = name;
        return container;
    }

    /**
     * @param {{pictureName:string; modifiers:object; name: string;}} param0 
     * @returns {Sprite}
     */
    static createSprite({ pictureName, modifiers, name  } = {}) {
        const sprite = Builder.Sprite.from(pictureName);
        this._useModifiers(sprite, modifiers);
        sprite.name = name;
        return sprite;
    }

    /**
     * @param {{text:string; style:object; modifiers:object; name: string;}} param0 
     * @returns {Text}
     */
    static createText({ text = "", style = {}, modifiers, name  } = {}) {
        const txt = new Builder.Text(text, new Builder.TextStyle(style));
        this._useModifiers(txt, modifiers);
        txt.name = name;
        return txt;
    }

    /**
     * @private
     * @param {DisplayObject} target 
     * @param {object} modifiers 
     */
    static _useModifiers(target, modifiers = {}) {
        const filtered = [
            "position", "anchor", "scale",
            "alpha", "zIndex", "rotation"
        ].filter((prop) => Boolean(modifiers[prop]));

        filtered.forEach((prop) => {
            this._modify(target, prop, modifiers[prop]);
        });
    }

    /**
     * @private
     * @param {DisplayObject} target 
     * @param {string} property 
     * @param {any} modifier 
     */
    static _modify(target, property, modifier) {
        if (typeof (modifier) !== "object") {
            target[property] = modifier;
        }
        else {
            target[property] = Object.assign(target[property], modifier);
        }
    }

    static get Container() {
        return Container;
    }

    static get Sprite() {
        return Sprite;
    }

    static get TextStyle() {
        return TextStyle;
    }

    static get Text() {
        return Text;
    }
}

Builder.methodsMap = {
    "Container": "createContainer",
    "Sprite": "createSprite",
    "Text": "createText"
};