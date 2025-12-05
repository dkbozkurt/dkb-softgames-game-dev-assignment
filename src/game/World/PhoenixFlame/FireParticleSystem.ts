import * as PIXI from 'pixi.js';
import { Container } from '../../../engine/Components/Container';
import ENGINE from '../../../engine/Engine';
import Utilities from '../../../engine/Utils/Utilities';
import gsap from 'gsap';

interface FireParticle extends PIXI.Sprite {
    vx: number;
    vy: number;
    maxLife: number;
    age: number;
    initialScale: number;
    waveOffset: number;
}

export default class FireParticleSystem extends Container {
    private _particleContainer: PIXI.ParticleContainer;
    private _particles: FireParticle[] = [];
    private _textureFrames: PIXI.Texture[] = [];
    private _torchSprite: PIXI.Sprite | null = null;
    private _glowSprite: PIXI.Sprite | null = null;

    // Core settings
    private readonly MAX_PARTICLES = 10;
    private readonly GRID_COLS = 3;
    private readonly GRID_ROWS = 3;

    // Configuration - Easy to tweak
    private readonly PARTICLE_LIFETIME = { min: 30, max: 50 };
    private readonly PARTICLE_SPEED_Y = { min: -3, max: -5 }; // Negative is Upwards
    private readonly PARTICLE_SCALE = { min: 0.2, max: 0.5 }; // Reduced size
    private readonly PARTICLE_SPAWN_WIDTH = 4; // Reduced spread (+/- 4px)
    private readonly PARTICLE_GLOBAL_SPEED = 60; // Base speed multiplier

    // Torch Settings
    private readonly TORCH_OFFSET = { x: 0, y: 25 };
    private readonly TORCH_SCALE = { x: 1.5, y: 1.5 };

    // Glow Settings
    private readonly GLOW_OFFSET = { x: 0, y: -40 };
    private readonly GLOW_COLOR = 0xFFC571; // Updated color
    private readonly GLOW_SCALE_MIN = 1.5; // Scaled up
    private readonly GLOW_SCALE_MAX = 2.2; // Scaled up
    private readonly GLOW_PULSE_DURATION = 1.5; // Seconds for GSAP

    constructor() {
        super();

        // 1. Add Glow (Back)
        this.createGlow(); 

        // 2. Add Torch (Middle)
        this.createTorch();

        // 3. Add Particles (Front)
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
        this.prepareTextures();
        this.initParticles();
        this.visible = true;
        this.startGlowAnimation();
    }

    public stop(): void {
        this.visible = false;
        this.stopGlowAnimation();
    }

