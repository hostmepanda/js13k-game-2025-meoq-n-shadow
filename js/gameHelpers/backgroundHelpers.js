// Создаёт offscreen canvas с паттерном и возвращает CanvasPattern
export function createWallpaperPattern(ctx, options = {}) {
  const {
    style = 'damask',     // 'damask' | 'stripes' | 'dots'
    tileSize = 128,      // размер тайла паттерна
    bgColor = '#F5F3EA', // фон обоев
    fgColor = '#C9B27D', // основной цвет узора
    accentColor = null,  // дополнительный цвет (опционально)
    scale = 1            // масштаб узора (1 = по tileSize)
  } = options;


  // offscreen canvas (поддерживается в современных браузерах)
  const off = document.createElement('canvas');
  off.width = Math.round(tileSize * scale);
  off.height = Math.round(tileSize * scale);
  const c = off.getContext('2d');
  // фон
  c.fillStyle = bgColor;
  c.fillRect(0, 0, off.width, off.height);

  // helper: stroke/fill defaults
  c.lineJoin = 'round';
  c.lineCap = 'round';

  if (style === 'stripes') {
    // тонкие диагональные полосы
    const stripeW = Math.max(4, Math.round(6 * scale));
    c.save();
    c.translate(off.width/2, off.height/2);
    c.rotate(-20 * Math.PI/180);
    c.translate(-off.width/2, -off.height/2);

    c.fillStyle = fgColor;
    for (let x = -off.width; x < off.width * 2; x += stripeW * 3) {
      c.fillRect(x, -off.height, stripeW, off.height * 4);
    }
    c.restore();

    // лёгкая текстура (полупрозрачные штрихи)
    c.globalAlpha = 0.08;
    c.fillStyle = fgColor;
    for (let i = 0; i < 30; i++) {
      c.beginPath();
      c.arc(Math.random()*off.width, Math.random()*off.height, Math.random()*4*scale, 0, Math.PI*2);
      c.fill();
    }
    c.globalAlpha = 1;
  } else if (style === 'dots') {
    // равномерные точки (узор в шахматном виде)
    const step = Math.round(24 * scale);
    const r = Math.round(4 * scale);
    c.fillStyle = fgColor;
    for (let y = 0; y < off.height + step; y += step) {
      for (let x = 0; x < off.width + step; x += step) {
        const shift = ((y / step) % 2) ? step/2 : 0;
        c.beginPath();
        c.arc((x + shift) % off.width, y % off.height, r, 0, Math.PI*2);
        c.fill();
      }
    }
    // опциональные блёски
    if (accentColor) {
      c.globalAlpha = 0.12;
      c.fillStyle = accentColor;
      for (let i = 0; i < 12; i++) {
        c.beginPath();
        c.arc(Math.random()*off.width, Math.random()*off.height, Math.random()*6*scale, 0, Math.PI*2);
        c.fill();
      }
      c.globalAlpha = 1;
    }
  } else {
    // DAMASK-like motif (симметричный цветочный элемент)
    const w = off.width, h = off.height;
    // центральный цветок (с зеркалированием)
    const drawPetal = (cx, cy, rx, ry, rot = 0) => {
      c.save();
      c.translate(cx, cy);
      c.rotate(rot);
      c.beginPath();
      c.ellipse(0, -ry/2, rx, ry, 0, 0, Math.PI*2);
      c.fill();
      c.restore();
    };

    c.fillStyle = fgColor;
    // base symmetric motif at center
    const cx = w/2, cy = h/2;
    drawPetal(cx, cy, w*0.12, h*0.28, 0);
    drawPetal(cx, cy, w*0.12, h*0.28, Math.PI/2);
    drawPetal(cx, cy, w*0.12, h*0.28, Math.PI/4);
    drawPetal(cx, cy, w*0.12, h*0.28, -Math.PI/4);

    // small dots & center
    c.beginPath();
    c.arc(cx, cy, Math.round(6*scale), 0, Math.PI*2);
    c.fill();

    // mirrored copies to make tiling feel ornamental
    // place smaller motifs at tile corners (ensure seamless look)
    const smallR = Math.round(8*scale);
    const cornerOffsets = [
      [-w/3, -h/3],
      [w/3, -h/3],
      [-w/3, h/3],
      [w/3, h/3],
    ];
    cornerOffsets.forEach(([ox, oy]) => {
      drawPetal(cx + ox, cy + oy, w*0.08, h*0.18, Math.PI/6);
      c.beginPath();
      c.arc(cx + ox, cy + oy, smallR, 0, Math.PI*2);
      c.fill();
    });

    // subtle highlight if accentColor provided
    if (accentColor) {
      c.globalAlpha = 0.12;
      c.fillStyle = accentColor;
      c.beginPath();
      c.ellipse(cx, cy - h*0.06, w*0.18, h*0.08, 0, 0, Math.PI*2);
      c.fill();
      c.globalAlpha = 1;
    }

    // add thin outline to motif for clarity
    c.strokeStyle = 'rgba(0,0,0,0.06)';
    c.lineWidth = Math.max(1, Math.round(1*scale));
    // subtle strokes around main petals
    c.beginPath();
    c.ellipse(cx, cy, w*0.12, h*0.12, 0, 0, Math.PI*2);
    c.stroke();
  }

  // Возвращаем паттерн, готовый к использованию
  return ctx.createPattern(off, 'repeat');
}

