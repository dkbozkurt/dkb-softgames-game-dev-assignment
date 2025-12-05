import * as PIXI from 'pixi.js';
import { Container } from '../../../engine/Components/Container';
import ENGINE from '../../../engine/Engine';
import Utilities from '../../../engine/Utils/Utilities';

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
    
    private readonly MAX_PARTICLES = 10;
    private readonly GRID_COLS = 3;
    private readonly GRID_ROWS = 3;

    constructor() {
        super();

        this._particleContainer = new PIXI.ParticleContainer(this.MAX_PARTICLES, {
            scale: true,
            position: true,
            rotation: true,
            uvs: true, // Required for texture swapping/animation
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
    }

    public stop(): void {
        this.visible = false;
    }

    private prepareTextures(): void {
        if (this._textureFrames.length > 0) return;

        // Get the full spritesheet texture
        const baseTexture = PIXI.Texture.from(ENGINE.resources.getItemPath('fireSpriteSheet'));
        
        // Ensure texture is fully loaded before slicing
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
        
        // Refresh particles if they were waiting
        if (this._particles.length === 0 && this.visible) {
            this.initParticles();
        }
    }

    private initParticles(): void {
        if (this._textureFrames.length === 0) return;

        this._particles = [];
        this._particleContainer.removeChildren();
        
        for (let i = 0; i < this.MAX_PARTICLES; i++) {
            // Start with the first frame (Top-Left)
            const particle = new PIXI.Sprite(this._textureFrames[0]) as FireParticle;
            particle.anchor.set(0.5, 0.7); 
            
            this.resetParticle(particle, true); 
            
            this._particles.push(particle);
            this._particleContainer.addChild(particle);
        }
    }

    private resetParticle(p: FireParticle, preWarm: boolean = false): void {
        p.x = Utilities.getRandomFloatingNumber(-10, 10);
        p.y = 150; 

        // Faster upward velocity
        p.vx = Utilities.getRandomFloatingNumber(-0.5, 0.5);
        p.vy = Utilities.getRandomFloatingNumber(-4, -7); 

        p.maxLife = Utilities.getRandomFloatingNumber(50, 80);
        p.age = 0;
        p.waveOffset = Utilities.getRandomFloatingNumber(0, Math.PI * 2);

        p.alpha = 0; 
        p.initialScale = Utilities.getRandomFloatingNumber(0.5, 0.8);
        p.scale.set(p.initialScale);
        p.rotation = 0;
        p.tint = 0xFFFFFF;

        if (preWarm) {
            const warmFrames = Utilities.getRandomNumber(0, 50);
            for(let i = 0; i < warmFrames; i++) {
                this.updateParticleState(p, 1);
                if (p.age >= p.maxLife) p.age = 0; 
            }
        }
    }

    public update(): void {
        if (!this.visible || this._textureFrames.length === 0) return;
        
        const speedFactor = ENGINE.time.deltaTime * 60;

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
        // Map lifetime 't' (0 to 1) to frame index (0 to 8)
        // This makes it start at Top-Left (0) and end at Bottom-Right (8)
        // If you specifically want it to end at Bottom-Left (index 6), change to:
        // const totalFrames = 7; // indices 0 to 6
        const totalFrames = this._textureFrames.length;
        const frameIndex = Math.floor(t * totalFrames);
        
        // Safety clamp
        const safeIndex = Math.min(frameIndex, totalFrames - 1);
        
        // Swap texture frame
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
        // Textures are managed by Resources manager, usually we don't destroy them here
        // unless we created them procedurally. Since these are from a spritesheet 
        // managed by assets, we just clear the arrays.
        this._textureFrames = [];
        super.destroy(options);
    }
}