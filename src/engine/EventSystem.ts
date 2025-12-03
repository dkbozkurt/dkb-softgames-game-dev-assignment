type EventCallback<T = void> = (data: T) => void;

export default class EventSystem {
    private static events: Map<string, EventCallback<any>[]> = new Map();

    // Subscribe to event
    public static on<T = void>(eventName: string, callback: EventCallback<T>): void {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName)!.push(callback);
    }

    // Unsubscribe from event
    public static off<T = void>(eventName: string, callback: EventCallback<T>): void {
        if (!this.events.has(eventName)) return;

        const callbacks = this.events.get(eventName)!;
        const index = callbacks.indexOf(callback);

        if (index > -1) {
            callbacks.splice(index, 1);
        }

        // Clean up empty event arrays
        if (callbacks.length === 0) {
            this.events.delete(eventName);
        }
    }

    // Trigger event (like Unity's Invoke)
    public static trigger<T = void>(eventName: string, data?: T): void {
        if (!this.events.has(eventName)) return;

        const callbacks = this.events.get(eventName)!;
        callbacks.forEach(callback => callback(data));
    }

    // Clear all listeners for an event
    public static clear(eventName: string): void {
        this.events.delete(eventName);
    }

    // Clear all events (useful for cleanup)
    public static clearAll(): void {
        this.events.clear();
    }
}