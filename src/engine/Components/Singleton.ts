// engine/Core/Singleton.ts

import GAME from "../../game/Game";

/**
 * Base Singleton class for non-GameObject singletons
 */
export abstract class Singleton {
    private static instances: Map<string, Singleton> = new Map();

    constructor() {
        const className = this.constructor.name;
        const existingInstance = Singleton.instances.get(className);

        if (existingInstance) {
            // 🪄 Replace the newly allocated object with the existing one
            return existingInstance as this;
        }

        // Save new instance before child constructor continues
        Singleton.instances.set(className, this);
    }

    /**
     * Get singleton instance (preferred way)
     */
    public static instance<T extends Singleton>(this: new () => T): T {
        const className = this.name;

        if (!Singleton.instances.has(className)) {
            // 👇 Call `new` once — child constructor runs ONCE
            new this();
        }

        return Singleton.instances.get(className) as T;
    }

    /**
     * Reset the singleton
     */
    public static destroyInstance(className: string): void {
        Singleton.instances.delete(className);
    }

    public destroy(): void {
        Singleton.instances.delete(this.constructor.name);
    }
}