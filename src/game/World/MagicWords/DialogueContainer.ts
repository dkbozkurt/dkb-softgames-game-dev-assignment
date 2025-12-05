import { Container } from '../../../engine/Components/Container';
import { Text } from '../../../engine/Components/Text';

export default class DialogueContainer extends Container {
    private _debugText: Text;

    constructor() {
        super();

        // Initialize a Text component to display the data visually
        this._debugText = new Text(
            0,
            0,
            'Waiting for data...',
            {
                fontFamily: 'PoppinsBold',
                fontSize: 18,
                fill: 0xffffff,
                wordWrap: true,
                wordWrapWidth: 600,
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
        // Print to Console
        console.log('[DialogueContainer] Data Received:', data);

        // Print to Screen (Pretty print JSON)
        // Limiting length to prevent performance issues with huge strings on screen
        const jsonString = JSON.stringify(data, null, 2);
        this._debugText.text = jsonString.substring(0, 2000) + (jsonString.length > 2000 ? '...' : '');
    }
}