type EventCallback<T = void> = (data: T) => void;

export default class EventSystem {
    private static _events: Map<string, EventCallback<unknown>[]> = new Map();

    public static on<T = void>(eventName: string, callback: EventCallback<T>): void {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, []);
        }
        this._events.get(eventName)!.push(callback as EventCallback<unknown>);
    }

    public static off<T = void>(eventName: string, callback: EventCallback<T>): void {
        if (!this._events.has(eventName)) return;

        const callbacks = this._events.get(eventName)!;
        const index = callbacks.indexOf(callback as EventCallback<unknown>);

        if (index > -1) {
            callbacks.splice(index, 1);
        }

        if (callbacks.length === 0) {
            this._events.delete(eventName);
        }
    }

    public static trigger<T = void>(eventName: string, data?: T): void {
        if (!this._events.has(eventName)) return;

        const callbacks = this._events.get(eventName)!;
        callbacks.forEach(callback => callback(data));
    }

    public static clear(eventName: string): void {
        this._events.delete(eventName);
    }

    public static clearAll(): void {
        this._events.clear();
    }
}
