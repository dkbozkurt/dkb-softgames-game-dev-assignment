import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { Singleton } from '../engine/Components/Singleton';
import AudioManager from './Core/AudioManager';
import EventSystem from '../engine/EventSystem';
import Utilities from '../engine/Utils/Utilities';
import MuteButton from './UI/MuteButton';
import FPSCounter from './UI/FPSCounter';
import ENGINE from '../engine/Engine';
import BackButton from './UI/BackButton';
import SceneManager from './Scenes/SceneManager';
import MainMenuScene from './Scenes/MainMenuScene';
import AceOfShadowsScene from './Scenes/AceOfShadowsScene';
import MagicWordsScene from './Scenes/MagicWordsScene';
import PhoenixFlameScene from './Scenes/PhoenixFlameScene';

export default class GAME extends Singleton {
    public audioManager: AudioManager;
    private _worldContainer: PIXI.Container;
    private _baseHeight: number = 1080;
    private _muteButton: MuteButton | null = null;
    private _fpsCounter: FPSCounter | null = null;
    private _backButton: BackButton | null = null;
    private _sceneManager: SceneManager;
    private _mainMenuScene: MainMenuScene;
    private _aceOfShadowsScene: AceOfShadowsScene;
    private _magicWordsScene: MagicWordsScene;
    private _phoenixFlameScene: PhoenixFlameScene;

    constructor() {
        super();

        Utilities.bindMethods(this, ['handleReady']);

        this.audioManager = AudioManager.instance();
        this._sceneManager = SceneManager.instance();

        this._worldContainer = new PIXI.Container();

        this._mainMenuScene = new MainMenuScene();
        this._aceOfShadowsScene = new AceOfShadowsScene();
        this._magicWordsScene = new MagicWordsScene();
        this._phoenixFlameScene = new PhoenixFlameScene();

        EventSystem.on('ready', this.handleReady);
    }

    private handleReady(): void {
        this.setupWorld();
        this._muteButton = new MuteButton();
        this._fpsCounter = new FPSCounter();
        this._backButton = new BackButton(this._worldContainer);
        this.setupScenes();
    }

    private setupScenes(): void {
        this.add(this._mainMenuScene);
        this.add(this._aceOfShadowsScene);
        this.add(this._magicWordsScene);
        this.add(this._phoenixFlameScene);

        this._sceneManager.registerScene('mainMenu', this._mainMenuScene);
        this._sceneManager.registerScene('aceOfShadows', this._aceOfShadowsScene);
        this._sceneManager.registerScene('magicWords', this._magicWordsScene);
        this._sceneManager.registerScene('phoenixFlame', this._phoenixFlameScene);

        this._sceneManager.switchTo('mainMenu');

        const originalSwitchTo = this._sceneManager.switchTo.bind(this._sceneManager);
        this._sceneManager.switchTo = (name: string) => {
            originalSwitchTo(name);
            this.onSceneChange(name);
        };
    }

    private onSceneChange(sceneName: string): void {
        this._backButton?.setVisible(sceneName !== 'mainMenu');
    }

    private setupWorld(): void {
        ENGINE.application.add(this._worldContainer);
        this._worldContainer.zIndex = 0;
        this.updateWorldTransform();
    }

    private updateWorldTransform(): void {
        this._worldContainer.position.set(
            ENGINE.viewport.width / 2,
            ENGINE.viewport.height / 2
        );

        const scale = ENGINE.viewport.height / this._baseHeight;
        this._worldContainer.scale.set(scale);
    }

    public resize(): void {
        this.updateWorldTransform();
    }

    public update(): void {
        TWEEN.update();
        this._fpsCounter?.update();
        this._sceneManager.update();
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
        this._sceneManager.destroy();
        this._muteButton?.destroy();
        this._fpsCounter?.destroy();
        this._backButton?.destroy();
        ENGINE.application.remove(this._worldContainer);
        this._worldContainer.destroy({ children: true });
        super.destroy();
    }
}