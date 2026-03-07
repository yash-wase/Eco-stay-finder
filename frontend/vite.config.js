import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/properties': 'http://localhost:8000',
      '/booking-request': 'http://localhost:8000',
      '/user-bookings': 'http://localhost:8000',
      '/save-property': 'http://localhost:8000',
      '/remove-property': 'http://localhost:8000',
      '/saved-properties': 'http://localhost:8000',
      '/owner-properties': 'http://localhost:8000',
      '/owner-bookings': 'http://localhost:8000',
      '/admin': 'http://localhost:8000',
    }
  }
})

