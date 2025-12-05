import * as PIXI from 'pixi.js';
import { DialogueItem, AvatarData } from './DialogueParser';
import RichTextRenderer from './RichTextRenderer';

type BubbleConfig = {
    contentWidth: number;
    avatarSize: number;
    padding: number;
};

const DEFAULT_CONFIG: BubbleConfig = {
    contentWidth: 500,
    avatarSize: 100,
    padding: 20
};

export default class DialogueBubbleFactory {
    private _avatarMap: Map<string, AvatarData>;
    private _textRenderer: RichTextRenderer;
    private _config: BubbleConfig;

    constructor(
        avatarMap: Map<string, AvatarData>,
        emojiMap: Map<string, string>,
        config: Partial<BubbleConfig> = {}
    ) {
        this._avatarMap = avatarMap;
        this._textRenderer = new RichTextRenderer(emojiMap);
        this._config = { ...DEFAULT_CONFIG, ...config };
    }

    public create(item: DialogueItem): PIXI.Container {
        const bubble = new PIXI.Container();
        const avatarData = this._avatarMap.get(item.name);
        const alignment = this.getAlignment(avatarData);

        if (avatarData) {
            this.addAvatar(bubble, avatarData.url, alignment === 'right');
        }

        const { textStartX, textMaxWidth } = this.calculateTextBounds(alignment);
        const textBlockHeight = this._textRenderer.render(bubble, item.text, textStartX, 0, alignment, textMaxWidth);

        this.addNameLabel(bubble, item.name, alignment, textStartX, textMaxWidth, textBlockHeight);
        this.centerBubble(bubble);

        return bubble;
    }

    public createSystemMessage(text: string): PIXI.Container {
        const container = new PIXI.Container();
        const label = new PIXI.Text(text, {
            fontFamily: 'PoppinsBold',
            fontSize: 24,
            fill: 0xAAAAAA,
            fontStyle: 'italic',
            align: 'center'
        });
        label.anchor.set(0.5);
        container.addChild(label);
        return container;
    }

    private getAlignment(avatarData?: AvatarData): 'left' | 'right' | 'center' {
        if (!avatarData) return 'center';
        return avatarData.position === 'right' ? 'right' : 'left';
    }

    private calculateTextBounds(alignment: 'left' | 'right' | 'center'): { textStartX: number; textMaxWidth: number } {
        const { contentWidth, avatarSize, padding } = this._config;

        if (alignment === 'left') {
            return { textStartX: avatarSize + padding, textMaxWidth: contentWidth - avatarSize - padding };
        }
        if (alignment === 'right') {
            return { textStartX: 0, textMaxWidth: contentWidth - avatarSize - padding };
        }
        return { textStartX: 0, textMaxWidth: contentWidth };
    }

    private addAvatar(parent: PIXI.Container, url: string, isRight: boolean): void {
        const container = new PIXI.Container();
        const { avatarSize, contentWidth } = this._config;

        const bg = new PIXI.Graphics();
        bg.beginFill(0xFFFFFF, 0.1);
        bg.drawRoundedRect(0, 0, avatarSize, avatarSize, 10);
        bg.endFill();
        container.addChild(bg);

        const texture = PIXI.Texture.from(url, { resourceOptions: { crossorigin: 'anonymous' } });
        const sprite = new PIXI.Sprite(texture);
        sprite.visible = false;

        const onLoaded = () => {
            sprite.width = avatarSize;
            sprite.height = avatarSize;
            sprite.visible = true;
        };

        if (texture.valid) onLoaded();
        else texture.once('update', onLoaded);

        container.addChild(sprite);
        container.position.set(isRight ? contentWidth - avatarSize : 0, 0);
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
            fontFamily: 'PoppinsBold',
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
                label.x = (this._config.contentWidth - label.width) / 2;
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
