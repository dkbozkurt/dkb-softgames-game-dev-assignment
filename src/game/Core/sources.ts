import backgroundAudio from '@/assets/audios/CalmBG.mp3';
import poppinsBoldFont from '@/assets/fonts/Poppins-Bold.ttf';
import testTexture from '@/assets/textures/test.png';

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
    }
];

export default sources;
