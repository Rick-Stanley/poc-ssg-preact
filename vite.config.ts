import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import ssr from 'vike/plugin';
import micro from './micro';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact(),
		ssr({ prerender: true }),
		micro(),
	],
	build: {
		rollupOptions: {
			external: ['preact', 'vike/server', 'preact-render-to-string', 'preact/hooks'],
			output: {
				entryFileNames: `[name].js`,
				chunkFileNames: `[name].js`,
				assetFileNames: `[name].[ext]`,
			}
		}
	}
});
