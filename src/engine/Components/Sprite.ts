import * as PIXI from 'pixi.js';

export type AnchorPoint = 'topLeft' | 'topCenter' | 'topRight' | 'middleLeft' | 'middleCenter' | 'middleRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';

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
        this.scale.set(scaleX,scaleY);
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

    public changeTexture(texturePath: string | PIXI.Texture): void {
        this.texture = typeof texturePath === 'string' ? PIXI.Texture.from(texturePath) : texturePath;
    }
}