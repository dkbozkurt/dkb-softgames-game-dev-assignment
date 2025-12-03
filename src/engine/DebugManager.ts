import * as dat from 'lil-gui'

export default class DebugManager {
    private _active: boolean
    private _ui!: dat.GUI

    constructor() {
        this._active = window.location.hash === '#debug'

        if (this._active) this._ui = new dat.GUI()
    }

    public destroy()
    {
        if (this._active) this._ui.destroy()
    }

    public get isActive(): boolean {
        return this._active
    }

    public get ui(): dat.GUI {
        return this._ui;
    }
}