import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: '/index.html',
        categorias: '/categorias.html',
        servicios: '/servicios.html',
        tienda: '/tienda.html',
        nosotros: '/nosotros.html',
        contacto: '/contacto.html'
      }
    }
  }
})