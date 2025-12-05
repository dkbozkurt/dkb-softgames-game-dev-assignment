import * as PIXI from 'pixi.js';
import { GameConfig } from '../../Config/GameConfig';

type TextToken = {
    type: 'text' | 'emoji';
    content: string;
    isBold?: boolean;
};

export default class RichTextRenderer {
    private _emojiMap: Map<string, string>;
    private _config = GameConfig.MagicWords.Text;

    constructor(emojiMap: Map<string, string>) {
        this._emojiMap = emojiMap;
    }

    /**
     * Renders text mixed with emojis into the container.
     * @returns The total height of the rendered text block and the list of created objects for animation.
     */
    public render(
        container: PIXI.Container,
        text: string,
        startX: number,
        startY: number,
        align: 'left' | 'right' | 'center',
        maxWidth: number
    ): { height: number; items: PIXI.DisplayObject[] } {
        
        const tokens = this.tokenize(text);
        const lines = this.measureLines(tokens, maxWidth);
        return this.positionElements(container, lines, startX, startY, align, maxWidth);
    }

    private tokenize(text: string): TextToken[] {
        const result: TextToken[] = [];
        // Split by {emojiKey}
        const parts = text.split(/({[^}]+})/g);

        parts.forEach(part => {
            if (!part) return;

            const emojiMatch = part.match(/{([^}]+)}/);
            if (emojiMatch) {
                const key = emojiMatch[1].trim();
                const url = this._emojiMap.get(key);
                if (url) result.push({ type: 'emoji', content: url });
            } else {
                this.tokenizeBoldText(part, result);
            }
        });

        return result;
    }

    private tokenizeBoldText(text: string, result: TextToken[]): void {
        // Split by *bold text*
        const boldParts = text.split(/(\*[^*]+\*)/g);

        boldParts.forEach(part => {
            if (!part) return;

            let isBold = false;
            let content = part;

            if (content.startsWith('*') && content.endsWith('*') && content.length > 2) {
                isBold = true;
                content = content.substring(1, content.length - 1);
            }

            // Split by spaces to handle wrapping
            content.split(/(\s+)/).forEach(word => {
                if (word === '') return;
                result.push({ type: 'text', content: word, isBold });
            });
        });
    }

    private measureLines(tokens: TextToken[], maxWidth: number): { width: number; items: PIXI.DisplayObject[] }[] {
        const lines: { width: number; items: PIXI.DisplayObject[] }[] = [];
        let currentLineItems: PIXI.DisplayObject[] = [];
        let currentLineWidth = 0;

        tokens.forEach(token => {
            const displayObject = this.createDisplayObject(token);
            if (!displayObject) return;

            const itemWidth = this.getItemWidth(displayObject);

            // Wrap if exceeding max width (and not the first item)
            if (currentLineWidth + itemWidth > maxWidth && currentLineWidth > 0) {
                lines.push({ width: currentLineWidth, items: currentLineItems });
                currentLineItems = [];
                currentLineWidth = 0;
            }

            currentLineItems.push(displayObject);
            currentLineWidth += itemWidth;
        });

        if (currentLineItems.length > 0) {
            lines.push({ width: currentLineWidth, items: currentLineItems });
        }

        return lines;
    }

    private createDisplayObject(token: TextToken): PIXI.DisplayObject | null {
        if (token.type === 'text') {
            return new PIXI.Text(token.content, {
                fontFamily: this._config.FontFamily,
                fontSize: this._config.FontSize,
                fill: this._config.Color,
                fontWeight: token.isBold ? 'bold' : 'normal'
            });
        }

        if (token.type === 'emoji') {
            return this.createEmojiSprite(token.content);
        }

        return null;
    }

    private createEmojiSprite(url: string): PIXI.Container {
        const container = new PIXI.Container();
        const size = this._config.FontSize + 5;
        const texture = PIXI.Texture.from(url, { resourceOptions: { crossorigin: 'anonymous' } });
        const sprite = new PIXI.Sprite(texture);
        
        // Hide initially until loaded to prevent popping
        sprite.visible = false; 

        const onLoaded = () => {
            sprite.width = size;
            sprite.height = size;
            sprite.visible = true;
        };

        if (texture.valid) onLoaded();
        else texture.once('update', onLoaded);

        sprite.anchor.set(0, 0.15); // Slight offset for vertical alignment with text
        container.addChild(sprite);
        return container;
    }

    private getItemWidth(item: PIXI.DisplayObject): number {
        return item instanceof PIXI.Text ? item.width : this._config.FontSize + 5;
    }

    private positionElements(
        container: PIXI.Container,
        lines: { width: number; items: PIXI.DisplayObject[] }[],
        startX: number,
        startY: number,
        align: 'left' | 'right' | 'center',
        maxWidth: number
    ): { height: number; items: PIXI.DisplayObject[] } {
        let currentY = startY;
        const allItems: PIXI.DisplayObject[] = [];

        lines.forEach(line => {
            let currentX = this.calculateLineStartX(startX, maxWidth, line.width, align);

            line.items.forEach(item => {
                item.position.set(currentX, currentY);
                container.addChild(item);
                allItems.push(item);
                currentX += this.getItemWidth(item);
            });

            currentY += this._config.LineHeight;
        });

        return { height: currentY, items: allItems };
    }

    private calculateLineStartX(startX: number, maxWidth: number, lineWidth: number, align: string): number {
        switch (align) {
            case 'right': return startX + maxWidth - lineWidth;
            case 'center': return startX + (maxWidth - lineWidth) / 2;
            default: return startX;
        }
    }
}