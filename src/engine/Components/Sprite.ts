import * as PIXI from 'pixi.js';
import AnchorHelper, { AnchorPoint } from '../Utils/AnchorHelper';

export class Sprite extends PIXI.Sprite {
    constructor(
        posX: number = 0,
        posY: number = 0,
        scaleX: number = 1,
        scaleY: number = 1,
        texturePath: string | PIXI.Texture,
        parent?: PIXI.Container,
        anchor: AnchorPoint = 'middleCenter'
    ) {
        super(typeof texturePath === 'string' ? PIXI.Texture.from(texturePath) : texturePath);

        this.position.set(posX, posY);
        this.scale.set(scaleX, scaleY);
        AnchorHelper.applyToSprite(this, anchor);

        if (parent) parent.addChild(this);
    }

    public changeTexture(texturePath: string | PIXI.Texture): void {
        this.texture = typeof texturePath === 'string' ? PIXI.Texture.from(texturePath) : texturePath;
    }
}
