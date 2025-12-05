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
    waveOffset: number; // For sine wave movement
}

export default class FireParticleSystem extends Container {
    private _particleContainer: PIXI.ParticleContainer;
    private _particles: FireParticle[] = [];
    private _fireTexture: PIXI.Texture | null = null;
    
    private readonly MAX_PARTICLES = 10;

    constructor() {
        super();

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
        this.createFireTexture();
        this.initParticles();
        this.visible = true;
    }

    public stop(): void {
        this.visible = false;
    }

    /**
     * Generates a "Wispy" flame texture using Canvas API.
     * This creates a teardrop-like shape which looks much better than a circle.
     */
    private createFireTexture(): void {
        if (this._fireTexture) return;

        const size = 128; // Larger texture for better detail
        const half = size / 2;
        
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw a flame shape (teardrop)
        ctx.beginPath();
        ctx.moveTo(half, 0); // Top tip
        ctx.quadraticCurveTo(size, half, half, size); // Right curve to bottom
        ctx.quadraticCurveTo(0, half, half, 0); // Left curve to top
        ctx.closePath();

        // Fill with a soft gradient
        const grad = ctx.createRadialGradient(half, size * 0.8, 0, half, size * 0.6, half);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');     // Core white
        grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)'); // Mid halo
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');     // Transparent edge

        ctx.fillStyle = grad;
        ctx.fill();

        this._fireTexture = PIXI.Texture.from(canvas);
    }

    private initParticles(): void {
        if (!this._fireTexture) return;

        this._particles = [];
        this._particleContainer.removeChildren();
        
        for (let i = 0; i < this.MAX_PARTICLES; i++) {
            const particle = new PIXI.Sprite(this._fireTexture) as FireParticle;
            particle.anchor.set(0.5, 0.8); // Anchor near bottom for flame behavior
            
            this.resetParticle(particle, true); 
            
            this._particles.push(particle);
            this._particleContainer.addChild(particle);
        }
    }

    private resetParticle(p: FireParticle, preWarm: boolean = false): void {
        // Spawn tightly at the base (simulating a torch head)
        p.x = Utilities.getRandomFloatingNumber(-5, 5);
        p.y = 150; // Base Y position

        // Fast upward velocity
        p.vx = Utilities.getRandomFloatingNumber(-0.5, 0.5);
        p.vy = Utilities.getRandomFloatingNumber(-5, -8); 

        p.maxLife = Utilities.getRandomFloatingNumber(40, 70);
        p.age = 0;
        p.waveOffset = Utilities.getRandomFloatingNumber(0, Math.PI * 2);

        // Visuals
        p.alpha = 0; 
        p.initialScale = Utilities.getRandomFloatingNumber(0.8, 1.4);
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
        if (!this.visible) return;
        
        // Slightly faster than 60fps base for snappier fire
        const speedFactor = ENGINE.time.deltaTime * 65;

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

        // 1. Torch Turbulence (Sine wave motion)
        // Adds that characteristic "waving" look of a torch
        p.x += (p.vx + Math.sin(p.age * 0.1 + p.waveOffset) * 0.5) * delta;
        p.y += p.vy * delta;

        const t = p.age / p.maxLife;

        // 2. Scale: Shrinks as it goes up (classic flame shape)
        const scale = p.initialScale * (1 - t * 0.6); // Shrinks to 40% of size
        p.scale.set(scale, scale * 1.1); // Slightly stretched vertically

        // 3. Alpha: Quick fade in, sharp fade out at very tip
        if (t < 0.1) p.alpha = t * 10;
        else p.alpha = 1 - Math.pow(t, 3); // Cubic falloff for density

        // 4. Torch Color Palette
        // Blue/White Core -> Orange Body -> Red Tip
        if (t < 0.15) {
            p.tint = 0xAAAAFF; // Blue-ish white core
        } else if (t < 0.4) {
            p.tint = 0xFFDD55; // Bright Yellow-Orange
        } else if (t < 0.7) {
            p.tint = 0xFF5500; // Deep Orange-Red
        } else {
            p.tint = 0x550000; // Dark Red/Smoke
        }

        // Rotate slightly based on horizontal movement to "lean" into the turn
        p.rotation = (p.x * 0.02);
    }

    public destroy(options?: boolean | PIXI.IDestroyOptions): void {
        if (this._fireTexture) {
            this._fireTexture.destroy(true);
            this._fireTexture = null;
        }
        super.destroy(options);
    }
}