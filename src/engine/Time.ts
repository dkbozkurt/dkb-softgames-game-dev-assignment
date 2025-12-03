import EventSystem from './EventSystem';

export default class Time {
    private _start: number;
    private _current: number;
    private _elapsed: number = 0;
    private _delta: number = 16; // !!! Do not set to 0, because some bugs can happen
    private _accumulator: number = 0;
    private _fixedDeltaTime: number = 1 / 50;

    constructor() {
        this._start = Date.now();
        this._current = this._start;

        window.requestAnimationFrame(() => this.tick());
    }

    private tick(): void {
        const currentTime = Date.now();
        this._delta = currentTime - this._current;
        this._current = currentTime;
        this._elapsed = this._current - this._start;

        this._accumulator += this.deltaTime;

        while (this._accumulator >= this._fixedDeltaTime) {
            EventSystem.trigger('fixedUpdateTick');
            this._accumulator -= this._fixedDeltaTime;
        }

        EventSystem.trigger('tick');

        window.requestAnimationFrame(() => this.tick());
    }

    // Elapsed time in seconds.
    public get time(): number { return this._elapsed * 0.001; }

    public get elapsedTime(): number { return this._elapsed; }

    // Delta in seconds.
    public get deltaTime(): number { return this._delta * 0.001; }

    public get fixedDeltaTime(): number { return this._fixedDeltaTime; }
}
