/**
 * @class ResizeManager
 * Resize manager calculates the game's current sizes and reacts on
 * changing of window's size
 * */
export class ResizeManager {
    constructor(target, { width = 960, height = 960 } = {}) {

        this.configSize = { width, height };
        this.target = target;

        this.resizeView = this.resizeView.bind(this);

        window.addEventListener("resize", this.resizeView);
    }

    destroy() {
        window.removeEventListener("resize", this.resizeView);
    }

    resizeView() {
        const { innerWidth, innerHeight } = window;
        let { width, height } = this.configSize;

        let scl = 1;
        if (innerHeight > innerWidth) { //portrait
            scl = (innerWidth < width) ? innerWidth / width : 1;
        }
        else { //landscape
            scl = (innerHeight < height) ? innerHeight / height : 1;
        }

        const windowSize = { width: innerWidth, height: innerHeight };

        this.target.renderer.resize(innerWidth, innerHeight);
        this.target.controller.view.resize({ scl, windowSize });
    }
}