import { Sprite } from '../../../engine/Components/Sprite';
import * as TWEEN from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';
import ENGINE from '../../../engine/Engine'
export default class CardSprite extends Sprite {
    private _tween: TWEEN.Tween<{ x: number; y: number }> | null = null;

    constructor(texture: PIXI.Texture, x: number = 0, y: number = 0) {
        super(x, y, 1, 1, texture);
    }

    public animateTo(targetX: number, targetY: number, duration: number, onComplete?: () => void): void {
        this.stopAnimation();

        const start = { x: this.x, y: this.y };
        const end = { x: targetX, y: targetY };

        this._tween = new TWEEN.Tween(start)
            .to(end, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate((obj) => {
                this.x = obj.x;
                this.y = obj.y;
                console.log('saaa');
            })
            .onComplete(() => {
                onComplete?.();
            })
            .start(ENGINE.time.elapsedTime);
    }

    public update():void {
        if (this._tween) {
            this._tween.update(ENGINE.time.elapsedTime);
        }
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