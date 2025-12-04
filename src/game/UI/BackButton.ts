import * as PIXI from 'pixi.js';
import ENGINE from '../../engine/Engine';
import { Button } from '../../engine/Components/Button';
import SceneManager from '../Scenes/SceneManager';
import Utilities from '../../engine/Utils/Utilities';
import EventSystem from '../../engine/EventSystem';

export default class BackButton extends Button {
    private _baseHeight: number = 1080;
    private _offsetPercentage: number = 0.08;

    constructor(parent: PIXI.Container) {
        const buttonStyle = {
            width: 80,
            height: 80,
            fillColor: 0x333333,
            fillAlpha: 0.8,
            cornerRadius: 40
        };

        const buttonColors = {
            normal: 0x333333,
            hover: 0x555555,
            pressed: 0x222222,
            disabled: 0x666666
        };

        super(
            0,
            0,
            buttonStyle,
            buttonColors,
            () => SceneManager.instance().switchTo('mainMenu'),
            parent,
            ENGINE.resources.getItemPath('home'),
        );

        if (this._icon) {
            this._icon.width = 40;
            this._icon.height = 40;
        }

        Utilities.bindMethods(this, ['updatePosition']);
        EventSystem.on('resize', this.updatePosition);

        this.visible = false;
        this.updatePosition();
    }

    private updatePosition(): void {
        const yPosition = (this._baseHeight / 2) - (this._baseHeight * this._offsetPercentage);
        this.position.set(0, yPosition);
    }

    public setVisible(visible: boolean): void {
        this.visible = visible;
    }

    public destroy(): void {
        EventSystem.off('resize', this.updatePosition);
        super.destroy();
    }
}