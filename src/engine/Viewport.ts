import EventSystem from './EventSystem';

export default class Viewport {
    private _width: number = 0;
    private _height: number = 0;
    private _pixelRatio: number = 1;
    private _orientation: engine.DeviceOrientation = 'portrait';

    constructor() {
        this.updateDimensions();
        this.onResize();
        window.addEventListener('resize', this._boundOnResize);
    }

    private _boundOnResize = (): void => this.onResize();

    private updateDimensions(): void {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._pixelRatio = window.devicePixelRatio;
        this._orientation = this._width > this._height ? 'landscape' : 'portrait';
    }

    private onResize(): void {
        const previousOrientation = this._orientation;
        this.updateDimensions();

        EventSystem.trigger<engine.ResizeData>('resize', {
            width: this._width,
            height: this._height,
            pixelRatio: this._pixelRatio
        });

        if (previousOrientation !== this._orientation) {
            EventSystem.trigger<engine.OrientationChangeData>('orientationChange', {
                orientation: this._orientation
            });
        }
    }

    public get width(): number { return this._width; }
    public get height(): number { return this._height; }
    public get pixelRatio(): number { return this._pixelRatio; }
    public get orientation(): engine.DeviceOrientation { return this._orientation; }
    public get aspectRatio(): number { return this._width / this._height; }
    public get isPortrait(): boolean { return this._orientation === 'portrait'; }
    public get isLandscape(): boolean { return this._orientation === 'landscape'; }

    public destroy(): void {
        window.removeEventListener('resize', this._boundOnResize);
    }
}
