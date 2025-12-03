import DebugManager from './DebugManager';
import Viewport from './Viewport';
import Time from './Time';
import Resources from './Resources';
import LoadingWindow from './LoadingWindow';
import Application from './Application';
import EventSystem from './EventSystem';
import Utilities from './Utils/Utilities';

import GAME from '../game/Game';
import sources from '../game/Core/sources';

declare global {
    interface Window {
        Engine: ENGINE;
    }
}

class ENGINE {
    public readonly UNIT_MULTIPLY_CONSTANT: number = 100;

    public canvas!: HTMLCanvasElement;
    public debugManager!: DebugManager;
    public viewport!: Viewport;
    public time!: Time;
    public application!: Application;
    public loadingWindow!: LoadingWindow;
    public resources!: Resources;
    public game!: GAME;

    private static _instance: ENGINE | null = null;
    private _initialized: boolean = false;

    private constructor() {}

    public static get Instance(): ENGINE {
        if (!ENGINE._instance) {
            ENGINE._instance = new ENGINE();
        }
        return ENGINE._instance;
    }

    public initialize(canvas: HTMLCanvasElement): void {
        if (this._initialized) return;

        window.Engine = this;

        this.canvas = canvas;
        this.viewport = new Viewport();
        this.time = new Time();
        this.application = new Application(0x121214);
        this.debugManager = new DebugManager();
        this.loadingWindow = new LoadingWindow();
        this.resources = new Resources(sources);
        this.game = new GAME();

        Utilities.bindMethods(this, ['resize', 'update', 'fixedUpdate']);

        EventSystem.on('resize', this.resize);
        EventSystem.on('tick', this.update);
        EventSystem.on('fixedUpdateTick', this.fixedUpdate);

        this._initialized = true;
    }

    public get isInitialized(): boolean { return this._initialized; }

    private resize(): void {
        this.application?.resize();
        this.game?.resize();
    }

    private update(): void {
        this.game?.update();
    }

    private fixedUpdate(): void {
        this.game?.fixedUpdate();
    }

    public destroy(): void {
        EventSystem.clearAll();
        this.application?.destroy();
        this.debugManager?.destroy();
        this.game?.destroy();

        this._initialized = false;
        ENGINE._instance = null;
    }
}

export default ENGINE.Instance;
