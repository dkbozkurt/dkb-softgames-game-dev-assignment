import * as PIXI from 'pixi.js';
import { Container } from '../../../engine/Components/Container';
import ENGINE from '../../../engine/Engine';
import Utilities from '../../../engine/Utils/Utilities';

// Interface for our custom particle sprite to hold physics data
interface FireParticle extends PIXI.Sprite {
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    age: number;
}

export default class FireParticleSystem extends Container {
    private _particleContainer: PIXI.ParticleContainer;
    private _particles: FireParticle[] = [];
    private _fireTexture: PIXI.Texture | null = null;
    
    // Task requirement: Keep the number of images at max 10 sprites on the screen
    private readonly MAX_PARTICLES = 10;

    constructor() {
        super();

        // Use ParticleContainer for high performance rendering
        this._particleContainer = new PIXI.ParticleContainer(this.MAX_PARTICLES, {
            scale: true,
            position: true,
            rotation: true,
            uvs: true,
            alpha: true,
            tint: true
        });

        // Additive blending is crucial for fire effects
        this._particleContainer.blendMode = PIXI.BLEND_MODES.ADD;
        this.addChild(this._particleContainer);
    }

    public start(): void {
        this.createFireTexture();
        this.initParticles();
        this.visible = true;
    }

    public stop(): void {
        this.cleanup();
        this.visible = false;
    }

    /**
     * Generates a soft radial gradient texture procedurally.
     */
    private createFireTexture(): void {
        if (this._fireTexture) return;

        const size = 64;
        const halfSize = size / 2;
        
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Create a radial gradient: White center -> Transparent edge
        const grad = ctx.createRadialGradient(halfSize, halfSize, 0, halfSize, halfSize, halfSize);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');     // Hot core
        grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)'); // Soft glow
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');     // Fade out

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        this._fireTexture = PIXI.Texture.from(canvas);
    }

    private initParticles(): void {
        if (!this._fireTexture) return;

        this._particles = [];
        this._particleContainer.removeChildren();
        
        for (let i = 0; i < this.MAX_PARTICLES; i++) {
            const particle = new PIXI.Sprite(this._fireTexture) as FireParticle;
            particle.anchor.set(0.5);
            
            // Initialize particle state with pre-warming to spread them out immediately
            this.resetParticle(particle, true); 
            
            this._particles.push(particle);
            this._particleContainer.addChild(particle);
        }
    }

    private resetParticle(p: FireParticle, preWarm: boolean = false): void {
        // Spawn area at the bottom center (relative to this container)
        p.x = Utilities.getRandomFloatingNumber(-20, 20);
        p.y = 200; 

        // Upward velocity with some horizontal spread
        p.vx = Utilities.getRandomFloatingNumber(-1.0, 1.0);
        p.vy = Utilities.getRandomFloatingNumber(-3, -6); // Negative Y is up

        p.maxLife = Utilities.getRandomFloatingNumber(60, 100);
        p.age = 0;

        // Initial Visuals
        p.alpha = 0; 
        p.scale.set(Utilities.getRandomFloatingNumber(0.5, 1.2));
        p.rotation = Utilities.getRandomFloatingNumber(0, Math.PI * 2);
        p.tint = 0xFFF000; // Start Yellowish-White

        if (preWarm) {
            const warmFrames = Utilities.getRandomNumber(0, 60);
            for(let i = 0; i < warmFrames; i++) {
                this.updateParticleState(p, 1);
                if (p.age >= p.maxLife) p.age = 0; 
            }
        }
    }

    public update(): void {
        if (!this.visible) return;

        // Scale simulation speed by delta time
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

        // 1. Movement
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        
        // Add turbulence
        p.vx += Utilities.getRandomFloatingNumber(-0.1, 0.1) * delta;

        // 2. Visual Evolution
        const t = p.age / p.maxLife;

        // Scale
        if (t < 0.2) {
            const s = p.scale.x + 0.03 * delta;
            p.scale.set(s);
        } else {
            const s = Math.max(0, p.scale.x - 0.005 * delta);
            p.scale.set(s);
        }

        // Alpha
        if (t < 0.1) {
            p.alpha = t * 10; 
        } else {
            p.alpha = 1 - ((t - 0.1) / 0.9); 
        }

        // Tint
        if (t < 0.2) {
            p.tint = 0xFFFF88; // Bright Yellow-White
        } else if (t < 0.5) {
            p.tint = 0xFFAA00; // Orange
        } else if (t < 0.8) {
            p.tint = 0xFF4400; // Red
        } else {
            p.tint = 0x550000; // Dark Red/Smoke
        }

        p.rotation += 0.02 * delta;
    }

    private cleanup(): void {
        if (this._fireTexture) {
            this._fireTexture.destroy(true);
            this._fireTexture = null;
        }
        this._particleContainer.removeChildren();
        this._particles = [];
    }

    public destroy(options?: boolean | PIXI.IDestroyOptions): void {
        this.cleanup();
        super.destroy(options);
    }
}