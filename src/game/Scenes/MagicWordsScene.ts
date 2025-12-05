import { Scene } from './Scene';
import MagicWordsService from '../World/MagicWords/MagicWordsService';
import DialogueContainer from '../World/MagicWords/DialogueContainer';

export default class MagicWordsScene extends Scene {
    private _dialogueContainer!: DialogueContainer;

    constructor() {
        super();
        this.setupUI();
    }

    private setupUI(): void {
        this._dialogueContainer = new DialogueContainer();
        this.addChild(this._dialogueContainer);
    }

    protected onShow(): void {
        // Fetch data using the service
        // Since onShow must return void (defined in Scene class), we cannot use async/await signature directly
        // We use .then() to handle the promise resolution
        MagicWordsService.instance().getData().then((data) => {
            // Pass data to the component to print it
            if (data) {
                this._dialogueContainer.printData(data);
            } else {
                this._dialogueContainer.printData({ error: 'Failed to load data.' });
            }
        });
    }

    protected onHide(): void { }

    public update(): void { }

    public destroy(): void {
        this._dialogueContainer.destroy({ children: true });
        super.destroy({ children: true });
    }
}
