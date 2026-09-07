import tailwindcss from '@tailwindcss/vite';
//import adapter from '@sveltejs/adapter-auto';
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
				target: process.env.HONO_API_URL!,
				changeOrigin: true,
			},
		},
	},
});
