export function renderCatSideView(ctx, scale = 2, options = { flipX: false }) {
  const colors = [
    'rgba(0,0,0,0)',
    '#000000',
    '#a2998d',
    '#5c5751',
    '#413f3a',
    '#ecdcc9',
    '#f26060',
  ]
  // Пиксельная сетка (по образцу 20x20)
  const pixels = [
   `00000000000010001000`,
   `00000000000121012100`,
   `00000000001263136100`,
   `00011100012333333310`,
   `00122310012333333310`,
   `01231510013343334310`,
   `01310100013313531310`,
   `01310001113335653310`,
   `01341115534355555100`,
   `00133222333432221000`,
   `00133333333344411000`,
   `00133333333333241000`,
   `00133444444443310000`,
   `00134111111111410000`,
   `00131130001410131000`,
   `00121000001310012100`,
  ];

  for (let j = 0; j < pixels.length; j++) {
    for (let i = 0; i < pixels[j].length; i++) {
      const p = pixels[j][i];
      // if (p === 0) continue;
      ctx.fillStyle = colors[p];
      const x = options.flipX ? (20 - 1 - i) * scale : i * scale;
      ctx.fillRect(x, j*scale, scale, scale);
    }
  }
}

