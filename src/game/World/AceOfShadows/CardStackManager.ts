import * as PIXI from 'pixi.js';
import CardDeck from './CardDeck';

type Point = { x: number; y: number };

type CardStackConfig = {
    animationDelay: number;
    animationDuration: number;
    positionOffset: number;
    rotationOffset: number;
    cardScale: number;
};

const DEFAULT_CONFIG: CardStackConfig = {
    animationDelay: 1000,
    animationDuration: 2000,
    positionOffset: 15,
    rotationOffset: 0.3,
    cardScale: 0.65
};

export default class CardStackManager {
    private _sourceDeck: CardDeck;
    private _targetDecks: CardDeck[] = [];
    private _container: PIXI.Container;
    private _targetPositions: Point[];
    private _config: CardStackConfig;

    private _moveInterval: ReturnType<typeof setInterval> | null = null;
    private _currentTargetIndex: number = 0;

    private readonly Z_INDEX_SOURCE = 10;
    private readonly Z_INDEX_TARGET = 50;
    private readonly Z_INDEX_MOVING = 100;

    constructor(
        container: PIXI.Container,
        cardTexture: PIXI.Texture,
        targetPositions: Point[],
        config: Partial<CardStackConfig> = {}
    ) {
        this._container = container;
        this._container.sortableChildren = true;
        this._targetPositions = targetPositions;
        this._config = { ...DEFAULT_CONFIG, ...config };

        const deckConfig = {
            positionOffset: this._config.positionOffset,
            rotationOffset: this._config.rotationOffset,
            cardScale: this._config.cardScale,
            baseZIndex: this.Z_INDEX_SOURCE
        };

        this._sourceDeck = new CardDeck(container, deckConfig);

        targetPositions.forEach(() => {
            this._targetDecks.push(new CardDeck(container, {
                ...deckConfig,
                baseZIndex: this.Z_INDEX_TARGET
            }));
        });
    }

    public initialize(totalCards: number, texture: PIXI.Texture): void {
        this._sourceDeck.createCards(totalCards, texture, 0, 0);
        this.startMovement();
    }

    private startMovement(): void {
        if (this._moveInterval) clearInterval(this._moveInterval);

        this.moveTopCard();
        this._moveInterval = setInterval(() => this.moveTopCard(), this._config.animationDelay);
    }

    private moveTopCard(): void {
        if (this._sourceDeck.isEmpty) {
            this.stopMovement();
            return;
        }

        const card = this._sourceDeck.popCard()!;
        card.zIndex = this.Z_INDEX_MOVING + this._sourceDeck.count;

        const targetIndex = this._currentTargetIndex;
        const targetPos = this._targetPositions[targetIndex];
        const targetDeck = this._targetDecks[targetIndex];

        this._currentTargetIndex = (this._currentTargetIndex + 1) % this._targetPositions.length;

        card.animateTo(
            targetDeck.randomizePosition(targetPos.x),
            targetDeck.randomizePosition(targetPos.y),
            targetDeck.randomizeRotation(),
            this._config.animationDuration,
            () => {
                if (!this._container || !targetDeck) return;
                targetDeck.pushCard(card, this.Z_INDEX_TARGET + targetDeck.count);
            }
        );
    }

    private stopMovement(): void {
        if (this._moveInterval) {
            clearInterval(this._moveInterval);
            this._moveInterval = null;
        }
    }

    public destroy(): void {
        this.stopMovement();
        this._sourceDeck.destroy();
        this._targetDecks.forEach(deck => deck.destroy());
        this._targetDecks = [];
    }
}