// Пример использования в твоём рендере параллакса
// wallpaperPattern = createWallpaperPattern(context, { style: 'damask', tileSize: 128, bgColor:'#F0EAD6', fgColor:'#C2A759' });
// context.fillStyle = wallpaperPattern;
// context.fillRect(0,0,canvas.width, canvas.height);

export function renderParallaxBackground(context, width, height, cameraX = 0, cameraY = 0, options = {
  style: 'damask',   // 'damask' | 'stripes' | 'dots'
  tileSize: 128,
  bgColor: 'rgba(255,227,53,0.41)',
  fgColor: 'rgba(255,215,0,0.38)',
  accentColor: 'rgba(255,0,0,0.31)',
  scale: 1,
  layers: [
    { speed: 1, alpha: 1 },
    { speed: 1, alpha: 1 },
    { speed: 1, alpha: 1 },
  ]
}) {
  const basePatterns = [
    createWallpaperPattern(context, {
      ...options,
      style: 'stripes',
      tileSize: 390,
      bgColor: 'rgba(115,65,0,0.85)',
      fgColor: 'rgb(255,228,116)',
      accentColor: 'rgb(244,244,244)',
      scale: 2
    }),
    createWallpaperPattern(context, {
      ...options,
      scale: 2,
      tileSize: 390,
      style: 'stripes',
      bgColor: 'rgba(255,236,156,0.38)',
      fgColor: 'rgba(124,98,0,0.18)',
      accentColor: 'rgb(244,244,244)',
    }),
    createWallpaperPattern(context, {
      ...options,
      tileSize: 390,
      scale: 3,
      style: 'damask',
      fgColor: 'rgba(246,255,167,0.13)',
    }),
  ];
  context.save();

  // несколько слоёв с разной скоростью и прозрачностью
  const layers = options.layers;

  layers.forEach((layer, index) => {
    // параллакс-смещение
    const offsetX = -cameraX * layer.speed;
    const offsetY = -cameraY * layer.speed;

    context.globalAlpha = layer.alpha;

    // сбрасываем трансформации перед каждым слоем
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(offsetX, offsetY);

    context.fillStyle = basePatterns[index];
    context.fillRect(-offsetX, -offsetY , width + options.tileSize, (height + options.tileSize));
  });

  // сбросить все эффекты
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.globalAlpha = 1;
  context.restore();
}