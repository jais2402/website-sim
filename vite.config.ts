import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // Long-lived vendor chunks: app edits don't invalidate the cached libraries.
        codeSplitting: {
          groups: [
            { name: 'motion', test: /node_modules[\\/](gsap|@gsap|lenis)/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)/ },
          ],
        },
      },
    },
  },
})
