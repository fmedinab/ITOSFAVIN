import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        categorias: resolve(__dirname, 'categorias.html'),
        servicios: resolve(__dirname, 'servicios.html'),
        tienda: resolve(__dirname, 'tienda.html'),
        nosotros: resolve(__dirname, 'nosotros.html'),
        contacto: resolve(__dirname, 'contacto.html')
      }
    }
  },
  server: {
    open: true,
    watch: {
      usePolling: true
    }
  },
  base: '/',
  publicDir: 'public'
})
