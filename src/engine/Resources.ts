import * as PIXI from 'pixi.js';
import ENGINE from './Engine';
import EventSystem from './EventSystem';

export default class Resources {
    private readonly _sources: engine.AssetSource[];
    private readonly _items: Record<string, unknown> = {};
    private readonly _toLoad: number;
    private _loaded: number = 0;

    constructor(sources: engine.AssetSource[]) {
        this._sources = sources;
        this._toLoad = this._sources.length;

        this.startLoading().catch(error => {
            console.error('Error while loading resources:', error);
        });
    }

    private async startLoading(): Promise<void> {
        for (const source of this._sources) {
            let file: unknown;

            if (source.type === 'audio') {
                file = new Audio(source.path);
            } else {
                file = await PIXI.Assets.load(source.path);
            }

            this.sourceLoaded(source, file);
        }
    }

    private sourceLoaded(source: engine.AssetSource, file: unknown): void {
        this._items[source.name] = file;
        this._loaded++;

        const progressRatio = this._loaded / this._toLoad;
        ENGINE.loadingWindow.updateLoadingProgress(progressRatio);

        if (this._loaded === this._toLoad) {
            ENGINE.loadingWindow.completed();
            EventSystem.trigger('ready');
        }
    }

    public getItemPath(sourceName: game.AssetSourceName): string {
        const source = this._sources.find(s => s.name === sourceName);
        return source?.path ?? '';
    }

    public get sources(): engine.AssetSource[] { return this._sources; }
    public get items(): Record<string, unknown> { return this._items; }
    public get toLoad(): number { return this._toLoad; }
    public get loaded(): number { return this._loaded; }
}
