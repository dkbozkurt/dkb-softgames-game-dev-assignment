import { Container } from '../../../engine/Components/Container';
import { Text } from '../../../engine/Components/Text';

export default class DialogueContainer extends Container {
    private _debugText: Text;
    private _textQueue: string[] = [];
    private _displayTimeout: any = null;

    constructor() {
        super();

        // Initialize a Text component to display the data visually
        this._debugText = new Text(
            0,
            0,
            'Waiting for data...',
            {
                fontFamily: 'PoppinsBold',
                fontSize: 32,
                fill: 0xffffff,
                wordWrap: true,
                wordWrapWidth: 800,
                align: 'center'
            },
            this
        );
    }

    /**
     * Receives data and prints it to the console and the screen.
     * @param data The data received from the service.
     */
    public printData(data: any): void {
        this.stopSequence(); // Clear any existing sequence

        console.log('[DialogueContainer] Raw Data:', data);

        // Extract text parts from the JSON structure
        this._textQueue = this.extractStrings(data);

        console.log('[DialogueContainer] Queued Texts:', this._textQueue);

        if (this._textQueue.length > 0) {
            this.showNextText();
        } else {
            this._debugText.text = "No text found in response.";
        }
    }

    private extractStrings(data: any): string[] {
        const strings: string[] = [];

        const traverse = (obj: any) => {
            if (typeof obj === 'string') {
                // Heuristic: Ignore short IDs or metadata looking strings if necessary
                // For now, accept all non-empty strings
                if (obj.trim().length > 0) {
                    strings.push(obj);
                }
            } else if (Array.isArray(obj)) {
                obj.forEach(item => traverse(item));
            } else if (typeof obj === 'object' && obj !== null) {
                Object.keys(obj).forEach(key => {
                    // Optional: Filter specific keys if needed (e.g., 'type', 'id')
                    // For now, we traverse everything to find the content
                    traverse(obj[key]);
                });
            }
        };

        traverse(data);
        return strings;
    }

    private showNextText(): void {
        if (this._textQueue.length === 0) {
            this._debugText.text = "End of Dialogue";
            return;
        }

        const currentText = this._textQueue.shift() || "";
        this._debugText.text = currentText;

        // Schedule next text in 2 seconds
        this._displayTimeout = setTimeout(() => {
            this.showNextText();
        }, 2000);
    }

    private stopSequence(): void {
        if (this._displayTimeout) {
            clearTimeout(this._displayTimeout);
            this._displayTimeout = null;
        }
        this._textQueue = [];
    }

    public destroy(options?: boolean | any): void {
        this.stopSequence();
        this._debugText.destroy();
        super.destroy(options);
    }
}