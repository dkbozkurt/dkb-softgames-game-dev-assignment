import { Singleton } from "../../engine/Components/Singleton";
import ENGINE from "../../engine/Engine";
import EventSystem from "../../engine/EventSystem";
import Utilities from "../../engine/Utils/Utilities";

type AudioResources = Record<game.AudioName, HTMLAudioElement>;

export default class AudioManager extends Singleton {

    public audios!: AudioResources;

    private _isMuted: boolean = false;
    private _isActiveForAudios: boolean = false;

    constructor() {
        super()

        Utilities.bindMethods(this,['setAudios']);
        EventSystem.on('ready',this.setAudios)
    }

    public playSound(sound: game.AudioName, volume: number = 1, loop: boolean = false) {

        if (!this._isActiveForAudios) return

        this.audios[sound].volume = volume
        this.audios[sound].currentTime = 0
        this.audios[sound].loop = loop
        this.audios[sound].play()
    }

    public stopSound(sound: game.AudioName) {
        this.audios[sound].pause()
        this.audios[sound].currentTime = 0
    }

    public setIsActiveForAudios(status: boolean) {
        this._isActiveForAudios = status;

        this.unMuteAudios()

        this.playSound('Background', 0.5, true)
    }

    public toggleMute() {
        if (this._isMuted) {
            this.unMuteAudios()
        }
        else {
            this.muteAudios()
        }
    }

    public muteAudios() {
        this.setMuteStatus(true)
    }

    public unMuteAudios() {
        this.setMuteStatus(false)
    }

    public get isMuted() {
        return this._isMuted
    }

    private setAudios() {
        this.audios = {
            "Background": ENGINE.resources.items.backgroundAudio,
        } as const;

        // this.muteAudios()
    }

    private setMuteStatus(status: boolean) {
        this._isMuted = status;

        for (const audio of Object.values(this.audios)) {
            audio.muted = this._isMuted;
        }
    }

    public destroy()
    {
        EventSystem.off('ready',this.setAudios)
    }

}