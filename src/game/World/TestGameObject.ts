import GAME from '../Game';
import ENGINE from '../../engine/Engine';
import { Sprite } from '../../engine/Components/Sprite';
import Utilities from '../../engine/Utils/Utilities';

export default class TestGameObject extends Sprite{
    private _rotationSpeed: number = 0.01;

    constructor() {
        super(
            0,
            0,
            1,
            1,
            ENGINE.resources.getItemPath('test'),
        );

        this.eventMode = 'static';
        this.cursor = 'pointer';

        Utilities.bindMethods(this, ['onPointerDown', 'onPointerUp', 'update']);

        this.on('pointerdown', this.onPointerDown);
        this.on('pointerup', this.onPointerUp);

        GAME.instance().add(this);
    }

    private onPointerDown = (): void => {
        this._rotationSpeed = 0.5;
    };

    private onPointerUp = (): void => {
        this._rotationSpeed = 0.01;
    };

    public update(): void {
        this.rotation += this._rotationSpeed;
    }

    public destroy(): void {
        this.off('pointerdown', this.onPointerDown);
        this.off('pointerup', this.onPointerUp);
        this.destroy();
    }
}
