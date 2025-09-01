import esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['js/game.js'], // укажите правильный путь к вашему основному файлу
  bundle: true,
  minify: true, // включает и сжатие, и переименование
  outfile: 'dist/bundle.js',
}).catch(() => process.exit(1))
