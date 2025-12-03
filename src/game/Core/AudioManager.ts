import { Singleton } from '../../engine/Components/Singleton';
import ENGINE from '../../engine/Engine';
import EventSystem from '../../engine/EventSystem';
import Utilities from '../../engine/Utils/Utilities';

type AudioResources = Record<game.AudioName, HTMLAudioElement>;

export default class AudioManager extends Singleton {
    public audios!: AudioResources;

    private _isMuted: boolean = false;
    private _isActive: boolean = false;

    constructor() {
        super();
        Utilities.bindMethods(this, ['setAudios']);
        EventSystem.on('ready', this.setAudios);
    }

    public playSound(sound: game.AudioName, volume: number = 1, loop: boolean = false): void {
        if (!this._isActive) return;

        this.audios[sound].volume = volume;
        this.audios[sound].currentTime = 0;
        this.audios[sound].loop = loop;
        this.audios[sound].play();
    }

    public stopSound(sound: game.AudioName): void {
        this.audios[sound].pause();
        this.audios[sound].currentTime = 0;
    }

    public setActive(status: boolean): void {
        this._isActive = status;
        this.unMute();
        this.playSound('Background', 0.5, true);
    }

    public toggleMute(): void {
        this._isMuted ? this.unMute() : this.mute();
    }

    public mute(): void {
        this.setMuteStatus(true);
    }

    public unMute(): void {
        this.setMuteStatus(false);
    }

    public get isMuted(): boolean { return this._isMuted; }

    private setAudios(): void {
        this.audios = {
            Background: ENGINE.resources.items.backgroundAudio as HTMLAudioElement
        };
    }

    private setMuteStatus(status: boolean): void {
        this._isMuted = status;
        for (const audio of Object.values(this.audios)) {
            audio.muted = this._isMuted;
        }
    }

    public destroy(): void {
        EventSystem.off('ready', this.setAudios);
        super.destroy();
    }
}
