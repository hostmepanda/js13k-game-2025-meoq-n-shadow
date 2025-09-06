import {GAME_STATE} from '../consts'

export const GRAVITY_UP = 1200   // Гравитация при движении вверх
export const GRAVITY_DOWN = 1500 // Гравитация при падении
export const MAX_FALL_SPEED = 800 // Максимальная скорость падения

// Константы для физики
export const MOVE_SPEED = 200    // пикселей в секунду
export const JUMP_FORCE = -550   // Начальная скорость прыжка

export function isCollided(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

export function drawPixels(ctx, pixels, { scale, colors, flipX, shiftY = 0 }) {
  for (let j = 0; j < pixels.length; j++) {
    for (let i = 0; i < pixels[j].length; i++) {
      const p = pixels[j][i];
      ctx.fillStyle = colors[p];
      const x = flipX ? (20 - 1 - i) * scale : i * scale
      const y = j * scale + (scale >= 2.2 ? shiftY / 2 : shiftY)
      ctx.fillRect(x, y, scale, scale);
    }
  }
}

export function renderWithCamera(context, camera, drawFunction) {
  context.save()

  // Смещаем всё на отрицательное положение камеры
  context.translate(-camera.x, -camera.y)

  // Выполняем функцию отрисовки
  drawFunction(context)

  context.restore()
}

export function renderBackground(context, canvas) {
  // Градиентный фон, если нет изображения
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#87CEEB')
  gradient.addColorStop(1, '#E0F7FA')

  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)
}
function renderLevelName(levelNumber) {
  if (levelNumber === GAME_STATE.LEVEL1) {
    return 'HOME'
  } else if (levelNumber === GAME_STATE.LEVEL2) {
    return 'CITY'
  } else if (levelNumber === GAME_STATE.LEVEL3) {
    return 'SEWER'
  } else if (levelNumber === GAME_STATE.LEVEL4) {
    return 'RAT\'S CAVE'
  }
}

