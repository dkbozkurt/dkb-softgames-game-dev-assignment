import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
	const outDir = process.env.OUT_DIR || 'dist';

	return {
		root: 'src/',
		base: './',
		clearScreen: false,
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src')
			}
		},
		json: {
			stringify: true
		},
		plugins: [
		],
		server: {
			fs: {
				allow: ['..']
			},
			port: 3000,
			host: true,
			open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env),
		},
		build: {
			base: './',
			outDir: path.resolve(__dirname, outDir),
			emptyOutDir: true,
			assetsInlineLimit: Infinity,
			sourcemap: false,
		},
		assetsInclude: [
			'**/*.png', '**/*.jpe?g', '**/*.hdr',
			'**/*.mp4', '**/*.mp3', '**/*.mov', '**/*.wav',
			'**/*.glb', '**/*.gltf',
			'**/*.ttf', '**/*.otf',
			'**/*.json',
		],
	};
});