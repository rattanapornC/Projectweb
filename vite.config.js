
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://bug-free-goggles-wrqvgqpj5p9rcgwq4-8000.app.github.dev',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
