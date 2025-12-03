import AudioManager from '../Core/AudioManager';

import soundOnSprite from '@/assets/textures/helpers/sound-on.png';
import soundOffSprite from '@/assets/textures/helpers/sound-off.png';

export default class MuteButton {
    private _audioManager: AudioManager;
    private _muteButton: HTMLElement;
    private _muteButtonIcon: HTMLElement;

    constructor() {
        this._audioManager = AudioManager.instance();
        this._muteButton = document.getElementById('mute__button__base')!;
        this._muteButtonIcon = this._muteButton.querySelector('.mute__button__icon')!;

        this.setup();
        this._muteButton.addEventListener('click', this._boundToggle);
    }

    private _boundToggle = (e: Event): void => {
        if (e.target === this._muteButton) {
            this.toggle();
        }
    };

    private setup(): void {
        this._muteButtonIcon.style.backgroundImage = `url(${soundOnSprite})`;
        this.setVisibility(true);
    }

    private setVisibility(visible: boolean): void {
        this._muteButton.style.display = visible ? 'block' : 'none';
    }

    private toggle(): void {
        this._audioManager.toggleMute();
        this.updateIcon();
    }

    private updateIcon(): void {
        const sprite = this._audioManager.isMuted ? soundOffSprite : soundOnSprite;
        this._muteButtonIcon.style.backgroundImage = `url(${sprite})`;
    }

    public destroy(): void {
        this._muteButton.removeEventListener('click', this._boundToggle);
    }
}
