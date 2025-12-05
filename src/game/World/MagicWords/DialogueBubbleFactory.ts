import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { DialogueItem, AvatarData } from './DialogueParser';
import RichTextRenderer from './RichTextRenderer';
import { GameConfig } from '../../Config/GameConfig';

export default class DialogueBubbleFactory {
    private _avatarMap: Map<string, AvatarData>;
    private _textRenderer: RichTextRenderer;
    private _config = GameConfig.MagicWords.Bubble;

    constructor(
        avatarMap: Map<string, AvatarData>,
        emojiMap: Map<string, string>
    ) {
        this._avatarMap = avatarMap;
        this._textRenderer = new RichTextRenderer(emojiMap);
    }

    /**
     * Creates a fully animated dialogue bubble with avatar, name, and typewriter text.
     */
    public create(item: DialogueItem): PIXI.Container {
        const bubble = new PIXI.Container();
        const avatarData = this._avatarMap.get(item.name);
        const alignment = this.getAlignment(avatarData);

        // 1. Create Avatar
        if (avatarData) {
            this.addAvatar(bubble, avatarData.url, alignment === 'right');
        }

        // 2. Render Text (Hidden initially)
        const { textStartX, textMaxWidth } = this.calculateTextBounds(alignment);
        const renderResult = this._textRenderer.render(bubble, item.text, textStartX, 0, alignment, textMaxWidth);

        // 3. Add Name Label
        this.addNameLabel(bubble, item.name, alignment, textStartX, textMaxWidth, renderResult.height);
        
        // 4. Center Pivot
        this.centerBubble(bubble);

        // 5. ANIMATION: Pop Bubble In
        this.animateBubblePop(bubble);

        // 6. ANIMATION: Typewriter effect
        this.animateTypewriter(renderResult.items);

        return bubble;
    }

    public createSystemMessage(text: string): PIXI.Container {
        const container = new PIXI.Container();
        const label = new PIXI.Text(text, {
            fontFamily: GameConfig.MagicWords.Text.FontFamily,
            fontSize: 24,
            fill: 0xAAAAAA,
            fontStyle: 'italic',
            align: 'center'
        });
        label.anchor.set(0.5);
        container.addChild(label);
        
        // Simple fade in for system messages
        label.alpha = 0;
        gsap.to(label, { alpha: 1, duration: 0.5 });

        return container;
    }

    private animateBubblePop(bubble: PIXI.Container): void {
        bubble.scale.set(0);
        gsap.to(bubble.scale, {
            x: 1,
            y: 1,
            duration: this._config.PopInDuration,
            ease: this._config.PopInEase
        });
    }

    private animateTypewriter(items: PIXI.DisplayObject[]): void {
        // Hide all items initially
        items.forEach(item => item.alpha = 0);

        // Reveal one by one
        const speed = GameConfig.MagicWords.Text.TypewriterSpeed;
        
        items.forEach((item, index) => {
            gsap.to(item, {
                alpha: 1,
                duration: 0.1, // Short fade in for smoothness
                delay: this._config.PopInDuration * 0.5 + (index * speed) // Start typing halfway through pop
            });
        });
    }

    private getAlignment(avatarData?: AvatarData): 'left' | 'right' | 'center' {
        if (!avatarData) return 'center';
        return avatarData.position === 'right' ? 'right' : 'left';
    }

    private calculateTextBounds(alignment: 'left' | 'right' | 'center'): { textStartX: number; textMaxWidth: number } {
        const { Width, AvatarSize, Padding } = this._config;

        if (alignment === 'left') {
            return { textStartX: AvatarSize + Padding, textMaxWidth: Width - AvatarSize - Padding };
        }
        if (alignment === 'right') {
            return { textStartX: 0, textMaxWidth: Width - AvatarSize - Padding };
        }
        return { textStartX: 0, textMaxWidth: Width };
    }

    private addAvatar(parent: PIXI.Container, url: string, isRight: boolean): void {
        const container = new PIXI.Container();
        const { AvatarSize, Width } = this._config;

        const bg = new PIXI.Graphics();
        bg.beginFill(0xFFFFFF, 0.1);
        bg.drawRoundedRect(0, 0, AvatarSize, AvatarSize, 10);
        bg.endFill();
        container.addChild(bg);

        const texture = PIXI.Texture.from(url, { resourceOptions: { crossorigin: 'anonymous' } });
        const sprite = new PIXI.Sprite(texture);
        sprite.visible = false;

        const onLoaded = () => {
            sprite.width = AvatarSize;
            sprite.height = AvatarSize;
            sprite.visible = true;
        };

        if (texture.valid) onLoaded();
        else texture.once('update', onLoaded);

        container.addChild(sprite);
        container.position.set(isRight ? Width - AvatarSize : 0, 0);
        parent.addChild(container);
    }

    private addNameLabel(
        parent: PIXI.Container,
        name: string,
        alignment: 'left' | 'right' | 'center',
        textStartX: number,
        textMaxWidth: number,
        yPosition: number
    ): void {
        const label = new PIXI.Text(name, {
            fontFamily: GameConfig.MagicWords.Text.FontFamily,
            fontSize: 18,
            fill: 0xAAAAAA,
            fontStyle: 'italic',
            align: alignment
        });

        label.y = yPosition + 5;

        switch (alignment) {
            case 'right':
                label.x = textMaxWidth - label.width;
                break;
            case 'center':
                label.x = (this._config.Width - label.width) / 2;
                break;
            default:
                label.x = textStartX;
        }

        parent.addChild(label);
    }

    private centerBubble(bubble: PIXI.Container): void {
        const bounds = bubble.getLocalBounds();
        bubble.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    }
}