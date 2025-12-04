import { Scene } from './Scene';
import CardStackManager from '../World/AceOfShadows/CardStackManager';
import * as PIXI from 'pixi.js';
import ENGINE from '../../engine/Engine';

export default class AceOfShadowsScene extends Scene {
    private _cardStackManager: CardStackManager | null = null;

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
        const cardTexture = PIXI.Texture.from(ENGINE.resources.getItemPath('gameCard'));

        const leftStackConfig = {
            x: -250,
            y: -200,
            offsetX: 1,
            offsetY: 2
        };

        const rightStackConfig = {
            x: 150,
            y: -200,
            offsetX: 1,
            offsetY: 2
        };

        this._cardStackManager = new CardStackManager(
            this,
            cardTexture,
            leftStackConfig,
            rightStackConfig
        );

        this._cardStackManager.initialize(144);
    }

    private cleanup(): void {
        this._cardStackManager?.destroy();
        this._cardStackManager = null;
    }

    public update(): void {
        if (this._isActive) {
            this._cardStackManager?.update();
        }
    }

    public destroy(): void {
        this.cleanup();
        super.destroy({ children: true });
    }
}