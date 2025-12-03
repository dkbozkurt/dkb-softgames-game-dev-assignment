import EventSystem from "./EventSystem"

export default class Time {

    private _start: number
    private _current: number
    private _elapsed: number
    private _elapsedInSeconds: number
    private _delta: number
    private _deltaInSeconds: number

    // performance.now-based timing
    // private _startPerf: number;
    // private _currentPerf: number;
    // private _perfDelta: number;
    // private _perfElapsed: number;

    private _accumulator: number = 0
    private _targetFPSForFixedUpdate: number = 50
    private _fixedDeltaTime: number = 1 / this._targetFPSForFixedUpdate // 50 updates per second = 50 fps as in Unity FixedUpdate

    constructor() {
        this._start = Date.now()
        this._current = this._start
        this._elapsed = 0
        this._elapsedInSeconds = this._elapsed * 0.001
        this._delta = 16 // !!! Do not set to 0, because some bugs can happen
        this._deltaInSeconds = this._delta * 0.001

        // initialize performance.now clock
        // this._startPerf = performance.now();
        // this._currentPerf = this._startPerf;
        // this._perfDelta = 0;
        // this._perfElapsed = 0;

        // Waiting for a single frame before calling tick so delta wont be 0 at the first frame.
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {
        // --- performance.now timing ---
        // const nowPerf = performance.now();
        // this._perfDelta = nowPerf - this._currentPerf;
        // this._currentPerf = nowPerf;
        // this._perfElapsed = nowPerf - this._startPerf;

        const currentTime: number = Date.now()
        this._delta = currentTime - this._current
        this._deltaInSeconds = this._delta * 0.001
        this._current = currentTime
        this._elapsed = this._current - this._start
        this._elapsedInSeconds = this._elapsed * 0.001

        // Fixed Update Logic
        this._accumulator += this._deltaInSeconds

        while(this._accumulator >= this._fixedDeltaTime)
        {
            EventSystem.trigger('fixedUpdateTick')
            this._accumulator -= this._fixedDeltaTime
        }

        EventSystem.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    public get time(): number { return this._elapsedInSeconds; }
    public get elapsedTime(): number { return this._elapsed; }
    public get deltaTime(): number { return this._deltaInSeconds; }
    public get fixedDeltaTime(): number { return this._fixedDeltaTime; }

    // performance.now getters
    /**
     * High-resolution timestamp (ms) for current frame
     */
    // public get performanceNow(): number { return this._currentPerf; }

    /**
     * High-resolution elapsed time (ms) since start
     */
    // public get performanceElapsed(): number { return this._perfElapsed; }

}