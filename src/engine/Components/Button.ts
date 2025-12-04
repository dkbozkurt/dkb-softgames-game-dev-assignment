import * as PIXI from 'pixi.js';

export type ButtonState = 'normal' | 'hover' | 'pressed' | 'disabled';

export type ButtonStyle = {
    width: number;
    height: number;
    fillColor: number;
    fillAlpha?: number;
    borderColor?: number;
    borderWidth?: number;
    borderAlpha?: number;
    cornerRadius?: number;
};

export type ButtonColors = {
    normal: number;
    hover: number;
    pressed: number;
    disabled: number;
};

export class Button extends PIXI.Graphics {
    protected _state: ButtonState = 'normal';
    protected _callback: (() => void) | null = null;
    protected _enabled: boolean = true;
    protected _style: ButtonStyle;
    protected _colors: ButtonColors;
    protected _icon: PIXI.Sprite | null = null;

    constructor(
        posX: number,
        posY: number,
        style: ButtonStyle,
        colors: ButtonColors,
        callback?: () => void,
        parent?: PIXI.Container,
        texturePath?: string | PIXI.Texture
    ) {
        super();

        this._style = style;
        this._colors = colors;
        if (callback) this._callback = callback;

        this.position.set(posX, posY);
        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.draw();

        if (texturePath) {
            this.addIcon(typeof texturePath === 'string' ? PIXI.Texture.from(texturePath) : texturePath);
        }

        this.initializeEvents();

        if (parent) parent.addChild(this);
    }

    protected addIcon(texture: PIXI.Texture): void {
        this._icon = new PIXI.Sprite(texture);
        this._icon.anchor.set(0.5);
        this.addChild(this._icon);
    }

    protected draw(): void {
        this.clear();

        const color = this.getCurrentColor();
        const { width, height, fillAlpha = 1, borderColor, borderWidth = 0, borderAlpha = 1, cornerRadius = 0 } = this._style;

        if (borderWidth > 0 && borderColor !== undefined) {
            this.lineStyle(borderWidth, borderColor, borderAlpha);
        }

        this.beginFill(color, fillAlpha);

        if (cornerRadius > 0) {
            this.drawRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);
        } else {
            this.drawRect(-width / 2, -height / 2, width, height);
        }

        this.endFill();
    }

    protected getCurrentColor(): number {
        switch (this._state) {
            case 'normal': return this._colors.normal;
            case 'hover': return this._colors.hover;
            case 'pressed': return this._colors.pressed;
            case 'disabled': return this._colors.disabled;
        }
    }

    protected initializeEvents(): void {
        this.on('pointerdown', this.onPointerDown, this);
        this.on('pointerup', this.onPointerUp, this);
        this.on('pointerover', this.onPointerOver, this);
        this.on('pointerout', this.onPointerOut, this);
    }

    protected onPointerDown(): void {
        if (!this._enabled) return;
        this.setState('pressed');
    }

    protected onPointerUp(): void {
        if (!this._enabled) return;
        this.setState('hover');
        this._callback?.();
    }

    protected onPointerOver(): void {
        if (!this._enabled) return;
        this.setState('hover');
    }

    protected onPointerOut(): void {
        if (!this._enabled) return;
        this.setState('normal');
    }

    protected setState(state: ButtonState): void {
        this._state = state;
        this.draw();
    }

    public setEnabled(enabled: boolean): void {
        this._enabled = enabled;
        this.eventMode = enabled ? 'static' : 'none';
        this.setState(enabled ? 'normal' : 'disabled');
    }

    public destroy(): void {
        this.off('pointerdown', this.onPointerDown, this);
        this.off('pointerup', this.onPointerUp, this);
        this.off('pointerover', this.onPointerOver, this);
        this.off('pointerout', this.onPointerOut, this);
        this._icon?.destroy();
        super.destroy();
    }
}