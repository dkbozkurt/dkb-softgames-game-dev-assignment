import * as PIXI from 'pixi.js'
import ENGINE from './Engine.ts'
import EventSystem from './EventSystem.ts';

export default class Resources {
    private readonly _sources: engine.AssetSource[];
    private readonly _items: { [key: string]: any } = {};
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
            switch (source.type) {
                case 'texture':
                case 'json':
                case 'font':
                    {
                        const file = await PIXI.Assets.load(source.path);
                        this.sourceLoaded(source, file);
                        break;
                    }
                case 'audio': {
                    const file = new Audio(source.path);
                    this.sourceLoaded(source, file);
                    break;
                }
            }
        }
    }

    private sourceLoaded(source: engine.AssetSource, file: any) {
        this._items[source.name] = file;
        this._loaded++;

        const progressRatio = this._loaded / this._toLoad;
        ENGINE.loadingWindow.updateLoadingProgress(progressRatio);

        if (this._loaded === this._toLoad) {
            console.log('Loading finished');
            ENGINE.loadingWindow.completed();
            EventSystem.trigger('ready');
        }
    }

    public getItemPath(sourceName: game.AssetSourceName): string {
        var filePath = this.sources.find(source => source.name === sourceName)?.path;

        return filePath as string;
    }

    public get sources(): engine.AssetSource[] {
        return this._sources;
    }

    public get items(): { [key: string]: any } {
        return this._items;
    }

    public get toLoad(): number {
        return this._toLoad;
    }

    public get loaded(): number {
        return this._loaded;
    }
}
