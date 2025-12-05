import * as PIXI from 'pixi.js';
import { Scene } from './Scene';
import CardStackManager from '../World/AceOfShadows/CardStackManager';
import CirclePositionCalculator from '../../engine/Utils/CirclePositionCalculator';
import ENGINE from '../../engine/Engine';
import { GameConfig } from '../Config/GameConfig';

export default class AceOfShadowsScene extends Scene {
    private _cardStackManager: CardStackManager | null = null;

    protected onShow(): void {
        this.setupCards();
    }

    protected onHide(): void {
        this.cleanup();
    }

    private setupCards(): void {
        this.removeChildren();

        const cardTexture = PIXI.Texture.from(ENGINE.resources.getItemPath('gameCard'));

        // Retrieve values from centralized configuration
        const { StackCount, CircleRadius, CardCount } = GameConfig.AceOfShadows;

        const targetPositions = CirclePositionCalculator.calculate(StackCount, CircleRadius);

        this._cardStackManager = new CardStackManager(this, cardTexture, targetPositions);
        this._cardStackManager.initialize(CardCount, cardTexture);
    }

    private cleanup(): void {
        this._cardStackManager?.destroy();
        this._cardStackManager = null;
        this.removeChildren();
    }

    public update(): void { }

    public destroy(): void {
        this.cleanup();
        super.destroy({ children: true });
    }
}