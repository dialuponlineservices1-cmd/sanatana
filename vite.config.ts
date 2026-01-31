
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vite replaces process.env during build. 
    // We must ensure the value is handled but doesn't hardcode empty strings if not set locally.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  },
  server: {
    port: 3000
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          genai: ['@google/genai']
        }
      }
    }
  }
});
