import { ButtonText } from '../../engine/Components/ButtonText';
import SceneManager from '../Scenes/SceneManager';
import Utilities from '../../engine/Utils/Utilities';
import EventSystem from '../../engine/EventSystem';
import * as PIXI from 'pixi.js';

export default class BackButton {
    private _button: ButtonText;

    constructor(parent: PIXI.Container) {
        const buttonStyle = {
            width: 150,
            height: 50,
            fillColor: 0x444444,
            fillAlpha: 0.8,
            cornerRadius: 8
        };

        const buttonColors = {
            normal: 0x444444,
            hover: 0x666666,
            pressed: 0x333333,
            disabled: 0x888888
        };

        const textStyle = {
            fontFamily: 'PoppinsBold',
            fontSize: 20,
            fill: 0xffffff
        };

        this._button = new ButtonText(
            0,
            0,
            buttonStyle,
            buttonColors,
            'Back to Menu',
            textStyle,
            () => SceneManager.instance().switchTo('mainMenu'),
            parent
        );

        Utilities.bindMethods(this, ['updatePosition']);
        EventSystem.on('resize', this.updatePosition);

        this._button.visible = false;
        this.updatePosition();
    }

    private updatePosition(): void {
        this._button.position.set(-window.innerWidth / 2 + 100, -window.innerHeight / 2 + 50);
    }

    public setVisible(visible: boolean): void {
        this._button.visible = visible;
    }

    public destroy(): void {
        EventSystem.off('resize', this.updatePosition);
        this._button.destroy();
    }
}
