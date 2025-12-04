import * as PIXI from 'pixi.js';
import { AnchorPoint } from './Sprite';

export type ShapeType = 'rectangle' | 'circle' | 'roundedRectangle';

export type GraphicConfig = {
    shape: ShapeType;
    fill: number;
    alpha?: number;
    radius?: number;
};

export class Graphic extends PIXI.Graphics {
    protected _width: number;
    protected _height: number;
    protected _config: GraphicConfig;

    constructor(
        posX: number,
        posY: number,
        width: number,
        height: number,
        config: GraphicConfig,
        parent?: PIXI.Container,
        anchor: AnchorPoint = 'middleCenter'
    ) {
        super();

        this._width = width;
        this._height = height;
        this._config = config;

        this.alpha = config.alpha ?? 1;
        this.draw();
        this.setAnchorPoint(posX, posY, anchor);

        if (parent) parent.addChild(this);
    }

    protected draw(): void {
        const { shape, fill, radius } = this._config;

        this.beginFill(fill);

        switch (shape) {
            case 'rectangle':
                this.drawRect(0, 0, this._width, this._height);
                break;
            case 'circle':
                this.drawCircle(0, 0, radius ?? this._width / 2);
                break;
            case 'roundedRectangle':
                this.drawRoundedRect(0, 0, this._width, this._height, radius ?? 10);
                break;
        }

        this.endFill();
    }

    protected setAnchorPoint(posX: number, posY: number, anchor: AnchorPoint): void {
        switch (anchor) {
            case 'topLeft':
                this.pivot.set(0, 0);
                break;
            case 'topCenter':
                this.pivot.set(this._width / 2, 0);
                break;
            case 'topRight':
                this.pivot.set(this._width, 0);
                break;
            case 'middleLeft':
                this.pivot.set(0, this._height / 2);
                break;
            case 'middleCenter':
                this.pivot.set(this._width / 2, this._height / 2);
                break;
            case 'middleRight':
                this.pivot.set(this._width, this._height / 2);
                break;
            case 'bottomLeft':
                this.pivot.set(0, this._height);
                break;
            case 'bottomCenter':
                this.pivot.set(this._width / 2, this._height);
                break;
            case 'bottomRight':
                this.pivot.set(this._width, this._height);
                break;
        }

        this.position.set(posX, posY);
    }
}