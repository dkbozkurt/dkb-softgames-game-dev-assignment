import * as PIXI from 'pixi.js';

export default class SpriteSheetLoader {
    static load(
        texture: PIXI.Texture,
        cols: number,
        rows: number,
        onComplete: (frames: PIXI.Texture[]) => void
    ): void {
        if (texture.baseTexture.valid) {
            onComplete(this.slice(texture, cols, rows));
        } else {
            texture.baseTexture.once('loaded', () => onComplete(this.slice(texture, cols, rows)));
        }
    }

    private static slice(baseTexture: PIXI.Texture, cols: number, rows: number): PIXI.Texture[] {
        const frameWidth = baseTexture.width / cols;
        const frameHeight = baseTexture.height / rows;
        const frames: PIXI.Texture[] = [];

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const rect = new PIXI.Rectangle(x * frameWidth, y * frameHeight, frameWidth, frameHeight);
                frames.push(new PIXI.Texture(baseTexture.baseTexture, rect));
            }
        }

        return frames;
    }
}