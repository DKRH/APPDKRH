import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const root = path.resolve(__dirname, "../..");

  // Load environment variables from the monorepo root

  return {
    envDir: root,

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    server: {
      port: 2600,
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
