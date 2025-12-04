import * as PIXI from 'pixi.js';
import CardSprite from './CardSprite';
import Utilities from '../../../engine/Utils/Utilities';

type StackConfig = {
    x: number;
    y: number;
};

export default class CardStackManager {
    private _leftStack: CardSprite[] = [];
    private _rightStack: CardSprite[] = [];
    private _container: PIXI.Container;
    private _leftStackConfig: StackConfig;
    private _rightStackConfig: StackConfig;
    private _cardTexture: PIXI.Texture;
    private _moveInterval: NodeJS.Timeout | null = null;
    private _isAnimating: boolean = false;

    // Configuration for randomness
    private readonly POS_OFFSET = 5; // Pixels variance
    private readonly ROT_OFFSET = 0.1; // Radians variance

    constructor(
        container: PIXI.Container,
        cardTexture: PIXI.Texture,
        leftStackConfig: StackConfig,
        rightStackConfig: StackConfig
    ) {
        this._container = container;
        this._cardTexture = cardTexture;
        this._leftStackConfig = leftStackConfig;
        this._rightStackConfig = rightStackConfig;
    }

    public initialize(totalCards: number): void {
        this.createStacks(totalCards);
        this.startCardMovement();
    }

    private createStacks(totalCards: number): void {
        for (let i = 0; i < totalCards; i++) {
            const card = new CardSprite(
                this._cardTexture,
                this.getRandomPos(this._leftStackConfig.x),
                this.getRandomPos(this._leftStackConfig.y)
            );

            card.rotation = this.getRandomRotation();
            card.scale.set(0.5);

            this._container.addChild(card);
            this._leftStack.push(card);
        }
    }

    private startCardMovement(): void {
        this._moveInterval = setInterval(() => {
            this.moveTopCard();
        }, 1000);
    }

    private moveTopCard(): void {
        if (this._isAnimating) return;

        if (this._leftStack.length > 0) {
            this._isAnimating = true;
            const card = this._leftStack.pop()!;

            // Ensure the moving card renders on top of everything else
            this._container.setChildIndex(card, this._container.children.length - 1);

            card.animateTo(
                this.getRandomPos(this._rightStackConfig.x),
                this.getRandomPos(this._rightStackConfig.y),
                this.getRandomRotation(),
                2000,
                () => {
                    this._rightStack.push(card);
                    this._isAnimating = false;

                    if (this._leftStack.length === 0) {
                        this.swapStacks();
                    }
                }
            );
        }
    }

    private getRandomPos(base: number): number {
        return base + Utilities.getRandomFloatingNumber(-this.POS_OFFSET, this.POS_OFFSET);
    }

    private getRandomRotation(): number {
        return Utilities.getRandomFloatingNumber(-this.ROT_OFFSET, this.ROT_OFFSET);
    }

    private swapStacks(): void {
        const temp = this._leftStack;
        this._leftStack = this._rightStack;
        this._rightStack = temp;

        const tempConfig = this._leftStackConfig;
        this._leftStackConfig = this._rightStackConfig;
        this._rightStackConfig = tempConfig;
    }

    public update(): void {
        // TWEEN.update() is handled in Game.ts, so we don't need it here
    }

    public destroy(): void {
        if (this._moveInterval) {
            clearInterval(this._moveInterval);
            this._moveInterval = null;
        }

        [...this._leftStack, ...this._rightStack].forEach(card => card.destroy());
        this._leftStack = [];
        this._rightStack = [];
    }
}