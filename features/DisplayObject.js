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
        value(name, isRecursive = true, parent = this) {
            const findChild = (name, { children }) => {
                return children.find((child) => child.name === name);
            };

            let found = findChild(name, parent);
            const { length } = parent.children;

            for (let i = 0; ((i < length) && !found && isRecursive); i += 1) {
                const child = parent.children[i];
                if (child) {
                    found = parent.getChildByName(name, isRecursive, child);
                }
            }

            return found;
        }
    }
});