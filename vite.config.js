import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        framework: resolve(__dirname, 'framework.html'),
        profile: resolve(__dirname, 'profile.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
