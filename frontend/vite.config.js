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
      '/properties': 'http://localhost:4000',
      '/booking-request': 'http://localhost:4000',
      '/user-bookings': 'http://localhost:4000',
      '/save-property': 'http://localhost:4000',
      '/remove-property': 'http://localhost:4000',
      '/saved-properties': 'http://localhost:4000',
      '/owner-properties': 'http://localhost:4000',
      '/owner-bookings': 'http://localhost:4000',
      '/admin': 'http://localhost:4000',
    }
  }
})

