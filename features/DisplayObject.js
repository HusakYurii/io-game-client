import { DisplayObject } from '@pixi/display'; // Import Container to be used on stage

Object.defineProperties(DisplayObject.prototype, {
    "_name": {
        value: null,
        writable: true
    },
    "name": {
        get() {
            return this._name;
        },
        set(name) {
            this._name = name;
        }
    },
    "getChildByName": {
        value(name, isRecursive = true) {
            const findChild = (name, children) => {
                return children.find((child) => child.name === name);
            };

            let found = findChild(name, this.children);

            if (!found && isRecursive) {
                found = this.children.reduce((_, child) => {
                    const result = child.getChildByName(name, isRecursive);
                    if(result) return result;
                }, undefined);
            }

            return found;
        }
    }
});