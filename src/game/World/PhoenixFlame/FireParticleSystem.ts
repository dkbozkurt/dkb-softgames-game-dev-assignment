import * as PIXI from 'pixi.js';
import { Container } from '../../../engine/Components/Container';
import ENGINE from '../../../engine/Engine';
import FireGlow from './FireGlow';
import FireParticleFactory, { FireParticle } from './FireParticleFactory';
import SpriteSheetLoader from './SpriteSheetLoader';

export default class FireParticleSystem extends Container {
    private _particleContainer: PIXI.ParticleContainer;
    private _particles: FireParticle[] = [];
    private _textureFrames: PIXI.Texture[] = [];
    private _glow: FireGlow;
    private _torch: PIXI.Sprite | null = null;
    private _particleFactory: FireParticleFactory;

    private readonly MAX_PARTICLES = 10;
    private readonly GLOBAL_SPEED = 60;

    constructor() {
        super();

        this._particleFactory = new FireParticleFactory();

        this._glow = new FireGlow();
        this.addChild(this._glow);

        this._particleContainer = new PIXI.ParticleContainer(this.MAX_PARTICLES, {
            scale: true,
            position: true,
            rotation: true,
            uvs: true,
            alpha: true,
            tint: true
        });
        this._particleContainer.blendMode = PIXI.BLEND_MODES.ADD;
        this.addChild(this._particleContainer);
    }

    public start(): void {
        this.visible = true;
        this.createTorch();
        this.loadTextures();
        this._glow.startPulse();
    }

    public stop(): void {
        this.visible = false;
        this._glow.stopPulse();
    }

    private createTorch(): void {
        if (this._torch) return;

        const texture = ENGINE.resources.items['torch'] as PIXI.Texture;

        if (!texture) {
            console.warn('Torch texture not found in resources');
            return;
        }

        this.setupTorch(texture);
    }

    private setupTorch(texture: PIXI.Texture): void {
        this._torch = new PIXI.Sprite(texture);
        this._torch.anchor.set(0.5);
        this._torch.scale.set(1.5);
        this._torch.position.set(0, 25);
        this.addChildAt(this._torch, 1);
    }

    private loadTextures(): void {
        if (this._textureFrames.length > 0) {
            this.initParticles();
            return;
        }

        const texture = ENGINE.resources.items['fireSpriteSheet'] as PIXI.Texture;

        SpriteSheetLoader.load(
            texture,
            3,
            3,
            (frames) => {
                this._textureFrames = frames;
                this.initParticles();
            }
        );
    }

    private initParticles(): void {
        if (this._textureFrames.length === 0) return;

        this._particles = [];
        this._particleContainer.removeChildren();

        for (let i = 0; i < this.MAX_PARTICLES; i++) {
            const particle = this._particleFactory.create(this._textureFrames[0]);
            this._particles.push(particle);
            this._particleContainer.addChild(particle);
        }
    }

    public update(): void {
        if (!this.visible || this._textureFrames.length === 0) return;

        const delta = ENGINE.time.deltaTime * this.GLOBAL_SPEED;

        for (const particle of this._particles) {
            this.updateParticle(particle, delta);
        }
    }

    private updateParticle(p: FireParticle, delta: number): void {
        p.age += delta;

        if (p.age >= p.maxLife) {
            this._particleFactory.reset(p);
            return;
        }

        p.x += (p.vx + Math.sin(p.age * 0.15 + p.waveOffset) * 0.3) * delta;
        p.y += p.vy * delta;

        const t = p.age / p.maxLife;

        const frameIndex = Math.min(Math.floor(t * this._textureFrames.length), this._textureFrames.length - 1);
        p.texture = this._textureFrames[frameIndex];

        p.scale.set(p.initialScale * (1.2 - t * 0.4));
        p.alpha = t < 0.1 ? t * 10 : 1 - Math.pow(t, 2);
        p.tint = t < 0.2 ? 0xFFFFFF : t < 0.5 ? 0xFFDD88 : 0xFF6622;
        p.rotation = p.x * 0.01;
    }

    public destroy(options?: boolean | PIXI.IDestroyOptions): void {
        this._glow.destroy();
        this._textureFrames = [];
        super.destroy(options);
    }
}