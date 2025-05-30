import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Pour /api/auth, on enlève /api
      '/api/auth': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, '/auth'),
      },
      // Pour tous les autres /api, on garde /api
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        // Pas de rewrite ici !
      }
    }
  }
})