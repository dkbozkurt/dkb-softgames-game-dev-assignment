import * as PIXI from 'pixi.js';
import Utilities from '../../../engine/Utils/Utilities';

export type FireParticle = PIXI.Sprite & {
    vx: number;
    vy: number;
    maxLife: number;
    age: number;
    initialScale: number;
    waveOffset: number;
};

type ParticleConfig = {
    lifetimeMin: number;
    lifetimeMax: number;
    speedYMin: number;
    speedYMax: number;
    scaleMin: number;
    scaleMax: number;
    spawnWidth: number;
};

const DEFAULT_CONFIG: ParticleConfig = {
    lifetimeMin: 30,
    lifetimeMax: 50,
    speedYMin: -5,
    speedYMax: -3,
    scaleMin: 0.2,
    scaleMax: 0.5,
    spawnWidth: 4
};

export default class FireParticleFactory {
    private _config: ParticleConfig;

    constructor(config: Partial<ParticleConfig> = {}) {
        this._config = { ...DEFAULT_CONFIG, ...config };
    }

    public create(texture: PIXI.Texture): FireParticle {
        const particle = new PIXI.Sprite(texture) as FireParticle;
        particle.anchor.set(0.5, 0.7);
        this.reset(particle, true);
        return particle;
    }

    public reset(particle: FireParticle, preWarm: boolean = false): void {
        const { spawnWidth, speedYMin, speedYMax, lifetimeMin, lifetimeMax, scaleMin, scaleMax } = this._config;

        particle.x = Utilities.getRandomFloatingNumber(-spawnWidth, spawnWidth);
        particle.y = 0;
        particle.vx = Utilities.getRandomFloatingNumber(-0.5, 0.5);
        particle.vy = Utilities.getRandomFloatingNumber(speedYMin, speedYMax);
        particle.maxLife = Utilities.getRandomFloatingNumber(lifetimeMin, lifetimeMax);
        particle.age = 0;
        particle.waveOffset = Utilities.getRandomFloatingNumber(0, Math.PI * 2);
        particle.alpha = 0;
        particle.initialScale = Utilities.getRandomFloatingNumber(scaleMin, scaleMax);
        particle.scale.set(particle.initialScale);
        particle.rotation = 0;
        particle.tint = 0xFFFFFF;

        if (preWarm) {
            this.preWarmParticle(particle);
        }
    }

    private preWarmParticle(particle: FireParticle): void {
        const warmFrames = Utilities.getRandomNumber(0, 50);
        for (let i = 0; i < warmFrames; i++) {
            particle.age += 1;
            if (particle.age >= particle.maxLife) particle.age = 0;
        }
    }
}
