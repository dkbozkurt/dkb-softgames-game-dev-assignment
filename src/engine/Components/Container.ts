import * as PIXI from 'pixi.js';

export class Container extends PIXI.Container {
    constructor(posX: number = 0, posY: number = 0, scaleX: number = 1, scaleY: number = 1, parent?: PIXI.Container) {
        super();

        this.position.set(posX,posY);
        this.scale.set(scaleX,scaleY)

        if(parent) parent.addChild(this);
    }
}
