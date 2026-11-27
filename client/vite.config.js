import { cwd } from 'node:process';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const { POSTS_API_TARGET } = loadEnv(mode, cwd(), 'POSTS_API_TARGET');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/': {
          target: POSTS_API_TARGET || 'http://127.0.0.1:3000',
          // Префикс /api отделяет запросы к Express от маршрутов самого клиента.
          rewrite: (path) => path.slice('/api'.length),
        },
      },
    },
  };
});
