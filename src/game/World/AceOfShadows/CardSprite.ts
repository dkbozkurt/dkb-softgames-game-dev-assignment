import { Sprite } from '../../../engine/Components/Sprite';
import * as TWEEN from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';

export default class CardSprite extends Sprite {
    private _tween: TWEEN.Tween<CardSprite> | null = null;

    constructor(texture: PIXI.Texture, x: number = 0, y: number = 0) {
        super(x, y, 2, 2, texture);
    }

    public animateTo(
        targetX: number,
        targetY: number,
        targetRotation: number,
        duration: number,
        onComplete?: () => void
    ): void {
        this.stopAnimation();

        this._tween = new TWEEN.Tween(this)
            .to({ x: targetX, y: targetY, rotation: targetRotation }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                onComplete?.();
            })
            .start();
    }

    public stopAnimation(): void {
        if (this._tween) {
            this._tween.stop();
            this._tween = null;
        }
    }

    public destroy(): void {
        this.stopAnimation();
        super.destroy();
    }
}