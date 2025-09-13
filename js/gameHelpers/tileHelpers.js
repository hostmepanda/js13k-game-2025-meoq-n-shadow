export function rndrTl(cx, w, h, o = {}) {
  const {
    bodyColor = 'rgb(180,180,180)',
    coverColor,
    injectColor,
    closingColor,
    rotation = 0,
  } = o;

  cx.save();

  if (rotation) {
    cx.translate(w/2, h/2);
    // Упрощенный поворот: r*90 градусов
    cx.rotate((Math.PI/2) * (rotation % 4));
    cx.translate(-w/2, -h/2);
  }

  // Основное тело
  cx.fillStyle = bodyColor;
  cx.fillRect(0, 0, w, h);

  // Верхняя крышка
  if (coverColor) {
    cx.fillStyle = coverColor;
    cx.fillRect(0, 0, w, 7);

    // Нижняя крышка (использует тот же цвет)
    if (closingColor) {
      cx.fillStyle = closingColor;
      cx.fillRect(0, h-7, w, 7);
    }
  }

  // Отрисовка точек крепления
  if (injectColor) {
    cx.fillStyle = injectColor;
    const wq = w/4; // четверть ширины
    const hm = h/2; // середина высоты
    const hs = h/15; // маленькое смещение по высоте
    const hq = h/4; // четверть высоты

    // Рисуем все 4 точки за один проход
    for(let i=0; i<2; i++) {
      for(let j=0; j<2; j++) {
        cx.fillRect(
          w/2 + (i?1:-1)*wq,
          hm + (j?hq:-hs),
          1, 1
        );
      }
    }
  }

  cx.restore();
}

// Рисуем торшер
export function renderLamp(cx, w, h, o = {}) {
  const {
    shadeColor = '#FFD700',
    standColor,
    addGlow = true,
    rotation = 0,
  } = o;

  cx.save();

  // Переносим в центр для поворота
  cx.translate(w/2, h/2);

  // Поворачиваем если нужно
  if (rotation) {
    // Упрощенный поворот: r*90 градусов
    cx.rotate((Math.PI/2) * (rotation % 4));
  }

  const lH = h*.8;
  const sW = w*.05;
  const isUpsideDown = rotation === 2;
  const lTop = isUpsideDown ? 0 - 7 : -lH/2; // Корректируем верхнюю точку лампы при повороте
  const gY = lTop + h*.15; // позиция Y для свечения

  // === СВЕЧЕНИЕ ===
  if (addGlow) {
    const g = cx.createRadialGradient(
      0, gY, 5,
      0, gY, w
    );
    g.addColorStop(0, 'rgba(255,255,200,0.6)');
    g.addColorStop(1, 'rgba(255,255,200,0)');

    cx.fillStyle = g;
    cx.beginPath();
    cx.ellipse(0, lTop + h*.2, w*.9, h*.7, 0, 0, Math.PI*2);
    cx.fill();
  }

  // === НОЖКА === (рисуем только если задан цвет ножки)
  if (standColor) {
    cx.fillStyle = standColor;
    cx.beginPath();
    cx.rect(-sW/2, lTop, sW, lH);
    cx.fill();
    cx.strokeStyle = 'rgb(246,255,167)';
    cx.lineWidth = 2;
    cx.stroke();
  }

  // === АБАЖУР ===
  const shW = w*.6;
  const shH = h*.3;
  const shW4 = shW*.4; // 40% от ширины абажура

  cx.fillStyle = shadeColor;
  cx.beginPath();
  cx.moveTo(-shW/2, lTop);
  cx.lineTo(shW/2, lTop);
  cx.lineTo(shW4, lTop + shH);
  cx.lineTo(-shW4, lTop + shH);
  cx.closePath();
  cx.fill();
  cx.strokeStyle = 'rgb(246,255,167)';
  cx.stroke();

  cx.restore();
}

// Рисуем дерево в горшке
export function renderTree(c, w, h, o = {}) {
  const isPalm = o.type === "palm";
  const pot = o?.potColor || (isPalm ? '#8B0000' : '#bc8000');
  const trunk = o?.trunkColor || (isPalm ? '#8B5A2B' : '#654321');
  const fColor = o?.foliageColor || '#228B22';
  const leafC = o?.leafColors || ['#7ada7a','#ffe335','#f6ffa7','#fb6c37','#228B22','#229B22'];

  c.save();
  c.translate(w/2, h/2);

  // Размеры элементов
  const pH = h*.2, pW = w * (isPalm ? .4 : .5);
  const tH = h * (isPalm ? .4 : .25), tW = w * (isPalm ? .08 : .1);
  const topY = h/2 - pH - tH - (isPalm ? 5 : 15);

  // Горшок
  c.fillStyle = pot;
  c.beginPath();
  c.rect(-pW/2, h/2-pH-5, pW, pH);
  c.fill();
  c.strokeStyle = isPalm ? 'black' : 'rgba(133,73,0,0.66)';
  c.lineWidth = isPalm ? 1 : 2;
  c.stroke();

  // Ствол
  c.fillStyle = trunk;
  c.beginPath();
  c.rect(-tW/2, isPalm ? topY : h/2-pH-tH-5, tW, tH);
  c.fill();
  c.strokeStyle = 'rgba(133,73,0,0.66)';
  c.stroke();

  if (isPalm) {
    // // Листья пальмы
    // const lL = w*.35, lW = w*.12;
    // const angles = [-60, -30, 0, 30, 60, 90];
    //
    // c.strokeStyle = 'rgb(172,188,0)';
    // c.translate(0, topY);
    //
    // for(let i = 0; i < 6; i++) {
    //   c.save();
    //   c.fillStyle = leafC[i];
    //   c.rotate(angles[i] * Math.PI/180);
    //   c.beginPath();
    //   c.ellipse(0, 0, lL, lW, 0, 0, Math.PI*2);
    //   c.fill();
    //   c.stroke();
    //   c.restore();
    // }
  } else {
    // Елочка
    c.fillStyle = fColor;
    c.strokeStyle = 'rgba(99,213,99,0.51)';

    const lH = [h*.25, h*.42, h*.67]; // высота ярусов
    const lW = [w*.3, w*.45, w*.6];   // ширина ярусов

    // Рисуем все ярусы в одном цикле
    let y = topY;
    for (let i = 0; i < 3; i++) {
      c.beginPath();
      c.moveTo(0, y-5);
      c.lineTo(-lW[i]/2, y-lH[i]-3*i);
      c.lineTo(lW[i]/2, y-lH[i]+3*i+i);
      c.closePath();
      c.fill();
      c.stroke();
      y += lH[i]*.9;
    }
  }

  c.restore();
}
