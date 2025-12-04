import { Singleton } from '../../engine/Components/Singleton';
import { Scene } from './Scene';

export default class SceneManager extends Singleton {
    private _scenes: Map<string, Scene> = new Map();
    private _currentScene: Scene | null = null;

    constructor() {
        super();
    }

    public registerScene(name: string, scene: Scene): void {
        this._scenes.set(name, scene);
    }

    public switchTo(name: string): void {
        const scene = this._scenes.get(name);
        if (!scene) return;

        if (this._currentScene) {
            this._currentScene.hide();
        }

        this._currentScene = scene;
        this._currentScene.show();
    }

    public update(): void {
        this._currentScene?.update();
    }

    public get currentScene(): Scene | null {
        return this._currentScene;
    }

    public destroy(): void {
        this._scenes.forEach(scene => scene.destroy({ children: true }));
        this._scenes.clear();
        this._currentScene = null;
        super.destroy();
    }
}
