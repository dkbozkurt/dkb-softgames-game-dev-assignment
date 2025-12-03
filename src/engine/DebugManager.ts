import * as dat from 'lil-gui';

export default class DebugManager {
    private _active: boolean;
    private _ui: dat.GUI | null = null;

    constructor() {
        this._active = window.location.hash === '#debug';
        if (this._active) {
            this._ui = new dat.GUI();
        }
    }

    public get isActive(): boolean { return this._active; }
    public get ui(): dat.GUI | null { return this._ui; }

    public destroy(): void {
        this._ui?.destroy();
    }
}
