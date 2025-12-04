import * as PIXI from 'pixi.js';
import CardSprite from './CardSprite';
import Utilities from '../../../engine/Utils/Utilities';

type Point = {
    x: number;
    y: number;
};

export default class CardStackManager {
    private _mainDeck: CardSprite[] = [];
    private _targetStacks: CardSprite[][] = [];
    private _container: PIXI.Container;

    private _targetPositions: Point[];
    private _cardTexture: PIXI.Texture;

    private _moveInterval: NodeJS.Timeout | null = null;
    private _currentTargetIndex: number = 0;

    // Configuration for randomness
    private readonly POS_OFFSET = 15; // Pixels variance
    private readonly ROT_OFFSET = 0.3; // Radians variance
    private readonly CARD_SCALE = 0.65; // Increased scale

    private readonly CARD_ANIMATION_START_DELAY = 1000;
    private readonly CARD_ANIMATION_DURATION = 2000;

    private readonly Z_INDEX_DECK = 10;
    private readonly Z_INDEX_TARGET = 50;
    private readonly Z_INDEX_MOVING = 100;

    constructor(
        container: PIXI.Container,
        cardTexture: PIXI.Texture,
        targetPositions: Point[]
    ) {
        this._container = container;
        this._container.sortableChildren = true;

        this._cardTexture = cardTexture;
        this._targetPositions = targetPositions;

        // Initialize arrays for each target stack
        this._targetPositions.forEach(() => {
            this._targetStacks.push([]);
        });
    }

    public initialize(totalCards: number): void {
        this.createMainDeck(totalCards);
        this.startCardMovement();
    }

    private createMainDeck(totalCards: number): void {
        // Create cards at the center (0,0)
        for (let i = 0; i < totalCards; i++) {
            const card = new CardSprite(
                this._cardTexture,
                this.getRandomPos(0),
                this.getRandomPos(0)
            );

            card.rotation = this.getRandomRotation();
            card.scale.set(this.CARD_SCALE);

            card.zIndex = this.Z_INDEX_DECK + i;

            this._container.addChild(card);
            this._mainDeck.push(card);
        }
    }

    private startCardMovement(): void {
        if (this._moveInterval) clearInterval(this._moveInterval);

        this.moveTopCard();

        this._moveInterval = setInterval(() => {
            this.moveTopCard();
        }, this.CARD_ANIMATION_START_DELAY);
    }

    private moveTopCard(): void {

        if (this._mainDeck.length <= 0)
        {
            if(this._moveInterval)
            {
                clearInterval(this._moveInterval);
                this._moveInterval = null;
            }
            return;
        }

        const card = this._mainDeck.pop()!;
        card.zIndex = this.Z_INDEX_MOVING + this._mainDeck.length;

        const targetIndex = this._currentTargetIndex;
        const targetPos = this._targetPositions[targetIndex];

        // Move to next stack index for the NEXT card immediately (Circular round-robin)
        this._currentTargetIndex = (this._currentTargetIndex + 1) % this._targetPositions.length;

        card.animateTo(
            this.getRandomPos(targetPos.x),
            this.getRandomPos(targetPos.y),
            this.getRandomRotation(),
            this.CARD_ANIMATION_DURATION,
            () => {
                if (!this._container || !this._targetStacks) return;

                const currentStack = this._targetStacks[targetIndex];
                if (!currentStack) return;

                currentStack.push(card);
                card.zIndex = this.Z_INDEX_TARGET + currentStack.length;
            }
        );
    }

    private getRandomPos(base: number): number {
        return base + Utilities.getRandomFloatingNumber(-this.POS_OFFSET, this.POS_OFFSET);
    }

    private getRandomRotation(): number {
        return Utilities.getRandomFloatingNumber(-this.ROT_OFFSET, this.ROT_OFFSET);
    }

    public update(): void {

    }

    public destroy(): void {
        if (this._moveInterval) {
            clearInterval(this._moveInterval);
            this._moveInterval = null;
        }

        // Destroy main deck
        this._mainDeck.forEach(card => card.destroy());
        this._mainDeck = [];

        // Destroy all target stacks
        this._targetStacks.forEach(stack => {
            stack.forEach(card => card.destroy());
        });
        this._targetStacks = [];
    }
}