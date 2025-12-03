namespace engine {

    export type DeviceOS = 'iOS' | 'Android' | 'WindowsPhone' | 'Unknown';

    export type DeviceOrientation = 'portrait' | 'landscape';

    export type DeviceInfo = {
        os: DeviceOS;
        osVersion: string;
        isWebView: boolean;
        screenSize: {
            width: number;
            height: number;
        }
        browserVersion: string;
        orientation: DeviceOrientation;
    }

    export type AssetSourceType = 'texture' | 'audio' | 'font' | 'json';

    export type AssetSource = {
        name: game.AssetSourceName;
        type: AssetSourceType;
        path: string;
    }
}

declare module "*.json" {

    const value: any;

    export default value;

}