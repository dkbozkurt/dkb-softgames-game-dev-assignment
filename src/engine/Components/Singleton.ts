export abstract class Singleton {
    private static _instances: Map<string, Singleton> = new Map();

    protected constructor() {
        const className = this.constructor.name;
        if (Singleton._instances.has(className)) {
            return Singleton._instances.get(className) as this;
        }
        Singleton._instances.set(className, this);
    }

    public static instance<T extends Singleton>(this: new () => T): T {
        const className = this.name;
        if (!Singleton._instances.has(className)) {
            new this();
        }
        return Singleton._instances.get(className) as T;
    }

    public static destroyInstance(className: string): void {
        Singleton._instances.delete(className);
    }

    public destroy(): void {
        Singleton._instances.delete(this.constructor.name);
    }
}
