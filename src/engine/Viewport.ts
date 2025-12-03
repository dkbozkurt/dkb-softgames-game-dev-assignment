import EventSystem from "./EventSystem";

export default class Viewport {
    private _width!: number
    private _height!: number
    private _pixelRatio!: number
    private _orientation: engine.DeviceOrientation = 'portrait'

    constructor() {
        this.updateDimensions();
        this.onResize();
        this.setupResizeListener();
    }

    private updateDimensions(): void {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._pixelRatio = window.devicePixelRatio;
        this.updateOrientation();
    }

    private setupResizeListener(): void {
        window.addEventListener('resize', () => this.onResize());
    }

    private onResize(): void {
        const previousOrientation = this._orientation;

        this.updateDimensions();

        EventSystem.trigger('resize', {
            width: this._width,
            height: this._height,
            pixelRatio: this._pixelRatio
        });

        if (previousOrientation !== this._orientation) {
            EventSystem.trigger('orientationChange', { orientation: this._orientation });
        }
    }

    private updateOrientation(): void {
        this._orientation = this._width > this._height ? 'landscape' : 'portrait';
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get pixelRatio(): number {
        return this._pixelRatio;
    }

    public get orientation(): engine.DeviceOrientation {
        return this._orientation;
    }

    public get aspectRatio(): number {
        return this._width / this._height;
    }

    public get isPortrait(): boolean {
        return this._orientation === 'portrait';
    }

    public get isLandscape(): boolean {
        return this._orientation === 'landscape';
    }

    public destroy(): void {
        window.removeEventListener('resize', this.onResize);
    }
}