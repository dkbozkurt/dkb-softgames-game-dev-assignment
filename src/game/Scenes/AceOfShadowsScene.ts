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
            x: 0,
            y: 0
        };

        // Place the target stack slightly below to keep it visually centered/balanced
        const rightStackConfig = {
            x: 0,
            y: 200
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
        this._cardStackManager?.update();
    }

    public destroy(): void {
        this.cleanup();
        super.destroy({ children: true });
    }
}