import GAME from '../Game';
import ENGINE from '../../engine/Engine.ts'
import * as PIXI from 'pixi.js';

export default class TestGameObject{

    private _spriteRenderer!: PIXI.Sprite;
    private _rotationSpeed: number = 0.01

    constructor() {
        this._spriteRenderer = PIXI.Sprite.from(ENGINE.resources.getItemPath("test"));
        this._spriteRenderer.anchor.set(0.5);
        this._spriteRenderer.scale.set(1);

        this._spriteRenderer.eventMode = 'static';
        this._spriteRenderer.cursor = 'pointer';

        this._spriteRenderer.on('pointerdown', () => {
            this.onMouseDown();
        });

        this._spriteRenderer.on('pointerup', () => {
            this.onMouseUp();
        });

        GAME.instance().add(this._spriteRenderer);
    }

    private onMouseDown() {
        this._rotationSpeed = 0.5;
    }

    private onMouseUp() {
        this._rotationSpeed = 0.01;
    }

    public update() {
        if (this._spriteRenderer) {
            this._spriteRenderer.rotation += this._rotationSpeed;
        }
    }

    public destroy()
    {

    }

}