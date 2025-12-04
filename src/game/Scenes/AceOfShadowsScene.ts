import { Scene } from './Scene';
import CardStackManager from '../World/AceOfShadows/CardStackManager';
import * as PIXI from 'pixi.js';
import ENGINE from '../../engine/Engine';

export default class AceOfShadowsScene extends Scene {
    private _cardStackManager: CardStackManager | null = null;

    private readonly STACK_COUNT = 3;
    private readonly CIRCLE_RADIUS = 250;

    private readonly STACKED_CARD_AMOUNT = 144;

    constructor() {
        super();
    }

    protected onShow(): void {
        this.setupCards();
    }

    protected onHide(): void {
        this.cleanup();
    }

    private setupCards(): void {

        this.removeChildren();

        const cardTexture = PIXI.Texture.from(ENGINE.resources.getItemPath('gameCard'));

        const targetPositions = this.calculateStackPositions(this.STACK_COUNT);

        this._cardStackManager = new CardStackManager(
            this,
            cardTexture,
            targetPositions
        );

        this._cardStackManager.initialize(this.STACKED_CARD_AMOUNT);
    }

    private calculateStackPositions(count: number): { x: number, y: number }[] {
        const positions: { x: number, y: number }[] = [];

        if (count === 0) return positions;

        const angleStep = 360 / count;

        // Start at 270 (Bottom)
        let currentAngle = 270;

        for (let i = 0; i < count; i++) {
            const rad = currentAngle * (Math.PI / 180);

            // Coordinate Calculation:
            // Standard Math: 0 is Right, 90 is Up, 270 is Down.
            // Screen Coords: Y grows Downwards.

            // To make 270 be "Bottom" (Positive Y) and 90 be "Top" (Negative Y):
            // We use -Math.sin(rad) because:
            // sin(270) = -1. -(-1) = 1 (Positive Y -> Bottom).
            // sin(90) = 1. -(1) = -1 (Negative Y -> Top).

            const x = Math.cos(rad) * this.CIRCLE_RADIUS;
            const y = -Math.sin(rad) * this.CIRCLE_RADIUS;

            positions.push({ x, y });

            // Subtract step to match the sequence (270 -> 150 -> 30)
            currentAngle -= angleStep;
        }

        return positions;
    }

    private cleanup(): void {
        this._cardStackManager?.destroy();
        this._cardStackManager = null;

        this.removeChildren();
    }

    public update(): void {
        this._cardStackManager?.update();
    }

    public destroy(): void {
        this.cleanup();
        super.destroy({ children: true });
    }
}