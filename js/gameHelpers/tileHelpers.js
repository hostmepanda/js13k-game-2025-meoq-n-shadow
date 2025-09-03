/**
 * Рендерит деревянно-бетонный пол с реалистичной текстурой и гипсокартонными стенами
 * @param {CanvasRenderingContext2D} context - Контекст для рисования
 * @param {number} width - Ширина блока
 * @param {number} height - Высота блока
 * @param {number} x - Позиция X блока (для генерации семени)
 * @param {number} y - Позиция Y блока (для генерации семени)
 * @param {Object} options - Дополнительные параметры (цвета и т.д.)
 */
export function renderWoodConcreteFloor(context, width, height, x, y, options = {}) {
  const {
    woodColor = 'rgb(170, 120, 70)',
    concreteColor = 'rgb(180, 180, 180)',
    dryWallColor = 'rgb(220, 220, 220)', // Цвет гипсокартона
    type = 'F' // По умолчанию тип F - пол сверху тайла
  } = options;

  context.save();

  // Используем только координаты для выбора из предопределенных вариантов
  // Это делает код очень компактным
  const pattern = (x + y) % 4;  // 0, 1, 2 или 3

  // Высота деревянной части и количество досок зависят от шаблона
  const woodHeight = 7 + (pattern & 3);  // 7, 8, 9 или 10
  const boardCount = 2 + (pattern % 3);  // 2, 3 или 4
  const dryWallThickness = 7;


  // Сначала заполняем весь блок бетонным цветом (как фон)
  context.fillStyle = concreteColor;
  context.fillRect(0, 0, width, height);

  // Рисуем в зависимости от типа
  if (type === 'F' || type === 'f') {
    // Пол сверху тайла
    context.fillStyle = woodColor;
    context.fillRect(0, 0, width, woodHeight);

    // Добавляем текстуру дерева (горизонтальные волокна)
    context.strokeStyle = 'rgba(120, 80, 40, 0.3)';
    context.lineWidth = 1;

    // Горизонтальные линии для имитации деревянных волокон
    for (let i = 2; i < woodHeight - 1; i += 2) {
      context.beginPath();
      context.moveTo(1, i);
      context.lineTo(width - 1, i);
      context.stroke();
    }

    // Добавляем несколько вертикальных разделителей, имитирующих стыки досок
    context.strokeStyle = 'rgba(100, 70, 40, 0.5)';
    context.lineWidth = 1;

    const boardWidth = (width - 2) / boardCount;

    for (let i = 1; i < boardCount; i++) {
      const x = i * boardWidth + 1; // +1 для учета отступа
      context.beginPath();
      context.moveTo(x, 1);
      context.lineTo(x, woodHeight - 1);
      context.stroke();
    }
  } else if (type === 'M') {
    // Вертикальная гипсокартонная стена справа
    context.fillStyle = dryWallColor;
    context.fillRect(width - dryWallThickness, 0, dryWallThickness, height);

    // Добавим текстуру гипсокартона (небольшие точки)
    addDryWallTexture(context, width - dryWallThickness, 0, dryWallThickness, height);
  } else if (type === 'W') {
    // Вертикальная гипсокартонная стена слева
    context.fillStyle = dryWallColor;
    context.fillRect(0, 0, dryWallThickness, height);

    // Добавим текстуру гипсокартона
    addDryWallTexture(context, 0, 0, dryWallThickness, height);
  } else if (type === 'm') {
    // Горизонтальная гипсокартонная стена снизу
    context.fillStyle = dryWallColor;
    context.fillRect(0, height - dryWallThickness, width, dryWallThickness);

    // Добавим текстуру гипсокартона
    addDryWallTexture(context, 0, height - dryWallThickness, width, dryWallThickness);
  } else if (type === 'w') {
    // Горизонтальная гипсокартонная стена сверху
    context.fillStyle = dryWallColor;
    context.fillRect(0, 0, width, dryWallThickness);

    // Добавим текстуру гипсокартона
    addDryWallTexture(context, 0, 0, width, dryWallThickness);
  } else if (type === 'n') {
    // Горизонтальная гипсокартонная стена сверху и снизу
    context.fillStyle = dryWallColor;
    context.fillRect(0, 0, width, dryWallThickness); // Верхняя стена
    context.fillRect(0, height - dryWallThickness, width, dryWallThickness); // Нижняя стена

    // Добавим текстуру гипсокартона
    addDryWallTexture(context, 0, 0, width, dryWallThickness);
    addDryWallTexture(context, 0, height - dryWallThickness, width, dryWallThickness);
  } else if (type === 'N') {
    // Вертикальная гипсокартонная стена слева и справа
    context.fillStyle = dryWallColor;
    context.fillRect(0, 0, dryWallThickness, height); // Левая стена
    context.fillRect(width - dryWallThickness, 0, dryWallThickness, height); // Правая стена

    // Добавим текстуру гипсокартона
    addDryWallTexture(context, 0, 0, dryWallThickness, height);
    addDryWallTexture(context, width - dryWallThickness, 0, dryWallThickness, height);
  }

  // Добавляем рамку слева и справа для бетонной основы
  context.fillStyle = concreteColor;
  context.fillRect(0, height - 1, width, 1); // Нижняя рамка

  // Добавляем несколько частиц в бетоне
  for (let i = 0; i < 50; i++) {
    const particleX = 2 + boardCount * (width - 4); // Отступ 2px от краев
    const particleY = (type === 'F' || type === 'f' ? woodHeight : dryWallThickness) + 2 + boardCount * (height - (type === 'F' || type === 'f' ? woodHeight : dryWallThickness) - 4);
    const size = 0.5 + boardCount * 0.5;

    context.fillStyle = `rgba(${120 + Math.floor(boardCount * 50)}, ${
      120 + Math.floor(boardCount * 50)}, ${
      120 + Math.floor(boardCount * 50)}, 0.3)`;

    context.beginPath();
    context.rect(particleX, particleY, size, size);
    context.fill();
  }

  // Добавляем несколько трещин в бетоне
  context.strokeStyle = 'rgba(100, 100, 100, 0.2)';
  context.lineWidth = 0.5;

  const crackCount = Math.floor(boardCount * 3); // 0-2 трещины

  for (let i = 0; i < crackCount; i++) {
    const startX = 5 + boardCount * (width - 10);
    const startY = (type === 'F' || type === 'f' ? woodHeight : dryWallThickness) + 5 + boardCount * ((height - (type === 'F' || type === 'f' ? woodHeight : dryWallThickness)) / 2 - 5);

    context.beginPath();
    context.moveTo(startX, startY);

    let currentX = startX;
    let currentY = startY;

    const segments = 2 + Math.floor(boardCount * 3);

    for (let j = 0; j < segments; j++) {
      const deltaX = -3 + boardCount * 6;
      const deltaY = 3 + boardCount * 6;

      currentX += deltaX;
      currentY += deltaY;

      // Ограничиваем координаты для отступа от края
      currentX = Math.max(2, Math.min(width - 2, currentX));
      currentY = Math.max((type === 'F' || type === 'f' ? woodHeight : dryWallThickness) + 2, Math.min(height - 2, currentY));

      context.lineTo(currentX, currentY);
    }
    context.stroke();
  }

  context.restore();
}

/**
 * Вспомогательная функция для добавления текстуры гипсокартона
 */
function addDryWallTexture(context, x, y, width, height, seed) {
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
