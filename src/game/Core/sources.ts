import poppinsBoldFont from '@/assets/fonts/Poppins-Bold.ttf';
import homeTexture from '@/assets/textures/helpers/home.png';
import cardTexture from '@/assets/textures/card.png';
import torchTexture from '@/assets/textures/torch.png';
import fireSpriteSheet from '@/assets/textures/fire_spritesheet_3x3.png'

import buttonClickAudio from '@/assets/audios/ButtonClick.mp3';
import cardMoveAudio from '@/assets/audios/CardMove.mp3';
import messageAudio from '@/assets/audios/Message.mp3';
import fireAudio from '@/assets/audios/Fire.mp3';

const sources: engine.AssetSource[] = [
    {
        name: 'poppinsBold',
        type: 'font',
        path: poppinsBoldFont
    },
    {
        name: 'home',
        type: 'texture',
        path: homeTexture
    },
    {
        name: 'gameCard',
        type: 'texture',
        path: cardTexture
    },
    {
        name: 'torch',
        type: 'texture',
        path: torchTexture
    },
    {
        name: 'fireSpriteSheet',
        type: 'texture',
        path: fireSpriteSheet
    },
    {
        name: 'buttonClickAudio',
        type: 'audio',
        path: buttonClickAudio
    },
    {
        name: 'cardMoveAudio',
        type: 'audio',
        path: cardMoveAudio
    },
    {
        name: 'messageAudio',
        type: 'audio',
        path: messageAudio
    },
    {
        name: 'fireAudio',
        type: 'audio',
        path: fireAudio
    },
];

export default sources;
