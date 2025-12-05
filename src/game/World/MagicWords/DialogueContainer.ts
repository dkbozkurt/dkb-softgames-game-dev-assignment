import * as PIXI from 'pixi.js';
import { Container } from '../../../engine/Components/Container';

type AvatarData = {
    name: string;
    url: string;
    position: 'left' | 'right';
};

type DialogueItem = {
    name: string;
    text: string;
};

export default class DialogueContainer extends Container {
    private _dialogueQueue: DialogueItem[] = [];
    private _activeBubbles: PIXI.Container[] = []; // Stores the visual message bubbles

    private _emojiMap: Map<string, string> = new Map();
    private _avatarMap: Map<string, AvatarData> = new Map();
    private _displayTimeout: any = null;

    private readonly CONTENT_WIDTH = 500;
    private readonly AVATAR_SIZE = 100;
    private readonly PADDING = 20;
    private readonly BUBBLE_SPACING = 60; // Increased spacing between messages

    private readonly LINE_HEIGHT = 40;
    private readonly FONT_SIZE = 24;

    private readonly EACH_CONVERSATION_DURATION = 3000;

    constructor() {
        super();
        this.showLoading();
    }

    // Call this immediately before fetching data to avoid empty screen
    public showLoading(): void {
        this.reset();
        const loadingLabel = this.createSystemMessage("... Connecting to Magic Words ...");
        this.addChild(loadingLabel);
    }

    public printData(data: any): void {
        this.reset();
        this._emojiMap.clear();
        this._avatarMap.clear();
        this._dialogueQueue = [];

        console.log('[DialogueContainer] Raw Data:', data);

        this.parseData(data);

        if (this._dialogueQueue.length > 0) {
            this.showConversationStart();
        } else {
            this.renderSimpleMessage("No dialogue found.");
        }
    }

    public reset(): void {
        this.stopSequence();
        // Destroy all active bubbles properly
        this._activeBubbles.forEach(bubble => bubble.destroy({ children: true }));
        this._activeBubbles = [];
        this.removeChildren();
    }

    private parseData(data: any): void {
        if (!data) return;

        // 1. Parse Emojis
        const emojiList = data.emojies || data.magicwords;
        if (Array.isArray(emojiList)) {
            emojiList.forEach((item: any) => {
                const key = item.name || item.key;
                const url = item.url;
                if (key && url) this._emojiMap.set(key, url);
            });
        }

        // 2. Parse Avatars
        if (data.avatars && Array.isArray(data.avatars)) {
            data.avatars.forEach((item: any) => {
                if (item.name && item.url) {
                    this._avatarMap.set(item.name, {
                        name: item.name,
                        url: item.url,
                        position: item.position || 'left'
                    });
                }
            });
        }

        // 3. Parse Dialogue
        if (data.dialogue && Array.isArray(data.dialogue)) {
            data.dialogue.forEach((item: any) => {
                if (typeof item === 'object' && item.text) {
                    this._dialogueQueue.push({
                        name: item.name || "Unknown",
                        text: item.text
                    });
                } else if (typeof item === 'string') {
                    this._dialogueQueue.push({
                        name: "Unknown",
                        text: item
                    });
                }
            });
        }
    }

    private showConversationStart(): void {
        this.reset(); // Clear everything

        const startLabel = this.createSystemMessage("... Conversation starting ...");
        this.addChild(startLabel); // Add directly, center of screen

        this._displayTimeout = setTimeout(() => {
            // Remove start label before beginning chat flow
            this.removeChild(startLabel);
            startLabel.destroy();
            this.showNextDialogue();
        }, this.EACH_CONVERSATION_DURATION/2);
    }

    private showConversationEnd(): void {
        this.reset(); // Clear chat history

        const endLabel = this.createSystemMessage("... Conversation ended ...");
        this.addChild(endLabel); // Add directly, center of screen
    }

    private showNextDialogue(): void {
        if (this._dialogueQueue.length === 0) {
            this.showConversationEnd();
            return;
        }

        const item = this._dialogueQueue.shift()!;

        // Create the visual bubble for this dialogue item
        const bubble = this.createDialogueBubble(item);
        this.addNewBubble(bubble);

        this._displayTimeout = setTimeout(() => {
            this.showNextDialogue();
        }, this.EACH_CONVERSATION_DURATION);
    }