export function renderUI(context, playerState) {
  // Сохраняем текущее состояние контекста
  context.save();

  // Размеры и параметры UI
  const tileSize = 20; // Новый размер тайла
  const uiHeight = tileSize * 2;
  const canvasWidth = context.canvas.width;

  // Рисуем черную область сверху экрана
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvasWidth, uiHeight);

  // Рисуем внутреннюю рамку в стиле Денди
  context.fillStyle = '#333';
  context.fillRect(5, 5, canvasWidth - 10, uiHeight - 10);

  // Стилизованная рамка для UI
  context.lineWidth = 2;
  context.strokeStyle = '#FFD700'; // Золотой цвет для рамки
  context.fillStyle = 'rgb(246,255,167)';
  context.fillRect(4, 4, canvasWidth - 10, uiHeight - 10);

  // Делим UI на три равные секции
  const sectionWidth = canvasWidth / 3 - 60;

  // Задаем базовые параметры текста
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.font = 'bold 12px monospace'; // Более компактный шрифт

  // Секция 1: Уровень
  const levelX = 20;
  const centerY = uiHeight / 2;
  context.fillStyle = '#FF8C00'; // Оранжевый для уровня
  context.fillText(`LEVEL: ${renderLevelName(playerState.currentLevel) || 'SECRET'}`, levelX, centerY);

  // Отображаем информацию о котах
  const cats = playerState.cats || [];
  if (cats.length >= 2) {
    // Секция 2: Белый кот (предположительно первый в массиве)
    const whiteCat = cats[0];
    const whiteCatX = sectionWidth + 10;

    // Определяем цвет для активного/неактивного кота
    let whiteCatColor = whiteCat.isActive ? '#165134' : '#a1a1a1';

    // Рисуем информацию о белом коте
    context.fillStyle = whiteCatColor;
    const whiteCatText = `${whiteCat.name}: ${whiteCat.lives || 0}/10`;
    context.fillText(whiteCatText, whiteCatX, centerY);

    // Полоска здоровья белого кота
    const textWidth = context.measureText(whiteCatText).width;
    const whiteHealthBarX = whiteCatX + textWidth + 10;
    const healthBarY = centerY - 5;
    const healthBarWidth = sectionWidth - textWidth - 30;
    const healthBarHeight = 10;
    const whiteHealthPercent = (whiteCat.health || 0) / 100;

    // Рисуем сегментированную полоску здоровья
    renderHealthBar(context, whiteHealthBarX, healthBarY, healthBarWidth, healthBarHeight, whiteHealthPercent);

    // Если кот активный, добавляем индикатор
    if (whiteCat.isActive) {
      const blinkRate = Math.floor(Date.now() / 500) % 2;
      if (blinkRate === 0) {
        context.fillStyle = '#165134';
        context.fillText('▶', whiteCatX - 15, centerY-1);
      }
    }

    // Секция 3: Черный кот (предположительно второй в массиве)
    const blackCat = cats[1];
    const blackCatX = sectionWidth * 2 + 40;

    // Определяем цвет для активного/неактивного кота
    let blackCatColor = blackCat.isActive ? '#165134' : '#afafaf'; // Голубоватый для контраста с черным

    // Рисуем информацию о черном коте
    context.fillStyle = blackCatColor;
    const blackCatText = `${blackCat.name}: ${blackCat.lives || 0}/10`;
    context.fillText(blackCatText, blackCatX, centerY);

    // Полоска здоровья черного кота
    const blackTextWidth = context.measureText(blackCatText).width;
    const blackHealthBarX = blackCatX + blackTextWidth + 10;
    const blackHealthPercent = (blackCat.health || 0) / 100;

    // Рисуем сегментированную полоску здоровья
    renderHealthBar(context, blackHealthBarX, healthBarY, healthBarWidth, healthBarHeight, blackHealthPercent);

    // Если кот активный, добавляем индикатор
    if (blackCat.isActive) {
      const blinkRate = Math.floor(Date.now() / 500) % 2;
      if (blinkRate === 0) {
        context.fillStyle = '#165134';
        context.fillText('▶', blackCatX - 15, centerY-1);
      }
    }
  }

  // Восстанавливаем состояние контекста
  context.restore();
}

/**
 * Отрисовывает сегментированную полоску здоровья в стиле игры про Черного Плаща
 */
function renderHealthBar(context, x, y, width, height, healthPercent) {
  // Фон полоски здоровья
  context.fillStyle = '#000';
  context.fillRect(x - 1, y - 1, width + 2, height + 2);

  // Количество сегментов в полоске здоровья
  const segments = 10;
  const segmentWidth = width / segments;
  const filledSegments = Math.ceil(healthPercent * segments);

  // Рисуем каждый сегмент здоровья отдельно
  for (let i = 0; i < segments; i++) {
    const segmentX = x + i * segmentWidth;

    if (i < filledSegments) {
      // Определяем цвет сегмента в зависимости от общего здоровья
      let segmentColor;
      if (healthPercent > 0.7) {
        segmentColor = '#22FF22'; // Яркий зеленый
      } else if (healthPercent > 0.3) {
        segmentColor = '#FFFF00'; // Желтый
      } else {
        segmentColor = '#FF3333'; // Красный
      }

      // Заполняем сегмент
      context.fillStyle = segmentColor;
      context.fillRect(
        segmentX,
        y,
        segmentWidth - 1, // Оставляем место для разделителя
        height
      );

      // Добавляем световой эффект сверху сегмента (как в Денди играх)
      context.fillStyle = '#FFFFFF';
      context.fillRect(
        segmentX,
        y,
        segmentWidth - 1,
        2
      );
    } else {
      // Пустой сегмент
      context.fillStyle = '#444';
      context.fillRect(
        segmentX,
        y,
        segmentWidth - 1,
        height
      );
    }
  }

  // Рамка для полоски здоровья
  context.strokeStyle = '#888';
  context.lineWidth = 1;
  context.strokeRect(x - 1, y - 1, width + 2, height + 2);
}
