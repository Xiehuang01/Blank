import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

const normalizeBase = (base?: string) => {
  if (!base || base === '/') return '/';
  if (base === '.' || base === './') return './';
  return `/${base.replace(/^\/+|\/+$/g, '')}/`;
};

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: normalizeBase(env.VITE_PUBLIC_BASE),
    plugins: [vue(), tailwindcss()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      fs: {
        allow: [
          path.resolve(__dirname, '.'),
          path.resolve(__dirname, '../res'),
        ],
      },
    },
  };
});
