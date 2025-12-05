import { Singleton } from '../../engine/Components/Singleton';
import ENGINE from '../../engine/Engine';
import EventSystem from '../../engine/EventSystem';
import Utilities from '../../engine/Utils/Utilities';

type AudioResources = Record<game.AudioName, HTMLAudioElement>;

export default class AudioManager extends Singleton {
    public audios!: AudioResources;

    private _isMuted: boolean = false;
    private _isActive: boolean = false;
    private _loopingAudios: Set<game.AudioName> = new Set();

    constructor() {
        super();
        Utilities.bindMethods(this, ['setAudios']);
        EventSystem.on('ready', this.setAudios);
    }

    public playSound(sound: game.AudioName, volume: number = 1, loop: boolean = false): void {
        if (!this._isActive || !this.audios[sound]) return;

        const audio = this.audios[sound];
        audio.volume = this._isMuted ? 0 : volume;
        audio.currentTime = 0;
        audio.loop = loop;
        audio.play().catch(() => { });

        if (loop) {
            this._loopingAudios.add(sound);
        }
    }

    public stopSound(sound: game.AudioName): void {
        if (!this.audios[sound]) return;

        this.audios[sound].pause();
        this.audios[sound].currentTime = 0;
        this._loopingAudios.delete(sound);
    }

    public stopAllLooping(): void {
        this._loopingAudios.forEach(sound => this.stopSound(sound));
        this._loopingAudios.clear();
    }

    public setActive(status: boolean): void {
        this._isActive = status;
        if (status) {
            this.unMute();
        }
    }

    public toggleMute(): void {
        this._isMuted ? this.unMute() : this.mute();
    }

    public mute(): void {
        this._isMuted = true;
        this.updateAllVolumes();
    }

    public unMute(): void {
        this._isMuted = false;
        this.updateAllVolumes();
    }

    public get isMuted(): boolean {
        return this._isMuted;
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    private setAudios(): void {
        this.audios = {
            ButtonClick: ENGINE.resources.items.buttonClickAudio as HTMLAudioElement,
            CardMove: ENGINE.resources.items.cardMoveAudio as HTMLAudioElement,
            Message: ENGINE.resources.items.messageAudio as HTMLAudioElement,
            Fire: ENGINE.resources.items.fireAudio as HTMLAudioElement
        };

        this._isActive = true;
    }

    private updateAllVolumes(): void {
        if (!this.audios) return;

        for (const audio of Object.values(this.audios)) {
            if (audio) {
                audio.muted = this._isMuted;
            }
        }
    }

    public destroy(): void {
        this.stopAllLooping();
        EventSystem.off('ready', this.setAudios);
        super.destroy();
    }
}