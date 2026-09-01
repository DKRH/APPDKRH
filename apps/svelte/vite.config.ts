import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
    	sveltekit(),
	],

	server: {
		port: 2600,
		strictPort: true,
		proxy: {
			"/api": {
				target: "http://localhost:2601",
				changeOrigin: true,
			},
		},
	},
});
