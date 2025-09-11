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
export function renderPottedTree(cx, width, height, options = {}) {
  const {
    potColor = '#bc8000',
    trunkColor = '#654321',
    foliageColor = '#228B22'
  } = options;

  cx.save();
  cx.translate(width / 2, height / 2);

  const potHeight = height * 0.2;
  const potWidth = width * 0.5;
  const trunkHeight = height * 0.25;
  const trunkWidth = width * 0.1;

  // Горшок
  cx.fillStyle = potColor;
  cx.beginPath();
  cx.rect(-potWidth / 2, height / 2 - potHeight - 5, potWidth, potHeight);
  cx.fill();
  cx.strokeStyle = 'rgba(133,73,0,0.66)';
  cx.lineWidth = 2;
  cx.stroke();

  // Ствол
  cx.fillStyle = trunkColor;
  cx.beginPath();
  cx.rect(-trunkWidth / 2, height / 2 - potHeight - trunkHeight - 5, trunkWidth, trunkHeight);
  cx.fill();
  cx.stroke();

  // Елочка (3 "яруса" из треугольников)
  cx.fillStyle = foliageColor;
  cx.strokeStyle = 'rgba(99,213,99,0.51)';
  cx.lineWidth = 2;

  const topY = height / 2 - potHeight - trunkHeight - 15; // верх ствола

  const layerHeights = [height * 0.25, height * 0.42, height * 0.67]; // высота ярусов
  const layerWidths = [width * 0.3, width * 0.45, width * 0.6];      // ширина ярусов

  let currentY = topY;
  for (let i = 0; i < 3; i++) {
    const h = layerHeights[i];
    const w = layerWidths[i];

    cx.beginPath();
    cx.moveTo(0, currentY - 5 );   // верхушка яруса
    cx.lineTo(-w / 2, currentY - h - 3 * i);  // левый низ
    cx.lineTo(w / 2, currentY - h + 3 * i + i);   // правый низ
    cx.closePath();
    cx.fill();
    cx.stroke();

    currentY += h * 0.9; // смещение вниз, чтобы ярусы перекрывались
  }

  cx.restore();
}

export function renderPalmTree(cx, width, height, options = {}) {
  const {
    potColor = '#8B0000',
    trunkColor = '#8B5A2B',
    leafColors = ['#7ada7a','#ffe335','#f6ffa7','#fb6c37','#228B22','#229B22']
  } = options;

  cx.save();
  cx.translate(width / 2, height / 2);

  const ptH = height * 0.2;
  const ptW = width * 0.4;
  const tkH = height * 0.4;
  const tkW = width * 0.08;
  const lfLn = width * 0.35;
  const lfW = width * 0.12;

  // Горшок
  cx.fillStyle = potColor;
  cx.beginPath();
  cx.rect(-ptW / 2, height / 2 - ptH - 5, ptW, ptH);
  cx.fill();
  cx.strokeStyle = 'black';
  cx.lineWidth = 1;
  cx.stroke();

  // Ствол
  cx.fillStyle = trunkColor;
  cx.beginPath();
  cx.rect(-tkW / 2, height / 2 - ptH - tkH - 5, tkW, tkH);
  cx.fill();
  cx.strokeStyle = 'rgba(133,73,0,0.66)';
  cx.stroke();

  // Листья (несколько направлений)
  const leafAngles = [-60, -30, 0, 30, 60, 90]; // углы в градусах
  leafAngles.forEach((angle, index) => {
    cx.fillStyle = leafColors[index];

    const rad = angle * Math.PI / 180;
    cx.save();
    cx.translate(0, height / 2 - ptH - tkH -5); // верх ствола
    cx.rotate(rad);
    cx.beginPath();
    cx.ellipse(0, 0, lfLn, lfW, 0, 0, Math.PI * 2);
    cx.fill();
    cx.strokeStyle = 'rgb(172,188,0)';
    cx.stroke();
    cx.restore();
  });

  cx.restore();
}