    /**
     * Adds a new bubble to the scene, pushes old ones up, and fades them.
     */
    private addNewBubble(newBubble: PIXI.Container): void {
        // 1. Add new bubble to the container
        this.addChild(newBubble);

        // Get the height of the new bubble to calculate shift
        const bounds = newBubble.getLocalBounds();
        const newBubbleHeight = bounds.height;

        // Position new bubble at 0,0 (center)
        newBubble.position.set(0, 0);
        newBubble.alpha = 1;

        // 2. Shift existing bubbles UP and Fade
        const shiftAmount = newBubbleHeight + this.BUBBLE_SPACING;

        // Iterate backwards to safely remove items if needed
        for (let i = this._activeBubbles.length - 1; i >= 0; i--) {
            const bubble = this._activeBubbles[i];

            // Move up
            bubble.y -= shiftAmount;

            // Decrease Alpha
            bubble.alpha *= 0.5; // Faster fade

            // Logic to fully fade out the 4th bubble
            const age = this._activeBubbles.length - i;

            if (age >= 3) { // 3rd previous bubble (so 4th total on screen)
                bubble.alpha = 0;
                bubble.visible = false;
            }
        }

        // 3. Add to tracking array
        this._activeBubbles.push(newBubble);

        // Optional: Cleanup completely if way off screen or too old
        if (this._activeBubbles.length > 5) {
            const oldBubble = this._activeBubbles.shift();
            if (oldBubble) oldBubble.destroy({ children: true });
        }
    }

    /**
     * Creates a single self-contained Container for a dialogue entry.
     */
    private createDialogueBubble(item: DialogueItem): PIXI.Container {
        const bubbleContainer = new PIXI.Container();

        const avatarData = this._avatarMap.get(item.name);
        let alignment: 'left' | 'right' | 'center' = 'center';

        if (avatarData) {
            alignment = avatarData.position === 'right' ? 'right' : 'left';
        }

        // 1. Render Avatar
        if (avatarData) {
            this.createAvatarSprite(bubbleContainer, avatarData.url, alignment === 'right');
        }

        // 2. Render Text Content
        let textMaxWidth = this.CONTENT_WIDTH;
        let textStartX = 0;

        if (alignment === 'left') {
            textStartX = this.AVATAR_SIZE + this.PADDING;
            textMaxWidth = this.CONTENT_WIDTH - this.AVATAR_SIZE - this.PADDING;
        } else if (alignment === 'right') {
            textStartX = 0;
            textMaxWidth = this.CONTENT_WIDTH - this.AVATAR_SIZE - this.PADDING;
        } else {
            textStartX = 0;
            textMaxWidth = this.CONTENT_WIDTH;
        }

        const textBlockHeight = this.renderRichText(
            bubbleContainer,
            item.text,
            textStartX,
            0,
            alignment,
            textMaxWidth
        );

        // 3. Render Name Label
        const nameLabel = new PIXI.Text(item.name, {
            fontFamily: 'PoppinsBold',
            fontSize: 18,
            fill: 0xAAAAAA,
            fontStyle: 'italic',
            align: alignment === 'right' ? 'right' : (alignment === 'center' ? 'center' : 'left')
        });

        nameLabel.y = textBlockHeight + 5;

        if (alignment === 'right') {
            nameLabel.x = textMaxWidth - nameLabel.width;
        } else if (alignment === 'left') {
            nameLabel.x = textStartX;
        } else {
            nameLabel.x = (this.CONTENT_WIDTH - nameLabel.width) / 2;
        }

        bubbleContainer.addChild(nameLabel);

        // Center the content within the bubble container's coordinate system
        const bounds = bubbleContainer.getLocalBounds();
        bubbleContainer.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);

