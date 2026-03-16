import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('@radix-ui'))                          return 'radix-ui';
          if (id.includes('recharts') || id.includes('/d3-'))   return 'charts';
          if (id.includes('react-dom') || id.includes('/react/')) return 'react-core';
          if (id.includes('zustand') || id.includes('immer'))   return 'state';
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
