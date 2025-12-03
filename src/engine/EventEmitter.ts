export default class EventEmitter {
    private callbacks: { [namespace: string]: { [value: string]: Function[] } } = {};

    constructor() {
        this.callbacks.base = {};
    }

    on(_names: string, callback: Function): this | false {
        // Errors
        if (typeof _names === 'undefined' || _names === '') {
            console.warn('wrong names');
            return false;
        }

        if (typeof callback === 'undefined') {
            console.warn('wrong callback');
            return false;
        }

        // Resolve names
        const names = this.resolveNames(_names);

        // Each name
        names.forEach((_name) => {
            // Resolve name
            const name = this.resolveName(_name);

            // Create namespace if not exist
            if (!(this.callbacks[name.namespace] instanceof Object)) {
                this.callbacks[name.namespace] = {};
            }

            // Create callback if not exist
            if (!(this.callbacks[name.namespace][name.value] instanceof Array)) {
                this.callbacks[name.namespace][name.value] = [];
            }

            // Add callback
            this.callbacks[name.namespace][name.value].push(callback);
        });

        return this;
    }

    /**
     * off(names[, callback]):
     *  - with callback: remove only that listener
     *  - without: uses your original “remove all” logic
     */
    off(_names: string, callback?: Function): this | false {
        // Errors
        if (typeof _names === 'undefined' || _names === '') {
            console.warn('wrong name');
            return false;
        }

        // Resolve names
        const names = this.resolveNames(_names);

        // Each name
        names.forEach((_name) => {
            // Resolve name
            const name = this.resolveName(_name);

            if (callback) {
                // ---- new: remove only the given callback ----
                const list = this.callbacks[name.namespace]?.[name.value];
                if (Array.isArray(list)) {
                    this.callbacks[name.namespace][name.value] = list.filter(fn => fn !== callback);
                    // clean up empty event
                    if (this.callbacks[name.namespace][name.value].length === 0) {
                        delete this.callbacks[name.namespace][name.value];
                    }
                    // clean up empty namespace
                    if (this.callbacks[name.namespace] && Object.keys(this.callbacks[name.namespace]).length === 0) {
                        delete this.callbacks[name.namespace];
                    }
                }
            } else {
                // ---- original “nuke” logic ----
                // Remove namespace
                if (name.namespace !== 'base' && name.value === '') {
                    delete this.callbacks[name.namespace];
                } else {
                    // Default
                    if (name.namespace === 'base') {
                        // Try to remove from each namespace
                        for (const namespace in this.callbacks) {
                            if (
                                this.callbacks[namespace] instanceof Object &&
                                this.callbacks[namespace][name.value] instanceof Array
                            ) {
                                delete this.callbacks[namespace][name.value];

                                // Remove namespace if empty
                                if (Object.keys(this.callbacks[namespace]).length === 0) {
                                    delete this.callbacks[namespace];
                                }
                            }
                        }
                    }
                    // Specified namespace
                    else if (
                        this.callbacks[name.namespace] instanceof Object &&
                        this.callbacks[name.namespace][name.value] instanceof Array
                    ) {
                        delete this.callbacks[name.namespace][name.value];

                        // Remove namespace if empty
                        if (Object.keys(this.callbacks[name.namespace]).length === 0) {
                            delete this.callbacks[name.namespace];
                        }
                    }
                }
            }
        });

        return this;
    }

    /**
     * once(names, callback):
     *  registers a one-time listener that auto-deregisters
     */
    once(_names: string, callback: Function): this | false {
        // same validations as `on`
        if (typeof _names === 'undefined' || _names === '') {
            console.warn('wrong names');
            return false;
        }
        if (typeof callback === 'undefined') {
            console.warn('wrong callback');
            return false;
        }

        const wrapper = (...args: any[]) => {
            // remove this wrapper after first call
            this.off(_names, wrapper);
            // then invoke real callback
            callback.apply(this, args);
        };

        return this.on(_names, wrapper);
    }

    trigger(_name: string, ..._args: any[]): any {
        // Errors
        if (typeof _name === 'undefined' || _name === '') {
            console.warn('wrong name');
            return false;
        }

        let finalResult: any = null;
        let result: any = null;

        // Resolve names (should only have one event)
        let name = this.resolveNames(_name);

        // Resolve name
        const resolvedName = this.resolveName(name[0]);

        // Default namespace
        if (resolvedName.namespace === 'base') {
            // Try to find callback in each namespace
            for (const namespace in this.callbacks) {
                if (this.callbacks[namespace] instanceof Object && this.callbacks[namespace][resolvedName.value] instanceof Array) {
                    this.callbacks[namespace][resolvedName.value].forEach((callback) => {
                        result = callback.apply(this, _args);

                        if (typeof finalResult === 'undefined') {
                            finalResult = result;
                        }
                    });
                }
            }
        }

        // Specified namespace
        else if (this.callbacks[resolvedName.namespace] instanceof Object) {
            if (resolvedName.value === '') {
                console.warn('wrong name');
                return this;
            }

            this.callbacks[resolvedName.namespace][resolvedName.value].forEach((callback) => {
                result = callback.apply(this, _args);

                if (typeof finalResult === 'undefined') {
                    finalResult = result;
                }
            });
        }

        return this;
    }

    private resolveNames(_names: string): string[] {
        let names = _names;
        names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '');
        names = names.replace(/[,/]+/g, ' ');
        const nameArray = names.split(' ');

        return nameArray;
    }

    private resolveName(name: string): { original: string; value: string; namespace: string } {
        const newName: { original: string; value: string; namespace: string } = {
            original: name,
            value: '',
            namespace: 'base',
        };
        const parts = name.split('.');

        newName.value = parts[0];

        // Specified namespace
        if (parts.length > 1 && parts[1] !== '') {
            newName.namespace = parts[1];
        }

        return newName;
    }
}
