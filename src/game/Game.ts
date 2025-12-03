import * as PIXI from 'pixi.js';
import { Singleton } from '../engine/Components/Singleton';
import AudioManager from './Core/AudioManager';
import Camera from './World/Camera';
import TestGameObject from './World/TestGameObject';
import EventSystem from '../engine/EventSystem';
import Utilities from '../engine/Utils/Utilities';
import MuteButton from './UI/MuteButton';

export default class GAME extends Singleton {
    public audioManager: AudioManager;

    private _muteButton: MuteButton | null = null;
    private _camera: Camera | null = null;
    private _testGameObject: TestGameObject | null = null;

    constructor() {
        super();

        Utilities.bindMethods(this, ['handleReady']);

        this.audioManager = AudioManager.instance();
        EventSystem.on('ready', this.handleReady);
    }

    private handleReady(): void {
        this._camera = new Camera();
        this._muteButton = new MuteButton();
        this._testGameObject = new TestGameObject();
    }

    public resize(): void {
        this._camera?.resize();
    }

    public update(): void {
        this._testGameObject?.update();
    }

    public fixedUpdate(): void {}

    public add(item: PIXI.Container): void {
        this._camera?.add(item);
    }

    public addWithPosition(item: PIXI.Container, position: PIXI.Point): void {
        this._camera?.addWithPosition(item, position);
    }

    public setPositionInWorld(item: PIXI.Container, position: PIXI.Point): void {
        this._camera?.setPosition(item, position);
    }

    public remove(item: PIXI.Container): void {
        this._camera?.remove(item);
    }

    public destroy(): void {
        EventSystem.off('ready', this.handleReady);
        this.audioManager.destroy();
        this._camera?.destroy();
        this._testGameObject?.destroy();
        this._muteButton?.destroy();
        super.destroy();
    }
}
