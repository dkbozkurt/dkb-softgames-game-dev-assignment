import fadingHighlightZoneTexture from '@/assets/textures/helpers/fadingHighlightZone.png';
import shineBigTexture from '@/assets/textures/helpers/ShineRayBig.png';
import pointGlowTexture from '@/assets/textures/helpers/PointGlow.png';
import shineSmallTexture from '@/assets/textures/helpers/ShineRaySmall.png';
import tutorialHandTexture from '@/assets/textures/helpers/CartoonTutorialHand_1024.png';
import backgroundAudio from '@/assets/audios/CalmBG.mp3';

import poppinsBoldFont from '@/assets/fonts/Poppins-Bold.ttf';

import testJsonUrl from '@/assets/jsons/testJson.json?url';

const sources: engine.AssetSource[] = [
    {
        name: 'fadingHighlightZone',
        type: 'texture',
        path: fadingHighlightZoneTexture
    },
    {
        name: 'shineBig',
        type: 'texture',
        path: shineBigTexture
    },
    {
        name: 'shineSmall',
        type: 'texture',
        path: shineSmallTexture
    },
    {
        name: 'pointGlow',
        type: 'texture',
        path: pointGlowTexture
    },
    {
        name:'tutorialHand',
        type: 'texture',
        path: tutorialHandTexture
    },
    {
        name: 'poppinsBold',
        type: 'font',
        path: poppinsBoldFont,
    },
    {
        name: 'testJson',
        type: 'json',
        path: testJsonUrl,
    },
    {
        name: 'backgroundAudio',
        type: 'audio',
        path: backgroundAudio,
    },
]

export default sources;