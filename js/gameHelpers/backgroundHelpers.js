export function createWallpaperPattern(ctx, options = {}) {
  const {
    style = 'damask',     // 'damask' | 'stripes' | 'dots'
    tileSize = 128,      // размер тайла паттерна
    bgColor = '#F5F3EA', // фон обоев
    fgColor = '#C9B27D', // основной цвет узора
    accentColor = null,  // дополнительный цвет (опционально)
    scale = 1            // масштаб узора (1 = по tileSize)
  } = options;

  const off = document.createElement('canvas');
  off.width = Math.round(tileSize * scale);
  off.height = Math.round(tileSize * scale);
  const c = off.getContext('2d');
  c.fillStyle = bgColor;
  c.fillRect(0, 0, off.width, off.height);
  c.lineJoin = 'round';
  c.lineCap = 'round';

  if (style === 'stripes') {
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
    c.globalAlpha = 0.08;
    c.fillStyle = fgColor;
    for (let i = 0; i < 30; i++) {
      c.beginPath();
      c.arc(Math.random()*off.width, Math.random()*off.height, Math.random()*4*scale, 0, Math.PI*2);
      c.fill();
    }
    c.globalAlpha = 1;
  } else if (style === 'dots') {
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
    const w = off.width, h = off.height;
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
    const cx = w/2, cy = h/2;
    drawPetal(cx, cy, w*0.12, h*0.28, 0);
    drawPetal(cx, cy, w*0.12, h*0.28, Math.PI/2);
    drawPetal(cx, cy, w*0.12, h*0.28, Math.PI/4);
    drawPetal(cx, cy, w*0.12, h*0.28, -Math.PI/4);
    c.beginPath();
    c.arc(cx, cy, Math.round(6*scale), 0, Math.PI*2);
    c.fill();

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

    if (accentColor) {
      c.globalAlpha = 0.12;
      c.fillStyle = accentColor;
      c.beginPath();
      c.ellipse(cx, cy - h*0.06, w*0.18, h*0.08, 0, 0, Math.PI*2);
      c.fill();
      c.globalAlpha = 1;
    }

    c.strokeStyle = 'rgba(0,0,0,0.06)';
    c.lineWidth = Math.max(1, Math.round(1*scale));
    c.beginPath();
    c.ellipse(cx, cy, w*0.12, h*0.12, 0, 0, Math.PI*2);
    c.stroke();
  }

  return ctx.createPattern(off, 'repeat');
}

export function renderParallaxBackground(cx, width, height, cameraX = 0, cameraY = 0, options) {
  cx.save();
  options.layers.forEach((layer, index) => {
    const offsetX = -cameraX * layer.speed;
    const offsetY = -cameraY * layer.speed;

    cx.globalAlpha = layer.alpha;
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.translate(offsetX, offsetY);

    cx.fillStyle = options.patternTiles[index];
    cx.fillRect(-offsetX, -offsetY , width + options.tileSize, (height + options.tileSize));
  });

  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.globalAlpha = 1;
  cx.restore();
}