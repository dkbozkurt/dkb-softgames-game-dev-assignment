import * as PIXI from 'pixi.js';
import gsap from 'gsap';

type GlowConfig = {
    color: number;
    scaleMin: number;
    scaleMax: number;
    pulseDuration: number;
    offsetX: number;
    offsetY: number;
};

const DEFAULT_CONFIG: GlowConfig = {
    color: 0xFFC571,
    scaleMin: 1.5,
    scaleMax: 2.2,
    pulseDuration: 1.5,
    offsetX: 0,
    offsetY: -40
};

export default class FireGlow extends PIXI.Sprite {
    private _config: GlowConfig;

    constructor(config: Partial<GlowConfig> = {}) {
        const texture = FireGlow.createGlowTexture();
        super(texture);

        this._config = { ...DEFAULT_CONFIG, ...config };

        this.anchor.set(0.5);
        this.tint = this._config.color;
        this.blendMode = PIXI.BLEND_MODES.ADD;
        this.position.set(this._config.offsetX, this._config.offsetY);
        this.scale.set(this._config.scaleMin);
    }

    private static createGlowTexture(): PIXI.Texture {
        const size = 128;
        const halfSize = size / 2;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        const grad = ctx.createRadialGradient(halfSize, halfSize, 0, halfSize, halfSize, halfSize);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        return PIXI.Texture.from(canvas);
    }

    public startPulse(): void {
        gsap.killTweensOf(this.scale);
        gsap.killTweensOf(this);

        this.scale.set(this._config.scaleMin);

        gsap.to(this.scale, {
            x: this._config.scaleMax,
            y: this._config.scaleMax,
            duration: this._config.pulseDuration,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });

        gsap.to(this, {
            alpha: 0.8,
            duration: this._config.pulseDuration,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });
    }

    public stopPulse(): void {
        gsap.killTweensOf(this.scale);
        gsap.killTweensOf(this);
    }

    public destroy(): void {
        this.stopPulse();
        super.destroy();
    }
}
