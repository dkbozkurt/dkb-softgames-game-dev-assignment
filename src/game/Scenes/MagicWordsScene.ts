import { Scene } from './Scene';
import MagicWordsService from '../World/MagicWords/MagicWordsService';
import DialogueContainer from '../World/MagicWords/DialogueContainer';

export default class MagicWordsScene extends Scene {
    private _dialogueContainer: DialogueContainer;

    constructor() {
        super();
        this._dialogueContainer = new DialogueContainer();
        this.addChild(this._dialogueContainer);
    }

    protected onShow(): void {
        MagicWordsService.instance().getData().then(data => {
            this._dialogueContainer.printData(data ?? { error: 'Failed to load data.' });
        });
    }

    protected onHide(): void {
        this._dialogueContainer.reset();
    }

    public update(): void {}

    public destroy(): void {
        this._dialogueContainer.destroy({ children: true });
        super.destroy({ children: true });
    }
}
