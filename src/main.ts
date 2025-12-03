import ENGINE from './engine/Engine.ts';

export let dapi: unknown
export let mraid: unknown

document.addEventListener("DOMContentLoaded", function () {
	const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement

	if(canvas) ENGINE.initialize(canvas);
});

export function userClickedDownloadButton(url:string) : void
{
    console.log('External API store call!');
}