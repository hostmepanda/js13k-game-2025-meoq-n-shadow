// vite.config.js
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        // Настройки сжатия
        passes: 3,
        pure_getters: true,
        unsafe: true,
        unsafe_math: true,
        unsafe_methods: true,
        drop_console: true,
        drop_debugger: true
      },
      mangle: {
        // Обычная минификация имен переменных
        // toplevel: true,
        // // Минификация имен свойств
        // properties: {
        // //   // Список свойств, которые НЕ нужно сокращать
        //   reserved: [
        //     'render', 'update', 'x', 'y', 'width', 'height',
        //     'canvas', 'context', 'init', 'create', 'traslate', 'rect', 'fill', 'rectFill',
        //     'LEVEL1', 'LEVEL2', 'LEVEL3', 'GAMEOVER', 'VICTORYWHITE', 'VICTORYBLACK'
        //
        //     // Добавьте здесь другие свойства, которые должны сохранить свои имена
        //     // (особенно те, которые используются в kontra.js или других библиотеках)
        //   ],
        // //   // Опции для свойств
        // //   // keep_quoted: true, // сохранять свойства в кавычках без изменений
        // //   // regex: /^_/ // минифицировать только свойства, начинающиеся с подчеркивания
        // }
      },
      format: {
        comments: false,
        // Другие настройки форматирования
      }
    },
    // Другие настройки сборки
    target: 'es2015',
    assetsInlineLimit: 100000, // Инлайнит маленькие файлы (до 100kb)
    cssCodeSplit: false, // Все CSS в один файл
    rollupOptions: {
      output: {
        manualChunks: undefined, // Отключает разделение на чанки
        inlineDynamicImports: true // Инлайнит динамические импорты
      }
    }
  }
}