import * as PIXI from 'pixi.js'
import ENGINE from '../../engine/Engine.ts'
import { Singleton } from '../../engine/Components/Singleton.ts'

type ObjectName = 'MergeParticle'
type PoolableObject = PIXI.Container | PIXI.Sprite | PIXI.Graphics | PIXI.Text

type ObjectPoolItem = {
    objectName: ObjectName;
    objectToPool: PoolableObject;
    amountToPool: number;
    pooledObjects: PoolableObject[];
}

export default class ObjectPoolManager extends Singleton{

    private _objectPoolItems: ObjectPoolItem[] = []

    constructor() {
        super();

        this.setup()
    }

    private setup() {
        console.log('Setup Objects to be pooled here!');

        this.createPool()
    }

    // ! Dont use at the same time with createPoolFromAnItem(), if you decide to use this function, set pooled objects in setup() function, and DO NOT set from the objects scripts.
    private createPool() {
        for (const item of this._objectPoolItems) {
            for (let i = 0; i < item.amountToPool; i++) {
                const newObj = this.generateNewObject(item);
                item.pooledObjects.push(newObj);
            }
        }
    }

    // ! Dont use at the same time with createPool(), if you decide to use this function, set pooled objects in the objects scripts, and DO NOT set from the setup() function. Deactivate setup() function.
    public createPoolFromAnItem(item: ObjectPoolItem) {
        this._objectPoolItems.push(item)

        for (let i = 0; i < item.amountToPool; i++) {
            let obj = this.generateNewObject(item)
            item.pooledObjects.push(obj)
            ENGINE.application.add(obj)
        }
    }

    public getPooledObject(
        objectName: ObjectName,
        position: PIXI.Point = new PIXI.Point(),
        rotation: number = 0,
        parent?: PIXI.Container,
        isLocalPos: boolean = false
    ): PoolableObject | null {
        const pooledObject = this.callPooledObject(objectName);
        if (!pooledObject) return null;

        if (parent) {
            parent.addChild(pooledObject);
        }

        if (isLocalPos) {
            pooledObject.position.copyFrom(position);
            pooledObject.rotation = rotation;
        } else {
            pooledObject.position.set(position.x, position.y);
            pooledObject.rotation = rotation;
        }

        pooledObject.visible = true;

        return pooledObject;
    }

    public deactivateAllPooledObjects() {
        for (const item of this._objectPoolItems) {
            for (const obj of item.pooledObjects) {
                obj.visible = false;
                if (obj.parent) {
                    obj.parent.removeChild(obj);
                }
            }
        }
    }

    private callPooledObject(objectName: ObjectName): PoolableObject | null {
        const poolItem = this._objectPoolItems.find
            (item => item.objectName === objectName);

        if (!poolItem) return null;

        for (const obj of poolItem.pooledObjects) {
            if (!obj.visible) {
                return obj;
            }
        }

        const newObj = this.generateNewObject(poolItem);
        poolItem.pooledObjects.push(newObj);
        return newObj;
    }

    private generateNewObject(item: ObjectPoolItem): PoolableObject {
        let newObj: PoolableObject;

        if (item.objectToPool instanceof PIXI.Sprite) {
            // Clone a sprite
            newObj = new PIXI.Sprite(item.objectToPool.texture);
            (newObj as PIXI.Sprite).anchor.copyFrom(item.objectToPool.anchor);

            // Copy other properties
            newObj.alpha = item.objectToPool.alpha;
            newObj.scale.copyFrom(item.objectToPool.scale);
            // newObj.tint = item.objectToPool.tint;
        }
        else if (item.objectToPool instanceof PIXI.Graphics) {
            // For Graphics objects, create a new one and copy the graphicsData
            newObj = new PIXI.Graphics();
            // Copy existing graphics data if needed
            // This is a simplified approach - complex graphics might need more detailed copying
        }
        else if (item.objectToPool instanceof PIXI.Text) {
            // Clone a text object
            newObj = new PIXI.Text(
                (item.objectToPool as PIXI.Text).text,
                (item.objectToPool as PIXI.Text).style
            );
        }
        else if (item.objectToPool instanceof PIXI.Container) {
            // For containers, create a new one
            newObj = new PIXI.Container();
            // Clone children if needed
            // You may need additional logic to properly clone container contents
        }
        else {
            // Generic fallback - create empty container as placeholder
            console.warn('Unsupported object type for pooling');
            newObj = new PIXI.Container();
        }

        // Copy common properties
        newObj.position.copyFrom(item.objectToPool.position);
        newObj.rotation = item.objectToPool.rotation;
        newObj.visible = false;

        return newObj;
    }

    public update() { }

    public destroy() {
        for (const item of this._objectPoolItems) {
            for (const obj of item.pooledObjects) {
                obj.destroy({ children: true, texture: false});
            }
        }
        this._objectPoolItems = [];
    }
}