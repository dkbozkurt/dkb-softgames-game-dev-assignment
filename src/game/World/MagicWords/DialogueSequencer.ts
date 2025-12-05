import * as PIXI from 'pixi.js';
import { DialogueItem } from './DialogueParser';
import DialogueBubbleFactory from './DialogueBubbleFactory';
import AudioManager from '../../Core/AudioManager';

type SequencerCallbacks = {
    onBubbleCreated: (bubble: PIXI.Container) => void;
    onSystemMessage: (message: PIXI.Container) => void;
    onSequenceEnd: () => void;
};

export default class DialogueSequencer {
    private _queue: DialogueItem[] = [];
    private _bubbleFactory: DialogueBubbleFactory;
    private _callbacks: SequencerCallbacks;
    private _timeout: ReturnType<typeof setTimeout> | null = null;
    private _intervalMs: number;
    private _startMessage: PIXI.Container | null = null;

    constructor(
        bubbleFactory: DialogueBubbleFactory,
        callbacks: SequencerCallbacks,
        intervalMs: number = 3000
    ) {
        this._bubbleFactory = bubbleFactory;
        this._callbacks = callbacks;
        this._intervalMs = intervalMs;
    }

    public start(dialogues: DialogueItem[]): void {
        this._queue = [...dialogues];

        if (this._queue.length === 0) return;

        this._startMessage = this._bubbleFactory.createSystemMessage('... Conversation starting ...');
        this._callbacks.onSystemMessage(this._startMessage);

        this._timeout = setTimeout(() => {
            if (this._startMessage) {
                this._startMessage.destroy({ children: true });
                this._startMessage = null;
            }
            this.showNext();
        }, this._intervalMs / 2);
    }

    public stop(): void {
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
        if (this._startMessage) {
            this._startMessage.destroy({ children: true });
            this._startMessage = null;
        }
        this._queue = [];
    }

    private showNext(): void {
        if (this._queue.length === 0) {
            this.showEndMessage();
            return;
        }

        const item = this._queue.shift()!;
        const bubble = this._bubbleFactory.create(item);

        AudioManager.instance().playSound('Message', 0.4);

        this._callbacks.onBubbleCreated(bubble);

        this._timeout = setTimeout(() => this.showNext(), this._intervalMs);
    }

    private showEndMessage(): void {
        const endMessage = this._bubbleFactory.createSystemMessage('... Conversation ended ...');
        this._callbacks.onSystemMessage(endMessage);
        this._callbacks.onSequenceEnd();
    }
}