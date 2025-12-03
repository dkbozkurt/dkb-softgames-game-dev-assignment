import ENGINE from '../../engine/Engine';
import Utilities from '../../engine/Utils/Utilities';

export default class FPSCounter {
    private _fpsElement: HTMLElement;
    private _fpsValueElement: HTMLElement;

    constructor() {
        this._fpsElement = document.getElementById('fps__counter__base')!;
        this._fpsValueElement = this._fpsElement.querySelector('.fps__counter__value')!;

        this.setup();
    }

    private setup(): void {
        this.setVisibility(true);
    }

    private setVisibility(visible: boolean): void {
        this._fpsElement.style.display = visible ? 'flex' : 'none';
    }

    public update(): void {
        const fps = Math.round(1000 / ENGINE.time.deltaMS);
        Utilities.setHTMLElementTextContent(this._fpsValueElement, `${fps}`, '#ffffff');
    }

    public destroy(): void {
        this.setVisibility(false);
    }
}