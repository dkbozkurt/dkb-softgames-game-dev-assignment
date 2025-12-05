import * as PIXI from 'pixi.js';
import AnchorHelper, { AnchorPoint } from '../Utils/AnchorHelper';

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
        AnchorHelper.applyToPivot(this, width, height, anchor);
        this.position.set(posX, posY);

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
}
