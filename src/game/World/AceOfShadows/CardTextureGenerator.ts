import * as PIXI from 'pixi.js';
import ENGINE from '../../../engine/Engine';

export default class CardTextureGenerator {
    public static createCardTexture(width: number = 100, height: number = 140): PIXI.Texture {
        const graphics = new PIXI.Graphics();

        graphics.beginFill(0x1a1a2e);
        graphics.drawRoundedRect(0, 0, width, height, 8);
        graphics.endFill();

        graphics.lineStyle(3, 0x16213e);
        graphics.drawRoundedRect(0, 0, width, height, 8);

        graphics.beginFill(0xe94560);
        graphics.moveTo(width / 2, height * 0.3);
        graphics.lineTo(width * 0.6, height * 0.5);
        graphics.lineTo(width * 0.5, height * 0.45);
        graphics.lineTo(width * 0.4, height * 0.5);
        graphics.closePath();
        graphics.endFill();

        graphics.beginFill(0x0f3460);
        graphics.drawCircle(width / 2, height * 0.7, width * 0.15);
        graphics.endFill();

        const texture = PIXI.RenderTexture.create({
            width,
            height,
            resolution: window.devicePixelRatio || 1
        });

        ENGINE.application.renderer.render(graphics, { renderTexture: texture });
        graphics.destroy();

        return texture;
    }
}
