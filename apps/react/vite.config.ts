import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const root = path.resolve(__dirname, "../..");

  // Load environment variables from the monorepo root
  const env = loadEnv(mode, root, "VITE_");
  console.log("VITE_API_URL =", env.VITE_API_URL);

  return {
    envDir: root,

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    server: {
      port: 2601,
      strictPort: true,
    },

    plugins: [
      react(),
      babel({
        presets: [reactCompilerPreset()],
      }),
      tailwindcss(),
    ],
  };
});
