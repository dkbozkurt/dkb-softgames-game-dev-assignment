
import { Scene } from './Scene';
import { ButtonText } from '../../engine/Components/ButtonText';
import { Text } from '../../engine/Components/Text';
import SceneManager from './SceneManager';

export default class MainMenuScene extends Scene {
    private _titleText!: Text;
    private _aceOfShadowsButton!: ButtonText;
    private _magicWordsButton!: ButtonText;
    private _phoenixFlameButton!: ButtonText;

    constructor() {
        super();
        this.setupUI();
    }
    private setupUI(): void {
        this._titleText = new Text(
            0,
            -250,
            'Main Menu',
            { fontFamily: 'PoppinsBold', fontSize: 48, fill: 0xffffff },
            this
        );

        const buttonStyle = {
            width: 300,
            height: 70,
            fillColor: 0x333333,
            fillAlpha: 0.8,
            cornerRadius: 10
        };

        const buttonColors = {
            normal: 0x333333,
            hover: 0x555555,
            pressed: 0x222222,
            disabled: 0x666666
        };

        const textStyle = {
            fontFamily: 'PoppinsBold',
            fontSize: 24,
            fill: 0xffffff
        };

        this._aceOfShadowsButton = new ButtonText(
            0,
            -80,
            buttonStyle,
            buttonColors,
            'Ace of Shadows',
            textStyle,
            () => SceneManager.instance().switchTo('aceOfShadows'),
            this
        );

        this._magicWordsButton = new ButtonText(
            0,
            20,
            buttonStyle,
            buttonColors,
            'Magic Words',
            textStyle,
            () => SceneManager.instance().switchTo('magicWords'),
            this
        );

        this._phoenixFlameButton = new ButtonText(
            0,
            120,
            buttonStyle,
            buttonColors,
            'Phoenix Flame',
            textStyle,
            () => SceneManager.instance().switchTo('phoenixFlame'),
            this
        );
    }

    protected onShow(): void {}

    protected onHide(): void {}

    public update(): void {}

    public destroy(): void {
        this._titleText.destroy();
        this._aceOfShadowsButton.destroy();
        this._magicWordsButton.destroy();
        this._phoenixFlameButton.destroy();
        super.destroy({ children: true });
    }
}
