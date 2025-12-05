import * as PIXI from 'pixi.js';
import AnchorHelper, { AnchorPoint } from '../Utils/AnchorHelper';

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
        AnchorHelper.applyToSprite(this, anchor);

        if (parent) parent.addChild(this);
    }
}
