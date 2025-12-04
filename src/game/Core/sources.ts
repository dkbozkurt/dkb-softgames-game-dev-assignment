import backgroundAudio from '@/assets/audios/CalmBG.mp3';
import poppinsBoldFont from '@/assets/fonts/Poppins-Bold.ttf';
import testTexture from '@/assets/textures/test.png';
import homeTexture from '@/assets/textures/helpers/home.png';
import cardTexture from '@/assets/textures/card.png';

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
        name: 'test',
        type: 'texture',
        path: testTexture
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
    }
];

export default sources;
