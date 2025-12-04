import * as PIXI from 'pixi.js';
import { Singleton } from '../engine/Components/Singleton';
import AudioManager from './Core/AudioManager';
import TestGameObject from './World/TestGameObject';
import EventSystem from '../engine/EventSystem';
import Utilities from '../engine/Utils/Utilities';
import MuteButton from './UI/MuteButton';
import FPSCounter from './UI/FPSCounter';
import ENGINE from '../engine/Engine';

export default class GAME extends Singleton {
    public audioManager: AudioManager;
    private _worldContainer: PIXI.Container;
    private _muteButton: MuteButton | null = null;
    private _fpsCounter: FPSCounter | null = null;
    private _testGameObject: TestGameObject | null = null;

    constructor() {
        super();

        Utilities.bindMethods(this, ['handleReady']);

        this.audioManager = AudioManager.instance();

        this._worldContainer = new PIXI.Container();

        EventSystem.on('ready', this.handleReady);
        EventSystem.on('orientationChange', this.handleOrientationChange);
    }

    private handleReady(): void {
        this.setupWorld();
        this._muteButton = new MuteButton();
        this._fpsCounter = new FPSCounter();
        this._testGameObject = new TestGameObject();
    }

    private setupWorld(): void {
        ENGINE.application.add(this._worldContainer);
        this._worldContainer.zIndex = 0;
        this.centerWorld();
    }

    private centerWorld(): void {
        this._worldContainer.position.set(
            ENGINE.viewport.width / 2,
            ENGINE.viewport.height / 2
        );
    }

    private handleOrientationChange(): void {
        this.centerWorld();
    }

    public resize(): void {
        this.centerWorld();
    }

    public update(): void {
        this._fpsCounter?.update();
        this._testGameObject?.update();
    }

    public fixedUpdate(): void {}

    public add(item: PIXI.Container): void {
        this._worldContainer.addChild(item);
    }

    public addWithPosition(item: PIXI.Container, position: PIXI.Point): void {
        this.add(item);
        item.position.set(position.x, position.y);
    }

    public setPositionInWorld(item: PIXI.Container, position: PIXI.Point): void {
        item.position.set(position.x, position.y);
    }

    public remove(item: PIXI.Container): void {
        if (!this._worldContainer.children.includes(item)) return;
        this._worldContainer.removeChild(item);
    }

    public destroy(): void {
        EventSystem.off('ready', this.handleReady);
        this.audioManager.destroy();
        this._testGameObject?.destroy();
        this._muteButton?.destroy();
        this._fpsCounter?.destroy();
        ENGINE.application.remove(this._worldContainer);
        this._worldContainer.destroy({ children: true });
        super.destroy();
    }
}
