import * as PIXI from 'pixi.js';
import { Container } from '../../../engine/Components/Container';
import DialogueParser, { ParsedDialogueData } from './DialogueParser';
import DialogueBubbleFactory from './DialogueBubbleFactory';
import DialogueSequencer from './DialogueSequencer';

export default class DialogueContainer extends Container {
    private _activeBubbles: PIXI.Container[] = [];
    private _bubbleFactory: DialogueBubbleFactory | null = null;
    private _sequencer: DialogueSequencer | null = null;
    private _systemMessage: PIXI.Container | null = null;

    private readonly BUBBLE_SPACING = 60;
    private readonly MAX_VISIBLE_BUBBLES = 5;
    private readonly FADE_START_AGE = 3;

    constructor() {
        super();
        this.showLoading();
    }

    public showLoading(): void {
        this.reset();
        const loadingText = new PIXI.Text('... Connecting to Magic Words ...', {
            fontFamily: 'PoppinsBold',
            fontSize: 24,
            fill: 0xAAAAAA,
            fontStyle: 'italic'
        });
        loadingText.anchor.set(0.5);
        this.addChild(loadingText);
    }

    public printData(data: any): void {
        this.reset();

        const parsed = DialogueParser.parse(data);

        if (parsed.dialogues.length === 0) {
            this.showSimpleMessage('No dialogue found.');
            return;
        }

        this.initializeComponents(parsed);
        this._sequencer!.start(parsed.dialogues);
    }

    public reset(): void {
        this._sequencer?.stop();
        this._activeBubbles.forEach(bubble => bubble.destroy({ children: true }));
        this._activeBubbles = [];
        if (this._systemMessage) {
            this._systemMessage.destroy({ children: true });
            this._systemMessage = null;
        }
        this.removeChildren();
    }

    private initializeComponents(data: ParsedDialogueData): void {
        this._bubbleFactory = new DialogueBubbleFactory(data.avatars, data.emojis);

        this._sequencer = new DialogueSequencer(
            this._bubbleFactory,
            {
                onBubbleCreated: (bubble) => this.addBubble(bubble),
                onSystemMessage: (message) => this.showSystemMessage(message),
                onSequenceEnd: () => this.clearBubbles()
            }
        );
    }

    private clearBubbles(): void {
        this._activeBubbles.forEach(bubble => {
            if (!bubble.destroyed) {
                bubble.destroy({ children: true });
            }
        });
        this._activeBubbles = [];
    }

    private showSystemMessage(message: PIXI.Container): void {
        if (this._systemMessage) {
            this._systemMessage.destroy({ children: true });
        }
        this._systemMessage = message;
        this.addChild(message);
    }

    private addBubble(bubble: PIXI.Container): void {
        if (this._systemMessage) {
            this._systemMessage.destroy({ children: true });
            this._systemMessage = null;
        }

        this.addChild(bubble);
        bubble.position.set(0, 0);
        bubble.alpha = 1;

        const bounds = bubble.getLocalBounds();
        const shiftAmount = bounds.height + this.BUBBLE_SPACING;

        this.shiftExistingBubbles(shiftAmount);
        this._activeBubbles.push(bubble);
        this.cleanupOldBubbles();
    }

    private shiftExistingBubbles(shiftAmount: number): void {
        for (let i = this._activeBubbles.length - 1; i >= 0; i--) {
            const bubble = this._activeBubbles[i];
            if (!bubble || bubble.destroyed) continue;

            bubble.y -= shiftAmount;
            bubble.alpha *= 0.5;

            const age = this._activeBubbles.length - i;
            if (age >= this.FADE_START_AGE) {
                bubble.alpha = 0;
                bubble.visible = false;
            }
        }
    }

    private cleanupOldBubbles(): void {
        while (this._activeBubbles.length > this.MAX_VISIBLE_BUBBLES) {
            const oldBubble = this._activeBubbles.shift();
            if (oldBubble && !oldBubble.destroyed) {
                oldBubble.destroy({ children: true });
            }
        }
    }

    private showSimpleMessage(message: string): void {
        this.removeChildren();
        const text = new PIXI.Text(message, {
            fontFamily: 'PoppinsBold',
            fontSize: 24,
            fill: 0xffffff,
            align: 'center'
        });
        text.anchor.set(0.5);
        this.addChild(text);
    }

    public destroy(options?: boolean | PIXI.IDestroyOptions): void {
        this._sequencer?.stop();
        super.destroy(options);
    }
}