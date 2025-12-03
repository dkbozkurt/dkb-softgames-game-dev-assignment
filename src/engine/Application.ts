import * as PIXI from 'pixi.js';
import ENGINE from './Engine';

export default class Application extends PIXI.Application {
    constructor(backgroundColor: PIXI.ColorSource = 0xcfeffc) {
        super({
            view: ENGINE.canvas as HTMLCanvasElement,
            resizeTo: window,
            antialias: true,
            backgroundColor
        });
    }

    public add(item: PIXI.DisplayObject): void {
        this.stage.addChild(item);
    }

    public remove(item: PIXI.DisplayObject): void {
        if (!this.stage.children.includes(item)) return;
        this.stage.removeChild(item);
    }

    public setInteractivity(status: boolean): void {
        this.stage.eventMode = status ? 'static' : 'none';
        this.stage.interactive = status;
    }
}
