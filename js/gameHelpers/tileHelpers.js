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

// Рисуем стол
export function renderTable(cx, w, h, o = {}) {
  const {
    tableColor = '#8B4513',
    legColor = '#5C3317'
  } = o;

  cx.save();
  cx.translate(w/2, h/2);

  const tW = w*.8;
  const tH = h*.2;
  const lW = tW*.1;
  const lH = h*.4;
  const tHalf = tW/2;
  const lPos = tHalf-lW/2;

  // Столешница
  cx.fillStyle = tableColor;
  cx.beginPath();
  cx.rect(-tHalf, -tH/2, tW, tH);
  cx.fill();

  // Установка стиля для обводки
  cx.strokeStyle = 'black';
  cx.lineWidth = 1;
  cx.stroke();

  // Ножки
  cx.fillStyle = legColor;

  // Правая ножка
  cx.beginPath();
  cx.rect(lPos-2, tH/2, lW, lH);
  cx.fill();
  cx.stroke();

  // Левая ножка
  cx.beginPath();
  cx.rect(-(lPos+1), tH/2, lW, lH);
  cx.fill();
  cx.stroke();

  cx.restore();
}

// Рисуем торшер
export function renderLamp(cx, w, h, o = {}) {
  const {
    shadeColor = '#FFD700',
    standColor = '#333',
    addGlow = true
  } = o;

  cx.save();
  cx.translate(w/2, h/2);

  const lH = h*.8;
  const sW = w*.05;
  const lTop = -lH/2; // верхняя точка лампы
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

  // === НОЖКА ===
  cx.fillStyle = standColor;
  cx.beginPath();
  cx.rect(-sW/2, lTop, sW, lH);
  cx.fill();
  cx.strokeStyle = 'rgb(246,255,167)';
  cx.lineWidth = 2;
  cx.stroke();

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
  cx.stroke();

  cx.restore();
}

// Рисуем дерево в горшке
export function renderPottedTree(cx, w, h, o = {}) {
  const {
    potColor = '#bc8000',
    trunkColor = '#654321',
    foliageColor = '#228B22'
  } = o;

  cx.save();
  cx.translate(w/2, h/2);

  // Размеры элементов
  const pH = h*.2, pW = w*.5;
  const tH = h*.25, tW = w*.1;
  const topY = h/2 - pH - tH - 15;

  // Горшок
  cx.fillStyle = potColor;
  cx.beginPath();
  cx.rect(-pW/2, h/2-pH-5, pW, pH);
  cx.fill();
  cx.strokeStyle = 'rgba(133,73,0,0.66)';
  cx.lineWidth = 2;
  cx.stroke();

  // Ствол
  cx.fillStyle = trunkColor;
  cx.beginPath();
  cx.rect(-tW/2, h/2-pH-tH-5, tW, tH);
  cx.fill();
  cx.stroke();

  // Елочка
  cx.fillStyle = foliageColor;
  cx.strokeStyle = 'rgba(99,213,99,0.51)';

  const lH = [h*.25, h*.42, h*.67]; // высота ярусов
  const lW = [w*.3, w*.45, w*.6];   // ширина ярусов

  // Рисуем все ярусы в одном цикле
  let y = topY;
  for (let i = 0; i < 3; i++) {
    cx.beginPath();
    cx.moveTo(0, y-5);
    cx.lineTo(-lW[i]/2, y-lH[i]-3*i);
    cx.lineTo(lW[i]/2, y-lH[i]+3*i+i);
    cx.closePath();
    cx.fill();
    cx.stroke();
    y += lH[i]*.9;
  }
  cx.restore();
}

export function renderPalmTree(cx, w, h, o = {}) {
  const {
    potColor = '#8B0000',
    trunkColor = '#8B5A2B',
    leafColors = ['#7ada7a','#ffe335','#f6ffa7','#fb6c37','#228B22','#229B22']
  } = o;

  cx.save();
  cx.translate(w/2, h/2);

  // Размеры элементов
  const pH = h*.2;
  const pW = w*.4;
  const tH = h*.4;
  const tW = w*.08;
  const lL = w*.35;
  const lW = w*.12;
  const top = h/2-pH-tH-5; // позиция верха ствола

  // Горшок
  cx.fillStyle = potColor;
  cx.beginPath();
  cx.rect(-pW/2, h/2-pH-5, pW, pH);
  cx.fill();
  cx.strokeStyle = 'black';
  cx.lineWidth = 1;
  cx.stroke();

  // Ствол
  cx.fillStyle = trunkColor;
  cx.beginPath();
  cx.rect(-tW/2, top, tW, tH);
  cx.fill();
  cx.strokeStyle = 'rgba(133,73,0,0.66)';
  cx.stroke();

  // Листья (несколько направлений)
  const angles = [-60, -30, 0, 30, 60, 90];

  cx.strokeStyle = 'rgb(172,188,0)';

  // Переместим основную трансляцию на верх ствола сразу
  cx.translate(0, top);

  for(let i = 0; i < 6; i++) {
    cx.save();
    cx.fillStyle = leafColors[i];
    cx.rotate(angles[i] * Math.PI/180);
    cx.beginPath();
    cx.ellipse(0, 0, lL, lW, 0, 0, Math.PI*2);
    cx.fill();
    cx.stroke();
    cx.restore();
  }

  cx.restore();
}
