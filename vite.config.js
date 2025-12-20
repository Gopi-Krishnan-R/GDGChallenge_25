import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Firebase into its own chunk
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Split React and React-DOM into their own chunk
          'react-vendor': ['react', 'react-dom'],
          // Split Lucide icons into their own chunk
          'icons': ['lucide-react'],
        },
      },
    },
    // Increase chunk size warning limit to 600kb to avoid warning for the main chunk
    chunkSizeWarningLimit: 600,
  },
})
