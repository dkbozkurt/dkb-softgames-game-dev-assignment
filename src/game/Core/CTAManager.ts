import { userClickedDownloadButton, dapi, mraid } from '../../main.ts'
import Utilities from "../../engine/Utils/Utilities.ts";
import { Singleton } from '../../engine/Components/Singleton.ts';

const StoreURLS: engine.StoreURLS = {
    Android: 'https://play.google.com/store/games?hl=de',
    iOS: 'https://www.apple.com/app-store/',
    WindowsPhone: 'https://play.google.com/store/games?hl=de',
    Unknown: 'https://play.google.com/store/games?hl=de'
}

export default class CTAManager extends Singleton{
    public OS: engine.DeviceOS = "Unknown"

    private _targetURL!: string

    constructor() {
        super();
        this.setOSAndTargetURL()
    }

    private setOSAndTargetURL(): void {
        this.OS = Utilities.getMobileOperatingSystem();

        this._targetURL = StoreURLS[this.OS];
    }

    public callStore(): void {
        if (!this._targetURL) return;

        if (typeof dapi !== 'undefined' || typeof mraid !== 'undefined') {
            userClickedDownloadButton(this._targetURL);
        } else {
            window.open(this._targetURL, '_blank');
        }
    }
}