import * as PIXI from 'pixi.js';
import gsap from 'gsap';

export default class CardSprite extends PIXI.Sprite {
    constructor(texture: PIXI.Texture, x: number = 0, y: number = 0, scale: number = 1) {
        super(texture);
        this.anchor.set(0.5);
        this.position.set(x, y);
        this.scale.set(scale);
    }

    /**
     * Animates the card to a target position.
     * @param targetX Destination X
     * @param targetY Destination Y
     * @param targetRotation Destination Rotation
     * @param duration Duration in milliseconds
     * @param onComplete Callback when movement is done
     */
    public animateTo(
        targetX: number,
        targetY: number,
        targetRotation: number,
        duration: number,
        onComplete?: () => void
    ): void {
        gsap.killTweensOf(this);

        const durationSec = duration / 1000;

        // 1. Movement Tween
        gsap.to(this, {
            x: targetX,
            y: targetY,
            duration: durationSec,
            ease: 'power3.out', // Smooth slow-down
            onComplete: () => {
                if (onComplete) onComplete();
            }
        });

        // 2. Rotation Tween
        gsap.to(this, {
            rotation: targetRotation,
            duration: durationSec,
            ease: 'power2.inOut'
        });
    }

    public destroy(): void {
        gsap.killTweensOf(this);
        super.destroy();
    }
}