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

  // Создаем простой псевдослучайный генератор на основе позиции блока
  const seed = (x * 10000 + y);
  let seedValue = seed;
  const random = function () {
    let x = Math.sin(seedValue++) * 10000;
    return x - Math.floor(x);
  };

  // Верхняя часть - деревянный пол
  const woodHeight = 7 + Math.floor(random() * 3); // 7-10 пикселей для деревянной части
  const dryWallThickness = 7; // Толщина гипсокартонной стены

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

    const boardCount = 2 + Math.floor(random() * 3); // 2-4 доски
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
    addDryWallTexture(context, width - dryWallThickness, 0, dryWallThickness, height, random);
  } else if (type === 'W') {
    // Вертикальная гипсокартонная стена слева
    context.fillStyle = dryWallColor;
    context.fillRect(0, 0, dryWallThickness, height);

    // Добавим текстуру гипсокартона
    addDryWallTexture(context, 0, 0, dryWallThickness, height, random);
  } else if (type === 'm') {
    // Горизонтальная гипсокартонная стена снизу
    context.fillStyle = dryWallColor;
    context.fillRect(0, height - dryWallThickness, width, dryWallThickness);

    // Добавим текстуру гипсокартона
    addDryWallTexture(context, 0, height - dryWallThickness, width, dryWallThickness, random);
  } else if (type === 'w') {
    // Горизонтальная гипсокартонная стена сверху
    context.fillStyle = dryWallColor;
    context.fillRect(0, 0, width, dryWallThickness);

    // Добавим текстуру гипсокартона
    addDryWallTexture(context, 0, 0, width, dryWallThickness, random);
  } else if (type === 'n') {
    // Горизонтальная гипсокартонная стена сверху и снизу
    context.fillStyle = dryWallColor;
    context.fillRect(0, 0, width, dryWallThickness); // Верхняя стена
    context.fillRect(0, height - dryWallThickness, width, dryWallThickness); // Нижняя стена

    // Добавим текстуру гипсокартона
    addDryWallTexture(context, 0, 0, width, dryWallThickness, random);
    addDryWallTexture(context, 0, height - dryWallThickness, width, dryWallThickness, random);
  } else if (type === 'N') {
    // Вертикальная гипсокартонная стена слева и справа
    context.fillStyle = dryWallColor;
    context.fillRect(0, 0, dryWallThickness, height); // Левая стена
    context.fillRect(width - dryWallThickness, 0, dryWallThickness, height); // Правая стена

    // Добавим текстуру гипсокартона
    addDryWallTexture(context, 0, 0, dryWallThickness, height, random);
    addDryWallTexture(context, width - dryWallThickness, 0, dryWallThickness, height, random);
  }

  // Добавляем рамку слева и справа для бетонной основы
  context.fillStyle = concreteColor;
  context.fillRect(0, height - 1, width, 1); // Нижняя рамка

  // Добавляем несколько частиц в бетоне
  for (let i = 0; i < 50; i++) {
    const particleX = 2 + random() * (width - 4); // Отступ 2px от краев
    const particleY = (type === 'F' || type === 'f' ? woodHeight : dryWallThickness) + 2 + random() * (height - (type === 'F' || type === 'f' ? woodHeight : dryWallThickness) - 4);
    const size = 0.5 + random() * 0.5;

    context.fillStyle = `rgba(${120 + Math.floor(random() * 50)}, ${
      120 + Math.floor(random() * 50)}, ${
      120 + Math.floor(random() * 50)}, 0.3)`;

    context.beginPath();
    context.rect(particleX, particleY, size, size);
    context.fill();
  }

  // Добавляем несколько трещин в бетоне
  context.strokeStyle = 'rgba(100, 100, 100, 0.2)';
  context.lineWidth = 0.5;

  const crackCount = Math.floor(random() * 3); // 0-2 трещины

  for (let i = 0; i < crackCount; i++) {
    const startX = 5 + random() * (width - 10);
    const startY = (type === 'F' || type === 'f' ? woodHeight : dryWallThickness) + 5 + random() * ((height - (type === 'F' || type === 'f' ? woodHeight : dryWallThickness)) / 2 - 5);

    context.beginPath();
    context.moveTo(startX, startY);

    let currentX = startX;
    let currentY = startY;

    const segments = 2 + Math.floor(random() * 3);

    for (let j = 0; j < segments; j++) {
      const deltaX = -3 + random() * 6;
      const deltaY = 3 + random() * 6;

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
function addDryWallTexture(context, x, y, width, height, random) {
  // Добавляем небольшие дефекты/точки на гипсокартоне
  for (let i = 0; i < width * height / 50; i++) {
    const pointX = x + random() * width;
    const pointY = y + random() * height;

    context.fillStyle = `rgba(150, 150, 150, ${0.1 + random() * 0.1})`;
    context.beginPath();
    context.arc(pointX, pointY, 0.3 + random() * 0.3, 0, Math.PI * 2);
    context.fill();
  }

  // Добавляем линию стыка гипсокартонных листов (если размер достаточно большой)
  if (width > 20 || height > 20) {
    context.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    context.lineWidth = 0.5;

    if (width > height) {
      // Горизонтальная линия стыка
      const lineY = y + height / 2;
      context.beginPath();
      context.moveTo(x, lineY);
      context.lineTo(x + width, lineY);
      context.stroke();
    } else {
      // Вертикальная линия стыка
      const lineX = x + width / 2;
      context.beginPath();
      context.moveTo(lineX, y);
      context.lineTo(lineX, y + height);
      context.stroke();
    }
  }
}