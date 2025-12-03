import * as PIXI from 'pixi.js';

import CTAManager from "./Core/CTAManager.ts"
import AudioManager from "./Core/AudioManager.ts"
import InputManager from "./Core/InputManager.ts"
import ScoreManager from "./Core/ScoreManager.ts"
import Camera from "./World/Camera.ts"
import TestGameObject from "./World/TestGameObject.ts";
import EventSystem from "../engine/EventSystem.ts";
import Utilities from "../engine/Utils/Utilities.ts";
import { Singleton } from '../engine/Components/Singleton.ts';

export default class GAME extends Singleton {
    public ctaManager: CTAManager
    public audioManager: AudioManager
    public inputManager: InputManager
    public scoreManager: ScoreManager

    private _camera!: Camera
    private _testGameObject!: TestGameObject

    constructor() {

        super();

        Utilities.bindMethods(this, ['handleReady']);

        this.ctaManager = new CTAManager()
        this.audioManager = new AudioManager()
        this.inputManager = new InputManager()
        this.scoreManager = new ScoreManager()

        EventSystem.on('ready', this.handleReady)
    }

    private handleReady(): void {
        this._camera = new Camera();

        this._testGameObject = new TestGameObject();
    }

    public resize() {
        this._camera?.resize();
    }

    public update() {
        this.inputManager.update()

        this._testGameObject?.update();
    }

    public fixedUpdate() {

    }

    public destroy() {

        EventSystem.off('ready', this.handleReady)

        this.inputManager.destroy()
        this.audioManager.destroy()
        this._camera?.destroy()
        this._testGameObject?.destroy()
    }

    public add(item: PIXI.Container): void {
        this._camera.add(item);
    }

    public addWithPosition(item: PIXI.Container, position: PIXI.Point): void {
        this._camera.addWithPosition(item, position);
    }

    public setPositionInWorld(item: PIXI.Container, position: PIXI.Point): void {
        this._camera.setPosition(item, position);
    }

    public remove(item: PIXI.Container): void {
        this._camera.remove(item);
    }
}