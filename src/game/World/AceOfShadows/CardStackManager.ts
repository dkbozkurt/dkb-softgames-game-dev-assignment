import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import CardSprite from './CardSprite';

type StackConfig = {
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
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
                this._leftStackConfig.x + i * this._leftStackConfig.offsetX,
                this._leftStackConfig.y + i * this._leftStackConfig.offsetY
            );
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
            const targetIndex = this._rightStack.length;

            console.log('sa');
            card.animateTo(
                this._rightStackConfig.x + targetIndex * this._rightStackConfig.offsetX,
                this._rightStackConfig.y + targetIndex * this._rightStackConfig.offsetY,
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

    private swapStacks(): void {
        const temp = this._leftStack;
        this._leftStack = this._rightStack;
        this._rightStack = temp;

        const tempConfig = this._leftStackConfig;
        this._leftStackConfig = this._rightStackConfig;
        this._rightStackConfig = tempConfig;
    }

    public update(): void {
        TWEEN.update();
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