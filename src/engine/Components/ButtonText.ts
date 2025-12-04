import * as PIXI from 'pixi.js';
import { Button, ButtonStyle, ButtonColors } from './Button';

export class ButtonText extends Button {
    protected _text: PIXI.Text;

    constructor(
        posX: number,
        posY: number,
        style: ButtonStyle,
        colors: ButtonColors,
        text: string,
        textStyle: Partial<PIXI.TextStyle>,
        callback?: () => void,
        parent?: PIXI.Container
    ) {
        super(posX, posY, style, colors, callback, parent);

        this._text = new PIXI.Text(text, textStyle);
        this._text.anchor.set(0.5);
        this.addChild(this._text);
    }

    public setText(text: string): void {
        this._text.text = text;
    }

    public setTextStyle(style: Partial<PIXI.TextStyle>): void {
        this._text.style = new PIXI.TextStyle(style);
    }

    public destroy(): void {
        this._text.destroy();
        super.destroy();
    }
}