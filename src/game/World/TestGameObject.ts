import * as PIXI from 'pixi.js';
import GAME from '../Game';
import ENGINE from '../../engine/Engine';

export default class TestGameObject {
    private _sprite: PIXI.Sprite;
    private _rotationSpeed: number = 0.01;

    constructor() {
        this._sprite = PIXI.Sprite.from(ENGINE.resources.getItemPath('test'));
        this._sprite.anchor.set(0.5);
        this._sprite.scale.set(1);
        this._sprite.eventMode = 'static';
        this._sprite.cursor = 'pointer';

        this._sprite.on('pointerdown', this.onPointerDown);
        this._sprite.on('pointerup', this.onPointerUp);

        GAME.instance().add(this._sprite);
    }

    private onPointerDown = (): void => {
        this._rotationSpeed = 0.5;
    };

    private onPointerUp = (): void => {
        this._rotationSpeed = 0.01;
    };

    public update(): void {
        this._sprite.rotation += this._rotationSpeed;
    }

    public destroy(): void {
        this._sprite.off('pointerdown', this.onPointerDown);
        this._sprite.off('pointerup', this.onPointerUp);
        this._sprite.destroy();
    }
}
