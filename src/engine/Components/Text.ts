import * as PIXI from 'pixi.js';
import { AnchorPoint } from './Sprite';

export class Text extends PIXI.Text {
    constructor(
        posX: number,
        posY: number,
        text: string,
        style: Partial<PIXI.TextStyle>,
        parent?: PIXI.Container,
        anchor: AnchorPoint = 'middleCenter'
    ) {
        super(text, style);

        this.position.set(posX, posY);
        this.setAnchorPoint(anchor);

        if (parent) parent.addChild(this);
    }

    protected setAnchorPoint(anchor: AnchorPoint): void {
        switch (anchor) {
            case 'topLeft':
                this.anchor.set(0, 0);
                break;
            case 'topCenter':
                this.anchor.set(0.5, 0);
                break;
            case 'topRight':
                this.anchor.set(1, 0);
                break;
            case 'middleLeft':
                this.anchor.set(0, 0.5);
                break;
            case 'middleCenter':
                this.anchor.set(0.5, 0.5);
                break;
            case 'middleRight':
                this.anchor.set(1, 0.5);
                break;
            case 'bottomLeft':
                this.anchor.set(0, 1);
                break;
            case 'bottomCenter':
                this.anchor.set(0.5, 1);
                break;
            case 'bottomRight':
                this.anchor.set(1, 1);
                break;
        }
    }
}