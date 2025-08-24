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

/**
 * Отрисовывает пользовательский интерфейс поверх игрового мира
 * @param {CanvasRenderingContext2D} context - Контекст канваса для отрисовки
 * @param {Object} playerState - Объект с состоянием игрока (здоровье, оружие и т.д.)
 */
export function renderUI(context, playerState) {
  // Сохраняем текущее состояние контекста
  context.save();

  // Устанавливаем параметры текста
  context.font = '10px Arial';
  context.fillStyle = 'white';
  context.textAlign = 'left';

  // Отрисовываем здоровье игрока
  context.fillText(`Health white: ${playerState.white.health}`, 20, 20);
  context.fillText(`Health black: ${playerState.black.health}`, 20, 40);

  // Отрисовываем патроны/боеприпасы
  context.fillText(`Weapon: ${playerState?.ammo}`, 20, 60);

  // Отрисовка полоски здоровья
  const healthBarWidth = 150;
  const healthBarHeight = 15;
  const healthPercentage = Math.max(0, playerState.health / 100);

  // Фон полоски здоровья
  context.fillStyle = 'rgba(0, 0, 0, 0.5)';
  context.fillRect(20, 80, healthBarWidth, healthBarHeight);

  // Сама полоска здоровья
  context.fillStyle = playerState.health > 30 ? 'green' : 'red';
  context.fillRect(20, 80, healthBarWidth * healthPercentage, healthBarHeight);


  // Отрисовываем активное оружие
  if (playerState?.weapon) {
    context.fillText(`Оружие: ${playerState.weapon.name}`, 20, 110);
  }

  // Отрисовка счета или других игровых параметров
  context.textAlign = 'right';
  context.fillStyle = 'white';
  context.fillText(`Счет: ${playerState.score}`, context.canvas.width - 20, 30);

  // Если игрок получает урон, показываем индикатор урона
  if (playerState?.damageTaken > 0) {
    const alpha = Math.min(0.7, playerState.damageTaken / 100);
    context.fillStyle = `rgba(255, 0, 0, ${alpha})`;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  // Восстанавливаем состояние контекста
  context.restore();
}