import * as PIXI from 'pixi.js';
import { Scene } from './Scene';
import CardStackManager from '../World/AceOfShadows/CardStackManager';
import CirclePositionCalculator from '../../engine/Utils/CirclePositionCalculator';
import ENGINE from '../../engine/Engine';

export default class AceOfShadowsScene extends Scene {
    private _cardStackManager: CardStackManager | null = null;

    private readonly STACK_COUNT = 3;
    private readonly CIRCLE_RADIUS = 250;
    private readonly CARD_COUNT = 144;

    protected onShow(): void {
        this.setupCards();
    }

    protected onHide(): void {
        this.cleanup();
    }

    private setupCards(): void {
        this.removeChildren();

        const cardTexture = PIXI.Texture.from(ENGINE.resources.getItemPath('gameCard'));
        const targetPositions = CirclePositionCalculator.calculate(this.STACK_COUNT, this.CIRCLE_RADIUS);

        this._cardStackManager = new CardStackManager(this, cardTexture, targetPositions);
        this._cardStackManager.initialize(this.CARD_COUNT, cardTexture);
    }

    private cleanup(): void {
        this._cardStackManager?.destroy();
        this._cardStackManager = null;
        this.removeChildren();
    }

    public update(): void {}

    public destroy(): void {
        this.cleanup();
        super.destroy({ children: true });
    }
}
