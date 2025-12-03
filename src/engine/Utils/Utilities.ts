import CssFilterConverter from "css-filter-converter";
import ENGINE from "../Engine.ts";

export default class Utilities {
    /**
     * Determine the mobile operating system.
     * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
     *
     * @returns {engine.DeviceOS} The detected mobile operating system.
     */
    static getMobileOperatingSystem(): engine.DeviceOS {
        const userAgent: string = navigator.userAgent || (navigator as any).vendor || (window as any).opera;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "WindowsPhone";
        }

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        // iOS detection
        if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
            return "iOS";
        }

        return "Unknown";
    }

    /**
    * Get the device's preferred language (e.g., "en" from "en-US").
    *
    * @returns {string} The language code (e.g., "en", "fr", "de").
    */
    static getDeviceLanguage(): string {
        // e.g., navigator.language -> "en-US"
        const locale = navigator.language || '';
        // Split on "-" to separate language from region
        const [language] = locale.split('-');
        return language || '';
    }

    /**
     * Get the device's preferred country/region code/ GEO (e.g., "US" from "en-US").
     *
     * @returns {string} The country code (e.g., "US", "GB"), or "" if none is set.
     */
    static getDeviceGEO(): string {
        const locale = navigator.language || '';
        // We ignore the first part (language) and capture the second part (region)
        const [, country = ''] = locale.split('-');
        return country;
    }

    /**
   * Returns true if the screen is in landscape orientation (width > height).
   * 
   * @returns {boolean} True if the screen is in landscape orientation.
   */
    public static isLandscape(): boolean {
        return window.innerWidth > window.innerHeight;
    }

    /**
   * Returns screen orientation (portrait or landscape).
   * 
   * @returns {engine.DeviceOrientation} The screen orientation.
   */
    public static orientation(): engine.DeviceOrientation {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }

    /**
     * Returns the current screen (viewport) width in pixels.
     * 
     * @returns {number} The current screen width in pixels.
     */
    public static getScreenWidth(): number {
        return window.innerWidth;
    }

    /**
     * Returns the current screen (viewport) height in pixels.
     * 
     * @returns {number} The current screen height in pixels.
     */
    public static getScreenHeight(): number {
        return window.innerHeight;
    }

    /**
   * Returns a random integer in the range [min, max).
   *
   * @param {number} min - Minimum value (inclusive).
   * @param {number} max - Maximum value (exclusive).
   * @returns {number} A random integer between min (inclusive) and max (exclusive).
   */
    public static getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
   * Returns a random float in the range [min, max).
   *
   * @param {number} min - Minimum value (inclusive).
   * @param {number} max - Maximum value (exclusive).
   * @returns {number} A random float between min (inclusive) and max (exclusive).
   */
    public static getRandomFloatingNumber(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /**
   * Returns a random element from the given array.
   *
   * @typeParam T - Type of elements in the array.
   * @param {T[]} array - The array to pick a random element from.
   * @returns {T} A random element from the array.
   */
    public static getRandomElementFromArray<T>(array: T[]): T {
        if (!array.length) {
            throw new Error("Array is empty. Cannot get a random element.");
        }
        const randomIndex = this.getRandomNumber(0, array.length);
        return array[randomIndex];
    }

    /**
   * Returns an array of unique random integers of a given size,
   * within the specified range [randomNumStartIndex, randomIndexRange).
   *
   * @param {number} returnArraySize - Length of the array to return.
   * @param {number} randomIndexRange - Upper bound of the random range (exclusive).
   * @param {number} [randomNumStartIndex=0] - Lower bound of the random range (inclusive).
   * @returns {number[]} Array of unique random numbers of length returnArraySize.
   */
    public static getUniqueRandomIndexes(
        returnArraySize: number,
        randomIndexRange: number,
        randomNumStartIndex: number = 0
    ): number[] {
        if (randomIndexRange < returnArraySize) {
            console.error(
                "Random Index Range must be greater than or equal to Return Array Size!"
            );
            return [];
        }

        const uniqueNumbers = new Set<number>();
        while (uniqueNumbers.size < returnArraySize) {
            const randomNumber = this.getRandomNumber(
                randomNumStartIndex,
                randomIndexRange
            );
            uniqueNumbers.add(randomNumber);
        }

        return Array.from(uniqueNumbers);
    }

    /**
   * Shuffles array elements in place using a specified number of iterations.
   *
   * @typeParam T - The element type.
   * @param {T[]} arr - The array to shuffle in place.
   * @param {number} iterations - Number of swaps to perform.
   */
    public static shuffleArray<T>(arr: T[], iterations: number): void {
        for (let i = 0; i < iterations; i++) {
            const rnd: number = this.getRandomNumber(0, arr.length);
            const tmp: T = arr[rnd];
            arr[rnd] = arr[0];
            arr[0] = tmp;
        }
    }

    /**
   * Removes duplicates from an array, returning a new array of unique elements.
   *
   * @typeParam T - The element type.
   * @param {T[]} arr - The input array to process.
   * @returns {T[]} A new array with unique elements only.
   */
    public static removeDuplicatesFromArray<T>(arr: T[]): T[] {
        const uniqueList: T[] = [];
        for (const item of arr) {
            if (!uniqueList.includes(item)) {
                uniqueList.push(item);
            }
        }
        return uniqueList;
    }

    /**
   * Waits for a given duration (in seconds) and then executes an optional callback.
   *
   * @param {number} duration - Duration in seconds to wait.
   * @param {() => void} [callback] - Optional callback to invoke after waiting.
   * @returns {Promise<void>} A promise that resolves after the specified time.
   */
    public static async waitForTime(
        waitDurationInSeconds: number,
        callback?: () => void
    ): Promise<void> {
        // Emulates `yield return new WaitForSeconds(duration)`
        await new Promise<void>((resolve) =>
            setTimeout(resolve, waitDurationInSeconds * 1000)
        );
        callback?.();
    }

    /**
     * Waits for one frame (using requestAnimationFrame) and then executes an optional callback.
     *
     * @param {() => void} [callback] - Optional callback to invoke after waiting one frame.
     * @returns {Promise<void>} A promise that resolves after one animation frame.
     */
    public static async waitForOneFrame(
        callback?: () => void
    ): Promise<void> {
        // Emulates `yield return null` in Unity (which essentially waits one frame).
        await new Promise<void>((resolve) =>
            requestAnimationFrame(() => resolve())
        );
        callback?.();
    }

    /**
     * Waits until the predicate becomes true, then executes an optional callback.
     * 
     * In Unity: `yield return new WaitUntil(predicate)`
     * We emulate this by repeatedly checking the predicate until it returns true.
     *
     * @param {() => boolean} predicate - A function returning a boolean.
     * @param {() => void} [callback] - Optional callback to invoke once predicate is true.
     * @returns {Promise<void>} A promise that resolves once the predicate is true.
     */
    public static async waitUntilTrue(
        predicate: () => boolean,
        callback?: () => void
    ): Promise<void> {
        // Check periodically (every frame or ~16ms) to avoid busy-waiting the CPU.
        while (!predicate()) {
            await new Promise<void>((resolve) => setTimeout(resolve, 16));
            // Alternatively: await new Promise(requestAnimationFrame), if you prefer frame-based checks.
        }
        callback?.();
    }

    /**
     * Waits while the predicate is true, then executes an optional callback once it becomes false.
     * 
     * In Unity: `yield return new WaitWhile(predicate)`
     * We emulate this by repeatedly checking the predicate until it returns false.
     *
     * @param {() => boolean} predicate - A function returning a boolean.
     * @param {() => void} [callback] - Optional callback to invoke once predicate is false.
     * @returns {Promise<void>} A promise that resolves once the predicate is false.
     */
    public static async waitWhileTrue(
        predicate: () => boolean,
        callback?: () => void
    ): Promise<void> {
        while (predicate()) {
            await new Promise<void>((resolve) => setTimeout(resolve, 16));
        }
        callback?.();
    }

    /**
 * Sets the text content and color of a specified HTML element.
 *
 * @param {HTMLElement} element - The HTML element to update.
 * @param {string} text - The text to set as the content of the element.
 * @param {string} [color='#000000'] - The text color in HEX format (default is white).
 */
    public static setHTMLElementTextContent(
        element: HTMLElement,
        text: string,
        color: string = '#000000'
    ): void {
        element.innerText = text;
        element.style.color = color;
    }

    /**
* Sets the text color of a specified HTML element.
*
* @param {HTMLElement} element - The HTML element to update.
* @param {string} [color='#000000'] - The text color in HEX format (default is white).
*/
    public static setHTMLElementTextColor(
        element: HTMLElement,
        color: string = '#000000'
    ): void {
        element.style.color = color;
    }

    /**
     * Sets the background color of a specified HTML element.
     *
     * @param {HTMLElement} element - The HTML element to update.
     * @param {string} color - The background color in HEX format.
     */
    public static setHTMLElementBGColor(
        element: HTMLElement,
        color: string
    ): void {
        element.style.backgroundColor = color;
    }

    /**
     * Sets the background image and applies a color filter to a specified HTML element.
     *
     * @param {HTMLElement} element - The HTML element to update.
     * @param {string} sprite - The URL of the image to set as the background.
     * @param {string} [color='#FFFFFF'] - The filter color in HEX format (default is white).
     */
    public static setHTMLElementBGImage(
        element: HTMLElement,
        sprite: string,
        color: string = '#FFFFFF'
    ): void {
        element.style.backgroundImage = `url(${sprite})`;
    }

    /**
     * Applies a color filter to a specified HTML element based on a HEX color.
     *
     * @param {HTMLElement} element - The HTML element to update.
     * @param {string} [color='#FFFFFF'] - The filter color in HEX format.
     */
    public static setHTMLElementFilter(
        element: HTMLElement,
        color: string
    ): void {
        const resultFilter = CssFilterConverter.hexToFilter(color) as { color: string };
        element.style.filter = resultFilter.color;
    }

    /**
    * Moves an HTML element to the specified screen coordinates (in pixels).
    * By default, it sets `position: absolute` on the element, so ensure that
    * your containing element is positioned (e.g., `position: relative;`).
    *
    * @param {HTMLElement} element - The HTML element to reposition.
    * @param {number} screenX - The x-coordinate (in pixels).
    * @param {number} screenY - The y-coordinate (in pixels).
    */
    public static moveHTMLElementToScreenCoordinates(
        element: HTMLElement,
        screenX: number,
        screenY: number) {
        element.style.position = 'absolute';
        element.style.left = `${screenX}px`;
        element.style.top = `${screenY}px`;
    }

    /**
 * Retrieves and type-casts JSON data from the engine's resource manager.
 *
 * @typeParam T - The expected type of the JSON data.
 * @param {string} resourceName - The name of the JSON resource.
 * @returns {T | null} The typed JSON data, or null if not found.
 */
    public static getTypedJSONResource<T = any>(resourceName: string): T | null {
        try {
            const jsonData = (ENGINE.resources as any).items[resourceName];
            if (!jsonData) {
                console.warn(`JSON resource '${resourceName}' not found.`);
                return null;
            }
            return jsonData as T;
        } catch (error) {
            console.error(`Error retrieving JSON resource '${resourceName}':`, error);
            return null;
        }
    }

    /**
     * Binds multiple methods of a class instance to preserve 'this' context.
     * 
     * This is useful when passing methods as callbacks to event systems or other APIs
     * where the original 'this' context would be lost. Binding in the constructor
     * is more performant than using arrow functions for each method, as it:
     * - Keeps methods on the prototype (shared across instances)
     * - Binds only once per instance instead of creating new functions
     * - Reduces memory overhead, especially important for frequently instantiated objects
     * 
     * @param instance - The class instance whose methods need to be bound
     * @param methods - Array of method names (as strings) to bind
     * 
     * @example
     * ```typescript
     * class Player {
     *     constructor() {
     *         Utilities.bindMethods(this, ['update', 'onCollision', 'onDeath']);
     *         EventSystem.on('update', this.update);
     *     }
     * 
     *     private update(deltaTime: number) {
     *         // 'this' is now correctly bound
     *         this.position.x += this.velocity.x * deltaTime;
     *     }
     * }
     * ```
     */
    public static bindMethods(instance: any, methods: string[]): void {
        methods.forEach(method => {
            if (typeof instance[method] === 'function') {
                instance[method] = instance[method].bind(instance);
            } else {
                console.warn(`Method '${method}' does not exist on instance.`);
            }
        });
    }
}