import { Ticker } from 'pixi.js';
import EventSystem from './EventSystem';

export default class Time {
    private _ticker: Ticker;
    private _elapsed: number = 0;
    private _accumulator: number = 0;
    private _fixedDeltaTime: number = 1 / 50;

    constructor() {
        this._ticker = Ticker.shared;
        this._ticker.add(this.tick, this);
    }

    private tick(): void {
        this._elapsed += this._ticker.deltaMS;
        this._accumulator += this.deltaTime;

        while (this._accumulator >= this._fixedDeltaTime) {
            EventSystem.trigger('fixedUpdateTick');
            this._accumulator -= this._fixedDeltaTime;
        }

        EventSystem.trigger('tick');
    }

    public get time(): number { return this._elapsed * 0.001; }

    public get elapsedTime(): number { return this._elapsed; }

    public get deltaTime(): number { return this._ticker.deltaMS * 0.001; }

    public get deltaMS(): number { return this._ticker.deltaMS; }

    public get fixedDeltaTime(): number { return this._fixedDeltaTime; }

    public destroy(): void {
        this._ticker.remove(this.tick, this);
    }
}