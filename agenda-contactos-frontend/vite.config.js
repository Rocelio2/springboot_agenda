import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Redirige /api al backend de Spring Boot
    proxy: {
      '/api': 'http://localhost:8081',
    },
  },
})
