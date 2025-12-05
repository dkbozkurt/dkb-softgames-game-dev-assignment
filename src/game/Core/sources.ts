import backgroundAudio from '@/assets/audios/CalmBG.mp3';
import poppinsBoldFont from '@/assets/fonts/Poppins-Bold.ttf';
import homeTexture from '@/assets/textures/helpers/home.png';
import cardTexture from '@/assets/textures/card.png';
import fireSpriteSheet from '@/assets/textures/fire_spritesheet_3x3.png'

const sources: engine.AssetSource[] = [
    {
        name: 'poppinsBold',
        type: 'font',
        path: poppinsBoldFont
    },
    {
        name: 'backgroundAudio',
        type: 'audio',
        path: backgroundAudio
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
        name: 'fireSpriteSheet',
        type: 'texture',
        path: fireSpriteSheet
    }
];

export default sources;
