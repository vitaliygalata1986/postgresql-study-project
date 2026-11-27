import { env } from 'node:process';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/': {
        target: env.POSTS_API_TARGET || 'http://127.0.0.1:3000',
        // Префикс /api отделяет запросы к Express от маршрутов самого клиента.
        rewrite: (path) => path.slice('/api'.length),
      },
    },
  },
});
