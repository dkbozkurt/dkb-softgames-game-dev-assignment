import ENGINE from './engine/Engine.ts';

document.addEventListener("DOMContentLoaded", function () {
	const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement

	if(canvas) ENGINE.initialize(canvas);
});