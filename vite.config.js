import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // удаляет console.log
        passes: 2            // несколько проходов для лучшей оптимизации
      },
      mangle: {
        properties: true     // переименовывает свойства объектов
      }
    }
  }
});