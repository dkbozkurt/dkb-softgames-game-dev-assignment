import * as PIXI from 'pixi.js'
import ENGINE from '../../engine/Engine.ts';
import AudioManager from "./AudioManager.ts";
import CTAManager from "./CTAManager.ts";
import EventSystem from '../../engine/EventSystem.ts';
import Utilities from '../../engine/Utils/Utilities.ts';
import { Singleton } from '../../engine/Components/Singleton.ts';

export default class InputManager extends Singleton{
    private _ctaManager!: CTAManager
    private _audioManager!: AudioManager

    private _canGetInput: boolean = true;
    private _isFirstClickDetected: boolean = false;
    private _clickCount: number = 0;
    private _isReadyForStoreCallClicks: boolean = false;

    // Cached references for better performance
    private _isPointerDown: boolean = false;
    private _lastPointerEvent: PointerEvent | null = null;

    constructor() {
        super();

        // Bind all event handlers for performance
        Utilities.bindMethods(this, [
            'handleClick',
            'handlePointerDown',
            'handlePointerUp',
            'handlePointerMove'
        ]);

        this._ctaManager = new CTAManager();
        this._audioManager = new AudioManager();

        this.setupEventListeners();
    }

    /**
     * Setup all DOM event listeners
     * Centralized for better organization
     */
    private setupEventListeners(): void {
        document.addEventListener('click', this.handleClick);
        document.addEventListener('pointerdown', this.handlePointerDown);
        document.addEventListener('pointerup', this.handlePointerUp);
        document.addEventListener('pointermove', this.handlePointerMove);
    }

    /**
     * Remove all DOM event listeners
     * Centralized for better cleanup
     */
    private removeEventListeners(): void {
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('pointerdown', this.handlePointerDown);
        document.removeEventListener('pointerup', this.handlePointerUp);
        document.removeEventListener('pointermove', this.handlePointerMove);
    }

    // ===== Public API =====

    public setCanGetInput(status: boolean): void {
        this._canGetInput = status;
    }

    public setReadyForStoreCallClicksStatus(status: boolean): void {
        this._isReadyForStoreCallClicks = status;
    }

    public get isPointerDown(): boolean {
        return this._isPointerDown;
    }

    public get clickCount(): number {
        return this._clickCount;
    }

    public getLastPointerEvent(): PointerEvent | null {
        return this._lastPointerEvent;
    }

    /**
     * Get pointer position in global (world) coordinates
     * Converts screen coordinates to PIXI world coordinates
     */
    public getPointerGlobalPosition(): PIXI.PointData | null {
        if (!this._lastPointerEvent) return null;

        const stage = ENGINE.application.stage;
        const renderer = ENGINE.application.renderer;

        // Map pointer position to canvas coordinates
        const globalPos = new PIXI.Point();
        renderer.events.mapPositionToPoint(
            globalPos,
            this._lastPointerEvent.clientX,
            this._lastPointerEvent.clientY
        );

        // Transform to world coordinates (accounting for stage transforms)
        return stage.toLocal(globalPos);
    }

    /**
     * Get pointer position in screen (canvas) coordinates
     */
    public getPointerScreenPosition(): PIXI.Point | null {
        if (!this._lastPointerEvent) return null;

        const canvas = ENGINE.application.canvas as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();

        return new PIXI.Point(
            this._lastPointerEvent.clientX - rect.left,
            this._lastPointerEvent.clientY - rect.top
        );
    }

    // ===== Event Handlers =====

    private handleFirstClick(): void {
        if (this._isFirstClickDetected) return;
        this._isFirstClickDetected = true;

        this._audioManager.setIsActiveForAudios(true);
        EventSystem.trigger('firstClick');
    }

    private handleClick(e: MouseEvent): void {
        if (!this._canGetInput) return;

        this.handleStoreCall();
        this.handleFirstClick();

        EventSystem.trigger('onClick', e);
    }

    private handlePointerDown(e: PointerEvent): void {
        if (!this._canGetInput) return;

        this._isPointerDown = true;
        this._lastPointerEvent = e;
        this._clickCount++;

        this.handleStoreCall();

        EventSystem.trigger('onPointerDown', e);

        // Only listen to pointermove when pointer is down (optimization)
        ENGINE.application.stage.on('pointermove', this.handlePointerMove);
    }

    private handlePointerUp(e: PointerEvent): void {
        if (!this._canGetInput) return;

        this._isPointerDown = false;
        this._lastPointerEvent = e;

        this.handleStoreCall();

        EventSystem.trigger('onPointerUp', e);

        // Stop listening to pointermove when pointer is up (optimization)
        ENGINE.application.stage.off('pointermove', this.handlePointerMove);
    }

    private handlePointerMove(e: PointerEvent): void {
        if (!this._canGetInput) return;

        this._lastPointerEvent = e;

        this.handleStoreCall();

        EventSystem.trigger('onPointerMove', e);
    }

    /**
     * Centralized store call logic
     * DRY principle - avoid repeating this in every handler
     */
    private handleStoreCall(): void {
        if (this._isReadyForStoreCallClicks) {
            this._ctaManager.callStore();
        }
    }

    // ===== Lifecycle Methods =====

    public update(): void {
        // Add any per-frame input processing here if needed
    }

    public destroy(): void {
        this.removeEventListeners();

        // Clean up stage listeners
        ENGINE.application.stage.off('pointermove', this.handlePointerMove);

        // Reset state
        this._canGetInput = false;
        this._isFirstClickDetected = false;
        this._clickCount = 0;
        this._isPointerDown = false;
        this._lastPointerEvent = null;
    }

}