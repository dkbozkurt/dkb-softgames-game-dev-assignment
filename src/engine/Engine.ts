import DebugManager from "./DebugManager.ts"
import Viewport from "./Viewport.ts"
import Time from "./Time.ts"
import Resources from './Resources.ts'
import LoadingWindow from './LoadingWindow.ts';
import Application from "./Application.ts";

import GAME from '../game/Game.ts'
import sources from '../game/Core/sources.ts'
import EventSystem from "./EventSystem.ts";
import Utilities from "./Utils/Utilities.ts";

declare global {
    interface Window {
        Engine: ENGINE;
    }
}

class ENGINE {
    private static _instance: ENGINE | null = null;
    private _initialized: boolean = false;

    public canvas!: HTMLCanvasElement
    public debugManager!: DebugManager
    public viewport!: Viewport
    public time!: Time
    public application!: Application
    public loadingWindow!: LoadingWindow

    public game!: GAME
    public resources!: Resources

    // I dont know why this needs to be 100, most probably for measurement differences between pixi and unity but it is the correct way to set values based on Unity.
    public readonly UNIT_MULTIPLY_CONSTANT: number = 100;

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    public static get Instance(): ENGINE {
        if (!ENGINE._instance) {
            ENGINE._instance = new ENGINE();
        }
        return ENGINE._instance;
    }

    public initialize(canvas?: HTMLCanvasElement): void {
        if (this._initialized) {
            console.warn("Engine is already initialized!");
            return;
        }

        // Make it globally accessible
        window.Engine = this;

        this.canvas = canvas as HTMLCanvasElement
        this.viewport = new Viewport()
        this.time = new Time()
        this.application = new Application(0x121214)
        this.debugManager = new DebugManager()
        this.loadingWindow = new LoadingWindow()
        this.resources = new Resources(sources)

        this.game = new GAME()

        Utilities.bindMethods(this, ['resize', 'update', 'fixedUpdate'])

        EventSystem.on('resize', this.resize)
        EventSystem.on('tick', this.update)
        EventSystem.on('fixedUpdateTick', this.fixedUpdate)

        this.debugPanel()
        this._initialized = true;

        console.log("Engine initialized successfully!");
    }

    public get isInitialized(): boolean {
        return this._initialized;
    }

    private resize = (data?: any) => {
        // console.log(`Resizing to: ${data.width}x${data.height}, pixelRatio: ${data.pixelRatio}`);
        this.application?.resize();
        this.game?.resize();
    }

    private update = () => {
        this.game.update()
    }

    private fixedUpdate() {
        this.game.fixedUpdate()
    }

    public destroy() {
        EventSystem.clearAll()

        if (this.application) {
            this.application.destroy()
        }

        if (this.debugManager) {
            this.debugManager.destroy()
        }

        this.game.destroy()

        this._initialized = false;
        ENGINE._instance = null;
        window.Engine = undefined as any;
    }

    private debugPanel() {
        if (!this.debugManager.isActive) return;
    }
}

// Export the singleton instance
export default ENGINE.Instance;