import * as PIXI from 'pixi.js'
import ENGINE from '../../engine/Engine.ts'
import EventSystem from '../../engine/EventSystem.ts';
import Utilities from '../../engine/Utils/Utilities.ts';

export default class Camera {

    private _container!: PIXI.Container
    private _orthographicSize: number = 5;

    private _unitsToFitHeight: number = 10

    constructor(orthographicSize: number = 5) {
        this._container = new PIXI.Container();
        this._orthographicSize = orthographicSize;
        this._unitsToFitHeight = this._orthographicSize * 2 * ENGINE.UNIT_MULTIPLY_CONSTANT;

        Utilities.bindMethods(this, ['handleOrientationChange']);

        EventSystem.on('orientationChange', this.handleOrientationChange);

        this.setup()
    }

    private setup() {

        ENGINE.application.add(this._container)

        this._container.pivot.set(0.5);
        this._container.zIndex = 0;

        this.resize();
    }

    private handleOrientationChange(data: { orientation: engine.DeviceOrientation }): void {
        console.log('Orientation changed to:', data.orientation);
        this.resize();
    }

    public resize(): void {

        this._container.position.set(
            ENGINE.viewport.width / 2,
            ENGINE.viewport.height / 2
        )

        const pixelsPerUnit = ENGINE.viewport.height / this._unitsToFitHeight;

        // Apply the scale to the container
        this._container.scale.set(pixelsPerUnit, pixelsPerUnit);
    }

    public setOrthographicSize(size: number): void {
        this._orthographicSize = size
        this._unitsToFitHeight = this._orthographicSize * 2 * ENGINE.UNIT_MULTIPLY_CONSTANT;
        this.resize()
    }

    public get orthographicSize(): number {
        return this._orthographicSize;
    }

    /**
     * Add a sprite with Unity-like positioning
     * @param item The sprite or display object to add
     * @param position Position in Unity-like coordinates
     */
    public addWithPosition(item: PIXI.Container, position: PIXI.Point): void {
        this.add(item);
        this.setPosition(item, position);
    }

    public setPosition(item: PIXI.Container, position: PIXI.Point): void {
        item.position.set(position.x * ENGINE.UNIT_MULTIPLY_CONSTANT, -position.y * ENGINE.UNIT_MULTIPLY_CONSTANT);
    }

    public add(item: PIXI.Container): void {
        this._container.addChild(item);
    }

    public remove(item: PIXI.Container): void {
        if (!this._container.children.includes(item)) return;
        this._container.removeChild(item);
    }

    public destroy(): void {
        EventSystem.off('onOrientationChange', this.handleOrientationChange);

        ENGINE.application.remove(this._container);
        this._container.destroy({ children: true });
    }
}