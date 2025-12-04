import { Scene } from './Scene';
import { Text } from '../../engine/Components/Text';

export default class AceOfShadowsScene extends Scene {
    private _titleText!: Text;

    constructor() {
        super();
        this.setupUI();
    }

    private setupUI(): void {
        this._titleText = new Text(
            0,
            0,
            'Ace of Shadows - Coming Soon',
            { fontFamily: 'PoppinsBold', fontSize: 36, fill: 0xffffff },
            this
        );
    }

    protected onShow(): void {}

    protected onHide(): void {}

    public update(): void {}

    public destroy(): void {
        this._titleText.destroy();
        super.destroy({ children: true });
    }
}
