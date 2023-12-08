import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import ssr from 'vike/plugin';
import { bundlePreactPlugin, htmlPlugin, htmlPlugin2 } from './micro';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact(),
		ssr({ prerender: true }),
		bundlePreactPlugin(),
		htmlPlugin(),
		htmlPlugin2()
	],
	build: {
		rollupOptions: {
			external: ['preact'],
		}
	}
});
