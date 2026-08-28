import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Splitting React into its own chunk means it's cached separately from
    // app code — a Lighthouse "reduce unused JavaScript" / caching win, and
    // it means future app updates don't force users to re-download React.
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
