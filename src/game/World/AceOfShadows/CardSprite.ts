import { Sprite } from '../../../engine/Components/Sprite';
import * as TWEEN from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';

export default class CardSprite extends Sprite {
    private _tween: TWEEN.Tween<{x: number, y: number, rotation: number}> | null = null;

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

        const startValues = { x: this.x, y: this.y, rotation: this.rotation };
        const endValues = { x: targetX, y: targetY, rotation: targetRotation };

        this._tween = new TWEEN.Tween(startValues)
            .to(endValues, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate((values)=>
            {
                this.x = values.x;
                this.y = values.y;
                this.rotation = values.rotation;
            })
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