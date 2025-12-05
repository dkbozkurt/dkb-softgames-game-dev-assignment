import { Container } from '../../engine/Components/Container';

export abstract class Scene extends Container {
    protected _isActive: boolean = false;

    constructor() {
        super();
        this.visible = false;
    }

    public show(): void {
        this._isActive = true;
        this.visible = true;
        this.onShow();
    }

    public hide(): void {
        this._isActive = false;
        this.visible = false;
        this.onHide();
    }

    protected abstract onShow(): void;
    protected abstract onHide(): void;
    public abstract update(): void;

    public get isActive(): boolean {
        return this._isActive;
    }
}
