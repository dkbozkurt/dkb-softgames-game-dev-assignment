import * as PIXI from 'pixi.js';
import CardDeck from './CardDeck';
import AudioManager from '../../Core/AudioManager';
import { GameConfig } from '../../Config/GameConfig';

type Point = { x: number; y: number };

/**
 * Manages the logic of moving cards between decks.
 * Handles the timer and z-index sorting.
 */
export default class CardStackManager {
    private _sourceDeck: CardDeck;
    private _targetDecks: CardDeck[] = [];
    private _container: PIXI.Container;
    private _targetPositions: Point[];
    
    private _moveInterval: ReturnType<typeof setInterval> | null = null;
    private _currentTargetIndex: number = 0;

    private readonly Z_INDEX_SOURCE = 10;
    private readonly Z_INDEX_TARGET = 50;
    private readonly Z_INDEX_MOVING = 1000; // High Z to ensure it flies over everything

    constructor(
        container: PIXI.Container,
        cardTexture: PIXI.Texture,
        targetPositions: Point[]
    ) {
        this._container = container;
        this._container.sortableChildren = true;
        this._targetPositions = targetPositions;

        const config = GameConfig.AceOfShadows;

        const deckConfig = {
            positionOffset: config.Layout.PositionOffset,
            rotationOffset: config.Layout.RotationOffset,
            cardScale: config.Layout.CardScale,
            baseZIndex: this.Z_INDEX_SOURCE
        };

        // Initialize Source Deck
        this._sourceDeck = new CardDeck(container, deckConfig);

        // Initialize Target Decks
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

        // Immediate first move
        this.moveTopCard();
        
        // Schedule subsequent moves
        const delay = GameConfig.AceOfShadows.Animation.IntervalDelay;
        this._moveInterval = setInterval(() => this.moveTopCard(), delay);
    }

    private moveTopCard(): void {
        if (this._sourceDeck.isEmpty) {
            this.stopMovement();
            return;
        }

        const card = this._sourceDeck.popCard()!;
        
        // Bring to front while moving
        card.zIndex = this.Z_INDEX_MOVING + this._sourceDeck.count; 

        const targetIndex = this._currentTargetIndex;
        const targetPos = this._targetPositions[targetIndex];
        const targetDeck = this._targetDecks[targetIndex];

        // Cycle through target decks (0 -> 1 -> 2 -> 0 ...)
        this._currentTargetIndex = (this._currentTargetIndex + 1) % this._targetPositions.length;

        AudioManager.instance().playSound('CardMove', 0.7);

        card.animateTo(
            targetDeck.randomizePosition(targetPos.x),
            targetDeck.randomizePosition(targetPos.y),
            targetDeck.randomizeRotation(),
            GameConfig.AceOfShadows.Animation.MoveDuration * 1000,
            () => {
                if (!this._container || !targetDeck) return;
                // Layer it correctly in the target pile
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