        return bubbleContainer;
    }

    private createSystemMessage(text: string): PIXI.Container {
        const container = new PIXI.Container();
        const label = new PIXI.Text(text, {
            fontFamily: 'PoppinsBold',
            fontSize: 24,
            fill: 0xAAAAAA,
            fontStyle: 'italic',
            align: 'center'
        });
        label.anchor.set(0.5);
        label.position.set(0, 0); // At 0,0 relative to container
        container.addChild(label);

        return container;
    }

    private renderRichText(targetContainer: PIXI.Container, text: string, startX: number, startY: number, align: 'left' | 'right' | 'center', maxWidth: number): number {
        const tokens = this.tokenizeText(text);
        const lines: { width: number, items: PIXI.DisplayObject[] }[] = [];

        let currentLineItems: PIXI.DisplayObject[] = [];
        let currentLineWidth = 0;

        // Pass 1: Measure
        tokens.forEach(token => {
            let displayObject: PIXI.DisplayObject | null = null;

            if (token.type === 'text') {
                const style: any = {
                    fontFamily: 'PoppinsBold',
                    fontSize: this.FONT_SIZE,
                    fill: 0xffffff
                };
                if (token.isBold) style.fontWeight = 'bold';

                displayObject = new PIXI.Text(token.content, style);
            }
            else if (token.type === 'emoji') {
                displayObject = this.createEmojiSprite(token.content);
            }

            if (displayObject) {
                const itemWidth = (displayObject instanceof PIXI.Text) ? displayObject.width : (this.FONT_SIZE + 5);

                if (currentLineWidth + itemWidth > maxWidth && currentLineWidth > 0) {
                    lines.push({ width: currentLineWidth, items: currentLineItems });
                    currentLineItems = [];
                    currentLineWidth = 0;
                }

                currentLineItems.push(displayObject);
                currentLineWidth += itemWidth;
            }
        });

        if (currentLineItems.length > 0) {
            lines.push({ width: currentLineWidth, items: currentLineItems });
        }

        // Pass 2: Position
        let currentY = startY;

        lines.forEach(line => {
            let currentX = startX;

            if (align === 'right') {
                currentX = (startX + maxWidth) - line.width;
            } else if (align === 'center') {
                currentX = startX + (maxWidth - line.width) / 2;
            }

            line.items.forEach(item => {
                item.position.set(currentX, currentY);
                targetContainer.addChild(item);

                const itemWidth = (item instanceof PIXI.Text) ? item.width : (this.FONT_SIZE + 5);
                currentX += itemWidth;
            });

            currentY += this.LINE_HEIGHT;
        });

        return currentY;
    }

    private tokenizeText(text: string): { type: 'text' | 'emoji', content: string, isBold?: boolean }[] {
        const result: { type: 'text' | 'emoji', content: string, isBold?: boolean }[] = [];
        const parts = text.split(/({[^}]+})/g);

        parts.forEach(part => {
            if (!part) return;

            const emojiMatch = part.match(/{([^}]+)}/);
            if (emojiMatch) {
                const key = emojiMatch[1].trim();
                const url = this._emojiMap.get(key);
                if (url) {
                    result.push({ type: 'emoji', content: url });
                }
                // else ignore missing
            } else {
                const boldParts = part.split(/(\*[^*]+\*)/g);
                boldParts.forEach(boldPart => {
                    if (!boldPart) return;
                    let isBold = false;
                    let content = boldPart;
                    if (content.startsWith('*') && content.endsWith('*') && content.length > 2) {
                        isBold = true;
                        content = content.substring(1, content.length - 1);
                    }
                    const words = content.split(/(\s+)/);
                    words.forEach(word => {
                        result.push({ type: 'text', content: word, isBold });
                    });
                });
            }
        });
        return result;
    }

    private createEmojiSprite(url: string): PIXI.Container {
        const container = new PIXI.Container();
        const size = this.FONT_SIZE + 5;
        const texture = PIXI.Texture.from(url, { resourceOptions: { crossorigin: 'anonymous' } });
        const sprite = new PIXI.Sprite(texture);
        sprite.visible = false;

        const onLoaded = () => {
            sprite.width = size;
            sprite.height = size;
            sprite.visible = true;
        };

        if (texture.valid) onLoaded();
        else texture.once('update', onLoaded);

        sprite.anchor.set(0, 0.15);
        container.addChild(sprite);
        return container;
    }

    private createAvatarSprite(parent: PIXI.Container, url: string, isRight: boolean): void {
        const container = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(0xFFFFFF, 0.1);
        bg.drawRoundedRect(0, 0, this.AVATAR_SIZE, this.AVATAR_SIZE, 10);
        bg.endFill();
        container.addChild(bg);

        const texture = PIXI.Texture.from(url, { resourceOptions: { crossorigin: 'anonymous' } });
        const sprite = new PIXI.Sprite(texture);
        sprite.visible = false;

        const onLoaded = () => {
            sprite.width = this.AVATAR_SIZE;
            sprite.height = this.AVATAR_SIZE;
            sprite.visible = true;
        };

        if (texture.valid) onLoaded();
        else texture.once('update', onLoaded);

        container.addChild(sprite);

        const xPos = isRight ? (this.CONTENT_WIDTH - this.AVATAR_SIZE) : 0;
        container.position.set(xPos, 0);

        parent.addChild(container);
    }

    private renderSimpleMessage(message: string): void {
        this.removeChildren();
        const text = new PIXI.Text(message, {
            fontFamily: 'PoppinsBold',
            fontSize: this.FONT_SIZE,
            fill: 0xffffff,
            align: 'center'
        });
        text.anchor.set(0.5);
        this.addChild(text);
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