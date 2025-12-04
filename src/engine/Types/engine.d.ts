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
        };
        browserVersion: string;
        orientation: DeviceOrientation;
    };

    export type AssetSourceType = 'texture' | 'audio' | 'font' | 'json';

    export type AssetSource = {
        name: game.AssetSourceName;
        type: AssetSourceType;
        path: string;
    };

    export type ResizeData = {
        width: number;
        height: number;
        pixelRatio: number;
    };

    export type OrientationChangeData = {
        orientation: DeviceOrientation;
    };
}