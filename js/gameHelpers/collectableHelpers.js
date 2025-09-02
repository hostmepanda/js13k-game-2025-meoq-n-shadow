/**
 * Рендерит тайл с одинаковой плоской рыбкой для сбора котом
 * @param {CanvasRenderingContext2D} context - Контекст для рисования
 * @param {number} width - Ширина тайла
 * @param {number} height - Высота тайла
 * @param {Object} options - Дополнительные параметры
 */
export function renderCollectibleFish(context, width, height, options = {}) {
  const {
    fishColor = 'rgb(60, 120, 255)', // Синий по умолчанию
    backgroundColor = 'rgba(40, 40, 45, 0)',
    glowColor = 'rgba(60, 120, 255, 0.3)',
    addGlow = true
  } = options;

  context.save();

  // Заполняем фон тайла
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, width, height);

  // Перемещаем контекст в центр тайла
  context.translate(width / 2, height / 2);

  // Определяем размер рыбки (немного меньше тайла)
  const fishWidth = width * 0.7;
  const fishHeight = height * 0.4;

  // Если нужно свечение - рисуем его под рыбкой
  if (addGlow) {
    context.fillStyle = glowColor;
    context.beginPath();
    context.ellipse(0, 0, fishWidth * 0.6, fishHeight * 0.8, 0, 0, Math.PI * 2);
    context.fill();
  }

  // Рисуем тело рыбки
  context.fillStyle = fishColor;

  // Основное тело рыбки
  context.beginPath();
  context.ellipse(0, 0, fishWidth / 2, fishHeight / 2, 0, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = 'rgb(172,188,0)';
  context.lineWidth = 2;
  context.stroke();

  // Хвост рыбки
  context.beginPath();
  context.moveTo(fishWidth / 2, 0);
  context.lineTo(fishWidth / 2 + fishWidth * 0.2, fishHeight * 0.25);
  context.lineTo(fishWidth / 2 + fishWidth * 0.2, -fishHeight * 0.25);
  context.closePath();
  context.fill();
  context.strokeStyle = 'rgb(172,188,0)';
  context.lineWidth = 2;
  context.stroke();

  // Добавляем глаз
  context.fillStyle = 'white';
  context.beginPath();
  context.arc(-fishWidth * 0.2, 0, fishHeight * 0.15, 0, Math.PI * 2);
  context.fill();

  // Зрачок
  context.fillStyle = 'black';
  context.beginPath();
  context.arc(-fishWidth * 0.2 + fishHeight * 0.05, 0, fishHeight * 0.07, 0, Math.PI * 2);
  context.fill();

  // Добавляем плавник сверху
  context.fillStyle = fishColor;
  context.beginPath();
  context.moveTo(-fishWidth * 0.1, -fishHeight * 0.45);
  context.quadraticCurveTo(
    0, -fishHeight * 0.7,
    fishWidth * 0.1, -fishHeight * 0.45
  );
  context.lineTo(-fishWidth * 0.1, -fishHeight * 0.45);
  context.fill();
  context.strokeStyle = 'rgb(172,188,0)';
  context.lineWidth = 1;
  context.stroke();

  // Добавляем полоски на рыбке
  context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  context.lineWidth = 1;
  for (let i = -1; i <= 1; i++) {
    context.beginPath();
    context.moveTo(-fishWidth * 0.1, i * fishHeight * 0.15);
    context.lineTo(fishWidth * 0.3, i * fishHeight * 0.15);
    context.stroke();
  }

  context.restore();
}