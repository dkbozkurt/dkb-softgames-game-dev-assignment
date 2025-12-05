import { Singleton } from '../../../engine/Components/Singleton';

export default class MagicWordsService extends Singleton {
    private readonly _endpoint: string = 'https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords';

    constructor()
    {
        super();
    }

    /**
     * Fetches the magic words data from the API.
     * @returns Promise<any> The JSON data or null if failed.
     */
    public async getData(): Promise<any> {
        try {
            const response = await fetch(this._endpoint);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('MagicWordsService: Failed to fetch data.', error);
            return null;
        }
    }
}