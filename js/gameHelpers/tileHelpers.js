/**
 * Рендерит деревянно-бетонный пол с реалистичной текстурой
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

  // Сначала заполняем весь блок бетонным цветом (как фон)
  context.fillStyle = concreteColor;
  context.fillRect(0, 0, width, height);

  // Затем заполняем верхнюю часть деревянным цветом
  context.fillStyle = woodColor;
  context.fillRect(0, 0, width, woodHeight);

  // Добавляем рамку слева и справа, которая будет иметь два цвета
  // Верхняя часть - цвет дерева
  context.fillStyle = woodColor;
  context.fillRect(0, 0, 1, woodHeight); // Левая сторона
  context.fillRect(width - 1, 0, 1, woodHeight); // Правая сторона

  // Нижняя часть боковых рамок - цвет бетона
  context.fillStyle = concreteColor;
  context.fillRect(0, woodHeight, 1, height - woodHeight); // Левая сторона
  context.fillRect(width - 1, woodHeight, 1, height - woodHeight); // Правая сторона

  // Верхняя и нижняя рамки
  context.fillStyle = woodColor;
  context.fillRect(0, 0, width, 1); // Верхняя рамка

  context.fillStyle = concreteColor;
  context.fillRect(0, height - 1, width, 1); // Нижняя рамка

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

  for (let i = 0; i < 50; i++) {
    const x = 2 + random() * (width - 4); // Отступ 2px от краев
    const y = woodHeight + 2 + random() * (height - woodHeight - 4);
    const size = 0.5 + random() * 0.5;

    context.fillStyle = `rgba(${120 + Math.floor(random() * 50)}, ${
      120 + Math.floor(random() * 50)}, ${
      120 + Math.floor(random() * 50)}, 0.3)`;

    context.beginPath();
    context.rect(x, y, size, size);
    context.fill();
  }

  // Добавляем несколько трещин в бетоне
  context.strokeStyle = 'rgba(100, 100, 100, 0.2)';
  context.lineWidth = 0.5;

  const crackCount = Math.floor(random() * 3); // 0-2 трещины

  for (let i = 0; i < crackCount; i++) {
    const startX = 5 + random() * (width - 10);
    const startY = woodHeight + 5 + random() * ((height - woodHeight) / 2 - 5);

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

      // Ограничиваем координаты с учетом отступа 2px от края
      currentX = Math.max(2, Math.min(width - 2, currentX));
      currentY = Math.max(woodHeight + 2, Math.min(height - 2, currentY));

      context.lineTo(currentX, currentY);
    }

    context.stroke();
  }

  // Линия раздела между деревом и бетоном
  context.strokeStyle = 'rgba(100, 100, 100, 0.4)';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(1, woodHeight);
  context.lineTo(width - 1, woodHeight);
  context.stroke();

  context.restore();
}
