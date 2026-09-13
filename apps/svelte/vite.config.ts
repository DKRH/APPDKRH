import tailwindcss from '@tailwindcss/vite';
//import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const envDir = fileURLToPath(new URL('../../', import.meta.url));
	const env = loadEnv(mode, envDir, '');
	const honoApiPort = env.HONO_API_PORT;

	if (!honoApiPort) {
		throw new Error('HONO_API_PORT is missing from the workspace .env file');
	}

	return {
		plugins: [
			tailwindcss(),
				sveltekit(),
		],

		server: {
			port: 2600,
			strictPort: true,
			proxy: {
				"/api": {
					target: `http://localhost:${honoApiPort}`,
					changeOrigin: true,
				},
			},
		},
	};
});
