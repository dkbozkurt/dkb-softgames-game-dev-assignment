import { Sprite } from '../../../engine/Components/Sprite';
import gsap from 'gsap';
import * as PIXI from 'pixi.js';

export default class CardSprite extends Sprite {
    constructor(texture: PIXI.Texture, x: number = 0, y: number = 0) {
        super(x, y,1,1, texture);
        this.anchor.set(0.5);
    }

    public animateTo(
        targetX: number,
        targetY: number,
        targetRotation: number,
        duration: number,
        onComplete?: () => void
    ): void {
        this.stopAnimation();

        const durationSec = duration / 1000;

        gsap.to(this, {
            x: targetX,
            y: targetY,
            duration: durationSec,
            ease: 'power2.inOut',
            onComplete: () => {
                onComplete?.();
            }
        });

        gsap.to(this, {
            rotation: targetRotation,
            duration: durationSec,
            ease: 'power2.in'
        });
    }

    public update(): void {
    }

    public stopAnimation(): void {
        gsap.killTweensOf(this);
    }

    public destroy(): void {
        this.stopAnimation();
        super.destroy();
    }
}