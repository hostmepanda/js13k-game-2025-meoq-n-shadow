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

export function renderWithCamera(cx, camera, df) {
  cx.save()
  cx.translate(-camera.x, -camera.y)
  df(cx)
  cx.restore()
}

export function renderBackground(cx, cs) {
  // Градиентный фон, если нет изображения
  const gradient = cx.createLinearGradient(0, 0, 0, cs.height)
  gradient.addColorStop(0, '#87CEEB')
  gradient.addColorStop(1, '#E0F7FA')

  cx.fillStyle = gradient
  cx.fillRect(0, 0, cs.width, cs.height)
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

export function renderUI({context: cx, canvas: cs}, {playerState, GameState}) {
  // Сохраняем текущее состояние контекста
  cx.save();

  // Размеры и параметры UI
  const tileSize = 20; // Новый размер тайла
  const uiHeight = tileSize * 2;
  const canvasWidth = cx.canvas.width;

  // Рисуем черную область сверху экрана
  cx.fillStyle = 'black';
  cx.fillRect(0, 0, canvasWidth, uiHeight);

  // Рисуем внутреннюю рамку в стиле Денди
  cx.fillStyle = '#333';
  cx.fillRect(5, 5, canvasWidth - 10, uiHeight - 10);

  // Стилизованная рамка для UI
  cx.lineWidth = 2;
  cx.strokeStyle = '#FFD700'; // Золотой цвет для рамки
  cx.fillStyle = 'rgb(246,255,167)';
  cx.fillRect(4, 4, canvasWidth - 10, uiHeight - 10);

  // Делим UI на три равные секции
  const sectionWidth = canvasWidth / 3 - 60;

  // Задаем базовые параметры текста
  cx.textAlign = 'left';
  cx.textBaseline = 'middle';
  cx.font = 'bold 12px monospace'; // Более компактный шрифт

  // Секция 1: Уровень
  const levelX = 20;
  const centerY = uiHeight / 2;
  cx.fillStyle = '#FF8C00'; // Оранжевый для уровня
  cx.fillText(`LEVEL: ${renderLevelName(playerState.currentLevel) || 'SECRET'}`, levelX, centerY);

  // Отображаем информацию о котах
  const cats = playerState.cats || [];
  if (cats.length >= 2) {
    // Секция 2: Белый кот (предположительно первый в массиве)
    const whiteCat = cats[0];
    const whiteCatX = sectionWidth + 10;

    cx.fillStyle =  whiteCat.isActive ? '#165134' : '#a1a1a1';;
    const whiteCatText = `${whiteCat.name}: ${whiteCat.lives || 0}/10`;
    cx.fillText(whiteCatText, whiteCatX, centerY);

    // Полоска здоровья белого кота
    const textWidth = cx.measureText(whiteCatText).width;
    const whiteHealthBarX = whiteCatX + textWidth + 10;
    const healthBarY = centerY - 5;
    const healthBarWidth = sectionWidth - textWidth - 30;
    const healthBarHeight = 10;
    const whiteHealthPercent = (whiteCat.health || 0) / 100;

    // Рисуем сегментированную полоску здоровья
    renderHealthBar(cx, whiteHealthBarX, healthBarY, healthBarWidth, healthBarHeight, whiteHealthPercent);

    // Если кот активный, добавляем индикатор
    if (whiteCat.isActive) {
      const blinkRate = Math.floor(Date.now() / 500) % 2;
      if (blinkRate === 0) {
        cx.fillStyle = '#165134';
        cx.fillText('▶', whiteCatX - 15, centerY-1);
      }
    }

    // Секция 3: Черный кот (предположительно второй в массиве)
    const blackCat = cats[1];
    const blackCatX = sectionWidth * 2 + 40;

    // Определяем цвет для активного/неактивного кота
    let blackCatColor = blackCat.isActive ? '#165134' : '#afafaf'; // Голубоватый для контраста с черным

    // Рисуем информацию о черном коте
    cx.fillStyle = blackCatColor;
    const blackCatText = `${blackCat.name}: ${blackCat.lives || 0}/10`;
    cx.fillText(blackCatText, blackCatX, centerY);

    // Полоска здоровья черного кота
    const blackTextWidth = cx.measureText(blackCatText).width;
    const blackHealthBarX = blackCatX + blackTextWidth + 10;
    const blackHealthPercent = (blackCat.health || 0) / 100;

    // Рисуем сегментированную полоску здоровья
    renderHealthBar(cx, blackHealthBarX, healthBarY, healthBarWidth, healthBarHeight, blackHealthPercent);

    // Если кот активный, добавляем индикатор
    if (blackCat.isActive) {
      const blinkRate = Math.floor(Date.now() / 500) % 2;
      if (blinkRate === 0) {
        cx.fillStyle = '#165134';
        cx.fillText('▶', blackCatX - 15, centerY-1);
      }
    }

    cx.fillStyle = '#000000';
    if (GameState.musicEnabled) {
      cx.font = '15px Arial';  // Меньший шрифт для имени создателя
      cx.fillText('🔉', cs.width - 60, 15);
      cx.font = '10px Arial';  // Меньший шрифт для имени создателя
      cx.fillText('(press M to disable)', cs.width - 100, 28);
    } else {
      cx.font = '15px Arial';  // Меньший шрифт для имени создателя
      cx.fillText('🔇', cs.width - 60, 15);
      cx.font = '10px Arial';  // Меньший шрифт для имени создателя
      cx.fillText('(press M to enable)', cs.width - 100, 28);
    }
  }

  // Восстанавливаем состояние контекста
  cx.restore();
}

/**
 * Отрисовывает сегментированную полоску здоровья в стиле игры про Черного Плаща
 */
function renderHealthBar(cx, x, y, width, height, healthPercent) {
  // Фон полоски здоровья
  cx.fillStyle = '#000';
  cx.fillRect(x - 1, y - 1, width + 2, height + 2);

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
      cx.fillStyle = segmentColor;
      cx.fillRect(
        segmentX,
        y,
        segmentWidth - 1, // Оставляем место для разделителя
        height
      );

      // Добавляем световой эффект сверху сегмента (как в Денди играх)
      cx.fillStyle = '#FFFFFF';
      cx.fillRect(
        segmentX,
        y,
        segmentWidth - 1,
        2
      );
    } else {
      // Пустой сегмент
      cx.fillStyle = '#444';
      cx.fillRect(
        segmentX,
        y,
        segmentWidth - 1,
        height
      );
    }
  }

  // Рамка для полоски здоровья
  cx.strokeStyle = '#888';
  cx.lineWidth = 1;
  cx.strokeRect(x - 1, y - 1, width + 2, height + 2);
}