    private createGlow(): void {
        const size = 128;
        const halfSize = size / 2;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            const grad = ctx.createRadialGradient(halfSize, halfSize, 0, halfSize, halfSize, halfSize);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)'); // Center alpha
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');   // Outer alpha

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, size, size);

            const texture = PIXI.Texture.from(canvas);
            this._glowSprite = new PIXI.Sprite(texture);
            this._glowSprite.anchor.set(0.5);
            this._glowSprite.tint = this.GLOW_COLOR;
            this._glowSprite.blendMode = PIXI.BLEND_MODES.ADD;
            
            this._glowSprite.position.set(this.GLOW_OFFSET.x, this.GLOW_OFFSET.y);
            this._glowSprite.scale.set(this.GLOW_SCALE_MIN);
            
            this.addChild(this._glowSprite);
        }
    }

    private startGlowAnimation(): void {
        if (!this._glowSprite) return;

        // Ensure clean state
        gsap.killTweensOf(this._glowSprite.scale);
        this._glowSprite.scale.set(this.GLOW_SCALE_MIN);

        // Create pulsing animation
        gsap.to(this._glowSprite.scale, {
            x: this.GLOW_SCALE_MAX,
            y: this.GLOW_SCALE_MAX,
            duration: this.GLOW_PULSE_DURATION,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
        
        // Optional alpha pulse
        gsap.to(this._glowSprite, {
            alpha: 0.8,
            duration: this.GLOW_PULSE_DURATION,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }

    private stopGlowAnimation(): void {
        if (!this._glowSprite) return;
        gsap.killTweensOf(this._glowSprite);
        gsap.killTweensOf(this._glowSprite.scale);
    }

    private createTorch(): void {
        const texture = PIXI.Texture.from(ENGINE.resources.getItemPath('torch'));

        // Wait for load if necessary to center anchor correctly
        if (texture.baseTexture.valid) {
            this.setupTorchSprite(texture);
        } else {
            texture.once('update', () => this.setupTorchSprite(texture));
        }
    }

    private setupTorchSprite(texture: PIXI.Texture): void {
        this._torchSprite = new PIXI.Sprite(texture);
        this._torchSprite.anchor.set(0.5); // Center anchor
        this._torchSprite.scale.set(
            this.TORCH_SCALE.x,
            this.TORCH_SCALE.y
        );  // Adjust scale if needed

        // Position torch independently from the particles
        this._torchSprite.position.set(
            this.TORCH_OFFSET.x,
            this.TORCH_OFFSET.y
        );

        // Add behind particles but in front of glow
        this.addChildAt(this._torchSprite, 1);
    }

    private prepareTextures(): void {
        if (this._textureFrames.length > 0) return;

        const baseTexture = PIXI.Texture.from(ENGINE.resources.getItemPath('fireSpriteSheet'));

        if (!baseTexture.baseTexture.valid) {
            baseTexture.once('update', () => this.sliceTextures(baseTexture));
        } else {
            this.sliceTextures(baseTexture);
        }
    }

    private sliceTextures(baseTexture: PIXI.Texture): void {
        const frameWidth = baseTexture.width / this.GRID_COLS;
        const frameHeight = baseTexture.height / this.GRID_ROWS;

        this._textureFrames = [];

        for (let y = 0; y < this.GRID_ROWS; y++) {
            for (let x = 0; x < this.GRID_COLS; x++) {
                const rect = new PIXI.Rectangle(
                    x * frameWidth,
                    y * frameHeight,
                    frameWidth,
                    frameHeight
                );
                const frame = new PIXI.Texture(baseTexture.baseTexture, rect);
                this._textureFrames.push(frame);
            }
        }

        if (this._particles.length === 0 && this.visible) {
            this.initParticles();
        }
    }

    private initParticles(): void {
        if (this._textureFrames.length === 0) return;

        this._particles = [];
        this._particleContainer.removeChildren();

        for (let i = 0; i < this.MAX_PARTICLES; i++) {
            const particle = new PIXI.Sprite(this._textureFrames[0]) as FireParticle;
            particle.anchor.set(0.5, 0.7);

            this.resetParticle(particle, true);

            this._particles.push(particle);
            this._particleContainer.addChild(particle);
        }
    }

    private resetParticle(p: FireParticle, preWarm: boolean = false): void {
        // Tighter spawn area
        p.x = Utilities.getRandomFloatingNumber(-this.PARTICLE_SPAWN_WIDTH, this.PARTICLE_SPAWN_WIDTH);

        // Spawn at 0,0 (Center of the particle system container)
        p.y = 0;

        // Faster upward velocity
        p.vx = Utilities.getRandomFloatingNumber(-0.5, 0.5);
        p.vy = Utilities.getRandomFloatingNumber(this.PARTICLE_SPEED_Y.min, this.PARTICLE_SPEED_Y.max);

        p.maxLife = Utilities.getRandomFloatingNumber(this.PARTICLE_LIFETIME.min, this.PARTICLE_LIFETIME.max);
        p.age = 0;
        p.waveOffset = Utilities.getRandomFloatingNumber(0, Math.PI * 2);

        p.alpha = 0;
        p.initialScale = Utilities.getRandomFloatingNumber(this.PARTICLE_SCALE.min, this.PARTICLE_SCALE.max);
        p.scale.set(p.initialScale);
        p.rotation = 0;
        p.tint = 0xFFFFFF;

        if (preWarm) {
            const warmFrames = Utilities.getRandomNumber(0, 50);
            for (let i = 0; i < warmFrames; i++) {
                this.updateParticleState(p, 1);
                if (p.age >= p.maxLife) p.age = 0;
            }
        }
    }

    public update(): void {
        if (!this.visible) return;

        if (this._textureFrames.length === 0) return;

        const speedFactor = ENGINE.time.deltaTime * this.PARTICLE_GLOBAL_SPEED;

        for (const p of this._particles) {
            this.updateParticleState(p, speedFactor);
        }
    }

    private updateParticleState(p: FireParticle, delta: number): void {
        p.age += delta;

        if (p.age >= p.maxLife) {
            this.resetParticle(p);
            return;
        }

        // 1. Movement & Turbulence
        p.x += (p.vx + Math.sin(p.age * 0.15 + p.waveOffset) * 0.3) * delta;
        p.y += p.vy * delta;

        // Normalized lifetime (0.0 -> 1.0)
        const t = p.age / p.maxLife;

        // 2. Texture Animation Logic
        const totalFrames = this._textureFrames.length;
        const frameIndex = Math.floor(t * totalFrames);
        const safeIndex = Math.min(frameIndex, totalFrames - 1);

        p.texture = this._textureFrames[safeIndex];

        // 3. Scale & Alpha
        p.scale.set(p.initialScale * (1.2 - t * 0.4)); // Slight shrink

        if (t < 0.1) p.alpha = t * 10;
        else p.alpha = 1 - Math.pow(t, 2);

        // 4. Tint
        if (t < 0.2) p.tint = 0xFFFFFF; // White hot start
        else if (t < 0.5) p.tint = 0xFFDD88; // Yellow-Orange
        else p.tint = 0xFF6622; // Darker Orange-Red end

        p.rotation = (p.x * 0.01);
    }

    public destroy(options?: boolean | PIXI.IDestroyOptions): void {
        this.stopGlowAnimation();
        if (this._glowSprite) {
            this._glowSprite.destroy(); // Texture was from canvas, so we should clean it up or let GC handle it if not shared.
        }
        this._textureFrames = [];
        super.destroy(options);
    }
}