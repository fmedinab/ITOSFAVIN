import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: 'index.html',
        categorias: 'categorias.html',
        servicios: 'servicios.html',
        tienda: 'tienda.html',
        nosotros: 'nosotros.html',
        contacto: 'contacto.html'
      }
    },
    // Asegura que los assets se procesen correctamente
    assetsDir: 'assets',
    // Mejora el manejo de archivos estáticos
    copyPublicDir: true
  },
  server: {
    open: true,
    // Añade soporte para hot reload
    watch: {
      usePolling: true
    }
  },
  // Asegura que las rutas sean correctas
  base: '/',
  // Mejora el manejo de archivos estáticos
  publicDir: 'public'
})