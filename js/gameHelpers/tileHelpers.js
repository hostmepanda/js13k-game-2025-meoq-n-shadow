export function rndrTl(cx, width, height, options = {}) {
  const {
    bodyColor = 'rgb(180, 180, 180)',
    coverColor, // 'rgb(170, 120, 70)',
    injectColor, //'rgb(175,175,175)',
    closingColor,
    rotation = 0,
  } = options;

  cx.save()

  if (rotation !== 0) {
    cx.translate(width/2, height/2);
    if (rotation >= 1) {
      cx.rotate(Math.PI / 2) // 90 градусов
    }
    if (rotation >= 2) {
      cx.rotate(Math.PI / 2) // 90 градусов
    }
    if (rotation >= 3) {
      cx.rotate(Math.PI / 2) // 90 градусов
    }
    cx.translate(-width/2, -height/2);
  }

  cx.fillStyle = bodyColor;
  cx.fillRect(0, 0, width, height);

  if (coverColor) {
    cx.fillStyle = coverColor;
    cx.fillRect(0, 0, width, 7);
  }

  if (closingColor) {
    const woodHeight = 7
    cx.fillStyle = coverColor;
    cx.fillRect(0, height - 7, width, 7);
  }

  if (injectColor) {
    cx.fillStyle = injectColor;
    cx.fillRect(width / 2 - width / 4, height / 2 - height / 15, 1, 1);
    cx.fillRect(width / 2 - width / 4, height / 2 + height / 4, 1, 1);
    cx.fillRect(width / 2 + width / 4, height / 2 - height / 15, 1, 1);
    cx.fillRect(width / 2 + width / 4, height / 2 + height / 4, 1, 1);
  }

  cx.restore()
}

/**
 * Вспомогательная функция для добавления текстуры гипсокартона
 */
function addDryWallTexture(cx, x, y, width, height) {
  // Генерируем точки на основе координат
  const h = ((x + 67) * (y + 97)) % 256;

  // Вместо случайного числа точек - фиксированное количество,
  // но с разными позициями для разных тайлов
  for (let i = 0; i < 5; i++) {
    const pointX = x + ((h * (i+1)) % width);
    const pointY = y + ((h * (i+7)) % height);

    cx.fillStyle = 'rgba(150, 150, 150, 0.15)';
    cx.beginPath();
    cx.arc(pointX, pointY, 0.4, 0, Math.PI * 2);
    cx.fill();
  }

  // Линия стыка гипсокартона
  if (width > 20 || height > 20) {
    cx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    cx.lineWidth = 0.5;

    if (width > height) {
      const lineY = y + height / 2;
      cx.beginPath();
      cx.moveTo(x, lineY);
      cx.lineTo(x + width, lineY);
      cx.stroke();
    } else {
      const lineX = x + width / 2;
      cx.beginPath();
      cx.moveTo(lineX, y);
      cx.lineTo(lineX, y + height);
      cx.stroke();
    }
  }
}


// Рисуем стол
export function renderTable(cx, width, height, options = {}) {
  const {
    tableColor = '#8B4513', // коричневый
    legColor = '#5C3317'
  } = options;

  cx.save();
  cx.translate(width / 2, height / 2);

  const tableWidth = width * 0.8;
  const tableHeight = height * 0.2;

  // Столешница
  cx.fillStyle = tableColor;
  cx.beginPath();
  cx.rect(-tableWidth / 2, -tableHeight / 2, tableWidth, tableHeight);
  cx.fill();
  cx.strokeStyle = 'black';
  cx.lineWidth = 1;
  cx.stroke();

  // Ножки
  const legWidth = tableWidth * 0.1;
  const legHeight = height * 0.4;
  cx.fillStyle = legColor;

  cx.beginPath();
  cx.rect(
    (tableWidth / 2 - legWidth / 2 - 2),
    tableHeight / 2,
    legWidth,
    legHeight
  );
  cx.fill();
  cx.lineWidth = 1;
  cx.stroke();

  cx.beginPath();
  cx.rect(
    -1 * (tableWidth / 2 - legWidth / 2 + 1),
    tableHeight / 2,
    legWidth,
    legHeight
  );
  cx.fill();
  cx.lineWidth = 1
  cx.stroke();


  cx.restore();
}

// Рисуем торшер
export function renderLamp(cx, width, height, options = {}) {
  const {
    shadeColor = '#FFD700', // абажур
    standColor = '#333',
    addGlow = true
  } = options;

  cx.save();
  cx.translate(width / 2, height / 2);

  const lampHeight = height * 0.8;
  const standWidth = width * 0.05;

  // === СВЕЧЕНИЕ ===
  if (addGlow) {
    const glowGradient = cx.createRadialGradient(
      0, -lampHeight / 2 + (height * 0.15), 5,
      0, -lampHeight / 2 + (height * 0.15), width
    );
    glowGradient.addColorStop(0, 'rgba(255, 255, 200, 0.6)');
    glowGradient.addColorStop(1, 'rgba(255, 255, 200, 0)');

    cx.fillStyle = glowGradient;
    cx.beginPath();
    cx.ellipse(0, -lampHeight / 2 + (height * 0.2), width * 0.9, height * 0.7, 0, 0, Math.PI * 2);
    cx.fill();
  }

  // === НОЖКА ===
  cx.fillStyle = standColor;
  cx.beginPath();
  cx.rect(-standWidth / 2, -lampHeight / 2, standWidth, lampHeight);
  cx.fill();
  cx.strokeStyle = 'rgb(246,255,167)';
  cx.lineWidth = 2;
  cx.stroke();

  // === АБАЖУР ===
  const shadeWidth = width * 0.6;
  const shadeHeight = height * 0.3;
  cx.fillStyle = shadeColor;
  cx.beginPath();
  cx.moveTo(-shadeWidth / 2, -lampHeight / 2);
  cx.lineTo(shadeWidth / 2, -lampHeight / 2);
  cx.lineTo(shadeWidth * 0.4, -lampHeight / 2 + shadeHeight);
  cx.lineTo(-shadeWidth * 0.4, -lampHeight / 2 + shadeHeight);
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
