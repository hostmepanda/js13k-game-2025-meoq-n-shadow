/**
 * Рендерит деревянно-бетонный пол с реалистичной текстурой и гипсокартонными стенами
 * @param {CanvasRenderingContext2D} context - Контекст для рисования
 * @param {number} width - Ширина блока
 * @param {number} height - Высота блока
 * @param {Object} options - Дополнительные параметры (цвета и т.д.)
 */
export function renderWoodConcreteFloor(context, width, height, options = {}) {
  const {
    bodyColor = 'rgb(180, 180, 180)',
    coverColor, // 'rgb(170, 120, 70)',
    injectColor, //'rgb(175,175,175)',
    closingColor,
    rotation = 0,
  } = options;

  context.save()

  if (rotation !== 0) {
    context.translate(width/2, height/2);
    if (rotation >= 1) {
      context.rotate(Math.PI / 2) // 90 градусов
    }
    if (rotation >= 2) {
      context.rotate(Math.PI / 2) // 90 градусов
    }
    if (rotation >= 3) {
      context.rotate(Math.PI / 2) // 90 градусов
    }
    context.translate(-width/2, -height/2);
  }

  context.fillStyle = bodyColor;
  context.fillRect(0, 0, width, height);

  if (coverColor) {
    context.fillStyle = coverColor;
    context.fillRect(0, 0, width, 7);
  }

  if (closingColor) {
    const woodHeight = 7
    context.fillStyle = coverColor;
    context.fillRect(0, height - 7, width, 7);
  }

  if (injectColor) {
    context.fillStyle = injectColor;
    context.fillRect(width / 2 - width / 4, height / 2 - height / 15, 1, 1);
    context.fillRect(width / 2 - width / 4, height / 2 + height / 4, 1, 1);
    context.fillRect(width / 2 + width / 4, height / 2 - height / 15, 1, 1);
    context.fillRect(width / 2 + width / 4, height / 2 + height / 4, 1, 1);
  }

  context.restore()
}

/**
 * Вспомогательная функция для добавления текстуры гипсокартона
 */
function addDryWallTexture(context, x, y, width, height) {
  // Генерируем точки на основе координат
  const h = ((x + 67) * (y + 97)) % 256;

  // Вместо случайного числа точек - фиксированное количество,
  // но с разными позициями для разных тайлов
  for (let i = 0; i < 5; i++) {
    const pointX = x + ((h * (i+1)) % width);
    const pointY = y + ((h * (i+7)) % height);

    context.fillStyle = 'rgba(150, 150, 150, 0.15)';
    context.beginPath();
    context.arc(pointX, pointY, 0.4, 0, Math.PI * 2);
    context.fill();
  }

  // Линия стыка гипсокартона
  if (width > 20 || height > 20) {
    context.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    context.lineWidth = 0.5;

    if (width > height) {
      const lineY = y + height / 2;
      context.beginPath();
      context.moveTo(x, lineY);
      context.lineTo(x + width, lineY);
      context.stroke();
    } else {
      const lineX = x + width / 2;
      context.beginPath();
      context.moveTo(lineX, y);
      context.lineTo(lineX, y + height);
      context.stroke();
    }
  }
}


// Рисуем стол
export function renderTable(context, width, height, options = {}) {
  const {
    tableColor = '#8B4513', // коричневый
    legColor = '#5C3317'
  } = options;

  context.save();
  context.translate(width / 2, height / 2);

  const tableWidth = width * 0.8;
  const tableHeight = height * 0.2;

  // Столешница
  context.fillStyle = tableColor;
  context.beginPath();
  context.rect(-tableWidth / 2, -tableHeight / 2, tableWidth, tableHeight);
  context.fill();
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.stroke();

  // Ножки
  const legWidth = tableWidth * 0.1;
  const legHeight = height * 0.4;
  context.fillStyle = legColor;

  context.beginPath();
  context.rect(
    1 * (tableWidth / 2 - legWidth / 2 - 2),
    tableHeight / 2,
    legWidth,
    legHeight
  );
  context.fill();
  context.lineWidth = 1;
  context.stroke();

  context.beginPath();
  context.rect(
    -1 * (tableWidth / 2 - legWidth / 2 + 1),
    tableHeight / 2,
    legWidth,
    legHeight
  );
  context.fill();
  context.lineWidth = 1
  context.stroke();


  context.restore();
}

