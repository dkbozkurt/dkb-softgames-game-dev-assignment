import AudioManager from '../Core/AudioManager.ts'

import soundOnSprite from '@/assets/textures/helpers/sound-on.png'
import soundOffSprite from '@/assets/textures/helpers/sound-off.png'

export default class MuteButton {

    private _audioManager: AudioManager
    private _muteButton: HTMLElement
    private _muteButtonIcon: HTMLElement

    constructor() {
        this._audioManager = new AudioManager();

        this._muteButton = document.getElementById('mute__button__base') as HTMLElement
        this._muteButtonIcon = this._muteButton.querySelector('.mute__button__icon') as HTMLElement

        this.setup()

        this._muteButton.addEventListener('click', (e) => {
            if (e.target === this._muteButton)
                this.toggle();
        })
    }

    setup() {
        this._muteButtonIcon.style.backgroundImage = `url(${soundOnSprite})`

        this.setStatus(true)
    }

    private setStatus(status: boolean) {
        this._muteButton.style.display = status ? 'block' : 'none';
    }

    private toggle(): void {

        this._audioManager.toggleMute()

        this.setIcon()
    }

    private setIcon(): void {
        const muteIconSprite = this._audioManager.isMuted ? soundOffSprite : soundOnSprite
        this._muteButtonIcon.style.backgroundImage = `url(${muteIconSprite})`
    }

    update() { }

    destroy() { }
}