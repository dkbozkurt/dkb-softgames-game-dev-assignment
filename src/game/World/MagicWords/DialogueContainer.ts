import * as PIXI from 'pixi.js';
import { Container } from '../../../engine/Components/Container';

export default class DialogueContainer extends Container {
    private _contentContainer: PIXI.Container;
    private _textQueue: string[] = [];
    private _emojiMap: Map<string, string> = new Map();
    private _displayTimeout: any = null;

    private readonly MAX_WIDTH = 500;
    private readonly LINE_HEIGHT = 45;
    private readonly FONT_SIZE = 30;

    constructor() {
        super();
        
        this._contentContainer = new PIXI.Container();
        this.addChild(this._contentContainer);
    }

    /**
     * Receives data, parses it for emojis and dialogue, and starts the sequence.
     * @param data The JSON data received from the service.
     */
    public printData(data: any): void {
        this.stopSequence();
        this._emojiMap.clear();
        this._textQueue = [];
        
        console.log('[DialogueContainer] Raw Data:', data);

        this.parseData(data);
        
        console.log('[DialogueContainer] Emojis Found:', Array.from(this._emojiMap.entries()));
        console.log('[DialogueContainer] Dialogues Queued:', this._textQueue);

        if (this._textQueue.length > 0) {
            this.showNextText();
        } else {
            this.renderSimpleText("No dialogue found in response.");
        }
    }

    /**
     * Extracts Magic Words definitions and Dialogue strings from the JSON.
     */
    private parseData(data: any): void {
        if (!data) return;

        // 1. Parse Emojis
        // The API uses "emojies" with "name" and "url"
        // We also support "magicwords" with "key" as a fallback
        const emojiList = data.emojies || data.magicwords;
        
        if (Array.isArray(emojiList)) {
            emojiList.forEach((item: any) => {
                // Support both 'name' (API) and 'key' (Legacy)
                const key = item.name || item.key;
                const url = item.url;

                if (key && url) {
                    this._emojiMap.set(key, url);
                }
            });
        }

        // 2. Parse Dialogue
        // The API uses a specific "dialogue" array containing objects with "text"
        if (data.dialogue && Array.isArray(data.dialogue)) {
            data.dialogue.forEach((item: any) => {
                if (typeof item === 'object' && item.text) {
                    // Structure: { "name": "Sheldon", "text": "..." }
                    this._textQueue.push(item.text);
                } else if (typeof item === 'string') {
                    // Structure: [ "line 1", "line 2" ]
                    this._textQueue.push(item);
                }
            });
        } 
        // Fallback: If the structure is completely different (e.g. flat array)
        else if (Array.isArray(data)) {
            data.forEach((item: any) => {
                if (typeof item === 'string') this._textQueue.push(item);
            });
        }
    }

    private showNextText(): void {
        if (this._textQueue.length === 0) {
            this.renderSimpleText("End of Dialogue");
            return;
        }

        const currentText = this._textQueue.shift() || "";
        this.renderRichText(currentText);

        // Schedule next text in 2 seconds
        this._displayTimeout = setTimeout(() => {
            this.showNextText();
        }, 2000);
    }

    /**
     * Parses the string for {key} placeholders and renders sprites/text accordingly.
     */
    private renderRichText(text: string): void {
        this._contentContainer.removeChildren(); // Clear previous line

        // Split text by placeholders, capturing the keys. 
        // Example: "Hello {sad} world" -> ["Hello ", "{sad}", " world"]
        const tokens = text.split(/({[^}]+})/g);

        let currentX = 0;
        let currentY = 0;