// Рисуем торшер
export function renderLamp(context, width, height, options = {}) {
  const {
    shadeColor = '#FFD700', // абажур
    standColor = '#333',
    addGlow = true
  } = options;

  context.save();
  context.translate(width / 2, height / 2);

  const lampHeight = height * 0.8;
  const standWidth = width * 0.05;

  // === СВЕЧЕНИЕ ===
  if (addGlow) {
    const glowGradient = context.createRadialGradient(
      0, -lampHeight / 2 + (height * 0.15), 5,
      0, -lampHeight / 2 + (height * 0.15), width
    );
    glowGradient.addColorStop(0, 'rgba(255, 255, 200, 0.6)');
    glowGradient.addColorStop(1, 'rgba(255, 255, 200, 0)');

    context.fillStyle = glowGradient;
    context.beginPath();
    context.ellipse(0, -lampHeight / 2 + (height * 0.2), width * 0.9, height * 0.7, 0, 0, Math.PI * 2);
    context.fill();
  }

  // === НОЖКА ===
  context.fillStyle = standColor;
  context.beginPath();
  context.rect(-standWidth / 2, -lampHeight / 2, standWidth, lampHeight);
  context.fill();
  context.strokeStyle = 'rgb(246,255,167)';
  context.lineWidth = 2;
  context.stroke();

  // === АБАЖУР ===
  const shadeWidth = width * 0.6;
  const shadeHeight = height * 0.3;
  context.fillStyle = shadeColor;
  context.beginPath();
  context.moveTo(-shadeWidth / 2, -lampHeight / 2);
  context.lineTo(shadeWidth / 2, -lampHeight / 2);
  context.lineTo(shadeWidth * 0.4, -lampHeight / 2 + shadeHeight);
  context.lineTo(-shadeWidth * 0.4, -lampHeight / 2 + shadeHeight);
  context.closePath();
  context.fill();
  context.stroke();

  context.restore();
}

// Рисуем дерево в горшке
export function renderPottedTree(context, width, height, options = {}) {
  const {
    potColor = '#bc8000',
    trunkColor = '#654321',
    foliageColor = '#228B22'
  } = options;

  context.save();
  context.translate(width / 2, height / 2);

  const potHeight = height * 0.2;
  const potWidth = width * 0.5;
  const trunkHeight = height * 0.25;
  const trunkWidth = width * 0.1;

  // Горшок
  context.fillStyle = potColor;
  context.beginPath();
  context.rect(-potWidth / 2, height / 2 - potHeight - 5, potWidth, potHeight);
  context.fill();
  context.strokeStyle = 'rgba(133,73,0,0.66)';
  context.lineWidth = 2;
  context.stroke();

  // Ствол
  context.fillStyle = trunkColor;
  context.beginPath();
  context.rect(-trunkWidth / 2, height / 2 - potHeight - trunkHeight - 5, trunkWidth, trunkHeight);
  context.fill();
  context.stroke();

  // Елочка (3 "яруса" из треугольников)
  context.fillStyle = foliageColor;
  context.strokeStyle = 'rgba(99,213,99,0.51)';
  context.lineWidth = 2;

  const topY = height / 2 - potHeight - trunkHeight - 15; // верх ствола

  const layerHeights = [height * 0.25, height * 0.42, height * 0.67]; // высота ярусов
  const layerWidths = [width * 0.3, width * 0.45, width * 0.6];      // ширина ярусов

  let currentY = topY;
  for (let i = 0; i < 3; i++) {
    const h = layerHeights[i];
    const w = layerWidths[i];

    context.beginPath();
    context.moveTo(0, currentY - 5 );   // верхушка яруса
    context.lineTo(-w / 2, currentY - h - 3 * i);  // левый низ
    context.lineTo(w / 2, currentY - h + 3 * i + i);   // правый низ
    context.closePath();
    context.fill();
    context.stroke();

    currentY += h * 0.9; // смещение вниз, чтобы ярусы перекрывались
  }

  context.restore();
}


// Рисуем пальму в горшке
export function renderPalmTree(context, width, height, options = {}) {
  const {
    potColor = '#8B0000',
    trunkColor = '#8B5A2B',
    leafColors = ['#7ada7a','#ffe335','#f6ffa7','#fb6c37','#228B22','#229B22']
  } = options;

  context.save();
  context.translate(width / 2, height / 2);

  const potHeight = height * 0.2;
  const potWidth = width * 0.4;
  const trunkHeight = height * 0.4;
  const trunkWidth = width * 0.08;
  const leafLength = width * 0.35;
  const leafWidth = width * 0.12;

  // Горшок
  context.fillStyle = potColor;
  context.beginPath();
  context.rect(-potWidth / 2, height / 2 - potHeight - 5, potWidth, potHeight);
  context.fill();
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.stroke();

  // Ствол
  context.fillStyle = trunkColor;
  context.beginPath();
  context.rect(-trunkWidth / 2, height / 2 - potHeight - trunkHeight - 5, trunkWidth, trunkHeight);
  context.fill();
  context.strokeStyle = 'rgba(133,73,0,0.66)';
  context.stroke();

  // Листья (несколько направлений)
  const leafAngles = [-60, -30, 0, 30, 60, 90]; // углы в градусах
  leafAngles.forEach((angle, index) => {
    context.fillStyle = leafColors[index];

    const rad = angle * Math.PI / 180;
    context.save();
    context.translate(0, height / 2 - potHeight - trunkHeight -5); // верх ствола
    context.rotate(rad);
    context.beginPath();
    context.ellipse(0, 0, leafLength, leafWidth, 0, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = 'rgb(172,188,0)';
    context.stroke();
    context.restore();
  });

  context.restore();
}
