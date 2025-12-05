import { Scene } from './Scene';
import { ButtonText } from '../../engine/Components/ButtonText';
import { Text } from '../../engine/Components/Text';
import SceneManager from './SceneManager';

const BUTTON_STYLE = {
    width: 300,
    height: 70,
    fillColor: 0xF5842D,
    fillAlpha: 1,
    cornerRadius: 10
};

const BUTTON_COLORS = {
    normal: 0xf5842d,
    hover: 0xf7a05d,
    pressed: 0xe27a2b,
    disabled: 0xf5842d
};

const TEXT_STYLE = {
    fontFamily: 'PoppinsBold',
    fontSize: 28,
    fill: 0xffffff
};

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
        this._titleText = new Text(0, -250, 'Main Menu', { fontFamily: 'PoppinsBold', fontSize: 48, fill: 0xffffff }, this);

        this._aceOfShadowsButton = new ButtonText(
            0, -80, BUTTON_STYLE, BUTTON_COLORS, 'Ace of Shadows', TEXT_STYLE,
            () => SceneManager.instance().switchTo('aceOfShadows'), this
        );

        this._magicWordsButton = new ButtonText(
            0, 20, BUTTON_STYLE, BUTTON_COLORS, 'Magic Words', TEXT_STYLE,
            () => SceneManager.instance().switchTo('magicWords'), this
        );

        this._phoenixFlameButton = new ButtonText(
            0, 120, BUTTON_STYLE, BUTTON_COLORS, 'Phoenix Flame', TEXT_STYLE,
            () => SceneManager.instance().switchTo('phoenixFlame'), this
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