        tokens.forEach(token => {
            if (!token) return;

            // Check if token matches {key} pattern
            const match = token.match(/{([^}]+)}/);
            
            if (match) {
                // It is a placeholder
                const rawKey = match[1];
                const key = rawKey.trim(); // trim to handle potential spaces like { sad }
                const url = this._emojiMap.get(key);

                if (url) {
                    this.addSpriteToken(url, currentX, currentY, (w, h, newline) => {
                        if (newline) {
                            currentX = w; // reset to width of new item
                            currentY += this.LINE_HEIGHT;
                        } else {
                            currentX += w;
                        }
                    });
                } else {
                    // Placeholder without a mapping, render as raw text in RED to indicate error
                    console.warn(`[DialogueContainer] Key not found in map: ${key}`);
                    this.addTextWords(`[MISSING: ${key}]`, currentX, currentY, (x, y) => { currentX = x; currentY = y; }, 0xFF0000);
                }
            } else {
                // It is regular text
                this.addTextWords(token, currentX, currentY, (x, y) => { currentX = x; currentY = y; });
            }
        });

        // Center the entire container content
        const bounds = this._contentContainer.getLocalBounds();
        this._contentContainer.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        this._contentContainer.position.set(0, 0);
    }

    private addTextWords(
        text: string, 
        startX: number, 
        startY: number, 
        updatePos: (x: number, y: number) => void,
        color: number = 0xffffff
    ): void {
        // Split by space to handle word wrapping
        const words = text.split(/(\s+)/); // Keep spaces as tokens
        
        let currentX = startX;
        let currentY = startY;

        words.forEach(word => {
            const wordObj = new PIXI.Text(word, {
                fontFamily: 'PoppinsBold',
                fontSize: this.FONT_SIZE,
                fill: color
            });

            // Wrap if word exceeds width
            if (currentX + wordObj.width > this.MAX_WIDTH && word.trim().length > 0) {
                currentX = 0;
                currentY += this.LINE_HEIGHT;
            }

            wordObj.position.set(currentX, currentY);
            this._contentContainer.addChild(wordObj);
            
            currentX += wordObj.width;
        });

        updatePos(currentX, currentY);
    }

    private addSpriteToken(url: string, startX: number, startY: number, cb: (w: number, h: number, newline: boolean) => void): void {
        console.log(`[DialogueContainer] Adding sprite from: ${url}`);
        
        const container = new PIXI.Container();
        const size = this.FONT_SIZE + 5; 

        // 1. Add Placeholder (Red Box) - Helps verify position is correct even if image fails
        const placeholder = new PIXI.Graphics();
        placeholder.beginFill(0xFF0000); 
        placeholder.drawRect(0, 0, size, size);
        placeholder.endFill();
        placeholder.alpha = 0.5; // Transparent red
        container.addChild(placeholder);

        // 2. Load Sprite with CORS settings
        // Note: PIXI.Texture.from can take string or options in v7+
        // We assume v7 usage based on package.json
        const texture = PIXI.Texture.from(url, {
            resourceOptions: {
                crossorigin: 'anonymous' // Critical for external images
            }
        });

        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0, 0); 

        const onLoaded = () => {
            sprite.width = size;
            sprite.height = size;
            placeholder.visible = false; // Hide placeholder on success
        };

        if (texture.valid) {
            onLoaded();
        } else {
            texture.once('update', onLoaded);
            texture.once('error', (e) => {
                console.error(`[DialogueContainer] Failed texture: ${url}`, e);
                // Keep red box visible if failed
                placeholder.alpha = 1; 
            });
        }

        container.addChild(sprite);

        let finalX = startX;
        let finalY = startY;
        let newline = false;

        // 3. Layout Logic
        if (finalX + size > this.MAX_WIDTH) {
            finalX = 0;
            finalY += this.LINE_HEIGHT;
            newline = true;
        }

        // Adjust Y to align vertically with text baseline roughly
        container.position.set(finalX, finalY - (size - this.FONT_SIZE) * 0.2); 
        this._contentContainer.addChild(container);

        cb(size, size, newline);
    }

    private renderSimpleText(message: string): void {
        this._contentContainer.removeChildren();
        const text = new PIXI.Text(message, {
            fontFamily: 'PoppinsBold',
            fontSize: this.FONT_SIZE,
            fill: 0xffffff,
            align: 'center'
        });
        text.anchor.set(0.5);
        this._contentContainer.addChild(text);
    }

    private stopSequence(): void {
        if (this._displayTimeout) {
            clearTimeout(this._displayTimeout);
            this._displayTimeout = null;
        }
    }

    public destroy(options?: boolean | any): void {
        this.stopSequence();
        super.destroy(options);
    }
}