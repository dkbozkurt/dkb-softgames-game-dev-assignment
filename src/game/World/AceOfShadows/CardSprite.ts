import * as PIXI from 'pixi.js';
import gsap from 'gsap';

export default class CardSprite extends PIXI.Sprite {
    constructor(texture: PIXI.Texture, x: number = 0, y: number = 0, scale: number = 1) {
        super(texture);
        this.anchor.set(0.5);
        this.position.set(x, y);
        this.scale.set(scale);
    }

    public animateTo(
        targetX: number,
        targetY: number,
        targetRotation: number,
        duration: number,
        onComplete?: () => void
    ): void {
        gsap.killTweensOf(this);

        const durationSec = duration / 1000;

        gsap.to(this, {
            x: targetX,
            y: targetY,
            duration: durationSec,
            ease: 'power3.out',
            onComplete
        });

        gsap.to(this, {
            rotation: targetRotation,
            duration: durationSec,
            ease: 'power2.in'
        });
    }

    public destroy(): void {
        gsap.killTweensOf(this);
        super.destroy();
    }
}
