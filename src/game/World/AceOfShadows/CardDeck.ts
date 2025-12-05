import * as PIXI from 'pixi.js';
import CardSprite from './CardSprite';
import Utilities from '../../../engine/Utils/Utilities';

type CardDeckConfig = {
    positionOffset: number;
    rotationOffset: number;
    cardScale: number;
    baseZIndex: number;
};

export default class CardDeck {
    private _cards: CardSprite[] = [];
    private _container: PIXI.Container;
    private _config: CardDeckConfig;

    constructor(container: PIXI.Container, config: CardDeckConfig) {
        this._container = container;
        this._config = config;
    }

    public createCards(count: number, texture: PIXI.Texture, baseX: number, baseY: number): void {
        for (let i = 0; i < count; i++) {
            const card = new CardSprite(
                texture,
                this.randomizePosition(baseX),
                this.randomizePosition(baseY),
                this._config.cardScale
            );
            card.rotation = this.randomizeRotation();
            card.zIndex = this._config.baseZIndex + i;

            this._container.addChild(card);
            this._cards.push(card);
        }
    }

    public popCard(): CardSprite | undefined {
        return this._cards.pop();
    }

    public pushCard(card: CardSprite, zIndex: number): void {
        card.zIndex = zIndex;
        this._cards.push(card);
    }

    public randomizePosition(base: number): number {
        return base + Utilities.getRandomFloatingNumber(-this._config.positionOffset, this._config.positionOffset);
    }

    public randomizeRotation(): number {
        return Utilities.getRandomFloatingNumber(-this._config.rotationOffset, this._config.rotationOffset);
    }

    public get count(): number {
        return this._cards.length;
    }

    public get isEmpty(): boolean {
        return this._cards.length === 0;
    }

    public destroy(): void {
        this._cards.forEach(card => card.destroy());
        this._cards = [];
    }
}
