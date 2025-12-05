import * as PIXI from 'pixi.js';

export type AnchorPoint = 'topLeft' | 'topCenter' | 'topRight' | 'middleLeft' | 'middleCenter' | 'middleRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';

type AnchorValue = { x: number; y: number };

const ANCHOR_MAP: Record<AnchorPoint, AnchorValue> = {
    topLeft: { x: 0, y: 0 },
    topCenter: { x: 0.5, y: 0 },
    topRight: { x: 1, y: 0 },
    middleLeft: { x: 0, y: 0.5 },
    middleCenter: { x: 0.5, y: 0.5 },
    middleRight: { x: 1, y: 0.5 },
    bottomLeft: { x: 0, y: 1 },
    bottomCenter: { x: 0.5, y: 1 },
    bottomRight: { x: 1, y: 1 }
};

export default class AnchorHelper {
    static getAnchorValue(anchor: AnchorPoint): AnchorValue {
        return ANCHOR_MAP[anchor];
    }

    static applyToSprite(sprite: PIXI.Sprite | PIXI.Text, anchor: AnchorPoint): void {
        const value = ANCHOR_MAP[anchor];
        sprite.anchor.set(value.x, value.y);
    }

    static applyToPivot(graphics: PIXI.Graphics, width: number, height: number, anchor: AnchorPoint): void {
        const value = ANCHOR_MAP[anchor];
        graphics.pivot.set(width * value.x, height * value.y);
    }
}
